# Listening Day 1 — local draft

The user's Day 1 specification and subsequent source material are authoritative.
No missing answers or distractors have been invented.

## Current content and order

14 activities, plus the brief introduction and closing summary. The navigation
keeps the first four together under Precision:

1. Audio 1.1 — Choose the correct option (five authored option sets; key pending).
2. Audio 1.2 — Write what is spelt (five typed fields; key pending).
3. Audio 1.3 — Days and dates (five authored prompts; key pending).
4. Spelling — days and months (five exact authored option sets and supplied keys).
5. Spelling Challenge attempt 1 (20 exact authored four-option sets).
6. 1.4 Mirbat snorkelling.
7. 1.5 Mirbat again.
8. 1.6A Gym information.
9. 1.6B What did they actually say?.
10. 1.6C Can you say it?.
11. Spelling Challenge attempt 2 (independent question and option shuffle).
12. 1.7 A London conversation, with unrelated instruction examples.
13. 1.8 Hotel: nine questions, consecutively numbered 1–9 as corrected by the user.
14. 1.9 Numbers: ten exact authored pairs, a–j, with two large tap targets each.

The nine existing questions were renumbered with explicit user authorization; no question was added. All Hotel/Numbers questions and
options come from the latest user message. Precision keys remain explicitly null;
there are no checking controls for 1.1–1.3, even after Release all answers.

## Remaining sources needed

- Audio 1.1 answer key; Audio 1.2 and 1.3 five answers each.

## Implementation

Static HTML, shared base CSS, local CSS and native JavaScript modules. No new
student dependencies, audio, images, backend, analytics, authentication or stage
locking. Spoken practice uses reveal/try-again controls without microphone capture.
Progress is saved under `ielts-listening-day-1-v1`; blocked storage still permits use.

The supplied additions live in `content/listening/day-1-source.js` and render via
`listening/day-1/source-activities.js`. Typed fields disable spellcheck and
capitalization; the room number requests a numeric keyboard. Numbers uses exact
currency/ordinal strings and preserves authored pair order.

Hotel surname matching ignores case and surrounding whitespace. Breakfast matching
requires both 6 and 10 endpoints, accepts dashes, “to”, AM/a.m. and 24-hour formatting,
and rejects PM, incomplete ranges, different hours or nonzero minutes. Examples:
`6am–10am`, `6 a.m. to 10 a.m.`, `06:00–10:00`, `6–10am`. `6am–10pm` fails.

## Teacher answer release

Student: http://localhost:8000/listening/day-1/
Teacher: http://localhost:8000/listening/day-1/teacher-control/

Reuses Speaking's `createReleaseControl` with separate Listening state under
`ielts-listening-day-1-answer-releases-v1`. Speaking files are unchanged. No default
activity is released. Individual releases cover days/months spelling, the two
20-word spelling attempts, 1.4, 1.5, 1.6A, 1.6B, 1.7, Hotel and Numbers.

Teacher clicks Release answers or Release all answers and shares the displayed
code. Students enter it in Teacher answer release. Same-origin tabs in the same
browser update via storage events; other devices must enter the code. This is
static classroom pacing, not a remote broadcast or protection against source access.
1.6C speaking and instructional examples remain open intentionally.

Before release, check buttons are hidden/disabled and marking functions guard all
submission and restored-state paths. Students can edit answers and navigate freely.
Release never auto-marks a new answer. Storage events and pageshow refresh controls.

## Local checks

- All explicit answer variants, incorrect/blank answers, change-of-information
  diagnostics and conservative transport spelling feedback.
- Exact source option strings, Hotel numbering and all supplied new keys.
- Breakfast formatting acceptance and rejection of incomplete/wrong ranges.
- No feedback on Enter, requestSubmit, input, reload or history before release;
  old checked progress cannot bypass release.
- Separate-browser code entry, individual/all release and local tab synchronization.
- Both spelling attempts tested with the actual 20-word source, including the
  duplicate beggining option, independent shuffling and teacher-release guards.
- Precision pending keys remain unmarkable after all-answer release.
- Saved typed/radio responses, rechecking and feedback clearing after edits.
- Student and teacher overflow checks at 360, 390, 430 and 1280px.
- No embedded audio/images or browser runtime errors.

