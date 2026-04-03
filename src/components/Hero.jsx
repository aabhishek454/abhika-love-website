import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-4 text-center">
      {/* Floating background text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
      >
        <span className="text-[20vw] font-bold text-love-pink whitespace-nowrap -rotate-[10deg]">ABHIKA</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 flex flex-col items-center"
      >
        <h2 className="text-love-pink text-lg md:text-xl font-medium tracking-widest uppercase mb-4 opacity-80 decoration-slice">
          Written in Destiny ✨
        </h2>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight text-glow">
          Radhika <span className="text-love-pink heartbeat-anim inline-block">❤️</span> Abhishek
        </h1>
        
        <p className="text-white/60 text-lg md:text-xl max-w-2xl font-light italic mt-6">
          "In all the world, there is no heart for me like yours. 
          In all the world, there is no love for you like mine."
        </p>

        <motion.button
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: 'smooth'
            });
          }}
          className="mt-16 px-8 py-4 rounded-full glass border border-love-pink/30 hover:bg-love-pink/20 hover:border-love-pink/60 transition-all duration-300 text-love-pink-light tracking-wide flex items-center gap-2 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter Our Love Story
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </motion.button>
      </motion.div>
    </section>
  );
}
