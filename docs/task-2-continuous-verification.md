# Task 2 understanding and planning — local review

3 November 2026. Implemented in `/Users/orlandorobson/Documents/ChatGPT/IELTS workshops` on existing `main`; no commit, push or deployment.

## Scope

The root Task 2 route now presents understanding and planning as one scrolling page. Old understanding/planning hashes map to the corresponding new section. Obsolete screens remain in the legacy module for provenance but are excluded from navigation and the active entry route. Existing introduction exercises and Workshop 2 remain reachable. Introduction navigation skips the retired understanding/planning screens.

Five authoritative files are copied byte for byte into `content/writing/task-2-canonical/`. Prompts in the new experience load by canonical question ID. The existing submission question bank is untouched.

The page uses short contrasts, four individual plan votes across two questions, immediate explanatory feedback and a three-part short plan. Hints and the complete demonstration plan are separate optional disclosures. There are no note lengths, written justifications, explanation/example/closure requirements, voting totals or completion gates in these sections.

## Storage

New work uses `ielts-workshops:task2:continuous:v1`, with question/attempt identifiers. On first creation, it archives the exact raw strings from both historical storage keys. Repeated loads reuse that record; neither historical plan is implicitly imported into a potentially conflicting new plan. Full historical records are readable and downloadable from Saved work. A separate historical introduction link opens its original editor.

The existing introduction editor reads the short plan and writes the new introduction separately from the historical introduction. It rereads the record before saving to avoid replacing newer plan notes. The planning page preserves newer introductions when restored from browser history. Existing Workshop 2 sources/drafts retain their original behaviour and are not silently switched to a different attempt. The later workshop has not been redesigned and still contains its older paragraph-planning activities.

Notes are debounced without DOM replacement, with page-hide/visibility flushing. Saving failures leave the editor usable, display a retry control and allow a JSON download. Unsupported/corrupt new records are not overwritten. Work remains local to the current browser/origin.

## Verification

Passed `tests/task-2-continuous.cjs` using bundled Playwright and local Chrome:

- Canonical prompt text against frozen JSON; five source files separately matched byte for byte.
- Both online-course jobs; corrective interpretation feedback.
- All four Cool/Splat cards, changed votes and task-specific explanations.
- Keyboard activation of vote controls and disclosure; labelled native radio/text controls.
- Notes, view, choices and introduction persist on reload.
- New plan visible in existing introduction editor; historical introduction separately accessible.
- Both legacy records archived; historical plan/introduction and Workshop 2 record preserved.
- Old planning hash mapping; later Workshop 2 entry loads.
- 375, 768 and 1280 pixel layouts without horizontal overflow.
- Focus and scroll remain stable while typing; save failure remains editable.
- No page errors or failed HTTP resources.

Passed the existing `tests/writing-submissions.cjs` suite: all submission paths, visuals, timing validation, intercepted payloads, retry, reload, keyboard, layouts, legacy links and denied storage. No submissions were sent.

JavaScript syntax checks and `git diff --check` passed. `docs/QUALITY_CHECKS.md` is empty; no additional root package test runner exists. Rendered phone and laptop screenshots were inspected; a low-contrast introduction link was corrected. Screenshots are in `output/task-2-continuous-{375,768,1280}.png` and `output/task-2-plan-preview.png`.

Run locally with `python3 -m http.server 8765 --bind 127.0.0.1`. Preview: http://127.0.0.1:8765/writing/task-2/ . Regression commands require Playwright on NODE_PATH; set WORKSHOP_BASE or PORTAL_BASE to override the respective local test URL.

No classroom learner pilot or assistive-technology user study has been performed. Later sections retain existing teaching and are outside this redesign.

## Task 1 style alignment — 3 November 2026

Inspected the live Task 1 workshop reached through https://bit.ly/4yl7h0N (https://orlandorobson.github.io/ielts-workshops/writing/task-1/academic/#a0), its local renderer/shared CSS, and all three original image assets. Reused those assets directly; Task 1 files are unchanged.

`task-2-ui.js` now provides the shared Cool/Spicy/Splat key, illustrated judgement controls, compact section links and the grouped Activities selector. `task-2-ui.css` applies the shared paper palette, spacing, typography, restrained dividers and menu treatment. The menus are used by the continuous page, retained introduction lessons and Workshop 2. All 19 destinations are available across these routes. Legacy activities with repeated IDs are scoped in the menu so introduction and conclusion choices cannot collide. Existing lesson content and drafts remain in place; no new Spicy planning assessment was added.

Checked the updated build with the in-app browser on the separate localhost origin, leaving the user's 127.0.0.1 draft store untouched:

- All three original images loaded; visible labels and accessible names remain on controls.
- Mouse and keyboard votes, changed votes and explanatory feedback work; votes persist on reload.
- The Activities menu jumps within understanding/planning and between introduction/later lessons. Direct conclusion selection works without completing preceding activities. Switching from conclusion to the similarly identified introduction activity resolves correctly.
- Reset controls survive repeated menu renders and remain inside the menu.
- Short notes persist, reach the introduction screen, and retain focus/scroll while typing.
- Phone (375 px), tablet (768 px) and laptop (1280 px) have no horizontal overflow. Phone menu stays inside the viewport. Temporary viewport overrides were reset.
- Browser error/warning log was empty. JavaScript syntax and Git whitespace checks passed.

New inspected screenshots: `output/task-2-style-plan.png`, `output/task-2-style-menu.png`, `output/task-2-style-menu-phone.png`, `output/task-2-style-plan-phone.png`. Still local-only; no commit, push or deployment.

### Screenshot refinement: pill menus and circular reactions

