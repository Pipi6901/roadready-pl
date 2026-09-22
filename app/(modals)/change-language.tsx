import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NavBar } from '@/components/settings/NavBar';
import { Icon } from '@/components/ui/Icon';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { examLocales } from '@/features/i18n/locales';
import { useT } from '@/features/i18n/useT';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * The language the questions themselves are in — ТЗ 8.2 / FR-02.
 *
 * Four choices, because the Polish theory exam is sat in four languages and
 * the card should read the way the paper will at WORD. It is a full-width
 * list rather than a grid of flags: this is the more consequential of the two
 * language settings, and four rows have room to say so.
 *
 * Siblings: change-translation.tsx picks the smaller line underneath, and
 * change-ui-language.tsx picks what the app itself says. Three settings, three
 * screens — a learner may sit the exam in Polish, read Ukrainian underneath it
 * and want the buttons in Russian, and none of those implies the others.
 */
export default function QuestionLanguageModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { questionLocale, update } = useSettings();

  const select = (code: string) => {
    update({ questionLocale: code });
    router.back();
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <NavBar title={tr('qLang.navTitle')} action="close" />

      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 14 }}
      >
        <Txt size={22} weight="700">
          {tr('qLang.heading')}
        </Txt>
        <Txt size={13} color={t.colors.textSecondary} lineHeight={19}>
          {tr('qLang.subtitle')}
        </Txt>

        <View style={{ gap: 10 }}>
          {examLocales().map((locale) => {
            const selected = locale.code === questionLocale;
            return (
              <Pressable
                key={locale.code}
                onPress={() => select(locale.code)}
                accessibilityRole="button"
                accessibilityLabel={`${locale.nameEnglish} — ${locale.nameNative}`}
                accessibilityState={{ selected }}
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 16,
                  minHeight: 44,
                  borderRadius: t.radius.lg,
                  backgroundColor: selected ? t.colors.sage50 : t.colors.surface,
                  borderWidth: selected ? 2 : StyleSheet.hairlineWidth * 2,
                  borderColor: selected ? t.colors.accent : t.colors.border,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Txt size={20}>{locale.flagEmoji}</Txt>
                <View style={{ flex: 1, gap: 2 }}>
                  <Txt size={15} weight="700">
                    {locale.nameNative}
                  </Txt>
                  <Txt size={12} color={t.colors.textMuted}>
                    {locale.nameEnglish}
                  </Txt>
                </View>
                {selected ? <Icon name="circle-check" size={20} color={t.colors.accentDark} /> : null}
              </Pressable>
            );
          })}
        </View>

        <Row style={{ gap: 8, alignItems: 'flex-start' }}>
          <Icon name="info" size={14} color={t.colors.textMuted} />
          <Txt size={12} color={t.colors.textMuted} lineHeight={17} style={{ flex: 1 }}>
            {tr('qLang.note')}
          </Txt>
        </Row>
      </ScreenScroll>
    </Screen>
  );
}
