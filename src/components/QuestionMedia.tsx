import { useVideoPlayer, VideoView } from 'expo-video';
import { Image, View } from 'react-native';

import { useMediaUri } from '@/features/media/useMediaPack';
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

function QuestionImage({ media }: { media: MediaAsset }) {
  const frame = useFrameStyle();
  const uri = useMediaUri(media);
  if (!uri) return null;

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
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  if (!uri) return null;

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

export function QuestionMedia({ media }: { media: MediaAsset | null }) {
  if (!media) return null;
  // Not gated on HAZARD_ENABLED: that flag keeps hazard *questions*
  // unreachable, and a video attached to an ordinary question should still
  // play rather than silently disappear.
  return media.type === 'video' ? <QuestionVideo media={media} /> : <QuestionImage media={media} />;
}
