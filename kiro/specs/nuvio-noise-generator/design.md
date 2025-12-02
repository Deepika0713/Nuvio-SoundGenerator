# Design Document

## Overview

Nuvio is a browser-based ambient noise generator built with modern web technologies. The application uses the Web Audio API for sound mixing and playback, React for UI components, and browser local storage for persistence. The architecture emphasizes modularity, with clear separation between audio engine, state management, UI components, and storage layers.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React UI Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Header  │  │   Grid   │  │  Control │             │
│  │Component │  │Components│  │   Bar    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────────┐
│              State Management (Context API)              │
│  - Sound States    - Volume Levels    - Timer State     │
│  - Theme State     - Saved Mixes                        │
└─────────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────────┐
│                   Audio Engine Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Web Audio API│  │ Sound Manager│  │ Mix Controller│ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────────────┐
│                   Storage Layer                          │
│  - Local Storage API  - Mix Serialization               │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Audio Processing**: Web Audio API
- **State Management**: React Context API with useReducer
- **Styling**: CSS Modules with CSS Variables for theming
- **Storage**: Browser Local Storage API
- **Build Tool**: Vite
- **Testing**: Vitest for unit tests, fast-check for property-based testing

## Components and Interfaces

### Audio Engine

#### SoundManager Interface

```typescript
interface SoundManager {
  loadSound(id: string, url: string): Promise<void>;
  playSound(id: string): void;
  pauseSound(id: string): void;
  setSoundVolume(id: string, volume: number): void;
  setMasterVolume(volume: number): void;
  isPlaying(id: string): boolean;
  stopAll(): void;
  pauseAll(): void;
  resumeAll(): void;
}
```

The SoundManager uses Web Audio API's AudioContext, GainNode for volume control, and AudioBufferSourceNode for playback. Each sound has its own GainNode connected to a master GainNode, enabling independent and master volume control.

#### Sound Definition

```typescript
interface Sound {
  id: string;
  name: string;
  category: SoundCategory;
  icon: string;
  audioUrl: string;
}

type SoundCategory = 'nature' | 'city' | 'work' | 'noise' | 'relaxation';
```

### State Management

#### Application State

```typescript
interface AppState {
  sounds: Map<string, SoundState>;
  masterVolume: number;
  theme: 'light' | 'dark';
  timer: TimerState | null;
  savedMixes: SavedMix[];
}

interface SoundState {
  id: string;
  isPlaying: boolean;
  volume: number;
}

interface TimerState {
  duration: number; // in milliseconds
  remaining: number;
  isActive: boolean;
}

interface SavedMix {
  id: string;
  name: string;
  sounds: Array<{ id: string; volume: number }>;
  createdAt: number;
}
```

### UI Components

#### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── ThemeToggle
├── SoundGrid
│   ├── CategoryHeader (×5)
│   └── SoundCard (×20)
│       ├── SoundIcon
│       ├── PlayPauseButton
│       ├── VolumeSlider
│       └── AnimationRing
├── ControlBar
│   ├── MasterPlayPause
│   ├── MasterVolumeSlider
│   ├── TimerDropdown
│   ├── SaveMixButton
│   └── ResetButton
├── SavedMixesPanel
│   ├── MixList
│   │   └── MixItem (×n)
│   │       ├── LoadButton
│   │       └── DeleteButton
│   └── SaveNewMixForm
└── Footer
```

## Data Models

### Sound Catalog

The application includes 20 predefined sounds:

**Nature (6)**
- rain, thunderstorm, ocean, forest, waterfall, wind

**City/Public (4)**
- cafe, library, train, street-market

**Work/Tech (4)**
- keyboard, office, server-room, mouse-clicks

**Background Noise (4)**
- brown-noise, white-noise, pink-noise, fireplace

**Mind & Relaxation (2)**
- meditation-bowl, deep-breathing

### Local Storage Schema

```typescript
// Key: 'nuvio-theme'
type ThemeStorage = 'light' | 'dark';

// Key: 'nuvio-saved-mixes'
interface SavedMixesStorage {
  mixes: SavedMix[];
}

