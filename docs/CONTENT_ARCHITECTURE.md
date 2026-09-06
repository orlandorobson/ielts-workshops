# IELTS Workshops — Content Architecture

**Version:** 1.4  
**Scope:** IELTS Writing — Task 1 architecture and Task 2 core-plus-self-study architecture  
**Status:** Active architecture specification

# 1. Purpose

This document translates the project pedagogy into an actual learner journey.

It defines:

- what learners encounter;
- in what order;
- what they are expected to think about;
- what they do;
- where support appears;
- where support fades;
- where writing occurs;
- how Academic and General Training Task 1 differ.

This is not a visual design specification.

Visual behaviour must follow `DESIGN_SYSTEM.md`.

Pedagogical decisions must follow `PEDAGOGY.md`.


# 2. Architectural Principle

Do not organise the workshop as a digital textbook.

Organise it as a sequence of meaningful learner actions.

The learner should repeatedly move through:

**NOTICE → JUDGE → BUILD → WRITE → COMPARE → DIAGNOSE → REVISE**

Not every stage requires every action.

The architecture should nevertheless favour learner activity over explanation.

Whenever possible:

**experience the problem before explaining the solution.**


# 3. Screen Does Not Mean Page

A "screen" in this document is a learning unit.

It may become:

- a complete viewport;
- part of a workspace;
- a progressive state within the same view;
- an overlay or revealed support area;
- a transition between activities.

Do not automatically create a new webpage for every numbered screen.

The important unit is the learning action.


# 4. Entry Architecture

The Writing area should lead to:

**IELTS Writing**

then:

**Task 1**  
**Task 2**

Task 2 may be visible as part of the future course structure but is not implemented from this specification.

Entering Task 1 leads to two routes:

**Academic**  
**General Training**

Academic should be visually primary/default because it is the main route for the target learners.

General Training remains clearly available and complete.

Once a learner enters one route, do not repeatedly compare it with the other route.


# 5. Task 1 Shared Orientation

Before route-specific instruction, learners need only the information necessary to begin.

Include:

- Task 1 minimum: 150 words;
- approximately 20 minutes as the standard IELTS time guidance;
- Task 2 carries twice the weight of Task 1;
- the four IELTS Writing assessment criteria;
- computer-based production context.

The four criteria should be available without requiring a large block of introductory explanation.

They may be expandable.

Computer-performance guidance may mention:

- typing;
- editing;
- paragraph breaks;
- punctuation;
- capitalisation;
- apostrophes;
- checking word count;
- managing time;
- switching efficiently between task and response.

These are performance skills, not IELTS assessment criteria.

Do not include CEFR levels or invented band conversions.


# 6. Route Selection

Present:

**Academic Task 1**

and

**General Training Task 1**

Academic may have greater visual prominence.

Route descriptions should be brief.

Academic:

> Describe and organise information from a visual.

General Training:

> Write a letter for a particular person, purpose and situation.

Do not overload route selection with teaching content.


# 7. Academic Task 1 — Journey

The Academic route follows this broad progression:

**ORIENTATE → IDENTIFY → INTRODUCE → STEP BACK → OVERVIEW → GROUP → COMPARE → SUPPORT → WRITE DETAILS → BUILD FULL RESPONSE → INVESTIGATE MODEL → REVISE → PERFORM INDEPENDENTLY**

The recommended response architecture is:

**Introduction → Overview → Detail group 1 → Detail group 2**

This is a reliable course strategy.

It must not be presented as an official IELTS-required four-paragraph formula.


# 8. Academic Stage A — Recognise the Task

## Reusable Academic visual set

The six familiar visual forms are durable teaching assets, not disposable identification examples:

- line graph;
- bar chart;
- pie chart;
- table;
- maps;
- process.

Each example must use original, internally coherent IELTS-style content and a stable semantic ID. Its canonical structured content should support reuse for introductions, overviews and later detail/grouping work without duplicating or replacing the underlying example.

The intended learning pattern is:

**FAMILIARISE BROADLY → LEARN DEEPLY → TRANSFER**

The opening should let learners see, select, inspect and switch among all six forms before introduction writing begins. A principal worked example may then provide continuity, but later encounters should recall other familiar visuals so that success does not depend on memorising one dataset.

Technical IDs remain internal. Visuals require useful accessible names, concise descriptions, readable labels and an accessible information summary. Data visuals should derive from canonical underlying values where practical; maps and processes should preserve their canonical features and stages.

Do not build an elaborate general charting framework. Use the simplest reusable rendering approach appropriate to each form.

## A1. What am I looking at?

### Purpose
Make visual identification immediate and functional.

### Content
Use the six familiar Academic Task 1 visual forms:

- line graph;
- bar chart;
- pie chart;
- table;
- maps;
- process.

### Learner action
Identify the visual type.

### Learning point
Naming the visual accurately helps the learner describe what the task shows.

### Design
The visuals should dominate.

Do not begin with a long explanation of Task 1.


## A2. Three useful families

Introduce the pedagogical grouping:

**DATA**

- line;
- bar;
- pie;
- table;
- combinations.

**CHANGE IN PLACE**

- maps.

**SEQUENCE**

- processes.

### Purpose
Prepare learners for different kinds of thinking without creating numerous memorised essay templates.

### Learner action
Sort or identify examples by family.

### Support
Minimal.

The categories should become apparent through examples.


# 9. Academic Stage B — Introduction

## B1. Read before rewriting

Present a realistic Task 1 prompt and visual.

Ask:

- What is shown?
- What is measured or described?
- Where or whom, if relevant?
- When, if relevant?

### Purpose
Establish that understanding meaning comes before paraphrasing.

### Core principle

> **Meaning first. Change second.**


## B2. What should change?

Show the original task statement and several possible introduction sentences.

Include:

- one accurate natural paraphrase;
- one version that changes too much and becomes inaccurate or unnatural;
- one version that unnecessarily replaces precise technical vocabulary;
- where useful, another simple but valid version.

### Learner action
Judge which introduction preserves meaning best.

### Feedback
Explain the effect of the writer's choices.

Do not reduce feedback to correct/incorrect.


## B3. Protect useful words

Demonstrate that not every word needs changing.

Show examples of:

- precise nouns retained;
- structural transformation;
- word-class change;
- selective synonym use;
- reordered information.

### Principle

> **Change what is easy. Protect what isn't.**

Useful low-risk language may include:

- shows;
- compares;
- compares figures for;
- provides information about;
- provides data on/about.

Do not turn this into a phrase-bank memorisation screen.


## B4. Build an introduction

Provide a new prompt.

### Learner action
Construct or type one clear introductory sentence.

### Initial state
No model answer visible.

### Support sequence
If requested:

1. identify what information must be included;
2. show a possible opening structure;
3. show Clear / Expand / Explore examples.

### Clear / Expand / Explore
All examples should be viable.

They must not imply:

**simple → better → best**.

The learner may choose the language they can control accurately.


## B5. Quick independent introduction

Provide another prompt.

Learner writes an introduction with less support.

This should be short.

The introduction section must not expand into a paraphrasing course.


# 10. Academic Stage C — Overview

## C1. Step back

Display a data visual prominently.

Do not initially ask the learner to write.

Prompt:

> **If you could tell the examiner only TWO things, what would they be?**

### Learner action
Look at the whole visual and identify what matters most.

### Purpose
Move attention from individual figures to overall meaning.


## C2. True does not always mean important

Present several accurate observations about the same visual.

Some should express major patterns or comparisons.

Others should be true but narrow details.

### Learner action
Choose the observations that give the clearest big picture.

### Feedback
Explain why a true statement can still be a weak overview choice.

### Core principle

> **Think big first. Details come next.**


## C3. Read → Look → Notice → Say It

Introduce the process:

**READ → LOOK → NOTICE → SAY IT**

READ:
title, task, labels and key.

LOOK:
the whole visual.

NOTICE:
what stands out.

SAY IT:
express the big picture clearly.

For data, ask:

> What major patterns or comparisons stand out?

For maps:

> How did the place change overall?

For processes:

> What is the overall journey?


## C4. Build a data overview

Use the same visual or a closely related one.

Learner constructs an overview.

Teach **Overall,** as a dependable default.

Do not imply IELTS requires this exact word.

Do not require exact figures in the overview.

Phrase the guidance accurately:

> Exact figures are usually unnecessary here because the overview's main job is to communicate the big picture.

Do not teach an absolute rule that numbers are forbidden.


## C5. Map overview

Use a before/after map.

Interaction should help learners perceive change.

Possible structure:

**BEFORE → AFTER → BIGGEST CHANGES**

Learner identifies the largest overall transformation before writing.

Example type:

> Overall, the area became considerably more developed, with open land replaced by housing and several new facilities added.

Do not require advanced vocabulary such as *urbanised*.


## C6. Process overview

Use a clear process diagram.

Ask:

- Where does it start?
- Where does it finish?
- Does it return to the beginning?
- Broadly, what happens?

Learner identifies the journey before writing.

Linear/cyclical terminology may be introduced after the learner understands the visual.


## C7. Independent introduction + overview

Present a new visual.

Learner writes:

- introduction;
- overview.

No multiple-choice support initially.

Optional support remains available.

After writing, learner may:

- compare with a teaching example;
- diagnose one difference;
- revise.

This is the first significant reduction in scaffolding.


## Transfer across familiar visuals

After learners understand overview thinking through a principal worked example, provide an explicit Overview Transfer Bridge before detail work.

The bridge preserves one general purpose:

> Step back and communicate the most important big-picture information.

What the learner notices changes with the information. Use the family-appropriate questions:

- data visuals: What are the main patterns, differences or relationships?
- maps: What changed overall?
- processes: What is the overall journey from beginning to end?

These are teaching categories, not official IELTS terminology.

The bridge should move from recognition to judgement and then to brief production:

1. compare the three ways of thinking;
2. choose the most important true observations in a non-line data visual;
3. distinguish individual map changes from the overall transformation;
4. write a short map overview with progressive help and optional AI feedback;
5. distinguish individual process stages from the overall journey;
6. write a short process overview with progressive help and optional AI feedback;
7. synthesise the three family questions.

The canonical overview must remain hidden before the learner attempts an eligible judgement or writing activity. This bridge establishes conceptual transfer; it does not replace later full maps or process teaching sequences. Those future branches still require their own systematic introduction, overview, grouping, detail and full-response development where appropriate.

The Academic learning rhythm is therefore:

**LEARN DEEPLY → TRANSFER ACROSS VISUAL FAMILIES → EXTRA PRACTICE**

The transfer bridge belongs to the **CORE WORKSHOP** because it establishes that the learned overview principle applies beyond one line graph. The post-core workspace is **OPTIONAL TRANSFER / SELF-STUDY PRACTICE** and does not affect completion of the core.


# 11. Academic Stage D — Information Literacy and Grouping

## D1. What is the data telling you?

Present a small dataset or graph.

