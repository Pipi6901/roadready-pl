import React from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

interface SettingsRowProps {
  label: string;
  /** Right-aligned secondary value, e.g. "United Kingdom 🇬🇧". */
  value?: string;
  /** Second line under the label, for rows that need an explanation. */
  subtitle?: string;
  /** Optional leading icon. */
  icon?: IconName;
  onPress?: () => void;
  /** Force the chevron on or off; defaults to "on when pressable". */
  chevron?: boolean;
  /** Renders a Switch on the right; the row itself stops being pressable. */
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  /** Destructive action — label goes red (reset progress, delete…). */
  danger?: boolean;
  /** Call-to-action row: the label carries the emphasis instead of a value. */
  accent?: boolean;
  /** Last row of a card — drops the divider. */
  last?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  /** Custom content rendered on the right, e.g. the voice-speed stepper. */
  right?: React.ReactNode;
  /** Full-width content under the label, e.g. a slider. */
  children?: React.ReactNode;
}

/**
 * One line of a settings card — mockup "* Row".
 *
 * Touch target is at least 44pt (NFR-07): 16pt padding on a 14pt label already
 * clears it, and minHeight guards the cases where the label wraps short.
 */
export function SettingsRow({
  label, value, subtitle, icon, onPress, chevron, switchValue, onSwitchChange,
  danger = false, accent = false, last = false, disabled = false, accessibilityHint,
  right, children,
}: SettingsRowProps) {
  const t = useTheme();

  const hasSwitch = switchValue !== undefined;
  const pressable = !!onPress && !hasSwitch && !disabled;
  const showChevron = chevron ?? (pressable && !right);

  const labelColor = danger
    ? t.colors.error
    : accent
      ? t.colors.onSurfaceAlt
      : t.colors.textPrimary;

  const body = (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 22 }}>
        {icon ? (
          <Icon name={icon} size={18} color={danger ? t.colors.error : t.colors.textSecondary} />
        ) : null}

        <View style={{ flex: 1, gap: 2 }}>
          <Txt size={14} weight={accent ? '600' : '400'} color={labelColor}>
            {label}
          </Txt>
          {subtitle ? (
            <Txt size={12} color={t.colors.textSecondary} lineHeight={17}>
              {subtitle}
            </Txt>
          ) : null}
        </View>

        {value ? (
          <Txt size={13} color={t.colors.textSecondary} numberOfLines={1}>
            {value}
          </Txt>
        ) : null}

        {right}

        {hasSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            disabled={disabled}
            accessibilityLabel={label}
            accessibilityState={{ checked: switchValue, disabled }}
            accessibilityHint={accessibilityHint}
            trackColor={{ false: t.colors.border, true: t.colors.accent }}
            thumbColor={t.colors.surface}
            ios_backgroundColor={t.colors.border}
          />
        ) : null}

        {showChevron ? <Icon name="chevron-right" size={16} color={t.colors.textMuted} /> : null}
      </View>

      {children}
    </>
  );

  const frame = {
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 44,
    gap: 10,
    borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth * 2,
    borderBottomColor: t.colors.border,
    opacity: disabled ? 0.5 : 1,
  };

  if (!pressable) {
    return <View style={frame}>{body}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        frame,
        pressed ? { backgroundColor: t.colors.surfaceAlt } : null,
      ]}
    >
      {body}
    </Pressable>
  );
}
