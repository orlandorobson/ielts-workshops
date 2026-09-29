# Ferrari and Amouage — local implementation review

29 September 2026. Local build only. No commit, push or publication.

## Exact files changed

Modified:
- `reading/day-1/day-1.js` — appends the new screens and menu entries, connects saved state and keeps Continue available after the old closing reflection. Only that reflection's navigation sentence changes; earlier teaching content and screen positions are preserved.
- `reading/day-1/index.html` — loads the small scoped stylesheet; progress total becomes 49.
- `reading/day-1/teacher-control/teacher-guide.js` — appends Ferrari and Amouage guidance after Food.
- `reading/day-1/tests/browser.cjs` — updates screen/menu/teacher totals; waits for the responsive menu's resize event before asserting its state.
- `reading/day-1/tests/continuation-browser.cjs` — updates only screen and teacher totals.

Added:
- `reading/day-1/luxury-content.js` — eight verbatim source paragraphs, tasks, keys, evidence, Ferrari progression and the five approved prompt revisions.
- `reading/day-1/luxury.js` — eight stages, six whole-task forms, strict completion marking, Ferrari nuance controls and saved pane/input state.
- `reading/day-1/luxury.css` — narrowly scoped additions to the existing comparison layout.
- `reading/day-1/luxury-teacher.js` — ordered stage guidance, keys, evidence and approved revision notes.
- `reading/day-1/tests/luxury-content.py` — independent source/override/key verification.
- `reading/day-1/tests/luxury-browser.cjs` — new-stage browser tests and original sequence comparison.
- `reading/day-1/FERRARI-AMOUAGE-ANSWER-AUDIT.md` — approved specification amendments and item-by-item evidence/competing-answer review.
- `reading/day-1/FERRARI-AMOUAGE-VERIFICATION.md` — this record.

The user-supplied `reading/day-1/source/IELTS_Reading_Workshop_CONTINUATION_Ferrari_Amouage.docx` was already present and untracked before implementation. It is read as input and linked from the teacher guide; it was not created, modified, renamed or deleted by this pass. No other DOCX or unrelated workshop file was changed.

## Exact final sequence

All 41 previously live student screens retain their indices, titles and order. Eight new screens are appended, making 49 total.

| Steps | Content |
| --- | --- |
| 37–40 | Existing Food orientation, sustained argument, argument shape and small-word limits |
| 41 | Existing “Take it into your next reading” reflection |
| 42 | Ferrari: full three-paragraph text and three easy summaries |
| 43 | Ferrari: nuance experiment |
| 44 | Ferrari: bridge from cars to perfume |
| 45 | Amouage: full revised five-paragraph passage and five-item scan |
| 46 | Amouage: five A2 paragraph summaries |
| 47 | Amouage Task 1: five TRUE / FALSE / NOT GIVEN items |
| 48 | Amouage Task 2: six sentence completions, numbered 6–11 |
| 49 | Amouage Task 3: four matching endings, numbered 12–15, with endings A–G |

Food remains before Ferrari; Ferrari flows directly into Amouage. Bedouin, EV and Digital Football are not moved. No old activity number is changed. The old reflection stays where it was; its navigation sentence now points forward to the appended material. The last new task identifies the end of this continuation, with the workshop menu available for revisiting.

## Ferrari

The full demanding text is paired with deliberately simple summaries and one check at the end of all three. The nuance screen shows one of the four approved claims at a time. Previous/Next controls let students remove and restore qualifications. An optional note persists; the final optional comparison explains how a partly true account became an exaggerated generalisation. This is a conceptual observation, not a scored grammar task.

The bridge asks whether a perfume must appeal to everyone. Optional tap/click support introduces unusual composition, craftsmanship, time, cultural identity and selective appeal. Neither notes nor support gates Continue.

## Amouage and checking

The scan screen presents the whole revised passage and asks students to find facts without understanding every sentence. The next screen makes the A2 summaries a student task, not teacher notes. The three IELTS tasks then occupy separate screens.

Each of the six complete sets has exactly one Check answers button after its final item. Blank/incomplete sets receive a neutral prompt to finish attempts. Text/select items offer Not sure yet. Continue remains available regardless of correctness or optional support. Editing an answer hides the previous result until the full set is checked again. Evidence and reasoning are optional after checking, never shown before an attempt.

