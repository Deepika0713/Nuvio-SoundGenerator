import { useAppContext, actions } from '../context/AppContext';

/**
 * Custom hook for managing theme
 * Provides current theme and toggle function
 */
export function useTheme() {
  const { state, dispatch } = useAppContext();

  const toggleTheme = () => {
    dispatch(actions.toggleTheme());
  };

  return {
    theme: state.theme,
    toggleTheme,
    isDark: state.theme === 'dark',
  };
}
