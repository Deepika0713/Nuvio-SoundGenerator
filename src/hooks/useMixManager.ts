import { useAppContext, actions } from '../context/AppContext';
import { getSoundManager } from '../audio/audioEngine';

/**
 * Custom hook for managing mix operations
 * Handles the integration between AppContext state and SoundManager
 */
export function useMixManager() {
  const { state, dispatch } = useAppContext();

  const saveMix = (name: string) => {
    dispatch(actions.saveMix(name));
  };

  const loadMix = (mixId: string) => {
    const mix = state.savedMixes.find(m => m.id === mixId);
    if (!mix) return;

    const soundManager = getSoundManager();

    // Stop all currently playing sounds
    soundManager.stopAll();

    // Apply the mix settings
    mix.sounds.forEach(mixSound => {
      // Set the volume
      soundManager.setSoundVolume(mixSound.id, mixSound.volume);
    });

    // Update state
    dispatch(actions.loadMix(mixId));
  };

  const deleteMix = (mixId: string) => {
    dispatch(actions.deleteMix(mixId));
  };

  return {
    savedMixes: state.savedMixes,
    saveMix,
    loadMix,
    deleteMix,
  };
}
