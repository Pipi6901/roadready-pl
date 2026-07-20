import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useTheme } from '@/theme/ThemeProvider';

export type TopicNodeState = 'completed' | 'current' | 'available' | 'locked';

/** Mockup component "Topic Node" (72×72, radius 24). The current node is drawn larger. */
export const NODE_SIZE = 72;
export const NODE_SIZE_CURRENT = 80;
export const NODE_LABEL_WIDTH = 120;

interface TopicNodeProps {
  state: TopicNodeState;
  /** Lucide name from the content bundle. */
  icon: string;
  name: string;
  mastered: number;
  total: number;
  onPress?: () => void;
}

const STATE_TEXT: Record<TopicNodeState, string> = {
  completed: 'completed',
  current: 'in progress',
  available: 'not started',
  locked: 'locked',
};

export function TopicNode({ state, icon, name, mastered, total, onPress }: TopicNodeProps) {
  const t = useTheme();

  const size = state === 'current' ? NODE_SIZE_CURRENT : NODE_SIZE;
  const locked = state === 'locked';

  // Fill / edge / icon per state. The edge is the 3–4px bottom stroke the
  // mockup uses to make every node read as a physical slab.
  const skin = {
    completed: {
      bg: t.colors.nodeCompleted,
      edge: t.colors.blue900,
      edgeWidth: 4,
      fg: t.colors.textInverse,
      iconName: 'check',
    },
    current: {
      bg: t.colors.accent,
      edge: t.colors.accentDark,
      edgeWidth: 4,
      fg: t.colors.textInverse,
      iconName: icon,
    },
    available: {
      bg: t.colors.sage100,
      edge: t.colors.accent,
      edgeWidth: 3,
      fg: t.colors.accentDark,
      iconName: icon,
    },
    locked: {
      bg: t.colors.sage100,
      edge: t.colors.border,
      edgeWidth: 3,
      fg: t.colors.textMuted,
      iconName: 'lock',
    },
  }[state];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${mastered} of ${total} questions mastered, ${STATE_TEXT[state]}`}
      accessibilityState={{ disabled: locked }}
      disabled={locked || !onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        transform: [{ translateY: pressed && !locked ? 2 : 0 }],
      })}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: t.radius.lg,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: skin.bg,
          borderBottomWidth: skin.edgeWidth,
          borderBottomColor: skin.edge,
          shadowColor: state === 'current' ? t.colors.accentDark : t.colors.blue900,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: locked ? 0.08 : 0.2,
          shadowRadius: 10,
          elevation: locked ? 2 : 4,
        }}
      >
        <Icon name={skin.iconName} size={state === 'current' ? 34 : 30} color={skin.fg} />
      </View>

      <View style={{ width: NODE_LABEL_WIDTH, marginTop: 6, gap: 1 }}>
        {state === 'current' ? (
          <Txt size={10} weight="600" align="center" color={t.colors.accentDark} style={{ letterSpacing: 0.5 }}>
            CONTINUE TOPIC
          </Txt>
        ) : null}
        <Txt
          size={11}
          weight={locked ? '400' : '600'}
          align="center"
          lineHeight={14}
          color={locked ? t.colors.textMuted : t.colors.textPrimary}
        >
          {name}
          {'\n'}
          {mastered}/{total}
        </Txt>
      </View>
    </Pressable>
  );
}
