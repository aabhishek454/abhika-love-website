import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../../lib/socket';

export default function Chat({ roomId, username, partner }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleTyping = ({ username: typingUser }) => {
      if (typingUser === partner) setPartnerTyping(true);
    };

    const handleStopTyping = ({ username: typingUser }) => {
      if (typingUser === partner) setPartnerTyping(false);
    };

    socket.on('chat-message', handleMessage);
    socket.on('typing', handleTyping);
    socket.on('stop-typing', handleStopTyping);

    return () => {
      socket.off('chat-message', handleMessage);
      socket.off('typing', handleTyping);
      socket.off('stop-typing', handleStopTyping);
    };
  }, [partner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { roomId, username });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('stop-typing', { roomId, username });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && roomId) {
      socket.emit('send-message', { roomId, message: newMessage.trim(), username });
      setNewMessage('');
      
      // Stop typing immediately on send
      setIsTyping(false);
      socket.emit('stop-typing', { roomId, username });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
           <Heart size={16} className="text-pink-500 fill-current" />
           <h3 className="font-bold text-white tracking-wide">Our Chat</h3>
        </div>
        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
          {partner} & Me
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20 text-center gap-4">
            <Heart size={48} strokeWidth={1} className="opacity-20 translate-y-2" />
            <p className="text-sm italic italic">Start the conversation with love...</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === username;
            return (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-white/30 mb-1 px-2 font-medium">
                  {isMe ? 'Me' : msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm max-w-[90%] break-words shadow-lg ${
                    isMe
                      ? 'bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-tr-none'
                      : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            );
          })
        )}
        
        <AnimatePresence>
          {partnerTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-pink-400 text-[11px] italic font-medium ml-2 py-1"
            >
              <div className="flex gap-1">
                <span className="w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-0" />
                <span className="w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-150" />
                <span className="w-1 h-1 bg-pink-500 rounded-full animate-bounce delay-300" />
              </div>
              {partner} is typing...
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/5 relative">
        <div className="relative flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Write something sweet..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all backdrop-blur-md"
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-pink-400 transition-colors">
              <Smile size={18} />
            </button>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-rose-600 text-white disabled:opacity-30 shadow-lg"
          >
            <Send size={18} fill="currentColor" />
          </motion.button>
        </div>
      </form>
    </div>
  );
}
