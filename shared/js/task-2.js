import { task2Content as content } from "../../content/writing/task-2.js";
import { buildTask2AIFeedbackPrompt, buildTask2RevisionAIFeedbackPrompt, copyText } from "./ai-feedback.js";
import { isValidStoredOrder, shuffleOptionIds } from "./randomise.js";
import { clearTask2State, loadTask2State, saveTask2State } from "./task-2-storage.js";

const app = document.querySelector("#app");
const progress = document.querySelector("#unit-progress");
const currentStage = document.querySelector("#current-stage");
const resetButton = document.querySelector("#reset-progress");
let state = loadTask2State();
let saveTimer;

const unitIndex = (id) => content.units.findIndex((unit) => unit.id === id);
const getUnitState = (id) => state.units[id] || {};
const escapeHTML = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function setUnitState(id, patch) {
  state.units[id] = { ...getUnitState(id), ...patch };
  saveTask2State(state);
}

function completeUnit(id) {
  if (!state.completed.includes(id)) state.completed.push(id);
  saveTask2State(state);
}

function saveDraft(name, value) {
  state.drafts[name] = value;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveTask2State(state), 120);
}

function savePlan(name, plan) {
  state.drafts[name] = { ...state.drafts[name], ...plan };
  saveTask2State(state);
}

function orderedOptions(stateKey, options, shouldShuffle = true) {
  const ids = options.map((option) => option.id);
  const savedOrder = getUnitState(stateKey).optionOrder;
  const optionOrder = isValidStoredOrder(savedOrder, ids)
    ? savedOrder
    : shouldShuffle ? shuffleOptionIds(ids) : ids;
  if (optionOrder !== savedOrder) setUnitState(stateKey, { optionOrder });
  const byId = new Map(options.map((option) => [option.id, option]));
  return optionOrder.map((id) => byId.get(id));
}

function canVisit(index) {
  const completedIndexes = state.completed.map(unitIndex).filter((value) => value >= 0);
  const furthest = completedIndexes.length ? Math.max(...completedIndexes) + 1 : 0;
  return index <= Math.min(furthest, content.units.length - 1);
}

function unitHeader(unit, introduction) {
  return `<header class="unit-header" data-section="${unit.section}">
    <p class="eyebrow">${unit.eyebrow}</p>
    <h1 id="unit-title" tabindex="-1">${unit.label}</h1>
    <p class="lead">${introduction}</p>
  </header>`;
}

function questionMarkup(question, { transfer = false, meta = false } = {}) {
  return `<section class="question-panel" aria-label="Writing Task 2 question">
    <p class="question-label">${transfer ? "Fresh transfer question" : "Writing Task 2 question"}</p>
    <blockquote><p>${question}</p></blockquote>
    ${meta ? `<div class="task-meta"><span><strong>IELTS requires:</strong> at least 250 words</span><span><strong>We recommend:</strong> approximately 40 minutes for Task 2</span></div>` : ""}
  </section>`;
}

function feedbackMarkup(message, kind = "success") {
  return `<div class="feedback" data-kind="${kind}" role="status" aria-live="polite" tabindex="-1"><p>${message}</p></div>`;
}

function criterionMarkup(label, message) {
  return `<p class="criterion-note"><strong>${label}</strong><span>${message}</span></p>`;
}

function choiceMarkup({ option, name, type = "radio", checked = false }) {
  return `<label class="choice"><input type="${type}" name="${name}" value="${option.id}" ${checked ? "checked" : ""}/><span>${option.text}</span></label>`;
}

function compactChoice({ value, label, name, type = "radio", checked = false }) {
  return `<label class="compact-choice"><input type="${type}" name="${name}" value="${escapeHTML(value)}" ${checked ? "checked" : ""}/><span>${label}</span></label>`;
}

function navigationMarkup({ canContinue = false } = {}) {
  const index = unitIndex(state.currentUnit);
  const previous = content.units[index - 1];
  const next = content.units[index + 1];
  return `<nav class="unit-navigation" aria-label="Learning-unit navigation">
    ${previous ? `<button class="secondary-button" type="button" data-nav="${previous.id}">Back</button>` : "<span></span>"}
    ${next ? `<button class="primary-button" type="button" data-nav="${next.id}" ${canContinue ? "" : "disabled"}>Continue</button>` : ""}
  </nav>`;
}

function renderProgress() {
  const current = content.units.find((unit) => unit.id === state.currentUnit);
  document.body.dataset.phase = current?.section || "understand";
  progress.replaceChildren();
  content.sections.forEach((section) => {
    const units = content.units.filter((unit) => unit.section === section.id);
    const first = units[0];
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "progress-button";
    button.dataset.section = section.id;
    button.dataset.complete = String(units.every((unit) => state.completed.includes(unit.id)));
    button.disabled = !canVisit(unitIndex(first.id));
    button.textContent = section.shortLabel;
    button.setAttribute("aria-label", section.label);
    if (current?.section === section.id) button.setAttribute("aria-current", "step");
    button.addEventListener("click", () => navigateTo(first.id));
    item.append(button);
    progress.append(item);
  });
  currentStage.textContent = `${current?.label || "Workshop"} · Step ${unitIndex(state.currentUnit) + 1} of ${content.units.length}`;
}

function bindNavigation() {
  document.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => navigateTo(button.dataset.nav)));
}

