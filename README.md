# Nuvio - Ambient Noise Generator

A beautiful web-based ambient noise generator for focus, relaxation, and sleep. Mix 20 curated sounds across 5 categories with individual volume controls, save your favorite combinations, and set timers for automatic playback stopping.

## ✨ Features

- **20 Ambient Sounds** across 5 categories:
  - 🌲 Nature (6 sounds): Rain, Thunderstorm, Ocean, Forest, Waterfall, Wind
  - 🏙️ City/Public (4 sounds): Cafe, Library, Train, Street Market
  - 💼 Work/Tech (4 sounds): Keyboard, Office, Server Room, Mouse Clicks
  - 🔊 Background Noise (4 sounds): Brown, White, Pink Noise, Fireplace
  - 🧘 Mind & Relaxation (2 sounds): Meditation Bowl, Deep Breathing

- **Individual & Master Controls**
  - Play/pause each sound independently
  - Individual volume sliders for precise mixing
  - Master volume control for overall output
  - Master pause/resume to quickly silence all sounds

- **Mix Management**
  - Save your favorite sound combinations
  - Load saved mixes instantly
  - Delete unwanted mixes
  - Persistent storage across sessions

- **Timer Functionality**
  - Set automatic stop timers (15min, 30min, 1hr, 2hr)
  - Perfect for sleep or timed focus sessions
  - Visual countdown display

- **Theme Support**
  - Light and dark modes
  - Smooth theme transitions
  - Persistent theme preference

- **Responsive Design**
  - Works on desktop, tablet, and mobile
  - Touch-friendly controls
  - Adaptive grid layout

- **Accessibility**
  - Full keyboard navigation
  - ARIA labels for screen readers
  - Focus indicators
  - Semantic HTML

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Run tests:**
```bash
npm test
```

4. **Run tests in watch mode:**
```bash
npm run test:watch
```

5. **Build for production:**
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # React UI components
│   ├── Header/         # App header with theme toggle
│   ├── SoundCard/      # Individual sound control
│   ├── SoundGrid/      # Grid layout with categories
│   ├── ControlBar/     # Master controls and timer
│   ├── SavedMixesPanel/# Mix management panel
│   ├── Footer/         # App footer
│   └── ErrorBoundary/  # Error handling
├── context/            # React Context for state management
├── audio/              # Web Audio API sound engine
├── storage/            # Local storage persistence
├── hooks/              # Custom React hooks
│   ├── useTimer.ts    # Timer functionality
│   ├── useMixManager.ts # Mix operations
│   └── useTheme.ts    # Theme management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
└── test/               # Test setup and utilities
```

## 🛠️ Tech Stack

- **React 18** - UI framework with hooks
- **TypeScript** - Type safety with strict mode
- **Vite** - Lightning-fast build tool and dev server
- **Web Audio API** - Professional audio playback and mixing
- **CSS Variables** - Dynamic theming
- **Vitest** - Modern unit testing framework
- **fast-check** - Property-based testing library
- **@testing-library/react** - React component testing utilities

## 🧪 Testing

The project uses a comprehensive dual testing approach:

### Unit Tests
- Specific examples and edge cases
- Component rendering and behavior
- Integration between modules

### Property-Based Tests
- Universal correctness properties
- 100+ iterations per property
- Validates behavior across all inputs
- Tests include:
  - Sound playback properties
  - Volume control properties
  - Mix persistence properties
  - Timer functionality properties
  - Theme persistence properties

Run tests with:
```bash
npm test                # Run all tests once
npm run test:watch      # Run tests in watch mode
```

## 🎨 Architecture

### State Management
- **React Context + useReducer** for global state
- Centralized actions for all state changes
- Persistent storage integration

### Audio Engine
- **Web Audio API** for professional audio mixing
- Individual GainNodes for each sound
- Master GainNode for overall volume control
- Looping audio buffers for seamless playback

### Storage Layer
- **Local Storage** for persistence
- Theme preferences
- Saved mixes
- Error handling for quota exceeded

### Performance
- **React.memo** for optimized re-renders
- **requestAnimationFrame** for smooth timer updates
- **CSS transforms** for GPU-accelerated animations
- Lazy loading for panels

## 🎯 Browser Support

- Chrome 35+
- Firefox 25+
- Safari 14.1+
- Edge 79+

Requires Web Audio API support.

## 📝 License

MIT

## 🙏 Acknowledgments

Built with care for focus, relaxation, and sleep.
