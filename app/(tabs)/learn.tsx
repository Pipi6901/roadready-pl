import { useIsFocused, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, type ScrollView, useWindowDimensions, View } from 'react-native';

import {
  NODE_SIZE, TopicNode, type TopicNodeState,
} from '@/components/learning/TopicNode';
import { TopicRoute, type RoutePoint } from '@/components/learning/TopicRoute';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';

const SCREEN_PADDING = 20;
/** Vertical distance between node centres. */
const ROW_PITCH = 124;
/** Snake offsets from the centre line, repeating every four nodes. */
const OFFSETS = [0, 90, 0, -90];

/** Roadside dressing. Rows pick two entries each so the gutters never look bare. */
const DECORATIONS: { icon: IconName; size: number; side: 'left' | 'right'; inset: number; dy: number; faded: boolean }[] = [
  { icon: 'tree-pine', size: 22, side: 'right', inset: 8, dy: 8, faded: true },
  { icon: 'signpost', size: 18, side: 'left', inset: 6, dy: 46, faded: false },
  { icon: 'tree-pine', size: 20, side: 'left', inset: 14, dy: 4, faded: true },
  { icon: 'sprout', size: 16, side: 'right', inset: 22, dy: 54, faded: false },
];

/** Topic List — mockup frame "Topic List". A Duolingo-style route map. */
export default function LearnScreen() {
  const t = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { topics, country } = useContent();
  const progress = useProgress();
  const isFocused = useIsFocused();

  const mapWidth = width - SCREEN_PADDING * 2;
  const centreX = mapWidth / 2;

  const nodes = React.useMemo(() => {
    const stats = topics.map((topic) => ({ topic, stat: progress.topicStats(topic.id) }));
    const currentIndex = stats.findIndex((s) => s.stat.unlocked && !s.stat.completed);

    return stats.map(({ topic, stat }, i) => {
      let state: TopicNodeState = 'available';
      if (!stat.unlocked) state = 'locked';
      else if (stat.completed) state = 'completed';
      else if (i === currentIndex) state = 'current';

      return {
        topic,
        stat,
        state,
        x: centreX + OFFSETS[i % OFFSETS.length],
        y: i * ROW_PITCH + NODE_SIZE / 2,
      };
    });
  }, [topics, progress, centreX]);

  const current = nodes.find((n) => n.state === 'current');
  const mapHeight = nodes.length ? (nodes.length - 1) * ROW_PITCH + NODE_SIZE + 60 : 0;
  const routePoints: RoutePoint[] = nodes.map((n) => ({ x: n.x, y: n.y }));

  const scrollRef = React.useRef<ScrollView>(null);
  // Position of the route map within the scroll content, captured via
  // onLayout since it sits below the country pill / title / continue card,
  // whose heights vary with content.
  const [mapOffsetY, setMapOffsetY] = React.useState<number | null>(null);

  React.useEffect(() => {
    // Re-run on every focus (not just mount) — the map View stays mounted
    // across tab switches, so without this a returning learner would land
    // wherever they last scrolled instead of back at their current topic.
    if (!isFocused || mapOffsetY === null || !current) return;
    scrollRef.current?.scrollTo({
      y: Math.max(0, mapOffsetY + current.y - 130),
      animated: true,
    });
  }, [isFocused, mapOffsetY, current]);

  return (
    <Screen>
      {/* Opaque header — country pill and title stay solid; the ScrollView
          (route map) starts right underneath and runs behind the floating
          "Continue topic" card below. */}
      <View
        style={{
          paddingHorizontal: SCREEN_PADDING,
          paddingTop: 8,
          paddingBottom: 16,
          gap: 16,
          backgroundColor: t.colors.bg,
        }}
      >
        {/* Country pill — opens the country picker */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Country: ${country.name}. Change country`}
          onPress={() => router.push('/(modals)/change-country')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap: 6,
            minHeight: 44,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 20,
            backgroundColor: t.colors.sage100,
          }}
        >
          <Txt size={14}>{country.flagEmoji}</Txt>
          <Txt size={13} weight="600">
            {country.name}
          </Txt>
          <Icon name="chevron-down" size={14} color={t.colors.textSecondary} />
        </Pressable>

        <Txt size={26} weight="700">
          Topics
        </Txt>
      </View>

      <View style={{ flex: 1 }}>
        <ScreenScroll
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: 8 }}
        >
            {/* Route map */}
            <View
              style={{ width: mapWidth, height: mapHeight }}
              onLayout={(e) => setMapOffsetY(e.nativeEvent.layout.y)}
            >
              <TopicRoute points={routePoints} width={mapWidth} height={mapHeight} />

              {nodes.map((n, i) => {
                const decor = [DECORATIONS[i % DECORATIONS.length], DECORATIONS[(i + 2) % DECORATIONS.length]];
                return (
                  <React.Fragment key={n.topic.id}>
                    {decor.map((d, j) => (
                      <View
                        key={`${n.topic.id}-decor-${j}`}
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                        style={{
                          pointerEvents: 'none',
                          position: 'absolute',
                          left: d.side === 'left' ? d.inset : undefined,
                          right: d.side === 'right' ? d.inset : undefined,
                          top: i * ROW_PITCH + d.dy,
                          opacity: d.faded ? 0.45 : 1,
                        }}
                      >
                        <Icon name={d.icon} size={d.size} color={t.colors.decoration} />
                      </View>
                    ))}

                    <View
                      style={{
                        position: 'absolute',
                        left: n.x - NODE_SIZE,
                        // The current node is drawn larger; shift it up so its
                        // centre still sits on the route line.
                        top: i * ROW_PITCH - (n.state === 'current' ? 4 : 0),
                        width: NODE_SIZE * 2,
                        alignItems: 'center',
                      }}
                    >
                      <TopicNode
                        state={n.state}
                        icon={n.topic.icon}
                        name={n.topic.name}
                        mastered={n.stat.mastered}
                        total={n.stat.total}
                        onPress={n.state === 'locked' ? undefined : () => router.push(`/topic/${n.topic.id}`)}
                      />
                    </View>
                  </React.Fragment>
                );
              })}
            </View>
          </ScreenScroll>

        {/* Floating "Continue topic" card — translucent, so the route map
            scrolling underneath stays visible through it instead of hiding
            behind a solid block. */}
        {current ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Continue topic ${current.topic.name}, ${current.stat.mastered} of ${current.stat.total} questions mastered`}
            onPress={() => router.push(`/topic/${current.topic.id}`)}
            style={{
              position: 'absolute',
              top: 8,
              left: SCREEN_PADDING,
              right: SCREEN_PADDING,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderRadius: 28,
              backgroundColor: `${t.colors.sage50}B3`,
              borderWidth: 1,
              borderColor: `${t.colors.sage100}B3`,
            }}
          >
            <View style={{ gap: 2, flex: 1 }}>
              <Txt size={11} weight="600" color={t.colors.accentDark} style={{ letterSpacing: 0.5 }}>
                CONTINUE TOPIC
              </Txt>
              <Txt size={19} weight="700">
                {current.topic.name}
              </Txt>
            </View>
            <ProgressRing
              value={current.stat.total ? current.stat.mastered / current.stat.total : 0}
              size={48}
              thickness={7}
              label={`${current.stat.total ? Math.round((current.stat.mastered / current.stat.total) * 100) : 0}%`}
              labelSize={11}
            />
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}
