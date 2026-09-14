# Day 2 — complete-session audit (classroom release)

## Learning sequence and time estimate

33 activity screens, plus transient release-lock and completion views. Optional disclosures
and the stage navigation are not counted as separate screens.

| Stage | Screens (zero-based indices) | Classroom estimate | What students actually do |
|---|---|---|---|
| 1 Make it go somewhere | 8 (0–7) | 8–10 min | Hear/read a short answer, add one part, record twice and notice the addition. |
| 2 Meet Part 2 | 4 (8–11) | 5–7 min | Read a card and compare bullet-point notes with the short answer they produce. |
| 3 Find something to say | 4 (12–15) | 8–10 min | Choose two concrete questions and supply their own material. |
| 4 Make a map | 6 (16–21) | 9–12 min | Write short notes, speak for 45–60 seconds, identify where they ran out. |
| 5 Hear what works | 4 (22–25) | 10–14 min | Compare three performances, revisit excerpts, say one additional detail from their own earlier map. |
| 6 Do it for real | 7 (26–32) | 13–17 min | Prepare for one minute, record a long turn, listen, select a repair, record again and compare. |

Approximately 53–70 minutes of activity time; allow about 60–75 minutes in class including
release transitions. This is an editorial estimate, not a measured lesson duration. Extended
whole-class discussion, device setup or reading every optional script will lengthen it.

## Continuity and worthwhile repetition

- Stage 1's short repeat is retrieval of Day 1, not a new Part 1 unit. Keep it brisk so
  Part 2 receives most of the lesson. Eight screens are somewhat navigation-heavy; the
  user asked to preserve Stages 1–4, so their sequence remains intact.
- The family task repeats in Stages 2–3 and the Stage 5 comparison. The new recordings
  vary the person: Maryam’s sister, Khalid’s uncle and Salim’s grandfather. Stage 4's
  neighbourhood task and Stage 6's fresh helping-event task provide genuine transfer.
- Stage 4's mini attempt is worthwhile scaffolding, not a redundant full performance.
  Stage 6 is longer and deliberately adds listening, a chosen weakness and a second attempt.
- The previous partial-day ending at screen 21 was an abrupt stop. It now retains the
  student's map and directs them to listen for how another speaker continues.
- Stage 5 ends with the student saying a new detail from their own map. This closes the
  listening-to-speaking gap before the fresh final task.

## Weak or dense spots to watch in class

- Stage 2's procedure and Stage 3's model-note displays are mostly explanatory. Avoid
  reading them aloud at length: the surrounding decisions and own-material task are the
  practice. No extra lecture screens were added.
- Stage 3's two-question note entry and Stage 4's card/map page are the longest writing
  views. They remain useful; keep notes short and optional help collapsed.
- Stage 5's three performers share one comparison screen so replay does not require
  navigating backwards. Scripts are collapsed. If students read every script first, the
  activity becomes reading rather than listening; play the supplied recordings first. No listening judgment is mandatory or scored.
- Khalid is lively and has material, but sometimes loses his path. Avoid reducing him
  to grammar mistakes or turning Salim into a memorisation target. All three speakers
  make repairs. The excerpt questions identify useful actions to borrow from each.
- The Stage 5 optional observation disclosure supplies examples of what to notice. It
  should follow student choices, not replace their noticing.
- Stage 6's five comparison questions share one screen. Short response options limit
  density; “Not yet”, “About the same” and “Not sure” allow an honest outcome.
- The existing research box remains a placeholder with action prompts only. It is not
  evidence for a planning benefit. See the research TODO in day-2-verification.md.

## Production and technical limits

- content/speaking/day-2-long-turn.js contains the exact supplied Maryam/Khalid/Salim
  transcripts and relative paths to audio-11/12/13. Three optional text excerpts refer
  back to those same players; no duplicate or pending audio controls remain. No bands, browser text-to-speech or polished model-answer claims are used.
- The examiner simulation is explicitly original workshop material. It is a teacher-read
  cue, with a teacher-timed one-minute gap; no examiner MP3 was supplied. Do not
  read production directions aloud. The three examples answer the existing family card.
- Procedure source rechecked against the British Council-hosted official IELTS sample
  tasks (page 5): one minute to prepare/make notes, then a one-to-two-minute long turn.
  https://takeielts.britishcouncil.org/sites/default/files/%5Bdownloads%5D/ielts-speaking-sample-tasks-2023.pdf
- The final card is original workshop practice: describe a time someone helped you.
  The second attempt uses the SAME card and map, plus at most one chosen addition.
- Timers show preparation 1:00 and speaking 2:00. They never disable Continue or request
  microphone permissions. They pause when navigating away; a running deadline survives
  refresh and is reconciled against the current time. Students can use their phone timer.
- Phone-recorded audio remains outside the website. If recording is unavailable, students
  can speak aloud and use a listener or recall where they stopped. This is a practice
  fallback; it does not produce an automatic recording or a measured speaking assessment.
- Stage IDs and Day 2 storage keys are retained. The former Stage 6 placeholder offset
  migrates to its new start. Earlier notes/choices and Day 1 data are preserved. Existing
  releases for Stages 1–4 do not automatically release new stages; all-access can be
  entered again. Codes remain static pacing, not authentication.

## Validation

Passed local Chromium validation at **360, 390, 430 and 1280px** on 2026-09-14:

- All 33 screens, initial locks, new stage codes, all-access and teacher controls.
- No horizontal overflow, including expanded optional help and scripts; mobile screenshots
  reviewed for listening, preparation, targeting and comparison screens.
- Unanswered completion; own-note carryover; targeted action updates; both speaking timers.
- Timer start, pause, reset, reload and expiry; earlier-state migration; malformed state
  recovery and completion with localStorage unavailable.
- A simulated missing MP3 displays the audio fallback and permits Continue.
- Day 1 regression passed all four widths: all 46 screens, release codes, persistence,
  direct/saved stage guards and teacher controls.

The feedback check caught and resolved a one-choice lag before the final passing run.
Audio 11–13 are wired: measured browser durations are 41.48, 61.81 and 132.05 seconds.
Salim runs about 12 seconds over the test limit. His supplied recording is unchanged;
the interface clarifies that student attempts stop by two minutes. Phone
recordings are made and replayed outside the website; browser microphone access is unused.
This release is authorised for GitHub Pages after final validation.

## Final classroom audio validation

The complete 33-screen path passed again at 360, 390, 430 and 1280px with the final
Maryam/Khalid/Salim files: metadata resolves, each audio clock advances during playback,
only one player plays at once, autoplay is absent and displayed transcripts exactly match
the supplied text. No Stage 5 audio placeholders or transcript-pending messages remain.
All ten single-stage/through codes and all-access were verified against the teacher page.
Saved progress, timer recovery, unavailable storage and unanswered completion passed.
Day 1 passed its full 46-screen regression at every width. No workshop source contains
localhost-only links. The full lesson still has 33 screens; practice has not been cut.
