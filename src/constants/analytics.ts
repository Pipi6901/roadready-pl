/**
 * Amplitude project credentials.
 *
 * This is the client-side API key: it identifies the project events are written
 * to, it cannot read anything back, and — like the RevenueCat and Adapty keys in
 * this folder — it is meant to ship inside the app. The Secret Key (which CAN
 * read and delete data) must never appear in this repository.
 */
export const AMPLITUDE_API_KEY = 'REPLACE_WITH_AMPLITUDE_PL_API_KEY';

/**
 * EU residency would be `api.eu.amplitude.com`. Keep this in sync with the
 * project's region in the Amplitude dashboard — sending EU-project events to
 * the US endpoint silently drops them.
 */
export const AMPLITUDE_ENDPOINT = 'https://api2.amplitude.com/2/httpapi';

/**
 * Whether a real Amplitude project exists yet. Without this a release build
 * posts every event under the placeholder key above: Amplitude answers 400,
 * the batch is dropped as unretryable, and the only result is a request per
 * session that was never going to land anywhere.
 */
export const ANALYTICS_CONFIGURED = !AMPLITUDE_API_KEY.startsWith('REPLACE_WITH_');

/** Off in development too, so local runs don't pollute the funnel. */
export const ANALYTICS_ENABLED = ANALYTICS_CONFIGURED && !__DEV__;
