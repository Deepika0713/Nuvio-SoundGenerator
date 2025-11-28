import { useEffect, useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Header } from './components/Header';
import { SoundGrid } from './components/SoundGrid';
import { ControlBar } from './components/ControlBar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { soundCatalog } from './audio/soundCatalog';
import { getSoundManager } from './audio/audioEngine';
import { isStorageAvailable } from './storage/localStorage';
import './App.css';

function AppContent() {
  const { state } = useAppContext();
  const [storageWarning, setStorageWarning] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  // Unlock audio on first user interaction (critical for mobile browsers)
  useEffect(() => {
    if (audioUnlocked) return;

    const unlockAudio = async () => {
      const soundManager = getSoundManager();
      await soundManager.resumeContext();
      console.log('Audio context unlocked on user interaction');
      setAudioUnlocked(true);
    };

    // Listen for any user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, unlockAudio, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, [audioUnlocked]);

  useEffect(() => {
    // Check storage availability
    if (!isStorageAvailable()) {
      setStorageWarning(true);
      console.warn('Local storage is not available. Mix saving and theme persistence will be disabled.');
    }

    // Initialize sound manager and preload sounds
    const soundManager = getSoundManager();
    
    // Preload all sounds with better error handling
    const loadAllSounds = async () => {
      const loadPromises = soundCatalog.map(async (sound) => {
        try {
          await soundManager.loadSound(sound.id, sound.audioUrl);
          console.log(`Successfully loaded sound: ${sound.id}`);
        } catch (error) {
          console.error(`Failed to load sound ${sound.id}:`, error);
        }
      });
      
      await Promise.all(loadPromises);
      console.log('All sounds loaded. Audio context state:', soundManager.getContextState());
    };

    loadAllSounds();

    // Resume audio context if suspended (needed for mobile)
    soundManager.resumeContext();
  }, []);

  return (
    <div className="app">
      {storageWarning && (
        <div className="storage-warning" role="alert">
          ⚠️ Local storage is unavailable. Mix saving and theme persistence are disabled.
        </div>
      )}
      <Header />
      <SoundGrid />
      <Footer />
      <ControlBar />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