Ask for meaning before language.

Possible learner observations:

- both increased;
- one remained much higher;
- the gap widened;
- two categories behaved similarly;
- one category moved in the opposite direction.

### Principle

**DATA → MEANING → LANGUAGE**

Do not begin with vocabulary for trends.


## D2. Numbers are evidence

Show a list-like paragraph that reports figures accurately but makes the reader infer the pattern.

Ask:

> Is it accurate?

Then:

> Is it organised helpfully?

### Purpose
Demonstrate that accurate number reporting is not enough.

Contrast:

> 23%, 29%, 34%, 41%

with an interpretation such as:

> The figure rose steadily from 23% to 41%.

The improvement is primarily interpretation, not vocabulary sophistication.


## D3. Why compare these?

Present several possible pairings from a dataset.

Learner decides which comparisons are meaningful.

Relationships may include:

- similar values;
- very different values;
- same direction;
- opposite direction;
- overtaking;
- widening gap;
- narrowing gap;
- similar starting point but different finishing point.

### Principle

> **Compare information when the relationship tells the reader something useful.**


## D4. Group the information

Present one complete visual.

Ask learners to create two meaningful groups.

Possible grouping logic:

- high versus low;
- similar trends;
- contrasting trends;
- strong change versus stability;
- connected map changes;
- early versus later process stages.

Do not teach:

> first half of graph = paragraph 1  
> second half = paragraph 2

unless the visual itself genuinely makes that grouping meaningful.


## D5. More than one answer can work

Show two sensible ways of grouping the same information.

### Purpose
Prevent learners from searching for a hidden official grouping.

Ask which grouping the learner finds easier to explain.

Feedback should discuss strengths and trade-offs rather than mark one automatically wrong.


# 12. Academic Stage E — Detail Paragraphs

The recommended structure is usually two detail paragraphs.

State explicitly:

> IELTS does not require exactly two detail paragraphs. We recommend two because it gives a simple way to group related information, make comparisons clear and prevent one overloaded paragraph.


## E1. Paragraph architecture

Introduce:

**FOCUS → DEVELOP → CLOSE**

FOCUS:

> What is this paragraph mainly showing?

DEVELOP:

> Which details, figures and comparisons demonstrate that?

CLOSE:

> What is the last useful thing to say about this group?


## E2. Focus

Give a selected information group.

Learner chooses or writes a sentence that establishes what the paragraph is about.

Avoid generic topic sentences that say little.

The focus should emerge from the information relationship.


## E3. Develop

Learner selects useful evidence.

This is where exact figures are normally useful.

For Task 1, development means:

- report;
- compare;
- support with relevant information.

Do not teach learners to explain why the data changed unless the task itself provides that information.


## E4. Close

Teach:

> **Close the idea. Don't add a conclusion.**

Possible closure functions include:

- final comparison;
- final position;
- distinctive relationship;
- no additional sentence because the paragraph is already complete.

Do not manufacture a closing sentence merely to satisfy the framework.

Optional help may ask:

> **Need help closing the paragraph?**

Support should respond to the actual paragraph type.


## E5. Reorganise a weak paragraph

Give an accurate but list-like detail paragraph containing the necessary information.

Learner reorganises it around meaningful relationships.

The learner should not need to invent additional data.

### Learning point

> **Good Task 1 writing isn't about finding more information. It's about organising the information you already have.**


## E6. Maps

Apply:

**FOCUS → DEVELOP → CLOSE**

to map information.

Group connected changes.

Use contextual location and change language.

Do not force a closing sentence where the information is already complete.


## E7. Processes

Apply the architecture flexibly.

Use a natural division such as:

- early/later stages;
- preparation/production;
- collection/transformation;

depending on the actual process.

Sequence must remain accurate.

Do not invent reasons or explanations that are not shown.


# 13. Academic Stage F — Full Response

## F1. Plan before writing

Present a complete Academic Task 1.

Learner identifies:

- visual family;
- what the introduction needs;
- two major overview observations;
- useful detail groups.

Planning should be brief.

Do not create an elaborate planning form that takes longer than the writing.


## F2. Write the response

Use the persistent writing workspace.

Learner writes a complete response.

Recommended architecture remains visible only if support is requested:

**Introduction → Overview → Detail group 1 → Detail group 2**

Word count may be visible.

Support should be quieter than in earlier stages.


## F3. Investigate a teaching model

Do not immediately replace the learner's writing with a model.

Present the model as something to investigate.

Where interaction permits, allow learners to examine it through:

- Task Achievement;
- Coherence & Cohesion;
- Lexical Resource;
- Grammatical Range & Accuracy.

Highlight what the writer:

- noticed;
- selected;
- grouped;
- compared;
- expressed clearly.

Do not label a homemade response as an official IELTS band unless it genuinely comes from an official scored source.


## F4. Compare

Ask the learner to compare the model with their own response.

Possible prompts:

- Did we notice the same big picture?
- Did we group the information similarly?
- Which comparisons did the model make?
- Did I report numbers or interpret relationships?
- Is there one useful language choice I want to remember?

Do not encourage copying the model wholesale.


## F5. Diagnose

Learner chooses the most useful improvement area.

Possible categories:

- understanding/selection;
- overview;
- grouping;
- comparison;
- support with data;
- organisation;
- vocabulary precision;
- sentence control.

The diagnosis should lead directly to revision.


## F6. Revise

Return the learner to their own response.

Ask for a targeted revision based on the diagnosis.

Do not end the feedback sequence at explanation.

Feedback should lead somewhere.


# 14. Academic Stage G — Independent Performance

## G1. New task

Present a fresh Academic Task 1.

The initial screen should be substantially quieter than earlier teaching stages.

Learner writes independently.

Help remains available but hidden.


## G2. Self-check

Use a short, practical check rather than a large rubric.

Possible prompts:

- Did I identify the task accurately?
- Is my overview genuinely big-picture?
- Did I group related information?
- Did I make useful comparisons?
- Did I support points with relevant data?
- Is my writing clear enough to control accurately?


## G3. Optional support after attempt

After an initial attempt, the learner may access:

- overview guidance;
- grouping suggestions;
- Clear / Expand / Explore language;
- annotated teaching model.

Support should not automatically appear before the learner tries.


## G4. Final revision

Learner makes one final revision.

The architecture should preserve both the original attempt and revised state where technically practical so that improvement can be perceived.


# 15. General Training Task 1 — Journey

General Training should not reuse the Academic writing structure.

Its central thinking problem is communication.

The route follows:

**SITUATION → WHO → WHY → WHAT → OPEN → DEVELOP → TONE → ORGANISE → CLOSE → WRITE FULL LETTER → COMPARE → DIAGNOSE → REVISE → PERFORM INDEPENDENTLY**

The memory tool is:

**BTP**

**Bullet points → Tone → Purpose**

BTP is our teaching mnemonic.

It is not official IELTS terminology.

## Implemented core reference

The first complete General Training Task 1 core workshop reuses the mature Academic learning engine while keeping its pedagogy and state separate. Its central movement is:

**UNDERSTAND THE COMMUNICATION → WRITE THE PARTS → BUILD THE LETTER → CHECK → INVESTIGATE → DIAGNOSE → REVISE**

The canonical worked scenario is structured around a tenant writing to a property manager about a recurring, non-emergency hot-water problem. The scenario object owns the situation, reader, relationship, purpose, three bullet points, communicative jobs, tone guidance, possible organisation, teaching example and AI context. Task display, activities, AI prompts and model investigation derive from this canonical object.

The route establishes two distinct frameworks:

- **WHO / WHY / WHAT** is used before writing to understand the reader, purpose and required communication;
- **BTP — Bullet points / Tone / Purpose** is used before finishing as a course self-check, not as official IELTS terminology.

The core includes genuine opening, body, closing and complete-letter writing. Each eligible free-writing stage uses the shared external-AI feedback pattern and returns the learner to the same persistent writing. The full response is actively checked with BTP, investigated against an original teaching example, diagnosed through a nearly-good extract and revised by the learner.

The scenario data model and completion view provide the foundation for a future optional practice bank with different readers, relationships, purposes and tones. This build does not populate those additional routes. Transfer should later follow:

**SAME COMMUNICATION PRINCIPLES → DIFFERENT READERS → DIFFERENT PURPOSES → DIFFERENT TONE**


# 16. General Stage A — Understand the Situation

## GA1. Who is this?

Present a realistic letter situation.

Before writing, ask:

> **WHO am I writing to?**

The learner identifies the relationship.

Possible contexts:

- friend;
- neighbour;
- colleague;
- manager;
- landlord;
- hotel manager;
- course administrator;
- organisation.


## GA2. Why am I writing?

Ask:

> **WHY am I writing?**

Learner identifies the central communicative purpose.

Examples:

- complain;
- request;
- apologise;
- invite;
- explain;
- give information;
- ask for information.


## GA3. What does this person need?

Ask:

> **WHAT does this person need from me?**

Connect this directly to the bullet points.

### Core framework

**WHO → WHY → WHAT**

This is the communication-literacy equivalent of the information-literacy work in Academic Task 1.


# 17. General Stage B — Opening

## GB1. Purpose immediately

Show several openings to the same letter.

Learner judges which one makes the purpose clear and suits the relationship.

### Principle

> The reader should quickly understand why they are receiving the letter.


## GB2. Clear / Expand / Explore

Provide contextual opening options.

These are different viable ways to communicate, not band levels.

Ask:

> Which sentence would you feel most comfortable writing?

Possible reflection:

- clear;
- precise;
- easy to control;
- useful new language.


## GB3. Write the opening

Learner writes an opening for a new scenario.

Support initially hidden.


# 18. General Stage C — Develop the Bullet Points

## GC1. Bullet points are a content map

Present the three bullet points.

Learner decides what useful information each one needs.

Do not treat them as three sentences to tick off.


## GC2. Enough for the reader

Compare:

- a response that technically mentions a bullet point;
- a response that develops it enough for the reader to understand and respond.

### Principle

> **Give the reader enough information to understand and respond.**


## GC3. Build useful detail

Learner expands a thin response.

Development should remain purposeful.

Do not reward unnecessary length.


# 19. General Stage D — Tone

## GD1. Tone comes from relationship

Use two or more contexts requiring similar content but different relationships.

For example:

- explaining a problem to a friend;
- explaining the same problem to a hotel manager.

Learner notices differences in:

- directness;
- politeness;
- vocabulary;
- greeting;
- requests;
- closing.


## GD2. Avoid binary tone teaching

Do not reduce all letters to:

**FORMAL / INFORMAL**

Real relationships may sit between these extremes.

Teach tone as:

> **How should I communicate with this particular reader?**


## GD3. Contextual language support

Offer small scenario-specific language sets rather than a large phrase bank.

For example, for a new neighbour:

