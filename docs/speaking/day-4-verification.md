# Speaking Day 4 — local classroom build

Local student route: http://localhost:8000/speaking/day-4/
Teacher route: http://localhost:8000/speaking/day-4/teacher-control/

No commit, push or publication. No Day 1, Day 2 or shared source files changed.

## Session structure

| Stage | Screens | Suggested time |
| --- | ---: | ---: |
| Choose a way to think: Part 3 introduction and five examples | 7 | 10–12 minutes |
| Hear the thinking: external listening, overlap and transformation | 3 | 10–13 minutes |
| One question, different directions: routes and development | 3 | 7–9 minutes |
| Make your idea clearer: phone record, listen, reflect, re-record | 5 | 8–10 minutes |
| Listen and adapt: dialogue, follow-ups and combined thinking | 5 | 12–15 minutes |
| Try it on your own: optional reference and tourism discussion | 7 | 8–11 minutes |
| Total | 30 | 55–70 minutes |

There is also a completion panel, not counted as a teaching screen. Repeating a recording round adds roughly 4–6 minutes. Timing depends on the length of the five external recordings.

28 core response opportunities: five example identifications, five listening matches (each with an evidence prompt), two transformation responses, two alternative-route questions, one development comparison, one recording cycle, three dialogue observations, three examiner follow-up responses, one mixed-tool answer and five final answers. Optional help/reveals and repeat rounds are not counted separately.

## Pedagogical audit and simplifications

The sequence moves from noticing to contrasting, generating, recording, adapting and finally independent transfer. No long typed answers, browser recording, speech recognition, embedded audio or timer gates are used. Phone-clock timings are classroom suggestions, not official IELTS answer-length rules.

The five supplied examples and all three technology/children candidate turns preserve their supplied spoken wording, contractions, hesitations and paragraph breaks. Phrases absent from the city/cash examples are introduced in separate optional spoken examples rather than incorrectly presented as quotations from those transcripts. The full functional-language reference appears late and is optional.

The five external recordings were not supplied with an established order/key. Matching is intentionally discussed with the teacher, without a fabricated automatic answer key. If playback fails, the teacher can read an earlier example.

Tools overlap; feedback describes a main direction, not an exclusive category. The final dialogue answer is both conditional and future-facing. The traditional-jobs question includes an optional invitation to challenge its premise.

Phones, exercise and working from home recur in the examples/practice options. These links help transfer but may feel repetitive if the teacher chooses the same theme for every round; choose another of the seven recording topics. The full three-turn model is a long mobile scroll, retained as one coherent interaction; a collapsed copy is available on its analysis screen. Do not spend equal time teaching every reference phrase. Prioritise spoken practice, the second recording and the final unlabelled discussion.

Official procedural cross-check: IELTS describes Part 3 as a discussion of more general and abstract ideas related to Part 2, including explanation, analysis and speculation: https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking . The page keeps the examiner in control and does not describe Part 3 as free conversation.

## Classroom setup

- Have the existing five audio examples ready to play externally; confirm their order yourself before discussion.
- The technology dialogue works as text now. Any later teacher-produced audio is external and optional.
- Students use their phone recorder; speaking to a partner or recalling their answer is the fallback.
- Teacher control follows the existing static four-digit convention. Day 4 codes are explicitly provisional, not approved production codes. All-access inspection code: 9494. Individual and through-stage codes are available on the teacher page.
- This build is local. Student devices need a reachable preview host; localhost refers to each device itself. Publishing remains intentionally pending.
- Progress and release storage use Day 4-only keys. Unavailable storage falls back to the current tab; if persistence is unavailable, enter the teacher's release code on the student page itself.

## Verification

Playwright/Chrome traversed every Day 4 teaching screen at 360, 390, 430 and 1280px. Checks include teacher releases, all Continue controls without answers, tool selections, keyboard-operated reveals, five listening matches, seven recording-topic choices, retry loop, three follow-ups, unlabelled final questions, no embedded media, no horizontal overflow and no JavaScript errors. Mobile screenshots were inspected for transcript readability.

Reload persistence, reset isolation, malformed saved state and completely unavailable localStorage were exercised. A separate quota/read-only test covers release changes when older saved releases remain readable but writes fail. A Day 4-only wrapper preserves those changes in memory without modifying shared release code.

Existing Day 1 (46 screens) and Day 2 (33 screens) regression suites passed at all four widths, including their release controls and Day 2 audio playback and recording-practice flow.
