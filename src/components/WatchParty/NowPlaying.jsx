import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Heart } from 'lucide-react';

const NowPlaying = ({ state, emitEvent, user }) => {
  const { isPlaying, volume, queue } = state;

  const togglePlay = () => {
    if (isPlaying) {
      emitEvent('pause', { currentTime: state.currentTime });
    } else {
      emitEvent('play', { currentTime: state.currentTime });
    }
  };

  const handleNext = () => {
    emitEvent('trackEnded');
  };

  const handleVolume = (e) => {
    const newVol = parseInt(e.target.value);
    emitEvent('volumeChange', { volume: newVol });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-black/80 backdrop-blur-3xl border-t border-white/5 px-6 flex items-center justify-between z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 relative group overflow-hidden shadow-inner">
          <Heart className="w-7 h-7 text-pink-500/40 group-hover:text-pink-500 transition-colors fill-pink-500/10" />
          <div className="absolute inset-0 bg-pink-500/5 animate-pulse"></div>
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white truncate max-w-[200px]" 
              dangerouslySetInnerHTML={{ __html: state.currentTitle || 'Waiting for a song...' }}>
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-pink-400 uppercase tracking-widest font-bold">♥ Couple Sync Active</span>
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,77,109,0.8)]"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-8">
          <button className="text-slate-500 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <button 
            onClick={handleNext}
            className={`transition-colors ${queue?.length > 0 ? 'text-white hover:text-pink-500' : 'text-slate-700 pointer-events-none'}`}
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
        {/* Progress Bar (Visual) */}
        <div className="w-full max-w-md h-1 bg-white/5 rounded-full overflow-hidden relative group">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 w-[45%] shadow-[0_0_10px_rgba(255,77,109,0.5)]"></div>
        </div>
      </div>

      {/* Volume & Extras */}
      <div className="flex items-center justify-end gap-6 w-1/3">
        <div className="flex items-center gap-3 text-pink-200/70 group">
          <Volume2 className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume || 50} 
            onChange={handleVolume}
            className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 transition-all shadow-[0_0_10px_rgba(255,77,109,0.3)]"
          />
        </div>
      </div>
    </div>
  );
};

export default NowPlaying;
