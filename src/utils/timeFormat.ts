/**
 * Format milliseconds into a human-readable time string
 * @param ms - Time in milliseconds
 * @returns Formatted string like "1:30:45" or "15:30"
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format timer duration for display (e.g., "15 min", "1 hr")
 * @param ms - Duration in milliseconds
 * @returns Formatted string
 */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / (60 * 1000));
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return hours === 1 ? '1 hr' : `${hours} hrs`;
  }
  
  return `${minutes} min`;
}
