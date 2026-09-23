import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { useCardShadow } from '@/components/settings/SettingsSection';
import { PLAN_PRICE } from '@/components/settings/plan';
import { Icon } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { PRIVACY_POLICY_URL, TERMS_OF_USE_URL } from '@/constants/legal';
import { FREE_TIER } from '@/constants/rules';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/features/i18n/useT';

interface CompareRow {
  feature: string;
  free: string | boolean;
  pro: string | true;
}

/**
 * Derived from FREE_TIER so the table can never promise a limit the app
 * does not enforce (or hide one it does). The daily cap row only appears
 * when there is a cap.
 */
const COMPARISON: CompareRow[] = [
  ...(FREE_TIER.questionsPerDay !== null
    ? [{ feature: 'Questions per day', free: String(FREE_TIER.questionsPerDay), pro: 'Unlimited' } as CompareRow]
    : [{ feature: 'Lessons', free: 'Unlimited', pro: 'Unlimited' } as CompareRow]),
  { feature: 'Translations', free: FREE_TIER.translation, pro: true },
  { feature: 'Mock tests', free: FREE_TIER.mockTest, pro: true },
  { feature: 'Weak spot practice', free: FREE_TIER.weakSpots, pro: true },
  { feature: 'Offline mode', free: FREE_TIER.offline, pro: true },
];

/** Trial ended — ТЗ 8.4. */
export default function TrialEndedModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const shadow = useCardShadow();

  const onSubscribe = () => {
    router.push('/paywall?source=trial_ended');
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
            {tr('trial.title')}
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" lineHeight={20}>
            {tr('trial.body')}
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
              {tr('trial.free')}
            </Txt>
            <Txt size={12} weight="700" color={t.colors.amberDark} align="center" style={{ flex: 1 }}>
              Pro
            </Txt>
          </Row>

          {COMPARISON.map((row, i) => (
            <Row
              key={row.feature}
              accessible
              accessibilityLabel={`${row.feature}. Free: ${row.free === false ? 'not included' : row.free === true ? 'included' : row.free}. Pro: ${row.pro === true ? 'included' : row.pro}.`}
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
                ) : row.free === true ? (
                  <Icon name="check" size={16} color={t.colors.successDark} />
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
          <Button label={tr('trial.subscribe', { price: PLAN_PRICE.monthly })} icon="gem" onPress={onSubscribe} />
          <Button label={tr('trial.continueFree')} variant="ghost" onPress={() => router.back()} />
          {/* App Review wants both documents reachable from every purchase
              surface, not just mentioned — the two spans are tappable. */}
          <Txt size={10} color={t.colors.textMuted} align="center" lineHeight={14}>
            {tr('legal.billed')}{' '}
            <Txt
              size={10}
              color={t.colors.textSecondary}
              style={{ textDecorationLine: 'underline' }}
              onPress={() => void Linking.openURL(TERMS_OF_USE_URL)}
              accessibilityRole="link"
            >
              {tr('settings.row.termsOfUse')}
            </Txt>
            {` ${tr('common.and')} `}
            <Txt
              size={10}
              color={t.colors.textSecondary}
              style={{ textDecorationLine: 'underline' }}
              onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)}
              accessibilityRole="link"
            >
              {tr('settings.row.privacyPolicy')}
            </Txt>
            {` ${tr('legal.apply')}`}
          </Txt>
        </View>
      </ScreenScroll>
    </Screen>
  );
}
