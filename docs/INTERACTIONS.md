# IELTS Workshops — Interaction System

**Version:** 1.2  
**Scope:** System-wide interaction specification  
**Status:** Active interaction specification

# 1. Purpose

This document defines how learners interact with IELTS Workshops.

It translates the pedagogy and content architecture into reusable interaction behaviours.

The interaction system should help learners:

- notice;
- judge;
- construct;
- write;
- compare;
- diagnose;
- revise;
- become progressively more independent.

Interaction is not included merely to make HTML feel interactive.

Every interaction should have a learning purpose.


# 2. Core Principle

Before implementing an interaction, ask:

> **What thinking does the learner perform by doing this?**

If the answer is only:

> clicking;

> dragging;

> revealing;

> choosing the right answer;

then the interaction may not be pedagogically useful.

The interface should make thinking visible or easier to perform.


# 3. Skill Before Interaction

Do not begin by choosing an interaction type.

Begin with the skill.

For example:

Not:

> Let's make this multiple choice.

Instead:

> The learner needs to distinguish a major pattern from a true but minor detail.

Then choose the simplest interaction that allows that judgement.

The same principle applies to:

- selection;
- sorting;
- grouping;
- comparison;
- writing;
- revision.


# 4. Interaction Complexity

Prefer the lowest interaction complexity that accomplishes the learning goal.

A simple tap may be better than drag-and-drop.

Typing may be better than assembling sentence fragments.

Looking and thinking before revealing support may be better than clicking through explanatory cards.

Technical novelty has no educational value by itself.


# 5. Prototype Interaction Families

The first Academic prototype requires seven main interaction families:

1. selection;
2. judgement;
3. construction;
4. writing;
5. progressive help;
6. feedback and retry;
7. navigation with persistence.

Clear / Expand / Explore is a reusable support pattern within this system.

Do not add additional interaction families unless the prototype reveals a genuine need.


# 6. Selection

Selection is appropriate when the learner must identify something meaningful.

Examples:

- identify a visual type;
- choose major observations;
- identify information that belongs together;
- select a useful comparison.

A selection interaction should require judgement.

Do not use selection merely because it is easier to code than a richer learning action.


# 7. Single Selection

Use single selection when one choice is required.

Possible behaviour:

1. learner selects an option;
2. selection becomes visibly active;
3. learner confirms where confirmation adds value;
4. feedback appears;
5. learner may reconsider if appropriate.

Do not automatically submit on every tap if learners may reasonably want to inspect alternatives first.


# 8. Multiple Selection

Use multiple selection when several observations or pieces of information may be chosen.

Example:

> If you could tell the examiner only TWO things, what would they be?

The interface should clearly communicate the number of selections required.

Do not allow interaction mechanics to become the difficulty.

If two choices are required, make this obvious.


# 9. Judgement

Judgement activities ask learners to evaluate quality, usefulness or meaning.

They are especially important in Writing.

Possible questions include:

- Which sentence preserves the original meaning?
- Which observations give the clearest big picture?
- Which comparison tells the reader something useful?
- Is this accurate but poorly organised?
- Which version would you feel comfortable writing?

Judgement feedback should explain the consequence of the choice.

Do not reduce sophisticated judgement to:

**Correct!**

or:

**Wrong!**


# 10. More Than One Valid Answer

The interaction system must support activities where more than one answer can reasonably work.

Do not force every task into a single hidden correct answer.

Possible feedback states include:

- strong choice;
- possible choice;
- true but too narrow for this purpose;
- accurate but less useful;
- changes the meaning;
- appropriate but harder to control;
- another grouping could also work.

This is particularly important for writing instruction.


# 11. Confirming a Judgement

Where the purpose is deliberate comparison, allow the learner to inspect options before confirming.

A possible pattern is:

**SELECT → THINK → CHECK**

rather than:

**TAP → INSTANT CORRECT/WRONG**

This avoids turning reflective decisions into reaction-speed quiz behaviour.


# 12. Construction

Construction means the learner creates something rather than merely recognises it.

Possible forms include:

- typing;
- selecting information to include;
- arranging meaningful components;
- building a short sentence from conceptual elements.

Construction should move towards genuine writing as quickly as practical.

Do not overuse sentence-piece assembly.

IELTS requires learners to produce language, not solve word puzzles.


# 13. Typed Construction

For introduction and overview activities, typing should be the default production mode once the learner understands the underlying thinking.

The learner should be able to:

- type freely;
- edit freely;
- retain their response;
- request help without losing it;
- compare later without replacing it.

Do not require exact string matching against a model answer.


# 14. Evaluating Open Writing

Version 1 does not require automatic linguistic scoring.

For open writing, the system may instead support:

- self-comparison;
- guided checking;
- model investigation;
- targeted reflection;
- revision.

Do not fake intelligent assessment using simplistic keyword matching.

If the system cannot reliably evaluate an open response, do not pretend that it can.


# 15. Writing Workspace

The writing workspace is a persistent learner area rather than a disposable answer field.

It should support:

- comfortable typing;
- editing;
- paragraph breaks;
- visible text;
- word count where useful;
- persistence while support opens;
- persistence while models open;
- persistence while the learner moves between closely related stages.

The learner's text is the primary object.

Interface controls should remain secondary.


# 16. Short Writing vs Full Writing

The same underlying workspace behaviour may support different scales.

Examples:

Short:

- one introduction;
- one overview.

Longer:

- introduction + overview;
- complete Task 1 response.

Do not make a one-sentence activity visually resemble a full exam response unnecessarily.

The workspace should scale to the task.


# 17. Progressive Help

Help should normally follow:

**TRY → HINT → MORE SUPPORT → EXAMPLE**

