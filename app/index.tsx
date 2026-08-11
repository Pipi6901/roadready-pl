import * as Haptics from 'expo-haptics';
import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { DecoLayer, DotGrid, type DecoItem } from '@/components/onboarding/Decor';
import { ONBOARDING_ENABLED, ONBOARDING_SKIP_DEFAULTS } from '@/constants/flags';
import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** "Deco 0"–"Deco 13" from the mockup, in mockup coordinates. */
const DECO: DecoItem[] = [
  { icon: 'signpost', size: 28, x: 40, y: 110, rotate: -10 },
  { icon: 'tree-pine', size: 26, x: 300, y: 95 },
  { icon: 'octagon-alert', size: 24, x: 55, y: 600, rotate: 8 },
  { icon: 'compass', size: 30, x: 288, y: 635, rotate: -6 },
  { icon: 'map', size: 26, x: 300, y: 555, rotate: 6 },
  { icon: 'tree-pine', size: 22, x: 28, y: 515 },
  { icon: 'signpost', size: 24, x: 278, y: 195, rotate: 10 },
  { icon: 'car-front', size: 26, x: 48, y: 678 },
  { icon: 'route', size: 22, x: 150, y: 60 },
  { icon: 'milestone', size: 22, x: 320, y: 300, rotate: -5 },
  { icon: 'tree-pine', size: 20, x: 150, y: 730 },
  { icon: 'shield-check', size: 22, x: 35, y: 250 },
  { icon: 'navigation', size: 22, x: 230, y: 720, rotate: 15 },
  { icon: 'circle-parking', size: 24, x: 330, y: 440 },
];

/** Concentric halo behind the logo — "Ring 0/1/2". */
const RINGS = [
  { size: 170, opacity: 0.35 },
  { size: 130, opacity: 0.5 },
  { size: 95, opacity: 0.7 },
];

/** Total time from tap to navigation. */
const EXIT_MS = 550;
/** Screen fade covers the tail end of the exit, once the car fills the frame. */
const FADE_MS = 180;

interface PulsingRingProps {
  size: number;
  baseOpacity: number;
  scale: SharedValue<number>;
  fade: SharedValue<number>;
}

function PulsingRing({ size, baseOpacity, scale, fade }: PulsingRingProps) {
  const t = useTheme();
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: baseOpacity * fade.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: t.colors.sage100,
        },
      ]}
    />
  );
}

/** Splash — mockup frame "Splash Screen". Also the app's routing gate. */
export default function SplashScreen() {
  const t = useTheme();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { ready, onboarded, hasSeenSplash, update } = useSettings();
  const [exiting, setExiting] = React.useState(false);

  const ringScale = useSharedValue(1);
  const ringFade = useSharedValue(1);
  const carScale = useSharedValue(1);
  const screenOpacity = useSharedValue(1);

  const go = React.useCallback(() => {
    if (!ready) return;

    // ONBOARDING_ENABLED off skips straight to the tabs, seeding the defaults
    // onboarding would otherwise have collected via the Adapty flow.
    if (!ONBOARDING_ENABLED) {
      if (!onboarded) {
        update({
          onboarded: true,
          countryCode: ONBOARDING_SKIP_DEFAULTS.countryCode,
          localeCode: ONBOARDING_SKIP_DEFAULTS.localeCode,
        });
      }
      router.replace('/(tabs)');
      return;
    }

    if (onboarded) {
      router.replace('/(tabs)');
      return;
    }
    // Cast: expo-router's generated route types only include
    // /adapty-onboarding after the dev server has run once against this new
    // file (app/(onboarding)/adapty-onboarding.tsx) — harmless until then.
    router.replace('/adapty-onboarding' as Href);
  }, [ready, onboarded, update, router]);

  // Returning learners skip straight past the tap-to-continue gate — it
  // only needs to be seen once, on the very first cold start ever.
  //
  // `!exiting` matters: handlePress below sets hasSeenSplash true (to
  // persist the "seen it" flag) in the same breath as scheduling its own
  // delayed go() call for after the exit animation. Without this guard,
  // that hasSeenSplash flip would re-run this effect and fire a SECOND,
  // immediate go() on top of the delayed one — two router.replace(...)
  // calls back to back, which is why the destination screen used to flash
  // in twice.
  React.useEffect(() => {
    if (ready && hasSeenSplash && !exiting) go();
  }, [ready, hasSeenSplash, exiting, go]);

  const handlePress = React.useCallback(() => {
    if (exiting || !ready) return;
    setExiting(true);
    update({ hasSeenSplash: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    ringScale.value = withTiming(2.4, { duration: EXIT_MS, easing: Easing.out(Easing.cubic) });
    ringFade.value = withTiming(0, { duration: EXIT_MS, easing: Easing.out(Easing.cubic) });

    // Quick tap-bounce, then the car surges toward the viewer.
    carScale.value = withSequence(
      withTiming(1.15, { duration: 120, easing: Easing.out(Easing.quad) }),
      withTiming(6, { duration: EXIT_MS - 120, easing: Easing.in(Easing.cubic) }),
    );

    screenOpacity.value = withDelay(
      EXIT_MS - FADE_MS,
      withTiming(0, { duration: FADE_MS, easing: Easing.in(Easing.quad) }),
    );

    // Driven from JS rather than the worklet callback so navigation timing
    // is identical (and reliable) across native and web.
    setTimeout(go, EXIT_MS);
  }, [exiting, ready, go, update, ringScale, ringFade, carScale, screenOpacity]);

  const carStyle = useAnimatedStyle(() => ({
    transform: [{ scale: carScale.value }],
  }));
  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  // Nothing to show while settings are still loading, or for a returning
  // learner who's about to be redirected by the effect above — rendering
  // the full tap UI here too would flash it for a frame before navigating
  // away.
  if (!ready || hasSeenSplash) return null;

  return (
    <Animated.View style={[screenStyle, { flex: 1 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Continue to RoadReady"
        onPress={handlePress}
        disabled={exiting}
        style={{ flex: 1, backgroundColor: t.colors.bg }}
      >
        <DotGrid
          width={width}
          height={height}
          color={t.colors.decoration}
          opacity={0.5}
          originX={20}
          originY={20}
          stepX={48}
          stepY={54}
        />
        <DecoLayer items={DECO} color={t.colors.decoration} opacity={0.55} />

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {RINGS.map((ring) => (
              <PulsingRing
                key={ring.size}
                size={ring.size}
                baseOpacity={ring.opacity}
                scale={ringScale}
                fade={ringFade}
              />
            ))}

            <Animated.View
              style={[
                carStyle,
                {
                  width: 96,
                  height: 96,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: t.colors.blue800,
                  borderBottomWidth: 4,
                  borderBottomColor: t.colors.blue900,
                  shadowColor: t.colors.blue900,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 16,
                  elevation: 8,
                },
              ]}
            >
              <Icon name="car-front" size={46} color={t.colors.onBlue} />
            </Animated.View>
          </View>

          <Txt size={26} weight="700">
            RoadReady
          </Txt>

          <Txt size={13} align="center" color={t.colors.textSecondary} style={{ maxWidth: 260 }}>
            Pass your driving theory test — in your language
          </Txt>
        </View>

        <View
          style={{ pointerEvents: 'none', position: 'absolute', left: 0, right: 0, bottom: 48, alignItems: 'center', gap: 6 }}
        >
          <Icon name="pointer" size={16} color={t.colors.textMuted} />
          <Txt size={12} weight="600" color={t.colors.textMuted}>
            Tap anywhere to continue
          </Txt>
        </View>
      </Pressable>
    </Animated.View>
  );
}
