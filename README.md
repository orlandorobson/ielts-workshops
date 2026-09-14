# IELTS Workshops

This repository contains a lightweight static prototype for IELTS workshops.

The Academic Writing Task 1 workshop at `writing/task-1/academic/` covers visual-family orientation, introduction, overview transfer, detail-paragraph development and optional visual practice. Its six original Academic visual examples are reusable structured course assets.

The General Training Writing Task 1 core workshop at `writing/task-1/general/` develops communication literacy through WHO / WHY / WHAT, tone, bullet-point development, opening/body/closing writing, complete-letter construction, BTP self-checking, diagnosis and revision.

The shared Academic and General Training Writing Task 2 v0.1 workshop at `writing/task-2/` takes learners through understanding the question, building reasoning, organising and writing a complete essay, diagnosing and revising it, and transferring the process to a fresh question.

Genuine free-writing stages provide optional, stage-specific prompts that learners can copy into an external AI chatbot before returning to revise their own saved writing. The site does not send learner writing or call an AI service.

To preview it locally from the repository root, start any simple static server, for example:

```sh
python3 -m http.server 8000
```

Then open one of:

- `http://localhost:8000/writing/task-1/academic/`
- `http://localhost:8000/writing/task-1/general/`
- `http://localhost:8000/writing/task-2/`

## Speaking — Day 1

Open `http://localhost:8000/speaking/day-1/` for the mobile-first Speaking workshop.
It uses the shared base styles, with its own rendering and styles in `speaking/day-1/`.
Scripts, performance notes, quiz answers and palette actions are in `content/speaking/day-1.js`.
All twelve MP3s in `speaking/audio/` are wired through relative paths in
`content/speaking/audio-library.js`. Audio 1 has one player with all questions visible;
Audio 2 has three independent attempt players. The official summary follows Audio 1.
Students use their phone’s voice recorder. Progress, choices and completion are saved locally
under `ielts-speaking-day-1-v1`; the workshop still works if storage is unavailable.

Day 1 also includes small-change noticing, repair help, phrase-based language practice,
optional observation missions, real-detail practice and an optional three-attempt bank.
These are defined in `content/speaking/notice-and-practise.js` and rendered by
`speaking/day-1/notice-and-practise.js`. Yusuf’s three attempts form Audio 2.
`audio-component.js` supplies native controls, accessible labels, single-active playback
and 0.8×/1× controls for the two shadowing models. `sound-and-language.js` adds staged
shadowing, phrase practice, personal transfer and the final reflection. Day 2 has a separate local build described below.
Developer TODOs mark research references awaiting verification. Audio 7–10 display the exact supplied spoken transcripts.

### Temporary classroom release control

Stage 1 opens by default. Each later stage needs a teacher release code on each student
browser/device. The unlinked `speaking/day-1/teacher-control/` route shows single-stage,
through-stage and all-access codes, and offers local demonstrations and a confirmed reset.
This is static classroom pacing, not authentication or remote synchronisation.

`speaking/shared/release-control.js` and its CSS are reusable. Each day supplies a config
with its own storage key, progress keys, stage IDs/labels/screen starts, default unlocked
stage, release codes and all-access code. Day 1 config is in
`speaking/day-1/release-config.js`; release state persists under
`ielts-speaking-day-1-releases-v1`. Do not reuse this key for Day 2.
Reset removes only this day's progress/release keys, leaving other workshops untouched.
If browser storage is unavailable, releases last only while the page remains open.

## Speaking — Day 2

Preview `/speaking/day-2/` and `/speaking/day-2/teacher-control/` on the local static server.
All six stages are implemented (33 screens). Stages 5–6 add contrasting long-turn scripts,
a teacher-read examiner simulation, exact transcript excerpts and a timed two-attempt practice
cycle. Maryam, Khalid and Salim use audio-11, audio-12 and audio-13 with supplied spoken
transcripts. No browser TTS or microphone recording is used. Each timer has an always-available Continue route.

Day 2 keeps separate progress/release keys and codes in `speaking/day-2/release-config.js`.
Existing notes and choices are preserved. New stages need their own release or all-access.
See `docs/speaking/day-2-session-audit.md` for the integrated lesson audit, timing estimate
and audio-production notes. Procedure verification and the research TODO remain in
`docs/speaking/day-2-verification.md`. The student route is `/speaking/day-2/` and the teacher route is `/speaking/day-2/teacher-control/`.
