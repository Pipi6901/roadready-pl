import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Row, Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';
import { cardShadow } from './shadow';

export interface PracticeCardBadge {
  icon: IconName;
  label: string;
  bg: string;
  fg: string;
}

interface PracticeCardProps {
  icon: IconName;
  /** Icon box fill and its 4px bottom edge, per the mockup's slab treatment. */
  iconBg: string;
  iconEdge: string;
  title: string;
  subtitle: string;
  badges?: PracticeCardBadge[];
  disabled?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
}

/** One row of the Practice Hub — mockup frames "Mock Test Card" and siblings. */
export function PracticeCard({
  icon, iconBg, iconEdge, title, subtitle, badges = [], disabled = false, onPress,
  accessibilityHint,
}: PracticeCardProps) {
  const t = useTheme();

  const label = [title, subtitle, ...badges.map((b) => b.label)].join('. ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          padding: 16,
          minHeight: 88,
          borderRadius: t.radius.lg,
          backgroundColor: t.colors.surface,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderColor: t.colors.sage100,
          opacity: disabled ? 0.55 : 1,
          transform: [{ translateY: pressed && !disabled ? 1 : 0 }],
        },
        cardShadow(t),
      ]}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: iconBg,
          borderBottomWidth: 4,
          borderBottomColor: iconEdge,
        }}
      >
        <Icon name={icon} size={26} color={t.colors.textInverse} />
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        <Txt size={16} weight="700">
          {title}
        </Txt>
        <Txt size={12} color={t.colors.textSecondary}>
          {subtitle}
        </Txt>

        {badges.length ? (
          <Row style={{ gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
            {badges.map((badge) => (
              <Row
                key={badge.label}
                style={{
                  gap: 4,
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: badge.bg,
                }}
              >
                <Icon name={badge.icon} size={11} color={badge.fg} />
                <Txt size={11} weight="700" color={badge.fg}>
                  {badge.label}
                </Txt>
              </Row>
            ))}
          </Row>
        ) : null}
      </View>

      {disabled ? null : (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.colors.sage50,
          }}
        >
          <Icon name="chevron-right" size={18} color={t.colors.textMuted} />
        </View>
      )}
    </Pressable>
  );
}
