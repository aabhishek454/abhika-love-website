import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart } from 'lucide-react';

const Chat = ({ messages, emitEvent, user }) => {
  const [text, setText] = useState('');
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    emitEvent('sendMessage', { text });
    setText('');
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Sweet Chat</h2>
        <Heart className="w-4 h-4 text-pink-500 fill-pink-500/20" />
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages?.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.user === user ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                {msg.user}
              </span>
              <span className="text-[10px] text-slate-600">{msg.time}</span>
            </div>
            <div className={`
              max-w-[90%] p-3 rounded-2xl text-sm
              ${msg.user === user 
                ? 'bg-pink-600/20 text-white rounded-tr-none border border-pink-500/20' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'}
            `}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900/50 backdrop-blur-md">
        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Whisper something sweet..."
            className="w-full bg-slate-800 border border-white/10 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-pink-500/50 text-sm text-white"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-pink-600 text-white hover:bg-pink-500 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