The learner should not receive every support layer immediately.

The first support layer should preserve as much learner thinking as possible.


# 18. Hint

A hint redirects attention.

It should not normally provide the answer.

Example for an overview:

> Look at the whole graph rather than individual numbers. Which two things stand out most?

Example for an introduction:

> Have you included what is shown and the relevant time or group information?

Hints should help learners restart their thinking.


# 19. More Support

More Support may break the task into smaller decisions.

Example for an overview:

- Which category is highest?
- Which changes most?
- Do any categories behave similarly?
- Is there a large contrast?

Example for an introduction:

- What kind of visual is this?
- What does it compare?
- Who or what is being measured?
- What time period is shown?

This layer may be more explicit than a hint without automatically writing the final sentence.


# 20. Example

An example is the strongest support layer.

It may show:

- a viable sentence;
- a teaching example;
- a completed reasoning step.

Examples should appear only after an attempt or deliberate learner request where practical.

The learner's own response must remain visible or recoverable.

Do not silently replace learner writing with the example.


# 21. Need Help?

"Need help?" is the primary learner-facing entry point for progressive support.

It should feel available but secondary.

Opening it should not:

- navigate away from the task;
- erase writing;
- cover essential source information unnecessarily;
- expose every support layer at once.

The learner should be able to close help and continue naturally.


# 22. Help Should Match the Problem

Support should address the likely difficulty.

Do not provide vocabulary when the learner's problem is understanding the visual.

Do not provide a polished model when the learner only needs help noticing the main pattern.

Distinguish where practical between:

**THINKING HELP**

and:

**LANGUAGE HELP**

This distinction does not always need to be explicitly labelled for the learner.


# 23. Clear / Expand / Explore

Clear / Expand / Explore is a language-support interaction.

It is not a scoring system.

Definitions:

**CLEAR**
Language the learner can control easily.

**EXPAND**
Another useful way to express the meaning.

**EXPLORE**
Language or structures the learner may want to try.

All options must be viable.


# 24. Clear / Expand / Explore Behaviour

Do not automatically display all options.

Possible learner controls:

**Clear only**

**Clear + Expand**

**Show all**

The learner may inspect additional language when useful.

The visual treatment must not imply:

Clear = weak

Expand = medium

Explore = high band.

Do not use medal colours, stars, levels or upward ranking graphics.


# 25. Language Choice

Where useful, ask:

> Which sentence would you feel most comfortable writing?

Possible reflection reasons may include:

- clear;
- precise;
- easy to control;
- useful new language.

This encourages learner judgement rather than automatic preference for complexity.


# 26. Feedback

Feedback should answer:

> **What should the learner think about or do next?**

Feedback may:

- explain why a choice works;
- identify a changed meaning;
- distinguish important from minor information;
- point back to the visual;
- show a useful relationship;
- invite another attempt;
- lead to revision.

Feedback is part of the learning sequence, not the end of it.


# 27. Feedback Tone

Use calm, adult language.

Avoid:

- Amazing!
- Awesome!
- Oops!
- Nearly there!
- Great job!
- You smashed it!
- celebratory animations;
- confetti;
- childish encouragement.

Prefer factual responses such as:

> Yes. This identifies one of the main patterns.

> This is true, but it describes only one data point. Look again at the whole graph.

> This version changes the meaning of the original task.

> This grouping can work. Another grouping is also possible.

The tone should respect the learner as an adult.


# 28. Feedback Without Red/Green Dependence

Do not communicate meaning using colour alone.

Feedback may combine:

- text;
- subtle colour;
- border treatment;
- icons where genuinely useful;
- position;
- explanation.

Red should not dominate the experience of making a mistake.

Errors are learning information.


# 29. Retry

Where reconsideration is useful, learners should be able to retry.

Retry should not necessarily erase the previous thinking instantly.

Where technically practical, the learner should be able to understand what changed between attempts.

Do not punish retries.

Do not count lives or attempts.


# 30. Reveal

Reveal interactions are appropriate when the learner has something useful to discover after thinking.

Examples:

- reveal reasoning;
- reveal an explanation;
- reveal another viable grouping;
- reveal a model after writing.

Do not create reveal buttons merely to divide ordinary explanatory text into clicks.


# 31. Comparing Answers

Comparison should preserve the learner's answer.

A useful pattern is:

**MY RESPONSE | TEACHING EXAMPLE**

or an equivalent responsive arrangement.

The model should not visually erase or supersede the learner's work.

Possible prompts:

- What did both responses notice?
- What did the example include that yours did not?
- Did you organise the information differently?
- Is there one useful idea you want to use?


# 32. Model Investigation

Models should support investigation.

Where relevant, the learner may inspect model features through:

- Task Achievement;
- Coherence & Cohesion;
- Lexical Resource;
- Grammatical Range & Accuracy.

Selecting a criterion may highlight relevant parts of the model.

Do not highlight everything simultaneously.

Do not make annotation visually more dominant than the writing itself.


# 33. Diagnose

Diagnosis should help the learner choose an improvement target.

For the prototype, possible Academic diagnosis categories include:

- task understanding;
- meaning preservation;
- overview selection;
- grouping;
- comparison;
- data support;
- language clarity.

Diagnosis is not a fake band calculator.

It is a route to revision.


# 34. Revision

Revision should return the learner to their own writing.

Where possible:

**ATTEMPT → COMPARE → DIAGNOSE → REVISE**

The learner should edit rather than start from nothing.

This reflects real computer-based writing behaviour.


# 35. Navigation

Navigation should make progression clear without making the workshop feel like a slideshow.

Learners should understand:

- where they are;
- what they have completed;
- what comes next;
- how to return to recent work.

