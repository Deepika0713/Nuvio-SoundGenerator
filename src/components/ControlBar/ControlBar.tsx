import { useState } from 'react';
import { useAppContext, actions } from '../../context/AppContext';
import { useTimer } from '../../hooks/useTimer';
import { useMixManager } from '../../hooks/useMixManager';
import { getSoundManager } from '../../audio/audioEngine';
import { TIMER_OPTIONS } from '../../utils/constants';
import { formatTime } from '../../utils/timeFormat';
import { SavedMixesPanel } from '../SavedMixesPanel';
import './ControlBar.css';

export function ControlBar() {
  const { state, dispatch } = useAppContext();
  const { timer, startTimer, cancelTimer } = useTimer();
  const { saveMix } = useMixManager();
  const [showSaveMixDialog, setShowSaveMixDialog] = useState(false);
  const [showMixesPanel, setShowMixesPanel] = useState(false);
  const [mixName, setMixName] = useState('');

  const hasPlayingSounds = Array.from(state.sounds.values()).some(s => s.isPlaying);
  const hasPausedSounds = state.pausedSoundIds.length > 0;

  const handleMasterPlayPause = async () => {
    const soundManager = getSoundManager();
    
    if (hasPlayingSounds) {
      // Pause all currently playing sounds
      soundManager.pauseAll();
      dispatch(actions.masterPause());
    } else if (hasPausedSounds) {
      // Resume previously paused sounds
      dispatch(actions.masterResume());
      await soundManager.resumeAll();
    }
    // If no sounds are playing and none were paused, do nothing (Requirement 5.5)
  };

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    const soundManager = getSoundManager();
    soundManager.setMasterVolume(volume);
    dispatch(actions.setMasterVolume(volume));
  };

  const handleTimerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const duration = parseInt(e.target.value);
    if (duration === 0) {
      cancelTimer();
    } else {
      startTimer(duration);
    }
  };

  const handleReset = () => {
    const soundManager = getSoundManager();
    soundManager.stopAll();
    
    // Reset all sound volumes to default
    Array.from(state.sounds.keys()).forEach(id => {
      soundManager.setSoundVolume(id, 0.5);
    });
    soundManager.setMasterVolume(0.7);
    
    dispatch(actions.reset());
  };

  const handleSaveMix = () => {
    if (mixName.trim()) {
      saveMix(mixName.trim());
      setMixName('');
      setShowSaveMixDialog(false);
    }
  };

  const handleStopAll = () => {
    const soundManager = getSoundManager();
    soundManager.stopAll();
    dispatch(actions.stopAll());
  };

  return (
    <div className="control-bar">
      <div className="control-bar-content">
        {/* Master Play/Pause */}
        <button
          className="control-button master-play-pause"
          onClick={handleMasterPlayPause}
          disabled={!hasPlayingSounds && !hasPausedSounds}
          aria-label={hasPlayingSounds ? 'Pause all sounds' : 'Resume all sounds'}
          title={hasPlayingSounds ? 'Pause all' : 'Resume all'}
        >
          {hasPlayingSounds ? '⏸' : '▶'}
        </button>

        {/* Stop All */}
        <button
          className="control-button stop-all"
          onClick={handleStopAll}
          disabled={!hasPlayingSounds}
          aria-label="Stop all sounds"
          title="Stop all"
        >
          ⏹
        </button>

        {/* Master Volume */}
        <div className="master-volume-control">
          <label htmlFor="master-volume" className="control-label">
            🔊
          </label>
          <input
            id="master-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.masterVolume}
            onChange={handleMasterVolumeChange}
            className="master-volume-slider"
            aria-label="Master volume"
          />
          <span className="volume-display">
            {Math.round(state.masterVolume * 100)}%
          </span>
        </div>

        {/* Timer */}
        <div className="timer-control">
          <label htmlFor="timer-select" className="control-label">
            ⏱
          </label>
          <select
            id="timer-select"
            value={timer?.isActive ? timer.duration : 0}
            onChange={handleTimerSelect}
            className="timer-select"
            aria-label="Timer duration"
          >
            <option value={0}>No timer</option>
            {TIMER_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {timer?.isActive && (
            <span className="timer-display" aria-live="polite">
              {formatTime(timer.remaining)}
            </span>
          )}
        </div>

        {/* Save Mix Button */}
        <button
          className="control-button save-mix"
          onClick={() => setShowSaveMixDialog(true)}
          aria-label="Save current mix"
          title="Save mix"
        >
          💾
        </button>

        {/* View Saved Mixes Button */}
        <button
          className="control-button view-mixes"
          onClick={() => setShowMixesPanel(true)}
          aria-label="View saved mixes"
          title="View saved mixes"
        >
          📂
        </button>

        {/* Reset Button */}
        <button
          className="control-button reset"
          onClick={handleReset}
          aria-label="Reset all sounds and volumes"
          title="Reset"
        >
          🔄
        </button>
      </div>

      {/* Save Mix Dialog */}
      {showSaveMixDialog && (
        <div className="save-mix-dialog-overlay" onClick={() => setShowSaveMixDialog(false)}>
          <div className="save-mix-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Save Mix</h3>
            <input
              type="text"
              value={mixName}
              onChange={(e) => setMixName(e.target.value)}
              placeholder="Enter mix name..."
              className="mix-name-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveMix();
                } else if (e.key === 'Escape') {
                  setShowSaveMixDialog(false);
                }
              }}
            />
            <div className="dialog-buttons">
              <button onClick={handleSaveMix} disabled={!mixName.trim()}>
                Save
              </button>
              <button onClick={() => setShowSaveMixDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Mixes Panel */}
      <SavedMixesPanel 
        isOpen={showMixesPanel} 
        onClose={() => setShowMixesPanel(false)} 
      />
    </div>
  );
}
