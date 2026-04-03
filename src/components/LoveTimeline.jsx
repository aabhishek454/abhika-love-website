import { motion } from 'framer-motion';
import { MessageCircle, Phone, HeartPulse, ShieldAlert, Sparkles, Infinity } from 'lucide-react';

const timelineEvents = [
  {
    id: 1,
    title: "First Conversation 💬",
    date: "A chat that started it all",
    description: "Who knew a simple 'hi' would lead to 'forever'?",
    icon: MessageCircle
  },
  {
    id: 2,
    title: "First Call 📞",
    date: "Hearing your voice",
    description: "Hours felt like minutes, and my heart knew it had found home.",
    icon: Phone
  },
  {
    id: 3,
    title: "First Meet ❤️",
    date: "When eyes met",
    description: "The moment time stood still and the world faded away.",
    icon: HeartPulse
  },
  {
    id: 4,
    title: "First Fight 😅",
    date: "Growing stronger",
    description: "Because what's a love story without a little drama?",
    icon: ShieldAlert
  },
  {
    id: 5,
    title: "Special Memory ✨",
    date: "Unforgettable",
    description: "Every moment with you is special, but this one has a permanent place in my heart.",
    icon: Sparkles
  },
  {
    id: 6,
    title: "Forever Begins Here ♾️",
    date: "February 7, 2026",
    description: "The day 'You and I' officially became 'We'. Our beautiful journey starts here.",
    icon: Infinity
  }
];

export default function LoveTimeline() {
  return (
    <section className="py-20 px-4 max-w-5xl mx-auto relative z-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-white">Our Journey</h2>
        <p className="text-love-pink text-lg italic">Every step led me to you.</p>
      </motion.div>

      <div className="relative">
        {/* Center Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-love-pink-light via-love-pink to-transparent hidden md:block" />

        <div className="space-y-12">
          {timelineEvents.map((event, index) => {
            const isEven = index % 2 === 0;
            const Icon = event.icon;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row items-center justify-between w-full ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Desktop Empty Space */}
                <div className="hidden md:block md:w-5/12" />

                {/* Timeline Node */}
                <div className="md:w-2/12 flex justify-center z-10 my-4 md:my-0">
                  <div className="w-14 h-14 rounded-full bg-love-dark border-4 border-love-pink flex items-center justify-center shadow-[0_0_20px_rgba(255,42,95,0.4)]">
                    <Icon className="w-6 h-6 text-love-pink-light" />
                  </div>
                </div>

                {/* Content */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="w-full md:w-5/12 glass-card p-6 border-t border-love-pink/30 hover:border-love-pink transition-colors relative"
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-love-dark border-r-2 border-b-2 border-love-pink/30 transform rotate-45 hidden md:block ${isEven ? 'right-[-8px] border-t-0 border-l-0' : 'left-[-8px] border-b-0 border-r-0 border-t-2 border-l-2'}`} />
                  
                  <span className="text-sm text-love-pink-light font-bold tracking-wider uppercase mb-1 block">
                    {event.date}
                  </span>
                  <h3 className="text-xl font-medium text-white mb-2">{event.title}</h3>
                  <p className="text-white/70 font-light leading-relaxed">
                    {event.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
