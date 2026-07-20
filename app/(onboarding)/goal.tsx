import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { DecoLayer, type DecoItem } from '@/components/onboarding/Decor';
import { GradientScreen } from '@/components/onboarding/GradientScreen';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { ExamCalendar, startOfDay } from '@/components/shared/ExamCalendar';
import { Icon } from '@/components/ui/Icon';
import { Row, Txt } from '@/components/ui/primitives';
import { PAYWALL_ENABLED } from '@/constants/flags';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

const DECO: DecoItem[] = [
  { icon: 'alarm-clock', size: 20, x: 330, y: 20, rotate: 8 },
  { icon: 'party-popper', size: 20, x: 20, y: 80, rotate: -10 },
];

const DAY_MS = 86_400_000;

/** Goal Setting — mockup frame "Goal Setting". Calendar is hand-built, no date library. */
export default function GoalScreen() {
  const t = useTheme();
  const router = useRouter();
  const { examDate, update } = useSettings();

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [selected, setSelected] = React.useState<string | null>(examDate);
  const [noDate, setNoDate] = React.useState(false);

  const daysToGo = React.useMemo(() => {
    if (!selected) return null;
    const target = new Date(selected);
    return Math.max(0, Math.round((startOfDay(target).getTime() - today.getTime()) / DAY_MS));
  }, [selected, today]);

  const finish = (date: string | null) => {
    // With the paywall off, this is the last onboarding step: mark the flow
    // done here instead of letting the paywall do it.
    if (!PAYWALL_ENABLED) {
      update({ examDate: date, onboarded: true });
      router.replace('/(tabs)');
      return;
    }
    update({ examDate: date });
    router.push('/paywall');
  };

  const canSetGoal = noDate || !!selected;

  return (
    <GradientScreen to={t.colors.sage100}>
      <DecoLayer items={DECO} color={t.colors.decoration} />

      <View style={{ flex: 1, paddingTop: 12, paddingHorizontal: 20, paddingBottom: 10 }}>
        <Txt size={22} weight="700">
          When is your test?
        </Txt>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingTop: 16 }}>
          <ExamCalendar
            selected={selected}
            onSelect={(key) => {
              setSelected(key);
              setNoDate(false);
            }}
          />

          {daysToGo !== null && !noDate ? (
            <Row
              style={{
                gap: 10,
                padding: 14,
                borderRadius: t.radius.md,
                backgroundColor: t.colors.successBg,
              }}
            >
              <Icon name="sparkles" size={18} color={t.colors.successDark} />
              <Txt size={13} weight="600" color={t.colors.successDark} style={{ flex: 1 }}>
                {daysToGo} days to go — we&apos;ll build your study plan
              </Txt>
            </Row>
          ) : null}

          <Pressable
            accessibilityRole="checkbox"
            accessibilityLabel="I don't have a date yet"
            accessibilityState={{ checked: noDate }}
            onPress={() => {
              setNoDate((v) => !v);
              setSelected(null);
            }}
            style={{
              flexDirection: 'row',
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
            }}
          >
            <Icon
              name={noDate ? 'circle-check' : 'calendar-x'}
              size={14}
              color={noDate ? t.colors.accentDark : t.colors.textMuted}
            />
            <Txt size={13} weight="600" color={noDate ? t.colors.accentDark : t.colors.textMuted}>
              I don&apos;t have a date yet
            </Txt>
          </Pressable>
        </ScrollView>

        <DecoLayer
          items={[{ icon: 'car-front', size: 22, x: 320, y: 400, opacity: 0.5 }]}
          color={t.colors.decoration}
        />
      </View>

      <View style={{ gap: 8, paddingTop: 14, paddingHorizontal: 20, paddingBottom: 20 }}>
        <OnboardingButton
          label="Set my goal"
          disabled={!canSetGoal}
          onPress={() => finish(noDate ? null : selected)}
        />
        <OnboardingButton
          label="Skip for now"
          variant="soft"
          fontSize={14}
          paddingVertical={13}
          onPress={() => finish(null)}
        />
      </View>
    </GradientScreen>
  );
}
