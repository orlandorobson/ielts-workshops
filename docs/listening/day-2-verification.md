# Listening Day 2 local classroom draft

Scope: Audio 2.1–2.10. Ten activity sections, introduction and closing (12 teaching sections); compact recovery text before 2.5. No embedded audio. The old administrative Dubai and Petra worksheet tasks are not used. Original PNGs used directly, full-size links support phone inspection. Day 1 CSS and generic classroom client reused read-only.

## Sources and keys

Worksheet: listening/day-2/source/Listening Global worksheet.pdf, pages 7–9. Author supplied authoritative keys in conversation:
- 2.1 BCCCBACBACB
- 2.2 2,1,3 (maps left-to-right 1–3)
- 2.3 6,5,4 (maps left-to-right 4–6)
- 2.4 CABC
- 2.5 11E 12D 13C 14B 15A 16G
- 2.6 17E 18B 19C 20I 21D 22F. Author corrected instruction to A–I; all nine options retained.

Only presentation changes: punctuation spacing, map captions identifying left-to-right numbering, responsive controls. 2.4 preserves the source wording “Where’s students services?”. Keys are not inferred from map art. No transcript-dependent noticing exercises were invented.

## Content complete: authoritative 2.7 and 2.8

2.7 keeps its original five questions. Keys: Q1 C → A → B; Q2 B; Q3 pay course fee; Q4 online; Q5 2 → 1 → 3 → 4. Five marks: each complete ordering task earns one mark only for the exact order. Text normalisation trims/collapses whitespace and ignores case, without adding semantic variants.

2.8 has twelve classification items in definitive recording order, key B A C B C A A C B B C A. Twelve marks. Transcript copied byte-for-byte from Downloads/IELTS_listening_2.8_eng.txt to source/transcripts/audio-2.8.txt. Each numbered sentence matches the author's final list. No obsolete cycle or provisional key remains. A compact unscored language-pattern grouping appears only after released checking.

Old 2.8 responses and checked status are archived locally once under archivedResponses.classificationOldOrder and not applied to the new recording. New responses persist across refresh. Existing 2.7 responses remain in place.

All ten activities now have authoritative keys. No unresolved answer placeholders or known content blockers remain. Dubai/Petra assessments, transcripts, feedback and keys are unchanged from the locked alignment pass.

## Release activation boundary

Workshop identity is listening-day-2; response and teacher storage are separate from Day 1. release-config.js lists ten markable activities l21–l28, l29 and l210. Shared ClassroomConnection is reused unchanged. serviceReady=false intentionally disables class creation/connection until backend registration is authorized. No local release-code workaround exists.

The local shared registry now contains listening-day-2 with l21–l28, l29 and l210. To activate later, deploy that registry in the existing Worker, then set serviceReady=true and run deployed-service isolated-client acceptance tests. This is a configuration/deployment dependency, not an architecture redesign. Only the workshop registry changed; Worker implementation, tokens, expiry, WebSocket/polling and storage were untouched. Nothing was deployed. Teacher preview explicitly explains the activation dependency.

## Feedback and privacy

Submission handler independently checks current release and key existence. Enter and completed fields cannot grade before release. Refresh restores responses but waits for verified release state before restoring previously checked feedback. Release updates do not rebuild forms. Editing clears obsolete feedback. Local answers never enter classroom requests. No overall score.

Optional author note appears after the student checks released 2.6 feedback, avoiding pre-listening hints. It contains no extra questions. Sources linked in note: Nobel Prize 2017 summary, Nobel Prize 2021 biobibliography, UNESCO Stone Town urban heritage atlas. Gurnah's Kent role described in past tense, avoiding implying it began after his Nobel award. Historical Oman–Zanzibar link is contextual, not a personal Gurnah–Oman claim.

## Verification

Run with the local static server on port 8000:
NODE_PATH=/Users/orlandorobson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node listening/day-2/tests/browser.cjs

The original browser.cjs regression tests use three isolated browser contexts and intercepted service responses (not live Cloudflare). They verify correct/wrong scoring, pre-release submit guard, selective release, release all, independent responses, offline editing, refresh restoration, pending marking, disabled stock activation controls, eight original map assets and no page overflow at 360/390/430/1280. Full-size maps are linked without cropping or overlays.

