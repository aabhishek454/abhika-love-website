import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

const Player = ({ videoId, isPlaying, currentTime, localLastUpdated, emitEvent, user, volume }) => {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const controlLock = useRef(false);

  // Sync state from props
  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    const player = playerRef.current;
    if (!player || typeof player.getCurrentTime !== 'function') return;
    
    try {
      // Play/Pause sync
      if (isPlaying) {
        if (typeof player.playVideo === 'function') player.playVideo();
      } else {
        if (typeof player.pauseVideo === 'function') player.pauseVideo();
      }

      // Time sync (drift check with expected time calculation)
      const playerTime = player.getCurrentTime();
      const timePassedSinceUpdate = (Date.now() - (localLastUpdated || Date.now())) / 1000;
      const expectedTime = isPlaying ? currentTime + timePassedSinceUpdate : currentTime;

      // Only seek if we are more than 2 seconds off to avoid jitter
      if (Math.abs(playerTime - expectedTime) > 2) {
        if (typeof player.seekTo === 'function') player.seekTo(expectedTime, true);
      }

      // Volume sync
      if (typeof player.setVolume === 'function') {
        player.setVolume(volume || 50);
      }
    } catch (e) {
      console.error('Playback sync error:', e);
    }
  }, [videoId, isPlaying, currentTime, isReady, volume, localLastUpdated]);

  const onReady = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
  };

  const handleStateChange = (event) => {
    if (controlLock.current) return;

    const player = event.target;
    if (!player || typeof player.getCurrentTime !== 'function') return;
    
    const newState = event.data;
    const time = player.getCurrentTime();

    // 1 = playing, 2 = paused, 0 = ended
    if (newState === 1 && !isPlaying) {
      lockControls();
      emitEvent('play', { currentTime: time });
    } else if (newState === 2 && isPlaying) {
      lockControls();
      emitEvent('pause', { currentTime: time });
    } else if (newState === 0) {
      lockControls();
      emitEvent('trackEnded');
    }
  };

  const lockControls = () => {
    controlLock.current = true;
    setTimeout(() => {
      controlLock.current = false;
    }, 2000);
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden glass shadow-2xl glow-pink ring-1 ring-white/10">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={handleStateChange}
        className="absolute inset-0"
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium">Readying the melody...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
