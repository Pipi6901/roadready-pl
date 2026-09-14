import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';

import { NavBar } from '@/components/settings/NavBar';
import { formatDate, PLAN_PERIOD, PLAN_PRICE, planLabel } from '@/components/settings/plan';
import { useDateLocale } from '@/features/i18n/useT';
import { SettingsRow } from '@/components/settings/SettingsRow';
import { SettingsSection, useCardShadow } from '@/components/settings/SettingsSection';
import { Icon } from '@/components/ui/Icon';
import { Button, Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import type { Plan } from '@/store/SubscriptionProvider';
import { useSubscription } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Where a plan change actually happens — we never charge inside the app. */
const STORE_SUBSCRIPTIONS_URL = Platform.select({
  ios: 'https://apps.apple.com/account/subscriptions',
  android: 'https://play.google.com/store/account/subscriptions',
  default: 'https://apps.apple.com/account/subscriptions',
});

const PLANS: Plan[] = ['monthly', 'yearly'];

/**
 * Manage Subscription. Not in the mockup — built in the same visual language as
 * the Settings screen.
 *
 * Everything money-related is a deep link into the store: Apple and Google both
 * require subscription management to go through their own UI, and the app has
 * no server-side billing of its own (ADR-002 / ADR-012).
 */
export default function SubscriptionScreen() {
  const t = useTheme();
  const dateLocale = useDateLocale();
  const router = useRouter();
  const shadow = useCardShadow();
  const subscription = useSubscription();
  const { state, isPro } = subscription;

  const openStore = async () => {
    const url = STORE_SUBSCRIPTIONS_URL;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      return;
    }
    Alert.alert(
      'Could not open the store',
      Platform.OS === 'android'
        ? 'Open Google Play, then Payments and subscriptions, to manage your plan.'
        : 'Open Settings, then your Apple ID, then Subscriptions, to manage your plan.',
    );
  };

  const onChangePlan = (plan: Plan) => {
    if (state.plan === plan) return;
    // Free users have nothing to "switch" — the store's manage-subscriptions
    // page only lists existing subscriptions, so sending them there is a dead
    // end. Send them to the real purchase flow instead.
    if (!isPro) {
      router.push('/paywall?source=settings');
      return;
    }
    Alert.alert(
      `Switch to ${plan === 'monthly' ? 'Monthly' : 'Yearly'}?`,
      'Plan changes are handled by the store. We will take you to your subscription settings, where the switch takes effect at the end of the current period.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => void openStore() },
      ],
    );
  };

  return (
    <Screen>
      <NavBar title="Subscription" />

      <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 22 }}>
          {/* Current state */}
          <View
            style={[
              {
                padding: 16,
                gap: 10,
                borderRadius: t.radius.lg,
                backgroundColor: isPro ? t.colors.amber50 : t.colors.surface,
                borderWidth: StyleSheet.hairlineWidth * 2,
                borderColor: isPro ? t.colors.amber : t.colors.border,
              },
              shadow,
            ]}
          >
            <Row style={{ gap: 10 }}>
              <Icon name={isPro ? 'gem' : 'sprout'} size={22} color={isPro ? t.colors.amberDark : t.colors.textSecondary} />
              <Txt size={17} weight="700">
                {planLabel(state)}
              </Txt>
            </Row>
            <Txt size={13} color={t.colors.textSecondary} lineHeight={19}>
              {isPro
                ? `Renews on ${formatDate(state.renewsAt, dateLocale)}.`
                : 'You are on the free plan — 10 questions a day, no translations and no mock tests.'}
            </Txt>
          </View>

          <SettingsSection title="Details" icon="gem" iconColor={t.colors.amberDark}>
            <SettingsRow label="Current plan" value={planLabel(state)} />
            <SettingsRow label="Renewal date" value={formatDate(state.renewsAt, dateLocale)} last />
          </SettingsSection>

          {/* Change plan */}
          <View style={{ gap: 8 }}>
            <Txt variant="label" weight="700" color={t.colors.textMuted}>
              CHANGE PLAN
            </Txt>

            <Row style={{ gap: 10, alignItems: 'stretch' }}>
              {PLANS.map((plan) => {
                const current = state.plan === plan;
                return (
                  <Pressable
                    key={plan}
                    onPress={() => onChangePlan(plan)}
                    accessibilityRole="button"
                    accessibilityLabel={`${plan === 'monthly' ? 'Monthly' : 'Yearly'} plan, ${PLAN_PRICE[plan]} ${PLAN_PERIOD[plan]}`}
                    accessibilityState={{ selected: current }}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        minHeight: 44,
                        alignItems: 'center',
                        gap: 4,
                        padding: 14,
                        borderRadius: t.radius.lg,
                        backgroundColor: current ? t.colors.successBg : t.colors.surface,
                        borderWidth: 2,
                        borderColor: current ? t.colors.successDark : t.colors.border,
                        opacity: pressed ? 0.8 : 1,
                      },
                      shadow,
                    ]}
                  >
                    <Txt size={13} weight="600" color={current ? t.colors.successText : t.colors.textSecondary}>
                      {plan === 'monthly' ? 'Monthly' : 'Yearly'}
                    </Txt>
                    <Txt size={20} weight="700">
                      {PLAN_PRICE[plan]}
                    </Txt>
                    <Txt size={11} color={t.colors.textSecondary}>
                      {current ? 'Current plan' : PLAN_PERIOD[plan]}
                    </Txt>
                  </Pressable>
                );
              })}
            </Row>
          </View>

          <Txt size={12} color={t.colors.textSecondary} lineHeight={18}>
            {Platform.OS === 'android'
              ? 'Billing runs through Google Play. Changes, cancellations and refunds are handled in your Play Store account, not in RoadReady.'
              : 'Billing runs through the App Store. Changes, cancellations and refunds are handled in your Apple ID subscription settings, not in RoadReady.'}
          </Txt>

          <Button
            label={Platform.OS === 'android' ? 'Open Google Play subscriptions' : 'Open App Store subscriptions'}
            icon="gem"
            onPress={() => void openStore()}
          />
        </View>
      </ScreenScroll>
    </Screen>
  );
}
