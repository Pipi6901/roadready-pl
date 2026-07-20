/**
 * DEMO CONTENT BUNDLE — placeholder question bank.
 *
 * Every question here was written from scratch by the RoadReady team using the
 * publicly published Highway Code as the underlying rule source. Nothing in this
 * file is copied from, derived from, or represents the question bank of any
 * driving test authority. Each item carries a `sourceRef` pointing at the
 * Highway Code rule the answer rests on, so the wording can be re-checked
 * whenever the Code is updated.
 *
 * This bundle exists so the app can be built, demoed and QA'd before content is
 * available. It is swapped wholesale for the DVSA content pack once the content
 * agreement is signed — the pipeline and the swap procedure are described in
 * docs/03-content-pipeline.md. Because the bundle is plain data matching
 * `ContentBundle`, no application code changes when the swap happens.
 */

import type {
  ContentBundle,
  Country,
  Locale,
  Question,
  QuestionTranslation,
  Topic,
} from '@/types/content';

/* -------------------------------------------------------------------------- */
/* Countries                                                                   */
/* -------------------------------------------------------------------------- */

const UNITED_KINGDOM: Country = {
  code: 'GB',
  name: 'United Kingdom',
  flagEmoji: '🇬🇧',
  authority: 'DVSA',
  legalNotice:
    'Highway Code material is Crown Copyright and is used under the Open Government Licence v3.0. Practice questions in this app are written independently by RoadReady from published road rules and are not examination items from any driving test authority.',
  status: 'active',
  questionCount: 800,
  mockTest: {
    questionCount: 50,
    timeLimitMinutes: 57,
    passMark: 43,
  },
  currency: 'GBP',
};

export const COUNTRIES: Country[] = [
  UNITED_KINGDOM,
  {
    code: 'US',
    name: 'United States',
    flagEmoji: '🇺🇸',
    authority: 'State DMV',
    legalNotice:
      'Content pack in preparation. Questions will be written by RoadReady from published state driver handbooks.',
    status: 'coming_soon',
    questionCount: 0,
    mockTest: {
      questionCount: 40,
      timeLimitMinutes: 60,
      passMark: 32,
    },
    currency: 'USD',
  },
  {
    code: 'CA',
    name: 'Canada',
    flagEmoji: '🇨🇦',
    authority: 'Provincial licensing authority',
    legalNotice:
      'Content pack in preparation. Questions will be written by RoadReady from published provincial driver handbooks.',
    status: 'coming_soon',
    questionCount: 0,
    mockTest: {
      questionCount: 40,
      timeLimitMinutes: 60,
      passMark: 32,
    },
    currency: 'CAD',
  },
  {
    code: 'AU',
    name: 'Australia',
    flagEmoji: '🇦🇺',
    authority: 'State transport authority',
    legalNotice:
      'Content pack in preparation. Questions will be written by RoadReady from published state road rule handbooks.',
    status: 'coming_soon',
    questionCount: 0,
    mockTest: {
      questionCount: 45,
      timeLimitMinutes: 60,
      passMark: 39,
    },
    currency: 'AUD',
  },
  {
    code: 'IE',
    name: 'Ireland',
    flagEmoji: '🇮🇪',
    authority: 'Road Safety Authority',
    legalNotice:
      'Content pack in preparation. Questions will be written by RoadReady from the published Rules of the Road.',
    status: 'coming_soon',
    questionCount: 0,
    mockTest: {
      questionCount: 40,
      timeLimitMinutes: 45,
      passMark: 35,
    },
    currency: 'EUR',
  },
  {
    code: 'DE',
    name: 'Germany',
    flagEmoji: '🇩🇪',
    authority: 'Fahrerlaubnisbehörde',
    legalNotice:
      'Content pack in preparation. Questions will be written by RoadReady from the published Straßenverkehrs-Ordnung.',
    status: 'coming_soon',
    questionCount: 0,
    mockTest: {
      questionCount: 30,
      timeLimitMinutes: 30,
      passMark: 25,
    },
    currency: 'EUR',
  },
];

/* -------------------------------------------------------------------------- */
/* Locales                                                                     */
/* -------------------------------------------------------------------------- */

export const LOCALES: Locale[] = [
  {
    code: 'pl',
    nameNative: 'Polski',
    nameEnglish: 'Polish',
    direction: 'ltr',
    flagEmoji: '🇵🇱',
  },
  {
    code: 'ur',
    nameNative: 'اردو',
    nameEnglish: 'Urdu',
    direction: 'rtl',
    flagEmoji: '🇵🇰',
  },
  {
    code: 'pa',
    nameNative: 'ਪੰਜਾਬੀ',
    nameEnglish: 'Punjabi',
    direction: 'ltr',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'hi',
    nameNative: 'हिन्दी',
    nameEnglish: 'Hindi',
    direction: 'ltr',
    flagEmoji: '🇮🇳',
  },
  {
    code: 'es',
    nameNative: 'Español',
    nameEnglish: 'Spanish',
    direction: 'ltr',
    flagEmoji: '🇪🇸',
  },
  {
    code: 'es-419',
    nameNative: 'Español (LatAm)',
    nameEnglish: 'Spanish (Latin America)',
    direction: 'ltr',
    flagEmoji: '🇲🇽',
  },
  {
    code: 'pt',
    nameNative: 'Português',
    nameEnglish: 'Portuguese',
    direction: 'ltr',
    flagEmoji: '🇵🇹',
  },
  {
    code: 'pt-BR',
    nameNative: 'Português (BR)',
    nameEnglish: 'Portuguese (Brazil)',
    direction: 'ltr',
    flagEmoji: '🇧🇷',
  },
  {
    code: 'ar',
    nameNative: 'العربية',
    nameEnglish: 'Arabic',
    direction: 'rtl',
    flagEmoji: '🇸🇦',
  },
];

/* -------------------------------------------------------------------------- */
/* Topics                                                                      */
/* -------------------------------------------------------------------------- */

const TOPICS: Topic[] = [
  {
    id: 'road-signs',
    name: 'Road Signs',
    slug: 'road-signs',
    icon: 'signpost',
    sortOrder: 1,
    questionCount: 5,
  },
  {
    id: 'junctions',
    name: 'Junctions',
    slug: 'junctions',
    icon: 'git-fork',
    sortOrder: 2,
    questionCount: 5,
  },
  {
    id: 'motorways',
    name: 'Motorways',
    slug: 'motorways',
    icon: 'route',
    sortOrder: 3,
    questionCount: 5,
  },
  {
    id: 'hazard-awareness',
    name: 'Hazard Awareness',
    slug: 'hazard-awareness',
    icon: 'triangle-alert',
    sortOrder: 4,
    questionCount: 3,
  },
  {
    id: 'vehicle-safety',
    name: 'Vehicle Safety',
    slug: 'vehicle-safety',
    icon: 'shield-check',
    sortOrder: 5,
    questionCount: 3,
  },
  {
    id: 'rules-of-the-road',
    name: 'Rules of the Road',
    slug: 'rules-of-the-road',
    icon: 'book-open',
    sortOrder: 6,
    questionCount: 3,
  },
  {
    id: 'vulnerable-road-users',
    name: 'Vulnerable Road Users',
    slug: 'vulnerable-road-users',
    icon: 'users',
    sortOrder: 7,
    questionCount: 3,
  },
  {
    id: 'vehicle-handling',
    name: 'Vehicle Handling',
    slug: 'vehicle-handling',
    icon: 'gauge',
    sortOrder: 8,
    questionCount: 3,
  },
  {
    id: 'documents',
    name: 'Documents',
    slug: 'documents',
    icon: 'file-text',
    sortOrder: 9,
    questionCount: 3,
  },
  {
    id: 'incidents',
    name: 'Incidents',
    slug: 'incidents',
    icon: 'siren',
    sortOrder: 10,
    questionCount: 3,
  },
  {
    id: 'vehicle-loading',
    name: 'Vehicle Loading',
    slug: 'vehicle-loading',
    icon: 'package',
    sortOrder: 11,
    questionCount: 3,
  },
  {
    id: 'road-conditions',
    name: 'Road Conditions',
    slug: 'road-conditions',
    icon: 'cloud-rain',
    sortOrder: 12,
    questionCount: 3,
  },
  {
    id: 'signals-and-controls',
    name: 'Signals and Controls',
    slug: 'signals-and-controls',
    icon: 'traffic-cone',
    sortOrder: 13,
    questionCount: 3,
  },
  {
    id: 'other-road-users',
    name: 'Other Road Users',
    slug: 'other-road-users',
    icon: 'bike',
    sortOrder: 14,
    questionCount: 3,
  },
];

/* -------------------------------------------------------------------------- */
/* Questions                                                                   */
/* -------------------------------------------------------------------------- */

