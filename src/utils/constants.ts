// Default values and constants for Nuvio

// Volume defaults
export const DEFAULT_SOUND_VOLUME = 0.5;
export const DEFAULT_MASTER_VOLUME = 0.7;
export const MIN_VOLUME = 0;
export const MAX_VOLUME = 1;

// Timer durations in milliseconds
export const TIMER_DURATIONS = {
  FIFTEEN_MIN: 15 * 60 * 1000,
  THIRTY_MIN: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  TWO_HOURS: 2 * 60 * 60 * 1000,
} as const;

// Timer duration options for UI
export const TIMER_OPTIONS = [
  { label: '15 min', value: TIMER_DURATIONS.FIFTEEN_MIN },
  { label: '30 min', value: TIMER_DURATIONS.THIRTY_MIN },
  { label: '1 hr', value: TIMER_DURATIONS.ONE_HOUR },
  { label: '2 hr', value: TIMER_DURATIONS.TWO_HOURS },
] as const;

// Theme defaults
export const DEFAULT_THEME = 'light' as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'nuvio-theme',
  SAVED_MIXES: 'nuvio-saved-mixes',
  LAST_STATE: 'nuvio-last-state',
} as const;

// Category display order
export const CATEGORY_ORDER = ['nature', 'city', 'work', 'noise', 'relaxation'] as const;

// Category display names
export const CATEGORY_NAMES = {
  nature: 'Nature',
  city: 'City/Public',
  work: 'Work/Tech',
  noise: 'Background Noise',
  relaxation: 'Mind & Relaxation',
} as const;
