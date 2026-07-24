import { useIsFocused } from 'expo-router';
import React from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/ThemeProvider';
import { Burst } from './Burst';
import { Txt } from './primitives';

const FILL_DURATION_MS = 900;

interface ProgressRingProps {
  /** 0..1 */
  value: number;
  size?: number;
  /** Ring thickness. Mockup uses innerRadius 0.72 on a 64px ring ≈ 9px stroke. */
  thickness?: number;
  trackColor?: string;
  fillColor?: string;
  label?: string;
  labelSize?: number;
  /** When both are set, the ring shows an animated "current/max" count-up
   *  label in sync with the fill instead of a static `label`. */
  current?: number;
  max?: number;
}

export function ProgressRing({
  value, size = 64, thickness = 9, trackColor, fillColor, label, labelSize = 14, current, max,
}: ProgressRingProps) {
  const t = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  // A count can overshoot its goal (e.g. an extra lesson past the daily
  // target) — the ring must still read as "done", never "5/3".
  const clampedCurrent = current !== undefined && max !== undefined ? Math.min(current, max) : current;

  const progress = React.useRef(new Animated.Value(0)).current;
  // Plain state (not an Animated-wrapped SVG node) drives the stroke, so no
  // `Animated.createAnimatedComponent` is needed here — that wrapper injects
  // a `collapsable` prop meant for RN Views, which react-native-web then
  // leaks onto the underlying DOM <circle> as an invalid attribute.
  const [renderedPct, setRenderedPct] = React.useState(0);
  const [displayCount, setDisplayCount] = React.useState(0);
  const [burstActive, setBurstActive] = React.useState(false);
  // Screens like Home/Profile/Topics stay mounted across tab switches, so a
  // mount-only effect would only ever play the fill once. Re-keying off
  // focus replays it every time the ring's tab becomes active again, same as
  // a fresh mount would.
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (!isFocused) return;

    progress.setValue(0);
    setRenderedPct(0);
    if (clampedCurrent !== undefined) setDisplayCount(0);
    setBurstActive(false);

    const listenerId = progress.addListener(({ value: v }) => {
      setRenderedPct(v);
      if (clampedCurrent !== undefined) {
        const frac = pct > 0 ? v / pct : 0;
        setDisplayCount(Math.round(frac * clampedCurrent));
      }
    });

    Animated.timing(progress, {
      toValue: pct,
      duration: FILL_DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && clampedCurrent !== undefined && max !== undefined && clampedCurrent >= max && max > 0) {
        setBurstActive(true);
      }
    });

    return () => progress.removeListener(listenerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pct, clampedCurrent, max, isFocused]);

  const strokeDashoffset = circumference * (1 - renderedPct);
  const displayLabel = clampedCurrent !== undefined && max !== undefined ? `${displayCount}/${max}` : label;

  return (
    <View
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={trackColor ?? t.colors.sage100}
          strokeWidth={thickness}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={fillColor ?? t.colors.success}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {displayLabel ? (
        <Txt size={labelSize} numeric>
          {displayLabel}
        </Txt>
      ) : null}
      <Burst active={burstActive} size={4} distance={size * 0.7} />
    </View>
  );
}