function navigateTo(id, { focus = true } = {}) {
  const index = unitIndex(id);
  if (index < 0 || !canVisit(index)) return;
  state.currentUnit = id;
  saveTask2State(state);
  if (window.location.hash !== `#${id}`) history.pushState({ unit: id }, "", `#${id}`);
  render({ focus });
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function wordRequirementMessage(count) {
  return count < 250
    ? "IELTS requires at least 250 words. You can still check, obtain feedback and revise this response."
    : "IELTS requires at least 250 words. Meeting the minimum does not show that the answer, reasoning, organisation or language is effective.";
}

function helpMarkup(id, help = []) {
  const level = getUnitState(id).helpLevel || 0;
  if (!help.length) return "";
  return `<section class="support-panel" aria-label="Progressive help">
    <div class="support-actions">
      ${level < help.length ? `<button class="secondary-button" type="button" data-help-next>${level === 0 ? "Need help?" : level === 1 ? "More support" : "Show an example"}</button>` : ""}
    </div>
    ${level ? `<div class="support-content"><h3>${level === 1 ? "Hint" : level === 2 ? "More support" : "Teaching example"}</h3><p>${escapeHTML(help[level - 1])}</p></div>` : ""}
  </section>`;
}

function bindHelp(id) {
  document.querySelector("[data-help-next]")?.addEventListener("click", () => {
    setUnitState(id, { helpLevel: (getUnitState(id).helpLevel || 0) + 1 });
    render();
  });
}

function aiMarkup(id, { revision = false } = {}) {
  const saved = getUnitState(id);
  return `<section class="ai-feedback-panel" aria-labelledby="${id}-ai-heading">
    <h3 id="${id}-ai-heading">${revision ? "Use AI to review your revision" : "Use AI to check your writing"}</h3>
    <ol class="ai-feedback-steps">
      <li><strong>${revision ? "Revise first" : "Write first"}</strong><span>${revision ? "Make your own change above." : "Complete your own response above."}</span></li>
      <li><strong>Copy</strong><span>Select <strong>Copy AI feedback prompt</strong>.</span></li>
      <li><strong>Paste</strong><span>Open your chosen AI chatbot and paste it there.</span></li>
      <li><strong>Read</strong><span>Find the main point before requesting a model.</span></li>
      <li><strong>Revise</strong><span>Return here and improve your own writing.</span></li>
    </ol>
    <button class="secondary-button ai-copy-button" type="button" data-copy-ai>Copy AI feedback prompt</button>
    <p class="ai-copy-status" data-ai-status role="status" aria-live="polite">${saved.aiPromptCopied ? "Copy an updated prompt whenever you want feedback on a later revision." : ""}</p>
    <p class="ai-return-message">This workshop sends nothing automatically.</p>
  </section>`;
}

function bindAI({ id, textarea, question, analysis, feedback }) {
  const status = document.querySelector("[data-ai-status]");
  document.querySelector("[data-copy-ai]")?.addEventListener("click", async () => {
    if (!textarea.value.trim()) {
      status.textContent = "Write your own answer first. Then use AI to help you check it.";
      return;
    }
    try {
      const prompt = buildTask2AIFeedbackPrompt({ question, analysis, feedback, learnerResponse: textarea.value });
      await copyText(prompt);
      setUnitState(id, { aiPromptCopied: true, aiOriginal: textarea.value });
      status.textContent = "Copied. Now open your AI chatbot and paste it there.";
    } catch {
      status.textContent = "Copying was unavailable. Check your browser's clipboard permission and try again.";
    }
  });
}

function bindRevisionAI({ id, textarea, question, selectedPriority, feedback, originalResponse }) {
  const status = document.querySelector("[data-ai-status]");
  document.querySelector("[data-copy-ai]")?.addEventListener("click", async () => {
    if (!textarea.value.trim()) {
      status.textContent = "Revise your own answer first. Then use AI to help you review the change.";
      return;
    }
    try {
      const prompt = buildTask2RevisionAIFeedbackPrompt({
        question,
        selectedPriority,
        feedback,
        originalResponse,
        learnerResponse: textarea.value,
      });
      await copyText(prompt);
      setUnitState(id, { aiPromptCopied: true, aiOriginal: originalResponse });
      status.textContent = "Copied. Now open your AI chatbot and paste it there.";
    } catch {
      status.textContent = "Copying was unavailable. Check your browser's clipboard permission and try again.";
    }
  });
}

function renderSingleJudgement(id, unit, { introduction, question = "", prompt, options, principle = "", help = [], criterion = null }) {
  const saved = getUnitState(id);
  const ordered = orderedOptions(id, options, true);
  const selected = options.find((option) => option.id === saved.choice);
  app.innerHTML = `<article>${unitHeader(unit, introduction)}${question ? questionMarkup(question) : ""}
    <section class="interaction-pane"><fieldset><legend class="prompt">${prompt}</legend>
      <div class="choice-list">${ordered.map((option) => choiceMarkup({ option, name: id, checked: saved.choice === option.id })).join("")}</div>
    </fieldset>
    <div class="action-row"><button class="primary-button" type="button" data-check ${saved.choice ? "" : "disabled"}>Check my judgement</button></div>
    ${saved.checked && selected ? feedbackMarkup(selected.feedback, selected.viable ? "success" : "reconsider") : ""}
    ${principle ? `<blockquote class="principle-panel"><p>${principle}</p></blockquote>` : ""}
    ${criterion ? criterionMarkup(criterion.label, criterion.message) : ""}
    ${helpMarkup(id, help)}</section>
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { choice: input.value, checked: false });
    document.querySelector("[data-check]").disabled = false;
  }));
  document.querySelector("[data-check]").addEventListener("click", () => {
    const choice = document.querySelector(`input[name="${id}"]:checked`)?.value;
    if (!choice) return;
    const option = options.find((item) => item.id === choice);
    setUnitState(id, { choice, checked: true });
    if (option.viable) completeUnit(id);
    render();
  });
  bindHelp(id);
}

function renderU1(unit) {
  const saved = getUnitState("u1");
  const patterns = orderedOptions("u1-patterns", content.patterns, true);
  const activeId = saved.activeId || content.patterns[0].id;
  const viewed = [...new Set([...(saved.viewed || []), activeId])];
  const active = content.patterns.find((pattern) => pattern.id === activeId);
  if (!saved.activeId || viewed.length !== (saved.viewed || []).length) setUnitState("u1", { activeId, viewed });
  if (viewed.length === content.patterns.length) completeUnit("u1");
  app.innerHTML = `<article>${unitHeader(unit, "Task 2 questions use several common patterns. These are useful descriptions, not a complete list of fixed essay types.")}
    <div class="context-entry"><section><p class="prompt">Select each question pattern to inspect the writing job.</p>
      <ul class="pattern-list">${patterns.map((pattern) => `<li><button class="pattern-button" type="button" data-pattern="${pattern.id}" aria-pressed="${pattern.id === activeId}"><strong>${pattern.label}</strong><span>${pattern.question}</span></button></li>`).join("")}</ul></section>
      <figure class="context-illustration"><img src="../../media/writing/task-2/university-context.png?v=2" alt="A student reviews notes beside a laptop."/><figcaption>A university context. The image establishes the setting, not an answer about tuition.</figcaption></figure></div>
    <section class="pattern-detail" aria-live="polite"><h2>${active.label}</h2><p>${active.jobs}</p></section>
    <p class="choice-note">${viewed.length} of ${content.patterns.length} patterns inspected.</p>
    ${navigationMarkup({ canContinue: state.completed.includes("u1") })}</article>`;
  document.querySelectorAll("[data-pattern]").forEach((button) => button.addEventListener("click", () => {
    setUnitState("u1", { activeId: button.dataset.pattern, viewed: [...new Set([...viewed, button.dataset.pattern])] });
    render();
  }));
}

function renderU2(unit) {
  renderSingleJudgement("u2", unit, { introduction: "The topic tells you what the question is about. The instruction tells you what your response must do.", question: content.transferQuestion, prompt: content.u2.prompt, options: content.u2.options, principle: "<strong>The topic gives you the subject. The key words give you the job.</strong>", help: content.u2.help, criterion: { label: "Task Response", message: "A point can match the topic without doing every job in the instruction." } });
}

function renderMatrixJudgement(id, unit, { introduction, question = "", items, values, shuffleValues = false, prompt, help = [], principle = "", successMessage = "Your judgements follow the exact instructions rather than topic words alone.", retryMessage = "At least one judgement needs another look. Use the explanation under each item, then reconsider." }) {
  const saved = getUnitState(id);
  const displayedItems = orderedOptions(`${id}-items`, items, true);
  const answers = saved.answers || {};
  const checked = saved.checked;
  const complete = items.every((item) => answers[item.id]);
  const correct = complete && items.every((item) => answers[item.id] === item.answer);
  app.innerHTML = `<article>${unitHeader(unit, introduction)}${question ? questionMarkup(question) : ""}<form id="matrix-form" class="judgement-list">
    <p class="prompt">${prompt}</p>
    ${displayedItems.map((item) => `<fieldset class="judgement-row"><legend>${item.text || item.question}</legend><div class="inline-choices">${orderedOptions(`${id}-${item.id}-values`, values, shuffleValues).map((value) => compactChoice({ value: value.id, label: value.label, name: item.id, checked: answers[item.id] === value.id })).join("")}</div>${checked && answers[item.id] ? `<p class="row-feedback">${item.feedback}</p>` : ""}</fieldset>`).join("")}
    <button class="primary-button" type="submit" ${complete ? "" : "disabled"}>Check my judgements</button></form>
    ${checked ? feedbackMarkup(correct ? successMessage : retryMessage, correct ? "success" : "reconsider") : ""}
    ${principle ? `<blockquote class="principle-panel"><p>${principle}</p></blockquote>` : ""}
    ${helpMarkup(id, help)}
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#matrix-form");
  form.addEventListener("change", () => {
    const data = new FormData(form);
    const next = Object.fromEntries(items.map((item) => [item.id, data.get(item.id)]));
    setUnitState(id, { answers: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !items.every((item) => next[item.id]);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const next = Object.fromEntries(items.map((item) => [item.id, data.get(item.id)]));
    setUnitState(id, { answers: next, checked: true });
    if (items.every((item) => next[item.id] === item.answer)) completeUnit(id);
    render();
  });
  bindHelp(id);
}

function renderU3(unit) {
  renderMatrixJudgement("u3", unit, { introduction: "An introduction can be grammatically correct and connected to the topic but still fail to set up the required answer.", question: content.u3.question, items: content.u3.items, values: [{ id: "yes", label: "Yes" }, { id: "partly", label: "Partly" }, { id: "no", label: "No" }], prompt: "How well does each introduction do what the question asked?", help: content.u3.help });
}

function renderU3P(unit) {
  const id = "u3p";
  const source = content.u3p;
  const saved = getUnitState(id);
  const ordered = orderedOptions(`${id}-options`, source.options, source.shuffle);
  const selected = source.options.find((option) => option.id === saved.choice);
  const draft = state.drafts.paraphrase || "";
  const judgementComplete = Boolean(saved.checked);
  app.innerHTML = `<article>${unitHeader(unit, "The exam gives you a question. In your introduction, you usually turn its main idea into a statement. You do not need to replace every word.")}${questionMarkup(source.question)}
    <div class="framework-strip" aria-label="Question meaning and writing job"><section><strong>Subject / view</strong><span>${source.subjectView}</span></section><section><strong>Job</strong><span>${source.job}</span></section></div>
    <blockquote class="principle-panel"><p><strong>Question → essay language.</strong> Put the main idea into a statement that could belong in your essay. Do not copy the instruction as another question.</p></blockquote>
    <div class="framework-strip" aria-label="Three paraphrasing checks"><section><strong>Meaning preserved?</strong><span>Is the main view still the same?</span></section><section><strong>Natural English?</strong><span>Would this wording sound normal?</span></section><section><strong>Fits an introduction?</strong><span>Could this statement belong in an essay?</span></section></div>
    <section class="interaction-pane"><fieldset><legend class="prompt">${source.prompt}</legend><div class="choice-list">${ordered.map((option) => choiceMarkup({ option, name: id, checked: saved.choice === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${saved.choice ? "" : "disabled"}>Check my judgement</button>${judgementComplete && selected ? feedbackMarkup(selected.feedback, selected.viable ? "success" : "reconsider") : ""}</section>
    ${judgementComplete ? `<section class="writing-pane compact-writing"><h2>Try it yourself</h2><label for="u3p-draft">Write the main idea of the question in your own words so it could fit into an introduction.</label><textarea class="writing-area" id="u3p-draft" spellcheck="true">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span></div>${helpMarkup(id, source.help)}<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>Keep this introduction statement</button>${saved.saved ? `<section class="model-panel"><p class="eyebrow">Teaching comparison</p><h3>One possible statement—not the required wording</h3><p>${source.teachingExample}</p><p>This expresses the main view only. The next unit asks whether the question also requires your position.</p><p>Writers can express ideas in different ways elsewhere in an essay too. This short unit focuses on the introduction.</p><p>Compare the meaning with your version, then revise your own wording above if useful.</p></section>` : ""}</section>` : ""}
    <blockquote class="principle-panel"><p><strong>Paraphrasing ≠ replacing words with synonyms.</strong> Preserve the idea and use clear, natural essay language.</p></blockquote>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => { setUnitState(id, { choice: input.value, checked: false, saved: false }); render(); }));
  document.querySelector("[data-check]")?.addEventListener("click", () => { const choice = document.querySelector(`input[name="${id}"]:checked`)?.value; if (!choice) return; setUnitState(id, { choice, checked: true }); render(); });
  const textarea = document.querySelector("#u3p-draft");
  textarea?.addEventListener("input", () => { saveDraft("paraphrase", textarea.value); document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`; document.querySelector("[data-save]").disabled = !textarea.value.trim(); });
  document.querySelector("[data-save]")?.addEventListener("click", () => { if (!textarea.value.trim()) return; saveDraft("paraphrase", textarea.value); setUnitState(id, { saved: true }); completeUnit(id); render(); });
  bindHelp(id);
}

function renderU4(unit) {
  renderMatrixJudgement("u4", unit, { introduction: "Similar topics can create different writing jobs. Read the exact instruction before deciding whether you must state what you think.", items: content.u4.items, values: [{ id: "yes", label: "Yes" }, { id: "no", label: "No" }], shuffleValues: true, prompt: content.u4.prompt, help: content.u4.help });
}

function renderWritingUnit({ id, unit, introduction, question, draftName, label, help, feedback, analysis, areaClass = "paragraph-area", saveLabel = "Keep this writing", onSave }) {
  const saved = getUnitState(id);
  const draft = state.drafts[draftName] || "";
  app.innerHTML = `<article>${unitHeader(unit, introduction)}<div class="activity-layout writing-layout">${questionMarkup(question)}<section class="writing-pane"><label for="${id}-draft">${label}</label><textarea class="writing-area ${areaClass}" id="${id}-draft" spellcheck="true">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span></div>${helpMarkup(id, help)}${feedback ? aiMarkup(id) : ""}<div class="action-row"><button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>${saveLabel}</button></div></section></div>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const textarea = document.querySelector(`#${id}-draft`);
  textarea.addEventListener("input", () => {
    saveDraft(draftName, textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-save]").disabled = !textarea.value.trim();
  });
  document.querySelector("[data-save]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft(draftName, textarea.value);
    onSave?.(textarea.value);
    completeUnit(id);
    render();
  });
  bindHelp(id);
  if (feedback) bindAI({ id, textarea, question, analysis, feedback });
}

