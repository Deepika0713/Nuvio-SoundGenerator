/**
 * Storage module exports
 */

export {
  saveTheme,
  loadTheme,
  saveMixes,
  loadMixes,
  saveLastState,
  loadLastState,
  clearAllStorage,
  isStorageAvailable,
  type ThemeStorage,
  type SavedMixesStorage,
  type LastStateStorage,
} from './localStorage';

export {
  serializeSoundStates,
  deserializeSoundStates,
  isValidSavedMix,
  isValidLastState,
} from './serialization';
