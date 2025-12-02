# Implementation Plan

- [x] 1. Set up project structure and dependencies





  - Initialize Vite + React + TypeScript project
  - Install dependencies: fast-check, vitest, @testing-library/react
  - Create folder structure: components/, context/, audio/, storage/, hooks/, types/, utils/
  - Set up TypeScript configuration with strict mode
  - Configure Vitest for testing
  - _Requirements: 8.1, 8.2, 8.4_

- [x] 2. Define core types and sound catalog





  - Create TypeScript interfaces in types/index.ts for Sound, SoundState, AppState, SavedMix, TimerState
  - Define SoundCategory type with 5 categories
  - Create soundCatalog.ts with all 20 sounds (with placeholder audio URLs)
  - Define constants for default values (volumes, timer durations)
  - _Requirements: 1.5, 7.2_

- [x] 2.1 Write unit test for sound catalog structure


  - Verify catalog contains exactly 20 sounds
  - Verify 5 categories with correct sound counts (6, 4, 4, 4, 2)
  - _Requirements: 1.5_

- [x] 3. Implement audio engine with Web Audio API








  - Create AudioContext singleton in audioEngine.ts
  - Implement SoundManager class with loadSound, playSound, pauseSound methods
  - Create GainNode architecture (individual + master gain nodes)
  - Implement setSoundVolume and setMasterVolume methods
  - Add isPlaying, stopAll, pauseAll, resumeAll methods
  - Handle audio buffer loading and looping playback
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 5.1, 5.2_

- [x] 3.1 Write property test: Play action starts sound (Property 1)


  - **Property 1: Play action starts sound**
  - **Validates: Requirements 1.1**


- [x] 3.2 Write property test: Pause action stops sound (Property 2)

  - **Property 2: Pause action stops sound**
  - **Validates: Requirements 1.2**



- [x] 3.3 Write property test: Volume adjustment updates state (Property 4)

  - **Property 4: Volume adjustment updates state**
  - **Validates: Requirements 2.1**



- [x] 3.4 Write property test: Master volume scales proportionally (Property 5)


  - **Property 5: Master volume scales proportionally**
  - **Validates: Requirements 2.2**




- [x] 3.5 Write property test: Volume adjustment doesn't trigger playback (Property 6)


  - **Property 6: Volume adjustment doesn't trigger playback**
  - **Validates: Requirements 2.3**



- [x] 3.6 Write property test: Stop/start preserves volume (Property 7)


  - **Property 7: Stop/start preserves volume**

  - **Validates: Requirements 2.4**

- [x] 3.7 Write property test: Master volume zero preserves individual settings (Property 8)


  - **Property 8: Master volume zero preserves individual settings**
  - **Validates: Requirements 2.5**

- [x] 4. Implement state management with Context API





  - Create AppContext with useReducer for state management
  - Define actions: PLAY_SOUND, PAUSE_SOUND, SET_VOLUME, SET_MASTER_VOLUME, TOGGLE_THEME, etc.
  - Implement reducer logic for all state transitions
  - Create AppProvider component wrapping the application
  - Initialize state with all 20 sounds from catalog
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 6.1_

- [x] 4.1 Write property test: Reset returns to initial state (Property 19)


  - **Property 19: Reset returns to initial state**
  - **Validates: Requirements 5.3**

- [x] 5. Implement local storage layer



  - Create localStorage.ts with save/load functions for theme, mixes, and last state
  - Implement serialization functions for SavedMix objects
  - Add error handling for quota exceeded and storage unavailable
  - Implement data validation for loaded data (handle corrupted data)
  - _Requirements: 3.1, 6.4, 6.5_



- [x] 5.1 Write property test: Mix name association (Property 10)
  - **Property 10: Mix name association**
  - **Validates: Requirements 3.2**

- [x] 5.2 Write property test: Mix deletion removes from storage (Property 11)
  - **Property 11: Mix deletion removes from storage**
  - **Validates: Requirements 3.4**

- [x] 5.3 Write property test: Theme persistence round-trip (Property 21)
  - **Property 21: Theme persistence round-trip**
  - **Validates: Requirements 6.4, 6.5**

