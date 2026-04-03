import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Lock, Unlock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '1609') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-love-dark">
      {/* Background Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-love-pink"
            initial={{ 
              opacity: 0, 
              y: '100vh',
              x: `${Math.random() * 100}vw`,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              opacity: [0, 1, 0],
              y: '-20vh',
            }}
            transition={{ 
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          >
            <Heart size={40} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-6 z-10"
      >
        <motion.div
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-card p-10 flex flex-col items-center text-center space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-love-pink/20 p-4 rounded-full"
            >
              {password.length > 0 ? (
                <Unlock className="w-8 h-8 text-love-pink" />
              ) : (
                <Lock className="w-8 h-8 text-love-pink" />
              )}
            </motion.div>
            <div className="absolute -inset-2 bg-love-pink/10 rounded-full blur animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-wider">A & R</h1>
            <p className="text-white/60 text-sm">Enter the code to our hearts ✨</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                maxLength={10}
                className={cn(
                  "w-full bg-black/40 border-b-2 px-4 py-3 text-center text-2xl tracking-[0.5em] text-white focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:tracking-normal",
                  error ? "border-red-500 text-red-400" : "border-love-pink/50 focus:border-love-pink group-hover:border-love-pink/80"
                )}
                placeholder="Password"
              />
              {/* Optional: we can hide placeholder if tracking is weird by conditionally rendering placeholder text */}
            </div>

            <button
              type="submit"
              className={cn(
                "w-full py-4 rounded-xl font-medium tracking-wide transition-all duration-300 relative overflow-hidden group",
                error 
                  ? "bg-red-500/20 text-red-500 cursor-not-allowed" 
                  : "bg-love-pink hover:bg-love-pink-light text-white shadow-[0_0_20px_rgba(255,42,95,0.4)]"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Unlock Our Story
              </span>
              {!error && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
