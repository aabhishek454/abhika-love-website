import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipForward, Users, LogOut, Link as LinkIcon } from 'lucide-react';
import { socket } from '../../lib/socket';
import Chat from './Chat';

// Regex to extract YouTube video ID
const extractVideoId = (url) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

export default function WatchParty({ onClose, initialUsername }) {
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState(initialUsername || `User_${Math.floor(Math.random() * 1000)}`);
  
  const [videoId, setVideoId] = useState('dQw4w9WgXcQ');
  const [videoInput, setVideoInput] = useState('');
  
  const playerRef = useRef(null);
  const ignoreNextEvent = useRef(false);
  const syncInterval = useRef(null);
  const lockTimeoutRef = useRef(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Socket event listeners
    const handleRoomState = (state) => {
      setVideoId(state.videoId);
      if (playerRef.current) {
        if (state.isPlaying) {
            playerRef.current.internalPlayer.playVideo();
        } else {
            playerRef.current.internalPlayer.pauseVideo();
        }
        playerRef.current.internalPlayer.seekTo(state.currentTime, true);
      }
    };

    const handleSyncAction = ({ action, payload, lockDuration }) => {
      if (!playerRef.current) return;
      
      ignoreNextEvent.current = true; // Prevent echo back to server
      setIsLocked(true); // Lock manual controls
      
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = setTimeout(() => {
          setIsLocked(false);
          ignoreNextEvent.current = false;
      }, lockDuration || 2500);

      try {
          if (action === 'play') {
            playerRef.current.internalPlayer.playVideo();
            if (payload && payload.currentTime !== undefined) {
                 playerRef.current.internalPlayer.seekTo(payload.currentTime, true);
            }
          } else if (action === 'pause') {
            playerRef.current.internalPlayer.pauseVideo();
             if (payload && payload.currentTime !== undefined) {
                 playerRef.current.internalPlayer.seekTo(payload.currentTime, true);
             }
          } else if (action === 'seek') {
            playerRef.current.internalPlayer.seekTo(payload.currentTime, true);
          } else if (action === 'changeVideo') {
             setVideoId(payload.videoId);
          }
      } catch (err) {
          console.error("Player sync error", err);
      }
    };

    socket.on('room-state', handleRoomState);
    socket.on('sync-action', handleSyncAction);

    return () => {
      socket.off('room-state', handleRoomState);
      socket.off('sync-action', handleSyncAction);
      if (syncInterval.current) clearInterval(syncInterval.current);
    };
  }, []);


  const handleJoin = (e) => {
    e.preventDefault();
    if (roomId.trim() && username.trim()) {
      socket.connect();
      socket.emit('join-room', { roomId });
      setIsJoined(true);
      
      // Periodically sync time to server to help late joiners later
      syncInterval.current = setInterval(async () => {
          if (playerRef.current && playerRef.current.internalPlayer) {
              try {
                  const state = await playerRef.current.internalPlayer.getPlayerState();
                  if (state === YouTube.PlayerState.PLAYING) {
                      const time = await playerRef.current.internalPlayer.getCurrentTime();
                      socket.emit('sync-time', { roomId, currentTime: time });
                  }
              } catch(e) {}
          }
      }, 5000);
    }
  };

  const handleLeave = () => {
    socket.disconnect();
    setIsJoined(false);
    if (syncInterval.current) clearInterval(syncInterval.current);
    onClose();
  };

  // Player Event Handlers
  const applyLocalLock = () => {
    setIsLocked(true);
    if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    lockTimeoutRef.current = setTimeout(() => {
        setIsLocked(false);
    }, 2500);
  };

  const onReady = (event) => {
    playerRef.current = event.target;
  };

  const onPlay = async () => {
    if (isLocked || ignoreNextEvent.current) {
      if (isLocked) {
        // Force player back to pause if they tried to play while locked
        ignoreNextEvent.current = true;
        try { playerRef.current.internalPlayer.pauseVideo(); } catch(e) {}
        setTimeout(() => { ignoreNextEvent.current = false; }, 500);
      }
      return;
    }
    
    applyLocalLock();
    try {
        const time = await playerRef.current.internalPlayer.getCurrentTime();
        socket.emit('sync-action', { roomId, action: 'play', payload: { currentTime: time } });
    } catch(e) {}
  };

  const onPause = async () => {
    if (isLocked || ignoreNextEvent.current) {
      if (isLocked) {
        // Force player back to play if they tried to pause while locked
        ignoreNextEvent.current = true;
        try { playerRef.current.internalPlayer.playVideo(); } catch(e) {}
        setTimeout(() => { ignoreNextEvent.current = false; }, 500);
      }
      return;
    }
    
    applyLocalLock();
    try {
        const time = await playerRef.current.internalPlayer.getCurrentTime();
        socket.emit('sync-action', { roomId, action: 'pause', payload: { currentTime: time } });
    } catch(e) {}
  };
  
  const onStateChange = async (event) => {
      // YouTube.PlayerState.BUFFERING = 3
      if (event.data === YouTube.PlayerState.BUFFERING && !ignoreNextEvent.current) {
         if (isLocked) return;
         
         applyLocalLock();
         try {
             const time = await playerRef.current.internalPlayer.getCurrentTime();
             socket.emit('sync-action', { roomId, action: 'seek', payload: { currentTime: time } });
         } catch(e) {}
      }
  }

  const handleVideoChange = (e) => {
    e.preventDefault();
    const extractedId = extractVideoId(videoInput);
    if (extractedId) {
      setVideoId(extractedId);
      socket.emit('sync-action', { roomId, action: 'changeVideo', payload: { videoId: extractedId } });
      setVideoInput('');
    } else {
      alert('Invalid YouTube URL');
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      disablekb: 0, // Allow keyboard controls
    },
  };

  if (!isJoined) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-[#1a1a2e] border border-pink-500/30 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
             {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl" />
            
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                aria-label="Close"
            >
                <LogOut size={20} />
            </button>

            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-6 text-center">
                Watch Party
            </h2>
            
            <form onSubmit={handleJoin} className="space-y-4 relative z-10">
                <div>
                <label className="block text-sm text-pink-200 mb-1">Your Name</label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/30 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="Enter your name"
                />
                </div>
                <div>
                <label className="block text-sm text-pink-200 mb-1">Room ID</label>
                <input
                    type="text"
                    required
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full bg-black/30 border border-pink-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                    placeholder="e.g. 'movie-night', 'lofi'"
                />
                </div>
                <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl py-3 mt-4 hover:shadow-[0_0_20px_rgba(219,39,119,0.5)] transition-all active:scale-95"
                >
                Join Room
                </button>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f1a] flex flex-col md:flex-row">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col h-[50vh] md:h-full relative overflow-hidden">
         {/* Top Bar inside Video Area */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center">
           <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
               <Users size={16} className="text-pink-400" />
               <span className="text-white/90 text-sm font-medium">Room: <span className="text-pink-400">{roomId}</span></span>
           </div>
           
           <button
             onClick={handleLeave}
             className="flex items-center gap-2 bg-white/10 hover:bg-red-500/20 text-white px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-colors group"
           >
             <span className="text-sm font-medium">Leave</span>
             <LogOut size={16} className="group-hover:text-red-400" />
           </button>
        </div>

        {/* Video Player wrapper to maintain aspect ratio and fill space */}
        <div className="flex-1 w-full bg-black flex items-center justify-center relative">
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isLocked ? 'pointer-events-none opacity-80' : ''}`}>
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onReady}
                    onPlay={onPlay}
                    onPause={onPause}
                    onStateChange={onStateChange}
                    className="w-full h-full"
                    iframeClassName="w-full h-full border-none"
                    style={{ pointerEvents: isLocked ? 'none' : 'auto' }}
                />
            </div>
            {isLocked && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-pink-500/80 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg flex items-center gap-2 z-20">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                Syncing Player...
              </div>
            )}
        </div>

        {/* Bottom Control Bar */}
        <div className="p-4 bg-black/60 backdrop-blur-md border-t border-white/10 sm:p-6 shrink-0">
             <form onSubmit={handleVideoChange} className="flex gap-2 max-w-2xl mx-auto">
                <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="text"
                        value={videoInput}
                        onChange={(e) => setVideoInput(e.target.value)}
                        placeholder="Paste YouTube URL to change video for everyone..."
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!videoInput.trim()}
                    className="bg-white/10 hover:bg-pink-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-white/10"
                >
                    Play
                </button>
             </form>
        </div>
      </div>

      {/* Side Chat Panel */}
      <div className="w-full md:w-80 lg:w-96 h-[50vh] md:h-full shrink-0 border-l border-white/10 bg-[#161625] flex flex-col p-4 md:p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
          <Chat roomId={roomId} username={username} />
      </div>
    </div>
  );
}
