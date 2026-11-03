# Task 2 main paragraphs — local review

Implemented 3 November 2026 on the existing checkout. No commit, push or deployment.

## Learner sequence

The continuous root workshop now runs through understanding, planning, introductions and main paragraphs. Paragraphs stays on WT2-W06 throughout: read one short developed paragraph; optionally see what its parts do; judge two examples; try improving an example; write both body paragraphs with the plan beside each field. Spicy and terminology are optional disclosures. No compulsory example, separate closing sentence, fixed sentence count, minimum note length or completion gate was added.

The learner instruction is: “Start with one point. Explain why or how. Add an example if it helps.” A successful example explicitly stops once the point is clear, without an extra closing sentence. Explanations use short questions and actions rather than lengthy technical descriptions.

## Content and provenance

`content/writing/task-2-paragraphs.js` contains new local demonstrations plus an unchanged sentence from the approved fictional Aisha composite: “For example, they will know more things about the job and improve themself.” The preceding job-skills sentence is adapted context. Feedback diagnoses the absent specific example rather than treating a grammar correction as the solution. The optional repair keeps the writer's job-skills idea. Internal provenance refers to the frozen model bank and the E14 example/restatement pattern. No authentic student quotation or band estimate is claimed. Private source paths and real student names were not copied into public content. Frozen canonical/model files were not edited.

## Integration and saving

Both new paragraph fields and the repair/votes are saved with the existing WT2-W06 attempt. Changing notes updates the writing reminder without replacing the writing field. The introduction is available through an optional disclosure and updates without copying its text into a paragraph. Typing is debounced and save failures retain local text with retry/download controls.

Changed-field merging preserves newer introduction/other-paragraph text. If two screens edit the same paragraph, the previous saved version is retained in `paragraph1History` or `paragraph2History`; recovery/export retains these records. Neither legacy storage key is overwritten or silently imported into this attempt. Earlier workshops and their fuller drafts remain reachable through the menu/recovery links.

The top navigation now includes Paragraphs and Conclusion. Conclusion activities remain in the earlier workshop and use that workshop's saved attempt; they have not yet been rebuilt or silently switched to the new attempt. This increment does not assemble or assess a complete essay.

## Verification

Passed:

- `node tests/task-2-paragraphs.mjs`: original fictional-model sentence, independent paragraph merging, newer introduction/other paragraph preservation and conflicting-paragraph recovery.
- `node tests/task-2-introductions.mjs`: introduction ordering, legacy preservation, merges, corrupt records and save failure.
- JavaScript syntax checks and `git diff --check`.
- In-app browser: keyboard Cool selection, wrong vote then retry with specific feedback, repair writing, both writing fields, reload persistence, live plan updates, existing introduction retained, stable focus/scroll while typing, all 24 menu IDs unique, canonical WT2-W06 wording.
- 375/768/1280 px layouts: no horizontal overflow; phone writing fields and support controls inspected. A legacy CSS class collision causing excessive sidebar spacing was fixed by giving the new reminder its own class.
- No browser errors. Temporary viewport changes were reset.

Screenshots: `output/task-2-paragraphs-preview.png`, `output/task-2-paragraph-writing.png`, `output/task-2-paragraph-phone.png`. The broad submission suite was not rerun because this increment does not touch the portal. Classroom learner testing remains outstanding; low-B1 suitability is an editorial aim, not a certified CEFR assessment.

Local preview: http://127.0.0.1:8765/writing/task-2/?preview=paragraphs-2#paragraphs
