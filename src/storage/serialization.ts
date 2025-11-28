/**
 * Serialization utilities for converting between application state and storage format
 */

import { SavedMix, SoundState } from '../types';
import { LastStateStorage } from './localStorage';

/**
 * Serialize sound states for storage
 */
export function serializeSoundStates(
  sounds: Map<string, SoundState>
): Array<{ id: string; volume: number }> {
  return Array.from(sounds.values()).map(sound => ({
    id: sound.id,
    volume: sound.volume,
  }));
}

/**
 * Deserialize sound states from storage
 */
export function deserializeSoundStates(
  soundStates: Array<{ id: string; volume: number }>
): Map<string, Partial<SoundState>> {
  const map = new Map<string, Partial<SoundState>>();
  
  soundStates.forEach(state => {
    if (state.id && typeof state.volume === 'number') {
      map.set(state.id, {
        id: state.id,
        volume: state.volume,
      });
    }
  });
  
  return map;
}

/**
 * Validate a SavedMix object
 */
export function isValidSavedMix(mix: any): mix is SavedMix {
  return (
    mix &&
    typeof mix.id === 'string' &&
    typeof mix.name === 'string' &&
    Array.isArray(mix.sounds) &&
    typeof mix.createdAt === 'number' &&
    mix.sounds.every(
      (sound: any) =>
        sound &&
        typeof sound.id === 'string' &&
        typeof sound.volume === 'number'
    )
  );
}

/**
 * Validate LastStateStorage object
 */
export function isValidLastState(state: any): state is LastStateStorage {
  return (
    state &&
    typeof state.masterVolume === 'number' &&
    Array.isArray(state.soundStates) &&
    state.soundStates.every(
      (sound: any) =>
        sound &&
        typeof sound.id === 'string' &&
        typeof sound.volume === 'number'
    )
  );
}
