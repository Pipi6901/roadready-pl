/**
 * Published legal documents.
 *
 * App Review requires a subscription app to link a reachable privacy policy
 * and terms from inside the app, not only from the store listing — the
 * Settings rows under "About" and the footnote on the purchase screens are
 * those links.
 *
 * Both pages are the Polish app's own documents (bilingual PL/EN, the page
 * picks by browser language; `?lang=pl` / `?lang=en` forces one). The UK
 * document must not be reused: it names a different app and a different
 * provider. Sources live in docs/legal/ and are uploaded to pmoffice.space
 * by hand — keep the file names, App Review opens these exact URLs.
 */
export const PRIVACY_POLICY_URL = 'https://pmoffice.space/roadready-pl-privacy.html';
export const TERMS_OF_USE_URL = 'https://pmoffice.space/roadready-pl-terms.html';
