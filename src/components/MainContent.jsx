import Hero from './Hero';
import LoveTimeline from './LoveTimeline';
import InteractiveElements from './InteractiveElements';
import LoveCounter from './LoveCounter';
import FuturePlans from './FuturePlans';
import PhotoGallery from './PhotoGallery';
import MusicPlayer from './MusicPlayer';
import Footer from './Footer';

export default function MainContent() {
  return (
    <div className="relative z-10 w-full min-h-screen pb-32 overflow-x-hidden">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-love-pink/20 rounded-full blur-[128px] opacity-50 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[128px] opacity-40 animate-pulse-slow object-right" />
      </div>

      <main className="flex flex-col gap-32">
        <Hero />
        <LoveCounter />
        <LoveTimeline />
        <InteractiveElements />
        <FuturePlans />
        <PhotoGallery />
      </main>

      <Footer />
      <MusicPlayer />
    </div>
  );
}