Avoid a permanent large course menu competing with the learning task.


# 36. Forward Movement

"Continue" or equivalent controls should appear when there is a meaningful next stage.

Do not require unnecessary confirmation after every minor action.

Some interactions may naturally reveal the next stage within the same view.


# 37. Backward Movement

Learners should be able to return to recent stages.

Returning should not normally reset completed work.

If a learner changes an earlier answer, dependent feedback may need to update appropriately.


# 38. Progress

Progress should be understated.

Possible forms include:

- section name;
- simple stage indicator;
- subtle progress line;
- compact sequence.

Avoid:

- game maps;
- XP;
- streaks;
- trophy systems;
- artificial completion percentages where they provide little value.

Progress exists to orient, not motivate through gamification.


# 39. Persistence

For Version 1, use same-device persistence where technically appropriate.

Learner work should survive:

- opening/closing help;
- moving between nearby prototype units;
- viewing examples;
- ordinary page refresh where practical.

Local browser storage is sufficient for the prototype.

Do not implement user accounts or cloud synchronisation in Version 1.


# 40. Reset

If a reset function is provided, it must be deliberate.

Do not place destructive reset controls next to ordinary navigation.

The learner should not accidentally erase substantial writing.

Where substantial work will be lost, request confirmation.


# Progression Gates and Disabled Continue

A learner should never have to guess why **Continue** is disabled.

Whenever forward progression is gated, the page must show the specific unfinished learner action clearly. Examples include:

- choose an answer;
- make every requested judgement;
- check the selection;
- write a response;
- complete the required plan;
- save the learner's attempt.

Do not rely on generic wording such as “Complete the activity to continue.” State what the learner still needs to do.

A disabled Continue control must never depend on:

- discovering that text-looking or decorative elements are secretly clickable;
- opening every explanation in a retrieval or consolidation screen;
- opening progressive help;
- viewing a teaching example;
- opening optional criteria information;
- using optional AI feedback;
- completing an optional plan;
- scrolling without a clear instructed action;
- any other invisible state condition.

Retrieval and consolidation screens may offer optional explanatory controls, but opening them must not gate progression unless inspecting them is itself the explicit learning action. Interactive elements must look and behave like controls, use native semantics where practical, support keyboard operation and visible focus, and expose state such as `aria-expanded` when relevant.

Required writing may gate progression until the learner makes and saves a meaningful attempt. Do not require the IELTS word minimum, an artificial length, help use or AI use.

For judgement activities, make the sequence visible through the controls and instructions:

**SELECT → CHECK → CONTINUE**

After an unsuccessful check, feedback must identify what the learner should reconsider. Optional support remains optional throughout the core route.


# 41. Desktop Behaviour

Desktop should make useful use of horizontal space.

For writing activities, prefer relationships such as:

**TASK / VISUAL | WRITING**

or:

**SOURCE | RESPONSE**

when both need to remain visible.

Help may appear without replacing either unnecessarily.

Do not stretch text across excessively wide lines.


# 42. Mobile Behaviour

Mobile interactions must preserve the same learning logic.

Do not merely shrink desktop controls.

Possible mobile pattern:

**TASK**

then:

**RESPONSE**

with task/support easily reopened.

Selections must remain touch-friendly.

No interaction may require hover.

Drag interactions must have a tap-based alternative.

Writing must not disappear when task/help panels open.


# 43. Prototype Unit A1 — What Am I Looking At?

### Learning purpose
Recognise the type of Academic Task 1 visual.

### Primary interaction
Visual selection.

### Behaviour
Show a visual prominently.

Ask the learner to identify it.

Possible options:

- line graph;
- bar chart;
- pie chart;
- table;
- maps;
- process.

### Feedback
Briefly confirm the visual type and, where useful, the language normally used to name it.

### Avoid
Do not turn this into six text-heavy definition cards.

The learner should learn through seeing.


# 44. Prototype Unit B1 — Read Before Rewriting

### Learning purpose
Understand the task statement before attempting paraphrase.

### Primary interaction
Information noticing.

Present:

- the visual;
- task statement.

Ask the learner to identify:

- what is shown;
- what is measured/described;
- who/where if relevant;
- when if relevant.

### Interaction choice
This may use lightweight selectable elements or short prompts.

Do not require unnecessary typing.

### Key transition
Only after meaning is established should paraphrasing begin.


# 45. Prototype Unit B2 — What Should Change?

### Learning purpose
Judge paraphrases by meaning preservation rather than amount of vocabulary replacement.

### Primary interaction
Comparative judgement.

Show the original statement and several candidate introductions.

Candidates should include:

- natural accurate version;
- excessive inaccurate/unnatural change;
- unnecessary replacement of precise terminology;
- another simple viable version where appropriate.

### Learner action
Inspect and select.

### Feedback
Explain what each choice does to meaning.

### Important
More than one sentence may be viable.

Do not force a false single-answer task if two versions genuinely work.


# 46. Prototype Unit B4 — Build an Introduction

### Learning purpose
Produce one clear introduction.

### Primary interaction
Typing.

### Initial state
Show:

- task;
- visual;
- writing area.

Do not show a model.

### Help path

**Need help?**

First:

thinking hint.

Then:

information checklist.

Then:

Clear / Expand / Explore examples if requested.

### Persistence
Learner writing remains throughout.

### Completion
Learner decides when ready to continue.

Do not automatically judge open writing as correct/incorrect.


# 47. Prototype Unit C1 — Step Back

### Learning purpose
Move from individual data points to whole-visual meaning.

### Primary interaction
Multiple selection.

Display the graph prominently.

Prompt:

> **If you could tell the examiner only TWO things, what would they be?**

Learner selects two observations.

