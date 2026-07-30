/**
 * `global` exists at runtime in Hermes/React Native (same object as
 * `globalThis`) but isn't declared by @types/react-native or @types/react —
 * only by @types/node, which this project doesn't install. Some dependencies
 * (react-native-iap's debug logger) reference it directly, and Expo's bundler
 * module resolution ("react-native" export condition) points tsc at their raw
 * .ts source rather than pre-built .d.ts, so it needs to type-check too.
 */
declare const global: typeof globalThis;
