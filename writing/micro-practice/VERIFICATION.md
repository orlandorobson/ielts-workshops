# Verification — 24 November 2026

## Automated checks

`node --experimental-default-type=module writing/micro-practice/checks.mjs` passes:
all nine activity schemas, original ten spelling keys, exact supplied figures,
every reachable binary/three-option shuffle permutation, immutable source option
arrays, bank/gap counts, accepted punctuation alternatives and word counting.
`git diff --check` and JavaScript syntax checks pass.

## Browser checks

- Mobile viewports: 375px and 320px wide; desktop viewport: 1280px wide. The landing page,
  source tables, choices and inline dropdowns have no horizontal overflow.
  Mobile choice buttons exceed 60px; bank/gap targets are at least 48px and
  punctuation menus at least 44px. Desktop landing cards form two columns.
- Completed all nine activities, all authored choice questions, both cohesion
  texts, both punctuation paragraphs and the three extra spelling questions.
- A deliberate agreement error gave 9/10, a deliberate overview error gave 3/4,
  and a deliberate punctuation error gave 15/16. Corrective feedback was specific
  and supportive. Original spelling, complete verbs, prepositions and number
  agreement scored 10/10 with the authored correct answers.
- Retried agreement for 10/10: the first 9/10 score remained visible and saved.
  Reloaded mid-question after answering: the question, locked choices and
  corrective feedback resumed. Rules were absent on the retry recognition screen.
- All nine completion badges and first-round scores survived reloading the
  landing page. Writing completion is explicitly labelled self-reviewed.
- Cohesion: mobile tap-to-select/place, returning a filled word, reusing it,
  keyboard Enter selection/placement, incomplete-answer guard, both corrected
  paragraphs and 10/10 scoring passed. Native desktop drag-and-drop in Brave
  successfully placed “followed by” in gap 2. Touch pointer handlers supplement
  native HTML dragging; touch hardware itself was not available for testing.
- Punctuation: continuous paragraphs with inline menus; incomplete-answer guard;
  supplied capitals in paragraph 1; capital selections in paragraph 2. Omitting
  the optional comma before while was accepted. Menus lock after checking. A final retry also verified updated accepted-answer labels and paragraph progress.
- Writing: empty, 7-word and 44-word drafts exercised the empty/length guards and
  valid-range review. All checklist items are required; completion and “Write
  again” worked. First submitted word count remained 7 after revision. No
  automatic language score is claimed and the response text is not persisted.
- Source display uses exactly 51%, 29%, 15% and the reported overlap labels
  21%, 13%, 6%, 6%. No additional or exclusive audiences are calculated.

All changes are confined to `writing/micro-practice/`.
