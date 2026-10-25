# Local topic consolidation verification — 2026-10-25

Baseline: `937ec42348a0ca4c0b5a8076ada293dd300b502a`. Local changes only; no commit or push.

## Reconciliation

| Section | Topic destination | Former screens |
| --- | --- | --- |
| Paragraphs | Flexible Working | 1 introduction, then 2–3 |
| Paragraphs | Urban Trees | 4–5 |
| Paragraphs | Large Language Model | 6–8 |
| Ideas and arguments | Curitiba | 9–11 |
| Ideas and arguments | Mohammed from Sohar | 12–13 |
| Ideas and arguments | You Are What You Eat—Or Are You? | 14–17 |
| Reading skills | Bedouin Life | 18–26 |
| Reading skills | Electric Vehicles | 27–33 |
| Reading skills | Digital Football | 34–40, then 41 reflection |
| Reading carefully | Ferrari | 42–44 |
| Reading carefully | Amouage | 45–49 |

All 49 source activity clusters remain represented, in order. The original screen definitions are internal renderers, not navigable destinations. All passage-dependent activity clusters share their topic's continuous passage. Bedouin tools remain in sequence with access to the passage; its synthesis follows the workspace. Ferrari's bridge follows its workspace. No learning content, question, answer key, feedback, map, noun/passive tool or optional support was removed.

The separate introduction and reflection destinations were removed. Read-only boundaries at Mohammed (12), EV (27) and Digital Football (34) were removed: their reading instructions remain preparation, and their passages now appear once in the topic workspace. Other former boundaries were consolidated without deleting their activities. Repeated passage copies and per-screen workspace wrappers were removed, along with redundant per-screen scroll hints. Existing shared pane controls still provide passage/task switching.

Wording changes are limited to the required topic/section labels, Previous topic / Next topic, reflection and final-task references to revisiting a topic, and EV's “before opening the summary activity” → “before trying the summary activity”. No pedagogical rewrite was performed.

## State and DOM

- Original answer keys and option values are unchanged; source-content modules and answer-order implementation are untouched.
- Urban Trees and Curitiba repeat vocabulary questions. Their control groups and feedback IDs now include the source activity identity. Saved answers synchronise, but checking one instance reveals only that instance's feedback.
- EV's Paragraph A summary and reasoning activity use separate radio names while sharing the original logical answer key. Updating either synchronises the other and invalidates stale summary feedback.
- Continuation and luxury refresh handlers locate the activity that owns the clicked control rather than the first root on the page. Sibling activities and the workspace remain mounted.
- Whole-task notices/results remain scoped to their own forms. No duplicate IDs are present across any topic.
- Storage remains `ielts-reading-day-1-v2`; `sequenceVersion: 4` identifies topic navigation. All 49 old numeric positions map to their containing topic, including introduction and reflection. Valid answers, notes and other dictionaries survive migration. Old per-screen workspace positions remain stored but do not represent the new combined questions pane; each topic starts its own positions. Subsequent topic scroll positions and selected pane persist.

## Verification commands

Run against `http://localhost:8001/reading/day-1/` with Playwright available through NODE_PATH:

- `python3 reading/day-1/tests/content.py`
- `python3 reading/day-1/tests/continuation-content.py`
- `python3 reading/day-1/tests/luxury-content.py`
- `node reading/day-1/tests/answer-order.mjs`
- `node reading/day-1/tests/reading-structure.cjs`
- `node reading/day-1/tests/reading-workspace-mobile.cjs`
- `node reading/day-1/tests/workspace-prototype.cjs`

The three browser suites have been updated for topic navigation, multiple simultaneous activities and natural document scrolling; they retain the prior content, checking, feedback, progressive-support and persistence coverage. Older sidebar-era browser scripts remain historical, as recorded in the preceding verification document.

## Visual review / deferred language work

Review the bounded workspace within the naturally scrolling topic page, especially in short landscape viewports. The longest questions panes (Bedouin, EV, Football and Amouage) intentionally require vertical scrolling; no hidden activity wizard or extra navigation was added. Preparation and synthesis remain outside that region where appropriate.

