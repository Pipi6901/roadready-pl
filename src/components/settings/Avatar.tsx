import React from 'react';
import { View } from 'react-native';

import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * There is no account and no uploaded picture (ADR-002), so the avatar is
 * always initials derived from the locally chosen display name.
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  size: number;
  radius: number;
  fontSize: number;
  /** Depth of the mockup's bottom "slab" edge. */
  edge?: number;
}

export function Avatar({ name, size, radius, fontSize, edge = 3 }: AvatarProps) {
  const t = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`Avatar for ${name}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.colors.blue800,
        borderBottomWidth: edge,
        borderBottomColor: t.colors.blue900,
      }}
    >
      <Txt size={fontSize} weight="700" color={t.colors.onBlue}>
        {initials(name)}
      </Txt>
    </View>
  );
}
