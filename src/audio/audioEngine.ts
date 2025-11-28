// Audio Engine using Web Audio API

// Singleton AudioContext instance
let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

interface SoundNode {
  buffer: AudioBuffer | null;
  source: AudioBufferSourceNode | null;
  gainNode: GainNode;
  isPlaying: boolean;
  volume: number;
}

export class SoundManager {
  private context: AudioContext;
  private masterGainNode: GainNode;
  private sounds: Map<string, SoundNode>;
  private masterVolume: number;
  private pausedSounds: Set<string>; // Track which sounds were playing before pause

  constructor() {
    this.context = getAudioContext();
    this.masterGainNode = this.context.createGain();
    this.masterGainNode.connect(this.context.destination);
    this.sounds = new Map();
    this.masterVolume = 1.0;
    this.pausedSounds = new Set();
  }

  async loadSound(id: string, url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

      const gainNode = this.context.createGain();
      gainNode.connect(this.masterGainNode);

      this.sounds.set(id, {
        buffer: audioBuffer,
        source: null,
        gainNode,
        isPlaying: false,
        volume: 0.5, // Default volume
      });
    } catch (error) {
      console.error(`Failed to load sound ${id}:`, error);
      // Create a placeholder node even if loading fails
      const gainNode = this.context.createGain();
      gainNode.connect(this.masterGainNode);
      
      this.sounds.set(id, {
        buffer: null,
        source: null,
        gainNode,
        isPlaying: false,
        volume: 0.5,
      });
      throw error;
    }
  }

  async playSound(id: string): Promise<void> {
    const sound = this.sounds.get(id);
    if (!sound || !sound.buffer) {
      console.warn(`Sound ${id} not loaded or buffer unavailable`);
      return;
    }

    // If already playing with an active source, verify it's actually playing
    if (sound.isPlaying && sound.source) {
      // Check if the source is still valid by checking the context state
      if (this.context.state === 'running') {
        return; // Already playing and context is running
      }
      // If context is not running, clean up and restart
      console.log(`Restarting sound ${id} due to context state: ${this.context.state}`);
      sound.isPlaying = false;
      sound.source = null;
    }

    // Resume audio context if suspended (important for mobile browsers and user interaction requirements)
    // Wait for the context to resume before playing
    if (this.context.state === 'suspended') {
      try {
        await this.context.resume();
        console.log(`Audio context resumed for ${id}`);
      } catch (err) {
        console.error('Failed to resume audio context:', err);
        return;
      }
    }

    // Stop and clean up any existing source
    if (sound.source) {
      try {
        sound.source.stop();
        sound.source.disconnect();
      } catch (e) {
        // Ignore errors from stopping already stopped sources
      }
      sound.source = null;
    }

    // Create new source
    const source = this.context.createBufferSource();
    source.buffer = sound.buffer;
    source.loop = true;
    source.connect(sound.gainNode);
    
    // Set the volume
    sound.gainNode.gain.value = sound.volume;
    
    // Handle source ended event (shouldn't happen with loop=true, but just in case)
    source.onended = () => {
      if (sound.source === source) {
        console.log(`Sound ${id} ended unexpectedly`);
        sound.source = null;
        sound.isPlaying = false;
      }
    };
    
    try {
      source.start(0);
      sound.source = source;
      sound.isPlaying = true;
      console.log(`Sound ${id} started successfully`);
    } catch (err) {
      console.error(`Failed to start sound ${id}:`, err);
      sound.source = null;
      sound.isPlaying = false;
    }
  }

  pauseSound(id: string): void {
    const sound = this.sounds.get(id);
    if (!sound) {
      return;
    }

    // Always set isPlaying to false
    sound.isPlaying = false;

    // Stop and clean up the source if it exists
    if (sound.source) {
      try {
        sound.source.stop();
        sound.source.disconnect();
      } catch (e) {
        // Ignore errors from stopping already stopped sources
      }
      sound.source = null;
    }
  }

  setSoundVolume(id: string, volume: number): void {
    const sound = this.sounds.get(id);
    if (!sound) {
      return;
    }

    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    sound.volume = clampedVolume;
    sound.gainNode.gain.value = clampedVolume;
  }

  setMasterVolume(volume: number): void {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.masterVolume = clampedVolume;
    this.masterGainNode.gain.value = clampedVolume;
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  getSoundVolume(id: string): number {
    const sound = this.sounds.get(id);
    return sound ? sound.volume : 0;
  }

  isPlaying(id: string): boolean {
    const sound = this.sounds.get(id);
    return sound ? sound.isPlaying : false;
  }

  stopAll(): void {
    this.sounds.forEach((sound, id) => {
      if (sound.isPlaying) {
        this.pauseSound(id);
      }
    });
    this.pausedSounds.clear();
  }

  pauseAll(): void {
    // Remember which sounds are currently playing
    this.pausedSounds.clear();
    this.sounds.forEach((sound, id) => {
      if (sound.isPlaying) {
        this.pausedSounds.add(id);
        this.pauseSound(id);
      }
    });
  }

  async resumeAll(): Promise<void> {
    // Resume only the sounds that were playing before pauseAll
    const promises = Array.from(this.pausedSounds).map(id => this.playSound(id));
    await Promise.all(promises);
    // Clear the paused sounds set after resuming
    this.pausedSounds.clear();
  }

  // Get all sound IDs
  getSoundIds(): string[] {
    return Array.from(this.sounds.keys());
  }

  // Resume audio context if suspended (needed for mobile browsers)
  async resumeContext(): Promise<void> {
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  // Get audio context state for debugging
  getContextState(): AudioContextState {
    return this.context.state;
  }

  // Check if a sound is loaded
  isSoundLoaded(id: string): boolean {
    const sound = this.sounds.get(id);
    return sound !== undefined && sound.buffer !== null;
  }
}

// Export singleton instance
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}
