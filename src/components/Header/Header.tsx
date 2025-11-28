import { useTheme } from '../../hooks/useTheme';
import './Header.css';

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>Nuvio</h1>
          <p>Ambient Noise Generator</p>
        </div>
        
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