### Behaviour
Make the two-choice limit clear.

Allow inspection before checking.

### Feedback
Discuss whether selections capture the big picture.

Do not introduce detailed overview-writing language yet.


# 48. Prototype Unit C2 — True Does Not Always Mean Important

### Learning purpose
Distinguish factual accuracy from overview usefulness.

### Primary interaction
Judgement.

Show several statements that are all or mostly factually plausible within the task design.

Some should represent:

- major patterns;
- broad comparisons.

Others:

- narrow details;
- isolated numbers.

### Learner action
Choose the strongest overview observations.

### Feedback
Use distinctions such as:

> This is true, but it is too narrow for the overview.

> This helps the reader understand the whole visual.

This interaction is about information literacy, not vocabulary.


# 49. Prototype Unit C4 — Build a Data Overview

### Learning purpose
Turn big-picture observations into an overview.

### Primary interaction
Typing.

### Initial state
Show:

- graph;
- task;
- learner writing area.

The learner writes the overview without seeing a model.

### Help path

First:

> What are the two biggest things you notice?

Then:

support for combining those ideas.

Then:

Clear / Expand / Explore language if requested.

Then:

teaching example.

### Guidance
Teach **Overall,** as a dependable option, not an IELTS requirement.

Exact figures are usually unnecessary because the overview is communicating the big picture.

Do not state that numbers are forbidden.

### Completion
Learner can compare with a teaching example and revise their own overview.


# 50. Transition Between B4 and C4

The prototype should make a conceptual change visible:

**INTRODUCTION**

> What does the visual show?

then:

**OVERVIEW**

> What does the visual tell you when you step back?

This distinction is central.

The interaction design should help learners experience the difference rather than merely read a definition.


# 51. Prototype Data

The prototype should use realistic IELTS-style task content.

Do not copy copyrighted IELTS test material unless its use is explicitly authorised.

Create original teaching visuals and task statements that reproduce the relevant task logic without reproducing published IELTS questions.

Data must be internally consistent.

Every observation, comparison and feedback statement must match the visual exactly.

Accuracy is more important than decorative sophistication.


# 52. Interaction Accessibility

All prototype interactions must support:

- keyboard navigation where practical;
- visible focus;
- touch;
- sufficient target size;
- non-colour feedback cues;
- readable text;
- understandable control labels.

Native web behaviours should be preferred where they improve reliability and accessibility.


# 53. Interaction State

Each learning unit may need to track states such as:

- not attempted;
- attempted;
- selection made;
- checked;
- hint opened;
- additional support opened;
- example viewed;
- revised.

Do not expose technical state terminology to learners.

State exists to preserve continuity and support useful behaviour.


# 54. Avoid Interaction Overload

A single learning unit should normally have one dominant learner action.

For example:

C1:

**LOOK + SELECT**

B4:

**UNDERSTAND + WRITE**

C4:

**NOTICE + WRITE**

Do not surround the main task with several competing interactive widgets.

Secondary support should remain secondary.


# 55. Prototype Instrumentation

The first prototype should be easy for us to evaluate manually.

Do not implement analytics infrastructure yet.

During testing, observe questions such as:

- Where does the learner hesitate?
- Do they understand what is clickable?
- Do they ask for help immediately?
- Does the first hint help?
- Do they understand why an answer is weak?
- Do they revise after feedback?
- Do they notice the introduction/overview distinction?
- Does the writing area feel natural?
- Do they lose track of the task?
- Does the interface encourage unnecessary clicking?

These observations should inform Version 1.1.


# 56. Interaction Quality Test

Before approving an interaction, ask:

1. What thinking is this interaction eliciting?
2. Would a simpler interaction achieve the same purpose?
3. Is the learner doing more than clicking?
4. Does the interaction preserve ambiguity where writing genuinely allows alternatives?
5. Is feedback explanatory rather than merely evaluative?
6. Does feedback lead to another useful action?
7. Can the learner retry or revise?
8. Does help preserve thinking before supplying language?
9. Does the learner retain ownership of their writing?
10. Does the interaction become quieter as independence increases?
11. Does it work with touch?
12. Does it work without hover?
13. Does it remain understandable without colour?
14. Is it respectful of an adult learner?
15. Is the digital interaction genuinely better than reproducing a worksheet?

If the answer to the final question is no, simplify or redesign the activity.


# Option Randomisation

This is a global requirement for IELTS Workshops, including future Writing, Reading, Listening, Speaking and other workshop content.

## Runtime randomisation

Where an activity contains answer options whose order has no semantic or pedagogical meaning, their displayed order must be randomised at runtime.

Do not rely on manually authored "mixed" answer positions.

The purpose is to prevent learners from gaining information from answer position.

Examples include:

- multiple-choice answers;
- viable / non-viable sentence choices;
- true / weak / strong observations presented as selectable alternatives;
- classification choices where order is irrelevant;
- judgement options where position should provide no clue.


## No learnable answer-position patterns

Do not replace fixed ordering with a designed sequence that merely looks random.

Avoid patterns such as:

- correct answers rotating through positions;
- deliberately balancing A/B/C/D according to a repeating sequence;
- avoiding the same correct position twice in a row;
- cycling positions;
- predictable alternation;
- manually distributing correct answers according to a pattern;
- any other deterministic pedagogical pattern visible to learners.

The system should not attempt to make randomness "look random" by imposing these rules.

Use genuine runtime shuffling of eligible options.

If genuine randomisation produces the same answer position several times consecutively, that is acceptable.

Answer position must contain zero pedagogical information.


## Independent activities

Eligible option sets should be shuffled independently.

The position of a correct or viable answer in one activity should not determine its position in the next activity.

