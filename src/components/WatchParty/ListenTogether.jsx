import React, { useState, useEffect, useRef } from 'react';
import WatchParty from './WatchParty';
import { socket } from '../../lib/socket';

export default function ListenTogether({ identity, onClose }) {
  const roomId = 'abhika-couple'; // Unified room for the couple
  const [state, setState] = useState({
    currentVideoId: 'dQw4w9WgXcQ',
    currentTitle: 'Never Gonna Give You Up',
    isPlaying: false,
    currentTime: 0,
    volume: 50,
    queue: [],
    messages: [],
    localLastUpdated: Date.now()
  });

  useEffect(() => {
    socket.connect();
    socket.emit('join-room', { roomId });

    socket.on('initialState', (initialState) => {
      setState({ ...initialState, localLastUpdated: Date.now() });
    });

    socket.on('videoChanged', (newState) => {
      setState(prev => ({ ...prev, ...newState, localLastUpdated: Date.now() }));
    });

    socket.on('playerStateChange', (newState) => {
      setState(prev => ({ ...prev, ...newState, localLastUpdated: Date.now() }));
    });

    socket.on('volumeAction', ({ volume }) => {
      setState(prev => ({ ...prev, volume }));
    });

    socket.on('queueUpdate', (queue) => {
      setState(prev => ({ ...prev, queue }));
    });

    socket.on('receiveMessage', (message) => {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
    });

    return () => {
      socket.off('initialState');
      socket.off('videoChanged');
      socket.off('playerStateChange');
      socket.off('volumeAction');
      socket.off('queueUpdate');
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, []);

  const emitEvent = (event, data) => {
    socket.emit(event, { ...data, roomId, user: identity });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <WatchParty 
        user={identity} 
        state={state} 
        emitEvent={emitEvent} 
      />
      {/* Close button overlay */}
      <button 
        onClick={onClose}
        className="fixed top-4 right-4 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all backdrop-blur-md"
      >
        ✕ Close Music
      </button>
    </div>
  );
}
