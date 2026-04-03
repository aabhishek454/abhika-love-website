import { motion } from 'framer-motion';
import { Music, CarFront, Sunset, Home, Infinity } from 'lucide-react';

const plans = [
  { id: 1, text: "Doing a couple dance 💃🕺", icon: Music, color: "text-blue-400" },
  { id: 2, text: "Late night drives 🚗", icon: CarFront, color: "text-purple-400" },
  { id: 3, text: "Watching sunsets together 🌇", icon: Sunset, color: "text-orange-400" },
  { id: 4, text: "Building our dream home 🏡", icon: Home, color: "text-emerald-400" },
  { id: 5, text: "Forever together ♾️", icon: Infinity, color: "text-love-pink" },
];

export default function FuturePlans() {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto relative z-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-white">Our Future Dreams</h2>
        <p className="text-love-pink text-lg italic">Building a beautiful tomorrow</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`glass-card p-6 flex flex-col items-center justify-center text-center h-48 group ${index === 4 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className={`w-8 h-8 ${plan.color}`} />
              </div>
              <h3 className="text-xl font-medium text-white group-hover:text-love-pink-light transition-colors">
                {plan.text}
              </h3>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