- I just wanted to introduce myself...
- We've recently moved in next door...
- I don't think we've had a chance to meet properly yet.
- It would be lovely to get to know you.
- You're very welcome to come over for coffee sometime.
- If you need anything, please feel free to knock.
- We'd love you to join us.
- Looking forward to getting to know you.

Where useful, annotate the communicative function.

Allow the learner to save a small number of useful expressions to a personal language area.

Do not encourage collecting dozens of phrases.


# 20. General Stage E — Organisation

## GE1. Paragraphs have communicative jobs

Do not teach:

> one bullet point = one paragraph

as a universal rule.

Ask:

> What is this paragraph doing for the reader?

Possible jobs include:

- establish purpose;
- explain circumstances;
- provide requested information;
- make a request;
- propose an arrangement;
- resolve the communication.


## GE2. Open → Develop → Close

Introduce the broad communication architecture:

**OPEN → DEVELOP → CLOSE**

This is a dependable organisational strategy, not an official IELTS formula.


# 21. General Stage F — Closing

## GF1. What does the reader need now?

Before writing the end, ask:

> **What does your reader need at the end?**

The answer depends on purpose.

Examples:

- requested action;
- invitation;
- next step;
- response;
- acknowledgement;
- polite completion.


## GF2. Judge the ending

Compare endings that:

- stop abruptly;
- add empty formulaic language;
- appropriately complete the communication.

### Principle

> **Close the communication. Don't just stop writing.**


## GF3. Write the closing

Learner writes a contextually appropriate ending.

Clear / Expand / Explore may be available if useful.


# 22. General Stage G — Full Letter

## GG1. Plan

Present a complete scenario.

Learner identifies:

**WHO → WHY → WHAT**

then briefly plans the communicative job of each paragraph.


## GG2. Write

Use the persistent writing workspace.

Task situation and bullet points must remain easy to consult.

Learner writes the complete letter.

Support is initially quiet.


## GG3. Investigate a teaching model

Model analysis may examine:

- whether all bullet points are addressed;
- whether they are developed sufficiently;
- clarity of purpose;
- appropriateness and consistency of tone;
- paragraph organisation;
- lexical precision;
- sentence control.

Use the official assessment criteria accurately.

Do not invent a band score for a homemade model.


## GG4. Reader test

Ask the learner to imagine receiving the letter.

Possible prompts:

- Do I know why this person wrote?
- Do I have the information I need?
- Is anything unclear?
- Does the tone fit our relationship?
- Do I know what happens next?

This reinforces communication literacy rather than formula memorisation.


## GG5. Diagnose and revise

Learner selects one useful improvement.

Return directly to the writing workspace.

Revision completes the feedback loop.


# 23. General Stage H — Scenario-Based Self-Study

Create a reusable scenario bank rather than dozens of separate lesson structures.

Possible scenarios include:

- new neighbour;
- friend;
- hotel manager;
- course administrator;
- colleague;
- landlord;
- organisation.

Each scenario should create a plausible communicative problem.

Scenarios may vary:

- relationship;
- purpose;
- tone;
- degree of familiarity;
- type of information required.

Use the same persistent writing workspace.

Contextual language support should change with the scenario.


# 24. General Stage I — Independent Performance

Present a fresh task with minimal initial support.

Learner:

1. identifies WHO / WHY / WHAT;
2. writes;
3. performs a short reader-centred self-check;
4. optionally investigates support/model;
5. diagnoses one weakness;
6. revises.

The learner should increasingly be able to perform without navigating instructional screens.


# 25. Models Across Both Routes

Models serve several possible purposes:

- reassurance;
- thinking demonstration;
- language expansion;
- comparison;
- diagnosis.

Do not use models primarily as answers to copy.

Models should show what a writer did.

Where possible, annotations should connect choices to:

- meaning;
- selection;
- organisation;
- reader needs;
- clarity;
- IELTS assessment criteria.

Accessible language deserves annotation too.

Do not imply that only sophisticated vocabulary is worth noticing.


# 26. Clear / Expand / Explore Across Both Routes

Clear / Expand / Explore is a support system.

It is not a level system.

Definitions:

**CLEAR**

Language the learner can control easily.

**EXPAND**

Another useful way to express the same or similar meaning.

**EXPLORE**

Language or structures the learner may want to try.

All three may be successful writing.

Do not visually imply:

Clear < Expand < Explore.

Where useful, allow learners to choose:

- Clear only;
- Clear + Expand;
- all options.

As independence grows, this support should become less prominent.


# 27. Help Architecture

Help should normally be progressive.

A typical sequence may be:

**TRY**

then, if requested:

**HINT**

then:

**MORE SUPPORT**

then:

**EXAMPLE / MODEL**

Do not reveal every layer automatically.

Help should diagnose the likely problem where possible.

For example:

If the learner cannot write an overview, help should first return attention to the visual and ask what stands out.

It should not immediately provide a polished overview sentence.


# 28. Feedback Architecture

Feedback should lead to another learner action.

Avoid:

**answer → correct/incorrect → next**

Prefer:

**attempt → feedback → rethink → retry/revise**

Feedback may:

- explain a distinction;
- return attention to the source;
- identify a missing relationship;
- ask the learner to reconsider;
- provide a smaller step;
- show a comparison;
- invite revision.

The learner should remain cognitively involved.


# 29. Writing Persistence

Learner writing should persist when:

- opening help;
- viewing a model;
- changing support level;
- temporarily reopening the task;
- navigating closely related stages.

Do not erase writing because an interface state changes.

For Version 1, same-device local persistence is sufficient.

Cross-device accounts or cloud synchronisation are outside the current scope.


# 30. Classroom Route

The classroom experience should remain manageable.

Do not require every learner to complete every self-study branch during class.

For the Academic opening sequence, introductions and overviews should be teachable within roughly two hours.

A practical classroom progression is approximately:

- orientation and visual identification;
- introductions;
- short introduction practice;
- overview concept;
- data overview practice;
- map/process overview;
- new visual;
- independent introduction + overview;
- compare and revise.

The digital environment should allow the teacher to stop at useful checkpoints.


# 31. Self-Study Route

Self-study may go deeper than the classroom route.

It may include:

- additional examples;
- repeated scenarios;
- language exploration;
- model investigation;
- retries;
- alternative groupings;
- extra visuals;
- targeted practice based on learner difficulty.

Do not simply make self-study longer.

Each additional branch should answer a plausible learner need.

## Optional post-core Academic workspace

After the complete Brookfield core route, provide a clearly secondary **More practice** workspace. It must not delay or invalidate core completion, and it should be reachable through one high-level optional route rather than placing every practice activity in the main navigation.

Reuse the existing canonical visual set:

- bar chart, pie chart and table: inspect the task, write an introduction, write an overview, make a grouping plan, and write at least one detail paragraph;
- maps and process: inspect the task, write an introduction and write an overview only at this stage.

The workspace should use reduced scaffolding while retaining optional progressive help and task-specific AI feedback for genuine free writing. Examples must remain hidden until the learner has attempted the relevant writing or plan. Choice, writing, revision, help level and the current step should persist independently for each visual.

No Brookfield facts, expectations or language should leak into these new contexts. AI prompts and teaching examples must derive from the selected canonical visual. Maps and processes will later receive full detail-writing branches; the initial optional workspace does not pretend that introduction-and-overview practice completes those teaching sequences.


# 32. AI Feedback and Revision

Every genuine free-writing stage should include an optional, task-specific external AI-feedback pathway:

**WRITE → OPTIONAL AI FEEDBACK → REVISE**

AI remains optional; the core workshop must function without it. The workshop prepares a complete prompt for the learner to copy into a chatbot of their choice. It does not send writing, call an AI API or display an AI-generated answer.

The reusable architecture combines:

- common tutor instructions;
- canonical task or visual context;
- the current learning stage;
- what has been taught;
- stage-specific criteria;
- explicit exclusions;
- the learner's actual response.

Stage configuration belongs in the content layer where practical. Canonical context should derive from the same source used to render line graphs, bar charts, pie charts, tables, maps and processes.

The prompt should ask the AI to identify what works, explain the most important issue and give a specific next move without rewriting immediately. Feedback returns the learner to the same persistent writing field. Substantial stages may add a brief optional reflection on what changed.

Selection, classification, matching, reordering, gap fills and other controlled production do not receive AI feedback mechanically. Each new activity must first answer:

> Is this genuine free writing?

Academic feedback may address task accuracy, overview selection, grouping, comparison and evidence according to the current stage. General Training feedback may address purpose, reader, content coverage and tone. Complete-response criteria must not be applied prematurely to partial writing.


# 33. Computer-Based Performance

The architecture should periodically reinforce practical computer writing skills.

This should happen naturally during writing rather than as a separate theoretical module.

Relevant behaviours include:

- type directly;
- edit efficiently;
- create clear paragraph breaks;
- correct punctuation;
- use capitals accurately;
- use apostrophes accurately;
- monitor word count;
- move between task and response;
- revise without rewriting everything.

These are preparation skills.

Do not present them as additional IELTS assessment criteria.


# 34. Prototype Boundary

Do not implement the complete architecture immediately.

The first prototype should be a small consecutive Academic vertical slice.

Recommended first slice:

1. A1 — What am I looking at?
2. B1 — Read before rewriting
3. B2 — What should change?
4. B4 — Build an introduction
5. C1 — Step back
6. C2 — True does not always mean important
7. C4 — Build a data overview

This slice deliberately tests several different interaction types:

- visual identification;
- meaning analysis;
- judgement;
- construction;
- typing;
- information literacy;
- progressive support;
- transition from introduction to overview.

It is large enough to reveal design and interaction problems without requiring the entire course to be built.


# 35. What the First Prototype Must Test

The prototype should help answer:

- Does the learner know what to do next?
- Is the amount of text appropriate?
- Does the screen have space to breathe?
- Does the task remain visually dominant?
- Does progressive disclosure feel natural?
- Is Clear / Expand / Explore understandable?
- Does the writing workspace feel substantial?
- Can the learner consult the task while writing?
- Does help support thinking rather than replace it?
- Does the interface work comfortably on a laptop?
- Does it restructure intelligently on a phone?
- Does it feel substantially better than a PDF worksheet?
- Is illustration helping or merely decorating?
- Does the learner become less dependent on support?


# 36. Prototype Learner Test

When reviewing the prototype, imagine at least three broad learner profiles.

### Learner A — struggling / approximately IELTS 4–5 performance

Ask:

- Can this learner understand the task?
- Can support break the problem into manageable thinking?
- Is accessible language available?
- Does the learner avoid being overwhelmed by advanced models?

### Learner B — developing / approximately IELTS 6 performance

Ask:

- Does the learner have enough independence?
- Can they diagnose weaknesses rather than simply receive answers?
- Can they expand their language without being pushed into unnecessary complexity?

### Learner C — stronger / approximately IELTS 7+ performance

Ask:

- Can the learner move quickly past support?
- Is the material still intellectually useful?
- Can models and feedback sharpen selection, precision and organisation rather than teach basic formulas?

