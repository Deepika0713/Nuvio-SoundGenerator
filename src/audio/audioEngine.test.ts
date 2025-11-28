import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { SoundManager } from './audioEngine';
import { soundCatalog } from './soundCatalog';

// Mock Web Audio API
class MockAudioContext {
  destination = {};
  state = 'running';
  
  createGain() {
    return {
      gain: { value: 1 },
      connect: vi.fn(),
    };
  }
  
  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
  
  async decodeAudioData(_arrayBuffer: ArrayBuffer) {
    return { duration: 10, length: 44100 * 10 } as AudioBuffer;
  }
  
  async resume() {
    this.state = 'running';
  }
}

// Setup global mocks
beforeEach(() => {
  (globalThis as any).AudioContext = MockAudioContext;
  (globalThis as any).webkitAudioContext = MockAudioContext;
  (globalThis as any).fetch = vi.fn().mockResolvedValue({
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  });
});

// Generators
const soundIdGenerator = fc.constantFrom(...soundCatalog.map(s => s.id));

describe('Audio Engine Property Tests', () => {
  /**
   * Feature: nuvio-noise-generator, Property 1: Play action starts sound
   * Validates: Requirements 1.1
   */
  it('Property 1: Play action starts sound', async () => {
    await fc.assert(
      fc.asyncProperty(soundIdGenerator, async (soundId: string) => {
        const manager = new SoundManager();
        
        // Load the sound
        const sound = soundCatalog.find(s => s.id === soundId)!;
        await manager.loadSound(soundId, sound.audioUrl);
        
        // Play the sound
        manager.playSound(soundId);
        
        // Verify the sound is playing
        expect(manager.isPlaying(soundId)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: nuvio-noise-generator, Property 2: Pause action stops sound
   * Validates: Requirements 1.2
   */
  it('Property 2: Pause action stops sound', async () => {
    await fc.assert(
      fc.asyncProperty(soundIdGenerator, async (soundId: string) => {
        const manager = new SoundManager();
        
        // Load and play the sound
        const sound = soundCatalog.find(s => s.id === soundId)!;
        await manager.loadSound(soundId, sound.audioUrl);
        manager.playSound(soundId);
        
        // Verify it's playing first
        expect(manager.isPlaying(soundId)).toBe(true);
        
        // Pause the sound
        manager.pauseSound(soundId);
        
        // Verify the sound is not playing
        expect(manager.isPlaying(soundId)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: nuvio-noise-generator, Property 4: Volume adjustment updates state
   * Validates: Requirements 2.1
   */
  it('Property 4: Volume adjustment updates state', async () => {
    const volumeGenerator = fc.double({ min: 0, max: 1 });
    
    await fc.assert(
      fc.asyncProperty(soundIdGenerator, volumeGenerator, async (soundId: string, volume: number) => {
        const manager = new SoundManager();
        
        // Load the sound
        const sound = soundCatalog.find(s => s.id === soundId)!;
        await manager.loadSound(soundId, sound.audioUrl);
        
        // Set the volume
        manager.setSoundVolume(soundId, volume);
        
        // Verify the volume is set correctly (with small tolerance for floating point)
        const actualVolume = manager.getSoundVolume(soundId);
        expect(Math.abs(actualVolume - volume)).toBeLessThan(0.0001);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: nuvio-noise-generator, Property 5: Master volume scales proportionally
   * Validates: Requirements 2.2
   */
  it('Property 5: Master volume scales proportionally', async () => {
    const volumeGenerator = fc.double({ min: 0, max: 1 });
    
    await fc.assert(
      fc.asyncProperty(
        fc.array(soundIdGenerator, { minLength: 2, maxLength: 5 }),
        fc.array(volumeGenerator, { minLength: 2, maxLength: 5 }),
        volumeGenerator,
        async (soundIds: string[], volumes: number[], masterVolume: number) => {
          // Ensure arrays have same length
          const count = Math.min(soundIds.length, volumes.length);
          const uniqueSoundIds = [...new Set(soundIds.slice(0, count))];
          
          if (uniqueSoundIds.length < 2) return; // Skip if not enough unique sounds
          
          const manager = new SoundManager();
          
          // Load sounds and set individual volumes
          for (let i = 0; i < uniqueSoundIds.length; i++) {
            const soundId = uniqueSoundIds[i];
            const sound = soundCatalog.find(s => s.id === soundId)!;
            await manager.loadSound(soundId, sound.audioUrl);
            manager.setSoundVolume(soundId, volumes[i]);
          }
          
          // Get initial volume ratios
          const initialVolumes = uniqueSoundIds.map(id => manager.getSoundVolume(id));
          
          // Set master volume
          manager.setMasterVolume(masterVolume);
          
          // Verify individual volumes are unchanged (master volume is separate)
          const finalVolumes = uniqueSoundIds.map(id => manager.getSoundVolume(id));
          
          for (let i = 0; i < uniqueSoundIds.length; i++) {
            expect(Math.abs(initialVolumes[i] - finalVolumes[i])).toBeLessThan(0.0001);
          }
          
          // Verify master volume is set correctly
          expect(Math.abs(manager.getMasterVolume() - masterVolume)).toBeLessThan(0.0001);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: nuvio-noise-generator, Property 6: Volume adjustment doesn't trigger playback
   * Validates: Requirements 2.3
   */
  it('Property 6: Volume adjustment doesn\'t trigger playback', async () => {
    const volumeGenerator = fc.double({ min: 0, max: 1 });
    
    await fc.assert(
      fc.asyncProperty(soundIdGenerator, volumeGenerator, async (soundId: string, volume: number) => {
        const manager = new SoundManager();
        
        // Load the sound (but don't play it)
        const sound = soundCatalog.find(s => s.id === soundId)!;
        await manager.loadSound(soundId, sound.audioUrl);
        
        // Verify it's not playing
        expect(manager.isPlaying(soundId)).toBe(false);
        
        // Adjust the volume
        manager.setSoundVolume(soundId, volume);
        
        // Verify it's still not playing
        expect(manager.isPlaying(soundId)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: nuvio-noise-generator, Property 7: Stop/start preserves volume
   * Validates: Requirements 2.4
   */
  it('Property 7: Stop/start preserves volume', async () => {
    const volumeGenerator = fc.double({ min: 0, max: 1 });
    
    await fc.assert(
      fc.asyncProperty(soundIdGenerator, volumeGenerator, async (soundId: string, volume: number) => {
        const manager = new SoundManager();
        
        // Load the sound
        const sound = soundCatalog.find(s => s.id === soundId)!;
        await manager.loadSound(soundId, sound.audioUrl);
        
        // Set volume and play
        manager.setSoundVolume(soundId, volume);
        manager.playSound(soundId);
        
        const volumeWhilePlaying = manager.getSoundVolume(soundId);
        
        // Stop the sound
        manager.pauseSound(soundId);
        
        const volumeAfterStop = manager.getSoundVolume(soundId);
        
        // Restart the sound
        manager.playSound(soundId);
        
        const volumeAfterRestart = manager.getSoundVolume(soundId);
        
        // Verify volume is preserved throughout
        expect(Math.abs(volumeWhilePlaying - volume)).toBeLessThan(0.0001);
        expect(Math.abs(volumeAfterStop - volume)).toBeLessThan(0.0001);
        expect(Math.abs(volumeAfterRestart - volume)).toBeLessThan(0.0001);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: nuvio-noise-generator, Property 8: Master volume zero preserves individual settings
   * Validates: Requirements 2.5
   */
  it('Property 8: Master volume zero preserves individual settings', async () => {
    const volumeGenerator = fc.double({ min: 0, max: 1 });
    
    await fc.assert(
      fc.asyncProperty(
        fc.array(soundIdGenerator, { minLength: 2, maxLength: 5 }),
        fc.array(volumeGenerator, { minLength: 2, maxLength: 5 }),
        async (soundIds: string[], volumes: number[]) => {
          const count = Math.min(soundIds.length, volumes.length);
          const uniqueSoundIds = [...new Set(soundIds.slice(0, count))];
          
          if (uniqueSoundIds.length < 2) return;
          
          const manager = new SoundManager();
          
          // Load sounds and set individual volumes
          for (let i = 0; i < uniqueSoundIds.length; i++) {
            const soundId = uniqueSoundIds[i];
            const sound = soundCatalog.find(s => s.id === soundId)!;
            await manager.loadSound(soundId, sound.audioUrl);
            manager.setSoundVolume(soundId, volumes[i]);
          }
          
          // Get initial volumes
          const initialVolumes = uniqueSoundIds.map(id => manager.getSoundVolume(id));
          
          // Set master volume to zero
          manager.setMasterVolume(0);
          
          // Verify individual volumes are unchanged
          const volumesAtZero = uniqueSoundIds.map(id => manager.getSoundVolume(id));
          
          for (let i = 0; i < uniqueSoundIds.length; i++) {
            expect(Math.abs(initialVolumes[i] - volumesAtZero[i])).toBeLessThan(0.0001);
          }
          
          // Set master volume back to 1
          manager.setMasterVolume(1);
          
          // Verify individual volumes are still unchanged
          const finalVolumes = uniqueSoundIds.map(id => manager.getSoundVolume(id));
          
          for (let i = 0; i < uniqueSoundIds.length; i++) {
            expect(Math.abs(initialVolumes[i] - finalVolumes[i])).toBeLessThan(0.0001);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
