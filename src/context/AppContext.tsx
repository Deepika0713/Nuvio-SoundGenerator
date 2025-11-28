import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, SoundState, TimerState, SavedMix } from '../types';
import { soundCatalog } from '../audio/soundCatalog';
import { DEFAULT_SOUND_VOLUME, DEFAULT_MASTER_VOLUME } from '../utils/constants';
import { saveTheme, saveMixes, loadTheme, loadMixes } from '../storage/localStorage';

// Action types
type AppAction =
  | { type: 'PLAY_SOUND'; payload: { id: string } }
  | { type: 'PAUSE_SOUND'; payload: { id: string } }
  | { type: 'SET_VOLUME'; payload: { id: string; volume: number } }
  | { type: 'SET_MASTER_VOLUME'; payload: { volume: number } }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: { theme: 'light' | 'dark' } }
  | { type: 'START_TIMER'; payload: { duration: number } }
  | { type: 'UPDATE_TIMER'; payload: { remaining: number } }
  | { type: 'CANCEL_TIMER' }
  | { type: 'TIMER_EXPIRED' }
  | { type: 'SAVE_MIX'; payload: { name: string } }
  | { type: 'LOAD_MIX'; payload: { mixId: string } }
  | { type: 'DELETE_MIX'; payload: { mixId: string } }
  | { type: 'MASTER_PAUSE' }
  | { type: 'MASTER_RESUME' }
  | { type: 'RESET' }
  | { type: 'STOP_ALL' };

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial state factory
function createInitialState(): AppState {
  const soundsMap = new Map<string, SoundState>();
  
  // Initialize all sounds from catalog with default values
  soundCatalog.forEach(sound => {
    soundsMap.set(sound.id, {
      id: sound.id,
      isPlaying: false,
      volume: DEFAULT_SOUND_VOLUME,
    });
  });

  // Load saved theme and mixes from localStorage
  const savedTheme = loadTheme();
  const savedMixes = loadMixes();

  return {
    sounds: soundsMap,
    masterVolume: DEFAULT_MASTER_VOLUME,
    theme: savedTheme || 'light',
    timer: null,
    savedMixes: savedMixes,
    pausedSoundIds: [],
  };
}

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'PLAY_SOUND': {
      const newSounds = new Map(state.sounds);
      const sound = newSounds.get(action.payload.id);
      if (sound) {
        newSounds.set(action.payload.id, { ...sound, isPlaying: true });
      }
      // Clear pausedSoundIds when individual sounds are manually played
      // This prevents stale state when master resume is clicked
      return { ...state, sounds: newSounds, pausedSoundIds: [] };
    }

    case 'PAUSE_SOUND': {
      const newSounds = new Map(state.sounds);
      const sound = newSounds.get(action.payload.id);
      if (sound) {
        newSounds.set(action.payload.id, { ...sound, isPlaying: false });
      }
      // Clear pausedSoundIds when individual sounds are manually paused
      // This prevents stale state when master resume is clicked
      return { ...state, sounds: newSounds, pausedSoundIds: [] };
    }

    case 'SET_VOLUME': {
      const newSounds = new Map(state.sounds);
      const sound = newSounds.get(action.payload.id);
      if (sound) {
        newSounds.set(action.payload.id, { ...sound, volume: action.payload.volume });
      }
      return { ...state, sounds: newSounds };
    }

    case 'SET_MASTER_VOLUME': {
      return { ...state, masterVolume: action.payload.volume };
    }

    case 'TOGGLE_THEME': {
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    }

    case 'SET_THEME': {
      return { ...state, theme: action.payload.theme };
    }

    case 'START_TIMER': {
      const timer: TimerState = {
        duration: action.payload.duration,
        remaining: action.payload.duration,
        isActive: true,
      };
      return { ...state, timer };
    }

    case 'UPDATE_TIMER': {
      if (!state.timer) return state;
      return {
        ...state,
        timer: { ...state.timer, remaining: action.payload.remaining },
      };
    }

    case 'CANCEL_TIMER': {
      return { ...state, timer: null };
    }

    case 'TIMER_EXPIRED': {
      // Stop all sounds and cancel timer
      const newSounds = new Map(state.sounds);
      newSounds.forEach((sound, id) => {
        if (sound.isPlaying) {
          newSounds.set(id, { ...sound, isPlaying: false });
        }
      });
      return { ...state, sounds: newSounds, timer: null };
    }

    case 'SAVE_MIX': {
      const activeSounds = Array.from(state.sounds.values())
        .filter(sound => sound.isPlaying || sound.volume !== DEFAULT_SOUND_VOLUME)
        .map(sound => ({ id: sound.id, volume: sound.volume }));

      const newMix: SavedMix = {
        id: `mix-${Date.now()}`,
        name: action.payload.name,
        sounds: activeSounds,
        createdAt: Date.now(),
      };

      return { ...state, savedMixes: [...state.savedMixes, newMix] };
    }

    case 'LOAD_MIX': {
      const mix = state.savedMixes.find(m => m.id === action.payload.mixId);
      if (!mix) return state;

      const newSounds = new Map(state.sounds);
      
      // Reset all sounds first
      newSounds.forEach((sound, id) => {
        newSounds.set(id, { ...sound, isPlaying: false, volume: DEFAULT_SOUND_VOLUME });
      });

      // Apply mix settings
      mix.sounds.forEach(mixSound => {
        const sound = newSounds.get(mixSound.id);
        if (sound) {
          newSounds.set(mixSound.id, { ...sound, volume: mixSound.volume });
        }
      });

      return { ...state, sounds: newSounds };
    }

    case 'DELETE_MIX': {
      return {
        ...state,
        savedMixes: state.savedMixes.filter(mix => mix.id !== action.payload.mixId),
      };
    }

    case 'MASTER_PAUSE': {
      const newSounds = new Map(state.sounds);
      const pausedIds: string[] = [];
      
      newSounds.forEach((sound, id) => {
        if (sound.isPlaying) {
          pausedIds.push(id);
          newSounds.set(id, { ...sound, isPlaying: false });
        }
      });
      
      return { ...state, sounds: newSounds, pausedSoundIds: pausedIds };
    }

    case 'MASTER_RESUME': {
      const newSounds = new Map(state.sounds);
      
      // Resume only the sounds that were playing before master pause
      state.pausedSoundIds.forEach(id => {
        const sound = newSounds.get(id);
        if (sound) {
          newSounds.set(id, { ...sound, isPlaying: true });
        }
      });
      
      return { ...state, sounds: newSounds, pausedSoundIds: [] };
    }

    case 'STOP_ALL': {
      const newSounds = new Map(state.sounds);
      newSounds.forEach((sound, id) => {
        if (sound.isPlaying) {
          newSounds.set(id, { ...sound, isPlaying: false });
        }
      });
      return { ...state, sounds: newSounds, timer: null, pausedSoundIds: [] };
    }

    case 'RESET': {
      // Reset to initial state but preserve theme and saved mixes
      const newSounds = new Map<string, SoundState>();
      soundCatalog.forEach(sound => {
        newSounds.set(sound.id, {
          id: sound.id,
          isPlaying: false,
          volume: DEFAULT_SOUND_VOLUME,
        });
      });

      return {
        ...state,
        sounds: newSounds,
        masterVolume: DEFAULT_MASTER_VOLUME,
        timer: null,
        pausedSoundIds: [],
      };
    }

    default:
      return state;
  }
}

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, createInitialState());

  // Persist theme changes to localStorage
  useEffect(() => {
    saveTheme(state.theme);
  }, [state.theme]);

  // Persist saved mixes to localStorage
  useEffect(() => {
    saveMixes(state.savedMixes);
  }, [state.savedMixes]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Export action creators for convenience
export const actions = {
  playSound: (id: string): AppAction => ({ type: 'PLAY_SOUND', payload: { id } }),
  pauseSound: (id: string): AppAction => ({ type: 'PAUSE_SOUND', payload: { id } }),
  setVolume: (id: string, volume: number): AppAction => ({ 
    type: 'SET_VOLUME', 
    payload: { id, volume } 
  }),
  setMasterVolume: (volume: number): AppAction => ({ 
    type: 'SET_MASTER_VOLUME', 
    payload: { volume } 
  }),
  toggleTheme: (): AppAction => ({ type: 'TOGGLE_THEME' }),
  setTheme: (theme: 'light' | 'dark'): AppAction => ({ 
    type: 'SET_THEME', 
    payload: { theme } 
  }),
  startTimer: (duration: number): AppAction => ({ 
    type: 'START_TIMER', 
    payload: { duration } 
  }),
  updateTimer: (remaining: number): AppAction => ({ 
    type: 'UPDATE_TIMER', 
    payload: { remaining } 
  }),
  cancelTimer: (): AppAction => ({ type: 'CANCEL_TIMER' }),
  timerExpired: (): AppAction => ({ type: 'TIMER_EXPIRED' }),
  saveMix: (name: string): AppAction => ({ type: 'SAVE_MIX', payload: { name } }),
  loadMix: (mixId: string): AppAction => ({ type: 'LOAD_MIX', payload: { mixId } }),
  deleteMix: (mixId: string): AppAction => ({ type: 'DELETE_MIX', payload: { mixId } }),
  masterPause: (): AppAction => ({ type: 'MASTER_PAUSE' }),
  masterResume: (): AppAction => ({ type: 'MASTER_RESUME' }),
  reset: (): AppAction => ({ type: 'RESET' }),
  stopAll: (): AppAction => ({ type: 'STOP_ALL' }),
};