Matched the four supplied Task 1 screenshots: activity/help menu triggers now use pill outlines and disclosure arrows; Cool/Splat votes use standalone circular image buttons instead of rectangular image-and-text buttons. The explanatory key retains visible labels, and image-only buttons retain accessible names and tooltips. Selection uses a contrasting ring and background. Shared styles apply to both Task 2 routes and introduction screens.

Inspected the rendered result, activated image votes by keyboard, confirmed 60-by-60 px circular targets, and checked the phone activity panel fits within 375 px (panel spans x=22 to x=365). No browser errors; syntax and whitespace checks pass. Evidence: `output/task-2-pill-menu.png` and `output/task-2-circular-controls.png`. Refresh the existing preview to load these changes.

## Introductions build — 3 November 2026

Reviewed the latest user sequence in `Plan unified IELTS Task 2 redesign` and section 5 of the approved build brief. Introductions now follows understanding and planning on the same continuous page.

New content in `content/writing/task-2-introductions.js` comprises separately identified local skill demonstrations. It does not modify the frozen questions or imperfect learner models. The section includes:

- Cool/Spicy/Splat demonstrations for WT2-W06 and three individual judgements, including a grammatical but misdirected comparison.
- Optional local repair with a deliberately requested comparison.
- Cool chunk ordering and an optional Spicy contrast build, using keyboard-accessible circular movement buttons. Both complete-sentence orders are accepted in each builder. Only the builder list is rebuilt during movement; the writing field is untouched.
- A short distinction between requested judgement and explanatory tasks, with the exact WT2-W03 contrast. Early opinion placement is described as a recommendation; no fixed sentence count, exhaustive introduction map, forced agreement statement or word minimum is imposed.
- Own introduction writing, live plan reminder, optional hints/phrases/comparison, word count and local autosaving. No voting or builder completion gates block writing.

Active legacy introduction hashes and `?lesson=1` now map to the appropriate new anchors. `?historical=1` retains the old editor and original drafts. Later paragraph/conclusion lessons remain reachable and have not been redesigned or silently switched to a new source attempt.

Saving now merges only fields changed on this screen. Another screen's newer introduction is preserved when only the plan changes. If two edited introductions conflict, the previously saved text is retained in `introductionHistory`, available in recovery/export, before the new edit is saved. Original legacy records remain intact. Local save errors show retry/download controls beside introduction writing as well as planning.

### Checks for this increment

Passed `node tests/task-2-introductions.mjs`: both accepted sentence orders in both builders, invalid/repeated chunk IDs, repeatable archiving of both legacy records, changed-field merging, preservation of conflicting introductions, unreadable records and local-saving failure. JavaScript syntax and Git whitespace checks passed. All five frozen source copies still match the approved originals byte for byte.

In-app browser checks on the isolated localhost origin passed: exact WT2-W06/WT2-W03 text; three votes and feedback; Cool sentence orders; Spicy assembly; persistence of choices/order/writing after reload; immediate live plan updates; stable writing focus/scroll; stable focus/scroll during keyboard chunk movement; old `?lesson=1#o3` mapping; optional Spicy/help opening through the activity menu; and 375/768/1280 px layouts without horizontal overflow. Circular chunk controls meet 44 px targets. All images loaded and the browser error log was empty.

The existing broad browser regression file's plan-reminder locator was updated for the new markup. It was not rerun in this increment; the focused unit checks and in-app browser checks above were run. No new network scoring or AI dependency is present. A classroom learner pilot remains outstanding.

Screenshots: `output/task-2-introductions-preview.png`, `output/task-2-introduction-builder.png`, `output/task-2-introduction-builder-phone.png`. Local review entry: http://127.0.0.1:8765/writing/task-2/#introductions . Refresh an already-open older preview before reviewing. No commit, push or deployment.

## Learner-language revision

Rewrote the active introduction explanations, hints, builder feedback and vote feedback for a low-B1 ESL reader. Replaced descriptions such as “requested judgement,” “neighbouring question,” “outweigh verdict” and “required direction” with short questions and actions. The help now asks learners to read the final question, say what they think when asked, and give short answers before explaining more later. Simplified the harder understanding/planning explanations and help labels too. Canonical task wording, teaching-example texts, activity IDs and saved work are unchanged.

The target is clear, encouraging low-B1 language; this is an editorial review, not a certified CEFR assessment. Checked the rendered help and existing saved work in the in-app browser. Focused introduction tests, syntax and whitespace checks passed. No commit or deployment.

## “Write it in your own words” sequence

Introductions now explicitly teaches “Write it in your own words”: keep the meaning and retain useful key nouns rather than replacing every word. Revised the three labelled demonstrations (Cool → Spicy → Splat). Four core votes include a start that changes the wording successfully but omits the requested opinion. Optional cross-question votes show WT2-W03 with an agreement statement that substitutes a one-sided answer for benefits/problems, a successful WT2-W03 start without an opinion, and a clear qualified agreement for WT2-W01. Feedback identifies missing task coverage; it does not call every extra opinion a Splat.

The existing Cool/optional Spicy chunk ordering and saved supported-writing field follow. New examples use new activity IDs, preserving prior choices and writing. Canonical prompts and frozen learner models are unchanged. Cache versions were refreshed for both the renderer and teaching-content module.

Passed focused unit checks, including unique activity IDs and canonical question references, plus syntax and whitespace checks. In-app browser verified all seven items render, keyboard Splat voting, the missing-opinion feedback, the optional question-specific votes, retained saved writing and the revised demonstrations. Browser error log was empty. Screenshot: `output/task-2-own-words.png`. Still local-only.