- [ ] 6. Create SoundCard component
  - Build SoundCard component with icon, name, play/pause button, volume slider
  - Implement AnimationRing component with CSS animation
  - Connect to AppContext for state and dispatch
  - Connect to SoundManager for audio playback
  - Add visual indicator when sound is playing
  - Style with rounded corners and soft shadows
  - _Requirements: 1.1, 1.2, 1.4, 2.1, 7.3, 7.4_

- [ ]* 6.1 Write property test: Playing state shows animation (Property 3)
  - **Property 3: Playing state shows animation**
  - **Validates: Requirements 1.4**

- [ ]* 6.2 Write property test: Sound card contains required elements (Property 23)
  - **Property 23: Sound card contains required elements**
  - **Validates: Requirements 7.3**

- [ ] 7. Create SoundGrid component with categories
  - Build SoundGrid component with 4-column grid layout
  - Create CategoryHeader component for each of 5 categories
  - Render 20 SoundCard components grouped by category
  - Apply responsive grid styling
  - _Requirements: 1.5, 7.1, 7.2_

- [ ]* 7.1 Write unit test for grid layout
  - Verify grid renders with 4 columns and 5 rows structure
  - _Requirements: 7.1_

- [ ]* 7.2 Write property test: Sound cards grouped by category (Property 22)
  - **Property 22: Sound cards grouped by category**
  - **Validates: Requirements 7.2**

- [ ] 8. Implement timer functionality
  - Create useTimer custom hook with start, stop, and update logic
  - Use Date.now() for accurate time tracking (prevent drift)
  - Implement timer expiration handler that stops all sounds and calls SoundManager.stopAll()
  - Timer state already exists in AppContext (duration, remaining, isActive)
  - Timer actions already exist: START_TIMER, UPDATE_TIMER, CANCEL_TIMER, TIMER_EXPIRED
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 8.1 Write property test: Timer initialization sets duration (Property 13)
  - **Property 13: Timer initialization sets duration**
  - **Validates: Requirements 4.1**

- [ ]* 8.2 Write property test: Timer expiration stops sounds (Property 14)
  - **Property 14: Timer expiration stops sounds**
  - **Validates: Requirements 4.2**

- [ ]* 8.3 Write property test: Active timer displays remaining time (Property 15)
  - **Property 15: Active timer displays remaining time**
  - **Validates: Requirements 4.3**

- [ ]* 8.4 Write property test: Timer duration change resets countdown (Property 16)
  - **Property 16: Timer duration change resets countdown**
  - **Validates: Requirements 4.4**

- [ ]* 8.5 Write property test: Stop all cancels timer (Property 17)
  - **Property 17: Stop all cancels timer**
  - **Validates: Requirements 4.5**

- [ ] 9. Create ControlBar component
  - Build ControlBar with master play/pause button
  - Add master volume slider
  - Implement TimerDropdown with 4 duration options (15min, 30min, 1hr, 2hr) using TIMER_OPTIONS constant
  - Add SaveMixButton that opens save dialog
  - Add ResetButton that resets all sounds and volumes
  - Connect all controls to AppContext dispatch and SoundManager
  - Implement master pause/resume using SoundManager.pauseAll() and resumeAll()
  - Style as fixed sticky bar at bottom
  - _Requirements: 2.2, 4.1, 5.1, 5.2, 5.3_

- [ ]* 9.1 Write property test: Master pause/resume round-trip (Property 18)
  - **Property 18: Master pause/resume round-trip**
  - **Validates: Requirements 5.1, 5.2**

- [ ]* 9.2 Write unit test for master play with no sounds
  - Verify master play does nothing when no sounds were previously playing
  - _Requirements: 5.5_

- [ ] 10. Enhance mix saving and loading integration
  - SAVE_MIX, LOAD_MIX, and DELETE_MIX actions already exist in reducer
  - Ensure LOAD_MIX properly restarts sounds using SoundManager
  - Verify mix persistence is working with localStorage integration
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 10.1 Write property test: Save/load mix round-trip (Property 9)
  - **Property 9: Save/load mix round-trip**
  - **Validates: Requirements 3.1, 3.3**

