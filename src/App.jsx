import { useState } from 'react';
import LockScreen from './components/LockScreen';
import MainContent from './components/MainContent';
import CursorEffects from './components/CursorEffects';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <CursorEffects />
      {isAuthenticated ? (
        <MainContent />
      ) : (
        <LockScreen onUnlock={() => setIsAuthenticated(true)} />
      )}
    </>
  );
}

export default App;
