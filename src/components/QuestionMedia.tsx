import { useVideoPlayer, VideoView } from 'expo-video';
import { ActivityIndicator, Image, View } from 'react-native';

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

function QuestionVideo({ media }: { media: MediaAsset }) {
  const frame = useFrameStyle();
  const uri = useMediaUri(media);
  // Hazard clips are watched once and scored on when the learner taps, so
  // looping would make the exercise meaningless.
  // useVideoPlayer recreates the player when its source changes, so a null
  // source while the clip downloads and the local file afterwards is fine.
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  if (!uri) return <LoadingFrame media={media} />;

  return (
    <View style={frame}>
      <VideoView
        player={player}
        style={{ width: '100%', aspectRatio: aspectOf(media) }}
        contentFit="contain"
        nativeControls
        accessible
        accessibilityLabel="Question video clip"
      />
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
