# Task 2 — final quality review

Reviewed 3 November 2026. Current local preview: http://127.0.0.1:8765/writing/task-2/?preview=quality-check-3

## Outcome

The five-section journey is coherent and ready for a short learner pilot. Students keep WT2-W06 from understanding through conclusion. Planning uses brief notes; introduction wording stays “in your own words”; paragraph work focuses on explaining a point; conclusions connect the existing ideas and finish the same view. Cool is a successful endpoint. Spicy, extra questions, technical names, longer help and comparisons stay optional. No completion gates, writing minimums, AI scoring, compulsory closing sentence or extra course after the conclusion remain.

This is an editorial and functional review, not evidence from a timed student trial or a certified CEFR/accessibility assessment.

## Issues found and fixed

1. The primary button after planning skipped the introduction lesson. It now starts the introduction teaching; a quieter link lets ready students go straight to writing.
2. A download could use an older in-memory introduction after another tab saved newer writing. Download now merges the latest saved fields with unsaved local changes, using the same conflict-preserving rules as saving.
3. Replaced several remaining harder explanations and the ambiguous “See it in my own words” heading with clearer student actions.
4. Replaced arrival-order section tracking with page-position tracking, keeping the current section/activity aligned during scrolling without rerendering the editor.
5. Reduced repeated save announcements to one live region. Local indicators remain visible beside writing.
6. On phones, conclusion paragraph reminders start collapsed so the writing box is easier to reach. Wider screens show the written paragraphs beside it. Reminders remain available on all sizes.
7. “Download my work” now produces readable text with the canonical question, plan and four writing sections. A separate menu backup preserves activity choices, original records and writing histories as JSON.

## Verification completed

- All Task 2 JavaScript modules parse; Git whitespace checks pass. Frozen canonical source copies still match the approved originals byte for byte.
- All three focused test suites pass: introductions, paragraphs and conclusions. These cover both valid chunk sentence orders, invalid chunk IDs, original model extract preservation, repeatable legacy preservation, independent-field merging, conflicting draft histories, unreadable storage and failed saving. The conclusion suite also checks readable export contains all writing fields.
- Browser exercised every option across the 16 plan/introduction/paragraph/conclusion voting cards, including retries and keyboard activation. Every card produced contextual feedback.
- Verified the primary planning button enters introduction teaching; all five sections and 18 activity destinations are available. Canonical prompt text matches the frozen bank. No duplicate element IDs, broken in-page anchors, disabled writing fields or extra teaching section after conclusions were found.
- Writing reloads; introduction, plan, paragraph and conclusion reminders stay linked. Focus/scroll stay stable while typing. Earlier browser checks also covered keyboard chunk movement and valid arrangements; these routines were not changed in this review.
- Two-tab test confirmed the latest introduction is preserved when another screen changes plan notes, and included correctly in downloads. Readable text download and complete JSON backup were downloaded and checked.
- Actual viewport dimensions verified at 375, 768 and 1280 px with no horizontal overflow. Phone menu fits within the screen; phone conclusion reminders collapse; wider-screen reminders open. Temporary viewport overrides were reset.
- All images loaded and browser error logs were empty. Save-live-region count is one. This was not a hands-on screen-reader user test.

The unrelated submission portal suite was not rerun; no portal changes were made. No classroom learner pilot has been conducted. A short pilot should check that students understand the instructions and use their notes when writing; do not infer better writing simply from less scrolling.

Screenshots: `output/task-2-final-qa-desktop.png`, `output/task-2-final-qa-phone.png`. Test work used the isolated localhost origin rather than the user's 127.0.0.1 draft store. No commit, push or deployment.
