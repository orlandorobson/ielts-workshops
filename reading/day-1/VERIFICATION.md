# Reading Day 1 — local implementation and verification

Date: 27 September 2026. Original build verification; see `ANSWER-AUDIT.md` for the approved pre-publication audit and final answer-order changes.

## Preview

- Student: http://localhost:8000/reading/day-1/
- Teacher guide: http://localhost:8000/reading/day-1/teacher-control/

The preview server is bound to this computer's loopback address. These URLs do not expose the lesson to classroom phones on the network.

## What was built

27 navigable steps containing all seven activities, with 16 verbatim passage paragraphs. The source DOCX remains unchanged. The complete source extraction, including teacher/implementation notes, is retained in `content.js`; the student UI presents the relevant material at its intended point rather than displaying the source as a worksheet.

| Steps | Activity | Learning experience |
| --- | --- | --- |
| 1 | Orientation | Topic and writer's job; freely available navigation |
| 2–3 | Flexible Working | Visible contrast, concept check, heading |
| 4–5 | Urban Trees | Building pattern, optional vocabulary checks, heading |
| 6–8 | Large Language Model | Order signals, vocabulary matching, reading |
| 9–11 | Curitiba | Signal matching, two headings, paragraph maps and true-detail principle |
| 12–13 | Mohammed from Sohar | Both paragraphs, shared topic checks, different jobs and qualifications |
| 14–22 | Bedouin life | Title, geography, nomadic/settled context, four paragraphs, maps, three repair tools and synthesis |
| 23–26 | You Are What You Eat—Or Are You? | Title predictions, five headings, learner-built argument maps, qualification |
| 27 | Reflection | Transfer to the next reading; optional saved note |

## Reuse and implementation decisions

- Reuses `shared/css/base.css`: colour variables, typography foundations, focus treatment and responsive type conventions.
- Follows Speaking's step-by-step flow, Back/Continue controls, local progress, defensive storage handling, native labelled inputs and reveal patterns.
- Follows Listening's workshop sidebar, optional support, ordinary classroom language and separation of source content from the renderer.
- Reading has its own responsive layout and interaction controller; shared workshop files were not changed.
- No release/access gate. The source requires free progression and does not specify release units or teacher codes. Checking and navigation remain available. The conventional `teacher-control/` route contains a teacher guide with source notes and keys, not a remote control panel.
- Progress means steps visited, not a mastery score or proof of completion. Students can move through blanks and return later.
- Local storage key: `ielts-reading-day-1-v1`. Answers, checks, reveals, current paragraph, notes and current step persist. Invalid state is sanitised; failed storage falls back to the current page's memory.
- Matching uses labelled native selection controls. There is no drag-only action.
- Source-labelled “likely” keys for Curitiba and Food appear as suggested answers, with explanations and distractor reasoning. Source keys and heading wording were preserved. Four later option wording edits are documented in `ANSWER-AUDIT.md`.
- Added explanatory feedback and later function-identification questions are teaching adaptations grounded in the source maps. Optional free-text maps are not graded or format-validated.
- The source teaches removing embedded material before nominalisation and passive repair. That teaching order is retained. The final three-tool summary uses the requested order: unpack the noun, remove the middle, turn the passive around.
- Full original sentences remain available. “Remove the middle” hides only the embedded phrase and restores it on a second click. Passive reconstruction of “younger generations” explicitly draws on the surrounding context.
- No formal Seven Dimensions lesson, external services, paid services, fonts, or new runtime dependencies.

## Responsive behaviour

Laptops show a persistent workshop sidebar and adjacent paragraph/task columns. The passage stays nearby while the reader works through heading options. All passages can also be opened in full.

At phone widths (760px and below), the workshop menu collapses. Long paragraph tasks use a sticky “Read paragraph / Choose heading” switch, with the chosen paragraph retained. It changes panes in place and returns the pane switch into view, avoiding a scroll back through the full passage. Paragraph letters and explicit next/previous-paragraph buttons provide both direct and sequential access. Reading text stays at a comfortable size; controls have at least 46px height and require no hover.

