import React from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from '@/components/ui/Icon';
import { useTheme } from '@/theme/ThemeProvider';

const DASH = 26;
const GAP = 18;
const PERIOD = DASH + GAP;

/**
 * A car on a road whose centre line streams past — the "please wait" for the
 * mock test's media preload. The car itself stays put and bobs a little; the
 * dashes move, which is what sells speed. Pure transforms, so it stays smooth
 * while the downloads hammer the JS thread.
 */
export function RoadLoader({ width = 260 }: { width?: number }) {
  const t = useTheme();
  const shift = useSharedValue(0);
  const bob = useSharedValue(0);

  React.useEffect(() => {
    shift.value = withRepeat(withTiming(-PERIOD, { duration: 420, easing: Easing.linear }), -1, false);
    bob.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 260, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 260, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    return () => {
      cancelAnimation(shift);
      cancelAnimation(bob);
    };
  }, [shift, bob]);

  const dashesStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shift.value }] }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  // One extra period of dashes on the right so the loop never shows a gap.
  const dashCount = Math.ceil(width / PERIOD) + 2;

  return (
    <View style={{ width, alignItems: 'center', gap: 6 }} accessible accessibilityLabel="Loading" accessibilityRole="progressbar">
      <Animated.View style={[carStyle, { zIndex: 1 }]}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.colors.accent,
            borderBottomWidth: 4,
            borderBottomColor: t.colors.accentDark,
          }}
        >
          <Icon name="car-front" size={32} color={t.colors.textInverse} />
        </View>
      </Animated.View>

      {/* Road: a slab with the streaming centre line clipped inside it. */}
      <View
        style={{
          width,
          height: 22,
          borderRadius: 11,
          backgroundColor: t.isDark ? t.colors.sage200 : t.colors.blue800,
          overflow: 'hidden',
          justifyContent: 'center',
        }}
      >
        <Animated.View style={[dashesStyle, { flexDirection: 'row', gap: GAP, paddingLeft: GAP / 2 }]}>
          {Array.from({ length: dashCount }, (_, i) => (
            <View
              key={i}
              style={{ width: DASH, height: 3, borderRadius: 2, backgroundColor: t.colors.amber }}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}