const QUESTIONS: Question[] = [
  /* --- Road Signs ------------------------------------------------------- */
  {
    id: 'q-road-signs-01',
    topicId: 'road-signs',
    type: 'single_choice',
    text: 'A road sign is triangular with a red border. What is it telling you?',
    options: [
      { id: 'A', text: 'You must stop at the sign' },
      { id: 'B', text: 'You must not go beyond the sign' },
      { id: 'C', text: 'There is a hazard ahead that you should prepare for' },
      { id: 'D', text: 'The road ahead is one-way only' },
    ],
    correctOptionId: 'C',
    explanation:
      'The triangle is reserved for warnings, so the shape alone tells you to expect something ahead before you are close enough to read the symbol. Orders and prohibitions use circles instead.',
    mediaId: null,
    subtopic: 'Warning signs',
    sourceRef: 'Highway Code, traffic signs: warning signs',
  },
  {
    id: 'q-road-signs-02',
    topicId: 'road-signs',
    type: 'single_choice',
    text: 'You come to a sign that is eight-sided with a red background. What must you do?',
    options: [
      { id: 'A', text: 'Stop completely at the line, even if the road looks clear' },
      { id: 'B', text: 'Slow down and continue if nothing is coming' },
      { id: 'C', text: 'Give way only to traffic coming from the right' },
      { id: 'D', text: 'Sound your horn before moving off' },
    ],
    correctOptionId: 'A',
    explanation:
      'The octagon is the only sign of that shape, so it stays recognisable when snow or dirt hides the wording. Its instruction is absolute, and a rolling approach does not satisfy it.',
    mediaId: null,
    subtopic: 'Signs giving orders',
    sourceRef: 'Highway Code rule 171',
  },
  {
    id: 'q-road-signs-03',
    topicId: 'road-signs',
    type: 'single_choice',
    text: 'Most circular signs with a red border are there to do what?',
    options: [
      { id: 'A', text: 'Warn you about the condition of the road surface' },
      { id: 'B', text: 'Tell you what you must not do' },
      { id: 'C', text: 'Give directions to the town centre' },
      { id: 'D', text: 'Mark the end of a restriction' },
    ],
    correctOptionId: 'B',
    explanation:
      'A red ring is the standard way of showing a prohibition, so the symbol inside is something being taken away from you rather than offered to you.',
    mediaId: null,
    subtopic: 'Signs giving orders',
    sourceRef: 'Highway Code, traffic signs: signs giving orders',
  },
  {
    id: 'q-road-signs-04',
    topicId: 'road-signs',
    type: 'single_choice',
    text: 'What does a blue circular sign usually mean?',
    options: [
      { id: 'A', text: 'The road ahead is closed to all traffic' },
      { id: 'B', text: 'You are leaving a restricted zone' },
      { id: 'C', text: 'Parking is available nearby' },
      {
        id: 'D',
        text: 'There is something you must do, such as turn left or use a particular lane',
      },
    ],
    correctOptionId: 'D',
    explanation:
      'Blue circles carry positive instructions, unlike red-ringed circles which forbid. Blue rectangles are different again and only ever give information.',
    mediaId: null,
    subtopic: 'Signs giving orders',
    sourceRef: 'Highway Code, traffic signs: signs giving orders',
  },
  {
    id: 'q-road-signs-05',
    topicId: 'road-signs',
    type: 'single_choice',
    text: 'A white circular sign with a single black diagonal stripe appears at the side of the road. What does it mean?',
    options: [
      { id: 'A', text: 'The road ahead has no speed limit at all' },
      {
        id: 'B',
        text: 'The national speed limit applies for the type of road and vehicle you are driving',
      },
      { id: 'C', text: 'You may overtake anywhere beyond this point' },
      { id: 'D', text: 'Every restriction ends here, including parking rules' },
    ],
    correctOptionId: 'B',
    explanation:
      'No figure is shown because the limit depends on the road and the vehicle: 60 mph on a single carriageway and 70 mph on a dual carriageway for a car. It never means there is no limit.',
    mediaId: null,
    subtopic: 'Speed limit signs',
    sourceRef: 'Highway Code rule 124',
  },

  /* --- Junctions -------------------------------------------------------- */
  {
    id: 'q-junctions-01',
    topicId: 'junctions',
    type: 'single_choice',
    text: 'You are taking the first exit, to the left, at a roundabout. How should you approach it?',
    options: [
      { id: 'A', text: 'Signal left on approach and keep to the left-hand lane' },
      { id: 'B', text: 'Signal right on approach and move left at the last moment' },
      { id: 'C', text: 'Stay in the right-hand lane so you can see further round' },
      { id: 'D', text: 'Approach without signalling and decide at the give-way line' },
    ],
    correctOptionId: 'A',
    explanation:
      'Getting into the correct lane early lets drivers behind read your route before you reach the give-way line, which is exactly where late lane changes cause collisions.',
    mediaId: null,
    subtopic: 'Roundabouts',
    sourceRef: 'Highway Code rule 186',
  },
  {
    id: 'q-junctions-02',
    topicId: 'junctions',
    type: 'single_choice',
    text: 'You intend to take an exit past the twelve o’clock position at a roundabout. What is the normal procedure?',
    options: [
      { id: 'A', text: 'Signal left throughout and stay in the left-hand lane' },
      { id: 'B', text: 'Give no signal at all until you are on the roundabout' },
      {
        id: 'C',
        text: 'Signal right on approach, keep right, then signal left after passing the exit before the one you want',
      },
      { id: 'D', text: 'Signal right and hold that signal until you have left the roundabout' },
    ],
    correctOptionId: 'C',
    explanation:
      'Holding the right signal tells traffic waiting to join that you are still travelling round, and the late left signal is what releases them to move.',
    mediaId: null,
    subtopic: 'Roundabouts',
    sourceRef: 'Highway Code rule 186',
  },
  {
    id: 'q-junctions-03',
    topicId: 'junctions',
    type: 'single_choice',
    text: 'What do broken white lines across the mouth of a side road mean?',
    options: [
      { id: 'A', text: 'You may drive straight out without slowing down' },
      { id: 'B', text: 'Traffic on the main road must give way to you' },
      { id: 'C', text: 'You must stop and apply the parking brake' },
      { id: 'D', text: 'You must give way to traffic on the major road before joining it' },
    ],
    correctOptionId: 'D',
    explanation:
      'Broken lines mean give way rather than stop, so you may keep moving if the road is genuinely clear. The duty to yield still rests entirely with you.',
    mediaId: null,
    subtopic: 'Give way lines',
    sourceRef: 'Highway Code rule 172',
  },
  {
    id: 'q-junctions-04',
    topicId: 'junctions',
    type: 'single_choice',
    text: 'You reach a junction with a solid white line across your lane and an eight-sided sign. What must you do?',
    options: [
      { id: 'A', text: 'Give way only if a vehicle is approaching' },
      { id: 'B', text: 'Stop behind the line every time, then move off when it is safe' },
      { id: 'C', text: 'Flash your headlights and continue' },
      { id: 'D', text: 'Sound the horn and edge out slowly' },
    ],
    correctOptionId: 'B',
    explanation:
      'That combination creates a legal obligation to halt, so it applies even when you can already see the road is empty. A give-way line would have been broken instead of solid.',
    mediaId: null,
    subtopic: 'Stop lines',
    sourceRef: 'Highway Code rule 171',
  },
  {
    id: 'q-junctions-05',
    topicId: 'junctions',
    type: 'single_choice',
    text: 'You are waiting at crossroads to turn right and an oncoming vehicle is also turning right. Which arrangement usually gives both drivers the better view?',
    options: [
      { id: 'A', text: 'Both drivers turn in front of each other, nearside to nearside' },
      { id: 'B', text: 'You always give way and let the other driver go first' },
      { id: 'C', text: 'You move into the middle of the junction and wait there' },
      {
        id: 'D',
        text: 'Turning behind each other, offside to offside, so neither car blocks the other’s view',
      },
    ],
    correctOptionId: 'D',
    explanation:
      'Passing behind one another keeps the road you are turning into visible to both drivers. Turning in front of each other hides oncoming traffic and pedestrians behind the other car.',
    mediaId: null,
    subtopic: 'Turning right',
    sourceRef: 'Highway Code rule 181',
  },

  /* --- Motorways -------------------------------------------------------- */
  {
    id: 'q-motorways-01',
    topicId: 'motorways',
    type: 'single_choice',
    text: 'What is the national speed limit for a car on a motorway?',
    options: [
      { id: 'A', text: '60 mph' },
      { id: 'B', text: '70 mph' },
      { id: 'C', text: '80 mph' },
      { id: 'D', text: 'There is no fixed limit' },
    ],
    correctOptionId: 'B',
    explanation:
      'That figure is the maximum for cars and applies only where no lower limit is signed. It is a ceiling, not a target, and conditions often make it unsafe.',
    mediaId: null,
    subtopic: 'Speed limits',
    sourceRef: 'Highway Code rule 124',
  },
  {
    id: 'q-motorways-02',
    topicId: 'motorways',
    type: 'single_choice',
    text: 'When may you drive on the hard shoulder of a motorway?',
    options: [
      { id: 'A', text: 'To overtake slow-moving traffic' },
      { id: 'B', text: 'To take a phone call or check your directions' },
      { id: 'C', text: 'To rest during a long journey' },
      {
        id: 'D',
        text: 'Only in an emergency, or when signs show it is open as a running lane',
      },
    ],
    correctOptionId: 'D',
    explanation:
      'The hard shoulder is a refuge for breakdowns and a route for emergency vehicles, so any other use blocks the people who genuinely have no alternative.',
    mediaId: null,
    subtopic: 'Hard shoulder',
    sourceRef: 'Highway Code rule 269',
  },
  {
    id: 'q-motorways-03',
    topicId: 'motorways',
    type: 'single_choice',
    text: 'Which of these is not allowed on a motorway?',
    options: [
      { id: 'A', text: 'Pedestrians and cyclists' },
      { id: 'B', text: 'Vehicles towing trailers' },
      { id: 'C', text: 'Large goods vehicles' },
      { id: 'D', text: 'Motorcycles over 50 cc' },
    ],
    correctOptionId: 'A',
    explanation:
      'Motorways exclude anything that cannot keep pace with the traffic or that has no protection around it, which is why people on foot and on bicycles are barred.',
    mediaId: null,
    subtopic: 'Motorway restrictions',
    sourceRef: 'Highway Code rule 253',
  },
  {
    id: 'q-motorways-04',
    topicId: 'motorways',
    type: 'single_choice',
    text: 'A red X is displayed on the overhead sign above your lane. What does it mean?',
    options: [
      { id: 'A', text: 'A speed camera is operating in that lane' },
      { id: 'B', text: 'The lane is reserved for buses and coaches' },
      { id: 'C', text: 'The lane is closed and you must move out of it' },
      { id: 'D', text: 'There has been an incident three miles ahead' },
    ],
    correctOptionId: 'C',
    explanation:
      'A lane is usually closed because people or a stopped vehicle are in it, so the sign is protecting somebody you cannot yet see. Driving past a red X is an offence detected by camera.',
    mediaId: null,
    subtopic: 'Smart motorways',
    sourceRef: 'Highway Code rule 258',
  },
  {
    id: 'q-motorways-05',
    topicId: 'motorways',
    type: 'single_choice',
    text: 'How large a gap should you normally leave from the vehicle in front on a dry motorway?',
    options: [
      { id: 'A', text: 'One car length for every 10 mph' },
      { id: 'B', text: 'Enough to read its number plate' },
      { id: 'C', text: 'Half a second' },
      {
        id: 'D',
        text: 'At least a two-second gap, timed against a fixed point at the roadside',
      },
    ],
    correctOptionId: 'D',
    explanation:
      'A time gap grows automatically with speed, whereas counting car lengths badly underestimates the distance needed at motorway speeds. Double it as soon as the road is wet.',
    mediaId: null,
    subtopic: 'Separation distance',
    sourceRef: 'Highway Code rule 126',
  },

  /* --- Hazard Awareness ------------------------------------------------- */
  {
    id: 'q-hazard-awareness-01',
    topicId: 'hazard-awareness',
    type: 'single_choice',
    text: 'Overall stopping distance is made up of which two parts?',
    options: [
      { id: 'A', text: 'Thinking distance and braking distance' },
      { id: 'B', text: 'Braking distance and the length of the vehicle' },
      { id: 'C', text: 'Reaction time and gear selection' },
      { id: 'D', text: 'Tyre grip and engine braking' },
    ],
    correctOptionId: 'A',
    explanation:
      'Ground is lost before the brakes are touched at all, which is why tiredness or a distraction lengthens the total even when the car, the road and the speed are unchanged.',
    mediaId: null,
    subtopic: 'Stopping distances',
    sourceRef: 'Highway Code rule 126',
  },
  {
    id: 'q-hazard-awareness-02',
    topicId: 'hazard-awareness',
    type: 'single_choice',
    text: 'In good dry conditions, what is the typical overall stopping distance for a car travelling at 70 mph?',
    options: [
      { id: 'A', text: '53 metres' },
      { id: 'B', text: '96 metres' },
      { id: 'C', text: '36 metres' },
      { id: 'D', text: '120 metres' },
    ],
    correctOptionId: 'B',
    explanation:
      'That is around 24 car lengths, and the figure climbs far faster than the speed does. About 21 metres of it disappears before you have even reacted.',
    mediaId: null,
    subtopic: 'Stopping distances',
    sourceRef: 'Highway Code rule 126',
  },
  {
    id: 'q-hazard-awareness-03',
    topicId: 'hazard-awareness',
    type: 'single_choice',
    text: 'You begin to feel drowsy on a long motorway drive. What should you do?',
    options: [
      { id: 'A', text: 'Open a window and turn the radio up' },
      { id: 'B', text: 'Press on to your destination as quickly as you can' },
      { id: 'C', text: 'Leave at the next services or exit and rest before continuing' },
      { id: 'D', text: 'Move into the left-hand lane and slow to 50 mph' },
    ],
    correctOptionId: 'C',
    explanation:
      'Fresh air and noise mask tiredness for a few minutes without restoring alertness, so stopping is the only real remedy. Motorways offer almost nothing to keep the brain busy.',
    mediaId: null,
    subtopic: 'Tiredness',
    sourceRef: 'Highway Code rule 91',
  },

  /* --- Vehicle Safety --------------------------------------------------- */
  {
    id: 'q-vehicle-safety-01',
    topicId: 'vehicle-safety',
    type: 'single_choice',
    text: 'What is the minimum legal tread depth for a car tyre across the central three-quarters of its width?',
    options: [
      { id: 'A', text: '1.0 mm' },
      { id: 'B', text: '2.0 mm' },
      { id: 'C', text: '1.6 mm' },
      { id: 'D', text: '3.0 mm' },
    ],
    correctOptionId: 'C',
    explanation:
      'Below that depth the grooves can no longer clear enough water from under the tyre, so wet grip collapses long before the tyre looks worn out.',
    mediaId: null,
    subtopic: 'Tyres',
    sourceRef: 'Highway Code annex 6: vehicle maintenance',
  },
  {
    id: 'q-vehicle-safety-02',
    topicId: 'vehicle-safety',
    type: 'single_choice',
    text: 'When does a car first need an MOT test?',
    options: [
      { id: 'A', text: 'On the third anniversary of its registration' },
      { id: 'B', text: 'After one year' },
      { id: 'C', text: 'After five years' },
      { id: 'D', text: 'Only when it is sold' },
    ],
    correctOptionId: 'A',
    explanation:
      'New cars are exempt at first because wear items are unlikely to have failed that early, and the test then becomes an annual requirement.',
    mediaId: null,
    subtopic: 'Roadworthiness',
    sourceRef: 'Highway Code annex 3: vehicle documents',
  },
  {
    id: 'q-vehicle-safety-03',
    topicId: 'vehicle-safety',
    type: 'single_choice',
    text: 'What is the legal alcohol limit for drivers in England and Wales when measured in breath?',
    options: [
      { id: 'A', text: '22 micrograms per 100 ml of breath' },
      { id: 'B', text: '50 micrograms per 100 ml of breath' },
      { id: 'C', text: '80 micrograms per 100 ml of breath' },
      { id: 'D', text: '35 micrograms per 100 ml of breath' },
    ],
    correctOptionId: 'D',
    explanation:
      'Scotland sets a lower figure, so the same drink can be lawful on one side of the border and not the other. Judgement is already impaired well below any limit.',
    mediaId: null,
    subtopic: 'Drink driving',
    sourceRef: 'Highway Code rule 95',
  },

  /* --- Rules of the Road ------------------------------------------------ */
  {
    id: 'q-rules-of-the-road-01',
    topicId: 'rules-of-the-road',
    type: 'single_choice',
    text: 'You are driving on a road with street lights but no speed limit signs. What limit applies?',
    options: [
      { id: 'A', text: '20 mph' },
      { id: 'B', text: '30 mph' },
      { id: 'C', text: '40 mph' },
      { id: 'D', text: '60 mph' },
    ],
    correctOptionId: 'B',
    explanation:
      'Regular street lighting is itself the signal of a built-up area, so nothing needs to be posted. Repeater signs appear only where a different limit is in force.',
    mediaId: null,
    subtopic: 'Speed limits',
    sourceRef: 'Highway Code rule 124',
  },
  {
    id: 'q-rules-of-the-road-02',
    topicId: 'rules-of-the-road',
    type: 'single_choice',
    text: 'What is the national speed limit for a car on a single carriageway road?',
    options: [
      { id: 'A', text: '60 mph' },
      { id: 'B', text: '50 mph' },
      { id: 'C', text: '70 mph' },
      { id: 'D', text: '40 mph' },
    ],
    correctOptionId: 'A',
    explanation:
      'A single carriageway carries oncoming traffic in the same strip of road, which is why the figure sits below the dual carriageway limit. Bends and junctions often make even that unsafe.',
    mediaId: null,
    subtopic: 'Speed limits',
    sourceRef: 'Highway Code rule 124',
  },
  {
    id: 'q-rules-of-the-road-03',
    topicId: 'rules-of-the-road',
    type: 'single_choice',
    text: 'What is the national speed limit for a car on a dual carriageway?',
    options: [
      { id: 'A', text: '50 mph' },
      { id: 'B', text: '60 mph' },
      { id: 'C', text: '70 mph' },
      { id: 'D', text: '80 mph' },
    ],
    correctOptionId: 'C',
    explanation:
      'A central reservation separates the opposing flows, so the limit matches the motorway figure. Cars towing a trailer are held to a lower one on the same road.',
    mediaId: null,
    subtopic: 'Speed limits',
    sourceRef: 'Highway Code rule 124',
  },

  /* --- Vulnerable Road Users -------------------------------------------- */
  {
    id: 'q-vulnerable-road-users-01',
    topicId: 'vulnerable-road-users',
    type: 'single_choice',
    text: 'You are about to overtake a cyclist at around 30 mph. How much room should you allow?',
    options: [
      { id: 'A', text: 'Enough to pass without touching them' },
      { id: 'B', text: 'About half a metre' },
      { id: 'C', text: 'The width of a bicycle' },
      { id: 'D', text: 'At least 1.5 metres, and more at higher speeds' },
    ],
    correctOptionId: 'D',
    explanation:
      'Cyclists have to swerve around drains and potholes with no warning, and the air disturbance from a close pass is enough on its own to unbalance them.',
    mediaId: null,
    subtopic: 'Cyclists',
    sourceRef: 'Highway Code rule 163',
  },
  {
    id: 'q-vulnerable-road-users-02',
    topicId: 'vulnerable-road-users',
    type: 'single_choice',
    text: 'You are following a horse and rider on a country lane. How should you pass?',
    options: [
      { id: 'A', text: 'Sound the horn first so the rider knows you are there' },
      { id: 'B', text: 'Slow to no more than 10 mph and pass wide and slowly' },
      { id: 'C', text: 'Accelerate past quickly to cut the time spent alongside' },
      { id: 'D', text: 'Stay close behind until the rider waves you through' },
    ],
    correctOptionId: 'B',
    explanation:
      'A horse reacts to engine noise and sudden movement rather than to reasoning, so speed and closeness are the two things most likely to make it shy into the road.',
    mediaId: null,
    subtopic: 'Horse riders',
    sourceRef: 'Highway Code rule 215',
  },
  {
    id: 'q-vulnerable-road-users-03',
    topicId: 'vulnerable-road-users',
    type: 'single_choice',
    text: 'An elderly pedestrian is crossing slowly in front of you at the junction you are turning into. What should you do?',
    options: [
      { id: 'A', text: 'Wait patiently and let them finish crossing' },
      { id: 'B', text: 'Edge forward to encourage them to hurry' },
      { id: 'C', text: 'Sound your horn to warn them' },
      { id: 'D', text: 'Drive round behind them' },
    ],
    correctOptionId: 'A',
    explanation:
      'Pedestrians who have started to cross have priority, and an older person may not judge your closing speed or hear the car at all. Pressure is what causes them to stumble.',
    mediaId: null,
    subtopic: 'Pedestrians',
    sourceRef: 'Highway Code rule 170',
  },

  /* --- Vehicle Handling ------------------------------------------------- */
  {
    id: 'q-vehicle-handling-01',
    topicId: 'vehicle-handling',
    type: 'single_choice',
    text: 'When may you use your rear fog lights?',
    options: [
      { id: 'A', text: 'Whenever it is raining heavily' },
      { id: 'B', text: 'At any time after dark' },
      { id: 'C', text: 'Only when visibility falls below about 100 metres' },
      { id: 'D', text: 'Never on a public road' },
    ],
    correctOptionId: 'C',
    explanation:
      'Rear fog lights are far brighter than ordinary tail lights, so in clearer air they dazzle the driver behind and swamp your brake lights. Switch them off as the fog lifts.',
    mediaId: null,
    subtopic: 'Fog',
    sourceRef: 'Highway Code rule 226',
  },
  {
    id: 'q-vehicle-handling-02',
    topicId: 'vehicle-handling',
    type: 'single_choice',
    text: 'How does a wet road affect your stopping distance?',
    options: [
      { id: 'A', text: 'It has no measurable effect on a modern car' },
      { id: 'B', text: 'It shortens it because the tyres run cooler' },
      { id: 'C', text: 'It increases it by about a quarter' },
      { id: 'D', text: 'It can at least double it' },
    ],
    correctOptionId: 'D',
    explanation:
      'Water keeps the tyre from touching the surface directly, so the same pedal pressure does far less work. On ice the distance can stretch to ten times the dry figure.',
    mediaId: null,
    subtopic: 'Wet roads',
    sourceRef: 'Highway Code rule 227',
  },
  {
    id: 'q-vehicle-handling-03',
    topicId: 'vehicle-handling',
    type: 'single_choice',
    text: 'Why is coasting downhill with the clutch held down a bad idea?',
    options: [
      { id: 'A', text: 'It removes engine braking and reduces your control of the car' },
      { id: 'B', text: 'It uses noticeably more fuel' },
      { id: 'C', text: 'It carries an automatic penalty of six points' },
      { id: 'D', text: 'It makes the brake lights stay on' },
    ],
    correctOptionId: 'A',
    explanation:
      'With the drive disconnected the engine can no longer help hold the car back, so the brakes carry the whole load and steering response drops at the worst moment.',
    mediaId: null,
    subtopic: 'Control',
    sourceRef: 'Highway Code rule 122',
  },

  /* --- Documents -------------------------------------------------------- */
  {
    id: 'q-documents-01',
    topicId: 'documents',
    type: 'single_choice',
    text: 'What is the minimum level of insurance you must have to drive on a public road?',
    options: [
      { id: 'A', text: 'Comprehensive' },
      { id: 'B', text: 'Third party' },
      { id: 'C', text: 'Third party, fire and theft' },
      { id: 'D', text: 'None, if the vehicle is less than three years old' },
    ],
    correctOptionId: 'B',
    explanation:
      'The legal requirement exists to protect other people from injury or damage you cause, not to protect your own car, which is why the minimum leaves your own repairs unpaid.',
    mediaId: null,
    subtopic: 'Insurance',
    sourceRef: 'Highway Code annex 3: vehicle documents',
  },
  {
    id: 'q-documents-02',
    topicId: 'documents',
    type: 'single_choice',
    text: 'How long is a photocard driving licence normally valid before it must be renewed?',
    options: [
      { id: 'A', text: '3 years' },
      { id: 'B', text: '5 years' },
      { id: 'C', text: '10 years' },
      { id: 'D', text: 'For life' },
    ],
    correctOptionId: 'C',
    explanation:
      'The renewal is there to keep the photograph current for identification, so the driving entitlement itself carries on while the card is being replaced.',
    mediaId: null,
    subtopic: 'Driving licence',
    sourceRef: 'Highway Code annex 3: vehicle documents',
  },
  {
    id: 'q-documents-03',
    topicId: 'documents',
    type: 'single_choice',
    text: 'Which of these must you tell the DVLA about?',
    options: [
      {
        id: 'A',
        text: 'A change of name or permanent address, and any medical condition that affects your driving',
      },
      { id: 'B', text: 'Every journey you make abroad' },
      { id: 'C', text: 'A change of car insurance company' },
      { id: 'D', text: 'Fitting new tyres to your car' },
    ],
    correctOptionId: 'A',
    explanation:
      'The licence record has to match reality so that correspondence and fitness-to-drive checks reach the right person. An out-of-date record can also invalidate your insurance.',
    mediaId: null,
    subtopic: 'Licence obligations',
    sourceRef: 'Highway Code annex 3: vehicle documents',
  },

  /* --- Incidents -------------------------------------------------------- */
  {
    id: 'q-incidents-01',
    topicId: 'incidents',
    type: 'single_choice',
    text: 'You arrive at the scene of a collision before the emergency services. What should you do first?',
    options: [
      { id: 'A', text: 'Move all the casualties onto the verge' },
      { id: 'B', text: 'Take photographs for the insurers' },
      { id: 'C', text: 'Give the injured people a hot drink' },
      { id: 'D', text: 'Warn other traffic, for example by switching on hazard warning lights' },
    ],
    correctOptionId: 'D',
    explanation:
      'A second collision running into the scene is the most likely thing to happen next, and it would injure the people who stopped to help as well as the original casualties.',
    mediaId: null,
    subtopic: 'At the scene',
    sourceRef: 'Highway Code rule 283',
  },
  {
    id: 'q-incidents-02',
    topicId: 'incidents',
    type: 'single_choice',
    text: 'An adult casualty is unconscious and not breathing. What should you do?',
    options: [
      { id: 'A', text: 'Give them water to drink' },
      {
        id: 'B',
        text: 'Open the airway by tilting the head back, then start chest compressions and call for help',
      },
      { id: 'C', text: 'Sit them upright against a wall' },
      { id: 'D', text: 'Wait for the ambulance without touching them' },
    ],
    correctOptionId: 'B',
    explanation:
      'The tongue commonly blocks the airway in an unconscious person, so clearing it may be all that is needed. Compressions keep blood reaching the brain until help arrives.',
    mediaId: null,
    subtopic: 'First aid',
    sourceRef: 'Highway Code annex 7: first aid on the road',
  },
  {
    id: 'q-incidents-03',
    topicId: 'incidents',
    type: 'single_choice',
    text: 'A motorcyclist has come off and is lying injured in the road. What should you do about the helmet?',
    options: [
      { id: 'A', text: 'Remove it straight away so they can breathe more easily' },
      { id: 'B', text: 'Remove it and use it to mark the scene' },
      {
        id: 'C',
        text: 'Leave it on unless removing it is essential, for example if they are not breathing',
      },
      { id: 'D', text: 'Remove it only once the ambulance has been called' },
    ],
    correctOptionId: 'C',
    explanation:
      'Taking a helmet off moves the head and neck, which can turn a spinal injury into a permanent one. That risk is only worth accepting when the airway itself is at stake.',
    mediaId: null,
    subtopic: 'First aid',
    sourceRef: 'Highway Code annex 7: first aid on the road',
  },

  /* --- Vehicle Loading -------------------------------------------------- */
  {
    id: 'q-vehicle-loading-01',
    topicId: 'vehicle-loading',
    type: 'single_choice',
    text: 'Who is responsible for making sure a vehicle is not overloaded and that the load is secure?',
    options: [
      { id: 'A', text: 'The driver' },
      { id: 'B', text: 'The person who sold you the vehicle' },
      { id: 'C', text: 'The insurance company' },
      { id: 'D', text: 'Whoever helped you load it' },
    ],
    correctOptionId: 'A',
    explanation:
      'The duty follows whoever is in charge of the vehicle on the road, so it cannot be passed to the person who packed the car or hitched the trailer for you.',
    mediaId: null,
    subtopic: 'Responsibility',
    sourceRef: 'Highway Code rule 98',
  },
  {
    id: 'q-vehicle-loading-02',
    topicId: 'vehicle-loading',
    type: 'single_choice',
    text: 'How does a heavy load change the way a car drives?',
    options: [
      { id: 'A', text: 'It improves grip, so you can brake later' },
      { id: 'B', text: 'It has no effect as long as the load is inside the boot' },
      { id: 'C', text: 'It only matters at motorway speeds' },
      { id: 'D', text: 'Handling and steering change and the stopping distance gets longer' },
    ],
    correctOptionId: 'D',
    explanation:
      'The extra mass has to be slowed by the same brakes and turned by the same tyres, and weight carried high or well back also makes the car less stable in a swerve.',
    mediaId: null,
    subtopic: 'Effect on handling',
    sourceRef: 'Highway Code rule 98',
  },
  {
    id: 'q-vehicle-loading-03',
    topicId: 'vehicle-loading',
    type: 'single_choice',
    text: 'You are towing a caravan and your normal mirrors do not show the road behind it. What should you do?',
    options: [
      { id: 'A', text: 'Rely on the nearside mirror alone' },
      { id: 'B', text: 'Fit suitable towing mirrors before you set off' },
      { id: 'C', text: 'Ask a passenger to watch behind for you' },
      { id: 'D', text: 'Drive closer to the centre line so you can see past it' },
    ],
    correctOptionId: 'B',
    explanation:
      'You need an adequate view of the road behind on both sides, and a caravan is usually wider than the car. Extended mirrors restore that view without changing your road position.',
    mediaId: null,
    subtopic: 'Towing',
    sourceRef: 'Highway Code rule 98',
  },

  /* --- Road Conditions -------------------------------------------------- */
  {
    id: 'q-road-conditions-01',
    topicId: 'road-conditions',
    type: 'single_choice',
    text: 'The steering suddenly feels very light on a cold day. What is this most likely to mean?',
    options: [
      { id: 'A', text: 'A tyre has deflated' },
      { id: 'B', text: 'The power steering has failed' },
      { id: 'C', text: 'There is ice on the road surface' },
      { id: 'D', text: 'The road surface is about to change' },
    ],
    correctOptionId: 'C',
    explanation:
      'Ice takes away the resistance you normally feel through the wheel because the tyres have almost stopped gripping. Ease off and make every input as gentle as possible.',
    mediaId: null,
    subtopic: 'Ice',
    sourceRef: 'Highway Code rule 230',
  },
  {
    id: 'q-road-conditions-02',
    topicId: 'road-conditions',
    type: 'single_choice',
    text: 'You have to drive through a stretch of standing flood water. How should you do it?',
    options: [
      {
        id: 'A',
        text: 'Drive slowly in a low gear, keeping the engine speed up, then test the brakes afterwards',
      },
      { id: 'B', text: 'Drive through as fast as you can to create a bow wave' },
      { id: 'C', text: 'Stop halfway across and check how deep it is' },
      { id: 'D', text: 'Coast through with the clutch held down' },
    ],
    correctOptionId: 'A',
    explanation:
      'A steady engine speed keeps water out of the exhaust, and brakes come out of water wet, so gentle pressure is needed to dry them before you have to rely on them.',
    mediaId: null,
    subtopic: 'Flooding',
    sourceRef: 'Highway Code rule 291',
  },
  {
    id: 'q-road-conditions-03',
    topicId: 'road-conditions',
    type: 'single_choice',
    text: 'You are crossing an exposed bridge in a strong side wind. What should you be ready for?',
    options: [
      { id: 'A', text: 'Your engine losing power in the gusts' },
      { id: 'B', text: 'Traffic behind you braking suddenly' },
      { id: 'C', text: 'The wind pushing you towards the verge only' },
      {
        id: 'D',
        text: 'Cyclists and high-sided vehicles being blown sideways into your path',
      },
    ],
    correctOptionId: 'D',
    explanation:
      'A gust moves light and tall vehicles far more than it moves a car, so the danger sits with what is around you rather than with your own steering. Leave extra room when passing them.',
    mediaId: null,
    subtopic: 'Wind',
    sourceRef: 'Highway Code rule 232',
  },

  /* --- Signals and Controls --------------------------------------------- */
  {
    id: 'q-signals-and-controls-01',
    topicId: 'signals-and-controls',
    type: 'single_choice',
    text: 'When should you signal?',
    options: [
      {
        id: 'A',
        text: 'In good time, whenever it would help other road users understand what you intend to do',
      },
      { id: 'B', text: 'Only when another vehicle is close behind you' },
      { id: 'C', text: 'Once you have already started the manoeuvre' },
      { id: 'D', text: 'At every junction, whether or not you are turning' },
    ],
    correctOptionId: 'A',
    explanation:
      'A signal is information for other people, not permission for you. Given too late, or when nobody is there to read it, it changes nothing about the safety of the manoeuvre.',
    mediaId: null,
    subtopic: 'Signalling',
    sourceRef: 'Highway Code rule 103',
  },
  {
    id: 'q-signals-and-controls-02',
    topicId: 'signals-and-controls',
    type: 'single_choice',
    text: 'A driver coming the other way flashes their headlights at you. What does this mean according to the Highway Code?',
    options: [
      { id: 'A', text: 'They are giving you priority to go ahead' },
      { id: 'B', text: 'They are thanking you' },
      { id: 'C', text: 'They are letting you know that they are there' },
      { id: 'D', text: 'There is a hazard on your side of the road' },
    ],
    correctOptionId: 'C',
    explanation:
      'Flashing headlights carry the same single meaning as the horn. Reading them as an invitation commits you to a junction on somebody else’s guess about what is coming.',
    mediaId: null,
    subtopic: 'Headlight signals',
    sourceRef: 'Highway Code rule 110',
  },
  {
    id: 'q-signals-and-controls-03',
    topicId: 'signals-and-controls',
    type: 'single_choice',
    text: 'You brake hard and feel the pedal pulsing under your foot as the anti-lock braking system works. What should you do?',
    options: [
      { id: 'A', text: 'Pump the pedal in time with the pulsing' },
      {
        id: 'B',
        text: 'Keep firm continuous pressure on the pedal until the car has slowed enough',
      },
      { id: 'C', text: 'Release the pedal and try again' },
      { id: 'D', text: 'Press the clutch and steer around the hazard' },
    ],
    correctOptionId: 'B',
    explanation:
      'The pulsing is the system releasing and reapplying the brakes far faster than any driver could. Easing off simply interrupts that cycle and lengthens the stop.',
    mediaId: null,
    subtopic: 'Braking systems',
    sourceRef: 'Highway Code rule 120',
  },

  /* --- Other Road Users -------------------------------------------------- */
  {
    id: 'q-other-road-users-01',
    topicId: 'other-road-users',
    type: 'single_choice',
    text: 'A bus at a bus stop ahead of you signals to pull out into the traffic. What should you do?',
    options: [
      { id: 'A', text: 'Accelerate to get past before it moves' },
      { id: 'B', text: 'Sound your horn to claim priority' },
      { id: 'C', text: 'Move right and pass close alongside it' },
      { id: 'D', text: 'Give way if you can do so safely' },
    ],
    correctOptionId: 'D',
    explanation:
      'Buses stop constantly and struggle to rejoin a steady stream of traffic, so letting one out costs you a few seconds and keeps the whole service moving.',
    mediaId: null,
    subtopic: 'Buses',
    sourceRef: 'Highway Code rule 223',
  },
  {
    id: 'q-other-road-users-02',
    topicId: 'other-road-users',
    type: 'single_choice',
    text: 'A long lorry ahead of you is signalling left but has moved out towards the centre of the road. Why?',
    options: [
      { id: 'A', text: 'The driver has signalled by mistake' },
      { id: 'B', text: 'The driver is inviting you to overtake on the left' },
      {
        id: 'C',
        text: 'It needs the extra width to get round the corner, so you must stay back and not pass on its left',
      },
      { id: 'D', text: 'It is about to stop and unload' },
    ],
    correctOptionId: 'C',
    explanation:
      'The rear wheels of a long vehicle cut inside the path of the front ones, so the gap that opens on the left closes again as the turn is completed.',
    mediaId: null,
    subtopic: 'Large vehicles',
    sourceRef: 'Highway Code rule 221',
  },
  {
    id: 'q-other-road-users-03',
    topicId: 'other-road-users',
    type: 'single_choice',
    text: 'You are on a roundabout and a long vehicle in the left-hand lane is signalling to continue round to the right. What should you do?',
    options: [
      { id: 'A', text: 'Overtake it on the right before it moves across' },
      { id: 'B', text: 'Hold back and give it room, as it may need both lanes to get round' },
      { id: 'C', text: 'Stay alongside it so that the driver can see you' },
      { id: 'D', text: 'Sound the horn to remind the driver of the correct lane' },
    ],
    correctOptionId: 'B',
    explanation:
      'A long vehicle often has to straddle lanes on a roundabout because of the way the trailer swings, and a car alongside sits exactly where the driver cannot see it.',
    mediaId: null,
    subtopic: 'Large vehicles',
    sourceRef: 'Highway Code rule 187',
  },
];