Do not maintain a global sequence of correct-answer positions.


## Multiple correct / viable answers

Where several answers are valid, shuffle the complete option set normally.

Do not:

- keep viable answers together;
- keep them apart deliberately;
- place one viable answer near the beginning;
- distribute them according to a designed pattern.

Their positions should arise from the shuffle.


## Stable interaction within an attempt

Randomisation must not make the interface unstable.

Once an option set has been displayed for a learner attempt, keep that order stable while the learner:

- selects;
- checks;
- reads feedback;
- retries within the same attempt where changing order would be confusing;
- opens or closes help.

Do not reshuffle immediately after checking an answer.

A new shuffle may occur when beginning a genuinely new attempt, resetting the activity, or starting a new session where appropriate.

The implementation may store the generated option order as part of activity state when needed to preserve continuity.


## Semantic-order exception

Do not shuffle options where order itself carries meaning.

Examples include:

- chronological sequences;
- process stages;
- paragraph ordering;
- ordered scales;
- ranking tasks;
- steps in an argument;
- sentence-order construction;
- data presented in an intentionally meaningful sequence;
- any activity where determining or understanding order is part of the learning objective.

Content/data should therefore be able to specify whether an option collection is:

`shuffle: true`

or:

`shuffle: false`

or use an equivalent explicit implementation.

Do not infer blindly that every array should be shuffled.


## Accessibility

Randomisation must not damage:

- labels;
- feedback associations;
- keyboard behaviour;
- screen-reader relationships;
- stored selections;
- stable IDs.

Answers and feedback must be associated using stable IDs, never array position.

For example, logic must identify an answer by a stable semantic ID rather than assuming:

`options[0] = correct answer`.


## Randomisation implementation

Use an appropriate unbiased shuffle implementation such as Fisher–Yates or an equivalent correct algorithm.

Do not implement randomisation by sorting with a random comparator such as:

`array.sort(() => Math.random() - 0.5)`.

Use the browser's available randomness appropriately for this educational purpose.

Cryptographic randomness is not required.


## Testing requirement

For every shuffle-enabled activity, test repeated fresh attempts and verify that:

- answer positions vary;
- correct answers can appear first, middle or last;
- consecutive activities do not follow an imposed positional sequence;
- multiple viable answers are not systematically clustered or separated;
- feedback remains attached to the correct option after shuffling;
- saved learner state restores the displayed order correctly where required.

This rule applies to all future workshops.


# AI Feedback for Free Writing

This is a permanent system-wide rule for IELTS Workshops. It applies to meaningful learner-generated writing in Academic Task 1, General Training Task 1, Task 2, suitable written production in Reading or Listening, written Speaking preparation where appropriate, and future workshops.

Every genuine free-writing stage should provide an optional, task-specific AI feedback pathway after the learner has written their own response:

**WRITE → COPY FEEDBACK PROMPT → ASK AI → READ FEEDBACK → REVISE YOURSELF**

It must not become:

**ASK AI → GET ANSWER → COPY ANSWER**


## What counts as free writing

Use AI feedback when the learner independently constructs meaningful language, such as an introduction, overview, genuinely composed focus sentence, detail paragraph, revised paragraph, complete letter or essay section, or complete response.

Do not add it mechanically to single-word answers, tightly controlled gap fills, selection, classification, matching, simple reordering, or reproduction of supplied language. Before implementing an activity, ask:

> Is this genuine free writing?

If no, do not mechanically add AI feedback. If yes, implement a relevant optional feedback-and-revision pathway unless the activity specification explicitly gives a reason not to.


## Write first

The learner must make their own attempt before a feedback prompt is generated. If the field is empty, do not create a completed prompt or reveal a model answer. Show restrained guidance such as:

> Write your own answer first. Then use AI to help you check it.


## Task-specific prompts

Never substitute a generic request such as “Check my IELTS writing.” Every generated prompt must contain:

1. the IELTS task being practised;
2. the specific writing stage;
3. sufficient canonical task or visual context;
4. the learner's current response;
5. what has been taught at this stage;
6. stage-specific evaluation criteria;
7. explicit exclusions for content not yet being practised;
8. response instructions that return responsibility to the learner.

Introduction feedback should check accurate task representation, preserved meaning, natural paraphrasing, essential information, grammatical clarity and invented information. It must not demand an overview.

Overview feedback should check important big-picture information, visual support, major patterns or relationships and the ability to step back from details. It must not demand detailed figures merely to make the overview longer.

### General principles and task-specific features

Do not encode observations from one visual as though they were universal overview principles.

Separate:

**GENERAL LEARNING PRINCIPLES**

from:

**IMPORTANT FEATURES OF THIS PARTICULAR VISUAL**

General overview principles include stepping back from isolated details, identifying important big-picture information, reporting only what the visual supports, and communicating major patterns, contrasts, changes or overall structure as appropriate.

Task-specific features must derive from canonical visual content. For the Brookfield line graph these include declining car journeys, increasing bus and bicycle journeys, and the change in the most common transport type. A bar chart, pie chart, table, map or process must provide its own relevant features rather than inherit a ranking-change expectation or another line-graph-specific observation.

Task-specific features are reference points for judging whether the learner has noticed important information. They are not a mandatory checklist, one required wording or one uniquely valid overview where alternatives are defensible.

Focus feedback should check whether the sentence establishes a meaningful organising relationship. Develop feedback should check supporting evidence, useful figures, comparisons, accuracy and invented explanations. Detail-paragraph feedback should check grouping, focus, development, comparison, evidence, clarity and appropriate closure.

Reorganisation feedback should prioritise improved organisation and relationships rather than unnecessary vocabulary replacement. Complete-response criteria must not be applied prematurely to partial-writing stages.


