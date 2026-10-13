import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/context/PageContext';

/** Returns the active palette (dark by default, user-toggleable in Profile). */
export function useTheme() {
  const { themeMode } = useAppTheme();
  return Colors[themeMode];
}
