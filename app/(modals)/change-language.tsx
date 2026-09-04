import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NavBar } from '@/components/settings/NavBar';
import { Icon } from '@/components/ui/Icon';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { LOCALES } from '@/data/demo-bundle';
import { useT } from '@/features/i18n/useT';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

const COLUMNS = 3;

/**
 * Change translation language — ТЗ 8.2 / FR-02.
 *
 * The choice applies immediately: no confirmation dialog and no content reload.
 * Translations ship inside the same content bundle as the Polish questions, so
 * switching language only changes which field is rendered — nothing to download,
 * nothing to restart.
 *
 * Sibling of change-ui-language.tsx: this one picks what appears *under* a
 * question, that one picks what the app itself says.
 */
export default function LanguageModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { localeCode, update } = useSettings();

  const select = (code: string | null) => {
    update({ localeCode: code });
    router.back();
  };

  const rows: (typeof LOCALES)[] = [];
  for (let i = 0; i < LOCALES.length; i += COLUMNS) {
    rows.push(LOCALES.slice(i, i + COLUMNS));
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <NavBar title={tr('transLang.navTitle')} action="close" />

      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 14 }}
      >
        <Txt size={22} weight="700">
          {tr('transLang.heading')}
        </Txt>
        <Txt size={13} color={t.colors.textSecondary} lineHeight={19}>
          {tr('transLang.subtitle')}
        </Txt>
        <Txt size={12} color={t.colors.textMuted} lineHeight={17}>
          {tr('transLang.note')}
        </Txt>

        {/* "Polish only" first — it is the default and the way back out. */}
        <Pressable
          onPress={() => select(null)}
          accessibilityRole="button"
          accessibilityLabel={tr('transLang.polishOnlyA11y')}
          accessibilityState={{ selected: localeCode === null }}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            minHeight: 44,
            borderRadius: t.radius.lg,
            backgroundColor: t.colors.sage50,
            borderWidth: 2,
            borderColor: localeCode === null ? t.colors.accent : t.colors.border,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Icon name="languages" size={20} color={t.colors.onSurfaceAlt} />
          <Txt size={14} weight="700" style={{ flex: 1 }}>
            {tr('transLang.polishOnly')}
          </Txt>
          {localeCode === null ? (
            <Icon name="circle-check" size={20} color={t.colors.accentDark} />
          ) : null}
        </Pressable>

        <View style={{ gap: 10 }}>
          {rows.map((row, rowIndex) => (
            <Row key={rowIndex} style={{ gap: 10, alignItems: 'stretch' }}>
              {row.map((locale) => {
                const selected = locale.code === localeCode;
                return (
                  <Pressable
                    key={locale.code}
                    onPress={() => select(locale.code)}
                    accessibilityRole="button"
                    accessibilityLabel={`${locale.nameEnglish} — ${locale.nameNative}`}
                    accessibilityState={{ selected }}
                    style={({ pressed }) => ({
                      flex: 1,
                      height: 64,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      padding: 8,
                      borderRadius: t.radius.md,
                      backgroundColor: selected ? t.colors.sage50 : t.colors.surface,
                      borderWidth: selected ? 2 : StyleSheet.hairlineWidth * 2,
                      borderColor: selected ? t.colors.accent : t.colors.border,
                      opacity: pressed ? 0.85 : 1,
                    })}
                  >
                    <Txt size={18}>{locale.flagEmoji}</Txt>
                    <Txt size={12} weight="600" align="center" numberOfLines={1}>
                      {locale.nameNative}
                    </Txt>
                  </Pressable>
                );
              })}
              {/* Keep the last row aligned to the grid. */}
              {row.length < COLUMNS
                ? Array.from({ length: COLUMNS - row.length }, (_, i) => (
                    <View key={`spacer-${i}`} style={{ flex: 1 }} />
                  ))
                : null}
            </Row>
          ))}
        </View>
      </ScreenScroll>
    </Screen>
  );
}