## Common tutor behaviour

Generated prompts must tell the external AI to act as a careful IELTS writing tutor and help the learner improve their own response. The AI must:

- not rewrite the answer immediately;
- accept clear, accurate and accessible language;
- not privilege difficult vocabulary automatically;
- not invent IELTS rules;
- distinguish official requirements from useful strategies;
- allow precise technical terms to remain when replacement would be unnatural;
- avoid criticism for deliberately excluded stages;
- identify what works;
- explain the most important issue, if one exists;
- give one specific next move;
- invite the learner to revise first;
- say when the writing is already appropriate rather than inventing a weakness;
- keep feedback concise and practical.

Use the response structure:

**WHAT WORKS → CHECK THIS → YOUR NEXT MOVE**


### Minimum necessary intervention

AI feedback should encourage diagnosis before correction. Use the progression:

**PROMPT → HINT → EXPLAIN → MODEL**

Start with the least intervention likely to help the learner correct their own writing.

- If the learner can reasonably discover an error, locate or characterise it and ask a useful diagnostic question before giving the correction.
- For spelling, indicate where or how many problems exist before supplying corrected spellings when discovery is realistic.
- For grammar, prefer a focused question or hint before rewriting the structure.
- For inaccurate interpretation, direct the learner to the relevant task data and ask them to check the claim.
- Do not become cryptic. If a hint is unlikely to help, explain the problem clearly.
- If the learner requests more help after attempting revision, move progressively toward explanation and eventually a model or corrected version.

A model is available when needed, but it should not be the first response.

Within the established feedback structure:

- **WHAT WORKS** recognises successful thinking or language;
- **CHECK THIS** locates or characterises the most important issue without unnecessarily solving it;
- **YOUR NEXT MOVE** gives the learner a concrete diagnostic or revision action.

The intended cycle remains:

**WRITE → RECEIVE FEEDBACK → DIAGNOSE → REVISE**

not:

**WRITE → RECEIVE CORRECTION → COPY**


## Complete copy action

One action labelled clearly, such as **Copy AI feedback prompt**, must copy the complete task context, learner response and stage-specific instructions. The learner must not need to copy their answer separately.

After success, confirm:

> Copied. Now open your AI chatbot and paste it there.

The interface must teach the learner to write first, copy, paste into their chosen chatbot, read before requesting a model, and return to revise their own writing.


## Canonical context

An external AI cannot see the workshop page. Never refer only to “the graph above.” Derive prompt context from the same canonical content used to render the task wherever practical.

For data visuals, include categories, dates, units and values. For maps, include relevant before-and-after features and changes. For processes, include stages, order, and start/end information. The implementation must support line graphs, bar charts, pie charts, tables, maps and processes without assuming that every task contains numbers.


## Reusable implementation and privacy

Use one reusable mechanism combining:

**COMMON TUTOR INSTRUCTIONS + TASK CONTEXT + CURRENT STAGE + CRITERIA + EXCLUSIONS + LEARNER RESPONSE**

Keep stage-specific pedagogy in the content layer where practical. Do not duplicate clipboard logic in each activity.

This pathway uses copy and paste only. It must not call an AI API, transmit learner writing, add an API key, backend, authentication, embedded chatbot, automated scoring, automatic rewriting, AI model answers or internal AI chat history. The learner decides whether and where to paste the copied prompt.


## Return to revision

AI feedback must lead back to the same persistent writing field. Never overwrite the learner's response or create a disconnected AI-answer area. Preserve the original attempt and communicate:

> Read the feedback, then improve your answer here.

For substantial writing such as overviews and detail paragraphs, a short optional “What did you change?” reflection may support metacognition. It must not be scored or forced into every small activity.


## Testing requirement

For every AI-feedback-enabled stage, verify that:

- empty writing cannot generate a feedback prompt;
- the learner's exact text, including punctuation, quotation marks, apostrophes, line breaks and long responses, survives copying;
- canonical context and stage-specific criteria are correct;
- exclusions prevent premature criticism;
- the AI is told to teach, not rewrite;
- copy confirmation appears;
- the writing remains intact and persistent after copying;
- the learner can return, revise and optionally reflect;
- controls work with keyboard and touch layouts;
- the site transmits no learner writing.

Manually inspect every complete generated prompt. Where an external AI chatbot is available for development review, a representative prompt may also be pasted there to assess whether it is self-contained and pedagogically coherent.


# Plausible Distractors and Graduated Judgement

Use this global rule across IELTS Workshops:

> **PLAUSIBLE DISTRACTORS, NOT WRONG-ANSWER CARICATURES.**

Do not make a judgement activity consist of one excellent answer, one obviously irrelevant answer, one grammatically ridiculous answer and one absurd answer.

Wrong or weaker options should normally contain something that works. The learner should often need to decide:

- which works better;
- which is more relevant;
- which is clearer or more complete;
- which needs further development;
- which could work if changed;
- which serves a different purpose.

Feedback may therefore use language such as:

> A works, but…

> B fits this purpose better because…

> C could work if…

Where the learning target permits nuance, use **Yes / Partly / No** or another graduated, purpose-specific judgement instead of forcing binary right/wrong.

Multiple answers may be defensible. Store meaning, quality, feedback and acceptable alternatives against stable semantic IDs. Never infer correctness from array position. Eligible unordered sets remain independently randomised at runtime under the Option Randomisation specification.

Before approving distractors, check that linguistic difficulty is not concealing the intended judgement. Make alternatives intellectually plausible in language a developing A2–B1 learner can normally understand with available help.


# Completion and Classroom Interaction Architecture

Use these principles across IELTS Workshops:

