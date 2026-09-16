import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { LicencePicker } from '@/components/settings/LicencePicker';
import { Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { EVENTS, track } from '@/features/analytics/analytics';
import { useT } from '@/features/i18n/useT';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * First-launch step: which licence are you going for?
 *
 * Sits between the Adapty funnel (or its skip paths) and the home screen, and
 * runs once — `licenceChosen` records the answer. Everything the app shows
 * afterwards is filtered by it, so a learner who never opened Settings would
 * otherwise study for category B without knowing it. No close button: a pick
 * is the only way forward, and the default is already highlighted, so the
 * cost of not caring is one tap.
 */
export default function ChooseLicenceScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { licenceCategory, update } = useSettings();

  const select = (code: string) => {
    track(EVENTS.licenceChosen, { code });
    update({ licenceCategory: code, licenceChosen: true });
    router.replace('/(tabs)');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24, gap: 14 }}
      >
        <View style={{ gap: 8 }}>
          <Txt size={26} weight="800">
            {tr('licence.heading')}
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} lineHeight={20}>
            {tr('licence.subtitle')}
          </Txt>
          <Txt size={12} color={t.colors.textMuted} lineHeight={17}>
            {tr('licence.changeLater')}
          </Txt>
        </View>

        <LicencePicker selected={licenceCategory} onSelect={select} />
      </ScreenScroll>
    </Screen>
  );
}