function renderU5(unit) {
  renderWritingUnit({ id: "u5", unit, introduction: "Write after judging. The question decides what your introduction needs to do; no fixed sentence formula is required.", question: content.u5.question, draftName: "introduction", label: "Your introduction", help: content.u5.help, feedback: content.u5.aiFeedback, analysis: "This question asks the learner to agree or disagree. The introduction should make it clear how strongly the learner agrees.", saveLabel: "Keep this introduction" });
}

function renderCollect(id, unit, { introduction, items, closing }) {
  const saved = getUnitState(id);
  const activeId = saved.activeId || items[0].id;
  const viewed = [...new Set([...(saved.viewed || []), activeId])];
  const active = items.find((item) => item.id === activeId);
  if (!saved.activeId || viewed.length !== (saved.viewed || []).length) setUnitState(id, { activeId, viewed });
  completeUnit(id);
  app.innerHTML = `<article>${unitHeader(unit, introduction)}<p class="choice-note consolidation-note">The three principles are your summary. Continue when you are ready, or select any principle to look closer.</p><div class="framework-strip" role="group" aria-label="Learning principles">${items.map((item) => `<section><button class="editorial-button" type="button" data-collect="${item.id}" aria-pressed="${item.id === activeId}" aria-expanded="${item.id === activeId}" aria-controls="${id}-principle-detail"><strong>${item.label}<small class="control-hint">Look closer <span aria-hidden="true">›</span></small></strong><span>${item.short}</span></button></section>`).join("")}</div><section class="insight-panel" id="${id}-principle-detail" aria-live="polite"><h2>${active.label}</h2><p>${active.detail}</p></section><p class="choice-note consolidation-note">Optional: ${viewed.length} of ${items.length} explanations viewed.</p><blockquote class="principle-panel"><p>${closing}</p></blockquote>${navigationMarkup({ canContinue: true })}</article>`;
  document.querySelectorAll("[data-collect]").forEach((button) => button.addEventListener("click", () => {
    setUnitState(id, { activeId: button.dataset.collect, viewed: [...new Set([...viewed, button.dataset.collect])] });
    render();
  }));
}

function renderU6(unit) {
  renderCollect("u6", unit, { introduction: "Collect the decisions you have already made. These are principles, not a list of compulsory introduction sentences.", items: [
    { id: "topic", label: "Topic", short: "Find the subject.", detail: "Topic words tell you the main subject, but they do not tell you what you need to do." },
    { id: "job", label: "Job", short: "Read the instruction.", detail: "The exact key words determine whether you must discuss, evaluate, explain, compare or answer more than one question." },
    { id: "intro", label: "Introduction", short: "Set up this answer.", detail: "Establish the subject and direction of the answer. Make the writer's position clear only when the question requires one." },
  ], closing: "<strong>The topic gives you the subject. The key words give you the job.</strong>" });
}