/* -------------------------------------------------------------------------- */
/* Translations                                                                */
/* -------------------------------------------------------------------------- */

const ES_TRANSLATIONS: Record<string, QuestionTranslation> = {
  'q-road-signs-01': {
    text: 'Una señal de tráfico es triangular y tiene el borde rojo. ¿Qué te está indicando?',
    options: {
      A: 'Debes detenerte en la señal',
      B: 'No debes pasar más allá de la señal',
      C: 'Hay un peligro más adelante para el que debes prepararte',
      D: 'La vía que viene es de sentido único',
    },
    explanation:
      'El triángulo se reserva para las advertencias, así que la forma por sí sola te avisa de que hay algo más adelante antes de que puedas leer el símbolo. Las órdenes y las prohibiciones usan círculos.',
  },
  'q-road-signs-02': {
    text: 'Llegas a una señal octogonal con el fondo rojo. ¿Qué debes hacer?',
    options: {
      A: 'Detenerte por completo en la línea, aunque la vía parezca despejada',
      B: 'Reducir la velocidad y continuar si no viene nadie',
      C: 'Ceder el paso solo al tráfico que llega por la derecha',
      D: 'Tocar el claxon antes de arrancar',
    },
    explanation:
      'El octógono es la única señal con esa forma, por lo que sigue siendo reconocible cuando la nieve o la suciedad tapan el texto. Su orden es absoluta y no basta con pasar rodando despacio.',
  },
  'q-road-signs-03': {
    text: '¿Para qué sirven la mayoría de las señales circulares con borde rojo?',
    options: {
      A: 'Advertirte sobre el estado del firme',
      B: 'Indicarte lo que no debes hacer',
      C: 'Dar indicaciones hacia el centro de la ciudad',
      D: 'Marcar el final de una restricción',
    },
    explanation:
      'El anillo rojo es la forma habitual de expresar una prohibición, así que el símbolo del interior es algo que se te retira en lugar de algo que se te ofrece.',
  },
  'q-road-signs-04': {
    text: '¿Qué suele significar una señal circular azul?',
    options: {
      A: 'La vía que viene está cerrada a todo el tráfico',
      B: 'Estás saliendo de una zona restringida',
      C: 'Hay aparcamiento en las cercanías',
      D: 'Hay algo que debes hacer, como girar a la izquierda o usar un carril concreto',
    },
    explanation:
      'Los círculos azules dan instrucciones positivas, al contrario que los círculos con anillo rojo, que prohíben. Los rectángulos azules son distintos y solo aportan información.',
  },
  'q-road-signs-05': {
    text: 'Aparece al lado de la vía una señal circular blanca con una sola franja diagonal negra. ¿Qué significa?',
    options: {
      A: 'La vía que viene no tiene ningún límite de velocidad',
      B: 'Se aplica el límite de velocidad nacional según el tipo de vía y de vehículo que conduces',
      C: 'A partir de este punto puedes adelantar en cualquier lugar',
      D: 'Aquí terminan todas las restricciones, incluidas las de estacionamiento',
    },
    explanation:
      'No se indica ninguna cifra porque el límite depende de la vía y del vehículo: 60 mph en calzada única y 70 mph en calzada desdoblada para un turismo. Nunca significa que no haya límite.',
  },
  'q-junctions-01': {
    text: 'Vas a tomar la primera salida, a la izquierda, en una rotonda. ¿Cómo debes aproximarte?',
    options: {
      A: 'Señalizar a la izquierda al aproximarte y mantenerte en el carril izquierdo',
      B: 'Señalizar a la derecha al aproximarte y desplazarte a la izquierda en el último momento',
      C: 'Permanecer en el carril derecho para ver mejor el resto de la rotonda',
      D: 'Aproximarte sin señalizar y decidir en la línea de ceda el paso',
    },
    explanation:
      'Colocarte pronto en el carril correcto permite que quienes van detrás entiendan tu trayectoria antes de llegar a la línea de ceda el paso, que es justo donde los cambios de carril tardíos provocan colisiones.',
  },
  'q-junctions-02': {
    text: 'Tienes previsto tomar una salida situada más allá de la posición de las doce en una rotonda. ¿Cuál es el procedimiento normal?',
    options: {
      A: 'Señalizar a la izquierda todo el rato y quedarte en el carril izquierdo',
      B: 'No señalizar hasta que ya estés dentro de la rotonda',
      C: 'Señalizar a la derecha al aproximarte, mantenerte a la derecha y señalizar a la izquierda tras pasar la salida anterior a la tuya',
      D: 'Señalizar a la derecha y mantener ese intermitente hasta haber salido de la rotonda',
    },
    explanation:
      'Mantener el intermitente derecho indica al tráfico que espera para incorporarse que sigues girando, y el intermitente izquierdo tardío es lo que les permite entrar.',
  },
  'q-junctions-03': {
    text: '¿Qué significan las líneas blancas discontinuas que cruzan la boca de una vía secundaria?',
    options: {
      A: 'Puedes salir directamente sin reducir la velocidad',
      B: 'El tráfico de la vía principal debe cederte el paso',
      C: 'Debes detenerte y poner el freno de mano',
      D: 'Debes ceder el paso al tráfico de la vía principal antes de incorporarte',
    },
    explanation:
      'Las líneas discontinuas obligan a ceder el paso, no a detenerse, así que puedes seguir avanzando si la vía está realmente despejada. La responsabilidad de ceder sigue siendo enteramente tuya.',
  },
  'q-junctions-04': {
    text: 'Llegas a un cruce con una línea blanca continua que atraviesa tu carril y una señal octogonal. ¿Qué debes hacer?',
    options: {
      A: 'Ceder el paso solo si se acerca algún vehículo',
      B: 'Detenerte tras la línea siempre, y arrancar cuando sea seguro',
      C: 'Hacer ráfagas con las luces y continuar',
      D: 'Tocar el claxon y salir despacio',
    },
    explanation:
      'Esa combinación crea una obligación legal de detenerse, así que se aplica incluso cuando ya ves que la vía está vacía. Una línea de ceda el paso sería discontinua en lugar de continua.',
  },
  'q-junctions-05': {
    text: 'Esperas en un cruce para girar a la derecha y un vehículo que viene de frente también gira a la derecha. ¿Qué solución suele dar mejor visibilidad a ambos conductores?',
    options: {
      A: 'Ambos giran por delante uno del otro, pasando lado interior contra lado interior',
      B: 'Cedes siempre el paso y dejas pasar primero al otro conductor',
      C: 'Te colocas en el centro del cruce y esperas allí',
      D: 'Girar por detrás uno del otro, lado exterior contra lado exterior, para que ninguno tape la visión del otro',
    },
    explanation:
      'Pasar por detrás del otro mantiene visible para ambos la vía a la que se incorporan. Girar por delante oculta el tráfico que viene de frente y a los peatones detrás del otro coche.',
  },
  'q-motorways-01': {
    text: '¿Cuál es el límite de velocidad nacional para un turismo en autopista?',
    options: {
      A: '60 mph',
      B: '70 mph',
      C: '80 mph',
      D: 'No hay un límite fijo',
    },
    explanation:
      'Esa cifra es el máximo para los turismos y solo se aplica donde no haya señalizado un límite inferior. Es un techo, no un objetivo, y las condiciones a menudo lo hacen inseguro.',
  },
  'q-motorways-02': {
    text: '¿Cuándo puedes circular por el arcén de una autopista?',
    options: {
      A: 'Para adelantar al tráfico lento',
      B: 'Para atender una llamada o consultar la ruta',
      C: 'Para descansar durante un viaje largo',
      D: 'Solo en caso de emergencia, o cuando las señales indiquen que está abierto como carril de circulación',
    },
    explanation:
      'El arcén es un refugio para las averías y una vía de paso para los servicios de emergencia, de modo que cualquier otro uso bloquea a quien no tiene ninguna alternativa.',
  },
  'q-motorways-03': {
    text: '¿Cuál de estos no está permitido en una autopista?',
    options: {
      A: 'Peatones y ciclistas',
      B: 'Vehículos que arrastran remolque',
      C: 'Vehículos pesados de mercancías',
      D: 'Motocicletas de más de 50 cc',
    },
    explanation:
      'Las autopistas excluyen todo lo que no pueda seguir el ritmo del tráfico o carezca de protección alrededor, y por eso quedan fuera quienes van a pie o en bicicleta.',
  },
  'q-motorways-04': {
    text: 'Se muestra una X roja en el panel elevado sobre tu carril. ¿Qué significa?',
    options: {
      A: 'Hay un radar en funcionamiento en ese carril',
      B: 'El carril está reservado a autobuses y autocares',
      C: 'El carril está cerrado y debes salir de él',
      D: 'Ha ocurrido un incidente a tres millas de distancia',
    },
    explanation:
      'Un carril suele cerrarse porque hay personas o un vehículo detenido en él, así que la señal protege a alguien que todavía no puedes ver. Rebasar una X roja es una infracción detectada por cámara.',
  },
  'q-motorways-05': {
    text: '¿Qué separación deberías dejar normalmente respecto al vehículo de delante en una autopista seca?',
    options: {
      A: 'La longitud de un coche por cada 10 mph',
      B: 'La suficiente para leer su matrícula',
      C: 'Medio segundo',
      D: 'Al menos dos segundos, cronometrados sobre un punto fijo del borde de la vía',
    },
    explanation:
      'Una separación medida en tiempo crece automáticamente con la velocidad, mientras que contar longitudes de coche subestima gravemente la distancia necesaria a velocidad de autopista. Duplícala en cuanto la calzada esté mojada.',
  },
  'q-hazard-awareness-01': {
    text: '¿De qué dos partes se compone la distancia total de detención?',
    options: {
      A: 'La distancia de reacción y la distancia de frenado',
      B: 'La distancia de frenado y la longitud del vehículo',
      C: 'El tiempo de reacción y la selección de marcha',
      D: 'La adherencia de los neumáticos y el freno motor',
    },
    explanation:
      'Se pierde terreno antes incluso de tocar el freno, y por eso el cansancio o una distracción alargan el total aunque el coche, la vía y la velocidad no cambien.',
  },
  'q-hazard-awareness-02': {
    text: 'En buenas condiciones y con la calzada seca, ¿cuál es la distancia total de detención típica de un turismo a 70 mph?',
    options: {
      A: '53 metros',
      B: '96 metros',
      C: '36 metros',
      D: '120 metros',
    },
    explanation:
      'Equivale a unas 24 longitudes de coche, y la cifra crece mucho más deprisa que la velocidad. Unos 21 metros se consumen antes siquiera de reaccionar.',
  },
  'q-hazard-awareness-03': {
    text: 'Empiezas a sentir somnolencia en un trayecto largo por autopista. ¿Qué debes hacer?',
    options: {
      A: 'Abrir una ventanilla y subir el volumen de la radio',
      B: 'Seguir hasta tu destino lo más rápido posible',
      C: 'Salir en la próxima área de servicio o salida y descansar antes de continuar',
      D: 'Pasar al carril izquierdo y bajar a 50 mph',
    },
    explanation:
      'El aire fresco y el ruido disimulan el cansancio unos minutos sin devolver la atención, así que detenerse es el único remedio real. La autopista casi no ofrece estímulos que mantengan despierto al cerebro.',
  },
  'q-vehicle-safety-01': {
    text: '¿Cuál es la profundidad mínima legal del dibujo de un neumático de turismo en los tres cuartos centrales de su anchura?',
    options: {
      A: '1,0 mm',
      B: '2,0 mm',
      C: '1,6 mm',
      D: '3,0 mm',
    },
    explanation:
      'Por debajo de esa profundidad los canales ya no evacuan suficiente agua de debajo del neumático, así que el agarre en mojado se hunde mucho antes de que la cubierta parezca gastada.',
  },
  'q-vehicle-safety-02': {
    text: '¿Cuándo necesita un turismo su primera inspección técnica (MOT)?',
    options: {
      A: 'En el tercer aniversario de su matriculación',
      B: 'Al cabo de un año',
      C: 'Al cabo de cinco años',
      D: 'Solo cuando se vende',
    },
    explanation:
      'Los coches nuevos están exentos al principio porque es poco probable que las piezas de desgaste hayan fallado tan pronto, y después la inspección pasa a ser anual.',
  },
  'q-vehicle-safety-03': {
    text: '¿Cuál es la tasa legal de alcohol para conductores en Inglaterra y Gales medida en aire espirado?',
    options: {
      A: '22 microgramos por 100 ml de aire espirado',
      B: '50 microgramos por 100 ml de aire espirado',
      C: '80 microgramos por 100 ml de aire espirado',
      D: '35 microgramos por 100 ml de aire espirado',
    },
    explanation:
      'Escocia fija una cifra más baja, de modo que la misma copa puede ser legal a un lado de la frontera y no al otro. El juicio ya está afectado muy por debajo de cualquier tasa.',
  },
  'q-rules-of-the-road-01': {
    text: 'Circulas por una vía con alumbrado público pero sin señales de límite de velocidad. ¿Qué límite se aplica?',
    options: {
      A: '20 mph',
      B: '30 mph',
      C: '40 mph',
      D: '60 mph',
    },
    explanation:
      'El alumbrado público regular es en sí mismo la señal de zona urbana, así que no hace falta señalizar nada. Las señales repetidoras solo aparecen donde rige un límite distinto.',
  },
  'q-rules-of-the-road-02': {
    text: '¿Cuál es el límite de velocidad nacional para un turismo en una vía de calzada única?',
    options: {
      A: '60 mph',
      B: '50 mph',
      C: '70 mph',
      D: '40 mph',
    },
    explanation:
      'En una calzada única el tráfico contrario circula por la misma franja de asfalto, por eso la cifra queda por debajo de la de calzada desdoblada. Las curvas y los cruces suelen hacer inseguro incluso ese límite.',
  },
  'q-rules-of-the-road-03': {
    text: '¿Cuál es el límite de velocidad nacional para un turismo en una calzada desdoblada?',
    options: {
      A: '50 mph',
      B: '60 mph',
      C: '70 mph',
      D: '80 mph',
    },
    explanation:
      'Una mediana separa los sentidos de circulación, por lo que el límite coincide con el de autopista. Los turismos que arrastran remolque están sujetos a uno inferior en la misma vía.',
  },
  'q-vulnerable-road-users-01': {
    text: 'Vas a adelantar a un ciclista a unas 30 mph. ¿Cuánto espacio debes dejarle?',
    options: {
      A: 'El suficiente para pasar sin tocarlo',
      B: 'Alrededor de medio metro',
      C: 'El ancho de una bicicleta',
      D: 'Al menos 1,5 metros, y más a velocidades altas',
    },
    explanation:
      'Los ciclistas tienen que esquivar sumideros y baches sin previo aviso, y la turbulencia de un adelantamiento cercano basta por sí sola para desequilibrarlos.',
  },
  'q-vulnerable-road-users-02': {
    text: 'Circulas detrás de un caballo con jinete por una carretera rural. ¿Cómo debes adelantar?',
    options: {
      A: 'Tocar primero el claxon para que el jinete sepa que estás ahí',
      B: 'Reducir a un máximo de 10 mph y pasar despacio y con amplitud',
      C: 'Acelerar para pasar rápido y reducir el tiempo a su altura',
      D: 'Quedarte muy cerca detrás hasta que el jinete te haga señas',
    },
    explanation:
      'Un caballo reacciona al ruido del motor y a los movimientos bruscos, no al razonamiento, así que la velocidad y la proximidad son lo que más probablemente lo hará desviarse hacia la calzada.',
  },
  'q-vulnerable-road-users-03': {
    text: 'Un peatón mayor cruza despacio por delante de ti en el cruce hacia el que estás girando. ¿Qué debes hacer?',
    options: {
      A: 'Esperar con paciencia y dejar que termine de cruzar',
      B: 'Avanzar poco a poco para animarlo a darse prisa',
      C: 'Tocar el claxon para avisarlo',
      D: 'Rodearlo por detrás',
    },
    explanation:
      'Los peatones que ya han comenzado a cruzar tienen prioridad, y una persona mayor puede no calcular tu velocidad de aproximación ni oír el coche. La presión es justamente lo que provoca los tropiezos.',
  },
  'q-vehicle-handling-01': {
    text: '¿Cuándo puedes usar las luces antiniebla traseras?',
    options: {
      A: 'Siempre que llueva con fuerza',
      B: 'En cualquier momento después del anochecer',
      C: 'Solo cuando la visibilidad baje de unos 100 metros',
      D: 'Nunca en una vía pública',
    },
    explanation:
      'Las antiniebla traseras son mucho más potentes que los pilotos normales, así que con aire más limpio deslumbran a quien va detrás y anulan tus luces de freno. Apágalas en cuanto se levante la niebla.',
  },
  'q-vehicle-handling-02': {
    text: '¿Cómo afecta la calzada mojada a tu distancia de detención?',
    options: {
      A: 'No tiene un efecto apreciable en un coche moderno',
      B: 'La acorta porque los neumáticos trabajan más fríos',
      C: 'La aumenta alrededor de una cuarta parte',
      D: 'Puede al menos duplicarla',
    },
    explanation:
      'El agua impide que el neumático toque directamente el firme, de modo que la misma presión sobre el pedal rinde mucho menos. Sobre hielo la distancia puede llegar a diez veces la cifra en seco.',
  },
  'q-vehicle-handling-03': {
    text: '¿Por qué es mala idea bajar una pendiente con el embrague pisado?',
    options: {
      A: 'Elimina el freno motor y reduce tu control del coche',
      B: 'Consume bastante más combustible',
      C: 'Conlleva una sanción automática de seis puntos',
      D: 'Hace que las luces de freno queden encendidas',
    },
    explanation:
      'Con la transmisión desconectada el motor ya no ayuda a retener el coche, así que los frenos asumen toda la carga y la respuesta de la dirección cae en el peor momento.',
  },
  'q-documents-01': {
    text: '¿Cuál es el nivel mínimo de seguro que debes tener para conducir por una vía pública?',
    options: {
      A: 'A todo riesgo',
      B: 'De responsabilidad civil frente a terceros',
      C: 'Terceros, incendio y robo',
      D: 'Ninguno, si el vehículo tiene menos de tres años',
    },
    explanation:
      'La exigencia legal existe para proteger a los demás de los daños o lesiones que tú causes, no para proteger tu propio coche, y por eso el mínimo deja sin cubrir tus propias reparaciones.',
  },
  'q-documents-02': {
    text: '¿Cuánto tiempo suele ser válido el permiso de conducir en formato tarjeta antes de tener que renovarlo?',
    options: {
      A: '3 años',
      B: '5 años',
      C: '10 años',
      D: 'De por vida',
    },
    explanation:
      'La renovación sirve para mantener la fotografía actualizada a efectos de identificación, así que la autorización para conducir sigue vigente mientras se sustituye la tarjeta.',
  },
  'q-documents-03': {
    text: '¿Cuál de estas cosas debes comunicar a la DVLA?',
    options: {
      A: 'Un cambio de nombre o de domicilio permanente, y cualquier problema médico que afecte a tu conducción',
      B: 'Cada viaje que hagas al extranjero',
      C: 'Un cambio de compañía aseguradora del coche',
      D: 'El montaje de neumáticos nuevos en tu coche',
    },
    explanation:
      'El registro del permiso debe reflejar la realidad para que la correspondencia y los controles de aptitud lleguen a la persona correcta. Un registro desactualizado también puede invalidar tu seguro.',
  },
  'q-incidents-01': {
    text: 'Llegas al lugar de un accidente antes que los servicios de emergencia. ¿Qué debes hacer primero?',
    options: {
      A: 'Trasladar a todos los heridos al arcén',
      B: 'Hacer fotografías para la aseguradora',
      C: 'Dar una bebida caliente a los heridos',
      D: 'Advertir al resto del tráfico, por ejemplo encendiendo las luces de emergencia',
    },
    explanation:
      'Lo más probable es que ocurra a continuación un segundo choque contra el lugar del accidente, y heriría tanto a quienes se han detenido a ayudar como a los heridos iniciales.',
  },
  'q-incidents-02': {
    text: 'Un herido adulto está inconsciente y no respira. ¿Qué debes hacer?',
    options: {
      A: 'Darle agua para beber',
      B: 'Abrir la vía aérea inclinando la cabeza hacia atrás, iniciar las compresiones torácicas y pedir ayuda',
      C: 'Sentarlo erguido contra un muro',
      D: 'Esperar a la ambulancia sin tocarlo',
    },
    explanation:
      'En una persona inconsciente la lengua suele obstruir la vía aérea, así que despejarla puede ser todo lo que hace falta. Las compresiones mantienen la sangre llegando al cerebro hasta que llegue la ayuda.',
  },
  'q-incidents-03': {
    text: 'Un motorista se ha caído y está herido en la calzada. ¿Qué debes hacer con el casco?',
    options: {
      A: 'Quitárselo enseguida para que respire mejor',
      B: 'Quitárselo y usarlo para señalizar el lugar',
      C: 'Dejárselo puesto salvo que quitarlo sea imprescindible, por ejemplo si no respira',
      D: 'Quitárselo solo una vez que se haya llamado a la ambulancia',
    },
    explanation:
      'Quitar un casco mueve la cabeza y el cuello, lo que puede convertir una lesión medular en algo permanente. Ese riesgo solo compensa cuando está en juego la propia vía aérea.',
  },
  'q-vehicle-loading-01': {
    text: '¿Quién es responsable de que un vehículo no vaya sobrecargado y de que la carga esté sujeta?',
    options: {
      A: 'El conductor',
      B: 'La persona que te vendió el vehículo',
      C: 'La compañía de seguros',
      D: 'Quien te haya ayudado a cargarlo',
    },
    explanation:
      'La obligación acompaña a quien está al mando del vehículo en la vía, de modo que no puede trasladarse a quien te preparó el equipaje o te enganchó el remolque.',
  },
  'q-vehicle-loading-02': {
    text: '¿Cómo cambia una carga pesada el comportamiento de un coche?',
    options: {
      A: 'Mejora el agarre, así que puedes frenar más tarde',
      B: 'No tiene efecto mientras la carga vaya dentro del maletero',
      C: 'Solo importa a velocidad de autopista',
      D: 'Cambian el comportamiento y la dirección, y la distancia de detención se alarga',
    },
    explanation:
      'La masa añadida debe ser frenada por los mismos frenos y girada por los mismos neumáticos, y un peso colocado alto o muy atrás también resta estabilidad al esquivar.',
  },
  'q-vehicle-loading-03': {
    text: 'Remolcas una caravana y tus retrovisores normales no te muestran la vía por detrás de ella. ¿Qué debes hacer?',
    options: {
      A: 'Confiar únicamente en el retrovisor del lado izquierdo',
      B: 'Montar retrovisores de remolque adecuados antes de salir',
      C: 'Pedir a un acompañante que mire hacia atrás por ti',
      D: 'Circular más cerca de la línea central para ver más allá',
    },
    explanation:
      'Necesitas una visión suficiente de la vía por detrás a ambos lados, y una caravana suele ser más ancha que el coche. Los retrovisores extensibles recuperan esa visión sin cambiar tu posición en la calzada.',
  },
  'q-road-conditions-01': {
    text: 'La dirección se vuelve de repente muy ligera en un día frío. ¿Qué es lo más probable que signifique?',
    options: {
      A: 'Se ha desinflado un neumático',
      B: 'Ha fallado la dirección asistida',
      C: 'Hay hielo en el firme',
      D: 'El tipo de firme está a punto de cambiar',
    },
    explanation:
      'El hielo elimina la resistencia que sueles notar en el volante porque los neumáticos casi han dejado de agarrar. Levanta el pie y haz cada maniobra con la máxima suavidad.',
  },
  'q-road-conditions-02': {
    text: 'Tienes que atravesar un tramo con agua acumulada por una inundación. ¿Cómo debes hacerlo?',
    options: {
      A: 'Circular despacio en una marcha corta, manteniendo altas las revoluciones, y probar los frenos después',
      B: 'Cruzar lo más rápido posible para levantar una ola de proa',
      C: 'Parar a mitad de camino y comprobar la profundidad',
      D: 'Cruzar por inercia con el embrague pisado',
    },
    explanation:
      'Un régimen de motor sostenido impide que entre agua por el escape, y los frenos salen mojados del agua, así que hay que secarlos con una presión suave antes de tener que confiar en ellos.',
  },
  'q-road-conditions-03': {
    text: 'Cruzas un puente expuesto con viento lateral fuerte. ¿Para qué debes estar preparado?',
    options: {
      A: 'Para que el motor pierda potencia con las rachas',
      B: 'Para que el tráfico de detrás frene de golpe',
      C: 'Para que el viento te empuje solo hacia el arcén',
      D: 'Para que ciclistas y vehículos altos sean desplazados de lado hacia tu trayectoria',
    },
    explanation:
      'Una racha mueve mucho más a los vehículos ligeros y altos que a un turismo, así que el peligro está en lo que te rodea y no en tu propia dirección. Déjales espacio extra al pasar.',
  },
  'q-signals-and-controls-01': {
    text: '¿Cuándo debes señalizar?',
    options: {
      A: 'Con suficiente antelación, siempre que ayude a otros usuarios a entender lo que pretendes hacer',
      B: 'Solo cuando haya otro vehículo justo detrás de ti',
      C: 'Una vez que ya has iniciado la maniobra',
      D: 'En cada cruce, gires o no',
    },
    explanation:
      'La señal es información para los demás, no un permiso para ti. Dada demasiado tarde, o cuando no hay nadie que la lea, no cambia en nada la seguridad de la maniobra.',
  },
  'q-signals-and-controls-02': {
    text: 'Un conductor que viene de frente te hace ráfagas con las luces. Según el Highway Code, ¿qué significa eso?',
    options: {
      A: 'Te está cediendo la prioridad para pasar',
      B: 'Te está dando las gracias',
      C: 'Te está avisando de que está ahí',
      D: 'Hay un peligro en tu lado de la vía',
    },
    explanation:
      'Las ráfagas tienen el mismo significado único que el claxon. Interpretarlas como una invitación te compromete a entrar en un cruce fiándote de la apreciación de otra persona.',
  },
  'q-signals-and-controls-03': {
    text: 'Frenas con fuerza y notas que el pedal vibra bajo tu pie mientras actúa el sistema antibloqueo. ¿Qué debes hacer?',
    options: {
      A: 'Bombear el pedal al ritmo de la vibración',
      B: 'Mantener una presión firme y continua sobre el pedal hasta que el coche haya frenado lo suficiente',
      C: 'Soltar el pedal e intentarlo de nuevo',
      D: 'Pisar el embrague y esquivar el obstáculo',
    },
    explanation:
      'La vibración es el sistema soltando y volviendo a aplicar los frenos mucho más rápido de lo que podría cualquier conductor. Aflojar el pie solo interrumpe ese ciclo y alarga la frenada.',
  },
  'q-other-road-users-01': {
    text: 'Un autobús parado en una marquesina delante de ti señaliza para incorporarse al tráfico. ¿Qué debes hacer?',
    options: {
      A: 'Acelerar para pasar antes de que arranque',
      B: 'Tocar el claxon para reclamar la prioridad',
      C: 'Desplazarte a la derecha y pasar muy pegado a él',
      D: 'Cederle el paso si puedes hacerlo con seguridad',
    },
    explanation:
      'Los autobuses paran constantemente y les cuesta reincorporarse a un flujo continuo de tráfico, así que dejar salir a uno te cuesta unos segundos y mantiene en marcha todo el servicio.',
  },
  'q-other-road-users-02': {
    text: 'Un camión largo que va delante de ti señaliza a la izquierda pero se ha desplazado hacia el centro de la calzada. ¿Por qué?',
    options: {
      A: 'El conductor ha señalizado por error',
      B: 'El conductor te invita a adelantarlo por la izquierda',
      C: 'Necesita la anchura extra para tomar la curva, así que debes quedarte atrás y no pasar por su izquierda',
      D: 'Está a punto de parar para descargar',
    },
    explanation:
      'Las ruedas traseras de un vehículo largo pasan por dentro de la trayectoria de las delanteras, así que el hueco que se abre a la izquierda vuelve a cerrarse al completar el giro.',
  },
  'q-other-road-users-03': {
    text: 'Estás en una rotonda y un vehículo largo situado en el carril izquierdo señaliza que va a seguir girando hacia la derecha. ¿Qué debes hacer?',
    options: {
      A: 'Adelantarlo por la derecha antes de que se desplace',
      B: 'Quedarte atrás y darle espacio, porque puede necesitar los dos carriles para girar',
      C: 'Mantenerte a su altura para que el conductor pueda verte',
      D: 'Tocar el claxon para recordarle cuál es el carril correcto',
    },
    explanation:
      'Un vehículo largo a menudo tiene que ocupar dos carriles en una rotonda por la forma en que barre el remolque, y un coche a su lado se sitúa justo donde el conductor no puede verlo.',
  },
};

