import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { DecoLayer, type DecoItem } from '@/components/onboarding/Decor';
import { GradientScreen } from '@/components/onboarding/GradientScreen';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { LOCALES } from '@/data/demo-bundle';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';
import type { Locale } from '@/types/content';

const DECO: DecoItem[] = [
  { icon: 'globe', size: 20, x: 25, y: 15, rotate: -6 },
  { icon: 'message-circle', size: 18, x: 330, y: 90, rotate: 10 },
];

const COLUMNS = 3;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/** Language Selection — mockup frame "Language Selection". */
export default function LanguageScreen() {
  const t = useTheme();
  const router = useRouter();
  const { localeCode, update } = useSettings();
  const [selected, setSelected] = React.useState<string | null>(localeCode);

  const rows = React.useMemo(() => chunk(LOCALES, COLUMNS), []);

  const onContinue = () => {
    update({ localeCode: selected });
    router.push('/goal');
  };

  return (
    <GradientScreen to={t.colors.sage100}>
      <DecoLayer items={DECO} color={t.colors.decoration} />

      <View style={{ flex: 1, gap: 14, paddingTop: 12, paddingHorizontal: 20, paddingBottom: 10 }}>
        <Txt size={22} weight="700">
          Choose your translation language
        </Txt>
        <Txt size={13} color={t.colors.textSecondary}>
          Questions will show in English + your chosen language
        </Txt>

        <Pressable
          accessibilityRole="radio"
          accessibilityLabel="English only, no translation"
          accessibilityState={{ selected: selected === null, checked: selected === null }}
          onPress={() => setSelected(null)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            minHeight: 44,
            borderRadius: t.radius.lg,
            backgroundColor: t.colors.sage50,
            borderWidth: 2,
            borderColor: selected === null ? t.colors.accent : t.colors.sage100,
          }}
        >
          <Icon name="languages" size={20} color={t.colors.onSurfaceAlt} />
          <Txt size={14} weight="700" style={{ flex: 1 }}>
            English only (no translation)
          </Txt>
          {selected === null ? (
            <Icon name="circle-check" size={20} color={t.colors.accentDark} />
          ) : null}
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
          {rows.map((row, i) => (
            <View key={`row-${i}`} style={{ flexDirection: 'row', gap: 10 }}>
              {row.map((locale) => (
                <LanguageCell
                  key={locale.code}
                  locale={locale}
                  selected={selected === locale.code}
                  onPress={() => setSelected(locale.code)}
                />
              ))}
              {/* Keeps the last row's cells the same width as a full row. */}
              {Array.from({ length: COLUMNS - row.length }, (_, k) => (
                <View key={`filler-${k}`} style={{ flex: 1 }} />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ paddingTop: 14, paddingHorizontal: 20, paddingBottom: 20 }}>
        <OnboardingButton label="Continue" onPress={onContinue} />
      </View>
    </GradientScreen>
  );
}

interface LanguageCellProps {
  locale: Locale;
  selected: boolean;
  onPress: () => void;
}

function LanguageCell({ locale, selected, onPress }: LanguageCellProps) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${locale.nameEnglish}, ${locale.nameNative}`}
      accessibilityState={{ selected, checked: selected }}
      onPress={onPress}
      style={{
        flex: 1,
        minHeight: 64,
        gap: 4,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: t.radius.md,
        backgroundColor: selected ? t.colors.sage50 : t.colors.surface,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? t.colors.accent : t.colors.border,
      }}
    >
      {selected ? (
        <View style={{ position: 'absolute', top: 4, right: 4 }}>
          <Icon name="circle-check" size={14} color={t.colors.accentDark} />
        </View>
      ) : null}

      <Txt size={17} accessibilityElementsHidden importantForAccessibility="no">
        {locale.flagEmoji}
      </Txt>
      <Txt size={12} weight="600" align="center">
        {locale.nameNative}
      </Txt>
    </Pressable>
  );
}
