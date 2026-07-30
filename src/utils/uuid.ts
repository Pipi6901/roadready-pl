/**
 * Not cryptographically secure — this only needs to be a locally-unique,
 * stable app_user_id for RevenueCat (ADR-002: no accounts, no server ties it
 * to a real identity). Avoids pulling in expo-crypto for one call.
 */
export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
