import { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import MainContent from './components/MainContent';
import CursorEffects from './components/CursorEffects';
import BreakSlotScheduler from './components/BreakSlotScheduler';
import ListenTogether from './components/WatchParty/ListenTogether';
import IdentitySelector from './components/WatchParty/IdentitySelector';
import JoinNotification from './components/WatchParty/JoinNotification';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showListenTogether, setShowListenTogether] = useState(false);
  const [identity, setIdentity] = useState(localStorage.getItem('user_identity') || '');
  const [showIdentitySelector, setShowIdentitySelector] = useState(false);

  const handleOpenListenTogether = () => {
    if (!identity) {
      setShowIdentitySelector(true);
    } else {
      setShowListenTogether(true);
    }
  };

  const handleSelectIdentity = (selectedIdentity) => {
    setIdentity(selectedIdentity);
    localStorage.setItem('user_identity', selectedIdentity);
    setShowIdentitySelector(false);
    setShowListenTogether(true);
  };

  return (
    <>
      <CursorEffects />
      
      {/* Listen Together Experience */}
      {showListenTogether && identity && (
        <ListenTogether 
          identity={identity} 
          onClose={() => setShowListenTogether(false)} 
        />
      )}

      {/* Identity Selection Modal */}
      {showIdentitySelector && (
        <IdentitySelector onSelect={handleSelectIdentity} />
      )}

      {/* Global Join Notification */}
      {isAuthenticated && identity && !showListenTogether && (
        <JoinNotification 
          identity={identity} 
          onJoin={() => setShowListenTogether(true)} 
        />
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
          onClick={handleOpenListenTogether}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-[0_0_20px_rgba(219,39,119,0.5)] text-white px-5 py-2.5 rounded-full shadow-lg transition-all flex flex-row items-center justify-center gap-2 font-medium active:scale-95"
        >
          <span className="text-lg">🎧</span> Listen Together
        </button>  
        <button
          onClick={() => setShowScheduler(!showScheduler)}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 text-white px-5 py-2.5 rounded-full shadow-lg transition-all font-medium active:scale-95"
        >
          {showScheduler ? '❤️ Love App' : '📅 Break Scheduler'}
        </button>
      </div>
    </>
  );
}

export default App;
