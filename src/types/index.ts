// Core type definitions for Nuvio

export type SoundCategory = 'nature' | 'city' | 'work' | 'noise' | 'relaxation';

export interface Sound {
  id: string;
  name: string;
  category: SoundCategory;
  icon: string;
  audioUrl: string;
}

export interface SoundState {
  id: string;
  isPlaying: boolean;
  volume: number;
}

export interface TimerState {
  duration: number; // in milliseconds
  remaining: number;
  isActive: boolean;
}

export interface SavedMix {
  id: string;
  name: string;
  sounds: Array<{ id: string; volume: number }>;
  createdAt: number;
}

export interface AppState {
  sounds: Map<string, SoundState>;
  masterVolume: number;
  theme: 'light' | 'dark';
  timer: TimerState | null;
  savedMixes: SavedMix[];
  pausedSoundIds: string[]; // Track which sounds were playing before master pause
}
