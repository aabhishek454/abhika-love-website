import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="w-full pb-32 pt-20 px-4 text-center relative z-10 flex flex-col items-center justify-center border-t border-love-pink/20 mt-10">
      
      {/* WhatsApp Message Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 flex flex-col items-center"
      >
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-white tracking-wide">Missing me? 🥺</h3>
        <a 
          href="https://wa.me/918219287056" 
          target="_blank" 
          rel="noopener noreferrer"
          className="glass border border-[#25D366]/50 hover:bg-[#25D366]/20 transition-all duration-300 px-8 py-4 rounded-full flex items-center gap-3 group shadow-[0_0_20px_rgba(37,211,102,0.2)]"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
          <span className="font-semibold text-white tracking-wide">Message Me</span>
        </a>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
        <motion.div 
          whileHover={{ scale: 1.2, rotate: -15 }}
          className="text-6xl md:text-7xl cursor-pointer drop-shadow-[0_0_20px_rgba(255,42,95,0.4)]"
        >
          💋
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.2, rotate: 15 }}
          className="text-6xl md:text-7xl cursor-pointer drop-shadow-[0_0_20px_rgba(255,42,95,0.4)]"
        >
          ❤️
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.2, rotate: -15 }}
          className="text-6xl md:text-7xl cursor-pointer drop-shadow-[0_0_20px_rgba(255,42,95,0.4)]"
        >
          👄
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-white/90 font-medium text-xl leading-relaxed mb-2 font-serif">
          Made with infinite love <br className="md:hidden" /> for my Princess 👑
        </p>
        <p className="text-love-pink-light italic font-bold tracking-widest uppercase text-xs md:text-sm">
          Abhika ✨ Written in Destiny
        </p>
      </motion.div>
    </footer>
  );
}
