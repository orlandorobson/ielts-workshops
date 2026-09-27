# Reading Day 1 — final answer-position and predictability audit

27 September 2026. Publication target: https://orlandorobson.github.io/ielts-workshops/reading/day-1/

## Scope

Audited every unique answer-bearing control: 61 single-choice questions, one eight-country multi-select, and 13 matching rows (75 total). Repeated optional vocabulary questions on different screens count once because they share answers and display order. This includes all original concept/vocabulary checks, heading sets, five True/False context checks, and eleven later function-identification checks. Reveals and free-text maps were inspected for accidental disclosure but are not scored positional choices.

## Position changes

Ordinary choices use deliberately balanced, fixed display orders. The three-option questions previously put four of six correct choices second and none third. The binary questions previously favoured first position 18 to 15. The longer heading and function lists also clustered answers towards their beginning.

| Choice count | Correct-answer counts by displayed position, before | After |
| --- | --- | --- |
| 2 (33 questions) | 18, 15 | 16, 17 |
| 3 (6 questions) | 2, 4, 0 | 2, 2, 2 |
| 6 (13 questions) | 3, 3, 3, 1, 2, 1 | 2, 2, 2, 2, 3, 2 |
| 8 (4 Bedouin headings) | positions 1, 2, 4, 8 | positions 2, 5, 7, 8 |
| 9 (5 Food headings) | positions 1, 2, 3, 5, 7 | positions 1, 3, 6, 8, 9 |

The binary sequence has no run of four identical positions, no five-answer alternating run, and no repeated six-answer segment. The longer heading sets necessarily have unused positions, since there are more options than paragraphs; their correct positions now span each pool rather than favouring the beginning.

Matching definition pools formerly ran in the exact reverse of vocabulary/signal order. Their new correct positions in unchanged item order are:

- LLM, nine rows: 4, 8, 1, 5, 3, 9, 6, 2, 7.
- Curitiba signals, four rows: 3, 1, 4, 2.

All rows in a matching activity share one stable pool, and all paragraphs in a heading activity share one stable heading order. Students do not have to relearn option positions between paragraphs.

## Country list

The six correct countries remain Saudi Arabia, Yemen, Oman, United Arab Emirates, Qatar and Kuwait; the distractors remain Jordan and Lebanon.

On first use, the list is shuffled using the existing shared randomisation helper. The two distractors are separated, a contiguous six-correct block is excluded, and source/reverse-source and alphabetical/reverse-alphabetical sequences among the correct countries are rejected. Either endpoint, and every other slot, can contain a distractor: the rule does not accidentally make the first or last option always correct.

The order is saved in the existing day-specific state and reused on revisit/reload. Old source-ordered drafts receive one mixed display order while retaining every selected country and checked result. Invalid stored order is repaired without changing selected values. Random generation has a bounded fallback, so it cannot block progress. With unavailable storage, the order stays stable for the current open page, like the rest of the workshop state.

## Stable answers and feedback

`answer-order.js` changes displayed option IDs, never canonical answer values. Existing numeric values remain attached to the same meanings, including the original matching values. The storage key remains `ielts-reading-day-1-v1`; there is no reset or destructive migration.

Heading letters are assigned by displayed position. Feedback now names headings by their complete wording instead of obsolete source letters. The teacher guide displays the new letters and heading wording; original source notes are explicitly labelled as using DOCX letters.

No answer explanation is visible automatically on a new attempt. Checking without an answer gives a neutral prompt, not the key. A separately labelled “Show answer and explanation” button allows intentional help without creating a progression gate. Restoring an already checked answer also restores its explanation. Reading maps and matching keys remain explicit learner-requested reveals; early teaching scaffolds are intentionally visible.

## Targeted wording changes

The source extraction and all passage/heading texts remain intact. Four option edits are recorded, with originals and reasons, in `content.js`:

1. **Mohammed, Paragraph B (q194):** expanded the Paragraph A distractor to ask why online communication gave Mohammed control and made interaction less demanding. This remains a plausible description of A, while matching the length and form of the B answer.
2. **Peninsula versus island (q224):** extended the island distractor with “with no connection to a larger area of land”. Its meaning is unchanged, and the two options now use parallel clauses.
3. **“They” reference (q314):** changed the short distractor “The advantages” to “The advantages listed in this sentence”. Both candidates now identify their textual location with similar specificity.
4. **Final Food check (q429):** reduced the correct option to “No”, matching “Yes”; retained the explanation in feedback. A whole explanatory sentence can no longer identify the answer by length.

Also changed the LLM task screen title from “How an LLM Produces a Response” to **“Large Language Model”**, so it no longer repeats the correct heading before the student reads. The source title remains in the source record and teacher material.

No other distractors were rewritten. The optional simple-word checks intentionally use concrete, easy contrasts; making those harder would defeat the source's vocabulary-support rule. The heading distractors already make plausible distinctions between a true detail, a topic, and the whole paragraph's function. The source's four-True/one-False context facts remain unchanged; only their displayed choice positions vary. Their purpose is contextual preparation, not a balanced factual exam. Grammatical forms and registers were checked, and the retained options do not present a systematic “longest answer wins” rule (15 of 61 single-choice keys are uniquely longest).

## Meaningful order preserved

All seven activities, all 27 steps, paragraph order, vocabulary-item order, chronology, discourse maps, argument structure, and FIRST → THEN → NEXT → AFTER remain unchanged. Mohammed precedes Bedouin. The Bedouin title/context, remove-the-middle, unpack-the-noun, passive repair and final three-tool summary remain complete. Only unordered answer choices and definition pools were reordered.

## Verification

- `tests/content.py`: independently checked the DOCX extraction, 16 passage paragraphs, headings, source keys, maps and vocabulary; the four option adaptations are explicitly allowlisted and checked against their original wording.
- `tests/answer-order.mjs`: covers all 61 single-choice controls and both matching pools; checks exact permutations and position distributions; tests 5,000 reproducible country shuffles, every slot's ability to contain a distractor, stable stored ordering, and malformed-order recovery.
- `tests/browser.cjs`: runs all 27 steps at 320, 360, 390, 768, 1280 and 1440px; checks actual rendered option values and heading letters, every source/heading/context/argument key, both matching pools, blank/wrong/correct answers, explicit explanation access, old v1 state, country order persistence, unavailable/corrupt storage, keyboard focus, optional vocabulary, all Bedouin repairs, all seven activities, and responsive navigation.
- Browser checks capture both page errors and error-level console messages, as well as failed resource requests. The stricter console check found a missing tab-icon request; a local Reading icon was added for student and teacher pages.
- Phone country options and phone/laptop reading layouts were visually inspected.
- Publication is restricted to `reading/day-1/`; unrelated pre-existing Listening files remain unstaged. No shared file changes or new dependencies are needed.

The local suite must pass before commit/push. After GitHub Pages reports a successful build for that commit, the same browser suite is run against the live student URL. The exact commit and deployment result are reported in the task handover. Physical-device and assistive-technology testing remain outside the browser-emulation checks.
