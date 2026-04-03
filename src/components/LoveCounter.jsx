import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const START_DATE = new Date('2026-02-07T00:00:00').getTime();

export default function LoveCounter() {
  const [timePassed, setTimePassed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date().getTime();
      const diff = now - START_DATE;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimePassed({ days, hours, minutes, seconds });
      }
    };

    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timePassed.days },
    { label: 'Hours', value: timePassed.hours },
    { label: 'Minutes', value: timePassed.minutes },
    { label: 'Seconds', value: timePassed.seconds },
  ];

  return (
    <section className="py-20 px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h3 className="text-3xl md:text-4xl font-semibold mb-2 text-white">
          We've been together for
        </h3>
        <p className="text-love-pink mb-12 italic">Every second with you is a blessing.</p>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {timeBlocks.map((block, index) => (
            <motion.div
              key={block.label}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="glass-card w-24 h-24 md:w-32 md:h-32 flex flex-col items-center justify-center border-t border-white/20"
            >
              <span className="text-3xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                {block.value.toString().padStart(2, '0')}
              </span>
              <span className="text-xs md:text-sm text-love-pink mt-1 uppercase tracking-widest">
                {block.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
