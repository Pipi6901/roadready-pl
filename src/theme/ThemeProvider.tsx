import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { getPalette, radius, spacing, type, type Palette, type ThemeName } from './tokens';

export interface Theme {
  name: ThemeName;
  colors: Palette;
  radius: typeof radius;
  spacing: typeof spacing;
  type: typeof type;
  isDark: boolean;
}

const ThemeContext = createContext<Theme | null>(null);

export type ThemeMode = ThemeName | 'system';

/**
 * `mode` comes from Settings (see SettingsProvider.themeMode); 'system'
 * follows the OS switch the way the app always did before the setting
 * existed.
 */
export function ThemeProvider({ mode = 'system', children }: { mode?: ThemeMode; children: React.ReactNode }) {
  const scheme = useColorScheme();
  const name: ThemeName = mode === 'system' ? (scheme === 'dark' ? 'dark' : 'light') : mode;

  const value = useMemo<Theme>(
    () => ({
      name,
      colors: getPalette(name),
      radius,
      spacing,
      type,
      isDark: name === 'dark',
    }),
    [name],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
