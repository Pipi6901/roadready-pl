import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { Button, Screen, Txt } from '@/components/ui/primitives';
import { ACHIEVEMENT_META } from '@/constants/rules';
import type { StringKey } from '@/features/i18n/strings';
import { useT } from '@/features/i18n/useT';
import { useTheme } from '@/theme/ThemeProvider';

const FALLBACK_ICON = 'trophy';

/** Decorative sunburst behind the badge. */
const BURST = Array.from({ length: 12 }, (_, i) => ({
  angle: (i * 30 * Math.PI) / 180,
  size: i % 2 === 0 ? 7 : 5,
}));
const BURST_RADIUS = 66;
const BURST_BOX = 140;

/**
 * New achievement card — ТЗ 8.6.
 *
 * Takes the whole screen. It used to be a sheet pinned to the bottom edge
 * under a dimmed scrim, which is the right shape for a chooser and the wrong
 * one for a celebration: the award sat in the lower third while the top two
 * thirds were a flat dark panel that looked like a rendering fault rather
 * than like the screen underneath showing through.
 *
 * `ids` is a comma-separated list: completing a lesson or a mock can clear
 * more than one achievement at once (a topic's only lesson earns both "First
 * Lesson" and "Topic Master" the same moment), and each one deserves its own
 * celebration rather than only the first surviving.
 */
export default function AchievementModal() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const { ids } = useLocalSearchParams<{ ids?: string }>();
  const [index, setIndex] = React.useState(0);

  const list = React.useMemo(() => (ids ? ids.split(',').filter(Boolean) : []), [ids]);
  const id = list[index];
  const meta = id ? ACHIEVEMENT_META[id] : undefined;
  // A celebration for an id this build does not know still has to read as a
  // celebration rather than as a blank card.
  const title = meta ? tr(`ach.${id}.title` as StringKey) : tr('ach.fallbackTitle');
  const description = meta ? tr(`ach.${id}.desc` as StringKey) : tr('ach.fallbackDesc');
  const isLast = index >= list.length - 1;

  const advance = () => {
    if (isLast) router.back();
    else setIndex((i) => i + 1);
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
          gap: 28,
        }}
      >
        <View style={{ width: BURST_BOX, height: BURST_BOX, alignItems: 'center', justifyContent: 'center' }}>
          {BURST.map((dot, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: dot.size,
                height: dot.size,
                borderRadius: dot.size / 2,
                backgroundColor: i % 2 === 0 ? t.colors.amber : t.colors.accent,
                left: BURST_BOX / 2 + Math.cos(dot.angle) * BURST_RADIUS - dot.size / 2,
                top: BURST_BOX / 2 + Math.sin(dot.angle) * BURST_RADIUS - dot.size / 2,
              }}
            />
          ))}

          <View
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.colors.sage100,
              borderWidth: 4,
              borderColor: t.colors.accent,
            }}
          >
            <Icon name={meta?.icon ?? FALLBACK_ICON} size={52} color={t.colors.onSurfaceAlt} />
          </View>
        </View>

        <View style={{ gap: 8, alignItems: 'center' }}>
          <Txt size={13} weight="700" color={t.colors.amberDark} accessibilityRole="header">
            {tr('ach.unlocked')}
            {list.length > 1 ? ` (${index + 1}/${list.length})` : ''}
          </Txt>
          <Txt size={28} weight="700" align="center">
            {title}
          </Txt>
          <Txt size={15} color={t.colors.textSecondary} align="center" lineHeight={22}>
            {description}
          </Txt>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
        <Button label={isLast ? tr('ach.nice') : tr('ach.next')} icon="party-popper" onPress={advance} />
      </View>
    </Screen>
  );
}