Static answer data is delivered in JavaScript, as in Day 1; release guards student-facing controls and feedback, not forensic source-code access. UI leakage audit covers headings, labels, placeholders, form values, feedback and expandable author content.


## Definitive 2.9 / 2.10 alignment pass

Full item-by-item evidence and distractor audit: day-2-transcript-alignment.md.

Dubai is six MCQs, questions 1–6, key B A C A B A. Six marks total. The obsolete eight-mark sequence/project/AI activity and follow-up have been replaced entirely. The released learning layer follows the argument from 12,000 followers to people and their wants, needs and problems. Optional diagnostic reflection is unscored.

Petra retains Questions 11–20, now with the exact definitive simple-language wording. Key: B B A B C B A A, then A/C for 19–20. Ten marks, including two independent choose-TWO marks in either selection order. No third selection. Released learning layer is concise, with the optional Follow Samir second listen.

Definitive transcripts are stored in listening/day-2/source/transcripts/audio-2.9.txt and audio-2.10.txt. Dubai copied verbatim from Downloads/IELTS_listening_2.9_eng.txt (filename lacks the brief's (1) suffix). Petra extracted verbatim from the author-supplied performed script. Every correct answer is supported and other choices rejected from these transcripts. No genuine ambiguity requiring question changes was found; no audio file was regenerated or transcribed by inference.

Old Dubai answers and old checked status are archived locally once under archivedResponses.dubaiEightMark, preventing those answers from being applied to different new questions. Other activities retain existing response keys. New Dubai work survives refresh normally.

Tests passed:
- complete-day.cjs: real local Wrangler Worker, three isolated browser contexts, individual release, release all, offline edit/catch-up, saved responses and checked feedback, private teacher writes/public-code rejection, workshop separation, six-/ten-mark scoring, choose-TWO 0/1/2 credit and selection cap.
- browser.cjs: existing 2.1–2.8 simulated-service regression, original keys/maps and state preservation.
- content-alignment.cjs: obsolete Dubai response archive, preservation of other responses, new-response persistence, exact keys/counts, obsolete content removal and byte-identical Dubai source copy.
- classroom-service npm test: existing Day 1 expiry/hibernation/atomic-release regression and Day 2 registry security (two passing tests).
- Responsive 360/390/430/1280: no horizontal overflow, labelled tap targets, long Petra wording and choose-TWO feedback. Phone and desktop choose-TWO screenshots inspected.

This completion pass adds only l27/l28 to the prepared local registry; no backend architecture changes. Deployed Day 2 remains unregistered; serviceReady=false remains in place. Local tests override endpoint/activation in browser test routing only. No deployed or physical-device success is claimed. Day 1 and 2.1–2.8 content remain unchanged. No commit, push, deployment or publication.

## Final completion verification

completion-27-28.cjs exercises every permutation of both ordering tasks (6 and 24), exact text boundaries, full 5/5 and 12/12 scores, 2.8 stale-state archive and refresh, individual release, transcript byte equality and 360/390/430/1280 layouts. Other suites cover the original activities and locked finals, release-all, private writes, offline catch-up and expiry/hibernation. Live frontend activation remains false. No deployment/publication.


## Publication pass — 2026-09-21

The historical local-only status above is superseded by this publication pass.
Worker version d94069c2-8c18-48d2-ae66-22ff72b94446 is deployed with all ten Day 2
activities. Real-service tests passed before frontend activation: separate teacher
and two student contexts, session creation, individual release, release-all,
unauthorized write 403, invalid code 404, eight-hour lifetime metadata, offline
catch-up and refresh persistence. Day 1 create/release/persistence also passed.
Actual expiry/alarm cleanup was tested locally, not by waiting eight hours in production.

Day 2 serviceReady is now true; shared serviceURL remains the deployed HTTPS Worker.
No content changed. Prepublication regression suites passed for Day 1, all Day 2
activities and local Worker lifecycle/security. Final public-page checks use
listening/day-2/tests/production-smoke.cjs after GitHub Pages deployment.
Physical-phone verification remains a manual teacher check; browser contexts are
not physical devices.
