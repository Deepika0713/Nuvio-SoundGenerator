import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveTheme,
  loadTheme,
  saveMixes,
  loadMixes,
  saveLastState,
  loadLastState,
  clearAllStorage,
  isStorageAvailable,
} from './localStorage';
import { SavedMix } from '../types';

describe('localStorage utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });
  });

  describe('Theme persistence', () => {
    it('should save and load light theme', () => {
      saveTheme('light');
      expect(loadTheme()).toBe('light');
    });

    it('should save and load dark theme', () => {
      saveTheme('dark');
      expect(loadTheme()).toBe('dark');
    });

    it('should return null when no theme is saved', () => {
      expect(loadTheme()).toBe(null);
    });

    it('should return null for invalid theme data', () => {
      localStorage.setItem('nuvio-theme', 'invalid');
      expect(loadTheme()).toBe(null);
    });
  });

  describe('Mix persistence', () => {
    const mockMix: SavedMix = {
      id: 'mix-1',
      name: 'Test Mix',
      sounds: [
        { id: 'rain', volume: 0.5 },
        { id: 'ocean', volume: 0.7 },
      ],
      createdAt: Date.now(),
    };

    it('should save and load mixes', () => {
      saveMixes([mockMix]);
      const loaded = loadMixes();
      expect(loaded).toHaveLength(1);
      expect(loaded[0]).toEqual(mockMix);
    });

    it('should return empty array when no mixes are saved', () => {
      expect(loadMixes()).toEqual([]);
    });

    it('should handle multiple mixes', () => {
      const mix2: SavedMix = {
        id: 'mix-2',
        name: 'Another Mix',
        sounds: [{ id: 'forest', volume: 0.8 }],
        createdAt: Date.now(),
      };
      saveMixes([mockMix, mix2]);
      const loaded = loadMixes();
      expect(loaded).toHaveLength(2);
    });

    it('should filter out invalid mixes when loading', () => {
      localStorage.setItem(
        'nuvio-saved-mixes',
        JSON.stringify({
          mixes: [
            mockMix,
            { invalid: 'data' }, // Invalid mix
            { id: 'mix-3', name: 'Valid', sounds: [], createdAt: 123 }, // Valid
          ],
        })
      );
      const loaded = loadMixes();
      expect(loaded).toHaveLength(2);
    });

    it('should return empty array for corrupted data', () => {
      localStorage.setItem('nuvio-saved-mixes', 'invalid json');
      expect(loadMixes()).toEqual([]);
    });

    it('should throw error for quota exceeded', () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = vi.fn(() => {
        const error = new DOMException('Quota exceeded', 'QuotaExceededError');
        throw error;
      });

      expect(() => saveMixes([mockMix])).toThrow('Storage quota exceeded');

      // Restore original
      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('Last state persistence', () => {
    const mockLastState = {
      masterVolume: 0.8,
      soundStates: [
        { id: 'rain', volume: 0.5 },
        { id: 'ocean', volume: 0.7 },
      ],
    };

    it('should save and load last state', () => {
      saveLastState(mockLastState);
      const loaded = loadLastState();
      expect(loaded).toEqual(mockLastState);
    });

    it('should return null when no last state is saved', () => {
      expect(loadLastState()).toBe(null);
    });

    it('should return null for invalid last state data', () => {
      localStorage.setItem('nuvio-last-state', JSON.stringify({ invalid: 'data' }));
      expect(loadLastState()).toBe(null);
    });

    it('should return null for corrupted data', () => {
      localStorage.setItem('nuvio-last-state', 'invalid json');
      expect(loadLastState()).toBe(null);
    });
  });

  describe('clearAllStorage', () => {
    it('should clear all storage keys', () => {
      saveTheme('dark');
      saveMixes([
        {
          id: 'mix-1',
          name: 'Test',
          sounds: [],
          createdAt: Date.now(),
        },
      ]);
      saveLastState({ masterVolume: 0.5, soundStates: [] });

      clearAllStorage();

      expect(loadTheme()).toBe(null);
      expect(loadMixes()).toEqual([]);
      expect(loadLastState()).toBe(null);
    });
  });
});
