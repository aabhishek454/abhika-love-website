import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Heart, MoreHorizontal, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NowPlayingBar({ 
  currentSong, 
  isPlaying, 
  onTogglePlay, 
  onNext, 
  onPrev,
  progress,
  duration
}) {
  if (!currentSong) return null;

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const percent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[100] bg-[#050505]/95 backdrop-blur-3xl border-t border-white/5 py-3 md:py-4 px-4 md:px-10 flex items-center justify-between shadow-[0_-20px_50px_rgba(0,0,0,1)]"
    >
      {/* Mobile Progress Bar at top edge */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 md:hidden">
        <div className="h-full bg-pink-500 relative" style={{ width: `${percent}%` }}>
          <div className="absolute inset-0 bg-pink-500 blur-sm opacity-50" />
        </div>
      </div>

      {/* Left: Info */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 md:w-[30%] min-w-0 pr-4">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-2xl shrink-0 group relative">
          <img src={currentSong.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 bg-pink-500/10 mix-blend-overlay" />
        </div>
        <div className="min-w-0">
          <h4 className="text-white font-bold truncate text-sm md:text-base cursor-pointer hover:underline">{currentSong.title}</h4>
          <p className="text-white/50 text-xs truncate hover:text-white transition-colors cursor-pointer">{currentSong.channel}</p>
        </div>
        <button className="text-white/20 hover:text-pink-500 transition-colors shrink-0">
          <Heart size={18} />
        </button>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex items-center justify-end md:justify-center gap-4 md:flex-col md:flex-1 md:max-w-2xl">
        <div className="flex items-center gap-4 md:gap-8">
           <button onClick={onPrev} className="hidden md:block text-white/40 hover:text-white transition-colors"><SkipBack size={20} /></button>
           <motion.button 
             whileTap={{ scale: 0.9 }}
             onClick={onTogglePlay}
             className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] shrink-0"
           >
             {isPlaying ? <Pause size={20} className="text-black ml-0 md:w-6 md:h-6" /> : <Play size={20} className="text-black ml-1 md:w-6 md:h-6" />}
           </motion.button>
           <button onClick={onNext} className="hidden md:block text-white/40 hover:text-white transition-colors"><SkipForward size={20} /></button>
        </div>
        
        <div className="hidden md:flex w-full items-center gap-3 text-[10px] text-white/40 font-bold tabular-nums">
           <span>{formatTime(progress)}</span>
           <div className="flex-1 h-1.5 relative group cursor-pointer">
              <div className="absolute inset-0 bg-white/10 rounded-full" />
              <motion.div 
                className="absolute inset-y-0 left-0 bg-white rounded-full relative"
                style={{ width: `${percent}%` }}
              >
                 <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                 {/* Progress Glow */}
                 <div className="absolute inset-0 bg-pink-500 blur-md opacity-30" />
              </motion.div>
           </div>
           <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="w-[30%] flex items-center justify-end gap-6 text-white/40 hidden md:flex">
         <button className="hover:text-pink-400 transition-colors"><Maximize2 size={18} /></button>
         <button className="hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
         
         <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_8px_rgba(236,72,153,1)]" />
            <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">Live Sync</span>
         </div>
      </div>
    </motion.div>
  );
}
