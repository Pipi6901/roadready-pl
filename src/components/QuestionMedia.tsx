import { Image, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import type { MediaAsset } from '@/types/content';

/**
 * Illustration attached to a question via the admin's media library
 * (mediaId -> DisplayQuestion.media, resolved in ContentProvider.decorate).
 * Video (hazard clips) isn't rendered here yet — HAZARD_ENABLED keeps those
 * questions unreachable until the licensed clip pack exists (ADR-006).
 */
export function QuestionMedia({ media }: { media: MediaAsset | null }) {
  const t = useTheme();
  if (!media || media.type !== 'image') return null;

  const aspectRatio = media.width && media.height ? media.width / media.height : 16 / 9;

  return (
    <View
      style={{
        borderRadius: t.radius.md,
        overflow: 'hidden',
        backgroundColor: t.colors.sage100,
      }}
    >
      <Image
        source={{ uri: media.url }}
        style={{ width: '100%', aspectRatio }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessible
        accessibilityLabel="Question illustration"
      />
    </View>
  );
}
