import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Button, Row, Screen, Txt } from '@/components/ui/primitives';
import { PAYWALL_ENABLED } from '@/constants/flags';
import { EVENTS, track } from '@/features/analytics/analytics';
import type { Feature } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  /** Which gate this is — goes into the paywall `source` and the analytics event. */
  feature: Feature;
  icon: IconName;
  title: string;
  body: string;
}

/**
 * Full-screen wall for a Pro-only feature, shown *instead of* the feature's
 * screen when `can(feature)` is false. Same shape as the daily-limit wall in
 * the lesson screen so the two read as one system.
 *
 * Rendered by the gated screen itself rather than by whoever navigates to
 * it: the Practice hub, the Dashboard, "Review mistakes" after a lesson and a
 * deep link all land here, and one gate at the destination covers every
 * entry — a badge on a card is a hint, not enforcement.
 */
export function ProLocked({ feature, icon, title, body }: Props) {
  const t = useTheme();
  const router = useRouter();

  // Once per wall, not per render — otherwise one blocked learner would look
  // like dozens in the funnel.
  React.useEffect(() => {
    track(EVENTS.limitHit, { limit_type: feature });
  }, [feature]);

  return (
    <Screen>
      <Row style={{ paddingTop: 16, paddingHorizontal: 20 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          hitSlop={12}
          style={{ width: 44, height: 44, alignItems: 'flex-start', justifyContent: 'center' }}
        >
          <Icon name="x" size={22} color={t.colors.textSecondary} />
        </Pressable>
      </Row>

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.colors.amber50,
            borderBottomWidth: 4,
            borderBottomColor: t.colors.amber,
          }}
        >
          <Icon name={icon} size={42} color={t.colors.amberDark} />
        </View>

        <Txt size={24} weight="700" align="center">
          {title}
        </Txt>
        <Txt size={14} color={t.colors.textSecondary} align="center">
          {body}
        </Txt>

        <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 8 }}>
          {PAYWALL_ENABLED ? (
            <Button label="See Pro plans" onPress={() => router.push(`/paywall?source=${feature}`)} />
          ) : null}
          <Button label="Not now" variant="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}
