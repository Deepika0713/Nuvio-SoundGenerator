/**
 * Local storage utilities for persisting application state
 */

import { SavedMix } from '../types';

// Storage keys
const STORAGE_KEYS = {
  THEME: 'nuvio-theme',
  SAVED_MIXES: 'nuvio-saved-mixes',
  LAST_STATE: 'nuvio-last-state',
} as const;

// Type definitions for storage
export type ThemeStorage = 'light' | 'dark';

export interface SavedMixesStorage {
  mixes: SavedMix[];
}

export interface LastStateStorage {
  masterVolume: number;
  soundStates: Array<{ id: string; volume: number }>;
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Save theme preference to localStorage
 */
export function saveTheme(theme: ThemeStorage): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
}

/**
 * Load theme preference from localStorage
 */
export function loadTheme(): ThemeStorage | null {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'light' || theme === 'dark') {
      return theme;
    }
    return null;
  } catch (error) {
    console.error('Failed to load theme:', error);
    return null;
  }
}

/**
 * Save mixes to localStorage
 */
export function saveMixes(mixes: SavedMix[]): void {
  try {
    const data: SavedMixesStorage = { mixes };
    localStorage.setItem(STORAGE_KEYS.SAVED_MIXES, JSON.stringify(data));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please delete some saved mixes.');
    }
    console.error('Failed to save mixes:', error);
    throw error;
  }
}

/**
 * Load mixes from localStorage
 */
export function loadMixes(): SavedMix[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_MIXES);
    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data) as SavedMixesStorage;
    
    // Validate data structure
    if (!parsed.mixes || !Array.isArray(parsed.mixes)) {
      console.warn('Invalid saved mixes data, returning empty array');
      return [];
    }

    // Validate each mix
    const validMixes = parsed.mixes.filter(mix => {
      return (
        mix &&
        typeof mix.id === 'string' &&
        typeof mix.name === 'string' &&
        Array.isArray(mix.sounds) &&
        typeof mix.createdAt === 'number'
      );
    });

    return validMixes;
  } catch (error) {
    console.error('Failed to load mixes:', error);
    return [];
  }
}

/**
 * Save last application state to localStorage
 */
export function saveLastState(state: LastStateStorage): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save last state:', error);
  }
}

/**
 * Load last application state from localStorage
 */
export function loadLastState(): LastStateStorage | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_STATE);
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data) as LastStateStorage;
    
    // Validate data structure
    if (
      typeof parsed.masterVolume !== 'number' ||
      !Array.isArray(parsed.soundStates)
    ) {
      console.warn('Invalid last state data');
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load last state:', error);
    return null;
  }
}

/**
 * Clear all application data from localStorage
 */
export function clearAllStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}