- [ ] 11. Create SavedMixesPanel component
  - Build slide-out drawer panel (right side)
  - Create MixList component displaying all saved mixes from AppContext
  - Create MixItem component with mix name, load button, delete button
  - Add SaveNewMixForm with name input and save button
  - Connect to AppContext for saved mixes state and dispatch
  - Implement open/close animation
  - _Requirements: 3.2, 3.4, 3.5_

- [ ]* 11.1 Write property test: Saved mixes panel displays all mixes (Property 12)
  - **Property 12: Saved mixes panel displays all mixes**
  - **Validates: Requirements 3.5**

- [ ] 12. Implement theme system UI
  - Create useTheme custom hook that uses AppContext theme state
  - Define CSS variables for light and dark themes in index.css
  - Theme toggle logic already exists in AppContext (TOGGLE_THEME action)
  - Theme persistence already implemented (loads on init, saves on change)
  - Apply theme class to root element based on AppContext state
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 12.1 Write unit tests for theme colors
  - Verify light mode uses #F5F6FA background
  - Verify dark mode uses #0F0F0F background
  - _Requirements: 6.2, 6.3_

- [ ]* 12.2 Write property test: Theme toggle round-trip (Property 20)
  - **Property 20: Theme toggle round-trip**
  - **Validates: Requirements 6.1**

- [ ] 13. Create Header component
  - Build Header with logo/title "NUVIO"
  - Add subtitle text
  - Implement ThemeToggle button (sun/moon icon)
  - Connect theme toggle to AppContext dispatch (TOGGLE_THEME action)
  - Style header section
  - _Requirements: 6.1_

- [ ] 14. Create Footer component
  - Build Footer with minimal styling
  - Add links: About, Feedback, Privacy (placeholder hrefs)
  - Add attribution text
  - _Requirements: 7.1_

- [ ] 15. Checkpoint - Verify core components work together
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Integrate all components in App.tsx
  - Wrap app with AppProvider (already exists)
  - Compose Header, SoundGrid, ControlBar, SavedMixesPanel, Footer
  - Initialize SoundManager singleton on mount using getSoundManager()
  - Preload all audio files from soundCatalog
  - Handle AudioContext suspended state (show "Tap to enable audio" overlay)
  - Theme and saved mixes already load automatically via AppContext
  - Sync AppContext state changes with SoundManager (play/pause/volume)
  - _Requirements: 8.2, 8.4_

- [ ] 17. Add error handling and edge cases
  - Implement audio loading error handling (show error on sound card)
  - Handle storage quota exceeded (show notification, already throws error in localStorage.ts)
  - Handle storage unavailable (show warning banner, disable save/load, use isStorageAvailable())
  - Corrupted saved data already handled (loadMixes filters invalid data)
  - Add error boundaries for React components
  - _Requirements: 8.5_

- [ ] 18. Implement accessibility features
  - Add ARIA labels to all icon buttons
  - Ensure keyboard navigation works for all controls
  - Add focus indicators with visible outlines
  - Ensure color contrast meets WCAG standards
  - Add semantic HTML elements
  - _Requirements: 7.3_

- [ ] 19. Performance optimizations
  - Add React.memo to SoundCard components
  - Debounce volume slider onChange handlers
  - Use CSS transforms for AnimationRing
  - Lazy load SavedMixesPanel
  - Use requestAnimationFrame for timer updates in useTimer hook
  - _Requirements: 8.1, 8.3_

- [ ] 20. Styling and visual polish
  - Apply gradient accent colors (blue to purple)
  - Add rounded corners and soft shadows to cards
  - Implement responsive design for mobile/tablet
  - Add smooth transitions for theme switching
  - Style volume sliders with custom appearance
  - Add hover states for interactive elements
  - Define CSS variables for light theme (#F5F6FA) and dark theme (#0F0F0F)
  - _Requirements: 7.4, 7.5, 6.2, 6.3_

- [ ] 21. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