Early short readings stack naturally on phones. Maps wrap; vocabulary pairs become a single column. Desktop navigation reopens when the viewport crosses back above the mobile breakpoint.

## Verification completed

1. `tests/content.py` reads the DOCX independently and verifies the complete extraction, all 16 original passage paragraphs, heading wording, all 32 source concept/vocabulary questions and their marked answers, both vocabulary-pair sets, every supplied paragraph map and the complete heading key.
2. `tests/browser.cjs` exercised all 27 steps with no answers at widths 320, 360, 390, 768, 1280 and 1440px. Continue remained available and no normal-content horizontal overflow occurred.
3. All source questions were tested with wrong and correct choices, including the multi-select geography question. All heading answers were checked against the source and their explanatory feedback was verified. Blank checking now gives a hint; explicit answer help remains available.
4. All rendered passage paragraphs were compared with the extracted source. Mohammed precedes Bedouin.
5. Optional vocabulary help opens and closes. LLM matching works through native selection without dragging.
6. Bedouin middle removal/restoration, all four noun-phrase unpacking examples, the ten word-form reveals, and both passive examples were checked.
7. The final argument maps remain concealed until requested; all five can be revealed. Learner maps persist through reload.
8. Phone paragraph/task switching was exercised across all four Bedouin paragraphs at 360 and 390px. Both panes stay available and headings retain their answers.
9. Keyboard radio selection, keyboard checking, Continue, and focus on the new main content were checked.
10. Saved responses/checks survive reload. Malformed JSON and malformed state recover. A separate browser context with completely blocked local storage completed all 27 steps.
11. The teacher guide loads all seven activity sections and final source guidance. No page/runtime errors or failed HTTP requests occurred.
12. Screenshots of the opening, desktop reading, phone reading/heading comparison and noun repair were visually inspected. A breakpoint-resize navigation issue was fixed and the full browser suite passed again.
13. JavaScript syntax checks, Python content checks, and `git diff --check` passed. Repository status outside Reading matches the initial status; existing unrelated untracked Listening files were left alone.

## Files created

All implementation files are under `reading/day-1/`:

- `index.html` — student shell
- `content.js` — source, passages, question data, maps, answer keys and feedback
- `day-1.js` — 27-step renderer, interactions, navigation and local state
- `day-1.css` — Reading layout and responsive comparison behaviour
- `teacher-control/index.html` — teacher guide shell
- `teacher-control/teacher-guide.js` — source teaching notes, keys and explanation
- `tests/content.py` — independent DOCX fidelity check
- `tests/browser.cjs` — browser progression, answer, responsive and recovery checks
- `answer-order.js` — balanced display orders and persistent country shuffle
- `icon.svg` — local student/teacher tab icon
- `tests/answer-order.mjs` — complete positional audit and country-order checks
- `ANSWER-AUDIT.md` — final audit and publication verification procedure
- `VERIFICATION.md` — this handover

No existing tracked file or source document was edited. No global homepage link was added.

## Running checks again

Start a static server from the repository root (`python3 -m http.server 8000 --bind 127.0.0.1`). Run:

```sh
python3 reading/day-1/tests/content.py
node reading/day-1/tests/answer-order.mjs
node --check reading/day-1/day-1.js
node --check reading/day-1/teacher-control/teacher-guide.js
node reading/day-1/tests/browser.cjs
```

The browser check uses the existing Playwright installation and Chrome, not a project-installed dependency. If necessary, point `NODE_PATH` at the available runtime's `node_modules`. `READING_PREVIEW_URL` can override the default loopback URL. Screenshots are temporary QA files in `/tmp`.

## Remaining limits

Browser testing used desktop Chrome with representative phone viewport sizes. A physical iOS/Android device and screen-reader session have not been tested. Classroom pacing and the length of the Bedouin section still merit teacher observation with real learners. The content source itself labels some headings as likely rather than uniquely determined; this nuance is retained in feedback. No implementation blocker was found.