These are prototype personas, not CEFR mappings or promised score conversions.


# 37. Architecture Test

Before approving any learning unit, ask:

1. What is the learner thinking about?
2. What is the learner doing?
3. Why is this interaction better than simply explaining the answer?
4. Is the difficulty cognitive, linguistic or both?
5. What happens if the learner struggles?
6. Does the first help layer preserve thinking?
7. Is more support available if genuinely needed?
8. Does feedback lead to another action?
9. Is the learner's own writing preserved?
10. Is this presented as an IELTS requirement, our recommendation or an optional technique accurately?
11. Could this activity have been a worksheet with no meaningful loss?
12. If yes, what does HTML add?
13. Does the support eventually fade?
14. Does this prepare the learner to perform without the course?

If the digital version adds no meaningful pedagogical advantage, redesign the interaction rather than digitising the worksheet.


# 38. Task 2 — Build Your Answer

**Status:** Pedagogical design for review; not an implementation specification

This section defines the second major phase of the emerging Task 2 journey:

1. **Understand the question**
2. **Build your answer**
3. **Write the essay**
4. **Check and improve**

The purpose of **Build your answer** is to move the learner from:

> I understand what the question asks.

to:

> I have a relevant idea that I can explain and support.

The phase follows:

**EXAMPLE → JUDGE → NOTICE → BUILD → COLLECT**

Learners experience relevance and development before receiving paragraph terminology or a checking acronym. Do not begin with PEEL, PEE, TEEL, a hamburger model or another paragraph formula.


## 38.1 Canonical question and context

Use one original IELTS-style question throughout the phase so that the cognitive demand comes from increasingly careful reasoning rather than repeated topic changes:

> Some people believe that university education should be free for everyone. To what extent do you agree or disagree?

This question works because it supports several defensible positions and ideas. The workshop evaluates relevance, development and support, not whether the learner agrees with a preferred political or economic position.

An optional context illustration is useful only at the entry to Unit 1: a restrained editorial scene of adult students in a contemporary university environment. It establishes the human setting without depicting free tuition as liberating or paid tuition as exclusionary. It must contain no argumentative cue, statistic, slogan or contrast between visibly happy and distressed groups.

The phase may use a very pale muted olive or sage atmosphere, with stronger olive reserved for small structural accents and active states. Unit titles, progress text and structure must continue to identify the phase without relying on colour.


## 38.2 Learner-facing sequence

Use six compact learner-facing units. The underlying concepts are not each separate screens.


### T2-B1. Does this idea help answer the question?

**Learning purpose**  
Distinguish an idea that helps answer the exact question from information that merely shares the topic vocabulary.

**What the learner sees**  
The complete canonical question and a shuffled set of plausible ideas, including:

- free tuition may widen access for capable students whose families cannot afford fees;
- funding tuition for everyone may reduce the money available for other public priorities;
- universities need stable funding to maintain teaching quality;
- university courses commonly include lectures, seminars and independent study;
- regular exercise can help students manage stress.

**What the learner does**  
Classifies each idea as:

- **Helps answer it**;
- **Could help — make the connection**;
- **Only about the topic**;
- **Doesn't help**.

The university-funding idea is deliberately conditional: it could support disagreement or a qualified position if the learner connects funding arrangements to whether tuition should be free. Both the access and competing-public-priorities ideas directly help answer from different defensible positions. Course formats are topic-related but do not yet address whether tuition should be free; exercise is essentially irrelevant.

**Thinking required**  
The learner must test each idea against the instruction **to what extent do you agree or disagree**, not match words such as *university* or *students*.

**Feedback behaviour**  
Feedback explains the connection or missing connection. It does not label an ideological position correct. A conditional idea receives feedback showing what relationship would make it relevant rather than being rejected outright.

**Multiple-valid behaviour**  
Yes. More than one idea directly answers the question, and the conditional idea may become relevant through more than one reasoning route. Ideas whose order has no meaning are independently shuffled and retain stable semantic IDs.

**Progressive help**  
If requested: “What claim would this idea help you make about whether university should be free?” A stronger layer may ask the learner to complete: “This matters to the question because…” No model argument appears before judgement.

**Genuine writing / AI**  
No genuine writing and no external-AI feedback.

**Discovery**

> **RELATED TO THE TOPIC ≠ HELPS ANSWER THE QUESTION**


### T2-B2. What does this idea need?

**Learning purpose**  
Experience the difference between stating a relevant idea and explaining it.

**What the learner sees**  
The relevant idea:

> Free university education could improve access for students from lower-income families.

The learner first judges whether this alone is sufficiently developed. Several plausible next sentences then appear in shuffled order. They include:

- an explanation that high fees may prevent capable students from applying or attending;
- a consequence explaining that family income would have less influence on access;
- a restatement that free education would therefore improve access;
- a drift into the general fact that universities offer many subjects;
- another defensible direction explaining how reduced debt could make attendance practically possible for some students.

**What the learner does**  
Selects the sentences that genuinely move the idea forward and inspects what each one contributes.

**Thinking required**  
The learner asks **Why? How? What does this mean? What happens as a result?** These are prompts for reasoning, not compulsory sentence slots.

**Feedback behaviour**  
Feedback distinguishes explanation, consequence, repetition and topic drift. It recognises both defensible development routes and explains why repetition adds no reasoning.

**Multiple-valid behaviour**  
Yes. More than one next sentence can develop the idea effectively.

**Progressive help**  
The first hint asks what the reader still needs to understand after the opening claim. A stronger layer highlights the relationship that is missing without supplying a finished paragraph.

**Genuine writing / AI**  
No genuine writing and no external-AI feedback.

**Discovery**

> **STATING AN IDEA IS NOT THE SAME AS EXPLAINING IT.**


### T2-B3. Build the reasoning

**Learning purpose**  
Construct a short, coherent reasoning chain without turning it into a fixed sentence-count formula.

**What the learner sees**  
The full question remains available. The learner chooses or records a position, selects one relevant idea, and then encounters one prompt at a time. If controlled position support is needed, use:

- **I agree**;
- **I mostly agree**;
- **I mostly disagree**;
- **I disagree**;
- **I want to write my position differently**.

These are planning supports, not four official IELTS position categories. Do not use a percentage slider.

The reasoning prompts then appear one at a time:

1. Why or how could this be true?
2. What could this mean or lead to?
3. Does the reader need anything else to understand or accept the point?

Candidate continuations include multiple valid routes. The learner may also record their own reasoning in short notes.

**What the learner does**  
Builds:

**POSITION / ANSWER → RELEVANT IDEA → WHY / HOW → CONSEQUENCE, CLARIFICATION OR OTHER USEFUL SUPPORT**

The completed chain is shown as reasoning notes, not silently converted into polished paragraph prose.

**Thinking required**  
The learner must maintain a visible connection from each contribution back to their chosen answer. They decide whether another step adds useful support or whether the point is already sufficiently clear.

**Feedback behaviour**  
Feedback identifies broken, repeated or unsupported links and acknowledges shorter as well as longer coherent chains. It does not reward component count.

**Multiple-valid behaviour**  
Yes. Different positions, ideas, explanations and support routes can work. The sequence of functions is meaningful and must not be shuffled; eligible choices within each function may be shuffled independently.

**Progressive help**  
Begin with one diagnostic question. Then expose a small set of possible relationships such as cause, consequence, comparison, clarification or realistic situation. Language support, if requested, remains short and functional: *because*, *one reason is that*, *as a result*, *this can mean that*, *for example*, *however* and *although*. Connectors are presented as ways to express reasoning, not as the source of coherence.

**Genuine writing / AI**  
Short learner notes may be written, but this is controlled planning rather than genuine paragraph writing. No external-AI feedback.


### T2-B4. Which development helps most?

**Learning purpose**  
Judge development quality and resist the appearance of sophistication.

**What the learner sees**  
Three short developments of the same main idea, presented in runtime-randomised order:

- one mainly repeats that free tuition improves access;
- one clearly explains the fee barrier and a plausible consequence for access;
- one is grammatically competent and superficially IELTS-like, contains relevant university vocabulary and a famous-sounding invented statistic, but does not establish a convincing connection between the alleged evidence and the claim.

The third version may include wording such as “According to a 2025 Harvard study, 87% of students succeed when university is free.” Its central weakness is fabricated authority: the writer has invented a named source and precise statistic to manufacture credibility, and the claim does not demonstrate its reasoning. By contrast, a realistic hypothetical situation—such as a student from a low-income family deciding not to attend because the fees are unaffordable—is legitimate support when it clarifies the argument.

**What the learner does**  
Chooses which development helps the reader understand the point best, then diagnoses the main limitation of the other two.

**Thinking required**  
The learner evaluates relevance and reasoning rather than length, vocabulary difficulty, the presence of *for example* or the appearance of evidence.

**Feedback behaviour**  
Feedback explains consequences rather than returning only correct/incorrect. It makes explicit:

**MORE WORDS ≠ MORE DEVELOPMENT**

**DIFFICULT VOCABULARY ≠ BETTER REASONING**

**A SPECIFIC EXAMPLE ≠ RELEVANT SUPPORT**

**Multiple-valid behaviour**  
The comparison has one strongest development for this controlled contrast, but feedback must acknowledge that many other explanations and examples could support the same or an opposing position.

**Progressive help**  
If needed, ask: “After reading this, do you understand more clearly why or how the main idea works?” Then ask the learner to identify any claim that depends on invented authority.

**Genuine writing / AI**  
No genuine writing and no external-AI feedback.


### T2-B5. Write one developed paragraph

**Learning purpose**  
Turn a relevant reasoning chain into genuine learner-controlled Task 2 writing.

**What the learner sees**  
The complete canonical question, their saved position and reasoning notes, and a substantial blank writing workspace. Their planning remains reference material; it is not automatically assembled into the response.

Only now introduce **Focus → Develop → Close** as names for work the learner has already experienced:

**FOCUS**  
What is this paragraph contributing to my answer?

**DEVELOP**  
Explain and support that contribution.

**CLOSE**  
Finish when the idea's argumentative work is complete.

Do not require a special concluding sentence or a compulsory “link back to the question”. Sometimes the final useful explanation, consequence, clarification or example completes the paragraph.

**What the learner does**  
Writes and freely edits one complete body paragraph supporting their own defensible position and idea.

**Thinking required**  
The learner maintains relevance, makes the main contribution clear, explains why or how it works, adds only support the reader needs, and stops when the idea is sufficiently developed.

**Feedback behaviour**  
The application does not auto-score or rewrite the paragraph. Progressive help remains hidden until requested. A teaching example becomes available only after a genuine attempt. It may use the same or a different defensible reasoning route according to the learning purpose; neither relationship should become an automatic rule.

**Multiple-valid behaviour**  
Open-ended. Different positions, arguments, chains, examples and paragraph shapes may all be effective.

