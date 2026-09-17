import React from 'react';
import { Platform } from 'react-native';

import { remoteContentStore } from '@/data/remoteContent';
import { useSettings } from '@/store/SettingsProvider';
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
  const { licenceCategory } = useSettings();

  // New content changes which assets the pack is supposed to hold, so the
  // counts have to be recomputed when content lands — not only on mount, or
  // Settings would keep showing "12 of 12" after a publish added a 13th.
  const contentVersion = React.useSyncExternalStore(
    remoteContentStore.subscribe,
    remoteContentStore.getVersion,
  );

  React.useEffect(() => {
    refreshMediaStatus(licenceCategory);
  }, [contentVersion, licenceCategory]);

  return React.useMemo(
    () => ({
      status,
      download: () => void downloadMediaPack(licenceCategory),
      remove: deleteMediaPack,
    }),
    [status, licenceCategory],
  );
}

/**
 * The URI to render an asset from.
 *
 * Local copy when there is one; otherwise null while the file downloads, then
 * the local copy — or the remote URL if the download failed, so a bad
 * connection degrades to streaming rather than to a blank. Download-then-show
 * transfers each file once; streaming it while also caching it (the previous
 * behaviour) moved every byte twice over the same mobile link.
 *
 * The URI is settled once per asset: null → final. It never flips from a
 * remote URL to a local one mid-question, which would remount the
 * <Image>/<VideoView> and flash the illustration away.
 */
export function useMediaUri(asset: MediaAsset | null): string | null {
  const [downloaded, setDownloaded] = React.useState<Record<string, string>>({});
  // Sync existence check — a native call, but cheap, and it is what lets a
  // cached picture appear on the very first frame with no loading state.
  const local = asset && Platform.OS !== 'web' ? cachedUri(asset) : null;

  React.useEffect(() => {
    if (!asset || Platform.OS === 'web' || cachedUri(asset)) return;
    let cancelled = false;
    void ensureAsset(asset).then((uri) => {
      if (cancelled) return;
      setDownloaded((prev) => (prev[asset.id] ? prev : { ...prev, [asset.id]: uri ?? asset.url }));
    });
    return () => {
      cancelled = true;
    };
  }, [asset]);

  if (!asset) return null;
  // The web build has no file system: stream, as before.
  if (Platform.OS === 'web') return asset.url;
  return local ?? downloaded[asset.id] ?? null;
}