> **CORRECTNESS ≠ COMPLETION.**

The normal learning sequence is **DO → THINK → CHECK / COMPARE → LEARN → CONTINUE**. A checked answer may lead to different feedback without controlling access to the next unit. A weaker, non-preferred or defensible alternative can still be a completed learning action. Avoid indefinite **WRONG → TRY AGAIN** loops that add no new information.

Keep these concepts separate in activity state:

- **engaged** — the learner has begun the meaningful action;
- **checked** — the learner has asked to compare or receive feedback;
- **completed** — the progression requirement has been met;
- **answer quality / diagnostic result** — information used to choose feedback, not automatically to grant access.

Use an explicit, appropriate completion policy such as **after-check**, **after-save**, **after-attempt**, **on-arrival** or **optional**. Use the smallest implementation that expresses the learning design.

Four interaction types guide that design:

- **Type A — Discover:** a reasonably determinate answer or relationship. Use **ANSWER → CHECK → EXPLANATION → CONTINUE**. A meaningful checked attempt normally allows continuation, even when the first answer was wrong; retry may remain optional.
- **Type B — Judge:** quality is graduated, interpretations may be defensible or usefulness is conditional. Use **JUDGE → DIFFERENTIATED FEEDBACK → COMPARE POSSIBILITIES → CONTINUE**. Do not hide an exact combination behind nuanced material.
- **Type C — Make:** the learner writes, plans, reasons, revises or creates a connection. Completion means a genuine attempt, normally kept or saved. Do not pretend to grade open writing automatically.
- **Type D — Understand:** communicate or consolidate a principle, process or useful terminology. Continue may be available on arrival. **INFORMATION DOES NOT NEED TO PRETEND TO BE A TASK.**

Distinguish **core action**, **optional exploration** and **help**. **ONLY THE MEANINGFUL CORE ACTION SHOULD NORMALLY GATE PROGRESSION.** Extra examples and help can deepen understanding without becoming click-all requirements. Use **EXPLORATION BEFORE CLASSIFICATION** when noticing and discussion better serve the learning goal than naming a category first.

> **CONTINUE SHOULD NOT BE DISABLED UNLESS THERE IS A GOOD PEDAGOGICAL REASON.**

The reason must be obvious from the core control or stated briefly and specifically, for example, “Choose an answer and check it first.” Never make the learner discover a hidden clickable requirement. Optional controls must not compete visually with the dominant next action.

Use accessible instruction language for sophisticated thinking: **DIFFICULT THINKING ≠ DIFFICULT ENGLISH.** Explain the action or meaning before introducing a technical label.

Retain plausible alternatives, and add these permanent tests:

> **PLAUSIBLE ALTERNATIVES SHOULD CREATE SOMETHING TO DISCUSS, NOT SOMETHING TO GUESS.**

> **DON'T TURN NUANCE INTO A PASSWORD.**

If several options are defensible, prefer Type B judgement with conditional feedback over a secret exact key. Feedback should enlarge understanding by explaining what an answer does, what works and what needs a clearer connection.

For the classroom spine, prioritise **UNDERSTAND → THINK → DISCUSS / COMPARE → BUILD → WRITE → REVISE**. **IF REDUCING INTERACTIONS CREATES MORE THINKING, DISCUSSION OR WRITING, THAT IS AN IMPROVEMENT.** Additional depth can remain optional or belong to a later self-study layer.


# Task 2 Progressive Learning Interactions

These behaviours extend the existing **Progressive Help**, **AI Feedback for Free Writing** and **Option Randomisation** systems. They do not replace them.


## Noticing before explanation

Task 2 micro-practice should frequently use:

**NOTICE → JUDGE → EXPLAIN → TRY**

Present a short sentence, pair or paragraph before lecturing about the rule. Ask the learner to inspect meaning or communicative effect. Reveal a concise explanation after the judgement, then let the learner try the language and return to their own writing.

Ask what the learner is learning to notice or control. A reveal whose only purpose is exposing ordinary explanation is not a sufficient interaction.


## Progressive help for noticing and judgement

Where appropriate, use:

**TRY → NEED HELP? → MORE HELP → EXAMPLE / EXPLANATION**

Help should reduce language difficulty or focus attention without immediately exposing the answer.

**Need help?** may:

- explain a difficult word simply;
- clarify the task;
- identify which part of a sentence to inspect;
- offer a simpler parallel example;
- ask a question that directs attention.

**More help** may:

- narrow the comparison;
- identify the important relationship without completing the judgement;
- show one analogous example;
- clarify terminology after explaining the idea.

Only the later layer supplies the full teaching explanation or model. Help must not feel remedial; use neutral controls available to everyone.


## Explain first, label second

Technical terminology may be displayed after the learner understands the communicative job.

For example, first explain:

> The writer puts two different ideas into one sentence.

Then, if useful:

> This kind of sentence is often called a complex sentence.

For passive voice, first show how focus changes; name **passive voice** afterwards. Learners must not need a linguistic label to participate successfully.


## Task 2 judgement continua

Use graduated continua when the learning goal is relative appropriacy rather than a single fact.

For register:

**TOO CONVERSATIONAL ← APPROPRIATE → UNNECESSARILY FORMAL / COMPLICATED**

For paraphrasing, allow distinctions such as:

- meaning preserved but slightly awkward;
- natural English but important meaning removed;
- accurate but unnecessarily complicated;
- clear and appropriate;
- partly successful and revisable.

For relevance or development, useful states may include:

- helps answer the exact question;
- could help if the relationship is made clear;
- related to the topic but not yet useful;
- better suited to another purpose.

Do not make a correct option visually longer, consistently simpler, uniquely grammatical or predictably positioned.


# Explore with AI

