# Reading Day 1 continuation — local review

Implemented and verified 28 September 2026. Local only: no commit, push or publication.

## Scope and files

Added:
- `continuation-content.js`: approved EV and Digital Football content, source extraction, keys, evidence and support.
- `continuation.js`: fourteen screens, eight whole-task forms, progressive support and saved pane positions.
- `continuation.css`: scoped desktop/mobile layout.
- `continuation-teacher.js`: teacher keys, rationale and implementation notes.
- `tests/continuation-content.py`: independent COMPLETE DOCX fidelity checks.
- `tests/continuation-browser.cjs`: targeted browser verification.
- This verification record.

Updated:
- `day-1.js`: inserts the continuation, connects its state and migrates original saved screen indices.
- `index.html`: loads the scoped stylesheet and updates the progress total/description.
- `teacher-control/teacher-guide.js`: adds the continuation and updates Food's step range.
- `tests/browser.cjs`: accommodates 41 screens and reload-time save behavior while retaining earlier lesson checks.
- `tests/content.py`: explicitly selects the original source now that two source documents exist.

The supplied COMPLETE DOCX is used as input, not edited. Earlier teaching content, original answer ordering, source documents and unrelated workshop files remain untouched.

## Sequence

The original screens 1–22 remain in place, including Mohammed before Bedouin and all unfinished Bedouin support. The continuation adds:

| Step | Screen |
| --- | --- |
| 23 | EV: complete text and optional vocabulary |
| 24 | Three paragraph summaries |
| 25 | Progressively unpack Task 1A Question 1 |
| 26 | Question 2: revisit summary and follow the environmental reasoning |
| 27 | Task 1A: four paragraph matches |
| 28 | Five stakeholder positions |
| 29 | Task 1B: six group matches |
| 30 | Digital Football: complete text and optional vocabulary |
| 31 | Five paragraph summaries |
| 32 | Identify dense language, try simpler meaning, then compare |
| 33 | Small meaning words and reading-repair reminders |
| 34 | Task 2A: five paragraph matches |
| 35 | Retrieve five stakeholder positions |
| 36 | Task 2B: six viewpoint matches |

Existing Food work follows at steps 37–40; the original closing reflection is step 41.

EV explicitly models phrase meaning and its connection to the passage, then shows the short environmental reasoning chain. Football asks students to identify difficult phrases or try a simpler sentence before opening support. Its stakeholder activity uses incomplete statements and short text entry rather than EV's complete matching summaries. No Seven Dimensions framework is introduced.

## Checking, help and layout

Each of the eight complete tasks has exactly one **Check answers** button after its final item. All items must have an attempt before feedback opens; matching and retrieval offer **Not sure yet**. Incorrect answers never prevent Continue. Editing an answer hides the previous whole-task result until the student checks again. Evidence controls appear only after checking.

All 25 vocabulary explanations are optional tap/click help. Progressive worked examples are optional; unmet support prompts never block navigation. Matching letters can be reused.

Desktop uses adjacent, independently scrollable passage/question panels. Mobile uses **Read passage** and **Questions & support** buttons, with separate remembered scroll positions. Selections, retrieval text, notes, revealed worked stages, active pane and reading positions survive reload. Names remain available in matching choices and optional reference help. Controls work by keyboard or tap; no hover/drag dependency.

Existing saved answers and notes retain their identifiers. Original saved steps 22–26 (zero-based) migrate forward by fourteen; earlier Bedouin locations remain unchanged. Migration runs once. Blocked storage still permits the full lesson.

## Keys checked against COMPLETE

| Task | Key |
| --- | --- |
| EV summaries | B, A, C |
| EV Task 1A | C, A, B, A |
| EV stakeholders | Researchers: direct cleaner urban air; analysts: electricity generation; manufacturers: lower running costs; drivers: practical/cost experience varies; planners: charging access |
| EV Task 1B | A, B, C, D, D, E |
| Football summaries | B, A, A, B, C |
| Football Task 2A | B, E, C, A, D |
| Football stakeholder retrieval | expand; improvement/progress; tactics/tactical systems; commercial/marketing; physical |
| Football Task 2B | B, E, D, A, C, A |

Original approved summary option wording/order and source matching letters are retained. EV's stakeholder-summary menu uses a mixed fixed order. Answer identity is independent of displayed position.

## Verification results

All passed:
- `python3 reading/day-1/tests/continuation-content.py`: eight verbatim paragraphs, eight summary questions, 21 original IELTS-style questions, all 39 answers, stakeholder prompts, repair examples and 25 vocabulary pairs.
- `python3 reading/day-1/tests/content.py`: original sixteen passage paragraphs, headings, vocabulary, maps and 32 source questions remain consistent with the original DOCX and previously documented adaptations.
- `node reading/day-1/tests/continuation-browser.cjs`: fourteen stages, eight complete tasks, correct/wrong/blank/retry behavior, evidence after checking, repeated letters, accepted retrieval equivalents, progressive support, vocabulary, saved/recovered state, old progress migration, mobile pane positions through switching/reload, keyboard and blocked storage.
- `node reading/day-1/tests/browser.cjs`: full 41-screen navigation and preserved earlier activities, all original concept/heading keys, Bedouin repair tools, country option persistence, matching, maps, mobile comparison and teacher guide.
- Both browser suites checked widths 1440, 1280, 768, 390, 360 and 320 pixels. No horizontal page overflow, progression bottlenecks, browser console/runtime errors or failed HTTP responses were detected.
- Laptop and 360/390-pixel phone screenshots were inspected for readable layout and usable controls. Browser checks used Chrome with mobile viewport sizes, not physical phones.
- `git diff --check`: passed.

Both DOCX hashes are unchanged:
- COMPLETE: `423783f50a336db906741ffa1335a944d8f0e8eb2285e1755eb325449ea04e93`
- Original: `c999e084c86cd5c647a5b71f864a3cd970ff2473f3da237557454aaa7c07598b`

## Review decisions and limitations

No substantive answer-key conflict was found. The earlier source note saying Football would be adapted next is superseded by the COMPLETE document's later Football section and the current brief.

The existing Food activity is preserved after the new continuation. No earlier teaching material was redesigned.

Free-text stakeholder checking recognises the approved answers plus straightforward equivalents. It cannot recognise every valid paraphrase; unmatched wording receives a neutral comparison prompt and the source model, not an assertion that it is wrong. This is a review point for classroom use.

Whole-task checking requires attempts, but Continue always remains available. A student can leave any task unfinished and return later.

## Preview

- Student: http://localhost:8000/reading/day-1/
- Teacher control: http://localhost:8000/reading/day-1/teacher-control/

Use the workshop menu to jump to Electric Vehicles or Digital Football. Stop here for user review; do not commit, push or publish this pass.
