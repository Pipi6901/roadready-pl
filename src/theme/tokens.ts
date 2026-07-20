/**
 * Design tokens extracted from the Pencil mockup (screens.pen).
 *
 * Light values are byte-exact with the mockup so the implementation matches the
 * design pixel for pixel. Dark values are derived (no dark mockup exists) and
 * verified against WCAG AA — see docs/04-design-system.md.
 *
 * NEVER hardcode a colour in a component. Always go through useTheme().
 */

export type ThemeName = 'light' | 'dark';

export interface Palette {
  // Brand green
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary500: string;
  primary600: string;
  primary700: string;

  // Deep blue — headers, topic map, inverse blocks
  blue800: string;
  blue900: string;
  /** Foreground (icons, letters) drawn ON sage/surfaceAlt fills. In light mode
   *  this equals blue800; in dark mode it must invert, or it goes unreadable. */
  onSurfaceAlt: string;
  /** Foreground drawn ON the deep-blue brand fill (avatars, logo badge, topic
   *  nodes). Light in BOTH themes — the fill stays dark either way, so this must
   *  not follow textInverse, which flips to near-black in dark mode. */
  onBlue: string;

  // Surfaces
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textInverseMuted: string;
  textInverseFaint: string;

  // Accents
  accent: string;
  accentDark: string;
  accentLight: string;
  amber: string;
  amberDark: string;
  amber50: string;

  // Sage / ice — card backgrounds on the blue side of the palette
  sage50: string;
  sage100: string;
  sage200: string;

  // States
  success: string;
  successDark: string;
  successBg: string;
  successText: string;
  error: string;
  errorBg: string;
  warning: string;

  // Topic map decoration
  routeLine: string;
  decoration: string;
  decorationMuted: string;
  nodeCompleted: string;
  nodeCurrent: string;

  // Overlays on dark backgrounds
  overlayOnDark: string;
  overlayOnDarkBorder: string;

  // Misc accent used by "wrong answer" and warning cards
  terracotta: string;
  terracottaDark: string;
  terracotta50: string;
}

const light: Palette = {
  primary50: '#EAF7EE',
  primary100: '#CFEEDA',
  primary200: '#A7DFBB',
  primary300: '#7FD09E',
  primary500: '#22A559',
  primary600: '#178A46',
  primary700: '#0F6B36',

  blue800: '#123A5C',
  blue900: '#0B2A44',
  onSurfaceAlt: '#123A5C',
  onBlue: '#FFFFFF',

  bg: '#F7FAF8',
  surface: '#FFFFFF',
  surfaceAlt: '#EAF3FA',
  border: '#E6ECE8',

  textPrimary: '#16241D',
  textSecondary: '#6B7280',
  textMuted: '#9CA6A0',
  textInverse: '#FFFFFF',
  textInverseMuted: '#FFFFFFB3',
  textInverseFaint: '#FFFFFF66',

  accent: '#3FA0E0',
  accentDark: '#2679AD',
  accentLight: '#A8DC7A',
  amber: '#D9A441',
  amberDark: '#B9832E',
  amber50: '#FBF0DC',

  sage50: '#EAF3FA',
  sage100: '#D9E9F5',
  sage200: '#C5DCEC',

  success: '#7CC443',
  successDark: '#5B9934',
  successBg: '#F1F8EA',
  successText: '#4A7F2A',
  error: '#EF4444',
  errorBg: '#FDECEC',
  warning: '#F5A623',

  routeLine: '#D7E4EE',
  decoration: '#B7CCDD',
  decorationMuted: '#0E3B2C1F',
  nodeCompleted: '#1D5C8C',
  nodeCurrent: '#7DC3ED',

  overlayOnDark: '#FFFFFF26',
  overlayOnDarkBorder: '#FFFFFF40',

  terracotta: '#D9643C',
  terracottaDark: '#B84F2C',
  terracotta50: '#FBEAE3',
};

const dark: Palette = {
  primary50: '#16251C',
  primary100: '#1D3427',
  primary200: '#265138',
  primary300: '#2E7A4C',
  primary500: '#22A559',
  primary600: '#34C46F',
  primary700: '#178A46',

  blue800: '#16324B',
  blue900: '#0E2439',
  onSurfaceAlt: '#BFD8EC',
  onBlue: '#FFFFFF',

  bg: '#101613',
  surface: '#1A231F',
  surfaceAlt: '#212C27',
  border: '#33413B',

  textPrimary: '#ECF2EE',
  textSecondary: '#A3B0A9',
  textMuted: '#7C8A84',
  textInverse: '#08120C',
  textInverseMuted: '#08120CB3',
  textInverseFaint: '#08120C66',

  accent: '#5BB4EE',
  accentDark: '#3D8FC4',
  accentLight: '#8FCF6A',
  amber: '#E8B85A',
  amberDark: '#C29237',
  amber50: '#2A2114',

  sage50: '#1A2630',
  sage100: '#22323F',
  sage200: '#2C4051',

  success: '#7CC443',
  successDark: '#5B9934',
  successBg: '#1A2513',
  successText: '#9BD46B',
  error: '#F87171',
  errorBg: '#2A1212',
  warning: '#FBBF24',

  routeLine: '#2A3B49',
  decoration: '#3A4E5E',
  decorationMuted: '#ECF2EE14',
  nodeCompleted: '#3D8FC4',
  nodeCurrent: '#5BB4EE',

  overlayOnDark: '#FFFFFF1A',
  overlayOnDarkBorder: '#FFFFFF33',

  terracotta: '#E07E5C',
  terracottaDark: '#B84F2C',
  terracotta50: '#2A1A14',
};

export const palettes: Record<ThemeName, Palette> = { light, dark };

/** Corner radii, straight from the mockup variables. */
export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  button: 12,
  pill: 999,
} as const;

/** Spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/**
 * Type ramp. The mockup uses Inter; we render with the system font instead
 * (SF Pro on iOS, Roboto on Android) — see docs/04-design-system.md §4.
 */
export const type = {
  display: { fontSize: 40, fontWeight: '700' },
  h1: { fontSize: 26, fontWeight: '700' },
  h2: { fontSize: 22, fontWeight: '700' },
  h3: { fontSize: 19, fontWeight: '600' },
  bodyLg: { fontSize: 17, fontWeight: '400' },
  body: { fontSize: 15, fontWeight: '400' },
  bodySm: { fontSize: 13, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
  label: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
} as const;

/**
 * Accessibility overrides.
 *
 * The mockup palette fails WCAG AA in several places (white on the green
 * button is 3.18:1, textMuted is 2.51:1). These are the verified replacements
 * from docs/04-design-system.md §1. They are NOT applied by default because the
 * current build reproduces the mockup exactly — flip A11Y_MODE to adopt them.
 */
export const a11yOverrides: Partial<Palette> = {
  textMuted: '#68746E',
  error: '#DC2626',
  warning: '#96681C',
  amber: '#B9832E',
  successText: '#4A7F2A',
  accent: '#1F79BC',
  accentDark: '#155B8F',
};

export const A11Y_MODE = false;

export function getPalette(theme: ThemeName): Palette {
  const base = palettes[theme];
  return A11Y_MODE && theme === 'light' ? { ...base, ...a11yOverrides } : base;
}
