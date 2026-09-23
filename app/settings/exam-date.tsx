import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { NavBar } from '@/components/settings/NavBar';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { ExamCalendar, startOfDay } from '@/components/shared/ExamCalendar';
import { Icon } from '@/components/ui/Icon';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { useT } from '@/features/i18n/useT';

const DAY_MS = 86_400_000;

/**
 * Exam date editor pushed from Settings > Exam date > Test date.
 *
 * Reuses the same ExamCalendar as onboarding's goal screen (docs/design-specs
 * has no dedicated mockup for this — it's the "goal-setting screen reuse" the
 * settings TODO asked for), but with save/clear actions instead of an
 * onboarding "Skip for now".
 */
export default function ExamDateScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const settings = useSettings();
  const [selected, setSelected] = React.useState<string | null>(settings.examDate);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const daysToGo = React.useMemo(() => {
    if (!selected) return null;
    const target = new Date(selected);
    return Math.max(0, Math.round((startOfDay(target).getTime() - today.getTime()) / DAY_MS));
  }, [selected, today]);

  const save = () => {
    settings.update({ examDate: selected });
    router.back();
  };

  const clear = () => {
    settings.update({ examDate: null });
    router.back();
  };

  return (
    <Screen>
      <NavBar title={tr('settings.row.testDate')} />

      <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 16 }}>
          <ExamCalendar selected={selected} onSelect={setSelected} />

          {daysToGo !== null ? (
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
                {daysToGo} days to go
              </Txt>
            </Row>
          ) : null}

          <OnboardingButton label={tr('common.save')} disabled={!selected} onPress={save} />

          {settings.examDate ? (
            <OnboardingButton
              label={tr('settings.clearDate')}
              variant="soft"
              fontSize={14}
              paddingVertical={13}
              onPress={clear}
            />
          ) : null}
        </View>
      </ScreenScroll>
    </Screen>
  );
}
