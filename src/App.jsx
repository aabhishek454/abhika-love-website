import { useState } from 'react';
import LockScreen from './components/LockScreen';
import MainContent from './components/MainContent';
import CursorEffects from './components/CursorEffects';
import BreakSlotScheduler from './components/BreakSlotScheduler';
import WatchParty from './components/WatchParty/WatchParty';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false); // Defaulting to normal app layout
  const [showWatchParty, setShowWatchParty] = useState(false);

  return (
    <>
      <CursorEffects />
      {showWatchParty && (
        <WatchParty onClose={() => setShowWatchParty(false)} />
      )}
      {showScheduler ? (
        <BreakSlotScheduler />
      ) : isAuthenticated ? (
        <MainContent />
      ) : (
        <LockScreen onUnlock={() => setIsAuthenticated(true)} />
      )}
      <div className="fixed bottom-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowWatchParty(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors flex flex-row items-center justify-center gap-2"
        >
          🍿 Watch Party
        </button>  
        <button
          onClick={() => setShowScheduler(!showScheduler)}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors"
        >
          {showScheduler ? '❤️ Love App' : '📅 Break Scheduler'}
        </button>
      </div>
    </>
  );
}

export default App;
