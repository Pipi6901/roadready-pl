import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { DecoLayer, type DecoItem } from '@/components/onboarding/Decor';
import { GradientScreen } from '@/components/onboarding/GradientScreen';
import { Icon } from '@/components/ui/Icon';
import { Row, Txt } from '@/components/ui/primitives';
import { COUNTRIES } from '@/data/demo-bundle';
import { useSettings } from '@/store/SettingsProvider';
import { useTheme } from '@/theme/ThemeProvider';
import type { Country } from '@/types/content';

const DECO: DecoItem[] = [
  { icon: 'map-pin', size: 20, x: 320, y: 20, rotate: 8 },
  { icon: 'navigation', size: 18, x: 340, y: 80, rotate: -10 },
];

/** Country Selection — mockup frame "Country Selection". */
export default function CountryScreen() {
  const t = useTheme();
  const router = useRouter();
  const { countryCode, update } = useSettings();
  const [query, setQuery] = React.useState('');

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)) : COUNTRIES;
  }, [query]);

  const onSelect = (country: Country) => {
    update({ countryCode: country.code });
    router.push('/language');
  };

  return (
    <GradientScreen to={t.colors.sage100}>
      <DecoLayer items={DECO} color={t.colors.decoration} />

      <View style={{ flex: 1, gap: 16, paddingTop: 12, paddingHorizontal: 20, paddingBottom: 10 }}>
        <Txt size={22} weight="700">
          Where are you taking your test?
        </Txt>

        <Row
          style={{
            gap: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: t.radius.button,
            backgroundColor: t.colors.surface,
            borderWidth: 1,
            borderColor: t.colors.border,
          }}
        >
          <Icon name="search" size={17} color={t.colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search countries"
            placeholderTextColor={t.colors.textMuted}
            accessibilityLabel="Search countries"
            autoCorrect={false}
            style={{ flex: 1, fontSize: 14, color: t.colors.textPrimary, padding: 0 }}
          />
        </Row>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          {results.map((country) => (
            <CountryCard
              key={country.code}
              country={country}
              isDefault={country.code === countryCode}
              onPress={() => onSelect(country)}
            />
          ))}

          {results.length === 0 ? (
            <Txt size={14} color={t.colors.textMuted} align="center" style={{ paddingTop: 24 }}>
              No countries match “{query.trim()}”
            </Txt>
          ) : null}
        </ScrollView>
      </View>
    </GradientScreen>
  );
}

interface CountryCardProps {
  country: Country;
  isDefault: boolean;
  onPress: () => void;
}

function CountryCard({ country, isDefault, onPress }: CountryCardProps) {
  const t = useTheme();
  const available = country.status === 'active';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        available
          ? `${country.name}, ${country.questionCount} questions available`
          : `${country.name}, coming soon, not available yet`
      }
      accessibilityState={{ disabled: !available, selected: available && isDefault }}
      disabled={!available}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        minHeight: 44,
        borderRadius: t.radius.lg,
        backgroundColor: t.colors.surface,
        borderWidth: available ? 2 : 0,
        borderColor: t.colors.accent,
        opacity: available ? 1 : 0.7,
        transform: [{ translateY: pressed ? 1 : 0 }],
        ...(available
          ? {
              shadowColor: t.colors.blue900,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.08,
              shadowRadius: 14,
              elevation: 3,
            }
          : null),
      })}
    >
      {/* The mockup draws each flag as vector shapes; we use the bundle's emoji
          so a new country needs data only, not a hand-drawn SVG. */}
      <View style={{ width: 28, height: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Txt size={19} accessibilityElementsHidden importantForAccessibility="no">
          {country.flagEmoji}
        </Txt>
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Txt size={16} weight="700" color={available ? t.colors.textPrimary : t.colors.textMuted}>
          {country.name}
        </Txt>
        {available ? (
          <Txt size={12} weight="600" color={t.colors.successDark}>
            {country.questionCount} questions available
          </Txt>
        ) : (
          <Txt size={12} color={t.colors.textMuted}>
            Coming soon
          </Txt>
        )}
      </View>

      {available && isDefault ? (
        <View
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
            backgroundColor: t.colors.successBg,
          }}
        >
          <Txt size={11} weight="700" color={t.colors.successDark}>
            Default
          </Txt>
        </View>
      ) : null}

      {available ? null : <Icon name="lock" size={18} color={t.colors.textMuted} />}
    </Pressable>
  );
}
