/**
 * Hazard Perception clip catalogue and scoring.
 *
 * The clip pack is licensed content we do not hold yet (ADR-006), so the
 * catalogue ships empty and `HAZARD_ENABLED` keeps the screen behind a
 * "coming soon" state. The types and the scoring maths live here already so the
 * screen has something real to compile against — when the pack arrives this
 * array is filled from the content bundle and nothing else changes.
 */

export interface HazardClip {
  id: string;
  title: string;
  /** Handed straight to expo-video as a `VideoSource`. */
  uri: string;
  durationSeconds: number;
  /**
   * The hazard develops across this span. A tap before `start` is a guess, a tap
   * after `end` is too late to have avoided it.
   */
  window: { start: number; end: number };
}

export const HAZARD_CLIPS: HazardClip[] = [];

export function getHazardClip(clipId: string): HazardClip | undefined {
  return HAZARD_CLIPS.find((clip) => clip.id === clipId);
}

export function nextHazardClipId(clipId: string): string | null {
  const index = HAZARD_CLIPS.findIndex((clip) => clip.id === clipId);
  if (index < 0 || index + 1 >= HAZARD_CLIPS.length) return null;
  return HAZARD_CLIPS[index + 1].id;
}

export type HazardBand = 'early' | 'good' | 'late' | 'missed';

export interface HazardScore {
  /** 0..5 — the earlier inside the window, the higher. */
  points: number;
  band: HazardBand;
  title: string;
  detail: string;
}

const MAX_POINTS = 5;

/**
 * Scores a tap against the clip's developing-hazard window.
 *
 * Points decay linearly across the window: spotting it as it starts to develop
 * is worth full marks, reacting just before it becomes unavoidable is worth one.
 */
export function scoreHazardTap(clip: HazardClip, tapSeconds: number): HazardScore {
  const { start, end } = clip.window;

  if (tapSeconds < start) {
    return {
      points: 0,
      band: 'early',
      title: 'Too early',
      detail: 'You reacted before the hazard began to develop',
    };
  }

  if (tapSeconds > end) {
    return {
      points: 0,
      band: tapSeconds > end + 1 ? 'missed' : 'late',
      title: tapSeconds > end + 1 ? 'Hazard missed' : 'Too late',
      detail: 'The hazard had already developed by the time you reacted',
    };
  }

  const span = Math.max(0.001, end - start);
  const points = Math.max(1, Math.round(MAX_POINTS * (1 - (tapSeconds - start) / span)));

  return {
    points,
    band: 'good',
    title: points >= 4 ? 'Excellent spot!' : 'Good reaction!',
    detail:
      points >= 4
        ? 'You spotted the hazard as soon as it started developing'
        : 'You spotted the hazard, but a little earlier would score higher',
  };
}

export const HAZARD_MAX_POINTS = MAX_POINTS;
