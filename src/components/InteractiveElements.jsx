import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Gift, Heart, X, Search, Activity, Users, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';

const loveReasons = [
  "Because your smile fixes everything.",
  "Because you are my peace in this chaotic world.",
  "Because your eyes hold galaxies.",
  "Because you understand me even when I don't speak.",
  "Because you make ordinary moments feel extraordinary.",
  "Because you support my wildest dreams.",
  "Because of the way you say my name.",
  "Because loving you is the easiest thing I've ever done.",
  "Because you are my favorite distraction.",
  "Because home is wherever you are.",
  "Because your laughter is my favorite song.",
  "Because you challenge me to be better.",
  "Because you remember the little things.",
  "Because you are inexplicably you.",
  "Because I can be entirely myself around you.",
  "Because your hugs heal my soul.",
  "Because you're my best friend.",
  "Because you light up every room you walk into.",
  "Because you forgive my flaws.",
  "Because you make me feel like I can fly.",
  "Because you are perfectly imperfect.",
  "Because waking up knowing you're mine is the best feeling.",
  "Because you bring out the child in me.",
  "Because you're my safe place.",
  "Because every love song reminds me of you.",
  "Because you kiss away my worries.",
  "Because we are a team.",
  "Because you look cute even when you're angry.",
  "Because you are the missing piece I never knew I needed.",
  "Because Abhika was literally written in destiny."
];

const surpriseMessages = [
  "You are the most beautiful person inside and out! 🌸",
  "I love you more than words can say! 💖",
  "You are my literal Princess! 👑",
  "Forever isn't long enough with you! ♾️",
  "You make my heart skip a beat every time! 💓"
];

const dateIdeas = [
  "Late night long drive with your favorite playlist 🚗🎶",
  "Cooking dinner together (even if it's messy!) 👩‍🍳👨‍🍳",
  "Stargazing on the roof with blankets 🌌",
  "Movie marathon with lots of snacks 🍿🎬",
  "Coffee date just to talk for hours ☕",
  "A quiet walk holding hands 🌙",
  "Re-creating our very first date ✨"
];

