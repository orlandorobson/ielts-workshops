# Reading structure and shared workspace verification

2026-10-24. Local implementation only; not committed, pushed or published. This report supersedes the step-48-only scope in WORKSPACE-PROTOTYPE.md.

## Files changed in this structural pass

- `day-1.js`: Food reorder, task dropdown data/handler, fresh workshop storage key, continuous former explorers, passage association for original screens, shared workspace integration, exact reflection wording replacement.
- `index.html`: compact labelled Reading task dropdown in the existing header.
- `continuation.js`: shared workspace scroll/view integration; removed paragraph-jump controls; placed existing vocabulary support in QUESTIONS.
- `luxury.js`: shared workspace integration; removed paragraph-jump controls; exact final-task wording replacement. Ferrari's four-version experiment is unchanged.
- `workspace-prototype.js`: generalised the approved prototype into shared behaviour; reused session font setting; added shared per-screen view and scroll state.
- `workspace-prototype.css`: retained exact approved pane ratios, breakpoints, pane padding, passage fonts and viewport-height layout; added compact dropdown styling and paragraph-question section spacing.
- `tests/reading-structure.cjs`: new full navigation, passage, explorer, checking, saving, support and benchmark suite.
- `tests/reading-workspace-mobile.cjs`: new complete-task checking tests in portrait and short landscape.
- `tests/content.py`: recognises the previously approved exact Arabian Peninsula instruction while continuing to verify its original source answers/options.
- `tests/luxury-content.py`: retains immutable-data checks; stops treating intentional renderer changes as content changes. Original content is verified by content.py and renderer behaviour by the new browser tests.
- This report.

The six earlier approved instruction edits remain intact. `content.js`, `continuation-content.js` and `luxury-content.js` were not changed in this pass and were compared byte-for-byte with pre-pass copies. The sidebar removal in day-1.css predates this pass and remains intact. Unrelated repository files were left alone.

## Final Reading-task order and ranges

Introduction remains step 1. Reflection remains step 41, between Digital Football and Ferrari, in sequential navigation only.

| Dropdown order | Reading task | Steps |
|---|---|---|
| 1 | Flexible Working | 2–3 |
| 2 | Urban Trees | 4–5 |
| 3 | Large Language Model | 6–8 |
| 4 | Curitiba | 9–11 |
| 5 | Mohammed from Sohar | 12–13 |
| 6 | You Are What You Eat—Or Are You? | 14–17 |
| 7 | Bedouin life | 18–26 |
| 8 | Electric Vehicles | 27–33 |
| 9 | Digital Football | 34–40 |
| 10 | Ferrari | 42–44 |
| 11 | Amouage | 45–49 |

Food's four screens moved as one block from old steps 37–40 to 14–17. Their internal order and all content remain unchanged. Mohammed and all other activity names are unchanged.

## Screens using the shared Reading workspace (31)

| Steps | Screens |
|---|---|
| 3 | Flexible Working |
| 5 | Urban Trees |
| 8 | Large Language Model |
| 10–11 | Curitiba; True detail ≠ best heading |
| 13 | What is each paragraph doing? |
| 15–17 | Follow a sustained argument; Build the argument’s shape; Small words. Important limits. |
| 21–22 | Bedouin life · read and choose; Look beneath the paragraphs |
| 25 | Turn the passive around |
| 28–33 | First understand the paragraphs; Unpack the question before searching; Follow the environmental reasoning; Task 1A · Paragraph matching; Who says what about EVs?; Task 1B · Match the groups |
| 35–40 | What does each paragraph really say?; You do more of the unpacking; Small words can change the meaning; Task 2A · Find the information; Reconstruct who says what; Task 2B · Match the viewpoints |
| 42–43 | Ferrari, scarcity and the truth inside a myth; Are they still saying the same thing? |
| 45–49 | Amouage: When Not Appealing to Everyone Can Be the Point; Difficult language. An understandable idea.; Task 1 · TRUE / FALSE / NOT GIVEN; Task 2 · Sentence completion; Task 3 · Matching sentence endings |

Each has the complete corresponding passage, preserving paragraph wording/order and labels. Questions, feedback and existing learning support remain in QUESTIONS. Switching questions never changes the passage contents.

