import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { socket } from '../../lib/socket';

export default function Chat({ roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('chat-message', handleMessage);

    return () => {
      socket.off('chat-message', handleMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && roomId) {
      socket.emit('send-message', { roomId, message: newMessage.trim(), username });
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl">
      <div className="bg-pink-600/20 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-white/90">Room Chat</h3>
        <span className="text-xs text-white/50 bg-black/20 px-2 py-1 rounded-full">
          {messages.length} msgs
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/40 text-sm italic">
            No messages yet. Say hi!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === username;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-white/50 mb-1 px-1">
                  {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`px-3 py-2 rounded-2xl text-sm max-w-[85%] break-words ${
                    isMe
                      ? 'bg-pink-600 text-white rounded-tr-sm'
                      : 'bg-white/10 text-white/90 rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 bg-black/20 border-t border-white/10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-1 w-8 h-8 flex items-center justify-center rounded-full bg-pink-600 hover:bg-pink-500 text-white disabled:opacity-50 disabled:hover:bg-pink-600 transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
