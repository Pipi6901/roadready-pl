import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';

import { DecoLayer, DotGrid, type DecoItem } from '@/components/onboarding/Decor';
import { ONBOARDING_ENABLED, ONBOARDING_SKIP_DEFAULTS } from '@/constants/flags';
import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Auto-advance delay; tapping anywhere skips it. */
const AUTO_ADVANCE_MS = 2000;

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

/** Splash — mockup frame "Splash Screen". Also the app's routing gate. */
export default function SplashScreen() {
  const t = useTheme();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { ready, onboarded, update } = useSettings();
  const [elapsed, setElapsed] = React.useState(false);

  const go = React.useCallback(() => {
    if (!ready) return;

    // Onboarding is switched off until it is wired through Adapty. Its screens
    // are untouched and still reachable by URL — only this gate skips them,
    // seeding the defaults onboarding would otherwise have collected.
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

    router.replace(onboarded ? '/(tabs)' : '/welcome');
  }, [ready, onboarded, update, router]);

  React.useEffect(() => {
    const id = setTimeout(() => setElapsed(true), AUTO_ADVANCE_MS);
    return () => clearTimeout(id);
  }, []);

  // Fires once the timer is done *and* persisted settings have loaded.
  React.useEffect(() => {
    if (elapsed) go();
  }, [elapsed, go]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue to RoadReady"
      onPress={go}
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
            <View
              key={ring.size}
              style={{
                pointerEvents: 'none',
                position: 'absolute',
                width: ring.size,
                height: ring.size,
                borderRadius: ring.size / 2,
                backgroundColor: t.colors.sage100,
                opacity: ring.opacity,
              }}
            />
          ))}

          <View
            style={{
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
            }}
          >
            <Icon name="car-front" size={46} color={t.colors.onBlue} />
          </View>
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
  );
}