**Progressive help**  
Use **TRY → HINT → MORE SUPPORT → EXAMPLE**. First ask what contribution the paragraph makes to the answer. Next ask why/how and what the reader needs to understand. Then offer a small functional language set only if expression is the problem. Do not display a giant phrase bank or imply that connectors create reasoning.

**Genuine writing / AI**  
This is the phase's genuine free-writing stage. Optional external-AI feedback becomes available only after the learner writes and returns them to the same persistent field for revision.

AI feedback evaluates only:

- whether the paragraph contributes to answering the question;
- whether its main idea is clear;
- whether the idea is explained;
- whether the explanation is sufficiently supported or clarified;
- whether anything is irrelevant or repetitive;
- whether the reasoning is understandable;
- whether the language communicates that reasoning clearly enough.

It must not score the whole essay, demand a conclusion, criticise missing essay sections, require a statistic or example, demand difficult vocabulary or rewrite immediately. Use:

**WHAT WORKS → CHECK THIS → YOUR NEXT MOVE**

and the minimum-intervention progression:

**PROMPT → HINT → EXPLAIN → MODEL**


### T2-B6. Collect what you have learned

**Learning purpose**  
Consolidate the phase without turning it into a wall of rules, and reveal a memorable checking framework only after learners have performed its underlying actions.

**What the learner sees**  
A short retrieval prompt followed by five collected principles:

1. Choose ideas that help answer this question.
2. An idea is not yet an explanation.
3. Show why, how or what happens as a result.
4. Support means giving enough further reason or clarification—not automatically adding a statistic or study.
5. Stop when the idea has done enough useful work.

The workshop then reveals:

**AES = Answer everything · Explain · Support**

AES is explicitly labelled **our checking tool**, not official IELTS terminology or an official IELTS structure. The reveal should feel like “You have already been doing these things”, not the introduction of another formula. It acts as a bridge to later full-response checking.

**What the learner does**  
Recalls or selects the principles they used, then maps their own work onto Answer, Explain and Support. They identify one part of their paragraph they may revisit; no artificial weakness is required.

**Thinking required**  
The learner connects actions already performed to a concise checking memory and distinguishes building help from official assessment criteria.

**Feedback behaviour**  
Feedback confirms accurate reflection and redirects misconceptions such as “support always means an example”. It reminds learners that this phase primarily supports official **Task Response** and **Coherence and Cohesion**, and supports language criteria secondarily through clear expression.

**Multiple-valid behaviour**  
Reflection may yield different legitimate revision priorities.

**Progressive help**  
A compact recap may be revealed; no new model essay or terminology layer is added.

**Genuine writing / AI**  
The learner may return to revise the paragraph, but this consolidation does not create a second AI-feedback stage.


## 38.3 Explanation and support

Do not impose a rigid linguistic boundary between explanation and support. Their functions often overlap.

Use this learner-facing distinction:

**EXPLAIN → Help the reader understand why or how the idea works.**

**SUPPORT → Give enough further reason or clarification for the reader to understand or accept the point.**

Support may be further reasoning, a consequence, comparison, specific situation, clarification, realistic example or relevant evidence that the learner genuinely knows. A consequence can both explain and support; an example can clarify an explanation; further reasoning can perform both functions. Judge what the writing does for the reader rather than forcing every sentence into one category.

Do not teach support as a compulsory sentence beginning *For example*. Learners may use realistic hypothetical examples and situations. They do not need to invent facts, statistics, research, surveys, experts, government reports, named studies or country claims to make an argument sound stronger. The problem is fabricated authority, not the legitimate use of a plausible hypothetical situation.

Use this explicit principle:

> **You can use realistic examples and situations. You do not need to invent facts, statistics or authorities to make your argument sound stronger.**

Core principle:

> **Support means giving the reader enough further reason or clarification to understand or accept the point.**


## 38.4 Phase boundaries

This phase does not teach the complete essay, a fixed paragraph template or a catalogue of arguments. It does not authorise Task 2 implementation, a question bank, scoring, band prediction, embedded AI, a backend or illustration generation.

This section specifies **Build your answer**. The later sections specify **Write the essay** and **Check and improve** while preserving the shared Task 2 journey and design-only boundary.


# 39. Task 2 — Write the Essay

**Status:** Pedagogical design for review; not an implementation specification

This section defines the third major phase of the Task 2 journey. Its central learner problem is:

> I can develop an idea. How do I turn my answer into a complete, organised essay?

Begin with the functions the particular answer must perform, not a paragraph count or template. The phase continues:

**EXAMPLE → JUDGE → NOTICE → BUILD → COLLECT**

It applies the reasoning developed in Phase 2 while moving towards an independently written complete essay.


## 39.1 Canonical-question decision

Continue using the familiar university-fees question during this first organisation and full-writing sequence:

> Some people believe that university education should be free for everyone. To what extent do you agree or disagree?

Continuity reduces topic and idea-generation load, allows the learner to reuse or revise their own position and reasoning, and keeps attention on whole-essay organisation. Reuse must remain learner-controlled; the application does not silently insert earlier prose.

Transfer to a fresh question belongs at the end of **Check and improve**, after the organisational principles have been learned. This creates the progression:

**LEARN / ORGANISE → FAMILIAR QUESTION**

**PERFORM / TRANSFER → FRESH QUESTION**


## 39.2 Learner-facing sequence

Use seven compact learner-facing units. Several concepts are deliberately combined where they serve one coherent judgement.


### T2-W1. What jobs does this essay need to do?

**Learning purpose**  
Identify the argumentative or communicative jobs created by the exact instruction before thinking about paragraphs.

**What the learner sees**  
Several familiar recurring question patterns, clearly described as examples rather than an exhaustive taxonomy:

- To what extent do you agree or disagree?
- Discuss both views and give your own opinion.
- What are the advantages and disadvantages?
- Do the advantages outweigh the disadvantages?
- What problems does this cause and what solutions can you suggest?
- Why is this happening? Is this a positive or negative development?

Each is paired with possible jobs for the response as a whole.

**What the learner does**  
Selects the jobs the exact instruction requires. For example, *discuss both views and give your own opinion* requires the response to discuss one view, discuss the other and establish the writer's own position. It does not itself prescribe where each job must appear.

**Thinking required**  
The learner distinguishes what the response must accomplish from familiar essay-type labels and paragraph arrangements.

**Feedback behaviour**  
Feedback explains omitted, added or misread jobs and returns attention to the instruction words. It does not convert jobs automatically into a paragraph template.

**Multiple-valid behaviour**  
The required jobs derive from each instruction, but their later organisation may vary. Eligible unordered job choices are shuffled with stable IDs; question wording remains in semantic order.

**Progressive help / writing / AI**  
A first hint asks what the examiner still needs to learn from the response. No genuine writing and no external-AI feedback.

**Discovery**

> **LET THE QUESTION DETERMINE THE JOBS THE ESSAY MUST DO.**


### T2-W2. Which plan works?

**Learning purpose**  
Move from essay jobs to coherent paragraph contributions and judge depth against idea quantity.

**What the learner sees**  
The canonical question and several plausible plans, including:

- a clear four-paragraph plan with an introduction, two developed body focuses and a conclusion;
- a coherent alternative organisation that uses a different number or grouping of body paragraphs;
- a plan that lists many briefly mentioned ideas but gives none enough space to develop;
- a plan whose paragraphs share university vocabulary but do not collectively answer whether tuition should be free.

**What the learner does**  
Judges which plans could answer clearly, which might work with a specific adjustment and which do not yet answer the task. The learner compares many brief ideas with fewer developed contributions.

**Thinking required**  
For each paragraph, ask: What is it contributing? Which ideas belong together? Would combining them make the reasoning clearer or less clear? Does the plan leave room to explain and support its main ideas?

**Feedback behaviour**  
Feedback supports more than one defensible organisation. It distinguishes **Works well**, **Could work — think about…** and **Doesn't yet answer…** without false precision.

**Multiple-valid behaviour**  
Yes. A plan is not marked wrong merely because it differs from the recommended default.

**Progressive help / writing / AI**  
Help first highlights the essay jobs identified in W1, then asks the learner to label each proposed paragraph's contribution. No genuine writing and no external-AI feedback.

**Discovery**

> **PARAGRAPHS HELP ORGANISE THE JOBS OF THE ANSWER.**

> **FEWER DEVELOPED IDEAS CAN BE STRONGER THAN MANY UNDEVELOPED IDEAS.**


### T2-W3. Do these paragraphs work together?

**Learning purpose**  
Understand paragraph-to-paragraph coherence and position consistency as relationships in reasoning rather than the presence of connectors.

**What the learner sees**  
Short essay plans or paragraph summaries for the same question. One has a recognisable progression; one repeats essentially the same contribution under different wording; one changes topic; and one uses *Firstly*, *Moreover*, *Furthermore* and *On the other hand* while its reasoning remains disconnected.

A focused position-consistency example shows:

- introduction: the writer mostly agrees;
- first body contribution: supports agreement;
- second body contribution: strongly argues the opposite with no qualification;
- conclusion: the writer completely agrees.

**What the learner does**  
Diagnoses progression, repetition, topic drift and inconsistency. The learner then chooses or writes a small qualification that lets the writer recognise another side without losing the overall position.

**Thinking required**  
Ask whether the paragraphs perform different useful jobs, make sense together, advance one intelligible answer and preserve a coherent position where the question requires one.

**Feedback behaviour**  
Feedback explains why connectors cannot repair unrelated or contradictory reasoning. It accepts qualified positions and never demands a simplistic one-sided essay.

**Multiple-valid behaviour**  
Yes. More than one qualification and more than one coherent progression can work.

**Progressive help / writing / AI**  
The first hint temporarily removes the connectors and asks whether the underlying sequence still makes sense. A stronger layer maps each paragraph to its contribution. Only a short qualification may be written; no external-AI feedback.

**Discoveries**

> **COHERENCE IS NOT CREATED BY ADDING MORE CONNECTORS.**

> **YOU CAN RECOGNISE ANOTHER SIDE WITHOUT LOSING YOUR POSITION.**


### T2-W4. Do the beginning and ending fit the answer?

**Learning purpose**  
Return briefly to the introduction without reteaching it, and discover the conclusion's function by judging how the essay's two ends relate to the developed answer.

**What the learner sees**  
The familiar question, a concise body plan and an introduction written before that plan was finalised. The learner asks:

> Does this introduction still match the answer the essay is now going to give?

The same essay then receives several plausible conclusions in shuffled order:

- one copies the introduction almost exactly;
- one closes the developed argument and communicates the overall position clearly;
- one introduces a substantial new reason that the body has not developed;
- one uses impressive vocabulary but leaves the position unclear.

None should be absurdly weak.

**What the learner does**  
Identifies whether the introduction needs a small revision, judges which conclusion best finishes the actual answer and diagnoses the limitation of the alternatives.

**Thinking required**  
The learner treats revision as normal when planning changes the answer, then asks what the reader needs at the end.