The five approved amendments are applied exactly as recorded in the answer audit. Completion items 6, 7 and 10 require their two-word lexical units. The task-wide two-word limit is displayed and enforced; answers exceeding it do not score. Item 11 now retrieves individuality from Paragraph E. Scan 3 retrieves frankincense from the statement about numerous compositions.

T/F/NG feedback distinguishes contradiction from absence. For item 4, it explicitly explains that the passage does not specify where all frankincense is obtained; outside knowledge cannot supply that missing information. Matching preserves every approved ending and distractor; selected long endings also appear as wrapping text below the control.

## Answer audit

No unresolved competing answer was found after the approved amendments. See `FERRARI-AMOUAGE-ANSWER-AUDIT.md` for all 28 evidence paths and reasons competing answers fail.

| Set | Keys |
| --- | --- |
| Ferrari summaries | B, C, B |
| Amouage scan | 1983; Muscat; frankincense; fourteen weeks; six months |
| Amouage A2 summaries | A, B, C, A, B |
| T/F/NG | FALSE, TRUE, FALSE, NOT GIVEN, FALSE |
| Sentence completion 6–11 | discerning clientele; creative identity; mature; fourteen weeks; perfume culture; individuality |
| Matching endings 12–15 | B, F, A, D |

No semantic alternatives were added to repair ambiguous questions. The browser tests reject myrrh, clientele, identity, culture, place and Oman in the corrected fields. Scan durations allow numerical formatting of the same answer. Sentence completion uses the source words, including fourteen weeks. Case/spacing and final sentence punctuation are normalised.

## Layout, accessibility and state

Laptop uses the established passage/question columns with independent scroll positions and paragraph jump buttons. Mobile uses the established Read passage / Questions & support switch. Both reading positions, active pane and answers survive switching and reload. Matching endings are available in an expandable reference list as well as the choices. Native radios, selects, text fields and buttons support keyboard and touch. No essential hover, dragging or mouse precision is required.

Existing saved progress stays at the same screen; the previous legacy migration remains intact. New answers, checked results, notes, nuance version and pane positions live under the existing storage record. Invalid nested state recovers, and blocked storage does not prevent completion while the page remains open.

Teacher control retains its existing architecture. Two sections after Food show Ferrari steps 42–44 and Amouage steps 45–49, with all keys, expandable evidence and the five approved prompt corrections. It remains the existing teacher guide, not a new remote release system.

## Tests

Final result: all three source checks and all three browser suites passed. No runtime/console errors, failed HTTP requests, horizontal page overflow or progression bottlenecks were detected. `git diff --check` also passed.

- Source fidelity: all eight new paragraphs, original choices and endings, all 28 keys, five approved overrides, source evidence and strict completion answers.
- Existing source checks: original Day 1 and EV/Digital Football content remain consistent with their respective source documents.
- New browser checks: six complete tasks; correct/wrong/blank/retry marking; rejected alternatives; word limit; saved results; Ferrari nuance/bridge; all 41 original screen titles and positions; mobile reading-position recovery; keyboard; corrupt/blocked storage; teacher order and revisions.
- Existing browser checks: full workshop progression plus original activities and EV/Digital Football regression coverage.
- Widths: 1440, 1280, 768, 390, 360 and 320 pixels. Laptop and phone screenshots inspected. These are desktop Chrome viewport tests, not tests on physical mobile devices.
- Browser tests capture runtime/console errors and failed HTTP responses. The first original-suite run exposed a timing issue in its resize assertion; the test now waits for the menu's responsive update.

Source hashes:
- Ferrari/Amouage: `c9a575228528acc942d130d43abc979ddd0ae5b5248e769c7ccd29f50317d36f`
- Original Day 1: `c999e084c86cd5c647a5b71f864a3cd970ff2473f3da237557454aaa7c07598b`
- EV/Digital Football: `423783f50a336db906741ffa1335a944d8f0e8eb2285e1755eb325449ea04e93`

## Review links

Student: http://localhost:8000/reading/day-1/

Teacher: http://localhost:8000/reading/day-1/teacher-control/

Use the workshop menu to open Ferrari or Amouage. No publication action is authorised for this pass; stop for review.