## Full-width screens retained (18)

| Steps | Purpose / reason |
|---|---|
| 1 | Introduction; no passage-dependent task |
| 2, 4, 6 | Standalone contrast/addition/process preparation using the supplied signals/examples |
| 7, 9 | Standalone vocabulary/signal matching preparation |
| 12 | Mohammed whole-passage reading before the analysis screen; no separate question activity |
| 14 | Food title orientation and predictions; no passage lookup required |
| 18–20 | Bedouin title, geographical/context and nomadic/settled preparation |
| 23 | Recover the main sentence: self-contained supplied sentence, removable middle and its two questions |
| 24 | Unpack the noun: self-contained word forms and supplied examples |
| 26 | Three-tool strategy synthesis |
| 27, 34 | Initial complete EV / Digital Football readings before their tasks |
| 41 | Reflection |
| 44 | Cars-to-perfume bridge and optional response, rather than a passage-dependent question set |

No empty workspace panes were created to accommodate these screens. The standalone sentence-repair activity still contains its entire supplied sentence; its intentional middle-removal learning control is preserved.

## Dropdown and saved-state handling

The native select is labelled exactly `Reading task` and contains exactly the 11 named options above. It resolves the first screen using the selected group and calls the existing `navigate(step)`. Back/Continue update its current selection. Introduction/reflection leave it without a selected task; no placeholder or extra option is added. Every task remains enabled. The sidebar remains absent.

The storage key changed from `ielts-reading-day-1-v1` to `ielts-reading-day-1-v2`. Existing v1 answers/visited positions are intentionally not imported into the reordered lesson, preventing stale numeric indices from silently opening the wrong activity. The old key is not deleted or modified; unrelated storage is untouched. The obsolete development-index migration was removed. Fresh v2 state retains answers, checked flags, notes, reveals, option orders, visited screens and support progress.

Shared view/position state is stored under `state.workspace.panes` / `state.workspace.positions`, keyed by screen identity and pane. Font size still uses the existing tab-session key `ielts-reading-workspace-passage-size`, with in-memory fallback if storage is blocked.

## Former explorers and paragraph controls

All six occurrences now show all passage paragraphs continuously and all existing paragraph-specific tasks/support in the QUESTIONS pane:

- Curitiba headings: step 10, A–B.
- Mohammed paragraph jobs: step 13, A–B.
- Bedouin headings: step 21, A–D.
- Bedouin structure maps: step 22, A–D.
- Food headings: step 15, A–E.
- Food argument/function activity: step 16, A–E.

Existing question IDs, keys, checked state, feedback, reveal IDs, paragraph maps and Food note IDs are preserved. Paragraph labels identify related question/support groups. The redundant whole-passage disclosure and exclusive Previous/Next paragraph controls are replaced by the always-available complete passage.

Removed only passage-jump buttons/handlers from EV, Digital Football, Ferrari and Amouage. A–E passage labels, question/answer letters, paragraph references in support, and Ferrari's four-version controls remain.

## Exact wording changes

Step 41:

> You can continue to the next activity or use Reading task to revisit another activity.

Step 49:

> This is the final reading task. You can use Reading task to revisit another activity.

No other teaching instructions were rewritten in this pass. Removing paragraph-selection controls and changing the view-control labels to PASSAGE / QUESTIONS implements the explicitly approved interface changes.

## Verification

- All 49 screens traversed; all 11 dropdown entries opened their first screen in forward and reverse task order.
- Back/Continue and dropdown synchronisation passed. Introduction and reflection remain sequentially accessible and excluded from the dropdown.
- All complete passages compared against content data, including exact text/order/labels. No paragraph-selector or paragraph-jump controls remain.
- Every workspace checked for nonempty passage and question panes.
- 78 rendered original question instances checked correctly, including all headings and argument-function questions; feedback matched each question/paragraph.
- All 14 complete tasks / 67 answers passed blank, incorrect, correct, evidence and saved-result checks.
- Six former explorer occurrences regression-tested; map/reveal associations and Food notes retained across reloads.
- LLM and signal matching persistence, noun reveals, removable-middle control and passive tools passed.
- EV/Digital Football progressive support and saved progression passed.
- Ferrari's four claims, backwards movement and saved note passed.
- Amouage rejected shorter alternatives and overlong sentence-completion answers as before.
- Saved pane positions, tab-session font choice, blocked-storage fallback and isolation from old/unrelated storage passed.
- Source-fidelity checks for all three source documents and answer-order checks passed. Question/result rendering and argument mapping functions were compared against the pre-pass implementation.
- No console/runtime/HTTP errors in the structural browser suite.