The introduction remains functional: establish the subject or question clearly enough, set up the answer, and make the position identifiable when the instruction requires one. Do not prescribe *sentence 1 = paraphrase, sentence 2 = thesis, sentence 3 = outline*. Do not require or ban *This essay will…*, and do not require a hook, background history, rhetorical question or elaborate paraphrase.

**Feedback behaviour**  
Feedback focuses on task fit, consistency and closure rather than synonym replacement. It accepts simple dependable phrasing such as *In conclusion,* and does not rank *In conclusion* against *To conclude*.

**Multiple-valid behaviour**  
Several wordings could close the answer effectively. The controlled comparison may have one strongest option because of the deliberately supplied body plan, not because one conclusion formula is universally correct.

**Progressive help / writing / AI**  
A hint asks what position and main answer the body actually established. The learner may revise the saved introduction, but this is not a second introduction lesson. No external-AI feedback.

**Discovery**

> **CLOSE THE ANSWER. DON'T START A NEW ONE.**


### T2-W5. Make a quick plan

**Learning purpose**  
Create a useful, exam-facing plan that is light enough to use under time pressure.

**What the learner sees**  
The complete canonical question and five compact planning prompts:

- **My job:** What must this essay do?
- **My position:** If the task requires one, what do I think?
- **Body 1:** What is its main contribution?
- **Body 2:** What is its main contribution?
- **Check:** Do these contributions answer the job without repeating each other?

The learner may add or remove a body contribution when another coherent structure is genuinely preferable. The interface must not imply that two body paragraphs are mandatory.

**What the learner does**  
Creates brief notes, reviews whether the introduction still fits and decides what the conclusion will need to close. The plan records thinking, not finished sentences.

**Thinking required**  
The learner selects and groups major contributions while preserving a coherent answer and enough space for development.

**Feedback behaviour**  
The plan is not auto-scored or converted into prose. Optional checking asks whether every required job has somewhere to be performed and whether any two contributions duplicate one another.

**Multiple-valid behaviour**  
Open-ended. Different positions and organisations can work.

**Progressive help / writing / AI**  
Earlier phases may have scaffolded position, explanation and support deeply. Here those subfields disappear. A small optional reminder can reopen them, but the default plan remains brief. No external-AI feedback.

**Progression**

> **SCAFFOLD DEEPLY → FADE SUPPORT → PLAN QUICKLY**


### T2-W6. Write the essay

**Learning purpose**  
Produce a complete, independently controlled Task 2 response using the learner's own plan and reasoning.

**What the learner sees**  
The complete question, an editable writing workspace, live word count and a compact way to reopen the lightweight plan. The learner's revised introduction and earlier body work remain available for deliberate reuse, but nothing is silently inserted.

The task information distinguishes:

- **IELTS requires:** at least 250 words;
- **We recommend:** approximately 40 minutes for Task 2 within the Writing test because Task 2 carries more weight than Task 1.

Any more detailed planning, writing or checking time split is a workshop strategy, never an IELTS requirement.

**What the learner does**  
Writes, edits, moves text, creates paragraph breaks, consults the task and plan, monitors word count and revises their own complete essay.

**Thinking required**  
The learner performs the essay's required jobs, develops paragraph contributions through **Focus → Develop → Close**, maintains a coherent position where needed and closes the whole answer without beginning a new argument.

**Feedback behaviour**  
The application does not auto-construct, auto-score, correct or replace prose. Progressive help is optional and secondary. The full writing remains accessible below 250 words.

**Multiple-valid behaviour**  
Fully open-ended. Different defensible positions, arguments, structures and language choices are accepted in principle.

**Progressive help / writing / AI**  
This is genuine full-essay writing. Help begins with a diagnostic choice—question/job, organisation, idea development, position, conclusion or language—rather than exposing a template. Optional external-AI feedback becomes available only after a genuine attempt and returns the learner to the same persistent essay field.


### T2-W7. Review the structure and collect

**Learning purpose**  
Inspect the learner's own essay as a complete answer, revise where there is a reason and consolidate only the most useful Phase 3 principles.

**What the learner sees**  
Their complete essay beside a short structural review:

- Does the essay perform the jobs created by the question?
- What useful contribution does each paragraph make?
- Do the ideas progress without unnecessary repetition?
- Is the position consistent where required?
- Does the conclusion close the answer without adding a major new argument?

AES may recur quietly as a familiar reminder but is not retaught. Its major active checking role belongs in **Check and improve**.

**What the learner does**  
Labels or summarises paragraph contributions, identifies one justified revision priority and returns to the same essay to revise. The learner is not forced to invent a weakness.

**Feedback behaviour**  
Feedback directs attention to relationships in the learner's answer rather than rewarding paragraph count or connector density.

**Multiple-valid behaviour**  
Different effective structures and different justified revision priorities are supported.

**Progressive help / writing / AI**  
No new AI request is required; the learner may use the existing W6 prompt after revising. The phase ends with a short collection:

1. Let the question determine the jobs.
2. Use paragraphs to organise those jobs clearly.
3. Prefer developed contributions to a list of brief ideas.
4. Keep the overall position coherent when one is required.
5. Close the answer without opening a new argument.

The reliable four-paragraph strategy is recalled as an option, not added as a sixth rule.


## 39.3 Reliable structure without prescription

For many Task 2 responses, recommend:

**INTRODUCTION → BODY PARAGRAPH 1 → BODY PARAGRAPH 2 → CONCLUSION**

Label this explicitly:

> **A reliable strategy for many essays—not an IELTS requirement.**

It is dependable because it gives space to establish the answer, develop major contributions, organise the response clearly and close it within a manageable exam-time structure. It does not guarantee quality, and paragraph count must not become a proxy for Task Response or Coherence and Cohesion.

Four paragraphs are not automatically good; five are not automatically wrong. Another structure is valid when it answers the exact task coherently. Avoid unnecessary structural complexity where a simpler plan serves the learner and question.

For many learners, two well-developed main body focuses are also a dependable strategy because they can be explained and supported within the available time. This is not an official requirement. Fewer developed ideas may be stronger than many ideas that are only mentioned.

Paragraphs organise the jobs of the answer. Do not teach **one question part = one paragraph** or **one idea = one paragraph** as an absolute rule. The useful test is whether grouping makes each contribution and the response as a whole clearer.


## 39.4 Body-paragraph function

Phase 3 applies rather than reteaches **Focus → Develop → Close**:

**FOCUS**  
What useful contribution is this paragraph making to the answer?

**DEVELOP**  
Explain and support that contribution sufficiently. Explanation, consequence, comparison, qualification, example and further reasoning may appear in different useful combinations.

**CLOSE**  
Stop when the argumentative work is complete.

Do not require a fixed sequence of topic sentence, explanation, example and link. Do not require a special concluding sentence or compulsory link back to the question in every paragraph.


## 39.5 Word count and performance conditions

IELTS Writing Task 2 requires at least 250 words. Show a live word count and communicate the requirement calmly.

Below 250 words, display:

> **IELTS requires at least 250 words.**

At or above 250 words, do not celebrate, announce completion or imply that content, reasoning, organisation or language is sufficient. Word count provides requirement awareness, not quality scoring.

Never use 250 words as a hard gate for checking, AI feedback, diagnosis, revision or appropriate navigation. A shorter response must remain available for the learner to diagnose and improve.

Computer-based performance remains a quiet strand: typing, paragraph breaks, editing, moving text, consulting the question and plan, monitoring word count and maintaining focus while revising. These are performance skills, not IELTS scoring criteria.


## 39.6 Full-essay AI feedback

After a genuine W6 attempt, offer optional external-AI feedback using the established reusable prompt system. The complete prompt includes the exact Task 2 question and instruction, relevant task-analysis context, the learner's complete response and the current learning stage.

Evaluate through the official IELTS criteria without returning a band score:

**Task Response**

- Does the response answer the actual question and address every required part?
- Is the position clear and consistent where required?
- Are the main ideas relevant, sufficiently explained and supported?

**Coherence and Cohesion**

- Is the answer logically organised?
- Does each paragraph make a useful contribution?
- Do ideas progress clearly without unnecessary repetition?
- Do linking devices help rather than substitute for coherent reasoning?

**Lexical Resource**

- Is vocabulary clear, appropriate, natural and sufficiently varied to communicate the argument?
- Do not demand supposedly advanced vocabulary.

**Grammatical Range and Accuracy**

- Is meaning clear?
- Which recurring grammatical problem, if any, is the most useful priority because it interferes with communication?
- Do not correct every sentence mechanically.

The AI must not claim to be an official IELTS examiner, give a band score, immediately rewrite the essay or invent a weakness. Preserve:

**WHAT WORKS → CHECK THIS → YOUR NEXT MOVE**

and:

**PROMPT → HINT → EXPLAIN → MODEL**

Feedback returns the learner to the same persistent essay for self-revision.


## 39.7 Visual direction and phase boundary

Use a very pale warm-sand or restrained-ochre atmosphere for **Write the essay**, with stronger colour limited to small structural accents and active states. Textual phase labels and navigation must remain primary.

Do not add a new context illustration in this phase. The university setting was established in Phase 2; here, a large, calm writing workspace has the clearer visual job. An occasional non-illustrative phase transition may use the warm-sand atmosphere itself.

This phase particularly develops the official **Task Response** and **Coherence and Cohesion** criteria, while clear expression also contributes to **Lexical Resource** and **Grammatical Range and Accuracy**. **Topic → Task → Limits**, **Focus → Develop → Close**, AES and the reliable four-paragraph strategy remain workshop tools or strategies, not official IELTS criteria or structures.

This section does not authorise Task 2 HTML, JavaScript, CSS, illustration generation, a question bank, scoring, band prediction, embedded AI, a backend or accounts. Existing Academic and General Training Task 1 workshops remain unchanged. **Check and improve** is specified separately in Section 40.


# 40. Task 2 — Check and Improve

**Status:** Final pedagogy-only phase design for review; not an implementation specification

This section defines the fourth major phase of the Task 2 journey. Its central learner problem is:

> I have written my essay. What should I check, what matters most, and what should I change?

The phase is organised around:

**DIAGNOSE → PRIORITISE → REVISE → TRANSFER**

Checking must lead to learner action. Do not ask the learner to fix everything simultaneously or complete a long passive checklist.

Phase 3 ends with W7 asking whether the essay matches its intended organisation. W7 remains structural only. Phase 4 does not repeat that activity; it widens the lens to the quality and effectiveness of the completed response.


## 40.1 Learner-facing sequence

Use six compact learner-facing units. AES, the official criteria, AI feedback, examples and transfer are integrated into the diagnostic and revision movement rather than becoming separate theory lessons.


### T2-C1. What needs attention?

**Learning purpose**  
Make AES operational by diagnosing a plausible completed response before receiving commentary.

