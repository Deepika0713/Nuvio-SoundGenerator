import { SoundCard } from '../SoundCard';
import { CategoryHeader } from './CategoryHeader';
import { soundCatalog } from '../../audio/soundCatalog';
import { CATEGORY_ORDER, CATEGORY_NAMES } from '../../utils/constants';
import { SoundCategory } from '../../types';
import './SoundGrid.css';

export function SoundGrid() {
  // Group sounds by category
  const soundsByCategory = soundCatalog.reduce((acc, sound) => {
    if (!acc[sound.category]) {
      acc[sound.category] = [];
    }
    acc[sound.category].push(sound);
    return acc;
  }, {} as Record<SoundCategory, typeof soundCatalog>);

  return (
    <div className="sound-grid-container">
      <div className="sound-grid">
        {CATEGORY_ORDER.map((category) => {
          const sounds = soundsByCategory[category] || [];
          if (sounds.length === 0) return null;

          return (
            <div key={category} className="category-section">
              <CategoryHeader categoryName={CATEGORY_NAMES[category]} />
              {sounds.map((sound) => (
                <SoundCard key={sound.id} soundId={sound.id} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
