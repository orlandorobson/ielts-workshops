# English micro-practice

Open `writing/micro-practice/` on the static site. No build, dependencies, timer,
tracking, storage or student details are required.

`content.js` contains the questions, two options, answer keys, feedback and final
reveal. `engine.js` renders the activity; `activity.css` extends the workshop base
styles. For another grammar, vocabulary or cohesion activity, supply the same
content structure to `mountActivity(root, content)`. Reveal examples are optional
in meaning: use an empty array when a spelling transformation is not needed.

Each question receives a fresh Fisher–Yates option shuffle, including on retry.
Question order follows the supplied sequence. The first selection counts once;
feedback locks both choices, then an explicit Next action advances. The rule is
rendered only after all questions. Retry resets the round and its accuracy.
