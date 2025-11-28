import { useEffect, useRef } from 'react';
import { useAppContext, actions } from '../context/AppContext';
import { getSoundManager } from '../audio/audioEngine';

/**
 * Custom hook for managing timer functionality
 * Uses Date.now() for accurate time tracking to prevent drift
 * Integrates with AppContext for state management
 */
export function useTimer() {
  const { state, dispatch } = useAppContext();
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.timer || !state.timer.isActive) {
      // Clean up if timer is not active
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      startTimeRef.current = null;
      return;
    }

    // Initialize start time when timer becomes active
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const updateTimer = () => {
      if (!state.timer || !state.timer.isActive || startTimeRef.current === null) {
        return;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, state.timer.duration - elapsed);

      if (remaining <= 0) {
        // Timer expired
        const soundManager = getSoundManager();
        soundManager.stopAll();
        dispatch(actions.timerExpired());
        startTimeRef.current = null;
      } else {
        // Update remaining time
        dispatch(actions.updateTimer(remaining));
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      }
    };

    // Start the timer update loop
    animationFrameRef.current = requestAnimationFrame(updateTimer);

    // Cleanup on unmount or when timer changes
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [state.timer?.isActive, state.timer?.duration, dispatch]);

  // Reset start time when duration changes
  useEffect(() => {
    if (state.timer?.isActive) {
      startTimeRef.current = Date.now();
    }
  }, [state.timer?.duration]);

  return {
    timer: state.timer,
    startTimer: (duration: number) => {
      startTimeRef.current = Date.now();
      dispatch(actions.startTimer(duration));
    },
    cancelTimer: () => {
      startTimeRef.current = null;
      dispatch(actions.cancelTimer());
    },
  };
}