function renderB1(unit) {
  const id = "b1";
  const source = content.b1;
  const saved = getUnitState(id);
  const answers = saved.answers || {};
  const ideas = orderedOptions(id, source.ideas, source.shuffle);
  const ready = ideas.every((idea) => answers[idea.id]);
  const correct = ready && source.ideas.every((idea) => answers[idea.id] === idea.answer);
  app.innerHTML = `<article>${unitHeader(unit, "An idea can use the same topic words without helping to answer the instruction.")}${questionMarkup(content.canonicalQuestion)}<form id="b1-form" class="classification-list"><p class="prompt">Classify each idea by what it contributes to this exact question.</p>${ideas.map((idea) => `<div class="classification-row"><label for="b1-${idea.id}">${idea.text}</label><select id="b1-${idea.id}" name="${idea.id}"><option value="">Choose…</option>${source.labels.map((label) => `<option value="${label.id}" ${answers[idea.id] === label.id ? "selected" : ""}>${label.text}</option>`).join("")}</select>${saved.checked && answers[idea.id] ? `<p class="row-feedback">${idea.feedback}</p>` : ""}</div>`).join("")}<button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check the connections</button></form>${saved.checked ? feedbackMarkup(correct ? "You separated ideas that answer directly, ideas that need a clearer connection and ideas that only share the topic." : "At least one connection needs another look. Ask what claim the idea would help you make about whether tuition should be free.", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>Related to the topic ≠ helps answer the question.</strong></p></blockquote>${criterionMarkup("Task Response", "This idea is connected to the topic. But does it help answer the exact question?")}${helpMarkup(id, source.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#b1-form");
  form.addEventListener("change", () => {
    const data = new FormData(form);
    const next = Object.fromEntries(source.ideas.map((idea) => [idea.id, data.get(idea.id)]));
    setUnitState(id, { answers: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !source.ideas.every((idea) => next[idea.id]);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const next = Object.fromEntries(source.ideas.map((idea) => [idea.id, data.get(idea.id)]));
    setUnitState(id, { answers: next, checked: true });
    if (source.ideas.every((idea) => next[idea.id] === idea.answer)) completeUnit(id);
    render();
  });
  bindHelp(id);
}

function renderB2(unit) {
  const id = "b2";
  const source = content.b2;
  const saved = getUnitState(id);
  const selected = saved.selected || [];
  const ordered = orderedOptions(id, source.options, source.shuffle);
  const expected = source.options.filter((option) => option.viable).map((option) => option.id);
  const correct = selected.length === expected.length && expected.every((value) => selected.includes(value));
  app.innerHTML = `<article>${unitHeader(unit, "A relevant idea is a start. The reader may still need to understand why or how it works.")}${questionMarkup(content.canonicalQuestion)}<blockquote class="principle-panel"><p><strong>Idea:</strong> ${source.idea}</p></blockquote><form id="b2-form"><fieldset><legend class="prompt">${source.prompt}</legend><div class="choice-list">${ordered.map((option) => choiceMarkup({ option, name: id, type: "checkbox", checked: selected.includes(option.id) })).join("")}</div></fieldset><button class="primary-button" type="submit">Check my selections</button></form>${saved.checked ? `<div class="classification-list">${source.options.filter((option) => selected.includes(option.id)).map((option) => `<p class="row-feedback"><strong>${option.viable ? "Moves forward:" : "Check this:"}</strong> ${option.feedback}</p>`).join("")}</div>${feedbackMarkup(correct ? "Several different continuations can develop the idea. You selected every strong continuation in this set." : "Reconsider whether each selected sentence adds a reason, result or other useful meaning rather than repetition or a different argument.", correct ? "success" : "reconsider")}` : ""}<blockquote class="principle-panel"><p><strong>Idea ≠ explanation.</strong> Ask why, how, what this means or what happens as a result.</p></blockquote>${helpMarkup(id, source.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#b2-form");
  form.addEventListener("change", () => {
    const next = [...form.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
    setUnitState(id, { selected: next, checked: false });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = [...form.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
    const success = next.length === expected.length && expected.every((value) => next.includes(value));
    setUnitState(id, { selected: next, checked: true });
    if (success) completeUnit(id);
    render();
  });
  bindHelp(id);
}

function renderB3(unit) {
  const id = "b3";
  const source = content.b3;
  const saved = getUnitState(id);
  const ideas = orderedOptions("b3-ideas", source.ideas, true);
  const whys = saved.idea ? orderedOptions("b3-whys", source.whys.filter((item) => item.idea === saved.idea), true) : [];
  const supports = saved.idea ? orderedOptions("b3-supports", source.supports.filter((item) => item.idea === saved.idea || item.idea === "all"), true) : [];
  const customNeeded = saved.position === "I want to write my position differently";
  const ready = saved.position && saved.idea && saved.why && saved.support && (!customNeeded || saved.customPosition?.trim());
  app.innerHTML = `<article>${unitHeader(unit, "Build a reasoning chain one relationship at a time. Use only the steps your idea needs.")}${questionMarkup(content.canonicalQuestion)}<form id="b3-form" class="reasoning-builder"><label class="reasoning-step"><strong>My position</strong><select name="position"><option value="">Choose planning support…</option>${source.positions.map((position) => `<option ${saved.position === position ? "selected" : ""}>${position}</option>`).join("")}</select></label>${customNeeded ? `<label class="reasoning-step"><strong>My position in my own words</strong><input class="reasoning-note" name="customPosition" value="${escapeHTML(saved.customPosition)}"/></label>` : ""}<label class="reasoning-step"><strong>Relevant idea</strong><select name="idea"><option value="">Choose an idea…</option>${ideas.map((idea) => `<option value="${idea.id}" ${saved.idea === idea.id ? "selected" : ""}>${idea.text}</option>`).join("")}</select></label><label class="reasoning-step"><strong>Why or how?</strong><select name="why" ${saved.idea ? "" : "disabled"}><option value="">Choose a reasoning link…</option>${whys.map((item) => `<option value="${item.id}" ${saved.why === item.id ? "selected" : ""}>${item.text}</option>`).join("")}</select></label><label class="reasoning-step"><strong>What else, if anything, would help the reader?</strong><select name="support" ${saved.idea ? "" : "disabled"}><option value="">Choose another useful step, or decide the reason is enough…</option>${supports.map((item) => `<option value="${item.id}" ${saved.support === item.id ? "selected" : ""}>${item.text}</option>`).join("")}</select></label><label class="reasoning-step"><strong>Optional note in my own words</strong><textarea name="note" rows="3">${escapeHTML(state.drafts.reasoningNote)}</textarea></label><button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Keep this reasoning</button></form>${saved.saved ? feedbackMarkup("Your chain is saved as reasoning notes, not polished prose. You decide how to turn it into writing.") : ""}<blockquote class="principle-panel"><p>A reason may already make the idea clear. Add a result, comparison, clearer detail or realistic example only when the reader needs it.</p><p>You can use realistic examples. You do not need to invent facts, statistics or authorities.</p></blockquote>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#b3-form");
  form.addEventListener("change", () => {
    const data = new FormData(form);
    const nextIdea = data.get("idea");
    const ideaChanged = nextIdea !== saved.idea;
    setUnitState(id, { position: data.get("position"), customPosition: data.get("customPosition") || "", idea: nextIdea, why: ideaChanged ? "" : data.get("why"), support: ideaChanged ? "" : data.get("support"), saved: false });
    saveDraft("reasoningNote", data.get("note") || "");
    render();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    saveDraft("reasoningNote", data.get("note") || "");
    setUnitState(id, { saved: true });
    completeUnit(id);
    render();
  });
}

function renderB4(unit) {
  renderMatrixJudgement("b4", unit, { introduction: "More sentences, difficult words and a precise-looking study do not automatically develop an idea.", question: content.canonicalQuestion, items: content.b4.options, values: [{ id: "strong", label: "Strong development" }, { id: "could", label: "Could work — needs more" }, { id: "weak", label: "Does not develop this idea well" }], prompt: content.b4.prompt, help: content.b4.help, principle: "<strong>More words ≠ more development. Difficult vocabulary ≠ better reasoning. A specific example ≠ relevant support.</strong>", successMessage: "You distinguished clear development, a promising but incomplete route, repetition and unsupported invented evidence.", retryMessage: "Look at what each version helps the reader understand. Relevant wording alone does not show why the access idea works." });
}

function reasoningSummary() {
  const saved = getUnitState("b3");
  const idea = content.b3.ideas.find((item) => item.id === saved.idea)?.text || "No saved idea";
  const why = content.b3.whys.find((item) => item.id === saved.why)?.text || "No saved explanation";
  const support = content.b3.supports.find((item) => item.id === saved.support)?.text || "No saved support";
  return `Position: ${saved.customPosition || saved.position || "Not recorded"}\nIdea: ${idea}\nWhy/how: ${why}\nSupport: ${support}${state.drafts.reasoningNote ? `\nOwn note: ${state.drafts.reasoningNote}` : ""}`;
}

function renderB5(unit) {
  const summary = reasoningSummary();
  const saved = getUnitState("b5");
  const draft = state.drafts.bodyParagraph || "";
  app.innerHTML = `<article>${unitHeader(unit, "Turn your reasoning into one genuine paragraph. Focus, develop and stop when the idea has done its job.")}${questionMarkup(content.canonicalQuestion)}<div class="activity-layout writing-layout"><aside><h2>Your reasoning notes</h2><pre class="workspace-note">${escapeHTML(summary)}</pre><div class="framework-strip"><section><strong>Focus</strong><span>What does this contribute?</span></section><section><strong>Develop</strong><span>Explain and support it.</span></section><section><strong>Close</strong><span>Has the idea done its job?</span></section></div></aside><section class="writing-pane"><label for="b5-draft">Your body paragraph</label><textarea class="writing-area paragraph-area" id="b5-draft">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span></div>${helpMarkup("b5", content.b5.help)}${aiMarkup("b5")}<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>Keep this paragraph</button></section></div>${navigationMarkup({ canContinue: state.completed.includes("b5") })}</article>`;
  const textarea = document.querySelector("#b5-draft");
  textarea.addEventListener("input", () => { saveDraft("bodyParagraph", textarea.value); document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`; document.querySelector("[data-save]").disabled = !textarea.value.trim(); });
  document.querySelector("[data-save]").addEventListener("click", () => { if (!textarea.value.trim()) return; saveDraft("bodyParagraph", textarea.value); completeUnit("b5"); render(); });
  bindHelp("b5");
  bindAI({ id: "b5", textarea, question: content.canonicalQuestion, analysis: reasoningSummary(), feedback: content.b5.aiFeedback });
}

function renderB6(unit) {
  renderCollect("b6", unit, { introduction: "You have already answered, explained and supported. AES gives those actions a short name for later checking.", items: [
    { id: "answer", label: "Answer everything", short: "Do every job.", detail: "Answer the actual instruction, including every required part and a clear position when the task asks for one." },
    { id: "explain", label: "Explain", short: "Show why or how.", detail: "Develop important ideas so the reader can understand the reasoning rather than seeing only a claim." },
    { id: "support", label: "Support", short: "Give enough reason.", detail: "Use further reasoning, a result, comparison, clearer detail, a realistic situation or an example where it helps." },
  ], closing: "<strong>AES is our workshop checking tool. It is not official IELTS terminology.</strong>" });
}

function renderW1(unit) {
  const id = "w1";
  const saved = getUnitState(id);
  const answers = saved.answers || {};
  const allAnswered = content.w1.tasks.every((task) => Array.isArray(answers[task.id]) && answers[task.id].length);
  const correct = allAnswered && content.w1.tasks.every((task) => task.required.length === answers[task.id].length && task.required.every((job) => answers[task.id].includes(job)));
  const tasks = orderedOptions("w1-tasks", content.w1.tasks, true);
  app.innerHTML = `<article>${unitHeader(unit, "Before assigning paragraphs, identify what each exact instruction requires the complete response to do.")}<form id="w1-form" class="judgement-list">${tasks.map((task) => `<fieldset class="judgement-row"><legend>${task.instruction}</legend><div class="choice-list">${orderedOptions(`w1-${task.id}-jobs`, task.jobs, true).map((job) => choiceMarkup({ option: job, name: task.id, type: "checkbox", checked: answers[task.id]?.includes(job.id) })).join("")}</div></fieldset>`).join("")}<button class="primary-button" type="submit" ${allAnswered ? "" : "disabled"}>Check the essay jobs</button></form>${saved.checked ? feedbackMarkup(correct ? "You identified the required jobs without turning them automatically into paragraph rules." : "At least one set includes a job from a nearby kind of Task 2 question, or misses something this instruction directly asks for.", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>Let the question determine the jobs the essay must do.</strong></p></blockquote>${helpMarkup(id, content.w1.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#w1-form");
  const collect = () => Object.fromEntries(content.w1.tasks.map((task) => [task.id, [...form.querySelectorAll(`input[name="${task.id}"]:checked`)].map((input) => input.value)]));
  form.addEventListener("change", () => { const next = collect(); setUnitState(id, { answers: next, checked: false }); form.querySelector('button[type="submit"]').disabled = !content.w1.tasks.every((task) => next[task.id].length); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const next = collect(); setUnitState(id, { answers: next, checked: true }); if (content.w1.tasks.every((task) => task.required.length === next[task.id].length && task.required.every((job) => next[task.id].includes(job)))) completeUnit(id); render(); });
  bindHelp(id);
}

function renderW2(unit) {
  const id = "w2";
  const saved = getUnitState(id);
  const answers = saved.answers || {};
  const plans = orderedOptions(id, content.w2.options, content.w2.shuffle);
  const ready = plans.every((plan) => answers[plan.id]);
  const correct = ready && content.w2.options.every((plan) => answers[plan.id] === plan.status);
  const labels = [{ id: "works", text: "Works well" }, { id: "could", text: "Could work — think about…" }, { id: "weak", text: "Doesn't yet answer clearly" }];
  app.innerHTML = `<article>${unitHeader(unit, "Paragraphs organise the jobs of an answer. More than one organisation can work, but every plan has advantages and risks.")}${questionMarkup(content.canonicalQuestion)}<form id="w2-form" class="plan-list">${plans.map((plan) => `<div class="plan-option"><h2>${plan.label}</h2><p>${plan.text}</p><label for="w2-${plan.id}">How well could this plan work?</label><select id="w2-${plan.id}" name="${plan.id}"><option value="">Choose…</option>${labels.map((label) => `<option value="${label.id}" ${answers[plan.id] === label.id ? "selected" : ""}>${label.text}</option>`).join("")}</select>${saved.checked ? `<p class="row-feedback">${plan.feedback}</p>` : ""}</div>`).join("")}<button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check the plans</button></form>${saved.checked ? feedbackMarkup(correct ? "You recognised both a reliable plan and a possible more complex alternative, while noticing risks from thin or repeated ideas." : "Review the advantages and risks. A different paragraph count is not automatically wrong, and relevant ideas are not automatically developed.", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>Fewer developed ideas can be stronger than many undeveloped ideas.</strong></p></blockquote><p class="strategy-note"><strong>We recommend:</strong> introduction → body 1 → body 2 → conclusion as a reliable strategy for many essays. It is not an IELTS requirement and does not guarantee quality.</p>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#w2-form");
  form.addEventListener("change", () => { const data = new FormData(form); const next = Object.fromEntries(content.w2.options.map((plan) => [plan.id, data.get(plan.id)])); setUnitState(id, { answers: next, checked: false }); form.querySelector('button[type="submit"]').disabled = !content.w2.options.every((plan) => next[plan.id]); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(form); const next = Object.fromEntries(content.w2.options.map((plan) => [plan.id, data.get(plan.id)])); setUnitState(id, { answers: next, checked: true }); if (content.w2.options.every((plan) => next[plan.id] === plan.status)) completeUnit(id); render(); });
}

function renderW3(unit) {
  const id = "w3";
  const saved = getUnitState(id);
  const progression = orderedOptions("w3-progression", content.w3.progression, true);
  const consistency = orderedOptions("w3-consistency", content.w3.consistency, true);
  const pChoice = content.w3.progression.find((item) => item.id === saved.progression);
  const cChoice = content.w3.consistency.find((item) => item.id === saved.consistency);
  const ready = saved.progression && saved.consistency;
  const correct = pChoice?.viable && cChoice?.viable;
  app.innerHTML = `<article>${unitHeader(unit, "Ideas work together when each paragraph moves the same answer forward. More linking words cannot create that movement.")}${questionMarkup(content.canonicalQuestion)}<form id="w3-form" class="judgement-list"><fieldset class="judgement-row"><legend>Which pair of body contributions creates the clearest movement from one idea to the next?</legend><div class="choice-list">${progression.map((option) => choiceMarkup({ option, name: "progression", checked: saved.progression === option.id })).join("")}</div>${saved.checked && pChoice ? `<p class="row-feedback">${pChoice.feedback}</p>` : ""}</fieldset><fieldset class="judgement-row"><legend>The introduction says the writer mostly agrees, but body 2 argues the opposite without explaining the change. What would keep the position clear?</legend><div class="choice-list">${consistency.map((option) => choiceMarkup({ option, name: "consistency", checked: saved.consistency === option.id })).join("")}</div>${saved.checked && cChoice ? `<p class="row-feedback">${cChoice.feedback}</p>` : ""}</fieldset><button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check the relationships</button></form>${saved.checked ? feedbackMarkup(correct ? "The paragraphs now make different connected contributions, and the other concern is recognised without losing the overall position." : "Remove the linking words mentally and inspect the reasoning. Does it move forward, and can the reader tell what the writer thinks?", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>You can recognise another side without losing your position. Coherence is not created by adding more connectors.</strong></p></blockquote>${criterionMarkup("Coherence & Cohesion", "Can the reader follow how each paragraph moves the answer forward?")}${helpMarkup(id, content.w3.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#w3-form");
  form.addEventListener("change", () => { const data = new FormData(form); setUnitState(id, { progression: data.get("progression"), consistency: data.get("consistency"), checked: false }); form.querySelector('button[type="submit"]').disabled = !(data.get("progression") && data.get("consistency")); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(form); const pc = content.w3.progression.find((item) => item.id === data.get("progression")); const cc = content.w3.consistency.find((item) => item.id === data.get("consistency")); setUnitState(id, { progression: data.get("progression"), consistency: data.get("consistency"), checked: true }); if (pc?.viable && cc?.viable) completeUnit(id); render(); });
  bindHelp(id);
}

function renderW4(unit) {
  const id = "w4";
  const saved = getUnitState(id);
  const intro = state.drafts.introduction || "";
  const conclusions = orderedOptions(id, content.w4.conclusions, true);
  const selected = content.w4.conclusions.find((item) => item.id === saved.conclusion);
  app.innerHTML = `<article>${unitHeader(unit, "The beginning should set up the answer actually given. The ending should close that answer rather than starting another one.")}${questionMarkup(content.canonicalQuestion)}<section class="insight-panel"><h2>The answer the body developed</h2><p>${content.w4.bodyPlan}</p></section><div class="activity-layout"><section><label class="writing-label" for="w4-intro">Does your introduction still fit? Revise it if your answer developed differently.</label><textarea class="writing-area" id="w4-intro">${escapeHTML(intro)}</textarea></section><form id="w4-form"><fieldset><legend class="prompt">Which conclusion best closes this developed answer?</legend><div class="choice-list">${conclusions.map((option) => choiceMarkup({ option, name: "conclusion", checked: saved.conclusion === option.id })).join("")}</div></fieldset><button class="primary-button" type="submit" ${saved.conclusion && intro.trim() ? "" : "disabled"}>Check beginning and ending</button>${saved.checked && selected ? feedbackMarkup(selected.feedback, selected.viable ? "success" : "reconsider") : ""}</form></div><blockquote class="principle-panel"><p><strong>Close the answer. Don't start a new one.</strong> Simple wording such as “In conclusion” is valid.</p></blockquote>${helpMarkup(id, content.w4.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const introField = document.querySelector("#w4-intro");
  introField.addEventListener("input", () => { saveDraft("introduction", introField.value); document.querySelector('#w4-form button[type="submit"]').disabled = !(introField.value.trim() && document.querySelector('input[name="conclusion"]:checked')); });
  document.querySelectorAll('input[name="conclusion"]').forEach((input) => input.addEventListener("change", () => { setUnitState(id, { conclusion: input.value, checked: false }); document.querySelector('#w4-form button[type="submit"]').disabled = !introField.value.trim(); }));
  document.querySelector("#w4-form").addEventListener("submit", (event) => { event.preventDefault(); const conclusion = document.querySelector('input[name="conclusion"]:checked')?.value; const option = content.w4.conclusions.find((item) => item.id === conclusion); saveDraft("introduction", introField.value); setUnitState(id, { conclusion, checked: true }); if (option?.viable && introField.value.trim()) completeUnit(id); render(); });
  bindHelp(id);
}

function planFormMarkup(name, plan, { transfer = false } = {}) {
  return `<form id="${name}-form" class="plan-form"><label class="plan-field"><strong>My job</strong><textarea name="job">${escapeHTML(plan.job)}</textarea></label><label class="plan-field"><strong>My position ${transfer ? "— if the question requires one" : ""}</strong><textarea name="position">${escapeHTML(plan.position)}</textarea></label><label class="plan-field"><strong>Body 1 — main contribution</strong><textarea name="body1">${escapeHTML(plan.body1)}</textarea></label><label class="plan-field"><strong>Body 2 — main contribution</strong><textarea name="body2">${escapeHTML(plan.body2)}</textarea></label>${transfer ? "" : `<label class="plan-field"><strong>Have I covered every job without repeating the same idea?</strong><textarea name="check">${escapeHTML(plan.check)}</textarea></label>`}<div class="action-row full-width"><button class="primary-button" type="submit">Keep this quick plan</button></div></form>`;
}

function renderW5(unit) {
  const id = "w5";
  const plan = state.drafts.quickPlan;
  app.innerHTML = `<article>${unitHeader(unit, "A useful exam plan should be brief enough to guide writing without becoming a second essay.")}${questionMarkup(content.canonicalQuestion)}<p class="strategy-note"><strong>Useful option:</strong> two main body contributions are dependable for many learners, but they are not required. Add or combine contributions when another clear plan serves the question better.</p>${planFormMarkup("quick-plan", plan)}${getUnitState(id).saved ? feedbackMarkup("Your plan is saved as brief thinking notes. It will remain available while you write, but it will not generate prose.") : ""}<blockquote class="principle-panel"><p><strong>Use detailed support first → reduce support → plan quickly.</strong></p></blockquote>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#quick-plan-form");
  const submit = form.querySelector('button[type="submit"]');
  const planIsReady = () => ["job", "position", "body1", "body2"].every((name) => form.elements[name].value.trim());
  submit.disabled = !planIsReady();
  form.addEventListener("input", () => { const data = new FormData(form); savePlan("quickPlan", Object.fromEntries(data.entries())); submit.disabled = !planIsReady(); });
  form.addEventListener("submit", (event) => { event.preventDefault(); if (!planIsReady()) return; const data = new FormData(form); savePlan("quickPlan", Object.fromEntries(data.entries())); setUnitState(id, { saved: true }); completeUnit(id); render(); });
}

function essayWorkspace({ id, unit, introduction, question, draftName, feedback, analysis, transfer = false, onSave }) {
  const draft = state.drafts[draftName] || "";
  const plan = transfer ? state.drafts.transferPlan : state.drafts.quickPlan;
  app.innerHTML = `<article>${unitHeader(unit, introduction)}<div class="activity-layout writing-layout"><details class="source-pane" open><summary>View the question and plan</summary>${questionMarkup(question, { transfer, meta: true })}<section class="workspace-note"><h2>Your quick plan</h2><p><strong>Job:</strong> ${escapeHTML(plan.job || "Not recorded")}</p><p><strong>Position:</strong> ${escapeHTML(plan.position || (transfer ? "Not required unless you choose to add a balanced overall observation" : "Not recorded"))}</p><p><strong>Body 1:</strong> ${escapeHTML(plan.body1 || "Not recorded")}</p><p><strong>Body 2:</strong> ${escapeHTML(plan.body2 || "Not recorded")}</p></section></details><section class="writing-pane"><label for="${id}-draft">Your complete essay</label><textarea class="writing-area full-essay-area" id="${id}-draft" spellcheck="true">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span><span data-word-requirement>${wordRequirementMessage(wordCount(draft))}</span></div>${helpMarkup(id, ["Which required job is hardest to see in your current response?", "Check paragraph contributions, idea development, position where required, conclusion and language clarity one at a time."])}${aiMarkup(id)}<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>${transfer ? "Keep this transfer response" : "Keep this complete essay"}</button></section></div>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const textarea = document.querySelector(`#${id}-draft`);
  textarea.addEventListener("input", () => { saveDraft(draftName, textarea.value); const count = wordCount(textarea.value); document.querySelector("[data-word-count]").textContent = `${count} words`; document.querySelector("[data-word-requirement]").textContent = wordRequirementMessage(count); document.querySelector("[data-save]").disabled = !textarea.value.trim(); });
  document.querySelector("[data-save]").addEventListener("click", () => { if (!textarea.value.trim()) return; saveDraft(draftName, textarea.value); onSave?.(textarea.value); completeUnit(id); render(); });
  bindHelp(id);
  bindAI({ id, textarea, question, analysis, feedback });
}

function renderW6(unit) {
  essayWorkspace({ id: "w6", unit, introduction: "Write the complete answer in a large, calm workspace. Your plan remains available, but only you decide what becomes prose.", question: content.canonicalQuestion, draftName: "fullEssay", feedback: content.ai.fullEssay, analysis: `Agreement/position task. Learner's plan: ${JSON.stringify(state.drafts.quickPlan)}`, onSave: (value) => { if (!state.drafts.originalEssay.trim()) state.drafts.originalEssay = value; if (!state.drafts.revisedEssay.trim()) state.drafts.revisedEssay = value; saveTask2State(state); } });
}

function renderW7(unit) {
  const id = "w7";
  const saved = getUnitState(id);
  const answers = saved.answers || {};
  const checks = [
    { id: "jobs", text: "The essay performs the jobs I identified." },
    { id: "paragraphs", text: "I can identify the useful job of each paragraph." },
    { id: "match", text: "The written organisation broadly matches—or sensibly improves—my plan." },
  ];
  const statuses = ["Yes", "Not sure", "Needs attention"];
  const ready = checks.every((check) => answers[check.id]);
  app.innerHTML = `<article>${unitHeader(unit, "Keep this review structural. Full diagnosis belongs in the next phase.")}${questionMarkup(content.canonicalQuestion)}<form id="w7-form" class="judgement-list"><p class="prompt">Did the essay you wrote match the organisation you intended?</p>${checks.map((check) => `<fieldset class="judgement-row"><legend>${check.text}</legend><div class="inline-choices">${statuses.map((status) => compactChoice({ value: status, label: status, name: check.id, checked: answers[check.id] === status })).join("")}</div></fieldset>`).join("")}<button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Keep this structural review</button></form>${saved.saved ? feedbackMarkup("Your structural reflection is saved. It is not a score and does not require you to invent a weakness.") : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#w7-form");
  form.addEventListener("change", () => { const data = new FormData(form); const next = Object.fromEntries(checks.map((check) => [check.id, data.get(check.id)])); setUnitState(id, { answers: next, saved: false }); form.querySelector('button[type="submit"]').disabled = !checks.every((check) => next[check.id]); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(form); setUnitState(id, { answers: Object.fromEntries(checks.map((check) => [check.id, data.get(check.id)])), saved: true }); completeUnit(id); render(); });
}

function renderC1(unit) {
  const id = "c1";
  const saved = getUnitState(id);
  const selected = saved.selected || [];
  const issues = content.c1.paragraphs.filter((paragraph) => paragraph.issue).map((paragraph) => paragraph.id);
  const correct = selected.length === issues.length && issues.every((item) => selected.includes(item));
  app.innerHTML = `<article>${unitHeader(unit, "Use AES on a realistic essay. Make your own diagnosis before reading the workshop's explanation.")}${questionMarkup(content.canonicalQuestion)}<section class="framework-strip" aria-label="AES checking lens"><section><strong>Answer</strong><span>Task jobs and position</span></section><section><strong>Explain</strong><span>Can the reader understand why or how?</span></section><section><strong>Support</strong><span>Is there enough further reason or clear detail?</span></section></section><p class="prompt">Choose the two paragraphs that most need attention.</p><div class="diagnostic-list">${content.c1.paragraphs.map((paragraph) => `<button class="diagnostic-button" type="button" data-paragraph="${paragraph.id}" data-selected="${selected.includes(paragraph.id)}" aria-pressed="${selected.includes(paragraph.id)}"><strong>${paragraph.label}</strong><span>${paragraph.text}</span></button>`).join("")}</div><button class="primary-button" type="button" data-check ${selected.length === 2 ? "" : "disabled"}>Check my diagnosis</button>${saved.checked ? feedbackMarkup(correct ? "The funding paragraph names a concern without showing how it affects the tuition judgement. The conclusion then changes a partly-agree position into complete agreement." : "The essay contains successful thinking as well as weaknesses. Compare what the introduction promises with the conclusion, then ask what the funding paragraph actually explains.", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>Looks like an IELTS essay ≠ fully answers the question well.</strong></p></blockquote>${helpMarkup(id, ["What is each paragraph trying to do? Give each one a short job before deciding which needs attention.", "Does each body paragraph explain its main idea enough? Then compare the position in the introduction with the position in the conclusion.", "Look closely at body paragraph 2 and the conclusion. One needs a clearer reasoning link; the other needs to keep the same strength of position."])}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll("[data-paragraph]").forEach((button) => button.addEventListener("click", () => {
    const value = button.dataset.paragraph;
    const next = selected.includes(value) ? selected.filter((item) => item !== value) : selected.length < 2 ? [...selected, value] : selected;
    setUnitState(id, { selected: next, checked: false });
    render();
  }));
  document.querySelector("[data-check]")?.addEventListener("click", () => { setUnitState(id, { checked: true }); if (correct) completeUnit(id); render(); });
  bindHelp(id);
}

function renderC2(unit) {
  const id = "c2";
  const saved = getUnitState(id);
  const options = orderedOptions(id, content.c2.options, content.c2.shuffle);
  const selected = content.c2.options.find((option) => option.id === saved.choice);
  app.innerHTML = `<article>${unitHeader(unit, "All changes can be considered, but they do not all affect the answer equally. Choose the first useful revision.")}${questionMarkup(content.canonicalQuestion)}<fieldset><legend class="prompt">What should this writer fix first?</legend><div class="choice-list">${options.map((option) => choiceMarkup({ option, name: id, checked: saved.choice === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${saved.choice ? "" : "disabled"}>Check the priority</button>${saved.checked && selected ? feedbackMarkup(selected.feedback, selected.priority === 1 ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>Fix what most affects the answer first. Then improve clarity and language.</strong></p><p>A lower-priority change may still be useful later; it is not automatically wrong.</p></blockquote>${helpMarkup(id, content.c2.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => { setUnitState(id, { choice: input.value, checked: false }); document.querySelector("[data-check]").disabled = false; }));
  document.querySelector("[data-check]").addEventListener("click", () => { const choice = document.querySelector(`input[name="${id}"]:checked`)?.value; const option = content.c2.options.find((item) => item.id === choice); setUnitState(id, { choice, checked: true }); if (option?.priority === 1) completeUnit(id); render(); });
  bindHelp(id);
}

function renderC3(unit) {
  const id = "c3";
  if (!state.drafts.originalEssay.trim()) state.drafts.originalEssay = state.drafts.fullEssay;
  if (!state.drafts.revisedEssay.trim()) state.drafts.revisedEssay = state.drafts.fullEssay;
  saveTask2State(state);
  const draft = state.drafts.revisedEssay;
  const saved = getUnitState(id);
  const priorities = ["My answer to the question", "My position", "My reasoning and support", "My organisation", "My language clarity"].map((priority) => ({ id: priority, label: priority }));
  const displayedPriorities = orderedOptions("c3-priorities", priorities, true);
  app.innerHTML = `<article>${unitHeader(unit, "Choose what you are trying to improve, then edit your existing essay directly.")}${questionMarkup(content.canonicalQuestion, { meta: true })}<div class="activity-layout writing-layout"><aside><h2>Choose one main revision priority</h2><div class="priority-choices">${displayedPriorities.map((priority) => compactChoice({ value: priority.id, label: priority.label, name: "priority", checked: saved.priority === priority.id })).join("")}</div><details class="workspace-note"><summary>View short AES and official-criteria reminders</summary><p><strong>AES:</strong> Answer everything · Explain · Support.</p><p><strong>Official criteria:</strong> Task Response · Coherence and Cohesion · Lexical Resource · Grammatical Range and Accuracy.</p></details></aside><section class="writing-pane"><label for="c3-draft">Your revised essay</label><textarea class="writing-area full-essay-area" id="c3-draft">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span><span data-word-requirement>${wordRequirementMessage(wordCount(draft))}</span></div>${aiMarkup(id, { revision: true })}<button class="primary-button" type="button" data-save ${saved.priority && draft.trim() ? "" : "disabled"}>Keep this revision</button></section></div>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const textarea = document.querySelector("#c3-draft");
  textarea.addEventListener("input", () => { saveDraft("revisedEssay", textarea.value); const count = wordCount(textarea.value); document.querySelector("[data-word-count]").textContent = `${count} words`; document.querySelector("[data-word-requirement]").textContent = wordRequirementMessage(count); document.querySelector("[data-save]").disabled = !(textarea.value.trim() && getUnitState(id).priority); });
  document.querySelectorAll('input[name="priority"]').forEach((input) => input.addEventListener("change", () => { saveDraft("revisedEssay", textarea.value); setUnitState(id, { priority: input.value }); render(); }));
  document.querySelector("[data-save]").addEventListener("click", () => { if (!textarea.value.trim() || !getUnitState(id).priority) return; saveDraft("revisedEssay", textarea.value); completeUnit(id); render(); });
  bindRevisionAI({ id, textarea, question: content.canonicalQuestion, selectedPriority: getUnitState(id).priority || "not chosen", feedback: content.ai.revision, originalResponse: state.drafts.originalEssay });
}

function teachingExampleMarkup() {
  return `<div class="essay-copy">${content.teachingExample.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>`;
}

function renderC4(unit) {
  const id = "c4";
  const saved = getUnitState(id);
  const effects = [
    { id: "answer", text: "Answered the question more completely" },
    { id: "reasoning", text: "Made reasoning clearer" },
    { id: "organisation", text: "Improved organisation" },
    { id: "position", text: "Made the position clearer" },
    { id: "language", text: "Improved language clarity" },
    { id: "already-worked", text: "Changed little because the original already worked" },
  ];
  const displayedEffects = orderedOptions("c4-effects", effects, true);
  const storedEffects = saved.effects || [];
  const reflection = storedEffects.includes("already-worked") && storedEffects.length > 1
    ? storedEffects.filter((effect) => effect !== "already-worked")
    : storedEffects;
  const activeLens = saved.activeLens || content.teachingExample.lenses[0].id;
  const lens = content.teachingExample.lenses.find((item) => item.id === activeLens);
  app.innerHTML = `<article>${unitHeader(unit, "Compare meaning and usefulness, not just changed words. No score is assigned to the difference.")}${questionMarkup(content.canonicalQuestion)}<div class="before-after"><section class="version-panel"><h2>Original</h2><div class="essay-copy">${escapeHTML(state.drafts.originalEssay)}</div></section><section class="version-panel"><h2>Revised</h2><div class="essay-copy">${escapeHTML(state.drafts.revisedEssay)}</div></section></div><form id="c4-form"><fieldset><legend class="prompt">What did your revision improve?</legend><div class="reflection-options">${displayedEffects.map((effect) => compactChoice({ value: effect.id, label: effect.text, name: "effects", type: "checkbox", checked: reflection.includes(effect.id) })).join("")}</div></fieldset><p class="choice-note">Choose the changes that genuinely apply. “Changed little” cannot be combined with improvement choices.</p><button class="primary-button" type="submit" ${reflection.length ? "" : "disabled"}>Keep this reflection</button></form>${saved.saved ? `<section class="model-panel"><p class="eyebrow">Teaching example</p><h2>One successful route—not the correct answer</h2><div class="lens-buttons">${content.teachingExample.lenses.map((item) => `<button type="button" data-lens="${item.id}" aria-pressed="${item.id === activeLens}">${item.label}</button>`).join("")}</div><aside class="insight-panel"><h3>${lens.label}</h3><p>${lens.note}</p></aside>${teachingExampleMarkup()}</section>` : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#c4-form");
  form.addEventListener("change", (event) => {
    const changedLittle = form.querySelector('input[value="already-worked"]');
    const improvementInputs = [...form.querySelectorAll('input[name="effects"]:not([value="already-worked"])')];
    if (event.target === changedLittle && changedLittle.checked) improvementInputs.forEach((input) => { input.checked = false; });
    if (event.target !== changedLittle && event.target.checked) changedLittle.checked = false;
    const next = [...form.querySelectorAll('input[name="effects"]:checked')].map((input) => input.value);
    setUnitState(id, { effects: next, saved: false });
    form.querySelector('button[type="submit"]').disabled = !next.length;
  });
  form.addEventListener("submit", (event) => { event.preventDefault(); const next = [...form.querySelectorAll('input[name="effects"]:checked')].map((input) => input.value); setUnitState(id, { effects: next, saved: true }); completeUnit(id); render(); });
  document.querySelectorAll("[data-lens]").forEach((button) => button.addEventListener("click", () => { setUnitState(id, { activeLens: button.dataset.lens }); render(); }));
}

function renderC5(unit) {
  const id = "c5";
  const draft = state.drafts.transferRevision || state.drafts.transferEssay || "";
  const plan = state.drafts.transferPlan;
  const saved = getUnitState(id);
  app.innerHTML = `<article>${unitHeader(unit, "Transfer the process to a different instruction with much less support.")}<div class="context-entry"><section>${questionMarkup(content.transferQuestion, { transfer: true, meta: true })}<details class="workspace-note" ${saved.planOpen ? "open" : ""}><summary>Optional quick plan</summary>${planFormMarkup("transfer-plan", plan, { transfer: true })}</details></section><figure class="context-illustration"><img src="../../media/writing/task-2/home-working-context.png?v=2" alt="A woman writes notes while working on a laptop at home."/><figcaption>A new working-from-home context. The image does not present it as beneficial or harmful.</figcaption></figure></div><section class="writing-pane"><label for="c5-draft">Your transfer essay</label><textarea class="writing-area full-essay-area" id="c5-draft">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span><span data-word-requirement>${wordRequirementMessage(wordCount(draft))}</span></div>${helpMarkup(id, ["What two jobs does ‘advantages and disadvantages’ create? Does the question directly ask what you think?", "Optional reminders: What is the job? What are the main body contributions? AES: Answer, Explain, Support."])}${aiMarkup(id)}<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>Keep this transfer response</button></section>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const planForm = document.querySelector("#transfer-plan-form");
  planForm.addEventListener("input", () => { const data = new FormData(planForm); savePlan("transferPlan", Object.fromEntries(data.entries())); });
  planForm.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(planForm); savePlan("transferPlan", Object.fromEntries(data.entries())); setUnitState(id, { planSaved: true, planOpen: true }); render(); });
  const textarea = document.querySelector("#c5-draft");
  textarea.addEventListener("input", () => { saveDraft("transferRevision", textarea.value); const count = wordCount(textarea.value); document.querySelector("[data-word-count]").textContent = `${count} words`; document.querySelector("[data-word-requirement]").textContent = wordRequirementMessage(count); document.querySelector("[data-save]").disabled = !textarea.value.trim(); });
  document.querySelector("[data-save]").addEventListener("click", () => { if (!textarea.value.trim()) return; if (!state.drafts.transferOriginal.trim()) state.drafts.transferOriginal = textarea.value; state.drafts.transferEssay = textarea.value; state.drafts.transferRevision = textarea.value; saveTask2State(state); completeUnit(id); render(); });
  bindHelp(id);
  bindAI({ id, textarea, question: content.transferQuestion, analysis: `This instruction asks for advantages and disadvantages. It does not explicitly require a personal opinion or an outweigh judgement. Learner's optional plan: ${JSON.stringify(state.drafts.transferPlan)}`, feedback: content.ai.transfer });
}

function renderC6(unit) {
  const id = "c6";
  const saved = getUnitState(id);
  const items = [
    { id: "read", label: "Read", text: "Identify the job." },
    { id: "plan", label: "Plan", text: "Decide the answer and paragraph contributions." },
    { id: "build", label: "Build", text: "Explain and support." },
    { id: "write", label: "Write", text: "Organise clearly." },
    { id: "check", label: "Check", text: "Confirm every required job is answered." },
    { id: "revise", label: "Revise", text: "Fix what most affects the answer first." },
  ];
  const viewed = saved.viewed || [];
  const complete = viewed.length === items.length;
  app.innerHTML = `<article>${unitHeader(unit, "Keep one usable process, not every framework and rule from the workshop.")}<p class="prompt">Select each step once to confirm the complete process.</p><div class="final-process" role="group" aria-label="Complete Task 2 process">${items.map((item) => `<button type="button" data-process="${item.id}" aria-pressed="${viewed.includes(item.id)}"><strong>${item.label}</strong><span>${item.text}</span></button>`).join("")}</div><p class="choice-note">${viewed.length} of ${items.length} steps considered.</p>${saved.finished ? `<div class="completion-note"><h2>Task 2 v0.1 journey complete</h2><p>You interpreted questions, built and organised an answer, wrote, diagnosed, revised and transferred the process to a new task. Your responses remain saved on this device.</p></div>` : complete ? feedbackMarkup("All six steps are considered. Use the final button when you are ready to mark this workshop journey complete.") : ""}<div class="action-row"><button class="primary-button" type="button" data-finish ${complete && !saved.finished ? "" : "disabled"}>${saved.finished ? "Workshop journey complete" : "Complete this workshop journey"}</button></div>${navigationMarkup({ canContinue: saved.finished })}</article>`;
  document.querySelectorAll("[data-process]").forEach((button) => button.addEventListener("click", () => { setUnitState(id, { viewed: [...new Set([...viewed, button.dataset.process])] }); render(); }));
  document.querySelector("[data-finish]")?.addEventListener("click", () => { setUnitState(id, { finished: true }); completeUnit(id); render(); });
}

const renderers = { u1: renderU1, u2: renderU2, u3: renderU3, u3p: renderU3P, u4: renderU4, u5: renderU5, u6: renderU6, b1: renderB1, b2: renderB2, b3: renderB3, b4: renderB4, b5: renderB5, b6: renderB6, w1: renderW1, w2: renderW2, w3: renderW3, w4: renderW4, w5: renderW5, w6: renderW6, w7: renderW7, c1: renderC1, c2: renderC2, c3: renderC3, c4: renderC4, c5: renderC5, c6: renderC6 };

function render({ focus = false } = {}) {
  const unit = content.units.find((item) => item.id === state.currentUnit) || content.units[0];
  if (state.currentUnit !== unit.id) state.currentUnit = unit.id;
  renderProgress();
  renderers[unit.id](unit);
  bindNavigation();
  if (focus) requestAnimationFrame(() => document.querySelector("#unit-title")?.focus({ preventScroll: true }));
}

resetButton.addEventListener("click", () => {
  if (!window.confirm("Reset all saved Task 2 progress and writing on this device?")) return;
  state = clearTask2State();
  history.replaceState({ unit: "u1" }, "", "#u1");
  render({ focus: true });
});

window.addEventListener("popstate", () => {
  const requested = window.location.hash.slice(1);
  if (requested && canVisit(unitIndex(requested))) state.currentUnit = requested;
  render({ focus: true });
});

const requested = window.location.hash.slice(1);
if (requested && canVisit(unitIndex(requested))) state.currentUnit = requested;
render();
