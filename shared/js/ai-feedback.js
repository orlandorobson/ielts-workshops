const COMMON_TUTOR_INSTRUCTIONS = `Act as a careful IELTS writing tutor.

The learner has already attempted this part of the task. Your job is to help the learner understand and improve their own writing.

Do not claim to be an official IELTS examiner. Do not rewrite the learner's answer immediately. Do not correct every sentence or overwhelm the learner with a comprehensive error list. Do not replace clear, accurate language merely with more sophisticated vocabulary. Do not assume more difficult vocabulary means a higher IELTS score. Do not require invented facts, statistics or authorities as evidence. Do not invent IELTS rules. Distinguish between an official IELTS requirement and a useful writing strategy where relevant. Do not tell the learner that every word in the task must be paraphrased. Precise technical words may remain unchanged when changing them would be unnatural or inaccurate. Do not criticise the learner for something deliberately outside the stage currently being practised.

Use minimum necessary intervention. Work progressively through PROMPT → HINT → EXPLAIN → MODEL. Start with the least intervention likely to help the learner correct their own writing. When the learner can reasonably discover an error, locate or characterise it and ask a useful diagnostic question before supplying the correction. For a grammar problem, prefer a focused question or hint before rewriting the structure. For an inaccurate interpretation, direct the learner to the relevant task data and ask them to check the claim. Do not become cryptic: if a hint is unlikely to help, explain the problem clearly. If the learner asks for more help after attempting a revision, move progressively toward explanation and, eventually, a model or corrected version. A model is available when needed, but it should not be the first response.

First respond using these three headings:

WHAT WORKS
Briefly identify what is successful.

CHECK THIS
Locate or characterise the most important issue, if there is one, without unnecessarily solving it for the learner.

YOUR NEXT MOVE
Give the learner one concrete diagnostic or revision action to perform themselves.

Do not provide a rewritten version yet. Ask the learner to revise first. If the writing is already appropriate for this stage, say so; do not invent a weakness simply because feedback was requested. Keep the feedback concise and practical.`;

function formatSeriesContext(data) {
  return data.series
    .map((series) => `${series.label}: ${data.years.map((year, index) => `${year}=${series.values[index]}`).join(", ")}`)
    .join("\n");
}

export function formatAcademicVisualContext(visual) {
  const data = visual.data;
  let information;

  if (data.kind === "line") {
    information = `Unit: ${data.unit}\n${formatSeriesContext(data)}`;
  } else if (data.kind === "bar") {
    information = `Unit: ${data.unit}\n${data.series
      .map((series) => `${series.label}: ${data.categories.map((category, index) => `${category}=${series.values[index]}`).join(", ")}`)
      .join("\n")}`;
  } else if (data.kind === "pie") {
    information = `Unit: ${data.unit}\n${data.periods
      .map((period) => `${period.label}: ${data.categories.map((category, index) => `${category}=${period.values[index]}%`).join(", ")}`)
      .join("\n")}`;
  } else if (data.kind === "table") {
    information = `${data.unit}\n${data.columns.join(" | ")}\n${data.rows.map((row) => row.join(" | ")).join("\n")}`;
  } else if (data.kind === "maps") {
    information = data.periods
      .map((period) => `${period.label}: west=${period.west}; east=${period.east}; centre=${period.centre}; unchanged=${period.fixed}`)
      .join("\n");
  } else if (data.kind === "process") {
    information = `Stages in order: ${data.stages.map((stage, index) => `${index + 1}. ${stage}`).join(" → ")}`;
  } else {
    throw new Error(`Unsupported Academic visual kind: ${data.kind}`);
  }

  return `IELTS task: Academic Writing Task 1\nVisual form: ${visual.label}\nTask statement: ${visual.taskStatement}\nTask instruction: ${visual.taskInstruction}\nVisual information:\n${information}`;
}

function bulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildAIFeedbackPrompt({ visual, feedback, learnerResponse }) {
  if (!learnerResponse.trim()) throw new Error("A learner response is required before generating feedback.");

  const taskSpecificFeatures = feedback.useVisualImportantFeatures
    ? visual.importantFeatures
    : feedback.taskSpecificFeatures;
  const taskSpecificSection = taskSpecificFeatures?.length
    ? `\n\nIMPORTANT FEATURES OF THIS PARTICULAR VISUAL\n${bulletList(taskSpecificFeatures)}\nThese are reference features, not a mandatory checklist or one uniquely correct overview. Accept other defensible selections and wording that the visual supports.`
    : "";
  const planningContext = feedback.additionalContext?.trim()
    ? `\n\nLEARNER'S CURRENT PLANNING CONTEXT\n${feedback.additionalContext.trim()}\nUse this only to check whether the writing follows the learner's own defensible plan. Do not treat the plan as a model answer.`
    : "";

  return `${COMMON_TUTOR_INSTRUCTIONS}

TASK CONTEXT
${formatAcademicVisualContext(visual)}

CURRENT LEARNING STAGE
${feedback.stage}

GENERAL LEARNING PRINCIPLES
${bulletList(feedback.taught)}${taskSpecificSection}

EVALUATE ONLY AT THIS STAGE
${bulletList(feedback.criteria)}

DO NOT EVALUATE YET
${bulletList(feedback.exclusions)}${planningContext}

LEARNER'S OWN RESPONSE
---
${learnerResponse}
---

Give feedback on this response using WHAT WORKS, CHECK THIS and YOUR NEXT MOVE. Do not rewrite it. Invite the learner to return to their own response and revise it.`;
}