**What the learner sees**  
A nearly-good essay responding to the familiar university-fees question. It has competent grammar, plausible vocabulary, clear paragraph breaks and visible connectors. Its first main idea about access is relevant and reasonably developed. Its second body paragraph mentions university funding but does not explain the consequence well enough, and its conclusion changes a previously qualified position into complete agreement.

Do not load this essay with every possible weakness. Its two central problems are an underdeveloped important idea and an inconsistent final position.

**What the learner does**  
Uses a concise AES lens:

**ANSWER**

- Did the essay answer the actual question and perform every job in the instruction?
- Is the position clear and consistent where one is required?

**EXPLAIN**

- Can the reader understand why or how the important reasoning works?

**SUPPORT**

- Is there enough further reasoning, consequence, comparison, clarification, situation or example where it is needed?

The learner marks passages that work and chooses the one or two areas that need attention before revealing commentary.

**Thinking required**  
The learner looks beyond IELTS-like appearance, paragraphing and connectors to whether the response actually answers and develops the task.

**Feedback behaviour**  
Feedback acknowledges successful communication first, then locates the two meaningful weaknesses without rewriting them. It prompts the learner to check the funding paragraph and compare the position in the introduction and conclusion.

**Multiple-valid behaviour**  
More than one diagnostic observation may be defensible. Feedback distinguishes a central problem from a useful secondary observation rather than forcing every learner to select identical wording.

**Progressive help / writing / AI**  
The first hint asks what the essay promises to argue and whether that promise remains stable. A stronger hint asks what the funding paragraph enables the reader to understand. No genuine writing and no external-AI feedback.

**Discovery**

> **LOOKS LIKE AN IELTS ESSAY ≠ FULLY ANSWERS THE QUESTION WELL**


### T2-C2. What should be fixed first?

**Learning purpose**  
Prioritise revisions according to their effect on the answer rather than treating all issues as equal.

**What the learner sees**  
Several possible changes to the nearly-good essay:

- align the conclusion with the writer's qualified position;
- develop why university funding matters to the free-tuition judgement;
- replace a clear word such as *important* with *significant*;
- correct one minor punctuation error;
- add another connector at the beginning of a paragraph.

The options are plausible and runtime-randomised. Their semantic priority is stored independently from display position.

**What the learner does**  
Selects the first revision priority and explains what it would improve. The controlled example treats the inconsistent position as the first priority because it affects the answer as a whole; development of the funding idea is the next substantial priority. The activity makes clear that another essay may require a different order.

**Thinking required**  
The learner asks which problem most affects whether the response answers clearly, then which issue most affects reasoning and organisation, before polishing local language.

**Feedback behaviour**  
Feedback explains impact rather than suggesting that punctuation or vocabulary never matters. It contrasts superficial substitution—*important → significant*, *good → beneficial*, *bad → detrimental*—with revisions that clarify meaning, add missing reasoning, remove irrelevant material, repair position or organisation, and correct language that obscures communication.

**Multiple-valid behaviour**  
For this controlled response there is a defensible first priority, but useful secondary priorities are acknowledged. In learner writing, priorities remain response-specific.

**Progressive help / writing / AI**  
A hint asks: “Which change would most affect the reader's understanding of the writer's answer?” No genuine writing and no external-AI feedback.

**Discovery**

> **FIX WHAT MOST AFFECTS THE ANSWER FIRST. THEN IMPROVE CLARITY AND LANGUAGE.**

> **REVISION IS NOT JUST MAKING THE LANGUAGE LOOK MORE ADVANCED.**


### T2-C3. Revise your essay

**Learning purpose**  
Apply self-diagnosis and optional AI feedback to a deliberate revision of the learner's own university-fees essay.

**What the learner sees**  
Their existing W6 essay in the same editable workspace, the complete question, live word count, a compact AES reminder and an optional view of the four official IELTS criteria. The original saved attempt is preserved as a read-only comparison snapshot; the editable version remains the learner's text.

**What the learner does**  
Chooses one primary target using accessible labels:

- my answer to the question;
- my position;
- my reasoning and support;
- my organisation;
- my language clarity.

They then edit directly: selecting or replacing text, moving a sentence where useful, adding an explanation, deleting repetition, repairing paragraph breaks, correcting punctuation or capitalisation, and monitoring word count after revision. These actions provide computer-based performance practice without becoming a computer-skills lesson.

**Thinking required**  
The learner knows what they are trying to improve and judges every edit against that purpose.

**Feedback behaviour**  
The application does not auto-correct, auto-score or replace writing. It preserves both versions and the selected priority. It does not force the learner to manufacture a weakness when the essay already handles an area effectively.

**Multiple-valid behaviour**  
Different essays justify different priorities and revisions.

**Progressive help / writing / AI**  
This is genuine revision. The already specified full-essay external-AI prompt may be copied after a genuine attempt. The workflow is:

**WRITE → COPY AI FEEDBACK PROMPT → READ FEEDBACK → CHOOSE PRIORITY → RETURN TO ESSAY → REVISE YOURSELF**

AI feedback remains advisory. The learner decides whether its diagnosis is relevant and performs every change.


### T2-C4. What did the revision improve?

**Learning purpose**  
Compare before and after versions, judge the effect of revision and investigate one successful teaching example without treating it as the correct answer.

**What the learner sees**  
A restrained before/after comparison preserving the original and revised essay. Where a text-difference treatment is technically feasible, it should highlight changed passages without assigning improvement scores or using aggressive red/green marking.

After the learner has diagnosed and revised, an optional **Teaching example** becomes available. It demonstrates one successful route through the university-fees question using accessible, controlled language. A small number of annotations can be viewed through the official criteria or relevant workshop concepts; do not cover every sentence with commentary.

**What the learner does**  
Selects any effects that genuinely apply:

- answered the question more completely;
- made the reasoning clearer;
- improved organisation;
- made the position clearer;
- improved language clarity;
- changed little because the original already worked.

The learner may return to revise again.

**Thinking required**  
The learner explains what changed in meaning or effectiveness, not merely which words changed. They compare the teaching example's decisions with their own without copying its vocabulary or adopting its argument.

**Feedback behaviour**  
Reflection is not scored. More than one effect may apply, and “changed little” is legitimate when supported by judgement. The teaching example carries no invented band and is never labelled official or uniquely correct.

**Multiple-valid behaviour**  
Yes. Revisions and their effects are learner-specific.

**Progressive help / writing / AI**  
The learner can reopen their selected priority and AI feedback notes. No separate AI request is created mechanically.


### T2-C5. Try a new question

**Learning purpose**  
Transfer the complete Task 2 process to a new topic and a different instruction pattern with substantially reduced scaffolding.

**Fresh transfer question**

> In many workplaces, employees can now work from home for some or all of the week. What are the advantages and disadvantages of this arrangement?

The topic is familiar and adult, requires no specialist evidence and does not make one view morally preferable. Unlike the university question, it does not ask for agreement or an opinion. It therefore tests whether the learner reads the exact instruction, identifies the two required jobs and avoids inserting a memorised position statement.

**What the learner sees**  
The complete question, a blank editable essay workspace, live word count and optional compact help. One context illustration is recommended at the entry to this unit: a restrained editorial scene of an adult working naturally in an ordinary contemporary home environment. Its job is to mark **new context → transfer the process**. It must not portray home working as unusually happy, productive, lonely, stressful or otherwise preferable or harmful.

**What the learner does**  
Within one independent workspace, the learner:

1. interprets the instruction;
2. makes brief planning notes if useful;
3. writes the essay;
4. checks it;
5. optionally requests external-AI feedback;
6. selects a priority and revises.

These are learner actions within one transfer unit, not a replay of the earlier teaching sequence.

**Thinking required**  
The learner independently identifies the advantages and disadvantages jobs, chooses useful body contributions, explains and supports them, organises a coherent response and closes the answer without being led through every framework.

**Feedback behaviour**  
No band score, automatic submission, timer, locked screen or artificial exam pressure. The learner remains free to check and revise below 250 words. AI feedback, if used, follows the full-essay specification and returns to the same field.

**Multiple-valid behaviour**  
Open-ended. Different advantages, disadvantages, examples and coherent organisations can work.

**Progressive help / writing / AI**  
Frameworks are optional, not gates. If requested, reveal only:

- What is the job?
- Is a position required?
- What are the main body contributions?
- AES: Answer, Explain, Support.

The learner does not have to click through these prompts before writing. This unit includes genuine full-essay writing, optional AI feedback and learner-controlled revision.

**Progression**

> **SCAFFOLD DEEPLY → FADE SUPPORT → PERFORM INDEPENDENTLY**


### T2-C6. Keep the whole process

**Learning purpose**  
Consolidate the entire workshop into a usable mental process rather than another acronym or wall of frameworks.

**What the learner sees**

**READ**  
What is the question asking me to do?

**PLAN**  
What will I answer, and what will each main contribution do?

**BUILD**  
Explain and support the important ideas.

**WRITE**  
Organise the answer so the reader can follow it.

**CHECK**  
Did I answer every required job clearly?

**REVISE**  
Fix what most affects the answer first.

**What the learner does**  
Briefly identifies where each action appeared in the fresh transfer attempt and records one process they want to remember. The full collection does not display every framework learned.

**Feedback behaviour**  
Feedback confirms a usable process and points back to the learner's own transfer essay. It does not provide a score, badge or celebratory judgement about essay quality.

**Progressive help / writing / AI**  
No new help hierarchy, writing task or AI request. The learner may return to the transfer essay and revise again.


## 40.2 AES and the official criteria

AES is the workshop's concise checking tool:

**A = Answer everything**  
Answer the actual question, complete every required job and keep the position clear and consistent where one is required.

**E = Explain**  
Develop important ideas so the reader can understand why or how the reasoning works.

**S = Support**  
Give enough further reasoning, consequence, comparison, clarification, realistic situation or example where needed.

AES mainly operationalises aspects of **Task Response**, especially completeness and development. It does not replace the official IELTS criteria:

- Task Response;
- Coherence and Cohesion;
- Lexical Resource;
- Grammatical Range and Accuracy.

After the AES diagnosis, widen the lens compactly:

- **Task Response:** answer, position, relevance and development;
- **Coherence and Cohesion:** organisation, progression, paragraph contribution, repetition and useful linking;
- **Lexical Resource:** clear, appropriate, natural and sufficiently varied word choice without forced sophistication;
- **Grammatical Range and Accuracy:** clear meaning, recurring problems, controlled variety, punctuation and capitalisation.

Do not create four large criterion lessons. Language checking follows consideration of task and organisation problems, but language accuracy still matters where it affects clarity and control.


## 40.3 Revision and state

Revision should alter meaning, reasoning, organisation or clarity where needed—not merely replace simple words with more impressive-looking synonyms.

For meaningful revision stages, preserve:

- the original attempt;
- the editable current version;
- the selected revision priority;
- any optional AI-prompt state;
- the revised version;
- the learner's before/after reflection;
- word count before and after where useful.

