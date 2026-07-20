import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { SoftButton } from '@/components/practice/SoftButton';
import { Icon } from '@/components/ui/Icon';
import { Button, Row, Screen, Txt } from '@/components/ui/primitives';
import {
  getHazardClip, HAZARD_CLIPS, HAZARD_MAX_POINTS, nextHazardClipId, scoreHazardTap,
  type HazardScore,
} from '@/features/practice/hazardClips';
import { HAZARD_ENABLED } from '@/store/SubscriptionProvider';
import { useTheme } from '@/theme/ThemeProvider';

/** Hazard Perception Clip — mockup frame "Hazard Perception Clip". */
export default function HazardClipScreen() {
  const t = useTheme();
  const router = useRouter();
  const { clipId } = useLocalSearchParams<{ clipId: string }>();

  const clip = clipId ? getHazardClip(clipId) : undefined;
  const clipIndex = clip ? HAZARD_CLIPS.findIndex((c) => c.id === clip.id) : -1;

  const [score, setScore] = React.useState<HazardScore | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const player = useVideoPlayer(clip?.uri ?? null, (p) => {
    p.loop = false;
    p.timeUpdateEventInterval = 0.25;
  });

  const backToPractice = () => router.replace('/practice');

  const togglePlayback = () => {
    if (!clip) return;
    if (playing) {
      player.pause();
      setPlaying(false);
    } else {
      player.play();
      setPlaying(true);
    }
  };

  const tapHazard = () => {
    if (!clip || !playing || score) return;
    /*
     * The tap time is read straight off the player inside the gesture handler.
     * The `timeUpdate` event is throttled (a few times a second at best) and
     * arrives asynchronously, so a cached timestamp can be hundreds of
     * milliseconds stale — enough to move a tap across a scoring band and
     * report the wrong result. `currentTime` is a synchronous native read.
     */
    setScore(scoreHazardTap(clip, player.currentTime));
  };

  const goNext = () => {
    const next = clip ? nextHazardClipId(clip.id) : null;
    if (next) router.replace(`/hazard/${next}`);
    else backToPractice();
  };

  if (!HAZARD_ENABLED || !clip) {
    return <ComingSoon onBack={backToPractice} />;
  }

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close hazard perception"
          onPress={backToPractice}
          hitSlop={11}
        >
          <Icon name="x" size={22} color={t.colors.textSecondary} />
        </Pressable>
        <Txt size={16} weight="700">
          Hazard Perception
        </Txt>
        <Txt size={12} weight="600" color={t.colors.textSecondary}>
          Clip {clipIndex + 1} of {HAZARD_CLIPS.length}
        </Txt>
      </Row>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20, gap: 18 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={playing ? 'Tap when you spot a developing hazard' : 'Play the clip'}
          onPress={playing ? tapHazard : togglePlayback}
          style={{
            height: 230,
            borderRadius: t.radius.lg,
            overflow: 'hidden',
            backgroundColor: t.colors.blue900,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
          />

          {playing ? null : (
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: t.colors.overlayOnDark,
              }}
            >
              <Icon name="play" size={26} color={t.colors.textInverse} />
            </View>
          )}
        </Pressable>

        <Row
          style={{
            gap: 10,
            padding: 14,
            borderRadius: t.radius.md,
            backgroundColor: t.colors.sage50,
            borderWidth: StyleSheet.hairlineWidth * 2,
            borderColor: t.colors.sage100,
          }}
        >
          <Icon name="hand" size={18} color={t.colors.onSurfaceAlt} />
          <Txt size={13} weight="600" style={{ flex: 1 }}>
            Tap when you spot a developing hazard
          </Txt>
        </Row>

        {score ? (
          <View
            accessible
            accessibilityLiveRegion="polite"
            accessibilityLabel={`${score.title}. ${score.detail}. ${score.points} of ${HAZARD_MAX_POINTS} points`}
            style={{
              gap: 10,
              padding: 16,
              borderRadius: t.radius.lg,
              backgroundColor: score.points ? t.colors.successBg : t.colors.amber50,
              borderWidth: StyleSheet.hairlineWidth * 2,
              borderColor: t.colors.sage100,
            }}
          >
            <Row style={{ gap: 8 }}>
              <Icon
                name={score.points ? 'circle-check' : 'triangle-alert'}
                size={20}
                color={score.points ? t.colors.successText : t.colors.amberDark}
              />
              <Txt size={15} weight="700" color={score.points ? t.colors.successText : t.colors.amberDark}>
                {score.title}
              </Txt>
              <Txt size={13} weight="700" color={t.colors.textSecondary} style={{ marginLeft: 'auto' }}>
                {score.points}/{HAZARD_MAX_POINTS}
              </Txt>
            </Row>

            <Txt size={12} color={t.colors.textSecondary}>
              {score.detail}
            </Txt>

            <View style={{ height: 8, borderRadius: 4, backgroundColor: t.colors.sage100, overflow: 'hidden' }}>
              <View
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: `${(score.points / HAZARD_MAX_POINTS) * 100}%`,
                  backgroundColor: score.points ? t.colors.success : t.colors.amber,
                }}
              />
            </View>
          </View>
        ) : null}
      </View>

      <View style={{ gap: 8, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20 }}>
        <Button label="Next Clip" onPress={goNext} />
        <Button label="Back to Practice" variant="ghost" onPress={backToPractice} />
      </View>
    </Screen>
  );
}

/* ---------------------------------------------------------- coming soon --- */

/**
 * ADR-006: the clip pack is licensed content we do not hold. The screen above is
 * complete and compiles, but the feature stays dark rather than shipping an
 * empty player.
 */
function ComingSoon({ onBack }: { onBack: () => void }) {
  const t = useTheme();

  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 }}>
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.colors.terracotta50,
          }}
        >
          <Icon name="video" size={44} color={t.colors.terracottaDark} />
        </View>

        <Txt size={20} weight="700" align="center">
          Hazard Perception is coming soon
        </Txt>
        <Txt size={14} color={t.colors.textSecondary} align="center" style={{ maxWidth: 300 }}>
          Video clips are still in production. Everything else in Practice works today, and
          this section will switch on as soon as the clips are ready.
        </Txt>

        <SoftButton label="Back to Practice" onPress={onBack} style={{ alignSelf: 'stretch' }} />
      </View>
    </Screen>
  );
}
