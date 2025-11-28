import { describe, it, expect } from 'vitest';
import { soundCatalog, getSoundsByCategory } from './soundCatalog';

describe('Sound Catalog Structure', () => {
  it('should contain exactly 20 sounds', () => {
    expect(soundCatalog).toHaveLength(20);
  });

  it('should have 6 nature sounds', () => {
    const natureSounds = getSoundsByCategory('nature');
    expect(natureSounds).toHaveLength(6);
  });

  it('should have 4 city sounds', () => {
    const citySounds = getSoundsByCategory('city');
    expect(citySounds).toHaveLength(4);
  });

  it('should have 4 work sounds', () => {
    const workSounds = getSoundsByCategory('work');
    expect(workSounds).toHaveLength(4);
  });

  it('should have 4 noise sounds', () => {
    const noiseSounds = getSoundsByCategory('noise');
    expect(noiseSounds).toHaveLength(4);
  });

  it('should have 2 relaxation sounds', () => {
    const relaxationSounds = getSoundsByCategory('relaxation');
    expect(relaxationSounds).toHaveLength(2);
  });

  it('should have all 5 categories represented', () => {
    const categories = new Set(soundCatalog.map(sound => sound.category));
    expect(categories.size).toBe(5);
    expect(categories.has('nature')).toBe(true);
    expect(categories.has('city')).toBe(true);
    expect(categories.has('work')).toBe(true);
    expect(categories.has('noise')).toBe(true);
    expect(categories.has('relaxation')).toBe(true);
  });

  it('should have unique sound IDs', () => {
    const ids = soundCatalog.map(sound => sound.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(soundCatalog.length);
  });

  it('should have all required properties for each sound', () => {
    soundCatalog.forEach(sound => {
      expect(sound).toHaveProperty('id');
      expect(sound).toHaveProperty('name');
      expect(sound).toHaveProperty('category');
      expect(sound).toHaveProperty('icon');
      expect(sound).toHaveProperty('audioUrl');
      expect(typeof sound.id).toBe('string');
      expect(typeof sound.name).toBe('string');
      expect(typeof sound.category).toBe('string');
      expect(typeof sound.icon).toBe('string');
      expect(typeof sound.audioUrl).toBe('string');
    });
  });
});
