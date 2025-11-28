import { useState } from 'react';
import { useMixManager } from '../../hooks/useMixManager';
import './SavedMixesPanel.css';

interface SavedMixesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedMixesPanel({ isOpen, onClose }: SavedMixesPanelProps) {
  const { savedMixes, loadMix, deleteMix } = useMixManager();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLoadMix = (mixId: string) => {
    loadMix(mixId);
    onClose();
  };

  const handleDeleteMix = (mixId: string) => {
    if (deletingId === mixId) {
      // Confirm delete
      deleteMix(mixId);
      setDeletingId(null);
    } else {
      // First click - show confirmation
      setDeletingId(mixId);
      // Reset after 3 seconds
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="panel-overlay" onClick={onClose} aria-hidden="true" />
      )}

      {/* Panel */}
      <div className={`saved-mixes-panel ${isOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>Saved Mixes</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close saved mixes panel"
          >
            ✕
          </button>
        </div>

        <div className="panel-content">
          {savedMixes.length === 0 ? (
            <div className="empty-state">
              <p>No saved mixes yet</p>
              <p className="empty-hint">
                Save your current sound mix using the 💾 button in the control bar
              </p>
            </div>
          ) : (
            <div className="mix-list">
              {savedMixes.map((mix) => (
                <div key={mix.id} className="mix-item">
                  <div className="mix-info">
                    <h3 className="mix-name">{mix.name}</h3>
                    <p className="mix-meta">
                      {mix.sounds.length} sound{mix.sounds.length !== 1 ? 's' : ''} • {formatDate(mix.createdAt)}
                    </p>
                  </div>
                  <div className="mix-actions">
                    <button
                      className="load-button"
                      onClick={() => handleLoadMix(mix.id)}
                      aria-label={`Load ${mix.name}`}
                      title="Load this mix"
                    >
                      ▶
                    </button>
                    <button
                      className={`delete-button ${deletingId === mix.id ? 'confirm' : ''}`}
                      onClick={() => handleDeleteMix(mix.id)}
                      aria-label={deletingId === mix.id ? `Confirm delete ${mix.name}` : `Delete ${mix.name}`}
                      title={deletingId === mix.id ? 'Click again to confirm' : 'Delete this mix'}
                    >
                      {deletingId === mix.id ? '✓' : '🗑'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
