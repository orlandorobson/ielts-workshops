# Reading workspace prototype — local verification

2026-10-24. Not committed or published.

## Scope

Only Amouage sentence completion, step 48, uses the new workspace. It provides a substantial five-paragraph passage and six existing retrieval questions with established checking and feedback. All teaching data in luxury-content.js, continuation-content.js and answer-order.js remain byte-for-byte unchanged from HEAD. The six separately approved instruction edits already in the working tree are preserved.

## Files changed for this prototype

- `index.html`: removed the entire sidebar (`aside`, activity menu, visited-count/progress presentation and saving-status message); loads the prototype stylesheet.
- `day-1.css`: removed sidebar styles and sidebar grid columns, including the sidebar-only progress rule. Existing outer/pane padding and main maximum width remain unchanged.
- `day-1.js`: removed sidebar rendering, jump handlers, menu-responsive handling and saving-status DOM updates; retained localStorage saving, visited tracking, Back and Continue. Calls the scoped workspace enhancement when rendering.
- `luxury.js`: invokes the enhancement before scroll restoration after checking; restores visible prototype panes across the 1024px boundary.
- `workspace-prototype.js` (new): step-48-only controls and DOM arrangement; passage font selection stored in sessionStorage, with in-memory fallback if storage is unavailable.
- `workspace-prototype.css` (new): exact viewport breakpoints, viewport-height flex layout, independently scrolling panes, font settings.
- `tests/workspace-prototype.cjs` (new): benchmark and interaction regression checks.
- This report.

`content.js` and `continuation.js` contain only the earlier approved instruction changes; they were not edited for this prototype. `day-1.js` also retains its four earlier instruction changes. Unrelated working-tree files were left alone.

## Implementation

CSS uses single-pane PASSAGE / QUESTIONS below 1024px, 50/50 columns from 1024px through 1199px, and 55/45 columns at 1200px and above. Ratios apply to the width remaining after the existing inter-pane gap. Existing padding and the 1120px main-content maximum are retained.

A 100dvh flex layout allocates the remaining height after the header, existing outer padding, toolbar and Back/Continue navigation. Panes have independently scrollable overflow and no fixed pixel height. The existing title moves into the questions scroll area and the existing viewing hint into the passage area, avoiding fixed heading overhead in short viewports. Their text is unchanged.

Existing per-stage pane selection and scroll-position state are reused. Switching panes remembers and restores each position independently; normal browser anchoring applies when text reflows on viewport resizing. Checking still uses the existing renderer, answer keys and feedback.

A− = 16px / 1.55; A = 18px / 1.6 (initial default); A+ = 21px / 1.65. Only `.passage` text receives these styles. Session key: `ielts-reading-workspace-passage-size`. Reloading or leaving and returning to step 48 retains the selected size within the tab session. No account/server storage is added.

## Benchmark results

All ten passed layout, all three font sizes, horizontal-overflow checks, answer entry, blank-check notice, correct/wrong checking, saved answers and Continue/Back. Two-pane views passed independent scrolling and the 400px usable-width minimum. Single-pane views passed independent position restoration when toggling.

| Viewport | Layout | Usable passage / question width (approximately, CSS px) |
|---|---|---|
| 390 × 844 | Single | 330.4 / 330.4, one visible at a time |
| 768 × 1024 | Single | 681.6 / 681.6 |
| 844 × 390 | Single | 752.6 / 752.6 |
| 1023 × 768 | Single | 900.6 / 900.6 |
| 1024 × 768 | 50/50 | 419.6 / 419.6 |
| 1199 × 800 | 50/50 | 499.6 / 499.6 |
| 1200 × 800 | 55/45 | 554.6 / 446.6 |
| 1280 × 800 | 55/45 | 563.6 / 453.6 |
| 1440 × 900 | 55/45 | 563.6 / 453.6 |
| 1920 × 1080 | 55/45 | 563.6 / 453.6 |

Measurements subtract horizontal padding from clientWidth; browser rounding can vary by less than one pixel. At the narrowest two-pane boundary, allowing another 15px for a classic scrollbar still leaves approximately 404px.

The 1023↔1024 and 1199↔1200 transitions passed with answer state intact. All 49 steps remain traversable using Continue; all 49 visited indices were saved. Blocked localStorage/sessionStorage does not prevent navigation or font selection. No console/runtime errors occurred in the prototype suite. Screenshots were inspected at 390×844, 844×390 and 1024×768.

Run with a local HTTP server and Playwright installed:

```
READING_PREVIEW_URL=http://localhost:8001/reading/day-1/ node reading/day-1/tests/workspace-prototype.cjs
```

## Observations

No unmet specification requirement was found. At 844×390 the preserved outer padding and controls leave a 112px-high scrolling pane: all content and answer controls remain reachable, but the view is necessarily short. No padding was changed to enlarge it.

Existing reflection/final-task prose still refers to the removed workshop menu. It was deliberately left unchanged under the requirement to preserve teaching content/instructions; no replacement navigation was added.

The historical `luxury-content.py` source/content checks passed until its whole-file HEAD-equality guard, which rejects the separately approved earlier instruction changes in content.js/continuation.js. This is a stale baseline expectation, not a prototype content change.

The existing luxury browser regression also passed using a temporary copy that replaced its removed-sidebar navigation/status assertions with Back/Continue traversal. It verified eight appended screens, six tasks/all 28 answers, wrong/blank/retry/evidence behavior, rejected alternatives and word limits, Ferrari nuance/bridge, keyboard input, mobile scroll positions, saved/blocked storage and teacher-control ordering, with no console/runtime/HTTP errors. The original historical test file was not modified.
