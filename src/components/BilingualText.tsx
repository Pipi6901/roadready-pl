import React from 'react';
import { View, type TextStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Txt } from '@/components/ui/primitives';
import { useSettings } from '@/store/SettingsProvider';

interface BilingualTextProps {
  english: string;
  translation?: string | null;
  /** Font size of the English line; the translation renders smaller. */
  size?: number;
  weight?: TextStyle['fontWeight'];
  translationSize?: number;
  gap?: number;
  align?: TextStyle['textAlign'];
  color?: string;
  translationColor?: string;
}

/**
 * The ONLY sanctioned way to show two languages (ТЗ 10.3, 10.4).
 *
 * English is primary: larger and higher contrast. The translation sits BELOW
 * it, smaller and dimmer. Side-by-side columns are explicitly forbidden.
 * In "English only" mode the second line is not rendered at all.
 */
export function BilingualText({
  english, translation, size = 17, weight = '600', translationSize, gap = 6, align,
  color, translationColor,
}: BilingualTextProps) {
  const t = useTheme();
  const { localeDirection, translationEnabled } = useSettings();

  const showTranslation = translationEnabled && !!translation;

  return (
    <View style={{ gap }}>
      <Txt size={size} weight={weight} color={color ?? t.colors.textPrimary} align={align}>
        {english}
      </Txt>
      {showTranslation ? (
        <Txt
          size={translationSize ?? Math.max(12, size - 4)}
          weight="400"
          color={translationColor ?? t.colors.textSecondary}
          align={align}
          style={{ writingDirection: localeDirection }}
        >
          {translation}
        </Txt>
      ) : null}
    </View>
  );
}
