# Approved direction: Reading topic pages

Decision record, 2026-10-24. This document records future work; it does not implement the consolidation or the Food prototype.

## Hierarchy and scope

Workshop → Main section → Topic/text page → Activities

The current 49 individual screens are not the intended final student-facing page structure. Consolidate activities around the same topic/text where pedagogically appropriate. Expect approximately 11 substantial topic/text pages, rather than 49 separate screens. Introduction and Reflection are workshop-level material, not additional topic pages. Decide Reflection's exact placement during consolidation.

Do not treat the 11 texts as 11 equivalent navigation items in the final architecture. The previously proposed flat Reading task dropdown is not the approved future navigation model.

## Working main sections

1. **Paragraphs**
   - Flexible Working
   - Urban Trees
   - Large Language Model
2. **Ideas and arguments**
   - Curitiba
   - Mohammed from Sohar
   - You Are What You Eat—Or Are You?
3. **Reading skills**
   - Bedouin Life
   - Electric Vehicles
   - Digital Football
4. **Reading carefully**
   - Ferrari
   - Amouage

Reading skills is a working title and may be reconsidered. Do not use Difficult texts. Reading carefully is the approved wording for Section 4.

Preserve Mohammed from Sohar → You Are What You Eat—Or Are You? → Bedouin life. This order already exists locally.

## Page-consolidation rule

Pages contain activities. Activities do not automatically require separate pages.

The objectives are fewer page transitions, substantial topic-based learning pages and multiple connected activities around one text. Preserve useful learning activities rather than removing them merely to shorten the workshop. Students must be able to progress through activities at different speeds; the whole class need not complete every activity simultaneously.

Do not globally remove Continue/Next controls before consolidation. Preserve usable navigation in the interim version. Teaching controls that progressively reveal reasoning or claim versions are not redundant page navigation.

## Plain-language naming rule

Titles label the learning clearly. Instructions tell the student what to do.

Student-facing section titles and activity headings should be short, familiar, precise and immediately understandable. Avoid metaphorical, motivational, clever, vague, unnecessarily explanatory or unnecessarily academic headings.

Approved style examples:

- Paragraph organisation
- Contrast: positive and negative
- Ideas that support each other
- A sequence
- The parts of a paragraph
- A true detail is not always a heading
- The writer’s argument
- What each paragraph does
- Words that limit meaning
- Long sentences
- Difficult nouns
- The passive
- Finding information
- Understanding the question
- Who says what
- Changes in meaning

These are examples, not an instruction to rename existing activities globally in the current publication pass.

## Progressive learning

Consolidation must not expose answers, explanations or support prematurely. Preserve:

- attempt → check → feedback relationships;
- optional evidence;
- progressive support;
- answer checking;
- Ferrari claim-version progression;
- EV/Digital Football progressive reasoning;
- other deliberate reveal states.

Fewer pages must not mean displaying every answer or explanation simultaneously.

## Differentiated pace

A substantial topic page may contain several connected activities.

Students do not necessarily have to complete all activities at the same pace.

A teacher may set a minimum target within a page while faster students continue into later activities.

The architecture should support this naturally rather than requiring every student to move through every activity together.

## ReadingWorkspace reference

Retain the approved complete continuous passage, independent passage/question scrolling, and passage-only A− / A / A+ controls:

- 0–1023px: single-pane PASSAGE / QUESTIONS.
- 1024–1199px: 50/50.
- 1200px+: 55% passage / 45% questions.
- At least 400 CSS pixels of usable content width in each two-pane column.
- A−: 16px / 1.55; A: 18px / 1.6, default; A+: 21px / 1.65.

Do not redesign the workspace or extend it to all 49 screens in this publication pass. Its role within consolidated pages will be tested with the Food prototype.

## Next implementation step

Build You Are What You Eat—Or Are You? as the first consolidated topic-page prototype.

Combine the current Food activities into one coherent page while preserving title/prediction, the complete continuous passage, headings, the writer’s argument / paragraph-function work, words that limit meaning, existing answers, checking, feedback and progressive disclosure.

Test and review Food before propagating the consolidation model to other topics. Do not build the Food prototype or the wider consolidation in this publication pass.

## Clarified publication scope

Retain the implemented 11-item Reading task dropdown as interim navigation, the shared ReadingWorkspace on all 31 passage-dependent screens, and Back/Continue. Do not roll back this working functionality. Preserve Mohammed → Food → Bedouin.

The interim dropdown is not the final navigation design. Future consolidation should reuse the shared workspace rather than remove and rebuild it. Test and publish the current 49-screen implementation; do not consolidate pages during this pass. The next development step remains the consolidated Food topic-page prototype.
