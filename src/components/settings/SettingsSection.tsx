import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * The mockup draws every card with a soft drop shadow (#0B2A4412, y+3, blur 14).
 * Reproduced from the palette instead of the literal rgba so dark mode keeps
 * working — a hardcoded blue-black shadow is invisible on a dark surface.
 */
export function useCardShadow() {
  const t = useTheme();
  return {
    shadowColor: t.colors.blue900,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: t.isDark ? 0.35 : 0.07,
    shadowRadius: 7,
    elevation: 2,
  } as const;
}

interface SettingsSectionProps extends ViewProps {
  /** Section label — rendered uppercase, so pass it in natural case. */
  title: string;
  icon: IconName;
  /** Defaults to blue800; the mockup tints some sections amber or lime. */
  iconColor?: string;
  children: React.ReactNode;
}

/** Labelled group of {@link SettingsRow}s — mockup "Section Header" + "* Card". */
export function SettingsSection({
  title, icon, iconColor, children, style, ...rest
}: SettingsSectionProps) {
  const t = useTheme();
  const shadow = useCardShadow();

  return (
    <View style={[{ gap: 8 }, style]} {...rest}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name={icon} size={13} color={iconColor ?? t.colors.onSurfaceAlt} />
        <Txt variant="label" weight="700" color={t.colors.textMuted}>
          {title.toUpperCase()}
        </Txt>
      </View>

      {/* Shadow lives on the outer view: overflow:hidden on the same node would
          clip it away on iOS, and the inner clip is what keeps pressed-row
          highlights inside the rounded corners. */}
      <View style={[{ borderRadius: t.radius.lg, backgroundColor: t.colors.surface }, shadow]}>
        <View
          style={{
            borderRadius: t.radius.lg,
            borderWidth: StyleSheet.hairlineWidth * 2,
            borderColor: t.colors.border,
            overflow: 'hidden',
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}
