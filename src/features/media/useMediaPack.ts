import React from 'react';

import { remoteContentStore } from '@/data/remoteContent';
import type { MediaAsset } from '@/types/content';
import {
  cachedUri,
  deleteMediaPack,
  downloadMediaPack,
  ensureAsset,
  mediaPackStore,
  refreshMediaStatus,
  type MediaPackStatus,
} from './mediaCache';

/** React bindings for the offline media pack. Screens never call mediaCache directly. */

export interface MediaPack {
  status: MediaPackStatus;
  download: () => void;
  remove: () => void;
}

export function useMediaPack(): MediaPack {
  const status = React.useSyncExternalStore(mediaPackStore.subscribe, mediaPackStore.getSnapshot);

  // New content changes which assets the pack is supposed to hold, so the
  // counts have to be recomputed when content lands — not only on mount, or
  // Settings would keep showing "12 of 12" after a publish added a 13th.
  const contentVersion = React.useSyncExternalStore(
    remoteContentStore.subscribe,
    remoteContentStore.getVersion,
  );

  React.useEffect(() => {
    refreshMediaStatus();
  }, [contentVersion]);

  return React.useMemo(
    () => ({
      status,
      download: () => void downloadMediaPack(),
      remove: deleteMediaPack,
    }),
    [status],
  );
}

/**
 * The URI to render an asset from: the local copy when it exists, the remote
 * URL otherwise — plus a background fetch so the next viewing is local.
 *
 * Resolved once per asset on purpose. Swapping the URI the moment a background
 * download finished would remount the <Image>/<VideoView> and flash the
 * illustration away mid-question, which is worse than one more streamed view.
 */
export function useMediaUri(asset: MediaAsset | null): string | null {
  const resolved = React.useMemo(() => (asset ? (cachedUri(asset) ?? asset.url) : null), [asset]);

  React.useEffect(() => {
    if (!asset || cachedUri(asset)) return;
    void ensureAsset(asset);
  }, [asset]);

  return resolved;
}
