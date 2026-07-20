import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { useCardShadow } from '@/components/settings/SettingsSection';
import { PLAN_PRICE } from '@/components/settings/plan';
import { Icon } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { FREE_QUESTIONS_PER_DAY } from '@/constants/rules';
import { useTheme } from '@/theme/ThemeProvider';

interface CompareRow {
  feature: string;
  free: string | false;
  pro: string | true;
}

const COMPARISON: CompareRow[] = [
  { feature: 'Questions per day', free: String(FREE_QUESTIONS_PER_DAY), pro: 'Unlimited' },
  { feature: 'Translations', free: false, pro: true },
  { feature: 'Mock tests', free: false, pro: true },
  { feature: 'Weak spot practice', free: false, pro: true },
  { feature: 'Offline mode', free: false, pro: true },
];

/** Trial ended — ТЗ 8.4. */
export default function TrialEndedModal() {
  const t = useTheme();
  const router = useRouter();
  const shadow = useCardShadow();

  const onSubscribe = () => {
    // TODO: open the store purchase sheet through the billing module (ADR-005).
    Alert.alert(
      'Subscribe',
      'Checkout opens in the App Store / Google Play purchase sheet once billing is connected.',
    );
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenScroll contentContainerStyle={{ padding: 24, gap: 20, flexGrow: 1 }}>
        <View style={{ alignItems: 'center', gap: 10, paddingTop: 12 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.amber50,
              borderBottomWidth: 3,
              borderBottomColor: t.colors.amber,
            }}
          >
            <Icon name="alarm-clock" size={30} color={t.colors.amberDark} />
          </View>

          <Txt size={24} weight="700" align="center">
            Your free trial has ended
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" lineHeight={20}>
            Keep everything you unlocked, or carry on with the free plan.
          </Txt>
        </View>

        {/* Free vs Pro */}
        <View
          style={[
            {
              borderRadius: t.radius.lg,
              backgroundColor: t.colors.surface,
              borderWidth: StyleSheet.hairlineWidth * 2,
              borderColor: t.colors.border,
              overflow: 'hidden',
            },
            shadow,
          ]}
        >
          <Row style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: t.colors.sage50 }}>
            <View style={{ flex: 1.4 }} />
            <Txt size={12} weight="700" color={t.colors.textSecondary} align="center" style={{ flex: 1 }}>
              Free
            </Txt>
            <Txt size={12} weight="700" color={t.colors.amberDark} align="center" style={{ flex: 1 }}>
              Pro
            </Txt>
          </Row>

          {COMPARISON.map((row, i) => (
            <Row
              key={row.feature}
              accessible
              accessibilityLabel={`${row.feature}. Free: ${row.free === false ? 'not included' : row.free}. Pro: ${row.pro === true ? 'included' : row.pro}.`}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                minHeight: 44,
                borderTopWidth: i === 0 ? 0 : StyleSheet.hairlineWidth * 2,
                borderTopColor: t.colors.border,
              }}
            >
              <Txt size={13} style={{ flex: 1.4 }}>
                {row.feature}
              </Txt>

              <View style={{ flex: 1, alignItems: 'center' }}>
                {row.free === false ? (
                  <Icon name="x" size={16} color={t.colors.textMuted} />
                ) : (
                  <Txt size={13} color={t.colors.textSecondary}>
                    {row.free}
                  </Txt>
                )}
              </View>

              <View style={{ flex: 1, alignItems: 'center' }}>
                {row.pro === true ? (
                  <Icon name="check" size={16} color={t.colors.successDark} />
                ) : (
                  <Txt size={13} weight="600" color={t.colors.successText}>
                    {row.pro}
                  </Txt>
                )}
              </View>
            </Row>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ gap: 10 }}>
          <Button label={`Subscribe — ${PLAN_PRICE.monthly}/month`} icon="gem" onPress={onSubscribe} />
          <Button label="Continue with limited access" variant="ghost" onPress={() => router.back()} />
          <Txt size={10} color={t.colors.textMuted} align="center" lineHeight={14}>
            Billed through the store. Cancel anytime. Terms of Service and Privacy Policy apply.
          </Txt>
        </View>
      </ScreenScroll>
    </Screen>
  );
}
