import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/ui/Icon';
import { Txt } from '@/components/ui/primitives';
import { useMediaUri } from '@/features/media/useMediaPack';
import { useT } from '@/features/i18n/useT';
import { useTheme } from '@/theme/ThemeProvider';
import type { MediaAsset } from '@/types/content';

/**
 * Media attached to a question via the admin's media library
 * (mediaId -> DisplayQuestion.media, resolved in ContentProvider.decorate).
 *
 * Both branches render from useMediaUri, which prefers the downloaded copy and
 * falls back to streaming — so an illustrated question works offline once the
 * pack (or just that question) has been seen. See features/media/mediaCache.ts.
 */

function aspectOf(media: MediaAsset): number {
  return media.width && media.height ? media.width / media.height : 16 / 9;
}

function useFrameStyle() {
  const t = useTheme();
  return {
    borderRadius: t.radius.md,
    overflow: 'hidden',
    backgroundColor: t.colors.sage100,
  } as const;
}

/**
 * The frame at its final size while the file downloads, so the question text
 * below does not jump down when the picture arrives. A spinner rather than a
 * blank: on mobile data a clip takes a second or two, and a blank frame for
 * that long reads as broken.
 */
function LoadingFrame({ media }: { media: MediaAsset }) {
  const t = useTheme();
  const frame = useFrameStyle();
  return (
    <View
      accessible
      accessibilityLabel="Loading"
      style={[frame, { width: '100%', aspectRatio: aspectOf(media), alignItems: 'center', justifyContent: 'center' }]}
    >
      <ActivityIndicator color={t.colors.accent} />
    </View>
  );
}

function QuestionImage({ media }: { media: MediaAsset }) {
  const frame = useFrameStyle();
  const uri = useMediaUri(media);
  if (!uri) return <LoadingFrame media={media} />;

  return (
    <View style={frame}>
      <Image
        source={{ uri }}
        style={{ width: '100%', aspectRatio: aspectOf(media) }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessible
        accessibilityLabel="Question illustration"
      />
    </View>
  );
}

/** How often the clip reports its position, in seconds. */
const TICK = 0.25;

function clipLength(durationMs?: number | null): string | null {
  if (!durationMs) return null;
  const total = Math.round(durationMs / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function QuestionVideo({ media }: { media: MediaAsset }) {
  const t = useTheme();
  const tr = useT();
  const frame = useFrameStyle();
  const uri = useMediaUri(media);
  // Hazard clips are watched once and scored on when the learner taps, so
  // looping would make the exercise meaningless.
  // useVideoPlayer recreates the player when its source changes, so a null
  // source while the clip downloads and the local file afterwards is fine.
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    // Off by default, and the progress line has nothing to move on without it.
    p.timeUpdateEventInterval = TICK;
    // Every clip in the ministry's archive is silent, and muted playback is
    // also the only kind iOS and the browsers will start on their own.
    p.muted = true;
    // At WORD the clip runs by itself while the candidate reads. A frozen
    // first frame here is usually a street with nothing in it yet — which is
    // exactly what makes an illustrated question look like the wrong picture.
    p.play();
  });

  // Where the line under the clip has got to, 0..1. A shared value rather
  // than state: the position arrives four times a second and this way it
  // never costs a React render.
  const progress = useSharedValue(0);
  const seconds = (media.durationMs ?? 0) / 1000;

  useEventListener(player, 'timeUpdate', ({ currentTime }) => {
    const next = seconds > 0 ? Math.min(1, currentTime / seconds) : 0;
    // Forwards it eases across the gap between ticks, so the line moves
    // evenly instead of stepping; a replay jumps back at once, because
    // watching the line crawl backwards reads as a bug.
    progress.value =
      next < progress.value
        ? next
        : withTiming(next, { duration: TICK * 1000, easing: Easing.linear });
  });

  const progressStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  // The play() above covers iOS and Android, where the player owns the
  // playback itself. On the web it cannot: expo-video's web player forwards
  // play() to the <video> elements currently mounted, and at setup time there
  // are none — VideoView registers itself in its own effect, which runs before
  // this one.
  React.useEffect(() => {
    if (uri) player.play();
  }, [uri, player]);

  if (!uri) return <LoadingFrame media={media} />;

  const length = clipLength(media.durationMs);

  return (
    <View style={frame}>
      <VideoView
        player={player}
        style={{ width: '100%', aspectRatio: aspectOf(media) }}
        contentFit="contain"
        // Own controls rather than the native ones: those hide themselves
        // after a second, leaving a clip indistinguishable from a photo, and
        // there is nothing to scrub through in ten seconds anyway.
        nativeControls={false}
        accessibilityLabel={tr('media.clip')}
      />

      {/* The whole frame replays — the one thing anyone wants from a clip
          they have just watched, and a bigger target than any button. */}
      <Pressable
        onPress={() => player.replay()}
        accessibilityRole="button"
        accessibilityLabel={tr('media.replay')}
        style={StyleSheet.absoluteFill}
      />

      {/* The line the clip is running along. Bottom edge of the frame, full
          width, so "it is playing" is legible without looking for a badge. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          backgroundColor: '#FFFFFF33',
        }}
      >
        <Animated.View
          style={[{ height: 3, backgroundColor: t.colors.accent }, progressStyle]}
        />
      </View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 8,
          bottom: 11,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 12,
          // Literal, not a token: it sits on the video, which is dark in both
          // themes — same reason t.colors.onBlue exists.
          backgroundColor: '#000000A6',
        }}
      >
        <Icon name="rotate-ccw" size={12} color={t.colors.onBlue} />
        <Txt size={11} weight="600" color={t.colors.onBlue} numeric>
          {length ?? tr('media.replay')}
        </Txt>
      </View>
    </View>
  );
}

/**
 * Stand-in for a picture or clip the catalogue attaches to the question but
 * the app does not have yet. 85% of the official questions come with one
 * ("Czy w tej sytuacji…"), and until the ministry's archive is imported the
 * question makes no sense without saying so — a blank would look like a
 * question with no picture, which reads as a bug rather than as pending.
 */
function PendingMedia({ video }: { video: boolean }) {
  const t = useTheme();
  const tr = useT();
  return (
    <View
      accessible
      accessibilityLabel={tr('media.pending')}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 14,
        borderRadius: t.radius.md,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: t.colors.border,
        backgroundColor: t.colors.sage50,
      }}
    >
      <Icon name={video ? 'video' : 'image'} size={20} color={t.colors.textMuted} />
      <Txt size={12} color={t.colors.textSecondary} style={{ flex: 1 }} lineHeight={17}>
        {tr('media.pending')}
      </Txt>
    </View>
  );
}

export function QuestionMedia({ media, sourceMedia }: { media: MediaAsset | null; sourceMedia?: string | null }) {
  if (!media) {
    return sourceMedia ? <PendingMedia video={/\.(wmv|mp4|mov|avi)$/i.test(sourceMedia)} /> : null;
  }
  // Not gated on HAZARD_ENABLED: that flag keeps hazard *questions*
  // unreachable, and a video attached to an ordinary question should still
  // play rather than silently disappear.
  return media.type === 'video' ? <QuestionVideo media={media} /> : <QuestionImage media={media} />;
}
