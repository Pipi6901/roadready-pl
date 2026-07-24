import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import { cardShadow } from '@/components/practice/shadow';
import { Icon } from '@/components/ui/Icon';
import { Button, Txt } from '@/components/ui/primitives';
import { ACHIEVEMENT_META } from '@/constants/rules';
import { useTheme } from '@/theme/ThemeProvider';

const FALLBACK = { title: 'Achievement unlocked', description: 'Nice work!', icon: 'trophy' };

/** Decorative sunburst behind the badge. */
const BURST = Array.from({ length: 12 }, (_, i) => ({
  angle: (i * 30 * Math.PI) / 180,
  size: i % 2 === 0 ? 7 : 5,
}));
const BURST_RADIUS = 66;
const BURST_BOX = 140;

/**
 * New achievement card — ТЗ 8.6. Presented as a transparent modal.
 *
 * `ids` is a comma-separated list: completing a lesson/mock can clear more
 * than one achievement at once (e.g. a topic's only lesson earns both
 * "First Lesson" and "Topic Master" the same moment), and each one deserves
 * its own celebration screen rather than only the first surviving.
 */
export default function AchievementModal() {
  const t = useTheme();
  const router = useRouter();
  const { ids } = useLocalSearchParams<{ ids?: string }>();
  const [index, setIndex] = React.useState(0);

  const list = React.useMemo(() => (ids ? ids.split(',').filter(Boolean) : []), [ids]);
  const id = list[index];
  const meta = (id ? ACHIEVEMENT_META[id] : undefined) ?? FALLBACK;
  const isLast = index >= list.length - 1;

  const advance = () => {
    if (isLast) router.back();
    else setIndex((i) => i + 1);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      {/* Scrim. Tinted from the palette, dimmed with opacity so it stays a
          token rather than a hardcoded rgba. */}
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: t.colors.blue900,
          opacity: 0.55,
        }}
      />

      <View
        style={[
          {
            backgroundColor: t.colors.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 24,
            paddingTop: 28,
            paddingBottom: 40,
            gap: 20,
            alignItems: 'center',
          },
          // Shadow cast upward (negative y), since the sheet is pinned to
          // the bottom of the screen — a downward shadow would fall off the
          // edge and never actually be visible against the scrim.
          cardShadow(t, 24, -8, 0.18),
        ]}
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
            <Icon name={meta.icon} size={52} color={t.colors.onSurfaceAlt} />
          </View>
        </View>

        <View style={{ gap: 8, alignItems: 'center' }}>
          <Txt size={13} weight="700" color={t.colors.amberDark} accessibilityRole="header">
            ACHIEVEMENT UNLOCKED{list.length > 1 ? ` (${index + 1}/${list.length})` : ''}
          </Txt>
          <Txt size={24} weight="700" align="center">
            {meta.title}
          </Txt>
          <Txt size={14} color={t.colors.textSecondary} align="center" lineHeight={20}>
            {meta.description}
          </Txt>
        </View>

        <Button label={isLast ? 'Nice!' : 'Next'} icon="party-popper" onPress={advance} />
      </View>
    </View>
  );
}
