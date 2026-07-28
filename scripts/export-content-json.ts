// Dumps DEMO_BUNDLE (plus the country/locale catalogues) to content.json for
// uploading to Firebase Storage. Re-run this and re-upload whenever the demo
// bundle changes, until the real admin panel + Cloud Function pipeline
// (docs/02-architecture.md, docs/03-content-pipeline.md) exists to do this
// automatically.
//
// Usage: npx tsx scripts/export-content-json.ts
import { writeFileSync } from 'node:fs';
import { DEMO_BUNDLE, COUNTRIES, LOCALES } from '../src/data/demo-bundle';

const out = {
  ...DEMO_BUNDLE,
  countries: COUNTRIES,
  locales: LOCALES,
};

writeFileSync('content.json', JSON.stringify(out, null, 2));
console.log(`Wrote content.json — ${DEMO_BUNDLE.questions.length} questions, ${DEMO_BUNDLE.topics.length} topics`);
