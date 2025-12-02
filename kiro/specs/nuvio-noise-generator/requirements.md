# Requirements Document

## Introduction

Nuvio is a web-based noise generator application that allows users to mix and play calming sounds to improve focus, sleep, or relaxation. The application provides a curated collection of 20 ambient sounds across multiple categories (Nature, City/Public, Work/Tech, Background Noise, and Mind & Relaxation), with individual volume controls, mix saving capabilities, and timer functionality.

## Glossary

- **Sound Card**: A UI component representing a single sound source with play/pause control and volume slider
- **Mix**: A combination of multiple sounds playing simultaneously with their respective volume levels
- **Master Controls**: Global controls that affect all sounds collectively
- **Preset**: A saved mix configuration that can be loaded later
- **Timer**: A countdown feature that automatically stops playback after a specified duration
- **Theme Toggle**: A control that switches between light and dark visual modes

## Requirements

### Requirement 1

**User Story:** As a user, I want to play individual sounds from different categories, so that I can create a personalized ambient soundscape.

#### Acceptance Criteria

1. WHEN a user clicks the play button on a Sound Card THEN the Nuvio SHALL start playing that sound and display a visual indicator
2. WHEN a user clicks the pause button on an active Sound Card THEN the Nuvio SHALL stop playing that sound and remove the visual indicator
3. WHEN multiple sounds are playing simultaneously THEN the Nuvio SHALL mix all active sounds together without audio distortion
4. WHEN a sound is playing THEN the Nuvio SHALL display an animation ring around the Sound Card
5. THE Nuvio SHALL provide exactly 20 sounds organized into 5 categories: Nature (6 sounds), City/Public (4 sounds), Work/Tech (4 sounds), Background Noise (4 sounds), and Mind & Relaxation (2 sounds)

### Requirement 2

**User Story:** As a user, I want to control the volume of individual sounds and overall playback, so that I can balance the mix to my preference.

#### Acceptance Criteria

1. WHEN a user adjusts a Sound Card volume slider THEN the Nuvio SHALL change that sound's volume level immediately
2. WHEN a user adjusts the master volume slider THEN the Nuvio SHALL scale all playing sounds proportionally
3. WHEN a sound is not playing THEN the Nuvio SHALL allow volume adjustment without starting playback
4. THE Nuvio SHALL maintain individual volume settings when sounds are stopped and restarted
5. WHEN the master volume is set to zero THEN the Nuvio SHALL mute all sounds while preserving individual volume settings

### Requirement 3

**User Story:** As a user, I want to save my favorite sound combinations, so that I can quickly load them later without manual reconfiguration.

#### Acceptance Criteria

1. WHEN a user saves a mix THEN the Nuvio SHALL store the active sounds and their volume levels to local storage
2. WHEN a user provides a name for a saved mix THEN the Nuvio SHALL associate that name with the mix configuration
3. WHEN a user loads a saved mix THEN the Nuvio SHALL restore all sounds and volume levels to match the saved configuration
4. WHEN a user deletes a saved mix THEN the Nuvio SHALL remove it from local storage and update the saved mixes list
5. WHEN the saved mixes panel is opened THEN the Nuvio SHALL display all previously saved mixes with their names

### Requirement 4

**User Story:** As a user, I want to set a timer for automatic playback stopping, so that I can fall asleep or take timed breaks without manual intervention.

#### Acceptance Criteria

1. WHEN a user selects a timer duration (15 min, 30 min, 1 hr, or 2 hr) THEN the Nuvio SHALL start a countdown
2. WHEN the timer reaches zero THEN the Nuvio SHALL stop all playing sounds automatically
3. WHEN a timer is active THEN the Nuvio SHALL display the remaining time
4. WHEN a user changes the timer duration while one is active THEN the Nuvio SHALL reset the countdown to the new duration
5. WHEN a user stops all sounds manually THEN the Nuvio SHALL cancel any active timer

### Requirement 5

**User Story:** As a user, I want to use master controls to manage all sounds at once, so that I can quickly start, stop, or reset my soundscape.

#### Acceptance Criteria

1. WHEN a user clicks the master play button THEN the Nuvio SHALL resume all previously playing sounds
2. WHEN a user clicks the master pause button THEN the Nuvio SHALL pause all currently playing sounds while preserving their state
3. WHEN a user clicks the reset button THEN the Nuvio SHALL stop all sounds and reset all volume sliders to default values
4. THE Nuvio SHALL maintain the list of which sounds were playing when master pause is activated
5. WHEN no sounds are playing and master play is clicked THEN the Nuvio SHALL take no action

### Requirement 6

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the application comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN a user clicks the theme toggle THEN the Nuvio SHALL switch between light mode and dark mode
2. WHEN light mode is active THEN the Nuvio SHALL use background color #F5F6FA and appropriate light theme colors
3. WHEN dark mode is active THEN the Nuvio SHALL use background color #0F0F0F and appropriate dark theme colors
4. WHEN the theme is changed THEN the Nuvio SHALL persist the preference to local storage
5. WHEN the application loads THEN the Nuvio SHALL apply the user's previously selected theme

### Requirement 7

**User Story:** As a user, I want a clean and organized interface with categorized sounds, so that I can easily find and select the sounds I need.

#### Acceptance Criteria

1. THE Nuvio SHALL display sounds in a grid layout with 4 columns and 5 rows
2. THE Nuvio SHALL group sounds under category headers: Nature, City/Public, Work/Tech, Background Noise, and Mind & Relaxation
3. WHEN a Sound Card is displayed THEN the Nuvio SHALL show an icon, sound name, play/pause button, and volume slider
4. THE Nuvio SHALL apply rounded corners and soft shadows to Sound Cards
5. THE Nuvio SHALL use a gradient accent color (blue to purple) for interactive elements

### Requirement 8

**User Story:** As a user, I want a clean and organized interface with categorized sounds, so that I can easily find and select the sounds I need.
#### Acceptance Criteria

1. WHEN a user interacts with any control THEN the Nuvio SHALL respond within 100 milliseconds
2. WHEN sounds are loaded THEN the Nuvio SHALL preload audio files to prevent playback delays
3. WHEN multiple sounds are playing THEN the Nuvio SHALL maintain smooth audio playback without stuttering
4. WHEN the application starts THEN the Nuvio SHALL display the interface within 2 seconds
5. WHEN local storage operations occur THEN the Nuvio SHALL complete them without blocking the user interface
