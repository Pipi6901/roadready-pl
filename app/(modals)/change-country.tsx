import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { NavBar } from '@/components/settings/NavBar';
import { useCardShadow } from '@/components/settings/SettingsSection';
import { Icon } from '@/components/ui/Icon';
import { Row, Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useContent } from '@/store/ContentProvider';
import { useSettings } from '@/store/SettingsProvider';
import { useT } from '@/features/i18n/useT';
import { useTheme } from '@/theme/ThemeProvider';
import type { Country } from '@/types/content';

/**
 * Rough download size for the confirmation dialog. The real figure comes from
 * the content manifest once packages are served (docs/03-content-pipeline.md);
 * this keeps the warning honest instead of quoting a made-up constant.
 */
const MB_PER_100_QUESTIONS = 6;

function estimateMb(country: Country): number {
  return Math.max(5, Math.round((country.questionCount / 100) * MB_PER_100_QUESTIONS));
}

/** Change country — ТЗ 8.1. */
export default function CountryModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const shadow = useCardShadow();
  const { countries } = useContent();
  const { countryCode, update } = useSettings();

  const [query, setQuery] = React.useState('');

  const filtered = countries.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const onSelect = (country: Country) => {
    if (country.code === countryCode) {
      router.back();
      return;
    }
    // Switching country replaces the whole question bank, so it is confirmed
    // with the download size rather than applied silently (ТЗ 8.1).
    Alert.alert(
      tr('country.switchTitle', { country: country.name }),
      tr('country.switchBody', { size: estimateMb(country) }),
      [
        { text: tr('common.cancel'), style: 'cancel' },
        {
          text: tr('common.continue'),
          onPress: () => {
            update({ countryCode: country.code });
            router.back();
          },
        },
      ],
    );
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <NavBar title={tr('country.navTitle')} action="close" />

      <View style={{ paddingHorizontal: 20, paddingTop: 4, gap: 16, flex: 1 }}>
        <Txt size={22} weight="700">
          {tr('country.heading')}
        </Txt>

        <Row
          style={{
            gap: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: t.radius.button,
            backgroundColor: t.colors.surface,
            borderWidth: StyleSheet.hairlineWidth * 2,
            borderColor: t.colors.border,
          }}
        >
          <Icon name="search" size={17} color={t.colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={tr('country.search')}
            placeholderTextColor={t.colors.textMuted}
            accessibilityLabel={tr('country.search')}
            autoCorrect={false}
            style={{ flex: 1, fontSize: 14, color: t.colors.textPrimary, padding: 0 }}
          />
        </Row>

        <ScreenScroll style={{ flex: 1 }} contentContainerStyle={{ gap: 10, paddingBottom: 24 }}>
          {filtered.map((country) => {
            const selected = country.code === countryCode;
            const available = country.status === 'active';

            return (
              <Pressable
                key={country.code}
                onPress={() => onSelect(country)}
                disabled={!available}
                accessibilityRole="button"
                accessibilityLabel={
                  available
                    ? `${country.name}, ${tr('country.available', { count: country.questionCount })}`
                    : `${country.name}, ${tr('country.comingSoon')}`
                }
                accessibilityState={{ selected, disabled: !available }}
                style={({ pressed }) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 16,
                    minHeight: 44,
                    borderRadius: t.radius.lg,
                    backgroundColor: t.colors.surface,
                    borderWidth: selected ? 2 : StyleSheet.hairlineWidth * 2,
                    borderColor: selected ? t.colors.accent : t.colors.border,
                    opacity: available ? (pressed ? 0.85 : 1) : 0.7,
                  },
                  available ? shadow : null,
                ]}
              >
                <Txt size={22}>{country.flagEmoji}</Txt>

                <View style={{ flex: 1, gap: 2 }}>
                  <Txt size={16} weight="700" color={available ? t.colors.textPrimary : t.colors.textMuted}>
                    {country.name}
                  </Txt>
                  <Txt
                    size={12}
                    weight={available ? '600' : '400'}
                    color={available ? t.colors.successText : t.colors.textMuted}
                  >
                    {available
                      ? tr('country.available', { count: country.questionCount })
                      : tr('country.comingSoon')}
                  </Txt>
                </View>

                {!available ? (
                  <Icon name="lock" size={18} color={t.colors.textMuted} />
                ) : selected ? (
                  <View
                    style={{
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      borderRadius: 10,
                      backgroundColor: t.colors.successBg,
                    }}
                  >
                    <Txt size={11} weight="700" color={t.colors.successText}>
                      {tr('country.selected')}
                    </Txt>
                  </View>
                ) : null}
              </Pressable>
            );
          })}

          {filtered.length === 0 ? (
            <Txt size={14} color={t.colors.textSecondary} align="center">
              No countries match “{query}”.
            </Txt>
          ) : null}
        </ScreenScroll>
      </View>
    </Screen>
  );
}
