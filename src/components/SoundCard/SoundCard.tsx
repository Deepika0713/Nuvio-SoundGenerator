import { memo } from 'react';
import { useAppContext, actions } from '../../context/AppContext';
import { getSoundById } from '../../audio/soundCatalog';
import { getSoundManager } from '../../audio/audioEngine';
import { AnimationRing } from './AnimationRing';
import './SoundCard.css';

interface SoundCardProps {
  soundId: string;
}

function SoundCardComponent({ soundId }: SoundCardProps) {
  const { state, dispatch } = useAppContext();
  const sound = getSoundById(soundId);
  const soundState = state.sounds.get(soundId);

  if (!sound || !soundState) {
    return null;
  }

  const handlePlayPause = async () => {
    const soundManager = getSoundManager();
    
    if (soundState.isPlaying) {
      soundManager.pauseSound(soundId);
      dispatch(actions.pauseSound(soundId));
    } else {
      dispatch(actions.playSound(soundId));
      await soundManager.playSound(soundId);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    const soundManager = getSoundManager();
    
    soundManager.setSoundVolume(soundId, volume);
    dispatch(actions.setVolume(soundId, volume));
  };

  return (
    <div className="sound-card">
      <AnimationRing isPlaying={soundState.isPlaying} />
      
      <div className="sound-card-content">
        <div className="sound-icon" aria-hidden="true">
          {sound.icon}
        </div>
        
        <h3 className="sound-name">{sound.name}</h3>
        
        <button
          className={`play-pause-button ${soundState.isPlaying ? 'playing' : ''}`}
          onClick={handlePlayPause}
          aria-label={soundState.isPlaying ? `Pause ${sound.name}` : `Play ${sound.name}`}
        >
          {soundState.isPlaying ? '⏸' : '▶'}
        </button>
        
        <div className="volume-control">
          <label htmlFor={`volume-${soundId}`} className="sr-only">
            Volume for {sound.name}
          </label>
          <input
            id={`volume-${soundId}`}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={soundState.volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label={`Volume for ${sound.name}`}
          />
          <span className="volume-value" aria-live="polite">
            {Math.round(soundState.volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export const SoundCard = memo(SoundCardComponent);
