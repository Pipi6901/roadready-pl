/**
 * Amplitude project credentials.
 *
 * This is the client-side API key: it identifies the project events are written
 * to, it cannot read anything back, and — like the RevenueCat and Adapty keys in
 * this folder — it is meant to ship inside the app. The Secret Key (which CAN
 * read and delete data) must never appear in this repository.
 */
export const AMPLITUDE_API_KEY = 'f6b4b0fda9c5757740d530d4ab31b2dd';

/**
 * EU residency would be `api.eu.amplitude.com`. Keep this in sync with the
 * project's region in the Amplitude dashboard — sending EU-project events to
 * the US endpoint silently drops them.
 */
export const AMPLITUDE_ENDPOINT = 'https://api2.amplitude.com/2/httpapi';

/** Analytics is off by default in development so local runs don't pollute the funnel. */
export const ANALYTICS_ENABLED = !__DEV__;
