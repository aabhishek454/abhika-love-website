import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function CursorEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e) => {
      const newHeart = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setHearts((prev) => [...prev, newHeart]);
      
      // Remove heart after animation
      setTimeout(() => {
        setHearts((prev) => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div 
        className="fixed w-4 h-4 rounded-full bg-love-pink/50 pointer-events-none z-50 blur-[2px] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
      <div 
        className="fixed w-10 h-10 rounded-full border border-love-pink/30 pointer-events-none z-50 transition-all duration-300 ease-out -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 1, scale: 0.5, x: heart.x, y: heart.y }}
            animate={{ 
              opacity: 0, 
              scale: 2,
              y: heart.y - 100, // Float up
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="fixed pointer-events-none z-50 text-love-pink -translate-x-1/2 -translate-y-1/2"
          >
            <Heart fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
