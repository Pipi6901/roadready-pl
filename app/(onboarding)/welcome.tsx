import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DecoLayer, DotGrid, type DecoItem } from '@/components/onboarding/Decor';
import { LinkButton, OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { COUNTRY_SELECTOR_ENABLED } from '@/constants/flags';
import { useSubscription } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';

const ILLUSTRATION_H = 320;

/** "Deco 0"–"Deco 3" plus "Extra Deco" inside the illustration panel. */
const ILLUSTRATION_DECO: DecoItem[] = [
  { icon: 'signpost', size: 26, x: 60, y: 70, rotate: -8, opacity: 0.35 },
  { icon: 'octagon-alert', size: 24, x: 280, y: 60, rotate: 6, opacity: 0.35 },
  { icon: 'tree-pine', size: 24, x: 40, y: 220, opacity: 0.35 },
  { icon: 'map', size: 26, x: 300, y: 220, rotate: 8, opacity: 0.35 },
  { icon: 'navigation', size: 20, x: 20, y: 40, rotate: 10, opacity: 0.3 },
  { icon: 'milestone', size: 20, x: 180, y: 270, opacity: 0.3 },
  { icon: 'compass', size: 24, x: 330, y: 150, rotate: 8, opacity: 0.3 },
  { icon: 'shield-check', size: 22, x: 20, y: 150, rotate: -8, opacity: 0.3 },
  { icon: 'route', size: 20, x: 150, y: 30, opacity: 0.3 },
];

/** "Lower Deco" — scattered across the copy block below the illustration. */
const CONTENT_DECO: DecoItem[] = [
  { icon: 'tree-pine', size: 24, x: 30, y: 190 },
  { icon: 'signpost', size: 22, x: 310, y: 246, rotate: 8 },
  { icon: 'car-front', size: 22, x: 300, y: 150 },
  { icon: 'sprout', size: 18, x: 40, y: 270 },
];

const RINGS = [
  { size: 190, opacity: 0.3 },
  { size: 150, opacity: 0.45 },
];

/** Welcome — mockup frame "Welcome Screen". */
export default function WelcomeScreen() {
  const t = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { restore } = useSubscription();

  // ADR-002: no accounts exist, so the mockup's "I already have an account"
  // link is replaced by the only recovery path there is — Restore Purchase.
  const onRestore = React.useCallback(async () => {
    const restored = await restore();
    Alert.alert(
      restored ? 'Purchase restored' : 'Nothing to restore',
      restored
        ? 'Your subscription is active again.'
        : 'We found no previous purchase for this store account.',
    );
  }, [restore]);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      <View
        style={{
          height: ILLUSTRATION_H,
          backgroundColor: t.colors.sage50,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <DotGrid
          width={width}
          height={ILLUSTRATION_H}
          color={t.colors.onSurfaceAlt}
          opacity={0.18}
          originX={16}
          originY={16}
          stepX={48}
          stepY={44}
        />
        <DecoLayer items={ILLUSTRATION_DECO} color={t.colors.onSurfaceAlt} frameHeight={ILLUSTRATION_H} />

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
            width: 120,
            height: 120,
            borderRadius: 36,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.colors.blue800,
            borderBottomWidth: 5,
            borderBottomColor: t.colors.blue900,
            shadowColor: t.colors.blue900,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2,
            shadowRadius: 18,
            elevation: 10,
          }}
        >
          <Icon name="car-front" size={58} color={t.colors.onBlue} />
        </View>
      </View>

      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            gap: 12,
            paddingTop: 28,
            paddingHorizontal: 28,
            paddingBottom: 20,
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <DecoLayer items={CONTENT_DECO} color={t.colors.decoration} opacity={0.6} />

          <Txt size={24} weight="700" align="center" style={{ maxWidth: 300 }}>
            Learn driving theory the smart way
          </Txt>
          <Txt size={14} align="center" color={t.colors.textSecondary} style={{ maxWidth: 280 }}>
            Bite-size lessons, instant feedback, track your progress
          </Txt>
        </View>

        <View style={{ gap: 14, paddingTop: 14, paddingHorizontal: 28, paddingBottom: 28 }}>
          <OnboardingButton
            label="Get Started"
            fontSize={16}
            paddingVertical={16}
            onPress={() => router.push(COUNTRY_SELECTOR_ENABLED ? '/country' : '/language')}
          />
          <LinkButton label="Restore purchase" onPress={onRestore} />
        </View>
      </SafeAreaView>
    </View>
  );
}
