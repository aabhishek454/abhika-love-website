import React from 'react';
import { motion } from 'framer-motion';
import { Heart, User } from 'lucide-react';

export default function IdentitySelector({ onSelect }) {
  const identities = [
    { name: 'Abhishek', partner: 'Radhika', color: 'from-blue-500 to-indigo-600' },
    { name: 'Radhika', partner: 'Abhishek', color: 'from-pink-500 to-rose-600' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#1a1a2e] border border-pink-500/30 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden text-center"
      >
        {/* Background Decorative Elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block p-4 bg-pink-500/10 rounded-full mb-6"
        >
          <Heart className="w-10 h-10 text-pink-500" fill="currentColor" />
        </motion.div>

        <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Who are you?</h2>
        <p className="text-white/50 mb-10 text-lg italic">Welcome to our shared space 💕</p>

        <div className="grid grid-cols-2 gap-6 relative z-10">
          {identities.map((identity) => (
            <motion.button
              key={identity.name}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(identity.name)}
              className={`flex flex-col items-center gap-4 p-8 rounded-3xl bg-gradient-to-br ${identity.color} shadow-lg group relative overflow-hidden`}
            >
               <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                  <User className="text-white w-8 h-8" />
               </div>
               <span className="text-xl font-bold text-white tracking-wide">{identity.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