**Explore with AI** is an optional self-study interaction available at a relevant learning moment. It copies a complete prompt for the learner's external AI chatbot. It does not add an embedded API.

Use contextual invitations such as:

- Why did the writer use *although*?
- Why is this sentence passive?
- How formal should Task 2 sound?
- How can I make my claims more careful?
- What useful language can I learn for this topic?
- How can I build more useful complex sentences?

Do not make a disconnected grammar menu the primary experience. The prompt should refer to the current sentence, paragraph, question or learner need where practical.


## Explore-with-AI prompt contract

Every prompt must:

- be easy to understand;
- identify the immediate learning question;
- ask for simple explanation and accessible examples;
- explain the communicative purpose before relying on terminology;
- ask the AI to teach rather than ghostwrite;
- include a learner attempt;
- withhold answers or corrections until the learner tries;
- use **PROMPT → HINT → EXPLAIN → MODEL**;
- invite transfer back into the learner's own writing;
- avoid band-score promises and unsupported IELTS rules.

The copied prompt may include the exact current Task 2 question, sentence or learner response where relevant. It must remain self-contained because the external AI cannot see the workshop.


## Passive-voice exploration prompt

> What exactly is passive voice in English?
>
> Explain it simply. Show me how active and passive voice can change what a sentence focuses on. Explain when passive voice can improve communication and when it can make writing less clear. Give me easy examples connected to IELTS-style topics.
>
> Then give me three short sentences and let me decide whether active or passive would work better. Do not give me the answers until I try. After I answer, give me a hint before a correction, and help me apply one useful choice to my own writing.


## Simple-and-complex-sentence exploration prompt

> What are simple and complex sentences in English?
>
> Do not give me a long grammar lesson. Show me how knowing the difference can help me communicate ideas more clearly in an essay. Give me three easy things I can start experimenting with immediately without getting lost.
>
> Then let me try combining some short ideas myself. Respond constructively after I try: begin with a prompt or hint, explain if I still need help, and give a model only later.


## Contrast-and-concession exploration prompt

> Teach me how words such as *although* help me connect two ideas that seem different or opposite.
>
> Use easy examples first. Show me what the writer is doing with the two ideas. Help me notice the difference between joining ideas inside one sentence and linking one sentence to another.
>
> Then let me write three examples. Give me a hint before giving me a corrected version, and ask me where one natural concession could help my own paragraph.


## Qualification exploration prompt

> Teach me how English writers avoid making claims that are too strong or absolute.
>
> Explain *may*, *can*, *often*, *sometimes*, *tends to*, *for some people* and *in some cases* with simple examples.
>
> Then give me five claims that are too strong and let me make them more accurate. Do not correct them until I try. Give a hint first, and then ask me to check one claim in my own essay.


## Register exploration prompt

> Help me understand the difference between natural academic essay writing and writing that sounds too conversational.
>
> Pay particular attention to speaking directly to the reader with *you*. Also show me examples that are unnecessarily formal or complicated. Use easy examples.
>
> Then give me sentences to judge as **TOO CONVERSATIONAL**, **APPROPRIATE** or **UNNECESSARILY FORMAL**. Let me answer before you explain. Do not teach a blanket ban on *I*. Finish by asking me to check the writer–reader relationship in my own essay.


## Topic-vocabulary exploration prompt

> I am practising this IELTS Writing Task 2 question:
>
> [QUESTION]
>
> Teach me 10–12 useful words or short phrases for discussing this topic clearly and precisely. Keep the language accessible and useful rather than unnecessarily advanced. For each one, give me a short natural example and a simple note about how it is normally used.
>
> Then give me a short activity where I choose and use the expressions. Let me try before you correct me. Do not write the essay for me. At the end, ask whether one expression helps me communicate an idea I already have more precisely.


## Paraphrasing feedback prompt

> I am practising paraphrasing an IELTS Writing Task 2 question.
>
> **Original question:**  
> [QUESTION]
>
> **My paraphrase:**  
> [LEARNER RESPONSE]
>
> Check whether my version preserves the meaning of the original question. Point out anything I changed, added or removed. Then identify wording that sounds unnatural or unnecessarily complicated.
>
> Do not rewrite it immediately. Give me one clear hint and let me revise it myself. Keep your explanation easy to understand. If I ask for more help after revising, move from hint to explanation and only then to a possible model.


## Explore-with-AI state and return

The learner's source writing must remain intact. The interaction may store:

- the originating activity and stable content ID;
- the exact question or sentence included in the prompt;
- whether the prompt was copied;
- the learner's practice attempt;
- help depth;
- stable option order within the attempt;
- a return target.

After exploration, return to the same writing context with one concrete action. Never insert language automatically or mark use of the explored feature as success by itself.


# Task 2 Interaction Quality Test

For each new Task 2 noticing, judgement or practice interaction, verify:

1. What exactly is the learner learning to notice or control?
2. Is difficulty located in judgement and meaning rather than unnecessary vocabulary?
3. Can a developing A2–B1 learner understand the task with available help?
4. Are distractors plausible and do weaker options contain something that works?
5. Is the activity teaching communication rather than collecting grammar features?
6. Does the language point serve the writer's meaning?
7. Does it connect to one or more official Writing criteria without replacing them?
8. Does it avoid unsupported band-score or IELTS claims?
9. Is technical terminology delayed until it helps?
10. Does the first help layer focus attention without giving the answer away?
11. Can the learner try, receive progressively stronger support and revise?
12. Does optional AI support teach rather than write for the learner?
13. Does the final action transfer learning back into the learner's own essay?
14. Are unordered options runtime-randomised while order and stable associations persist within an attempt?

If not, revise the interaction.
