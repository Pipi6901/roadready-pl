import React from 'react';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useT } from '@/features/i18n/useT';
import { useTheme } from '@/theme/ThemeProvider';

export type TopicNodeState = 'completed' | 'current' | 'started' | 'available';

/** Mockup component "Topic Node" (72×72, radius 24). The current node is drawn larger. */
export const NODE_SIZE = 72;
export const NODE_SIZE_CURRENT = 80;
/**
 * Widest a label is ever drawn. The actual width comes from the map, which
 * sizes it against the screen — see learn.tsx — because the figure that
 * matters is the longest single WORD in the section names, and a word that
 * does not fit is broken mid-word rather than wrapped.
 */
export const NODE_LABEL_MAX_WIDTH = 168;

interface TopicNodeProps {
  state: TopicNodeState;
  /** Lucide name from the content bundle. */
  icon: string;
  name: string;
  mastered: number;
  total: number;
  /** Set by the map, which sizes it against the screen. Defaults to the
   *  cap so the component is still usable on its own. */
  labelWidth?: number;
  onPress?: () => void;
}

const STATE_KEY: Record<TopicNodeState, 'topic.completed' | 'topic.inProgress' | 'topic.notStarted'> = {
  completed: 'topic.completed',
  current: 'topic.inProgress',
  available: 'topic.notStarted',
  started: 'topic.inProgress',
};

export function TopicNode({
  state, icon, name, mastered, total, labelWidth = NODE_LABEL_MAX_WIDTH, onPress,
}: TopicNodeProps) {
  const t = useTheme();
  const tr = useT();

  const size = state === 'current' ? NODE_SIZE_CURRENT : NODE_SIZE;

  // Fill / edge / icon per state. The edge is the 3–4px bottom stroke the
  // mockup uses to make every node read as a physical slab.
  const skin = {
    completed: {
      bg: t.colors.nodeCompleted,
      edge: t.colors.blue900,
      edgeWidth: 4,
      fg: t.colors.onBlue,
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
    // Started but not finished: same slab as an untouched section, drawn in
    // the accent so a glance down the route separates "not opened yet" from
    // "opened, still owing". No padlock any more — nothing is gated.
    started: {
      bg: t.colors.sage50,
      edge: t.colors.accentDark,
      edgeWidth: 4,
      fg: t.colors.accentDark,
      iconName: icon,
    },
  }[state];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}. ${tr('topic.mastered', { done: mastered, total })}. ${tr(STATE_KEY[state])}`}
      accessibilityState={{ disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        transform: [{ translateY: pressed ? 2 : 0 }],
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
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 4,
        }}
      >
        <Icon name={skin.iconName} size={state === 'current' ? 34 : 30} color={skin.fg} />
      </View>

      <View style={{ width: labelWidth, marginTop: 6, gap: 1 }}>
        {state === 'current' ? (
          <Txt size={10} weight="600" align="center" color={t.colors.accentDark} style={{ letterSpacing: 0.5 }}>
            {tr('learn.continueTopic').toUpperCase()}
          </Txt>
        ) : null}
        {/* Name and count as separate lines, not one string with a
            newline: the map measures this label to space its rows (see
            learn.tsx), and numberOfLines can only hold that estimate if
            the count is not competing with the name for the same lines. */}
        <Txt
          size={11}
          weight="600"
          align="center"
          lineHeight={14}
          numberOfLines={3}
          // Belt to the braces of the width above: a section name longer
          // than any of today's shrinks a little rather than losing a
          // letter to the next line.
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          color={t.colors.textPrimary}
        >
          {name}
        </Txt>
        <Txt size={11} weight="600" align="center" lineHeight={14} color={t.colors.textPrimary}>
          {mastered}/{total}
        </Txt>
      </View>
    </Pressable>
  );
}
