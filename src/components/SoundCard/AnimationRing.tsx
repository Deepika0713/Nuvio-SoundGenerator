import './AnimationRing.css';

interface AnimationRingProps {
  isPlaying: boolean;
}

export function AnimationRing({ isPlaying }: AnimationRingProps) {
  if (!isPlaying) return null;

  return (
    <div className="animation-ring" aria-hidden="true">
      <div className="ring"></div>
    </div>
  );
}
