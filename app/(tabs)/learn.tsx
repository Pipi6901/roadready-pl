import { useIsFocused, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, type ScrollView, useWindowDimensions, View } from 'react-native';

import {
  NODE_SIZE, NODE_SIZE_CURRENT, TopicNode, type TopicNodeState,
} from '@/components/learning/TopicNode';
import { TopicRoute, type RoutePoint } from '@/components/learning/TopicRoute';
import { useT } from '@/features/i18n/useT';
import { cardShadow } from '@/components/practice/shadow';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Screen, ScreenScroll, Txt } from '@/components/ui/primitives';
import { useContent } from '@/store/ContentProvider';
import { useProgress } from '@/store/ProgressProvider';
import { useTheme } from '@/theme/ThemeProvider';

const SCREEN_PADDING = 20;
/** Extra vertical room on the trail where the question class changes. */
const SECTION_GAP = 64;
/** Baseline vertical distance between node centres — actual spacing jitters
 *  around this, see nodes useMemo below. */
const ROW_PITCH = 124;
/** Furthest a node can drift from the centre line. Bounded well inside the
 *  map width so the node's label (NODE_LABEL_WIDTH) and the roadside decor
 *  icons never clip off-screen on a narrow phone. */
const MAX_OFFSET = 100;
/** How much a row's vertical pitch can vary either way, so the trail doesn't
 *  read as a fixed-height ladder. */
const PITCH_JITTER = 18;
/** Vertical space the floating "Continue topic" card needs to clear before
 *  it stops overlapping whatever's scrolled beneath it. Used both as the
 *  map's baseline top padding (so the very first node — the common case for
 *  a brand-new learner, since topic 0 starts as "current" — never renders
 *  directly under the card) and as the auto-scroll margin for deeper nodes. */
const CARD_CLEARANCE = 130;

/** Deterministic 0..1 "random" from an integer seed — stable across
 *  re-renders (no Math.random) so the map's shape doesn't jump around every
 *  time progress changes elsewhere in the app. */
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

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
  const tr = useT();
  const { topics } = useContent();
  const progress = useProgress();
  const isFocused = useIsFocused();

  const mapWidth = width - SCREEN_PADDING * 2;
  const centreX = mapWidth / 2;

  const nodes = React.useMemo(() => {
    const stats = topics.map((topic) => ({ topic, stat: progress.topicStats(topic.id) }));
    const currentIndex = stats.findIndex((s) => !s.stat.completed);

    // A trail, not a ladder: horizontal drift is a smoothed pseudo-random
    // walk (each offset leans 35% toward the previous one) so the path
    // curves organically instead of snapping between fixed positions, and
    // the vertical pitch jitters too so rows don't all land the same
    // distance apart. Deterministic per topic index — not Math.random — so
    // the shape stays put across re-renders instead of reshuffling every
    // time progress changes.
    let prevOffset = 0;
    let y = NODE_SIZE / 2;

    return stats.map(({ topic, stat }, i) => {
      // No locked state any more: every section is open from the first
      // launch. What the node shows is how far through it the learner is.
      let state: TopicNodeState = stat.started ? 'started' : 'available';
      if (stat.completed) state = 'completed';
      else if (i === currentIndex) state = 'current';

      // The route runs through the basic sections first and the specialist
      // ones after, because that is the order of the paper itself. Where the
      // class changes the trail gets extra room for a marker: the candidate
      // should be able to see, while scrolling, that the exam has two halves.
      const startsSpecialist = i > 0 && stats[i - 1].topic.category !== topic.category;
      if (i > 0) {
        y += ROW_PITCH + (pseudoRandom(i * 3.17 + 11) * 2 - 1) * PITCH_JITTER;
        if (startsSpecialist) y += SECTION_GAP;
      }
      const offset = i === 0 ? 0 : Math.round(
        prevOffset * 0.35 + (pseudoRandom(i * 7.31 + 1) * 2 - 1) * MAX_OFFSET * 0.65,
      );
      prevOffset = offset;

      return {
        topic,
        stat,
        state,
        startsSpecialist,
        x: centreX + offset,
        y,
      };
    });
  }, [topics, progress, centreX]);

  const current = nodes.find((n) => n.state === 'current');
  const mapHeight = nodes.length ? nodes[nodes.length - 1].y + NODE_SIZE / 2 + 60 : 0;
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
    // Align the node's top edge, not its centre, with the clearance line:
    // centring put the upper half of the node (and it is the big one) under
    // the card, so the first topic sat flush against it with no gap.
    const nodeTop = current.y - NODE_SIZE_CURRENT / 2 - 4;
    scrollRef.current?.scrollTo({
      y: Math.max(0, mapOffsetY + nodeTop - CARD_CLEARANCE),
      animated: true,
    });
  }, [isFocused, mapOffsetY, current]);

  return (
    <Screen flat>
      {/* Opaque header — title stays solid; the ScrollView (route map) starts
          right underneath and runs behind the floating "Continue topic" card
          below. Country pill removed (ADR-013): one app per country now, so
          there's nothing to switch to. */}
      <View
        style={{
          paddingHorizontal: SCREEN_PADDING,
          paddingTop: 8,
          paddingBottom: 16,
          gap: 16,
          backgroundColor: t.colors.bg,
        }}
      >
        <Txt size={26} weight="700">
          {tr('learn.title')}
        </Txt>
      </View>

      <View style={{ flex: 1 }}>
        <ScreenScroll
          ref={scrollRef}
          contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING, paddingTop: CARD_CLEARANCE }}
        >
            {/* Route map */}
            <View
              style={{ width: mapWidth, height: mapHeight }}
              onLayout={(e) => setMapOffsetY(e.nativeEvent.layout.y)}
            >
              <TopicRoute points={routePoints} width={mapWidth} height={mapHeight} />

              {/* Class marker. Not decoration: 12 of the 32 questions on the
                  paper come from below this line, and they are scored and
                  timed differently from the ones above it. */}
              {nodes.map((n) =>
                n.startsSpecialist ? (
                  <View
                    key={`${n.topic.id}-divider`}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: n.y - NODE_SIZE / 2 - SECTION_GAP + 10,
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Txt size={13} weight="700" color={t.colors.onSurfaceAlt}>
                      {tr('learn.specialistSection')}
                    </Txt>
                    <Txt size={11} color={t.colors.textSecondary}>
                      {tr('learn.specialistHint')}
                    </Txt>
                  </View>
                ) : null,
              )}

              {nodes.map((n, i) => {
                const decor = [DECORATIONS[i % DECORATIONS.length], DECORATIONS[(i + 2) % DECORATIONS.length]];
                const rowTop = n.y - NODE_SIZE / 2;
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
                          top: rowTop + d.dy,
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
                        top: rowTop - (n.state === 'current' ? 4 : 0),
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
                        onPress={() => router.push(`/topic/${n.topic.id}`)}
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
            accessibilityLabel={`${tr('learn.continueTopic')} ${current.topic.name}, ${current.stat.mastered} / ${current.stat.total}`}
            onPress={() => router.push(`/topic/${current.topic.id}`)}
            style={[
              {
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
              },
              // A bit more lift than the standard card shadow — this floats
              // over the map rather than sitting flush on the page.
              cardShadow(t, 20, 6, 0.12),
            ]}
          >
            <View style={{ gap: 2, flex: 1 }}>
              <Txt size={11} weight="600" color={t.colors.accentDark} style={{ letterSpacing: 0.5 }}>
                {tr('learn.continueTopic').toUpperCase()}
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
