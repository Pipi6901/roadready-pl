import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

const DURATION_MS = 700;

interface BurstProps {
  /** Flips false -> true to fire a burst (e.g. once a count-up lands on a perfect score). */
  active: boolean;
  count?: number;
  colors?: string[];
  size?: number;
  distance?: number;
}

/**
 * Small particles that fly outward and fade — celebrates hitting a max value.
 *
 * Driven by a plain `progress` state (0..1), not `Animated.View`:
 * `Animated.createAnimatedComponent` force-injects a `collapsable` prop meant
 * for the native driver, which react-native-web then leaks onto the DOM as an
 * invalid attribute.
 */
export function Burst({ active, count = 10, colors, size = 5, distance = 30 }: BurstProps) {
  const t = useTheme();
  const [particles, setParticles] = React.useState<{ id: number; angle: number; color: string; dist: number }[]>([]);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!active) return;
    const palette = colors ?? [t.colors.amber, t.colors.accent, t.colors.success];
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
        color: palette[i % palette.length],
        dist: distance * (0.7 + Math.random() * 0.6),
      })),
    );
    setProgress(0);

    const anim = new Animated.Value(0);
    const id = anim.addListener(({ value: v }) => setProgress(v));
    Animated.timing(anim, {
      toValue: 1,
      duration: DURATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(({ finished }) => {
      anim.removeListener(id);
      if (finished) setParticles([]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!particles.length) return null;

  const opacity = progress < 0.7 ? 1 : 1 - (progress - 0.7) / 0.3;
  const scale = 1 - progress * 0.6;

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}
    >
      {particles.map((p) => (
        <View
          key={p.id}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: p.color,
            opacity,
            transform: [
              { translateX: progress * Math.cos(p.angle) * p.dist },
              { translateY: progress * Math.sin(p.angle) * p.dist },
              { scale },
            ],
          }}
        />
      ))}
    </View>
  );
}
