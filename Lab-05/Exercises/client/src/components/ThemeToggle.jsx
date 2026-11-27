import { SunMoon } from 'lucide-react';
import { useAppDispatch } from '../context/AppProvider';

export function ThemeToggle() {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className="touch-btn"
      aria-label="Toggle dark and light theme"
      onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
    >
      <SunMoon size={20} />
    </button>
  );
}