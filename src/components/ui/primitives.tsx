import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Animated, Easing, Pressable, type PressableProps, ScrollView, type ScrollViewProps, StyleSheet, Text,
  type TextProps, type TextStyle, View, type ViewProps, type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';
import { Icon, type IconName } from './Icon';

/* ------------------------------------------------------------------ text -- */

type TypeVariant = 'display' | 'h1' | 'h2' | 'h3' | 'bodyLg' | 'body' | 'bodySm' | 'caption' | 'label';

interface TxtProps extends TextProps {
  variant?: TypeVariant;
  /** Any palette key, e.g. "textPrimary". */
  color?: string;
  weight?: TextStyle['fontWeight'];
  size?: number;
  align?: TextStyle['textAlign'];
  lineHeight?: number;
  /** For a standalone stat figure (XP, streak, a percentage) rather than a
   *  number sitting inside a sentence: fixed-width tabular digits (so they
   *  don't jiggle width during a count-up animation), tighter tracking, and
   *  a heavier default weight — reads as a deliberate display figure
   *  instead of body text that happens to be a number. An explicit `weight`
   *  still wins over the default this sets. */
  numeric?: boolean;
}

/**
 * All text goes through here so the type ramp and colours stay consistent and
 * system font scaling keeps working.
 */
export function Txt({
  variant = 'body', color, weight, size, align, lineHeight, numeric = false, style, ...rest
}: TxtProps) {
  const t = useTheme();
  const base = t.type[variant];
  return (
    <Text
      style={[
        {
          fontSize: size ?? base.fontSize,
          fontWeight: weight ?? (base.fontWeight as TextStyle['fontWeight']),
          color: color ?? t.colors.textPrimary,
          textAlign: align,
          lineHeight,
          letterSpacing: 'letterSpacing' in base ? base.letterSpacing : undefined,
          // Tried heavier weight (800) + tight tracking (-0.5, then -0.2) for
          // these stat numbers — both read as too heavy/crowded rather than
          // "premium". Down to just tabular figures now: fixed-width digits
          // so a count-up animation doesn't jiggle, without touching weight
          // or spacing at all.
          fontVariant: numeric ? ['tabular-nums'] : undefined,
        },
        style,
      ]}
      {...rest}
    />
  );
}

/* --------------------------------------------------------------- screens -- */

interface ScreenProps extends ViewProps {
  /** Background colour; defaults to the theme background. */
  bg?: string;
  edges?: Edge[];
}

export function Screen({ bg, edges = ['top'], style, children, ...rest }: ScreenProps) {
  const t = useTheme();
  const base = bg ?? t.colors.bg;
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: base }}>
      {/* A hint of colour at the top fading into the plain background — still
          a gradient, not a flat tint, just a stronger and slightly longer
          one than before. */}
      <LinearGradient
        colors={[`${t.colors.sage100}CC`, base]}
        locations={[0, 0.55]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: '60%' }}
        pointerEvents="none"
      />
      <View style={[{ flex: 1 }, style]} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}

export function ScreenScroll({ contentContainerStyle, ...rest }: ScrollViewProps) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{ paddingBottom: 24 }, contentContainerStyle]}
      {...rest}
    />
  );
}

/* ----------------------------------------------------------------- cards -- */

interface CardProps extends ViewProps {
  /** Mockup uses sage50 with a sage100 hairline for most cards. */
  bg?: string;
  borderColor?: string;
  radius?: number;
  padding?: number;
  gap?: number;
}

export function Card({
  bg, borderColor, radius, padding = 16, gap, style, children, ...rest
}: CardProps) {
  const t = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: bg ?? t.colors.sage50,
          borderRadius: radius ?? t.radius.lg,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: borderColor ?? t.colors.sage100,
          padding,
          gap,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

/* --------------------------------------------------------------- buttons -- */

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  fullWidth?: boolean;
  style?: ViewStyle;
}

/**
 * The mockup draws its primary button with a 3px hard shadow underneath —
 * the Duolingo-style "pressable slab". We reproduce it with a bottom border
 * that collapses on press, which also gives real tactile feedback.
 */
export function Button({
  label, variant = 'primary', icon, fullWidth = true, disabled, style, ...rest
}: ButtonProps) {
  const t = useTheme();

  const palette = {
    primary: { bg: t.colors.accent, edge: t.colors.accentDark, fg: t.colors.textInverse },
    secondary: { bg: t.colors.surface, edge: t.colors.border, fg: t.colors.textPrimary },
    ghost: { bg: 'transparent', edge: 'transparent', fg: t.colors.textSecondary },
    danger: { bg: t.colors.error, edge: t.colors.terracottaDark, fg: '#FFFFFF' },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: palette.bg,
          borderRadius: t.radius.button,
          borderBottomWidth: variant === 'ghost' ? 0 : 3,
          borderBottomColor: palette.edge,
          paddingVertical: 14,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.45 : 1,
          transform: [{ translateY: pressed && !disabled ? 2 : 0 }],
          borderBottomLeftRadius: t.radius.button,
          borderBottomRightRadius: t.radius.button,
        },
        style,
      ]}
      {...rest}
    >
      {icon ? <Icon name={icon} size={18} color={palette.fg} /> : null}
      <Txt size={15} weight="700" color={palette.fg}>
        {label}
      </Txt>
    </Pressable>
  );
}

/* ----------------------------------------------------------------- pills -- */

interface PillProps {
  icon: IconName;
  label: string;
  bg?: string;
  iconColor?: string;
  flex?: boolean;
}

/** Streak / XP pill from the dashboard header. */
export function Pill({ icon, label, bg, iconColor, flex = true }: PillProps) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: bg ?? t.colors.amber50,
        flex: flex ? 1 : undefined,
      }}
    >
      <Icon name={icon} size={18} color={iconColor ?? t.colors.amber} />
      <Txt size={13} weight="600">
        {label}
      </Txt>
    </View>
  );
}

/* -------------------------------------------------------------- progress -- */

interface ProgressBarProps {
  /** 0..1 */
  value: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
}

export function ProgressBar({ value, height = 8, trackColor, fillColor }: ProgressBarProps) {
  const t = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  // Plain state (not Animated.View) drives the width: `Animated.createAnimatedComponent`
  // force-injects a `collapsable` prop meant for the native driver, which
  // react-native-web then leaks onto the DOM as an invalid attribute.
  const [renderedPct, setRenderedPct] = React.useState(0);

  React.useEffect(() => {
    setRenderedPct(0);
    const progress = new Animated.Value(0);
    const id = progress.addListener(({ value: v }) => setRenderedPct(v));
    Animated.timing(progress, {
      toValue: pct,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => progress.removeListener(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct]);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: trackColor ?? t.colors.sage100,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <View
        style={{
          width: `${renderedPct * 100}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: fillColor ?? t.colors.success,
        }}
      />
    </View>
  );
}

/* ----------------------------------------------------------------- misc --- */

export function Divider({ color }: { color?: string }) {
  const t = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: color ?? t.colors.border }} />;
}

export function Row({ style, ...rest }: ViewProps) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]} {...rest} />;
}

export function Spacer({ size = 16 }: { size?: number }) {
  return <View style={{ height: size }} />;
}