const PL_TRANSLATIONS: Record<string, QuestionTranslation> = {
  'q-road-signs-01': {
    text: 'Znak drogowy ma kształt trójkąta z czerwoną obwódką. Co oznacza?',
    options: {
      A: 'Musisz zatrzymać się przy znaku',
      B: 'Nie wolno ci przejechać za znak',
      C: 'Przed tobą jest zagrożenie, na które musisz się przygotować',
      D: 'Droga przed tobą jest jednokierunkowa',
    },
    explanation:
      'Trójkąt jest zarezerwowany dla ostrzeżeń, więc sam kształt informuje cię o czymś przed tobą, zanim zdążysz odczytać symbol. Nakazy i zakazy mają kształt koła.',
  },
  'q-road-signs-02': {
    text: 'Dojeżdżasz do ośmiokątnego znaku na czerwonym tle. Co musisz zrobić?',
    options: {
      A: 'Zatrzymać się całkowicie przed linią, nawet jeśli droga wygląda na pustą',
      B: 'Zwolnić i jechać dalej, jeśli nikt nie nadjeżdża',
      C: 'Ustąpić pierwszeństwa tylko pojazdom nadjeżdżającym z prawej',
      D: 'Użyć klaksonu przed ruszeniem',
    },
    explanation:
      'Ośmiokąt jest jedynym znakiem o takim kształcie, więc pozostaje rozpoznawalny, gdy śnieg lub brud zakryją napis. Jego nakaz jest bezwzględny i samo powolne przetoczenie się nie wystarczy.',
  },
  'q-road-signs-03': {
    text: 'Do czego służy większość okrągłych znaków z czerwoną obwódką?',
    options: {
      A: 'Ostrzegają o stanie nawierzchni',
      B: 'Mówią, czego nie wolno ci robić',
      C: 'Wskazują drogę do centrum miasta',
      D: 'Oznaczają koniec ograniczenia',
    },
    explanation:
      'Czerwony pierścień to standardowy sposób wyrażenia zakazu, więc symbol w środku oznacza coś, co jest ci odbierane, a nie oferowane.',
  },
  'q-road-signs-04': {
    text: 'Co zwykle oznacza okrągły niebieski znak?',
    options: {
      A: 'Droga przed tobą jest zamknięta dla całego ruchu',
      B: 'Opuszczasz strefę ograniczeń',
      C: 'W pobliżu jest parking',
      D: 'Coś, co musisz zrobić, na przykład skręcić w lewo albo jechać określonym pasem',
    },
    explanation:
      'Niebieskie koła zawierają nakazy, w przeciwieństwie do kół z czerwoną obwódką, które zakazują. Niebieskie prostokąty to z kolei wyłącznie informacja.',
  },
  'q-road-signs-05': {
    text: 'Przy drodze pojawia się biały okrągły znak z jednym czarnym ukośnym pasem. Co oznacza?',
    options: {
      A: 'Na drodze przed tobą nie obowiązuje żadne ograniczenie prędkości',
      B: 'Obowiązuje krajowe ograniczenie prędkości właściwe dla rodzaju drogi i pojazdu, którym jedziesz',
      C: 'Od tego miejsca możesz wyprzedzać wszędzie',
      D: 'Tutaj kończą się wszystkie ograniczenia, łącznie z zasadami parkowania',
    },
    explanation:
      'Nie podano liczby, ponieważ limit zależy od drogi i pojazdu: 60 mph na jezdni dwukierunkowej i 70 mph na drodze o rozdzielonych jezdniach dla samochodu osobowego. Nigdy nie oznacza braku ograniczenia.',
  },
  'q-junctions-01': {
    text: 'Zjeżdżasz pierwszym zjazdem, w lewo, na rondzie. Jak powinieneś dojechać do ronda?',
    options: {
      A: 'Włączyć lewy kierunkowskaz na dojeździe i trzymać się lewego pasa',
      B: 'Włączyć prawy kierunkowskaz i zjechać w lewo w ostatniej chwili',
      C: 'Pozostać na prawym pasie, aby lepiej widzieć rondo',
      D: 'Dojechać bez sygnalizowania i zdecydować przy linii ustąpienia pierwszeństwa',
    },
    explanation:
      'Wcześniejsze zajęcie właściwego pasa pozwala kierowcom z tyłu odczytać twój zamiar, zanim dojedziesz do linii ustąpienia pierwszeństwa, a to właśnie tam spóźnione zmiany pasa powodują kolizje.',
  },
  'q-junctions-02': {
    text: 'Zamierzasz zjechać z ronda zjazdem położonym za godziną dwunastą. Jak wygląda standardowa procedura?',
    options: {
      A: 'Sygnalizować w lewo przez cały czas i jechać lewym pasem',
      B: 'Nie sygnalizować niczego, dopóki nie znajdziesz się na rondzie',
      C: 'Włączyć prawy kierunkowskaz na dojeździe, trzymać się prawej strony, a lewy kierunkowskaz włączyć po minięciu zjazdu poprzedzającego twój',
      D: 'Włączyć prawy kierunkowskaz i utrzymać go aż do zjazdu z ronda',
    },
    explanation:
      'Utrzymany prawy kierunkowskaz mówi pojazdom czekającym na wjazd, że nadal jedziesz dookoła, a późny lewy kierunkowskaz jest sygnałem, który pozwala im ruszyć.',
  },
  'q-junctions-03': {
    text: 'Co oznaczają przerywane białe linie w poprzek wylotu drogi podporządkowanej?',
    options: {
      A: 'Możesz wyjechać prosto bez zwalniania',
      B: 'Ruch na drodze głównej musi ustąpić ci pierwszeństwa',
      C: 'Musisz się zatrzymać i zaciągnąć hamulec postojowy',
      D: 'Musisz ustąpić pierwszeństwa pojazdom na drodze głównej przed włączeniem się do ruchu',
    },
    explanation:
      'Linie przerywane nakazują ustąpić pierwszeństwa, a nie zatrzymać się, więc możesz jechać dalej, jeśli droga jest naprawdę wolna. Obowiązek ustąpienia nadal spoczywa wyłącznie na tobie.',
  },
  'q-junctions-04': {
    text: 'Dojeżdżasz do skrzyżowania z ciągłą białą linią w poprzek twojego pasa i ośmiokątnym znakiem. Co musisz zrobić?',
    options: {
      A: 'Ustąpić pierwszeństwa tylko wtedy, gdy nadjeżdża jakiś pojazd',
      B: 'Za każdym razem zatrzymać się przed linią, a potem ruszyć, gdy będzie bezpiecznie',
      C: 'Mrugnąć światłami i jechać dalej',
      D: 'Użyć klaksonu i powoli wysunąć się na skrzyżowanie',
    },
    explanation:
      'To połączenie tworzy prawny obowiązek zatrzymania się, więc obowiązuje nawet wtedy, gdy już widzisz, że droga jest pusta. Linia ustąpienia pierwszeństwa byłaby przerywana, a nie ciągła.',
  },
  'q-junctions-05': {
    text: 'Czekasz na skrzyżowaniu, aby skręcić w prawo, a pojazd z naprzeciwka też skręca w prawo. Które rozwiązanie zwykle daje obu kierowcom lepszą widoczność?',
    options: {
      A: 'Obaj skręcają przed sobą, mijając się wewnętrznymi bokami',
      B: 'Zawsze ustępujesz i przepuszczasz drugiego kierowcę',
      C: 'Wjeżdżasz na środek skrzyżowania i tam czekasz',
      D: 'Skręcanie za sobą, zewnętrznymi bokami, tak aby żaden samochód nie zasłaniał widoku drugiemu',
    },
    explanation:
      'Mijanie się za sobą sprawia, że obaj kierowcy widzą drogę, w którą skręcają. Skręcanie przed sobą chowa nadjeżdżające pojazdy i pieszych za drugim samochodem.',
  },
  'q-motorways-01': {
    text: 'Jakie jest krajowe ograniczenie prędkości dla samochodu osobowego na autostradzie?',
    options: {
      A: '60 mph',
      B: '70 mph',
      C: '80 mph',
      D: 'Nie ma stałego ograniczenia',
    },
    explanation:
      'Ta wartość to maksimum dla samochodów osobowych i obowiązuje tylko tam, gdzie nie oznakowano niższego limitu. To górna granica, a nie cel, i warunki często czynią ją niebezpieczną.',
  },
  'q-motorways-02': {
    text: 'Kiedy wolno ci jechać pasem awaryjnym na autostradzie?',
    options: {
      A: 'Aby wyprzedzić wolno jadące pojazdy',
      B: 'Aby odebrać telefon lub sprawdzić trasę',
      C: 'Aby odpocząć podczas długiej podróży',
      D: 'Tylko w sytuacji awaryjnej albo gdy znaki wskazują, że jest otwarty jako pas ruchu',
    },
    explanation:
      'Pas awaryjny to schronienie w razie awarii i droga przejazdu dla służb ratunkowych, więc każde inne użycie blokuje tych, którzy nie mają żadnej alternatywy.',
  },
  'q-motorways-03': {
    text: 'Które z poniższych nie jest dozwolone na autostradzie?',
    options: {
      A: 'Piesi i rowerzyści',
      B: 'Pojazdy ciągnące przyczepy',
      C: 'Samochody ciężarowe dużej ładowności',
      D: 'Motocykle powyżej 50 cm³',
    },
    explanation:
      'Autostrady wykluczają wszystko, co nie nadąża za potokiem ruchu albo nie ma wokół siebie żadnej ochrony, i właśnie dlatego nie mogą tam wjeżdżać piesi ani rowerzyści.',
  },
  'q-motorways-04': {
    text: 'Na tablicy nad twoim pasem wyświetla się czerwony krzyż X. Co to oznacza?',
    options: {
      A: 'Na tym pasie działa fotoradar',
      B: 'Pas jest zarezerwowany dla autobusów',
      C: 'Pas jest zamknięty i musisz z niego zjechać',
      D: 'Trzy mile dalej doszło do zdarzenia',
    },
    explanation:
      'Pas zamyka się zwykle dlatego, że są na nim ludzie albo unieruchomiony pojazd, więc znak chroni kogoś, kogo jeszcze nie widzisz. Przejazd pod czerwonym X jest wykroczeniem rejestrowanym przez kamery.',
  },
  'q-motorways-05': {
    text: 'Jaki odstęp od pojazdu z przodu należy zwykle zachować na suchej autostradzie?',
    options: {
      A: 'Jedną długość samochodu na każde 10 mph',
      B: 'Taki, by dało się odczytać jego tablicę rejestracyjną',
      C: 'Pół sekundy',
      D: 'Co najmniej dwie sekundy, mierzone względem nieruchomego punktu przy drodze',
    },
    explanation:
      'Odstęp mierzony w czasie rośnie automatycznie wraz z prędkością, podczas gdy liczenie długości samochodu drastycznie zaniża potrzebny dystans przy prędkościach autostradowych. Na mokrej nawierzchni podwój go.',
  },
  'q-hazard-awareness-01': {
    text: 'Z jakich dwóch części składa się całkowita droga zatrzymania?',
    options: {
      A: 'Z drogi reakcji i drogi hamowania',
      B: 'Z drogi hamowania i długości pojazdu',
      C: 'Z czasu reakcji i doboru biegu',
      D: 'Z przyczepności opon i hamowania silnikiem',
    },
    explanation:
      'Metry uciekają jeszcze zanim dotkniesz hamulca, dlatego zmęczenie lub rozproszenie uwagi wydłuża całość, nawet gdy samochód, droga i prędkość pozostają te same.',
  },
  'q-hazard-awareness-02': {
    text: 'W dobrych warunkach na suchej nawierzchni, jaka jest typowa całkowita droga zatrzymania samochodu przy 70 mph?',
    options: {
      A: '53 metry',
      B: '96 metrów',
      C: '36 metrów',
      D: '120 metrów',
    },
    explanation:
      'To około 24 długości samochodu, a wartość ta rośnie znacznie szybciej niż sama prędkość. Około 21 metrów znika, zanim w ogóle zdążysz zareagować.',
  },
  'q-hazard-awareness-03': {
    text: 'Podczas długiej jazdy autostradą zaczyna cię morzyć sen. Co powinieneś zrobić?',
    options: {
      A: 'Otworzyć okno i podgłośnić radio',
      B: 'Jechać do celu tak szybko, jak się da',
      C: 'Zjechać na najbliższym MOP-ie lub zjeździe i odpocząć przed dalszą jazdą',
      D: 'Zjechać na lewy pas i zwolnić do 50 mph',
    },
    explanation:
      'Świeże powietrze i hałas maskują zmęczenie na kilka minut, ale nie przywracają czujności, więc jedynym prawdziwym lekarstwem jest postój. Autostrada nie dostarcza mózgowi prawie żadnych bodźców.',
  },
  'q-vehicle-safety-01': {
    text: 'Jaka jest minimalna dopuszczalna głębokość bieżnika opony samochodu osobowego na środkowych trzech czwartych jej szerokości?',
    options: {
      A: '1,0 mm',
      B: '2,0 mm',
      C: '1,6 mm',
      D: '3,0 mm',
    },
    explanation:
      'Poniżej tej głębokości rowki nie odprowadzają już dość wody spod opony, więc przyczepność na mokrym załamuje się na długo przed tym, zanim opona zacznie wyglądać na zużytą.',
  },
  'q-vehicle-safety-02': {
    text: 'Kiedy samochód osobowy po raz pierwszy wymaga przeglądu technicznego MOT?',
    options: {
      A: 'W trzecią rocznicę pierwszej rejestracji',
      B: 'Po roku',
      C: 'Po pięciu latach',
      D: 'Dopiero przy sprzedaży',
    },
    explanation:
      'Nowe samochody są początkowo zwolnione, bo jest mało prawdopodobne, by elementy eksploatacyjne zawiodły tak wcześnie, a później badanie staje się coroczne.',
  },
  'q-vehicle-safety-03': {
    text: 'Jaki jest dopuszczalny limit alkoholu dla kierowców w Anglii i Walii mierzony w wydychanym powietrzu?',
    options: {
      A: '22 mikrogramy na 100 ml wydychanego powietrza',
      B: '50 mikrogramów na 100 ml wydychanego powietrza',
      C: '80 mikrogramów na 100 ml wydychanego powietrza',
      D: '35 mikrogramów na 100 ml wydychanego powietrza',
    },
    explanation:
      'Szkocja ustala niższą wartość, więc ten sam drink może być legalny po jednej stronie granicy, a po drugiej już nie. Ocena sytuacji jest zaburzona daleko poniżej każdego limitu.',
  },
  'q-rules-of-the-road-01': {
    text: 'Jedziesz drogą z latarniami ulicznymi, ale bez znaków ograniczenia prędkości. Jaki limit obowiązuje?',
    options: {
      A: '20 mph',
      B: '30 mph',
      C: '40 mph',
      D: '60 mph',
    },
    explanation:
      'Regularne oświetlenie uliczne samo w sobie sygnalizuje obszar zabudowany, więc nic nie musi być oznakowane. Znaki powtarzające pojawiają się tylko tam, gdzie obowiązuje inny limit.',
  },
  'q-rules-of-the-road-02': {
    text: 'Jakie jest krajowe ograniczenie prędkości dla samochodu osobowego na drodze o jednej jezdni?',
    options: {
      A: '60 mph',
      B: '50 mph',
      C: '70 mph',
      D: '40 mph',
    },
    explanation:
      'Na jednej jezdni ruch z naprzeciwka odbywa się tym samym pasem asfaltu, dlatego wartość jest niższa niż na drodze o rozdzielonych jezdniach. Zakręty i skrzyżowania często czynią niebezpiecznym nawet ten limit.',
  },
  'q-rules-of-the-road-03': {
    text: 'Jakie jest krajowe ograniczenie prędkości dla samochodu osobowego na drodze o rozdzielonych jezdniach?',
    options: {
      A: '50 mph',
      B: '60 mph',
      C: '70 mph',
      D: '80 mph',
    },
    explanation:
      'Pas rozdzielający oddziela przeciwne kierunki ruchu, więc limit jest taki sam jak na autostradzie. Samochody z przyczepą obowiązuje na tej samej drodze niższa wartość.',
  },
  'q-vulnerable-road-users-01': {
    text: 'Zamierzasz wyprzedzić rowerzystę przy prędkości około 30 mph. Ile miejsca powinieneś mu zostawić?',
    options: {
      A: 'Tyle, by przejechać bez dotknięcia go',
      B: 'Około pół metra',
      C: 'Szerokość roweru',
      D: 'Co najmniej 1,5 metra, a przy wyższych prędkościach więcej',
    },
    explanation:
      'Rowerzyści muszą omijać studzienki i dziury bez uprzedzenia, a sam podmuch powietrza przy bliskim wyprzedzaniu wystarczy, by wytrącić ich z równowagi.',
  },
  'q-vulnerable-road-users-02': {
    text: 'Jedziesz za koniem z jeźdźcem wiejską drogą. Jak powinieneś go wyprzedzić?',
    options: {
      A: 'Najpierw użyć klaksonu, by jeździec wiedział, że tam jesteś',
      B: 'Zwolnić do maksymalnie 10 mph i wyprzedzić powoli, szerokim łukiem',
      C: 'Przyspieszyć i szybko minąć, by skrócić czas jazdy obok',
      D: 'Jechać tuż za nim, aż jeździec da ci znak',
    },
    explanation:
      'Koń reaguje na hałas silnika i gwałtowny ruch, a nie na argumenty, więc to prędkość i bliskość najczęściej sprawiają, że spłoszony zbacza na jezdnię.',
  },
  'q-vulnerable-road-users-03': {
    text: 'Starszy pieszy przechodzi powoli przed tobą przez ulicę, w którą właśnie skręcasz. Co powinieneś zrobić?',
    options: {
      A: 'Cierpliwie zaczekać i pozwolić mu dokończyć przejście',
      B: 'Powoli podjeżdżać, by zachęcić go do pośpiechu',
      C: 'Użyć klaksonu, by go ostrzec',
      D: 'Objechać go z tyłu',
    },
    explanation:
      'Piesi, którzy już weszli na jezdnię, mają pierwszeństwo, a starsza osoba może nie ocenić twojej prędkości ani w ogóle nie usłyszeć samochodu. To właśnie presja powoduje potknięcia.',
  },
  'q-vehicle-handling-01': {
    text: 'Kiedy wolno używać tylnych świateł przeciwmgłowych?',
    options: {
      A: 'Zawsze, gdy pada ulewny deszcz',
      B: 'O każdej porze po zmroku',
      C: 'Tylko gdy widoczność spada poniżej około 100 metrów',
      D: 'Nigdy na drodze publicznej',
    },
    explanation:
      'Tylne światła przeciwmgłowe są znacznie jaśniejsze od zwykłych lamp tylnych, więc przy czystszym powietrzu oślepiają jadącego z tyłu i zagłuszają twoje światła stopu. Wyłącz je, gdy mgła się podniesie.',
  },
  'q-vehicle-handling-02': {
    text: 'Jak mokra nawierzchnia wpływa na twoją drogę zatrzymania?',
    options: {
      A: 'W nowoczesnym samochodzie nie ma zauważalnego wpływu',
      B: 'Skraca ją, bo opony pracują w niższej temperaturze',
      C: 'Wydłuża ją mniej więcej o jedną czwartą',
      D: 'Może wydłużyć ją co najmniej dwukrotnie',
    },
    explanation:
      'Woda uniemożliwia oponie bezpośredni kontakt z nawierzchnią, więc ten sam nacisk na pedał daje znacznie mniejszy efekt. Na lodzie dystans potrafi wzrosnąć dziesięciokrotnie względem suchej drogi.',
  },
  'q-vehicle-handling-03': {
    text: 'Dlaczego zjeżdżanie ze wzniesienia z wciśniętym sprzęgłem to zły pomysł?',
    options: {
      A: 'Wyłącza hamowanie silnikiem i ogranicza twoją kontrolę nad samochodem',
      B: 'Zużywa zauważalnie więcej paliwa',
      C: 'Wiąże się z automatyczną karą sześciu punktów',
      D: 'Powoduje, że światła stopu świecą się bez przerwy',
    },
    explanation:
      'Przy odłączonym napędzie silnik przestaje pomagać w hamowaniu, więc całe obciążenie przejmują hamulce, a reakcja układu kierowniczego słabnie w najgorszym momencie.',
  },
  'q-documents-01': {
    text: 'Jaki jest minimalny zakres ubezpieczenia wymagany do jazdy po drodze publicznej?',
    options: {
      A: 'Pełne ubezpieczenie autocasco',
      B: 'Odpowiedzialność cywilna wobec osób trzecich',
      C: 'Odpowiedzialność cywilna wraz z ryzykiem pożaru i kradzieży',
      D: 'Żadne, jeśli pojazd ma mniej niż trzy lata',
    },
    explanation:
      'Wymóg prawny istnieje po to, by chronić innych przed szkodami, które im wyrządzisz, a nie by chronić twój własny samochód, dlatego minimalny zakres zostawia twoje naprawy bez pokrycia.',
  },
  'q-documents-02': {
    text: 'Jak długo zwykle jest ważne prawo jazdy w formie karty, zanim trzeba je odnowić?',
    options: {
      A: '3 lata',
      B: '5 lat',
      C: '10 lat',
      D: 'Dożywotnio',
    },
    explanation:
      'Odnowienie służy utrzymaniu aktualnego zdjęcia do celów identyfikacji, więc samo uprawnienie do kierowania trwa nadal w czasie wymiany dokumentu.',
  },
  'q-documents-03': {
    text: 'O czym z poniższych musisz powiadomić DVLA?',
    options: {
      A: 'O zmianie nazwiska lub stałego adresu oraz o każdym stanie zdrowia wpływającym na prowadzenie pojazdu',
      B: 'O każdym wyjeździe za granicę',
      C: 'O zmianie firmy ubezpieczającej samochód',
      D: 'O założeniu nowych opon w samochodzie',
    },
    explanation:
      'Wpis w rejestrze musi odpowiadać rzeczywistości, aby korespondencja i kontrole zdolności do kierowania trafiały do właściwej osoby. Nieaktualne dane mogą też unieważnić twoje ubezpieczenie.',
  },
  'q-incidents-01': {
    text: 'Docierasz na miejsce zderzenia przed służbami ratunkowymi. Co powinieneś zrobić najpierw?',
    options: {
      A: 'Przenieść wszystkich poszkodowanych na pobocze',
      B: 'Zrobić zdjęcia dla ubezpieczyciela',
      C: 'Podać rannym ciepły napój',
      D: 'Ostrzec innych kierowców, na przykład włączając światła awaryjne',
    },
    explanation:
      'Najbardziej prawdopodobnym kolejnym zdarzeniem jest wjechanie następnego pojazdu w miejsce wypadku, co zraniłoby zarówno pomagających, jak i pierwotnych poszkodowanych.',
  },
  'q-incidents-02': {
    text: 'Dorosły poszkodowany jest nieprzytomny i nie oddycha. Co powinieneś zrobić?',
    options: {
      A: 'Podać mu wodę do picia',
      B: 'Udrożnić drogi oddechowe, odchylając głowę do tyłu, następnie rozpocząć uciskanie klatki piersiowej i wezwać pomoc',
      C: 'Posadzić go prosto, opartego o ścianę',
      D: 'Czekać na karetkę, nie dotykając go',
    },
    explanation:
      'U osoby nieprzytomnej drogi oddechowe blokuje zwykle język, więc samo ich udrożnienie może wystarczyć. Uciśnięcia utrzymują przepływ krwi do mózgu do czasu przybycia pomocy.',
  },
  'q-incidents-03': {
    text: 'Motocyklista przewrócił się i leży ranny na jezdni. Co powinieneś zrobić z kaskiem?',
    options: {
      A: 'Zdjąć go natychmiast, by łatwiej mu było oddychać',
      B: 'Zdjąć go i użyć do oznaczenia miejsca zdarzenia',
      C: 'Zostawić go założony, chyba że zdjęcie jest konieczne, na przykład gdy poszkodowany nie oddycha',
      D: 'Zdjąć go dopiero po wezwaniu karetki',
    },
    explanation:
      'Zdejmowanie kasku porusza głowę i szyję, co może zamienić uraz kręgosłupa w trwałe kalectwo. To ryzyko opłaca się podjąć tylko wtedy, gdy stawką są same drogi oddechowe.',
  },
  'q-vehicle-loading-01': {
    text: 'Kto odpowiada za to, by pojazd nie był przeciążony, a ładunek był zabezpieczony?',
    options: {
      A: 'Kierowca',
      B: 'Osoba, która sprzedała ci pojazd',
      C: 'Firma ubezpieczeniowa',
      D: 'Ten, kto pomagał ci przy załadunku',
    },
    explanation:
      'Obowiązek spoczywa na tym, kto kieruje pojazdem na drodze, więc nie da się go przerzucić na osobę, która pakowała bagażnik albo podpinała przyczepę.',
  },
  'q-vehicle-loading-02': {
    text: 'Jak ciężki ładunek zmienia zachowanie samochodu?',
    options: {
      A: 'Poprawia przyczepność, więc można hamować później',
      B: 'Nie ma znaczenia, dopóki ładunek jest w bagażniku',
      C: 'Ma znaczenie tylko przy prędkościach autostradowych',
      D: 'Zmienia prowadzenie i pracę układu kierowniczego, a droga zatrzymania się wydłuża',
    },
    explanation:
      'Dodatkową masę muszą wyhamować te same hamulce i skręcić te same opony, a ciężar umieszczony wysoko lub daleko z tyłu dodatkowo obniża stabilność przy gwałtownym omijaniu.',
  },
  'q-vehicle-loading-03': {
    text: 'Holujesz przyczepę kempingową i twoje zwykłe lusterka nie pokazują drogi za nią. Co powinieneś zrobić?',
    options: {
      A: 'Polegać wyłącznie na lusterku po stronie pasażera',
      B: 'Zamontować odpowiednie lusterka do holowania przed wyjazdem',
      C: 'Poprosić pasażera, by obserwował drogę za tobą',
      D: 'Jechać bliżej osi jezdni, aby wyjrzeć zza przyczepy',
    },
    explanation:
      'Potrzebujesz wystarczającego widoku drogi z tyłu po obu stronach, a przyczepa kempingowa jest zwykle szersza od samochodu. Poszerzone lusterka przywracają ten widok bez zmiany twojego toru jazdy.',
  },
  'q-road-conditions-01': {
    text: 'W mroźny dzień układ kierowniczy nagle staje się bardzo lekki. Co to najprawdopodobniej oznacza?',
    options: {
      A: 'Spadło ciśnienie w jednej z opon',
      B: 'Awarii uległo wspomaganie kierownicy',
      C: 'Na nawierzchni jest lód',
      D: 'Zaraz zmieni się rodzaj nawierzchni',
    },
    explanation:
      'Lód odbiera opór, który normalnie czujesz na kierownicy, ponieważ opony niemal przestały się trzymać drogi. Zdejmij nogę z gazu i wykonuj każdy ruch maksymalnie łagodnie.',
  },
  'q-road-conditions-02': {
    text: 'Musisz przejechać przez odcinek zalany wodą. Jak powinieneś to zrobić?',
    options: {
      A: 'Jechać powoli na niskim biegu, utrzymując wysokie obroty, a po przejeździe sprawdzić hamulce',
      B: 'Przejechać jak najszybciej, tworząc falę dziobową',
      C: 'Zatrzymać się w połowie i sprawdzić głębokość',
      D: 'Przetoczyć się z wciśniętym sprzęgłem',
    },
    explanation:
      'Stałe obroty silnika nie dopuszczają wody do układu wydechowego, a hamulce wyjeżdżają z wody mokre, więc trzeba je osuszyć delikatnym naciskiem, zanim będziesz musiał na nich polegać.',
  },
  'q-road-conditions-03': {
    text: 'Przejeżdżasz przez odsłonięty most przy silnym bocznym wietrze. Na co powinieneś być przygotowany?',
    options: {
      A: 'Na utratę mocy silnika przy podmuchach',
      B: 'Na gwałtowne hamowanie pojazdów za tobą',
      C: 'Na to, że wiatr zepchnie cię wyłącznie w stronę pobocza',
      D: 'Na to, że rowerzyści i wysokie pojazdy zostaną zdmuchnięte w bok, na twój tor jazdy',
    },
    explanation:
      'Podmuch przesuwa lekkie i wysokie pojazdy znacznie bardziej niż samochód osobowy, więc zagrożenie tkwi w otoczeniu, a nie w twoim własnym prowadzeniu. Zostaw im dodatkowy zapas miejsca przy mijaniu.',
  },
  'q-signals-and-controls-01': {
    text: 'Kiedy należy sygnalizować zamiar manewru?',
    options: {
      A: 'Odpowiednio wcześnie, zawsze gdy pomoże to innym uczestnikom ruchu zrozumieć, co zamierzasz zrobić',
      B: 'Tylko wtedy, gdy tuż za tobą jedzie inny pojazd',
      C: 'Dopiero po rozpoczęciu manewru',
      D: 'Na każdym skrzyżowaniu, niezależnie od tego, czy skręcasz',
    },
    explanation:
      'Kierunkowskaz to informacja dla innych, a nie pozwolenie dla ciebie. Włączony za późno albo wtedy, gdy nikt go nie widzi, nie zmienia nic w bezpieczeństwie manewru.',
  },
  'q-signals-and-controls-02': {
    text: 'Kierowca z naprzeciwka mruga do ciebie światłami. Co to oznacza według Highway Code?',
    options: {
      A: 'Ustępuje ci pierwszeństwa i przepuszcza cię',
      B: 'Dziękuje ci',
      C: 'Informuje cię, że tam jest',
      D: 'Po twojej stronie drogi znajduje się zagrożenie',
    },
    explanation:
      'Mruganie światłami ma dokładnie to samo, jedyne znaczenie co klakson. Odczytanie go jako zaproszenia sprawia, że wjeżdżasz na skrzyżowanie w oparciu o cudzą ocenę sytuacji.',
  },
  'q-signals-and-controls-03': {
    text: 'Hamujesz gwałtownie i czujesz pulsowanie pedału pod stopą, gdy działa system ABS. Co powinieneś zrobić?',
    options: {
      A: 'Pompować pedałem w rytm pulsowania',
      B: 'Utrzymać mocny, ciągły nacisk na pedał, aż samochód dostatecznie zwolni',
      C: 'Puścić pedał i spróbować jeszcze raz',
      D: 'Wcisnąć sprzęgło i ominąć przeszkodę',
    },
    explanation:
      'Pulsowanie to system zwalniający i ponownie dociskający hamulce znacznie szybciej, niż zrobiłby to jakikolwiek kierowca. Puszczenie pedału tylko przerywa ten cykl i wydłuża drogę hamowania.',
  },
  'q-other-road-users-01': {
    text: 'Autobus stojący na przystanku przed tobą sygnalizuje zamiar włączenia się do ruchu. Co powinieneś zrobić?',
    options: {
      A: 'Przyspieszyć, by minąć go, zanim ruszy',
      B: 'Użyć klaksonu, by wymusić pierwszeństwo',
      C: 'Zjechać w prawo i minąć go tuż obok',
      D: 'Ustąpić mu pierwszeństwa, jeśli możesz zrobić to bezpiecznie',
    },
    explanation:
      'Autobusy zatrzymują się bez przerwy i z trudem wracają do ciągłego potoku ruchu, więc przepuszczenie jednego kosztuje cię kilka sekund i utrzymuje w ruchu całą linię.',
  },
  'q-other-road-users-02': {
    text: 'Długa ciężarówka przed tobą sygnalizuje skręt w lewo, ale odbiła w stronę środka jezdni. Dlaczego?',
    options: {
      A: 'Kierowca włączył kierunkowskaz przez pomyłkę',
      B: 'Kierowca zaprasza cię do wyprzedzenia go lewą stroną',
      C: 'Potrzebuje dodatkowej szerokości, by pokonać zakręt, więc musisz zostać z tyłu i nie wyprzedzać go z lewej strony',
      D: 'Zaraz się zatrzyma, aby rozładować towar',
    },
    explanation:
      'Tylne koła długiego pojazdu poruszają się po torze węższym niż przednie, więc luka otwierająca się po lewej stronie zamyka się z powrotem podczas skrętu.',
  },
  'q-other-road-users-03': {
    text: 'Jesteś na rondzie, a długi pojazd na lewym pasie sygnalizuje, że jedzie dalej w prawo. Co powinieneś zrobić?',
    options: {
      A: 'Wyprzedzić go z prawej strony, zanim zmieni tor jazdy',
      B: 'Zostać z tyłu i dać mu miejsce, bo może potrzebować obu pasów, aby pokonać rondo',
      C: 'Jechać równo obok niego, żeby kierowca cię widział',
      D: 'Użyć klaksonu, by przypomnieć kierowcy o właściwym pasie',
    },
    explanation:
      'Długi pojazd często musi zająć oba pasy na rondzie ze względu na sposób, w jaki wychyla się naczepa, a samochód obok znajduje się dokładnie tam, gdzie kierowca go nie widzi.',
  },
};

/* -------------------------------------------------------------------------- */
/* Bundle                                                                      */
/* -------------------------------------------------------------------------- */

export const DEMO_BUNDLE: ContentBundle = {
  country: UNITED_KINGDOM,
  topics: TOPICS,
  questions: QUESTIONS,
  translations: {
    es: ES_TRANSLATIONS,
    pl: PL_TRANSLATIONS,
    // Remaining locales are served from the backend translation pipeline.
    ur: {},
    pa: {},
    hi: {},
    'es-419': {},
    pt: {},
    'pt-BR': {},
    ar: {},
  },
  versionHash: 'demo-uk-2026-01',
};
