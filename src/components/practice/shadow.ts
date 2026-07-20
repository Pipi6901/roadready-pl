import type { ViewStyle } from 'react-native';

import type { Theme } from '@/theme/ThemeProvider';

/**
 * The mockup's card shadow (#0B2A44 at ~8%, y+4, blur 18). Pencil's blur is a
 * Gaussian diameter, RN's shadowRadius is roughly half of it.
 */
export function cardShadow(t: Theme, blur = 18, y = 4, opacity = 0.08): ViewStyle {
  return {
    shadowColor: t.colors.blue900,
    shadowOpacity: t.isDark ? 0 : opacity,
    shadowOffset: { width: 0, height: y },
    shadowRadius: blur / 2,
    elevation: t.isDark ? 0 : Math.round(y),
  };
}
