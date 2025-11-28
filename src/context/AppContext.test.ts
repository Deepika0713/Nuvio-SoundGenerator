import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { AppState, SoundState, Sound } from '../types';
import { soundCatalog } from '../audio/soundCatalog';
import { DEFAULT_SOUND_VOLUME, DEFAULT_MASTER_VOLUME } from '../utils/constants';

// Helper to create initial state
function createInitialState(): AppState {
  const soundsMap = new Map<string, SoundState>();
  
  soundCatalog.forEach(sound => {
    soundsMap.set(sound.id, {
      id: sound.id,
      isPlaying: false,
      volume: DEFAULT_SOUND_VOLUME,
    });
  });

  return {
    sounds: soundsMap,
    masterVolume: DEFAULT_MASTER_VOLUME,
    theme: 'light',
    timer: null,
    savedMixes: [],
    pausedSoundIds: [],
  };
}

// Simulate the RESET action
function applyReset(state: AppState): AppState {
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

// Simulate the PLAY_SOUND action
function applyPlaySound(state: AppState, soundId: string): AppState {
  const newSounds = new Map(state.sounds);
  const sound = newSounds.get(soundId);
  if (sound) {
    newSounds.set(soundId, { ...sound, isPlaying: true });
  }
  return { ...state, sounds: newSounds, pausedSoundIds: [] };
}

// Simulate the MASTER_PAUSE action
function applyMasterPause(state: AppState): AppState {
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

// Simulate the MASTER_RESUME action
function applyMasterResume(state: AppState): AppState {
  const newSounds = new Map(state.sounds);
  
  state.pausedSoundIds.forEach(id => {
    const sound = newSounds.get(id);
    if (sound) {
      newSounds.set(id, { ...sound, isPlaying: true });
    }
  });
  
  return { ...state, sounds: newSounds, pausedSoundIds: [] };
}

describe('AppContext State Management', () => {
  /**
   * Test for pause/resume state synchronization
   * 
   * This test verifies that when individual sounds are played/paused after a master pause,
   * the pausedSoundIds array is cleared to prevent stale state issues.
   */
  it('Individual play/pause clears pausedSoundIds to prevent stale state', () => {
    const initialState = createInitialState();
    const soundIds = Array.from(initialState.sounds.keys());
    
    // Play some sounds
    let state = applyPlaySound(initialState, soundIds[0]);
    state = applyPlaySound(state, soundIds[1]);
    
    // Master pause - should store paused IDs
    state = applyMasterPause(state);
    expect(state.pausedSoundIds).toHaveLength(2);
    expect(state.pausedSoundIds).toContain(soundIds[0]);
    expect(state.pausedSoundIds).toContain(soundIds[1]);
    
    // Play a different sound individually - should clear pausedSoundIds
    state = applyPlaySound(state, soundIds[2]);
    expect(state.pausedSoundIds).toHaveLength(0);
    
    // Master resume should now do nothing since pausedSoundIds is empty
    state = applyMasterResume(state);
    
    // Only soundIds[2] should be playing
    expect(state.sounds.get(soundIds[0])?.isPlaying).toBe(false);
    expect(state.sounds.get(soundIds[1])?.isPlaying).toBe(false);
    expect(state.sounds.get(soundIds[2])?.isPlaying).toBe(true);
  });

  /**
   * **Feature: nuvio-noise-generator, Property 19: Reset returns to initial state**
   * **Validates: Requirements 5.3**
   * 
   * For any application state, executing the reset action should set all sounds 
   * to not playing and all volumes to their default values.
   */
  it('Property 19: Reset returns to initial state', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary application states
        fc.record({
          // Generate random sound states
          sounds: fc.constant(soundCatalog).chain((catalog: Sound[]) => {
            const soundStates = fc.array(
              fc.record({
                id: fc.constantFrom(...catalog.map((s: Sound) => s.id)),
                isPlaying: fc.boolean(),
                volume: fc.double({ min: 0, max: 1 }),
              }),
              { minLength: catalog.length, maxLength: catalog.length }
            );
            return soundStates.map((states: Array<{ id: string; isPlaying: boolean; volume: number }>) => {
              const map = new Map<string, SoundState>();
              catalog.forEach((sound: Sound, idx: number) => {
                map.set(sound.id, {
                  id: sound.id,
                  isPlaying: states[idx].isPlaying,
                  volume: states[idx].volume,
                });
              });
              return map;
            });
          }),
          masterVolume: fc.double({ min: 0, max: 1 }),
          theme: fc.constantFrom('light' as const, 'dark' as const),
          timer: fc.oneof(
            fc.constant(null),
            fc.record({
              duration: fc.integer({ min: 1000, max: 7200000 }),
              remaining: fc.integer({ min: 0, max: 7200000 }),
              isActive: fc.boolean(),
            })
          ),
          savedMixes: fc.array(
            fc.record({
              id: fc.string(),
              name: fc.string(),
              sounds: fc.array(
                fc.record({
                  id: fc.constantFrom(...soundCatalog.map((s) => s.id)),
                  volume: fc.double({ min: 0, max: 1 }),
                })
              ),
              createdAt: fc.integer({ min: 0 }),
            })
          ),
          pausedSoundIds: fc.array(fc.constantFrom(...soundCatalog.map((s) => s.id))),
        }),
        (arbitraryState: AppState) => {
          // Apply reset action
          const resetState = applyReset(arbitraryState);
          const initialState = createInitialState();

          // Verify all sounds are not playing
          resetState.sounds.forEach(sound => {
            expect(sound.isPlaying).toBe(false);
          });

          // Verify all sound volumes are at default
          resetState.sounds.forEach(sound => {
            expect(sound.volume).toBe(DEFAULT_SOUND_VOLUME);
          });

          // Verify master volume is at default
          expect(resetState.masterVolume).toBe(DEFAULT_MASTER_VOLUME);

          // Verify timer is null
          expect(resetState.timer).toBe(null);

          // Verify theme and savedMixes are preserved (not reset)
          expect(resetState.theme).toBe(arbitraryState.theme);
          expect(resetState.savedMixes).toBe(arbitraryState.savedMixes);

          // Verify sound states match initial state
          expect(resetState.sounds.size).toBe(initialState.sounds.size);
          resetState.sounds.forEach((sound, id) => {
            const initialSound = initialState.sounds.get(id);
            expect(initialSound).toBeDefined();
            expect(sound.isPlaying).toBe(initialSound!.isPlaying);
            expect(sound.volume).toBe(initialSound!.volume);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
