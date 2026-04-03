import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const photos = [
  { id: 1, src: '/images/WhatsApp Image 2026-04-03 at 11.57.44 PM.jpeg', rotation: -3 },
  { id: 2, src: '/images/WhatsApp Image 2026-04-03 at 11.57.45 PM (1).jpeg', rotation: 2 },
  { id: 3, src: '/images/WhatsApp Image 2026-04-03 at 11.57.45 PM (2).jpeg', rotation: -1 },
  { id: 4, src: '/images/WhatsApp Image 2026-04-03 at 11.57.45 PM.jpeg', rotation: 4 },
  { id: 5, src: '/images/WhatsApp Image 2026-04-03 at 11.57.46 PM (1).jpeg', rotation: -2 },
  { id: 6, src: '/images/WhatsApp Image 2026-04-03 at 11.57.46 PM.jpeg', rotation: 1 },
  { id: 7, src: '/images/WhatsApp Image 2026-04-03 at 11.57.47 PM (1).jpeg', rotation: -3 },
  { id: 8, src: '/images/WhatsApp Image 2026-04-03 at 11.57.47 PM (2).jpeg', rotation: 3 },
  { id: 9, src: '/images/WhatsApp Image 2026-04-03 at 11.57.47 PM.jpeg', rotation: -1 },
  { id: 10, src: '/images/WhatsApp Image 2026-04-03 at 11.57.48 PM.jpeg', rotation: 2 },
];

export default function PhotoGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto relative z-10 w-full mb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-white">Image Gallery</h2>
        <p className="text-love-pink text-lg italic">Our beautiful moments</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{ rotate: photo.rotation }}
            className="group relative"
          >
            <div 
              className="bg-white p-3 rounded shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-0"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="aspect-square bg-gray-200 overflow-hidden relative">
                {/* Image or fallback */}
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-red-100 flex items-center justify-center">
                  <span className="text-pink-300 font-medium opacity-50">Add {photo.src}</span>
                </div>
                {/* Try to load actual image, it will overlay the fallback if exists */}
                <img 
                  src={photo.src} 
                  alt={`Memory ${photo.id}`}
                  className="absolute inset-0 w-full h-full object-cover z-10 opacity-0 transition-opacity duration-300"
                  onLoad={(e) => e.target.classList.remove('opacity-0')}
                  onError={(e) => e.target.style.display = 'none'}
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="text-white w-8 h-8" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-zoom-out"
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[80vh] flex flex-col items-center cursor-default"
            >
              <div className="relative w-full aspect-auto h-full flex items-center justify-center">
                 <img 
                    src={selectedPhoto.src} 
                    alt={`Memory ${selectedPhoto.id}`}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="800" height="600" fill="%232a0d17"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="%23ff7597" text-anchor="middle">Image Not Found (Please add image to public/images/)</text></svg>'
                    }}
                  />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
