import React, { useMemo } from 'react';
import Player from './Player';
import Search from './Search';
import Chat from './Chat';
import NowPlaying from './NowPlaying';
import { Heart } from 'lucide-react';

const WatchParty = ({ user, state, emitEvent }) => {
  const partner = user === 'Abhishek' ? 'Radhika' : 'Abhishek';

  // Generate random hearts for the premium couple theme
  const hearts = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${10 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${1 + Math.random() * 1.5}rem`,
      icon: Math.random() > 0.5 ? '❤️' : '💕'
    }));
  }, []);

  return (
    <div className="flex flex-col h-screen text-slate-200 overflow-hidden bg-[#050505] relative">
      {/* Floating Love Animations */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {hearts.map(h => (
          <div 
            key={h.id} 
            className="floating-heart" 
            style={{ 
              left: h.left, 
              animationDuration: h.animationDuration,
              animationDelay: h.animationDelay,
              fontSize: h.fontSize
            }}
          >
            {h.icon}
          </div>
        ))}
      </div>
      
      {/* Background Dimming over animations */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Header */}
      <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-pink-500 animate-pulse fill-pink-500/20" />
          <h1 className="text-xl font-bold tracking-tight">
            Listening with <span className="text-pink-500">{partner}</span> 💕
          </h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Hey, {user}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Column: Player & Queue */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
            <div className="max-w-4xl mx-auto w-full space-y-8 pb-32">
              {/* Player Section */}
              <Player 
                videoId={state.currentVideoId} 
                isPlaying={state.isPlaying} 
                currentTime={state.currentTime}
                localLastUpdated={state.localLastUpdated}
                volume={state.volume}
                emitEvent={emitEvent}
                user={user}
              />
              
              {/* Search Section */}
              <Search emitEvent={emitEvent} />

              {/* Queue Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-400">
                  <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                  Up Next ({state.queue?.length || 0})
                </h2>
                <div className="grid gap-3">
                  {state.queue?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4 min-w-0">
                        <img src={item.thumbnail} alt="" className="w-16 aspect-video object-cover rounded-md" />
                        <span className="truncate text-sm font-medium">{item.title}</span>
                      </div>
                      <button 
                        onClick={() => emitEvent('removeFromQueue', { id: item.id })}
                        className="p-2 text-slate-500 hover:text-red-400 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {(!state.queue || state.queue.length === 0) && (
                    <p className="text-sm text-slate-600 italic">No songs in queue. Add some!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Chat (Stacks below on mobile, sidebar on desktop) */}
        <aside className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 bg-slate-900/40 backdrop-blur-xl h-[400px] lg:h-auto">
          <Chat 
            messages={state.messages} 
            emitEvent={emitEvent} 
            user={user} 
          />
        </aside>
      </div>

      {/* Footer / Now Playing */}
      <footer className="h-24 flex-shrink-0 z-30">
        <NowPlaying 
          state={state} 
          emitEvent={emitEvent}
          user={user}
        />
      </footer>
    </div>
  );
};

export default WatchParty;