Existing titles sometimes repeat the topic or a form heading when brought together (for example, Amouage's full passage title followed by “Scan first”). Optional vocabulary appears more than once in some topics because both prior learning contexts were retained. Phrases such as “continue and return later”, “the original matching questions come later”, and “Work through A–E” are still meaningful but should be considered in the later language pass. They have not been rewritten.

Teacher-control documentation was not part of this student architecture change; its previously documented old screen ranges remain a separate follow-up. No new teacher navigation system was introduced.

## Results

- Source checks pass: 32 verbatim passage paragraphs across all three content modules; original headings, keys, maps and vocabulary preserved; all 67 continuation/luxury answers and approved strict completion prompts preserved.
- Answer-position regression passes; canonical option values and the saved country shuffle are unchanged.
- Structural browser checks cover all 11 destinations, all 49 source clusters and every old numeric navigation position. All 78 original rendered question instances and 14 complete tasks pass answer checking. Blank, incorrect and correct responses, evidence, saved answers, reveal state, paragraph maps, noun/passive tools, progressive support and Ferrari versions are covered.
- Repeated vocabulary feedback is isolated across both instances and persists independently on reload. EV summary answers synchronise both ways. Support refresh retains sibling DOM nodes; support reset works. Other complete-task result regions stay hidden when one task is checked.
- All 11 topic workspaces pass all ten required viewport benchmarks, with three font sizes each. No horizontal overflow; exact pane boundaries/ratios; natural page scrolling; independent panes; narrow-screen switching and scroll restoration; passage-only fonts. Additional Amouage tests exercise repeated boundary changes and storage-disabled operation.
- All 14 complete tasks / 67 answers pass portrait (390×844) and landscape (844×390) mobile interaction checks.
- No console, runtime or HTTP errors were reported by the browser suites. No duplicate IDs were found. `git diff --check` passes.
- Screenshots inspected: Amouage at 390 and 1200px, Food at 1280px, Bedouin at 1024px, Digital Football at 844×390 and Flexible Working at 390×844. No clipping/overflow defect found; long-pane scrolling and repeated headings remain review points, not hidden or gated activities.

| Viewport | Mode | Minimum usable pane width |
| --- | --- | --- |
| 390×844 | Single | 400px minimum does not apply |
| 768×1024 | Single | 400px minimum does not apply |
| 844×390 | Single | 400px minimum does not apply |
| 1023×768 | Single | 400px minimum does not apply |
| 1024×768 | 50/50 | 419.6px |
| 1199×800 | 50/50 | 499.6px |
| 1200×800 | 55/45 | 446.6px |
| 1280×800 | 55/45 | 453.6px |
| 1440×900 | 55/45 | 453.6px |
| 1920×1080 | 55/45 | 453.6px |

## Changed files

All files are under `reading/day-1/`:

- `day-1.js` — topic composition/navigation, original-question DOM scopes and navigation migration.
- `continuation.js` — shared-passage ownership, activity-scoped refresh and repeated EV answer synchronisation.
- `luxury.js` — shared-passage ownership and activity/form-scoped refresh and notices.
- `workspace-prototype.js` — topic title remains outside the bounded workspace.
- `workspace-prototype.css` — natural document scrolling and bounded workspace region.
- `tests/reading-structure.cjs` — topic, migration, all-content, isolation and all-benchmark regression.
- `tests/reading-workspace-mobile.cjs` — complete-task checking within topic pages on mobile.
- `tests/workspace-prototype.cjs` — Amouage completion within the topic workspace and topic-level traversal.
- `TOPIC-PAGE-DESIGN.md` — current structural decision and next pedagogical-language principles.
- `TOPIC-CONSOLIDATION-VERIFICATION.md` — this reconciliation and verification record.

Unrelated existing untracked files were left untouched. The local review URL is `http://localhost:8001/reading/day-1/`.