// Key: 'nuvio-last-state'
interface LastStateStorage {
  masterVolume: number;
  soundStates: Array<{ id: string; volume: number }>;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Sound Playback Properties

Property 1: Play action starts sound
*For any* sound ID in the catalog, when the play action is triggered, the sound state should be marked as playing.
**Validates: Requirements 1.1**

Property 2: Pause action stops sound
*For any* playing sound, when the pause action is triggered, the sound state should be marked as not playing.
**Validates: Requirements 1.2**

Property 3: Playing state shows animation
*For any* sound card component, when the sound's isPlaying state is true, the component should render an animation ring element.
**Validates: Requirements 1.4**

### Volume Control Properties

Property 4: Volume adjustment updates state
*For any* sound and any volume value between 0 and 1, adjusting the sound's volume should update the state to reflect that exact volume value.
**Validates: Requirements 2.1**

Property 5: Master volume scales proportionally
*For any* set of sounds with different individual volumes, changing the master volume should maintain the relative proportions between individual sound volumes.
**Validates: Requirements 2.2**

Property 6: Volume adjustment doesn't trigger playback
*For any* stopped sound, adjusting its volume should not change its playing state to true.
**Validates: Requirements 2.3**

Property 7: Stop/start preserves volume
*For any* sound with a specific volume setting, stopping and then restarting the sound should maintain the same volume value.
**Validates: Requirements 2.4**

Property 8: Master volume zero preserves individual settings
*For any* set of sounds with individual volume settings, setting master volume to zero and then back to a non-zero value should restore all individual volume settings unchanged.
**Validates: Requirements 2.5**

### Mix Persistence Properties

Property 9: Save/load mix round-trip
*For any* application state with active sounds and volume levels, saving as a mix and then loading that mix should restore the exact same sound states and volume levels.
**Validates: Requirements 3.1, 3.3**

Property 10: Mix name association
*For any* mix name string, when saving a mix with that name, the saved mix object should contain that exact name.
**Validates: Requirements 3.2**

Property 11: Mix deletion removes from storage
*For any* saved mix, after deletion, querying the saved mixes list should not include that mix.
**Validates: Requirements 3.4**

Property 12: Saved mixes panel displays all mixes
*For any* set of saved mixes in storage, rendering the saved mixes panel should display all mix names from storage.
**Validates: Requirements 3.5**

### Timer Properties

Property 13: Timer initialization sets duration
*For any* valid timer duration (15min, 30min, 1hr, 2hr), selecting that duration should create an active timer with remaining time equal to the selected duration.
**Validates: Requirements 4.1**

Property 14: Timer expiration stops sounds
*For any* application state with playing sounds and an active timer, when the timer reaches zero, all sounds should be in a non-playing state.
**Validates: Requirements 4.2**

Property 15: Active timer displays remaining time
*For any* active timer state, the timer component should render the remaining time value.
**Validates: Requirements 4.3**

Property 16: Timer duration change resets countdown
*For any* active timer, changing to a different duration should update the remaining time to equal the new duration.
**Validates: Requirements 4.4**

Property 17: Stop all cancels timer
*For any* active timer, executing the stop all sounds action should set the timer state to inactive.
**Validates: Requirements 4.5**

### Master Control Properties

Property 18: Master pause/resume round-trip
*For any* set of playing sounds, executing master pause followed by master resume should restore all sounds to their playing state.
**Validates: Requirements 5.1, 5.2**

Property 19: Reset returns to initial state
*For any* application state, executing the reset action should set all sounds to not playing and all volumes to their default values.
**Validates: Requirements 5.3**

### Theme Properties

Property 20: Theme toggle round-trip
*For any* current theme (light or dark), toggling the theme twice should return to the original theme.
**Validates: Requirements 6.1**

Property 21: Theme persistence round-trip
*For any* theme selection, saving the theme to storage and then loading it should restore the same theme value.
**Validates: Requirements 6.4, 6.5**

### UI Structure Properties

Property 22: Sound cards grouped by category
*For any* rendered sound grid, sounds should appear in groups where all sounds in each group share the same category.
**Validates: Requirements 7.2**

Property 23: Sound card contains required elements
*For any* rendered sound card, the component should contain an icon element, name text, play/pause button, and volume slider.
**Validates: Requirements 7.3**

## Error Handling

### Audio Loading Errors

- **Failed Audio Load**: If an audio file fails to load, display an error indicator on the sound card and disable the play button. Log the error to console for debugging.
- **Unsupported Format**: If the browser doesn't support the audio format, show a "Not supported" message on the sound card.
- **Network Timeout**: If audio loading times out (>10 seconds), retry once, then show error state.

### Storage Errors

- **Quota Exceeded**: If local storage quota is exceeded when saving mixes, show a notification asking the user to delete old mixes. Provide the count of saved mixes.
- **Storage Unavailable**: If local storage is disabled or unavailable, show a warning banner and disable save/load functionality. The app should still function for the current session.
- **Corrupted Data**: If saved mix data is corrupted or invalid, skip that mix and log a warning. Don't crash the application.

### Audio Context Errors

- **Suspended Context**: If AudioContext is suspended (common on mobile), show a "Tap to enable audio" overlay. Resume context on user interaction.
- **Context Creation Failed**: If AudioContext creation fails, show an error message explaining that audio is not available and suggest trying a different browser.

### Timer Errors

- **Invalid Duration**: If an invalid timer duration is provided, default to 30 minutes and log a warning.
- **Timer Drift**: Use `Date.now()` comparisons rather than interval counting to prevent timer drift. Recalculate remaining time on each update.

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples and edge cases:

- **Sound Catalog**: Verify the catalog contains exactly 20 sounds with correct categories
- **Theme Colors**: Verify light mode uses #F5F6FA and dark mode uses #0F0F0F
- **Grid Layout**: Verify the grid renders with 4 columns and 5 rows
- **Edge Cases**: 
  - Master play with no previously playing sounds does nothing
  - Empty mix name handling
  - Volume slider boundary values (0 and 1)
  - Timer with zero duration

### Property-Based Testing

Property-based tests will use **fast-check** (JavaScript/TypeScript PBT library) to verify universal properties across many randomly generated inputs.

**Configuration**:
- Each property test should run a minimum of 100 iterations
- Each test must include a comment tag in this format: `**Feature: nuvio-noise-generator, Property {number}: {property_text}**`
- Tests should use smart generators that constrain inputs to valid ranges (e.g., volume 0-1, valid sound IDs)

**Test Organization**:
- Group tests by domain: `soundPlayback.test.ts`, `volumeControl.test.ts`, `mixPersistence.test.ts`, `timer.test.ts`, `masterControls.test.ts`, `theme.test.ts`, `ui.test.ts`
- Each correctness property maps to exactly one property-based test
- Tests should focus on state management and business logic, not Web Audio API internals

**Generators**:
- `soundIdGenerator`: Generates valid sound IDs from the catalog
- `volumeGenerator`: Generates values between 0 and 1
- `soundStateGenerator`: Generates valid sound state objects
- `mixGenerator`: Generates valid mix configurations
- `timerDurationGenerator`: Generates valid timer durations

### Integration Testing

- Test the complete flow: play sounds → adjust volumes → save mix → load mix
- Test timer integration: start timer → wait for expiration → verify sounds stopped
- Test theme persistence: change theme → reload app → verify theme restored
- Test master controls: play multiple sounds → master pause → master resume

### Manual Testing Checklist

- Audio playback quality across different browsers (Chrome, Firefox, Safari)
- Visual appearance in light and dark modes
- Responsive layout on different screen sizes
- Keyboard navigation and accessibility
- Performance with all 20 sounds playing simultaneously

## Implementation Notes

### Web Audio API Usage

- Create a single `AudioContext` instance for the entire application
- Use `AudioBufferSourceNode` for looping playback (set `loop = true`)
- Create a `GainNode` for each sound and connect to a master `GainNode`
- Connect master `GainNode` to `AudioContext.destination`
- Preload all audio files on application initialization using `fetch` and `AudioContext.decodeAudioData`

### Performance Considerations

- Use `React.memo` for sound card components to prevent unnecessary re-renders
- Debounce volume slider changes to reduce state updates
- Use CSS transforms for animations (GPU-accelerated)
- Lazy load the saved mixes panel (only render when opened)
- Use `requestAnimationFrame` for timer updates

### Accessibility

- Ensure all interactive elements are keyboard accessible
- Provide ARIA labels for icon buttons
- Use semantic HTML elements
- Ensure sufficient color contrast in both themes
- Provide visual focus indicators
- Support screen readers with appropriate ARIA attributes

### Browser Compatibility

- Target modern browsers with Web Audio API support (Chrome 35+, Firefox 25+, Safari 14.1+, Edge 79+)
- Provide fallback message for unsupported browsers
- Test autoplay policies (some browsers require user interaction before playing audio)
- Handle vendor prefixes for Web Audio API if needed

### File Structure

```
src/
├── components/
│   ├── Header/
│   ├── SoundGrid/
│   │   ├── SoundCard.tsx
│   │   ├── CategoryHeader.tsx
│   │   └── AnimationRing.tsx
│   ├── ControlBar/
│   ├── SavedMixesPanel/
│   └── Footer/
├── context/
│   └── AppContext.tsx
├── audio/
│   ├── SoundManager.ts
│   ├── audioEngine.ts
│   └── soundCatalog.ts
├── storage/
│   ├── localStorage.ts
│   └── serialization.ts
├── hooks/
│   ├── useTimer.ts
│   ├── useTheme.ts
│   └── useSoundManager.ts
├── types/
│   └── index.ts
└── utils/
    └── constants.ts
```
