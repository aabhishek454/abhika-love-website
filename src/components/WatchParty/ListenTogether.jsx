import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, LogOut, Radio
} from 'lucide-react';
import { socket } from '../../lib/socket';
import Chat from './Chat';
import SpotifySearch from './SpotifySearch';
import NowPlayingBar from './NowPlayingBar';

export default function ListenTogether({ onClose, identity }) {
  const roomId = 'abhika-couple';
  const partner = identity === 'Abhishek' ? 'Radhika' : 'Abhishek';
  
  const [isJoined, setIsJoined] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    id: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    channel: 'Rick Astley',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg'
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activePlayerName, setActivePlayerName] = useState('');
  const [toast, setToast] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  
  const playerRef = useRef(null);
  const ignoreNextEvent = useRef(false);
  const lockTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    socket.connect();
    socket.emit('join-room', { roomId });
    setIsJoined(true);
    socket.emit('start-listening', { username: identity });

    const handleRoomState = (state) => {
      if (state.videoId) {
         setCurrentSong(prev => ({ ...prev, id: state.videoId }));
      }
      if (playerRef.current) {
        if (state.isPlaying) {
          playerRef.current.internalPlayer.playVideo();
        } else {
          playerRef.current.internalPlayer.pauseVideo();
        }
        playerRef.current.internalPlayer.seekTo(state.currentTime, true);
      }
      setIsPlaying(state.isPlaying);
    };

    const handleSyncAction = ({ action, payload, lockDuration }) => {
      if (!playerRef.current) return;
      
      ignoreNextEvent.current = true;
      setIsLocked(true);
      
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = setTimeout(() => {
        setIsLocked(false);
        ignoreNextEvent.current = false;
      }, lockDuration || 2500);

      try {
        if (action === 'play') {
          playerRef.current.internalPlayer.playVideo();
          setIsPlaying(true);
          setActivePlayerName(payload.username);
        } else if (action === 'pause') {
          playerRef.current.internalPlayer.pauseVideo();
          setIsPlaying(false);
          setActivePlayerName('');
        } else if (action === 'seek') {
          playerRef.current.internalPlayer.seekTo(payload.currentTime, true);
        } else if (action === 'changeVideo') {
          setCurrentSong({
             id: payload.videoId,
             title: payload.title || 'Unknown Track',
             channel: payload.username || 'Shared Music',
             thumbnail: `https://img.youtube.com/vi/${payload.videoId}/0.jpg`
          });
          showToast(`${payload.username} changed the song 🎶`);
        }
      } catch (err) {
        console.error("Sync error", err);
      }
    };

    socket.on('room-state', handleRoomState);
    socket.on('sync-action', handleSyncAction);

    return () => {
      socket.off('room-state', handleRoomState);
      socket.off('sync-action', handleSyncAction);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // Update progress bar
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(async () => {
        if (playerRef.current) {
          const time = await playerRef.current.internalPlayer.getCurrentTime();
          const dur = await playerRef.current.internalPlayer.getDuration();
          setProgress(time);
          setDuration(dur);
          
          // Background sync time to server too
          socket.emit('sync-time', { roomId, currentTime: time });
        }
      }, 1000);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  const applyLocalLock = () => {
    setIsLocked(true);
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => setIsLocked(false), 2500);
  };

  const onReady = (event) => { playerRef.current = event.target; };

  const handleTogglePlay = async () => {
    if (isPlaying) {
        onPause();
    } else {
        onPlay();
    }
  };

  const onPlay = async () => {
    if (isLocked || ignoreNextEvent.current) return;
    applyLocalLock();
    const time = await playerRef.current.internalPlayer.getCurrentTime();
    socket.emit('sync-action', { 
      roomId, 
      action: 'play', 
      payload: { currentTime: time, username: identity } 
    });
    setIsPlaying(true);
    setActivePlayerName(identity);
  };

  const onPause = async () => {
    if (isLocked || ignoreNextEvent.current) return;
    applyLocalLock();
    const time = await playerRef.current.internalPlayer.getCurrentTime();
    socket.emit('sync-action', { 
      roomId, 
      action: 'pause', 
      payload: { currentTime: time, username: identity } 
    });
    setIsPlaying(false);
    setActivePlayerName('');
  };

  const onSelectSong = (video) => {
    applyLocalLock();
    setCurrentSong({
        id: video.id,
        title: video.title,
        channel: video.channel,
        thumbnail: video.thumbnail
    });
    socket.emit('sync-action', { 
      roomId, 
      action: 'changeVideo', 
      payload: { 
        videoId: video.id, 
        title: video.title, 
        username: identity 
      } 
    });
    showToast(`You changed the song 🎶`);
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      controls: 0, // In-app controls only
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] bg-[#050505] flex overflow-hidden font-sans"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/10 via-black to-purple-900/10 opacity-60" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10 pb-[100px]">
        <header className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <motion.div 
              animate={{ scale: isPlaying ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 md:w-10 md:h-10 bg-love-pink/20 rounded-full flex items-center justify-center border border-love-pink/30 shrink-0"
            >
              <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isPlaying ? 'text-love-pink fill-current' : 'text-love-pink/60'}`} />
            </motion.div>
            <h1 className="text-base md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 leading-tight">
                {isPlaying && activePlayerName 
                  ? `${activePlayerName} is playing for ${partner} 🤍`
                  : `Listening together`}
            </h1>
          </div>
          <button onClick={onClose} className="p-2 md:p-3 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all shrink-0"><LogOut size={18} /></button>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-8 px-4 md:px-8 pb-4 md:pb-8 overflow-hidden">
          {/* Left: Player Section */}
          <div className="w-full lg:flex-[1.5] h-[30vh] lg:h-auto flex flex-col shrink-0">
             <div className="flex-1 bg-white/5 rounded-2xl md:rounded-[2.5rem] border border-white/5 overflow-hidden relative group shadow-2xl">
                <div className={`absolute inset-0 transition-all duration-700 ${isLocked ? 'blur-md scale-95 opacity-50' : ''}`}>
                    <YouTube
                      videoId={currentSong.id}
                      opts={opts}
                      onReady={onReady}
                      onPlay={onPlay}
                      onPause={onPause}
                      className="w-full h-full pointer-events-none" // Disable direct clicking to avoid redirects
                    />
                </div>
                {/* Visual Overlay for Playback State */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                       <Radio className="w-12 h-12 text-white/20 animate-pulse" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {isLocked && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 z-20">
                    <div className="w-1.5 h-1.5 rounded-full bg-love-pink animate-pulse" />
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Syncing Player...</span>
                  </div>
                )}
             </div>
          </div>

          {/* Right: Search / Chat Panel */}
          <aside className="flex-1 flex flex-col overflow-hidden bg-[#121212]/40 backdrop-blur-2xl rounded-2xl md:rounded-[2.5rem] border border-white/5 shadow-2xl relative mb-24 md:mb-0">
             <div className="flex items-center px-4 md:px-6 pt-4 pb-2 border-b border-white/10 shrink-0 gap-6">
                <button 
                  onClick={() => setActiveTab('search')}
                  className={`pb-2 text-xs md:text-sm font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'search' ? 'border-pink-500 text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}
                >
                  Playlist
                </button>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`pb-2 text-xs md:text-sm font-bold tracking-widest uppercase transition-all border-b-2 flex items-center gap-2 ${activeTab === 'chat' ? 'border-pink-500 text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}
                >
                  Messages
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse block" />
                </button>
             </div>

             <div className="flex-1 overflow-hidden relative">
                {activeTab === 'search' ? (
                  <div className="absolute inset-0"><SpotifySearch onSelect={onSelectSong} /></div>
                ) : (
                  <div className="absolute inset-0 flex flex-col"><Chat roomId={roomId} username={identity} partner={partner} /></div>
                )}
             </div>
          </aside>
        </main>

        <AnimatePresence>
          {toast && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-[120px] left-10 z-[120] bg-love-pink text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
              <span className="font-bold text-sm">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Chat Overlay button (optional if room) */}
      </div>

      <NowPlayingBar 
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={() => {}}
        onPrev={() => {}}
        progress={progress}
        duration={duration}
      />
    </motion.div>
  );
}
