import { Sound } from '../types';

// Sound catalog with all 20 sounds organized by category
export const soundCatalog: Sound[] = [
  // Nature (6 sounds)
  {
    id: 'rain',
    name: 'Rain',
    category: 'nature',
    icon: '🌧️',
    audioUrl: '/audio/rain.mp3',
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    category: 'nature',
    icon: '⛈️',
    audioUrl: '/audio/thunderstorm.mp3',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'nature',
    icon: '🌊',
    audioUrl: '/audio/ocean.mp3',
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'nature',
    icon: '🌲',
    audioUrl: '/audio/forest.mp3',
  },
  {
    id: 'waterfall',
    name: 'Waterfall',
    category: 'nature',
    icon: '💧',
    audioUrl: '/audio/waterfall.mp3',
  },
  {
    id: 'wind',
    name: 'Wind',
    category: 'nature',
    icon: '💨',
    audioUrl: '/audio/wind.mp3',
  },

  // City/Public (4 sounds)
  {
    id: 'cafe',
    name: 'Cafe',
    category: 'city',
    icon: '☕',
    audioUrl: '/audio/cafe.mp3',
  },
  {
    id: 'library',
    name: 'Library',
    category: 'city',
    icon: '📚',
    audioUrl: '/audio/library.mp3',
  },
  {
    id: 'train',
    name: 'Train',
    category: 'city',
    icon: '🚂',
    audioUrl: '/audio/train.mp3',
  },
  {
    id: 'street-market',
    name: 'Street Market',
    category: 'city',
    icon: '🏪',
    audioUrl: '/audio/street-market.mp3',
  },

  // Work/Tech (4 sounds)
  {
    id: 'keyboard',
    name: 'Keyboard',
    category: 'work',
    icon: '⌨️',
    audioUrl: '/audio/keyboard.mp3',
  },
  {
    id: 'office',
    name: 'Office',
    category: 'work',
    icon: '🏢',
    audioUrl: '/audio/office.mp3',
  },
  {
    id: 'server-room',
    name: 'Server Room',
    category: 'work',
    icon: '🖥️',
    audioUrl: '/audio/server-room.mp3',
  },
  {
    id: 'mouse-clicks',
    name: 'Mouse Clicks',
    category: 'work',
    icon: '🖱️',
    audioUrl: '/audio/mouse-clicks.mp3',
  },

  // Background Noise (4 sounds)
  {
    id: 'brown-noise',
    name: 'Brown Noise',
    category: 'noise',
    icon: '🟤',
    audioUrl: '/audio/brown-noise.mp3',
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    category: 'noise',
    icon: '⚪',
    audioUrl: '/audio/white-noise.mp3',
  },
  {
    id: 'pink-noise',
    name: 'Pink Noise',
    category: 'noise',
    icon: '🩷',
    audioUrl: '/audio/pink-noise.mp3',
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    category: 'noise',
    icon: '🔥',
    audioUrl: '/audio/fireplace.mp3',
  },

  // Mind & Relaxation (2 sounds)
  {
    id: 'meditation-bowl',
    name: 'Meditation Bowl',
    category: 'relaxation',
    icon: '🎵',
    audioUrl: '/audio/meditation-bowl.mp3',
  },
  {
    id: 'deep-breathing',
    name: 'Deep Breathing',
    category: 'relaxation',
    icon: '🧘',
    audioUrl: '/audio/deep-breathing.mp3',
  },
];

// Helper function to get sounds by category
export function getSoundsByCategory(category: Sound['category']): Sound[] {
  return soundCatalog.filter(sound => sound.category === category);
}

// Helper function to get sound by ID
export function getSoundById(id: string): Sound | undefined {
  return soundCatalog.find(sound => sound.id === id);
}
