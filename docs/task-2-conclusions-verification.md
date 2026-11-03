# Task 2 conclusions — local review

Built 3 November 2026. Local-only: no commit, push or deployment.

## Teaching

The conclusion section now follows both paragraphs on the continuous root route. It uses WT2-W06, gives the teaching writer's two body ideas and positive view, then shows Cool/Spicy/Splat endings tied to those ideas. Cool and Spicy bring the ideas together into a final answer. Splat changes the earlier view. Three further individual votes include a Splat that introduces free laptops/courses without developing them in the body. Feedback gives the particular reason and allows retries.

Optional help accepts a simple restatement as workable, then shows how to connect its meaning rather than requiring synonym changes. Conditional opinion/agreement help avoids a forced agreement statement in explanatory tasks. Neither “In conclusion,” a separate opinion sentence, a fixed sentence count nor a word minimum is required. A short repair is optional and is not automatically graded.

The student's own conclusion box shows the saved view/notes and actual body paragraphs, with the introduction available for comparison. Paragraph disclosures initially open when writing exists. The text stays editable, and earlier components update the reminder without copying their text into the conclusion. No completion gate or AI service is involved. Language was reviewed for clear, short ESL instructions; no certified CEFR claim is made.

## Integration

The main navigation and Activities menu now reach the new conclusion section. Earlier conclusion lessons/drafts remain in the separately labelled earlier-workshop menu. Root legacy c1/c2/c3/c4 hashes map to the corresponding new conclusion activities.

The conclusion, votes and repair save with the existing question/attempt. Changed-field merging protects newer paragraph/introduction text. Conflicting conclusion versions are preserved in `conclusionHistory`, retained in recovery/export. Retry/download are available beside the writing field after local save failure. Neither legacy storage record is replaced.

Whole-answer assembly and an editable final revision remain outside this increment. Canonical questions and frozen whole-essay learner models are unchanged; examples here are local teaching demonstrations without band claims.

## Verification

Passed all three focused suites:

- `node tests/task-2-conclusions.mjs`: isolated conclusion saves, newer paragraph/introduction preservation, conflicting conclusion history, notes-only updates, activity reload and saving failure.
- `node tests/task-2-paragraphs.mjs`.
- `node tests/task-2-introductions.mjs`.

JavaScript syntax and Git whitespace checks passed. In-app browser checked keyboard voting, incorrect choice then retry, contextual feedback, optional repair, own conclusion persistence after reload, retained repair/votes, live paragraph updates without overwriting the ending, and stable focus/scroll while typing. All 27 activity IDs are unique. Phone/tablet/laptop widths 375/768/1280 showed no horizontal overflow. Images loaded and the browser error log was empty. Temporary viewport overrides were reset.

Inspected screenshots: `output/task-2-conclusions-preview.png`, `output/task-2-conclusion-writing.png`, `output/task-2-conclusion-phone.png`. The unrelated submission suite was not rerun. A classroom learner pilot remains outstanding.

Preview: http://127.0.0.1:8765/writing/task-2/?preview=conclusions-1#conclusions

## Final workshop endpoint

At the user's instruction, the workshop ends after conclusion writing. Removed the retired Workshop 1/2 renderers, their teaching-content modules and their storage adapters (six files). These removals are limited to the superseded workshops; submission/publication resources and unrelated workspace files remain untouched.

Removed the earlier-course menu group and historical editor routes. The old Workshop 2 URL is now a small redirect to the matching new section. Earlier introduction/editor query links lead to Saved work instead of resurrecting old lessons. Saved raw records remain intact in browser storage and recovery/export; no student drafts were deleted. Recovery now lives inside the Activities menu, rather than below the conclusion. The conclusion is the last child of the teaching page, followed only by the normal site footer. No extra review/practice course follows it.

All three focused suites, syntax/whitespace checks and reference search passed. Browser verified the conclusion is the last section, no old lesson menu entries remain, recovery is in the menu, writing persists, and the old Workshop 2 conclusion URL redirects correctly. No browser errors. Evidence: `output/task-2-workshop-end.png`. Updated preview: http://127.0.0.1:8765/writing/task-2/?preview=workshop-end-1#conclusion-write . Still uncommitted and unpublished.
