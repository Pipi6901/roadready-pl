import { useRouter } from 'expo-router';
import React from 'react';

import { LicencePicker } from '@/components/settings/LicencePicker';
import { NavBar } from '@/components/settings/NavBar';
import { Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useT } from '@/features/i18n/useT';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Change licence category — from the home header or Settings.
 *
 * The exam paper is the same for every category — 32 questions, 25 minutes,
 * 68 of 74 points — but the catalogue tags every question with the categories
 * it is asked for, and a lorry candidate is asked about tachographs where a
 * motorcyclist gets counter-steering. This picker chooses which slice of the
 * catalogue the whole app draws from: lessons, mocks, readiness.
 *
 * Applies immediately, like the language pickers: nothing to download,
 * nothing to restart. Progress is kept per question, so switching back and
 * forth loses nothing. The first-launch version of this screen is
 * app/(onboarding)/choose-licence.tsx.
 */
export default function LicenceModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { licenceCategory, update } = useSettings();

  const select = (code: string) => {
    update({ licenceCategory: code, licenceChosen: true });
    router.back();
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <NavBar title={tr('licence.navTitle')} action="close" />

      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 14 }}
      >
        <Txt size={22} weight="700">
          {tr('licence.heading')}
        </Txt>
        <Txt size={13} color={t.colors.textSecondary} lineHeight={19}>
          {tr('licence.subtitle')}
        </Txt>

        <LicencePicker selected={licenceCategory} onSelect={select} />
      </ScreenScroll>
    </Screen>
  );
}
