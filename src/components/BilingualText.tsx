import React from 'react';
import { View, type TextStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { Txt } from '@/components/ui/primitives';
import { useQuestionLanguage } from '@/features/i18n/questionLanguage';
import { useSettings } from '@/store/SettingsProvider';

interface BilingualTextProps {
  original: string;
  translation?: string | null;
  /** Font size of the original line; the translation renders smaller. */
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
 * The original wording is primary: larger and higher contrast. The translation
 * sits BELOW it, smaller and dimmer. Side-by-side columns are explicitly
 * forbidden. In "no translation" mode the second line is not rendered at all.
 *
 * Which language is on top is not fixed, it is decided by useQuestionLanguage:
 * the exam may be sat in English, German or Ukrainian, so those REPLACE the
 * Polish outright and nothing renders underneath. Everything else is a study
 * aid and keeps Polish on top, because that is the paper the candidate will
 * actually be handed.
 */
export function BilingualText({
  original, translation, size = 17, weight = '600', translationSize, gap = 6, align,
  color, translationColor,
}: BilingualTextProps) {
  const t = useTheme();
  const { localeDirection, translationEnabled } = useSettings();
  const lang = useQuestionLanguage();

  const secondary = lang.secondary(translation);
  const showTranslation = translationEnabled && !!secondary;

  return (
    <View style={{ gap }}>
      <Txt
        size={size}
        weight={weight}
        color={color ?? t.colors.textPrimary}
        align={align}
        style={lang.examLanguage ? { writingDirection: localeDirection } : undefined}
      >
        {lang.primary(original, translation)}
      </Txt>
      {showTranslation ? (
        <Txt
          size={translationSize ?? Math.max(12, size - 4)}
          weight="400"
          color={translationColor ?? t.colors.textSecondary}
          align={align}
          style={{ writingDirection: localeDirection }}
        >
          {secondary}
        </Txt>
      ) : null}
    </View>
  );
}
