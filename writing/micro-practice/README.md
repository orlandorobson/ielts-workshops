# English writing micro-practice workshop

Static, buildless workshop at `writing/micro-practice/`. The landing page links to
nine independently accessible activities. Hash links can be shared directly, for
example `#subject-verb`, `#silent-e-ing`, `#cohesion` or `#independent-writing`.

## Files and reuse

- `content.js`: activity definitions, the original ten spelling questions, supplied
  source figures, feedback, accepted alternatives and final teaching points.
- `engine.js`: navigation, reusable choice/text/writing interactions, first-attempt
  scoring, word count and local progress. `mountActivity(root, content, hooks)` also
  retains the original standalone choice-engine API.
- `activity.css`: mobile-first styles extending the existing shared workshop base.
- `checks.mjs`: content/key, shuffle-permutation, accepted-answer and word-count checks.

Choice content provides questions with a sentence, options and answer. Optional
explanations align with the original option array; the engine matches them to
shuffled display positions. Every question and retry gets a fresh Fisher–Yates
shuffle. Three-option overviews and dropdown choices also shuffle independently.
Question order follows the authored sequence.

Bank texts provide strings between gaps, a word bank, answer keys and explanations.
Punctuation texts mix strings and gap definitions. A gap may specify `accepted`
values for legitimate alternatives. Capitalisation gaps provide case options.
Teaching points are rendered only after the activity's initial recognition tasks.

## Progress and privacy

Local storage key: `ielts-writing-micro-practice-v2`. Each activity stores its
current round, locked first choices/checks, first completed round, latest result
and completion. Returning/reloading resumes checked answers; retry starts a new
round without overwriting the first completed score. Unchecked text gaps are not
saved. Storage failure falls back to memory and displays an explanatory notice.
No names, accounts, analytics, network submissions or student identifiers are used.

Writing uses a 40–60-word target and a self-review checklist. The first submitted
word count and completion are local; the actual writing is never stored. There is
no automatic grammar or writing accuracy score. The new chart is explicitly
labelled invented practice data and is separate from the supplied Saudi figures.

The original silent-e activity retains all ten questions, independent option
shuffling, corrective feedback, score, retry and the final crossed-out-e reveal.
A separate three-question extension practises second, third and together.

## Preview and check

From the repository root:

```sh
python3 -m http.server 8000
node --experimental-default-type=module writing/micro-practice/checks.mjs
```

Open `http://localhost:8000/writing/micro-practice/`.
See `VERIFICATION.md` for the browser QA record.