export default function InteractiveElements() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [surpriseMsg, setSurpriseMsg] = useState("");
  const [catchPos, setCatchPos] = useState({ x: 0, y: 0 });
  const [catchCount, setCatchCount] = useState(0);
  const [caught, setCaught] = useState(false);
  const [meterStatus, setMeterStatus] = useState(null); // null, 'scanning', 'done'
  const [meterValue, setMeterValue] = useState(0);
  const [hugActive, setHugActive] = useState(false);
  const [dateIdea, setDateIdea] = useState("");

  const handleSurprise = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff2a5f', '#ff7597', '#ffffff']
    });
    const randomMsg = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
    setSurpriseMsg(randomMsg);
    setTimeout(() => setSurpriseMsg(""), 5000); // Clear after 5s
  };

  const handleWhyILoveYou = () => {
    const randomReason = loveReasons[Math.floor(Math.random() * loveReasons.length)];
    setReason(randomReason);
  };

  const handleCatchHover = () => {
    if (catchCount < 5 && !caught) {
      setCatchPos({
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 150
      });
      setCatchCount(c => c + 1);
    }
  };

  const handleCatchClick = () => {
    if (catchCount >= 5 || caught) {
      setCaught(true);
      setCatchPos({ x: 0, y: 0 });
      confetti({ particleCount: 200, spread: 150, origin: { y: 0.5 } });
      setTimeout(() => {
        setCaught(false);
        setCatchCount(0);
      }, 5000);
    }
  };

  const handleMeter = () => {
    setMeterStatus('scanning');
    setMeterValue(0);
  };

  useEffect(() => {
    if (meterStatus === 'scanning') {
       const interval = setInterval(() => {
         setMeterValue(prev => {
           if (prev >= 1000) {
             clearInterval(interval);
             setMeterStatus('done');
             confetti({ particleCount: 100, spread: 360, origin: { y: 0.5 } });
             setTimeout(() => setMeterStatus(null), 5000);
             return 1000;
           }
           return prev + 50;
         });
       }, 50);
       return () => clearInterval(interval);
    }
  }, [meterStatus]);

  const handleHug = () => {
    setHugActive(true);
    confetti({ particleCount: 300, spread: 360, origin: { y: 0.5 }, colors: ['#ff2a5f', '#ffffff'] });
    setTimeout(() => setHugActive(false), 4000);
  };

  const handleDateIdea = () => {
    const randomDate = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
    setDateIdea(randomDate);
    setTimeout(() => setDateIdea(""), 5000);
  };

  return (
    <section className="py-20 px-4 relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-16">
      
      {/* 1. Secret Love Letter */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button 
          onClick={() => setIsLetterOpen(true)}
          className="glass-card px-8 py-6 flex items-center gap-4 text-white hover:border-love-pink transition-colors group cursor-pointer"
        >
          <Mail className="text-love-pink w-8 h-8 group-hover:animate-bounce" />
          <div className="text-left">
            <h3 className="font-semibold text-lg">Special Delivery</h3>
            <p className="text-white/60 text-sm">Open when you feel loved 💖</p>
          </div>
        </button>
      </motion.div>

      {/* Love Letter Modal */}
      <AnimatePresence>
        {isLetterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-[#1a0b12] border border-love-pink/30 p-8 rounded-2xl max-w-lg w-full relative shadow-[0_0_50px_rgba(255,42,95,0.2)]"
            >
              <button 
                onClick={() => setIsLetterOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6">
                <Heart className="w-10 h-10 text-love-pink mx-auto mb-2" fill="currentColor" />
                <h3 className="text-2xl font-serif text-white">My Dearest Radhika,</h3>
              </div>
              
              <div className="space-y-4 text-white/80 font-light leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scroll">
                <p>
                  From the moment you entered my life, everything changed. The colors got brighter, the songs sounded better, and suddenly, my future looked exactly like something I've always dreamed of.
                </p>
                <p>
                  You are not just my partner; you are my peace, my confidante, and my best friend. Every laugh we share, every quiet moment we spend together, forms a beautiful memory that I cherish deeply in my heart.
                </p>
                <p>
                  I promise to hold your hand through the storms, to be the reason behind your smile, and to love you unconditionally every single day. Destiny wrote our names together, and I couldn't be more grateful.
                </p>
                <p className="font-medium text-love-pink-light mt-6">
                  Forever Yours,<br/>Abhishek ❤️
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Multi-Buttons Row */}
      <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
        {/* 2. Surprise Button */}
        <div className="flex flex-col items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleSurprise}
            className="w-full md:w-64 glass-card py-6 flex flex-col items-center justify-center gap-3 text-white hover:border-love-pink transition-colors group"
          >
            <Gift className="text-love-pink w-8 h-8 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Tap for Surprise 💕</span>
          </motion.button>
          <AnimatePresence>
            {surpriseMsg && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-love-pink-light mt-4 text-center font-medium absolute translate-y-32"
              >
                {surpriseMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Why I Love You */}
        <div className="flex flex-col items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleWhyILoveYou}
            className="w-full md:w-64 glass-card py-6 flex flex-col items-center justify-center gap-3 text-white hover:border-love-pink transition-colors group"
          >
            <Heart className="text-love-pink w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Why I Love You</span>
          </motion.button>

          <AnimatePresence mode="wait">
            {reason && (
              <motion.div 
                key={reason}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center absolute translate-y-32 max-w-sm px-4"
              >
                <p className="text-white/90 italic p-3 glass rounded-xl border-l-4 border-l-love-pink">
                  "{reason}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New Cute Features Row */}
      <div className="flex flex-col md:flex-row gap-8 w-full justify-center mt-4">
        {/* 4. Catch My Heart */}
        <div className="flex flex-col items-center justify-center relative w-full md:w-64 h-32">
          <motion.div
            animate={{ x: catchPos.x, y: catchPos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute z-20"
          >
            <motion.button 
              onMouseEnter={handleCatchHover}
              onClick={handleCatchClick}
              whileHover={caught ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              className={`glass-card p-6 flex flex-col items-center justify-center gap-2 text-white hover:border-love-pink transition-colors group ${caught ? 'border-love-pink bg-love-pink/20' : ''}`}
            >
              <Heart className={`w-8 h-8 ${caught ? 'text-love-pink animate-pulse' : 'text-white'}`} fill={caught ? "currentColor" : "none"} />
              <span className="font-semibold">{caught ? "You caught my heart! 💖" : "Catch My Heart!"}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* 5. Compatibility Meter */}
        <div className="flex flex-col items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={meterStatus === null ? handleMeter : undefined}
            className="w-full md:w-64 glass-card py-6 flex flex-col items-center justify-center gap-3 text-white hover:border-love-pink transition-colors group"
          >
            <Activity className="text-love-pink w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Compatibility Meter</span>
          </motion.button>

          <AnimatePresence mode="wait">
            {meterStatus && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center absolute translate-y-32 w-full max-w-sm px-4"
              >
                <div className="glass rounded-xl p-4 border border-love-pink/30">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Abhika Scan...</span>
                    <span className="text-sm text-love-pink font-bold">{meterValue}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-love-pink h-2.5 rounded-full transition-all duration-75" style={{ width: `${Math.min(100, meterValue / 10)}%` }}></div>
                  </div>
                  {meterStatus === 'done' && (
                     <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3 text-love-pink-light font-bold text-xl drop-shadow-md">
                       1000% Soulmates! 💖
                     </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Row 3 - Hug & Date */}
      <div className="flex flex-col md:flex-row gap-8 w-full justify-center mt-4">
        
        {/* 6. Virtual Hug */}
        <div className="flex flex-col items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleHug}
            className="w-full md:w-64 glass-card py-6 flex flex-col items-center justify-center gap-3 text-white hover:border-love-pink transition-colors group"
          >
            <Users className="text-love-pink w-8 h-8 group-hover:-translate-y-1 transition-transform" />
            <span className="font-semibold">Send a Virtual Hug</span>
          </motion.button>
        </div>

        {/* 7. Date Idea Generator */}
        <div className="flex flex-col items-center">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleDateIdea}
            className="w-full md:w-64 glass-card py-6 flex flex-col items-center justify-center gap-3 text-white hover:border-love-pink transition-colors group"
          >
            <Coffee className="text-love-pink w-8 h-8 group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Next Date Idea</span>
          </motion.button>

          <AnimatePresence mode="wait">
            {dateIdea && (
              <motion.div 
                key={dateIdea}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center absolute translate-y-32 w-full max-w-sm px-4"
              >
                <div className="glass rounded-xl p-4 border border-love-pink/30">
                  <p className="text-white/90 italic text-sm md:text-base font-medium">✨ {dateIdea}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Full Screen Hug Overlay */}
      <AnimatePresence>
        {hugActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center bg-love-pink/10 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: "spring", duration: 1 }}
              className="text-center"
            >
              <div className="text-9xl mb-4 animate-bounce">🐻</div>
              <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,42,95,0.8)]">
                BIG SQUISHY HUG!!
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