### Responsive benchmarks

Every one of the 31 workspace screens was tested at every benchmark, at all three passage font sizes. Full-width screens were also traversed at all ten widths. No unintended horizontal overflow was found. Independent scrolling, single-pane position restoration, exact layout boundaries and passage-only font sizing passed.

| Viewport | Layout | Minimum measured usable width of either pane |
|---|---|---|
| 390 × 844 | Single | Two-pane minimum not applicable |
| 768 × 1024 | Single | Two-pane minimum not applicable |
| 844 × 390 | Single | Two-pane minimum not applicable |
| 1023 × 768 | Single | Two-pane minimum not applicable |
| 1024 × 768 | 50/50 | 419.6px |
| 1199 × 800 | 50/50 | 499.6px |
| 1200 × 800 | 55/45 | 446.6px |
| 1280 × 800 | 55/45 | 453.6px |
| 1440 × 900 | 55/45 | 453.6px |
| 1920 × 1080 | 55/45 | 453.6px |

Widths subtract horizontal padding from clientWidth; subpixel rounding may vary. Both boundary transitions were additionally exercised in both directions. Layout remains viewport-height based, retaining existing outer/pane padding and the approved typography. The 844×390 layout has a short scrolling region, with controls/content reachable by normal pane scrolling. Screenshots at 390×844, 844×390, 1024×768 and 1200×800 were inspected.

Commands (Playwright must be available to Node):

```
python3 reading/day-1/tests/content.py
python3 reading/day-1/tests/continuation-content.py
python3 reading/day-1/tests/luxury-content.py
node reading/day-1/tests/answer-order.mjs
READING_PREVIEW_URL=http://localhost:8001/reading/day-1/ node reading/day-1/tests/reading-structure.cjs
READING_PREVIEW_URL=http://localhost:8001/reading/day-1/ node reading/day-1/tests/reading-workspace-mobile.cjs
```

`SKIP_BENCHMARKS=1` runs navigation/answer/state/support checks without repeating already-passed responsive sweeps. Historical browser suites target the removed sidebar/old numeric sequence; the new suites cover this approved structure.

## Scope notes

No student-interface requirement was left unmet. No publication action was taken.

The teacher-control page was outside this student-interface pass and was not edited. Its historical step ranges/order and its statement that Food follows the EV/Digital Football continuation still reflect the earlier sequence; correcting that teacher-only wording would require a separate approved wording change.

Final mobile checking pass: all 14 complete tasks / 67 answers passed at both 390×844 and 844×390, including checking after pane switching, feedback visibility, retained results and no page/pane horizontal overflow. No console/runtime errors occurred.

## Final commit verification — 2026-10-24

The user explicitly confirmed retaining the interim 11-item dropdown, all 31 workspace screens, Back/Continue and Mohammed → Food → Bedouin. The approved future hierarchy and Food-first consolidation plan are recorded in TOPIC-PAGE-DESIGN.md; no consolidated page was built.

Before committing, reran all three content suites, answer-order.mjs, the full reading-structure.cjs suite (no benchmark skip), reading-workspace-mobile.cjs and workspace-prototype.cjs. All passed: 49 reachable screens, 31 workspace screens at all ten benchmarks, 78 original question checks, 14 complete tasks / 67 answers, saved/reveal/support state and no console/runtime/HTTP errors. JavaScript syntax and git diff whitespace checks also passed.

The earlier step-48 test was updated to the approved v2 storage key, shared pane-control selectors and 31-screen workspace expectations; its answer, font, scrolling, boundary and blocked-storage checks were retained. Historical sidebar-era browser suites remain documented as targeting the superseded interface; the current full regression suite covers the approved implementation.

Reviewed an explicit 16-file Reading-only commit scope. Unrelated Listening/Writing files and temporary screenshots/debug artifacts are excluded. The teacher-control documentation caveat above remains unchanged.
