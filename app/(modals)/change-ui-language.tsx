import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NavBar } from '@/components/settings/NavBar';
import { Icon } from '@/components/ui/Icon';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { UI_LOCALES, deviceUiLocale, findUiLocale } from '@/features/i18n/locales';
import { useT } from '@/features/i18n/useT';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';

const COLUMNS = 3;

/**
 * Change interface language.
 *
 * Sibling of change-language.tsx, and deliberately not merged with it: that one
 * picks what appears *under* a question, this one picks what the app itself
 * says. Merging them would force one choice to stand for both, which is wrong
 * for the most common case — an app in Ukrainian showing Polish questions with
 * a Ukrainian gloss is a different setting from either alone.
 *
 * Takes effect immediately: the whole catalogue ships in the binary, so there
 * is nothing to fetch and no restart.
 */
export default function UiLanguageModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { uiLocale, update } = useSettings();

  const select = (code: string | null) => {
    update({ uiLocale: code });
    router.back();
  };

  const rows: (typeof UI_LOCALES)[] = [];
  for (let i = 0; i < UI_LOCALES.length; i += COLUMNS) {
    rows.push(UI_LOCALES.slice(i, i + COLUMNS));
  }

  const deviceName = findUiLocale(deviceUiLocale())?.nameNative ?? deviceUiLocale();

  return (
    <Screen edges={['top', 'bottom']}>
      <NavBar title={tr('uiLang.navTitle')} action="close" />

      <ScreenScroll
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 14 }}
      >
        <Txt size={22} weight="700">
          {tr('uiLang.heading')}
        </Txt>
        <Txt size={13} color={t.colors.textSecondary} lineHeight={19}>
          {tr('uiLang.subtitle')}
        </Txt>

        {/* "Match my device" first: it is the default, and the only option that
            keeps working when the phone's language changes later. */}
        <Pressable
          onPress={() => select(null)}
          accessibilityRole="button"
          accessibilityLabel={`${tr('uiLang.followDevice')} — ${deviceName}`}
          accessibilityState={{ selected: uiLocale === null }}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            minHeight: 44,
            borderRadius: t.radius.lg,
            backgroundColor: t.colors.sage50,
            borderWidth: 2,
            borderColor: uiLocale === null ? t.colors.accent : t.colors.border,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Icon name="smartphone" size={20} color={t.colors.onSurfaceAlt} />
          <View style={{ flex: 1 }}>
            <Txt size={14} weight="700">
              {tr('uiLang.followDevice')}
            </Txt>
            <Txt size={12} color={t.colors.textSecondary}>
              {deviceName}
            </Txt>
          </View>
          {uiLocale === null ? (
            <Icon name="circle-check" size={20} color={t.colors.accentDark} />
          ) : null}
        </Pressable>

        <View style={{ gap: 10 }}>
          {rows.map((row, rowIndex) => (
            <Row key={rowIndex} style={{ gap: 10, alignItems: 'stretch' }}>
              {row.map((locale) => {
                const selected = locale.code === uiLocale;
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
