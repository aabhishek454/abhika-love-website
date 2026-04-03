import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const PLAYLIST = [
  { id: 1, title: 'Enna Sona', artist: 'Arijit Singh', src: '/songs/Enna Sona  ARRahman  OK Jaanu  Arijit Singh  Shraddha Kapoor  Aditya Roy  Gulzar  4K - Sony Music India.mp3', cover: '/images/cover.jpg' },
  { id: 2, title: 'Mere Hi Liye', artist: 'Aditya Rikhari', src: '/songs/Mere Hi Liye - Aditya Rikhari.mp3', cover: '/images/cover.jpg' },
  { id: 3, title: 'Tum Ho Paas Mere', artist: 'Mohit Chauhan', src: '/songs/Tum Ho Paas Mere - Lyrics Video  Rockstar  Mohit Chauhan - BeatupMuzic  हिन्दी.mp3', cover: '/images/cover.jpg' },
  { id: 4, title: 'Aziyat', artist: 'Pratyush Dhiman', src: '/songs/YTDown.com_YouTube_Aziyat-Pratyush-Dhiman-Official-Video-ft_Media_5k58kWEuwJQ_009_128k.mp3', cover: '/images/cover.jpg' },
  { id: 5, title: 'Pehla Pyaar', artist: 'Armaan Malik', src: '/songs/YTDown.com_YouTube_Full-Song-Pehla-Pyaar-Kabir-Singh-Shahid_Media_B7SkAq_94J8_009_128k.mp3', cover: '/images/cover.jpg' },
  { id: 6, title: 'Him & I', artist: 'G-Eazy & Halsey', src: '/songs/YTDown.com_YouTube_G-Eazy-_-Halsey-Him-_-I-Lyrics_Media_iTjdfI4It-Y_002_720p.mp4', cover: '/images/cover.jpg' },
  { id: 7, title: 'Kalank', artist: 'Arijit Singh', src: '/songs/YTDown.com_YouTube_Kalank-Arijit-Singh-Lyrics-Lyrical-Bam-H_Media_k6dGN3azeqo_002_720p.mp4', cover: '/images/cover.jpg' },
  { id: 8, title: 'Khat', artist: 'Navjot Ahuja', src: '/songs/YTDown.com_YouTube_Navjot-Ahuja-Khat-Official-Audio_Media_LUgpPmj6nR8_002_720p.mp4', cover: '/images/cover.jpg' },
];

const FloatingQuotes = ({ isPlaying }) => {
  const [currentQuote, setCurrentQuote] = useState("");
  const [offsetX, setOffsetX] = useState(0);
  
  useEffect(() => {
    if (!isPlaying) {
      setCurrentQuote("");
      return;
    }
    
    const quotes = [
      "I get lost in your eyes... ✨",
      "Every beat of my heart is yours... 💖",
      "You are my favorite song... 🎵",
      "Forever doesn't seem long enough... ♾️",
      "With you, I'm perfectly home... 🏡",
      "Your smile is my favorite melody... 💕",
      "Written in destiny... ✨",
      "My safe place... 🌙",
      "Just listening to this with you... 🎧",
      "Our love story in every chord... 🎶"
    ];

    // Trigger immediately
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setOffsetX((Math.random() - 0.5) * 200);

    const intervalId = setInterval(() => {
       setCurrentQuote("");
       setTimeout(() => {
         setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
         setOffsetX((Math.random() - 0.5) * 200);
       }, 500); 
    }, 4500);

    return () => clearInterval(intervalId);
  }, [isPlaying]);

  return (
    <AnimatePresence>
      {currentQuote && (
        <motion.div
           key={currentQuote} // Key forces remount/re-animation
           initial={{ opacity: 0, scale: 0.8, y: 0, x: offsetX }}
           animate={{ opacity: 1, scale: 1.2, y: -200, x: offsetX + (Math.random() > 0.5 ? 50 : -50) }}
           exit={{ opacity: 0, scale: 1, y: -300 }}
           transition={{ duration: 4, ease: 'easeOut' }}
           className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[300px] text-center pointer-events-none z-[100] text-love-pink font-semibold italic text-3xl drop-shadow-[0_0_15px_rgba(255,42,95,0.8)] tracking-wide"
        >
          {currentQuote}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        console.log("Audio file not found or playback prevented by browser.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSong((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
    }
  }, [currentSong]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const current = PLAYLIST[currentSong];

  return (
    <>
      <audio
        ref={audioRef}
        src={current.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
      />

      <FloatingQuotes isPlaying={isPlaying} />

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 z-[100] glass p-4 rounded-full text-white shadow-lg bg-love-pink/20 hover:bg-love-pink/40 border-love-pink/30 hover:border-love-pink"
          >
            <motion.div animate={isPlaying ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 1 }}>
               <Music className="w-6 h-6 text-love-pink" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[100] glass border-t border-love-pink/20 bg-[#0a0508]/80 backdrop-blur-xl"
          >
            <div className="max-w-6xl mx-auto px-2 md:px-4 py-3 flex items-center justify-between gap-2 md:gap-4">
              
              <div className="flex items-center gap-3 md:gap-4 flex-1 md:w-1/3 md:flex-none">
                <div className="w-14 h-14 bg-love-dark border border-love-pink/30 rounded-md overflow-hidden relative group cursor-pointer" onClick={() => setIsOpen(false)}>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs">Close</span>
                  </div>
                  <div className="w-full h-full bg-gradient-to-br from-love-pink/40 to-black/60 flex items-center justify-center">
                    <Heart className="text-love-pink w-6 h-6" fill="currentColor" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate text-sm md:text-base">{current.title}</h4>
                  <p className="text-white/50 text-xs truncate">{current.artist}</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                <div className="flex items-center gap-6">
                  <button onClick={prevSong} className="text-white/70 hover:text-white transition-colors">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 ml-0.5" /> : <Play className="w-5 h-5 ml-1" />}
                  </button>
                  <button onClick={nextSong} className="text-white/70 hover:text-white transition-colors">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full flex items-center gap-3 text-xs text-white/50">
                  <span>{formatTime(progress)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={progress}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-love-pink cursor-pointer"
                  />
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="w-1/3 flex items-center justify-end gap-3 hidden md:flex">
                <button onClick={() => setIsMuted(!isMuted)} className="text-white/70 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    if (Number(e.target.value) > 0) setIsMuted(false);
                  }}
                  className="w-24 h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white cursor-pointer"
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