Run from the repository root with Playwright available through NODE_PATH and
Google Chrome installed:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
node --experimental-default-type=module listening/day-1/tests/check.mjs
node listening/day-1/tests/browser.cjs
node listening/day-1/tests/answer-release.cjs
node listening/day-1/tests/source-activities.cjs
```

No commit, push or publication was performed.

## Pre-answer leakage audit — 1.7 correction

The public activity title, navigation and release label now read “A London
conversation”; the note form heading is “Course information”. The four expandable
instruction examples are exactly `library`, `£45`, `12 March`, and
`on the 12th of March`. The original questions and answer key are unchanged.

`tests/answer-leakage.cjs` inspects all student-page DOM text (including hidden and
collapsed content), expanded examples and speaking models, accessibility labels,
titles, placeholders, HTML value attributes and live input values. A fresh or
blank saved unreleased page contains none of 1.7's target answers. Enter, submit,
reload and release-only states are checked. Student-entered answers remain saved;
these are student work, not authored answer hints. Actual solution feedback is
created only after teacher release and student checking. All seven answers still
mark correctly. Source code itself remains public in this static architecture.

Quick cross-activity audit: no completed score, diagnostic follow-up, correctness
indicator or typed solution is rendered before release. Authored multiple-choice
options remain visible without a correctness indication. Hotel surname, room
number and breakfast solution are not prefilled. Precision unknown keys remain
pending. No additional accidental explanatory-answer leaks were found.

Intentional source overlaps remain and must not be described as leak-free:
- Unlocked 1.6C models identify the corresponding 1.6B phrases. This follows the
  explicit requirement not to teacher-lock controlled speaking.
- 1.6B item 6 includes “all memberships”, supplying the answer to 1.6A question 4.
- 1.5 explicitly says beginners feel OK in a blank, while its later released
  follow-up supplies water; that follow-up stays guarded.
- Days/months spelling includes February, also a target in the 20-word
  challenge. The requested example library is another spelling target.

Removing these deliberate cross-activity overlaps would require changing the
specified content or access model. No such changes were made in this 1.7 fix.

## Original Spelling Challenge integration

`content/listening/day-1.js` now contains all 20 supplied word sets and exactly four
options per set. Both `beggining` entries in the beginning set are preserved as
separate selectable options. No extra distractors were generated.

Each attempt independently shuffles the question order and every option set using
Fisher–Yates. Attempt 2 has its own empty initial selections. Once created, orders
and selections persist across reloads, so refresh does not move a student's answers.
Stored sets are validated against the authored dataset, including duplicate counts.

Before teacher release, submissions cannot calculate or reveal a result. After
release, Check & reflect saves the score plus selected/correct status per word.
Attempt 1 shows only its score. Attempt 2 shows first/current scores on separate
lines and the exact neutral reflection message. No per-word answer-study list is
rendered. Editing a choice clears its attempt's stale score until checked again.

`tests/spelling.cjs` checks 40 groups/160 options, isolated selections, persistent
orders and answers, both release guards, a 20/20 then 0/20 comparison, edit/recheck,
and 360/390/430/1280px overflow. A 200-permutation check verifies varied question
orders and coverage of all four correct-answer positions. Existing answer-release
regressions now use the actual authored dataset rather than synthetic fixtures.

Only Audio 1.1–1.3 answer keys remain pending.

## Definitive source corrections

Hotel's existing questions are now numbered 1–9. Their order, content and answers
are unchanged. Because responses persist by question position, previously saved
answers remain attached to their original questions. Breakfast formatting matching
now applies to question 9, and room number is question 8.

All nine correct 1.6B alternatives reproduce the definitive supplied transcript,
including capitalization, punctuation, hesitations, numeral 2 and the full final
decision. Existing alternatives remain unchanged; item 7 uses its authored
hesitating alternative. Score denominator is now 9. Old provisional phrase state
is reset through a versioned migration; release status and other work are retained.
New attempts still independently shuffle every pair.

All nine 1.6C prompts are present. Models use the definitive wording, with the
requested final excerpt “Yeah, I think I’ll go with the black card.” They remain
one natural way, with open Show one way / Try again controls and no scoring.
1.6A is unchanged. Teacher answer release continues to control 1.6B feedback.

`tests/transcript.cjs` verifies exact text, item 7 alternative, nine-item grading,
pre-release blocking, speaking models, state migration and saved Hotel answers.

## 2026-09-21 — Shared classroom replacement (local only)

The earlier static-code release sections above describe the published historical
implementation, not cross-device broadcast. They are superseded in the working
copy by the shared Worker/SQLite Durable Object connection. See
`classroom-service/README.md` for architecture, privacy, quota calculations, owner
login steps and independent-client evidence. The new backend is not deployed and
the repository has not been committed/pushed/published. Original lesson content
and Speaking files remain unchanged.

### Deployed backend verification — 2026-09-21

Cloudflare Worker version `67e86d2a-fdcb-45f0-a83a-f6626c6b8884` is deployed.
The real-service three-isolated-client acceptance test passed (274 ms push), as did
blocked-WebSocket polling/outage recovery (4,971 ms). Public-code write denial,
eight-hour lifetime, credential-free public reads and responsive widths verified.
See `classroom-service/README.md` for the complete evidence and physical-phone
preview links. No frontend commit, push or publication occurred.