export function formatGeneralScenarioContext(scenario) {
  return `IELTS task: General Training Writing Task 1
Task type: Letter writing
Situation: ${scenario.situation}
Instruction: ${scenario.instruction}
${scenario.bulletPoints.map((point) => `- ${point.text}`).join("\n")}
Task requirement: ${scenario.taskRequirement || "Write at least 150 words."}
Reader: ${scenario.reader}
Relationship: ${scenario.relationship}
Purpose: ${scenario.purpose}
Tone guidance: ${scenario.toneNotes.join(" ")}`;
}

export function buildGeneralAIFeedbackPrompt({ scenario, feedback, learnerResponse }) {
  if (!learnerResponse.trim()) throw new Error("A learner response is required before generating feedback.");

  const planningContext = feedback.additionalContext?.trim()
    ? `\n\nLEARNER'S CURRENT PLANNING OR SELF-CHECK\n${feedback.additionalContext.trim()}\nUse this as diagnostic context, not as a model answer or automatic score.`
    : "";

  return `${COMMON_TUTOR_INSTRUCTIONS}

TASK CONTEXT
${formatGeneralScenarioContext(scenario)}

CURRENT LEARNING STAGE
${feedback.stage}

GENERAL LEARNING PRINCIPLES
${bulletList(feedback.taught)}

EVALUATE ONLY AT THIS STAGE
${bulletList(feedback.criteria)}

DO NOT EVALUATE YET
${bulletList(feedback.exclusions)}${planningContext}

LEARNER'S OWN RESPONSE
---
${learnerResponse}
---

Give feedback on this response using WHAT WORKS, CHECK THIS and YOUR NEXT MOVE. Use minimum necessary intervention and do not rewrite it. Invite the learner to return to their own response and revise it.`;
}

export function formatTask2Context({ question, analysis = "" }) {
  return `IELTS task: Writing Task 2
Question and exact instruction: ${question}
Task requirement: Write at least 250 words.
${analysis ? `Relevant task analysis: ${analysis}` : ""}`.trim();
}

export function buildTask2AIFeedbackPrompt({ question, analysis, feedback, learnerResponse }) {
  if (!learnerResponse.trim()) throw new Error("A learner response is required before generating feedback.");

  return `${COMMON_TUTOR_INSTRUCTIONS}

TASK 2 ACCESSIBILITY
Explain feedback in language a developing A2–B1 learner can understand. If a useful technical term is needed, explain it simply before naming it.

TASK CONTEXT
${formatTask2Context({ question, analysis })}

CURRENT LEARNING STAGE
${feedback.stage}

GENERAL LEARNING PRINCIPLES
${bulletList(feedback.taught)}

EVALUATE ONLY AT THIS STAGE
${bulletList(feedback.criteria)}

DO NOT EVALUATE OR REQUIRE
${bulletList(feedback.exclusions)}

LEARNER'S OWN RESPONSE
---
${learnerResponse}
---

Give concise, prioritised feedback using WHAT WORKS, CHECK THIS and YOUR NEXT MOVE. Use minimum necessary intervention. Do not rewrite the response. Invite the learner to choose one priority, return to this same response and revise it themselves.`;
}

export function buildTask2RevisionAIFeedbackPrompt({ question, selectedPriority, feedback, originalResponse, learnerResponse }) {
  if (!learnerResponse.trim()) throw new Error("A learner revision is required before generating feedback.");

  return `${COMMON_TUTOR_INSTRUCTIONS}

TASK 2 ACCESSIBILITY
Explain feedback in language a developing A2–B1 learner can understand. If a useful technical term is needed, explain it simply before naming it.

TASK CONTEXT
${formatTask2Context({ question })}

CURRENT LEARNING STAGE
${feedback.stage}

SELECTED REVISION PRIORITY
${selectedPriority}

GENERAL LEARNING PRINCIPLES
${bulletList(feedback.taught)}

EVALUATE ONLY AT THIS STAGE
${bulletList(feedback.criteria)}

DO NOT EVALUATE OR REQUIRE
${bulletList(feedback.exclusions)}

ORIGINAL RESPONSE BEFORE THIS REVISION
---
${originalResponse || "No earlier snapshot was available."}
---

LEARNER'S CURRENT REVISION
---
${learnerResponse}
---

For this revision stage, use these headings instead of the normal WHAT WORKS structure:

WHAT IMPROVED
Identify briefly whether the current revision improved the learner's selected priority. Recognise useful parts that were preserved. If the text has not changed meaningfully, say so without inventing improvement.

CHECK THIS
Locate or characterise the most important remaining issue connected to the selected priority. Do not begin a new complete essay critique unless a serious problem makes that necessary.

YOUR NEXT REVISION
Give one concrete next revision for the learner to make themselves.

Use minimum necessary intervention. Do not rewrite the essay, give a band score or provide a model first.`;
}

export async function copyText(text, clipboard = globalThis.navigator?.clipboard) {
  if (!clipboard?.writeText) throw new Error("Clipboard writing is not available.");
  await clipboard.writeText(text);
}
