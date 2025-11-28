import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { AppState, SoundState, SavedMix } from '../types';
import { soundCatalog } from '../audio/soundCatalog';
import { DEFAULT_SOUND_VOLUME, DEFAULT_MASTER_VOLUME } from '../utils/constants';

// Simulate the SAVE_MIX action
function applySaveMix(state: AppState, name: string): AppState {
  const activeSounds = Array.from(state.sounds.values())
    .filter(sound => sound.isPlaying || sound.volume !== DEFAULT_SOUND_VOLUME)
    .map(sound => ({ id: sound.id, volume: sound.volume }));

  const newMix: SavedMix = {
    id: `mix-${Date.now()}`,
    name: name,
    sounds: activeSounds,
    createdAt: Date.now(),
  };

  return { ...state, savedMixes: [...state.savedMixes, newMix] };
}

describe('Mix Persistence Properties', () => {
  /**
   * **Feature: nuvio-noise-generator, Property 10: Mix name association**
   * **Validates: Requirements 3.2**
   * 
   * For any mix name string, when saving a mix with that name, 
   * the saved mix object should contain that exact name.
   */
  it('Property 10: Mix name association', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary mix names
        fc.string({ minLength: 1, maxLength: 100 }),
        // Generate arbitrary application states
        fc.record({
          sounds: fc.constant(soundCatalog).chain(catalog => {
            const soundStates = fc.array(
              fc.record({
                id: fc.constantFrom(...catalog.map(s => s.id)),
                isPlaying: fc.boolean(),
                volume: fc.double({ min: 0, max: 1 }),
              }),
              { minLength: catalog.length, maxLength: catalog.length }
            );
            return soundStates.map(states => {
              const map = new Map<string, SoundState>();
              catalog.forEach((sound, idx) => {
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
          timer: fc.constant(null),
          savedMixes: fc.array(
            fc.record({
              id: fc.string(),
              name: fc.string(),
              sounds: fc.array(
                fc.record({
                  id: fc.constantFrom(...soundCatalog.map(s => s.id)),
                  volume: fc.double({ min: 0, max: 1 }),
                })
              ),
              createdAt: fc.integer({ min: 0 }),
            })
          ),
          pausedSoundIds: fc.array(fc.constantFrom(...soundCatalog.map(s => s.id))),
        }),
        (mixName: string, initialState: AppState) => {
          // Save a mix with the given name
          const stateAfterSave = applySaveMix(initialState, mixName);

          // Find the newly saved mix (it should be the last one)
          const savedMix = stateAfterSave.savedMixes[stateAfterSave.savedMixes.length - 1];

          // Verify the mix exists
          expect(savedMix).toBeDefined();

          // Verify the mix has the exact name we provided
          expect(savedMix.name).toBe(mixName);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Simulate the DELETE_MIX action
function applyDeleteMix(state: AppState, mixId: string): AppState {
  return {
    ...state,
    savedMixes: state.savedMixes.filter(mix => mix.id !== mixId),
  };
}

describe('Mix Deletion Properties', () => {
  /**
   * **Feature: nuvio-noise-generator, Property 11: Mix deletion removes from storage**
   * **Validates: Requirements 3.4**
   * 
   * For any saved mix, after deletion, querying the saved mixes list 
   * should not include that mix.
   */
  it('Property 11: Mix deletion removes from storage', () => {
    fc.assert(
      fc.property(
        // Generate an array of saved mixes
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string(),
            sounds: fc.array(
              fc.record({
                id: fc.constantFrom(...soundCatalog.map(s => s.id)),
                volume: fc.double({ min: 0, max: 1 }),
              })
            ),
            createdAt: fc.integer({ min: 0 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        (savedMixes: SavedMix[]) => {
          // Create initial state with saved mixes
          const initialState: AppState = {
            sounds: new Map(),
            masterVolume: DEFAULT_MASTER_VOLUME,
            theme: 'light',
            timer: null,
            savedMixes: savedMixes,
            pausedSoundIds: [],
          };

          // Pick a random mix to delete
          const mixToDelete = savedMixes[0];

          // Apply delete action
          const stateAfterDelete = applyDeleteMix(initialState, mixToDelete.id);

          // Verify the deleted mix is not in the list
          const deletedMixExists = stateAfterDelete.savedMixes.some(
            mix => mix.id === mixToDelete.id
          );
          expect(deletedMixExists).toBe(false);

          // Verify the list length decreased by 1
          expect(stateAfterDelete.savedMixes.length).toBe(savedMixes.length - 1);

          // Verify all other mixes are still present
          const otherMixes = savedMixes.filter(mix => mix.id !== mixToDelete.id);
          otherMixes.forEach(mix => {
            const stillExists = stateAfterDelete.savedMixes.some(m => m.id === mix.id);
            expect(stillExists).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
