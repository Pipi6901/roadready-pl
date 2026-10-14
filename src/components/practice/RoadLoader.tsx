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
import { useT } from '@/features/i18n/useT';
import { useTheme } from '@/theme/ThemeProvider';

const CAR = 40;
const DASH = 26;
const GAP = 18;
const PERIOD = DASH + GAP;
const ROAD_H = 22;

/**
 * A car driving along a road — the "please wait" for the mock test's media
 * preload.
 *
 * It used to be a front-on car inside a rounded tile, bobbing on the spot
 * while the centre line streamed past. Two things were wrong with that: a car
 * seen from the front cannot show which way it is going, and what moved was
 * the whole tile, so it read as a bouncing icon rather than as driving. Now
 * the car is in profile and actually travels the width of the road, leaving
 * on the right and returning on the left. The bob is a single pixel of
 * suspension, not a jump.
 *
 * Pure transforms on the UI thread, so it stays smooth while the downloads
 * hammer the JS thread.
 */
export function RoadLoader({ width = 260 }: { width?: number }) {
  const t = useTheme();
  const tr = useT();
  const drive = useSharedValue(-CAR);
  const bob = useSharedValue(0);
  const shift = useSharedValue(0);

  React.useEffect(() => {
    drive.value = -CAR;
    drive.value = withRepeat(
      withTiming(width, { duration: 2200, easing: Easing.linear }),
      -1,
      false,
    );
    bob.value = withRepeat(
      withSequence(
        withTiming(-1, { duration: 220, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.5, { duration: 220, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    );
    // The centre line runs the other way, which is what the driver would see.
    shift.value = withRepeat(
      withTiming(-PERIOD, { duration: 620, easing: Easing.linear }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(drive);
      cancelAnimation(bob);
      cancelAnimation(shift);
    };
  }, [drive, bob, shift, width]);

  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drive.value }, { translateY: bob.value }],
  }));
  const dashesStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shift.value }] }));

  // One extra period of dashes on the right so the loop never shows a gap.
  const dashCount = Math.ceil(width / PERIOD) + 2;

  return (
    <View
      style={{ width, alignItems: 'center', gap: 4 }}
      accessible
      accessibilityLabel={tr('a11y.loading')}
      accessibilityRole="progressbar"
    >
      {/* The lane the car travels along. Clipped, so it slides out of view at
          the edges instead of overhanging the road. */}
      <View style={{ width, height: CAR, overflow: 'hidden' }}>
        <Animated.View
          style={[
            carStyle,
            { position: 'absolute', left: 0, bottom: 0, width: CAR, height: CAR },
          ]}
        >
          <Icon name="car" size={CAR} color={t.colors.accent} />
        </Animated.View>
      </View>

      {/* Road: a slab with the streaming centre line clipped inside it. */}
      <View
        style={{
          width,
          height: ROAD_H,
          borderRadius: ROAD_H / 2,
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
