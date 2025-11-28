import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { saveTheme, loadTheme, ThemeStorage } from './localStorage';

describe('Theme Persistence Properties', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  /**
   * **Feature: nuvio-noise-generator, Property 21: Theme persistence round-trip**
   * **Validates: Requirements 6.4, 6.5**
   * 
   * For any theme selection, saving the theme to storage and then loading it 
   * should restore the same theme value.
   */
  it('Property 21: Theme persistence round-trip', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary theme values
        fc.constantFrom('light' as const, 'dark' as const),
        (theme: ThemeStorage) => {
          // Save the theme
          saveTheme(theme);

          // Load the theme
          const loadedTheme = loadTheme();

          // Verify the loaded theme matches the saved theme
          expect(loadedTheme).toBe(theme);
        }
      ),
      { numRuns: 100 }
    );
  });
});
