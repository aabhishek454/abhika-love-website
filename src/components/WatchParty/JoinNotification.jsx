import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Heart, X, Music } from 'lucide-react';
import { socket } from '../../lib/socket';

export default function JoinNotification({ onJoin, identity }) {
  const [partnerListening, setPartnerListening] = useState(null);

  useEffect(() => {
    const handlePartnerListening = ({ username }) => {
      // Only show if it's NOT us starting the session
      if (username !== identity) {
        setPartnerListening(username);
        // Auto-hide after 15 seconds
        setTimeout(() => setPartnerListening(null), 15000);
      }
    };

    socket.on('partner-listening', handlePartnerListening);

    return () => {
      socket.off('partner-listening', handlePartnerListening);
    };
  }, [identity]);

  return (
    <AnimatePresence>
      {partnerListening && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed bottom-24 right-6 z-[200] max-w-sm w-full"
        >
          <div className="bg-[#1a1a2e]/90 backdrop-blur-2xl border border-pink-500/30 rounded-3xl p-5 shadow-[0_0_40px_rgba(255,42,95,0.3)] relative overflow-hidden group">
            {/* Animated Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center relative">
                 <Music className="text-pink-500 w-7 h-7" />
                 <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-pink-500/20 rounded-2xl"
                 />
              </div>
              
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg leading-tight">
                  {partnerListening} is listening 🎧
                </h4>
                <p className="text-white/50 text-xs mt-1">Want to join the session?</p>
              </div>

              <button 
                onClick={() => setPartnerListening(null)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  onJoin();
                  setPartnerListening(null);
                }}
                className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Heart size={16} fill="currentColor" />
                Join Now
              </button>
            </div>

            {/* Micro heart particles */}
            <div className="absolute top-2 right-12 pointer-events-none">
               <motion.div animate={{ y: [0, -20], opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-pink-500/40 text-[10px]">❤️</motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
