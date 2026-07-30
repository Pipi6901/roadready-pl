import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { DecoLayer, type DecoItem } from '@/components/onboarding/Decor';
import { GradientScreen } from '@/components/onboarding/GradientScreen';
import { LinkButton, OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { Icon } from '@/components/ui/Icon';
import { Row, Txt } from '@/components/ui/primitives';
import { useSettings } from '@/store/SettingsProvider';
import { useSubscription, type Plan } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';

const DECO: DecoItem[] = [
  { icon: 'gem', size: 20, x: 25, y: 110, rotate: -8 },
  { icon: 'crown', size: 22, x: 330, y: 120, rotate: 8 },
];

const SPARKLE_DECO: DecoItem[] = [
  { icon: 'sparkles', size: 22, x: 30, y: 40 },
  { icon: 'sparkles', size: 18, x: 320, y: 60, rotate: 10 },
];

/**
 * Display prices. In production these come from the store (localised currency,
 * regional pricing) via react-native-iap's `fetchProducts` — ADR-012.
 * Hardcoded here until real product IDs exist in App Store Connect / Play
 * Console (src/constants/billing.ts).
 */
const PLANS: Record<Plan, { label: string; price: string; period: string }> = {
  monthly: { label: 'Monthly', price: '£4.99', period: 'month' },
  yearly: { label: 'Yearly', price: '£39.99', period: 'year' },
};

const TRIAL_DAYS = 3;

/**
 * Feature list. "Hazard perception clips" from the mockup is replaced by
 * "Mock tests and quick quizzes" — the hazard pack is behind a feature flag
 * (ADR-006) and selling an unavailable feature fails App Review.
 */
const FEATURES = [
  'All questions with translations',
  'Adaptive learning',
  'Offline mode',
  'Mock tests and quick quizzes',
  'Track your progress',
];

/** Paywall — mockup frame "Paywall". Last step of onboarding. */
export default function PaywallScreen() {
  const t = useTheme();
  const router = useRouter();
  const { update } = useSettings();
  const { startTrial, restore } = useSubscription();
  const [plan, setPlan] = React.useState<Plan>('yearly');

  const finishOnboarding = React.useCallback(() => {
    update({ onboarded: true });
    router.replace('/(tabs)');
  }, [update, router]);

  const onStartTrial = React.useCallback(async () => {
    await startTrial(plan);
    finishOnboarding();
  }, [startTrial, plan, finishOnboarding]);

  const onRestore = React.useCallback(async () => {
    const restored = await restore();
    Alert.alert(
      restored ? 'Purchase restored' : 'Nothing to restore',
      restored
        ? 'Your subscription is active again.'
        : 'We found no previous purchase for this store account.',
    );
    if (restored) finishOnboarding();
  }, [restore, finishOnboarding]);

  return (
    <GradientScreen to={t.colors.amber50}>
      <DecoLayer items={DECO} color={t.colors.decoration} />
      <DecoLayer items={SPARKLE_DECO} color={t.colors.amber} />

      <Row style={{ justifyContent: 'flex-end', paddingTop: 16, paddingHorizontal: 20, paddingBottom: 4 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close and continue without a subscription"
          onPress={finishOnboarding}
          hitSlop={12}
          style={{ width: 44, height: 44, alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <Icon name="x" size={22} color={t.colors.textSecondary} />
        </Pressable>
      </Row>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 18, paddingTop: 8, paddingHorizontal: 24, paddingBottom: 10 }}
      >
        <Txt size={24} weight="700" align="center">
          Start your free trial
        </Txt>
        <Txt size={14} align="center" color={t.colors.textSecondary}>
          {TRIAL_DAYS} days free, then {PLANS.monthly.price}/{PLANS.monthly.period}
        </Txt>

        <View style={{ gap: 12 }}>
          {FEATURES.map((feature) => (
            <Row key={feature} style={{ gap: 10 }}>
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: t.colors.successBg,
                }}
              >
                <Icon name="check" size={12} color={t.colors.successDark} />
              </View>
              <Txt size={14} style={{ flex: 1 }}>
                {feature}
              </Txt>
            </Row>
          ))}
        </View>

        <Row style={{ gap: 10, alignItems: 'stretch' }}>
          <PlanCard plan="monthly" selected={plan === 'monthly'} onPress={() => setPlan('monthly')} />
          <PlanCard
            plan="yearly"
            selected={plan === 'yearly'}
            badge="SAVE 33%"
            onPress={() => setPlan('yearly')}
          />
        </Row>
      </ScrollView>

      <View style={{ gap: 10, paddingTop: 16, paddingHorizontal: 24, paddingBottom: 10 }}>
        <OnboardingButton
          label="Start Free Trial"
          fontSize={16}
          paddingVertical={16}
          onPress={onStartTrial}
        />
        <LinkButton label="Restore Purchase" fontSize={13} onPress={onRestore} />
        <Txt size={10} align="center" color={t.colors.textMuted} lineHeight={14}>
          {TRIAL_DAYS}-day free trial, then {PLANS[plan].price} per {PLANS[plan].period}, billed
          automatically. The subscription renews unless cancelled at least 24 hours before the end of
          the current period. Manage or cancel it in your store account settings. Terms of Service
          and Privacy Policy apply.
        </Txt>
      </View>
    </GradientScreen>
  );
}

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  badge?: string;
  onPress: () => void;
}

function PlanCard({ plan, selected, badge, onPress }: PlanCardProps) {
  const t = useTheme();
  const { label, price } = PLANS[plan];

  return (
    // Badge sits above the card; the wrapper's padding keeps it inside the
    // parent's bounds so Android does not clip it.
    <View style={{ flex: 1, paddingTop: 12 }}>
      {badge ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            alignSelf: 'center',
            paddingVertical: 3,
            paddingHorizontal: 8,
            borderRadius: 8,
            backgroundColor: t.colors.success,
            zIndex: 1,
          }}
        >
          <Txt size={10} weight="700" color={t.colors.textInverse}>
            {badge}
          </Txt>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="radio"
        accessibilityLabel={`${label} plan, ${price}${badge ? `, ${badge}` : ''}`}
        accessibilityState={{ selected, checked: selected }}
        onPress={onPress}
        style={{
          gap: 4,
          padding: 14,
          minHeight: 44,
          alignItems: 'center',
          borderRadius: t.radius.lg,
          backgroundColor: selected ? t.colors.successBg : t.colors.surface,
          borderWidth: selected ? 2 : 1.5,
          borderColor: selected ? t.colors.accentDark : t.colors.border,
        }}
      >
        <Txt size={13} weight="600" color={selected ? t.colors.successDark : t.colors.textSecondary}>
          {label}
        </Txt>
        <Txt size={20} weight="700">
          {price}
        </Txt>
      </Pressable>
    </View>
  );
}