Stable version labels and associations must not depend on array position. Do not auto-score the difference. The learner judges what improved and may decide that little needed changing.


## 40.4 Phase visual direction and boundary

Use a very pale stone-purple atmosphere, with muted terracotta available only for small secondary accents where it cannot be mistaken for an error or warning. Structural labels and progress remain the primary phase signals; colour must not imply failure, low score or incorrectness.

Recommend one new context illustration only at the fresh-transfer entry in C5. It establishes the new working-from-home context and marks the shift to independent transfer. Follow the adult editorial, responsive, accessible, culturally plausible and argumentatively neutral requirements in `DESIGN_SYSTEM.md`. Do not generate the asset during pedagogical design.

This section resolves the Phase 3 review boundary: W4 keeps introduction and conclusion judgement together; W2 uses plausible alternative plans; W7 remains structural only; full diagnosis begins in Phase 4; and fresh-question transfer occurs at the end of Phase 4.

This specification does not authorise Task 2 HTML, JavaScript, CSS, illustration generation, a question bank, scoring, band prediction, embedded AI, a backend, accounts, forced timers or an exam-simulation mode. Existing Academic and General Training Task 1 workshops remain unchanged.


# 41. Task 2 — Classroom Core and Extended Self-Study

This section extends the approved Task 2 journey without replacing its existing phases or rebuilding the current core:

1. **Understand the question**
2. **Build your answer**
3. **Write the essay**
4. **Check & improve**
5. **Transfer / independent practice**

The same pedagogy supports two connected modes:

**CLASSROOM CORE — approximately four hours**  
A focused route through the complete spine.

**EXTENDED SELF-STUDY — learner-controlled and potentially unlimited**  
Short investigations and practice reached from relevant moments in the core and discoverable again later.

These are not separate courses. Optional study must grow from what the learner notices while understanding, building, writing, diagnosing, revising or transferring an answer. It must not delay or overwhelm the classroom route.


## 41.1 Classroom core boundary

The classroom core prioritises:

- exact interpretation of the question;
- Task Response and idea relevance;
- explanation and support;
- visible reasoning relationships;
- paragraph development and whole-essay organisation;
- genuine writing;
- diagnosis and revision;
- transfer to a fresh question.

Strategically expose learners to paraphrasing, contrast and concession, sentence relationships, register, qualification, lexical precision and reference when those issues occur. Deeper language investigation remains optional.

Do not add every language topic to the linear core, require completion of self-study before progress, or make optional modules prerequisites for later core units.


## 41.2 Contextual self-study entry

Use a contextual invitation such as **Explore with AI**, **Practice this**, **Look closer** or **Practice & Improve** when a current learning moment makes an investigation useful.

Examples include:

- after judging a paraphrase: explore preserving meaning;
- after encountering *although*: explore contrast and concession;
- after an absolute claim: practise qualification;
- after direct reader-address: investigate appropriate essay register;
- after a focus choice: compare active and passive voice;
- after connector overload: investigate underlying progression and reference;
- after planning a topic: explore useful topic language;
- after sentence-control difficulty: practise useful simple and complex choices.

The learner may enter, leave and return without losing their current essay, paragraph, plan, diagnosis or option order. On return, provide one immediate transfer action connected to the learner's existing writing.


## 41.3 Practice & Improve layer

An eventual optional **Practice & Improve** layer may make the following areas discoverable:

- paraphrase without changing meaning;
- express contrast and concession;
- show reasons and results;
- express conditions;
- make claims more careful;
- compare ideas;
- control focus with active/passive voice;
- build useful complex sentences;
- choose an appropriate essay style;
- develop vocabulary for a topic;
- connect ideas without connector overload;
- use reference clearly;
- edit sentences for clarity;
- paragraph laboratory.

This list defines discoverable practice areas, not a compulsory syllabus or giant menu. A learner may spend 10–20 minutes on one area and return to writing. Modules should be short, focused, interactive, resumable and useful without completion of every preceding module.

Every module ends with transfer, for example:

- use one natural concession only if it helps the paragraph;
- check whether one claim is stronger than the available support;
- find any place where the essay speaks directly to the reader;
- use one topic expression only if it communicates an existing idea more precisely;
- choose whether active or passive focus is clearer in one sentence.

Do not ask learners to insert a feature merely to prove that they practised it.


## 41.4 Reusable micro-module shape

Use this common sequence where appropriate:

**NOTICE → JUDGE → EXPLAIN → TRY → RETURN TO WRITING**

1. Show one short, accessible example or paragraph.
2. Ask a focused noticing or judgement question before explaining a rule.
3. Provide progressive help if language or task wording blocks participation.
4. Reveal a concise explanation of the communicative job.
5. Introduce a technical label only if useful.
6. Let the learner try the feature.
7. Prompt a relevant decision in their own writing.

The module should name what the learner is learning to notice or control. It must connect to at least one official Writing criterion without pretending to award a score.


## 41.5 Paragraph-noticing library

Prefer short paragraphs for focused noticing over repeated full model essays. The library should eventually include examples isolating:

1. clear development;
2. useful concession;
3. cause → consequence;
4. an effective realistic example;
5. good language but weak Task Response;
6. too many connectors;
7. repetition presented as development;
8. overly conversational register;
9. unnecessarily pseudo-academic language;
10. simple language with strong reasoning;
11. overly absolute claims;
12. improved qualification;
13. useful comparison;
14. active/passive focus choice.

Do not overload one paragraph with many unrelated teaching points. Each item should support a small set of questions such as:

- Which sentence gives the main idea?
- Which sentence explains why?
- What does *these students* refer to?
- What relationship does *although* show?
- Could this sentence be simpler?

The explanation appears after the learner notices and judges.


## 41.6 Four-criteria integration

Keep the official criteria visible through concrete learner experience:

**TASK RESPONSE**  
Does this idea or sentence help answer the exact question? Is every required job addressed? Is the position clear and consistent when required? Is reasoning sufficiently developed?

**COHERENCE AND COHESION**  
Can the reader follow the progression, paragraph contribution, relationships and references? Remove connectors mentally where useful: does the reasoning still connect?

**LEXICAL RESOURCE**  
Do words and combinations express the intended meaning clearly, naturally and precisely? Topic-driven exploration should expand usable choices without rewarding difficulty for its own sake.

**GRAMMATICAL RANGE AND ACCURACY**  
Can the learner choose and control structures that express contrast, concession, reason, result, condition, comparison, qualification and focus? Range means controlled choice, not maximum complexity.

These questions make the official criteria concrete; they do not replace official terminology or justify a band prediction. Task Response remains the main organising spine.


## 41.7 Applied-language strands

Build optional strands around communicative jobs rather than terminology.

**Contrast and concession**  
Begin with **This is true, but this other point still matters**. Let learners notice and try accessible uses of *although*, *while*, *but* and *however*. Distinguish structures within one sentence from links between sentences.

**Reason, result and condition**  
Use *because*, *since*, *so*, *therefore*, *which can lead to* and *if* to make reasoning explicit. Do not teach a memorised connector inventory.

**Simple and complex sentences**  
Compare what two short sentences communicate with a controlled combined sentence. Also show an uncontrolled fragment or overloaded sentence. The learner chooses a structure for meaning and clarity.

**Active and passive voice**  
Compare two accurate versions and ask what each one focuses on. Do not ask learners to convert active sentences merely to sound academic.

**Qualification**  
Let learners revise claims that are too absolute using appropriate choices such as *may*, *can*, *often*, *sometimes*, *tends to*, *for some people* and *in some cases*.

**Comparison**  
Use comparison to explain why an option matters, why a consequence is stronger, how groups differ or why one solution may be preferable.

**Register and pronouns**  
Use a three-part continuum: **too conversational / appropriate / unnecessarily formal or complicated**. Give particular attention to direct reader-address with *you*. Do not ban *I* where a personal position is requested.

**Lexical precision and topic language**  
Explore words and common combinations through the current question and argument. Keep the set small and contextual, then require learner judgement and use. Do not create a giant phrase bank.

**Paraphrasing**  
Judge whether meaning is preserved, English is natural and style is appropriate. Use plausible partly successful alternatives, then ask the learner to produce and revise their own version.

**Coherence and reference**  
Compare connector-heavy weak reasoning with clear progression using fewer explicit links. Ask what *this*, *these* or *such* refers to and whether the reference is unambiguous.


## 41.8 Topic-vocabulary exploration

Where useful, include the exact current Task 2 question dynamically. Ask an external AI tutor or a controlled activity for approximately 10–12 accessible words or short phrases that help discuss the topic clearly and precisely, natural examples, brief usage notes and a short choice/use activity.

The exploration must explicitly say:

- accessible and useful is preferable to unnecessarily advanced;
- vocabulary serves the learner's own ideas;
- the AI must not write the essay;
- the learner tries before receiving corrections;
- transfer means selecting only language that improves an existing meaning.


## 41.9 Paraphrasing support and AI

The learner attempts a paraphrase before optional AI support. The copied context includes the original question and learner response and asks the AI to:

1. check whether meaning is preserved;
2. point out anything changed, added or removed;
3. identify unnatural or unnecessarily complicated wording;
4. avoid rewriting immediately;
5. provide one clear hint;
6. let the learner revise.

The learner returns to the same persistent field. A model or corrected version becomes available progressively, not as the first response.


## 41.10 Accessible content and plausible choices

Instructional language and most examples should normally be manageable for developing A2–B1 learners. Keep useful language where it serves the lesson and attach lightweight optional support when comprehension could block the intended judgement.

Controlled judgement options should be plausible. A weaker choice should usually contain something that works and fail for a meaningful reason: weaker relevance, an incomplete connection, lost meaning, awkwardness, unnecessary complexity, insufficient development or suitability for a different purpose.

Use graduated decisions such as **Yes / Partly / No**, **Works / Could work if… / Better for another purpose**, or a context-specific equivalent when binary right/wrong would distort the judgement. Multiple choices may be defensible.

Eligible unordered choices follow the global runtime-randomisation rules in `INTERACTIONS.md`. Correctness and feedback depend on stable semantic meaning, never display position.


## 41.11 Extended-study state and return

Persist enough state to let the learner leave and resume a short investigation without losing continuity. Where relevant, preserve:

- the originating question, paragraph or essay reference;
- the learning feature being explored;
- the learner's attempt;
- help depth already requested;
- stable randomised option order within the attempt;
- feedback already revealed;
- the learner's revised attempt;
- the intended return location.

Returning to the core must not automatically insert model language, rewrite the learner's text or mark the exploration as evidence of essay quality.


## 41.12 Expansion boundary

This specification authorises future planning of contextual self-study and **Practice & Improve**, but not implementation in this documentation step.

Do not modify the approved Task 2 workshop implementation, Task 1 workshops, HTML, CSS, JavaScript or images as part of this update. Do not create an embedded AI service, scoring, band prediction, compulsory grammar syllabus, phrase bank or feature-counting system.
