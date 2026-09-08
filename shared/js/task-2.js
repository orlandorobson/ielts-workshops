import { task2Content as content } from "../../content/writing/task-2.js?v=workshop-1";
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

const completionPolicy = Object.freeze({
  afterCheck: "after-check",
  afterSave: "after-save",
  afterAttempt: "after-attempt",
  onArrival: "on-arrival",
  optional: "optional",
});

function recordCompletion(id, policy, patch = {}) {
  state.units[id] = { ...getUnitState(id), ...patch, engaged: true, completionPolicy: policy };
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
    <p class="question-label">${transfer ? "New Writing Task 2 question" : "Writing Task 2 question"}</p>
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
  const nextLabels = ["Need help?", "More help", "Show explanation", "Show example"];
  const headings = ["", "Need help?", "More help", "Explanation", "Example"];
  return `<section class="support-panel" aria-label="Progressive help">
    <div class="support-actions">
      ${level < help.length ? `<button class="secondary-button" type="button" data-help-next>${nextLabels[level]}</button>` : ""}
    </div>
    ${level ? `<div class="support-content"><h3>${headings[level]}</h3><p>${escapeHTML(help[level - 1])}</p></div>` : ""}
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

function openingQuestionMarkup(source) {
  return `<section class="question-panel opening-question" aria-label="Writing Task 2 question"><p class="question-label">Writing Task 2 question</p><p>${source.statement}</p><blockquote><p>${source.instruction}</p></blockquote></section>`;
}

function lexicalBankMarkup(id, terms) {
  return `<details class="lexical-bank" id="${id}-lexical"><summary>Lexical Bank</summary><p>Need help with words in the question?</p><dl>${terms.map((term) => `<div><dt>${term.word}</dt><dd><span>${term.meaning}</span><span lang="ar" dir="rtl">${term.arabic}</span></dd></div>`).join("")}</dl></details>`;
}

function renderU1(unit) {
  const id = "u1";
  const source = content.opening.problems;
  const saved = getUnitState(id);
  const answers = saved.answers || {};
  const ready = answers.causes && answers.solutions;
  const jobOptions = (key) => orderedOptions(`u1-${key}-jobs`, source.jobs, true);
  const select = (key, label) => `<label class="matching-row" for="u1-${key}"><strong>${label}</strong><select id="u1-${key}" name="${key}"><option value="">Choose “I have to…”</option>${jobOptions(key).map((job) => `<option value="${job.id}" ${answers[key] === job.id ? "selected" : ""}>${job.text}</option>`).join("")}</select>${saved.checked ? `<span>${answers[key] === source.matches[key] ? "Yes. " : "Look again. "}${source.jobs.find((job) => job.id === source.matches[key]).text}</span>` : ""}</label>`;
  app.innerHTML = `<article>${unitHeader(unit, content.opening.introduction)}${openingQuestionMarkup(source)}<section class="interaction-pane"><p class="prompt">Look at the words in bold. What do you have to talk about?</p><form id="u1-form" class="matching-list">${select("causes", "causes")}${select("solutions", "solutions")}<button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check my answers</button></form>${saved.checked ? feedbackMarkup("The question asks for two things: why the problem happens and ways to solve it.") : ""}${helpMarkup(id, ["Look at the first bold word: causes.", "Causes means why something happens. Which ‘I have to…’ sentence has the same meaning?", "Match causes with why the problem happens. Match solutions with ways to solve the problem.", "New example: If a question asks for reasons and solutions, explain why the problem happens and how it could be solved."])}${lexicalBankMarkup(id, source.lexical)}</section>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#u1-form");
  form.addEventListener("change", () => {
    const data = new FormData(form);
    const next = { causes: data.get("causes"), solutions: data.get("solutions") };
    setUnitState(id, { answers: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !(next.causes && next.solutions);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const next = { causes: data.get("causes"), solutions: data.get("solutions") };
    recordCompletion(id, completionPolicy.afterCheck, { answers: next, checked: true, diagnosticResult: { preferred: Object.keys(source.matches).filter((key) => next[key] === source.matches[key]).length, total: 2 } });
    render();
  });
  bindHelp(id);
}

function renderU2(unit) {
  const id = "u2";
  const source = content.opening.agree;
  const saved = getUnitState(id);
  const job = saved.job;
  const change = saved.change;
  const ready = job && change;
  app.innerHTML = `<article>${unitHeader(unit, "This question asks what you think. Your answer needs to stay clear from the beginning to the end.")}${openingQuestionMarkup(source)}<form id="u2-form" class="judgement-list"><fieldset class="judgement-row"><legend>What do you have to do?</legend><div class="choice-list">${orderedOptions("u2-jobs", source.jobs, true).map((option) => choiceMarkup({ option, name: "u2-job", checked: job === option.id })).join("")}</div></fieldset><fieldset class="judgement-row"><legend>I say I agree in my introduction, but later my essay says I disagree. What could happen?</legend><div class="choice-list">${orderedOptions("u2-change", source.consistency, true).map((option) => choiceMarkup({ option, name: "u2-change", checked: change === option.id })).join("")}</div></fieldset><button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check my answers</button></form>${saved.checked ? feedbackMarkup(`${job === "degree" ? "Yes. The question asks how much you agree or disagree." : "This question asks how much you agree or disagree."} ${change === "unclear" ? "Yes. Changing your answer without explaining it makes the essay unclear." : "If your answer changes without an explanation, the reader may not know what you think."}`) : ""}${helpMarkup(id, ["Look at the bold words in the question.", "‘To what extent’ asks how much you agree or disagree. Then compare ‘I agree’ with ‘I disagree’. Are they the same answer?", "Say how much you agree or disagree, and keep that answer clear through the essay."])}${lexicalBankMarkup(id, source.lexical)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#u2-form");
  form.addEventListener("change", () => {
    const data = new FormData(form);
    setUnitState(id, { job: data.get("u2-job"), change: data.get("u2-change"), checked: false });
    form.querySelector('button[type="submit"]').disabled = !(data.get("u2-job") && data.get("u2-change"));
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const next = { job: data.get("u2-job"), change: data.get("u2-change") };
    recordCompletion(id, completionPolicy.afterCheck, { ...next, checked: true, diagnosticResult: { preferred: Number(next.job === "degree") + Number(next.change === "unclear"), total: 2 } });
    render();
  });
  bindHelp(id);
}

function renderU3(unit) {
  const id = "u3";
  const source = content.opening.views;
  const saved = getUnitState(id);
  const selected = saved.choice;
  app.innerHTML = `<article>${unitHeader(unit, "Some questions ask you to explain two views and give your own opinion. You need to do all three things.")}${openingQuestionMarkup(source)}<section class="model-panel"><h2>One writer's answer</h2><p>${source.example}</p></section><fieldset><legend class="prompt">What happened?</legend><div class="choice-list">${orderedOptions("u3-outcomes", source.outcomes, true).map((option) => choiceMarkup({ option, name: id, checked: selected === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${selected ? "" : "disabled"}>Check my answer</button>${saved.checked ? feedbackMarkup(selected === "all" ? "Yes. The writer explained both views and clearly gave their opinion." : "The writer explained both views and clearly gave their opinion. They did all the jobs in the question.") : ""}${helpMarkup(id, ["Count the things the question asks for.", "The question asks for the first view, the second view and the writer's opinion. Can you find all three in the example?", "All three are present, so the writer did all the jobs in the question."])}${lexicalBankMarkup(id, source.lexical)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { choice: input.value, checked: false });
    render();
  }));
  document.querySelector("[data-check]")?.addEventListener("click", () => {
    const choice = document.querySelector(`input[name="${id}"]:checked`)?.value;
    if (!choice) return;
    recordCompletion(id, completionPolicy.afterCheck, { choice, checked: true, diagnosticResult: { preferred: choice === "all" } });
    render();
  });
  bindHelp(id);
}

function renderU3P(unit) {
  const id = "u3p";
  const source = content.opening.advantages;
  const saved = getUnitState(id);
  const selected = saved.choice;
  app.innerHTML = `<article>${unitHeader(unit, "This question asks for two sides of one situation.")}${openingQuestionMarkup(source)}<fieldset><legend class="prompt">What do you have to talk about?</legend><div class="choice-list">${orderedOptions("u3p-jobs", source.jobs, true).map((option) => choiceMarkup({ option, name: id, checked: selected === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${selected ? "" : "disabled"}>Check my answer</button>${saved.checked ? feedbackMarkup(selected === "sides" ? "Yes. Talk about the good and bad sides of working from home." : "The question asks for the good and bad sides of working from home.") : ""}${helpMarkup(id, ["Look at the two bold words.", "An advantage is a good side. A disadvantage is a bad or difficult side.", "Write about both sides. This question does not ask whether everyone should work from home."])}${lexicalBankMarkup(id, source.lexical)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => { setUnitState(id, { choice: input.value, checked: false }); render(); }));
  document.querySelector("[data-check]")?.addEventListener("click", () => {
    const choice = document.querySelector(`input[name="${id}"]:checked`)?.value;
    if (!choice) return;
    recordCompletion(id, completionPolicy.afterCheck, { choice, checked: true, diagnosticResult: { preferred: choice === "sides" } });
    render();
  });
  bindHelp(id);
}

function renderU4(unit) {
  const id = "u4";
  const source = content.opening.twoQuestions;
  const saved = getUnitState(id);
  const selected = saved.selected || [];
  app.innerHTML = `<article>${unitHeader(unit, "Sometimes the question asks two separate questions. Answer both.")}${openingQuestionMarkup(source)}<fieldset><legend class="prompt">Choose the two things you have to do.</legend><div class="choice-list">${orderedOptions("u4-jobs", source.jobs, true).map((option) => choiceMarkup({ option, name: id, type: "checkbox", checked: selected.includes(option.id) })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${selected.length === 2 ? "" : "disabled"}>Check my answers</button>${saved.checked ? feedbackMarkup(source.required.every((job) => selected.includes(job)) ? "Yes. Explain why people are having children later, then say whether the change is positive or negative." : "There are two questions. Explain why people are having children later, and say whether the change is positive or negative.") : ""}${helpMarkup(id, ["Find the two question marks.", "The first question asks why. The second asks if the change is positive or negative.", "Answer 1: explain why it is happening. Answer 2: say whether the change is positive or negative."])}${lexicalBankMarkup(id, source.lexical)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => {
    const value = input.value;
    const next = input.checked ? [...selected, value] : selected.filter((item) => item !== value);
    setUnitState(id, { selected: [...new Set(next)], checked: false });
    render();
  }));
  document.querySelector("[data-check]")?.addEventListener("click", () => {
    if (selected.length !== 2) return;
    recordCompletion(id, completionPolicy.afterCheck, { selected, checked: true, diagnosticResult: { preferred: source.required.every((job) => selected.includes(job)) } });
    render();
  });
  bindHelp(id);
}

function renderU5(unit) {
  const id = "u5";
  recordCompletion(id, completionPolicy.onArrival);
  app.innerHTML = `<article>${unitHeader(unit, "You have now seen answers that do every part, miss a part, stay clear or become unclear.")}<section class="model-panel"><h2>IELTS calls this Task Response</h2><p>It is about how well you answer the task you were given.</p></section><blockquote class="principle-panel"><p>The first thing we do in Task 2 is understand what the question wants us to do.</p><p>A good place to look is the second sentence of the question. It usually tells you what you have to do.</p><p><strong>Before you start writing, ask: What do I have to talk about?</strong></p></blockquote>${navigationMarkup({ canContinue: true })}</article>`;
}

function renderCollect(id, unit, { introduction, items, closing }) {
  const saved = getUnitState(id);
  const activeId = saved.activeId || items[0].id;
  const viewed = [...new Set([...(saved.viewed || []), activeId])];
  const active = items.find((item) => item.id === activeId);
  if (!saved.activeId || viewed.length !== (saved.viewed || []).length) setUnitState(id, { activeId, viewed });
  completeUnit(id);
  app.innerHTML = `<article>${unitHeader(unit, introduction)}<p class="choice-note consolidation-note">These three questions are your summary. Continue when you are ready, or choose one to look closer.</p><div class="framework-strip" role="group" aria-label="Three checking questions">${items.map((item) => `<section><button class="editorial-button" type="button" data-collect="${item.id}" aria-pressed="${item.id === activeId}" aria-expanded="${item.id === activeId}" aria-controls="${id}-principle-detail"><strong>${item.label}<small class="control-hint">Look closer <span aria-hidden="true">›</span></small></strong><span>${item.short}</span></button></section>`).join("")}</div><section class="insight-panel" id="${id}-principle-detail" aria-live="polite"><h2>${active.label}</h2><p>${active.detail}</p></section><p class="choice-note consolidation-note">Optional: ${viewed.length} of ${items.length} explanations opened.</p><blockquote class="principle-panel"><p>${closing}</p></blockquote>${navigationMarkup({ canContinue: true })}</article>`;
  document.querySelectorAll("[data-collect]").forEach((button) => button.addEventListener("click", () => {
    setUnitState(id, { activeId: button.dataset.collect, viewed: [...new Set([...viewed, button.dataset.collect])] });
    render();
  }));
}

function renderU6(unit) {
  const id = "u6";
  recordCompletion(id, completionPolicy.onArrival);
  app.innerHTML = `<article>${unitHeader(unit, "In this workshop, we are going to use four clear parts.")}<section class="essay-map" aria-label="Four parts of the essay"><section><strong>Introduction</strong><p>Give the reader some context. If the question asks what you think, make your answer clear.</p></section><section><strong>Main paragraph 1</strong><p>Give one main idea and explain it.</p></section><section><strong>Main paragraph 2</strong><p>Give another main idea and explain it.</p></section><section><strong>Conclusion</strong><p>Remind the reader of your main answer. Do not add a new main idea.</p></section></section><div class="framework-strip" aria-label="What the four parts do"><section><strong>Introduction</strong><span>Shows where we are going.</span></section><section><strong>Main paragraphs</strong><span>Do the main work.</span></section><section><strong>Conclusion</strong><span>Finishes the answer.</span></section></div><p class="choice-note">Two main paragraphs are a useful starting point because they keep your ideas organised, clear and easy to read.</p>${navigationMarkup({ canContinue: true })}</article>`;
}

function renderQuestionChoice(id, unit, { source, introduction, options, answer, prompt = "What do I have to talk about?", help = [] }) {
  const saved = getUnitState(id);
  const selected = saved.choice;
  const chosen = options.find((option) => option.id === selected);
  app.innerHTML = `<article>${unitHeader(unit, introduction)}${openingQuestionMarkup(source)}<fieldset><legend class="prompt">${prompt}</legend><div class="choice-list">${orderedOptions(`${id}-options`, options, true).map((option) => choiceMarkup({ option, name: id, checked: selected === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${selected ? "" : "disabled"}>Check my answer</button>${saved.checked && chosen ? feedbackMarkup(chosen.id === answer.id ? `Yes. ${answer.feedback}` : answer.feedback, chosen.id === answer.id ? "success" : "reconsider") : ""}${helpMarkup(id, help)}${lexicalBankMarkup(id, source.lexical)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { choice: input.value, checked: false });
    render();
  }));
  document.querySelector("[data-check]")?.addEventListener("click", () => {
    const choice = document.querySelector(`input[name="${id}"]:checked`)?.value;
    if (!choice) return;
    recordCompletion(id, completionPolicy.afterCheck, { choice, checked: true, diagnosticResult: { preferred: choice === answer.id } });
    render();
  });
  bindHelp(id);
}

function renderQ3(unit) {
  const source = content.opening.views;
  renderQuestionChoice("q3", unit, {
    source,
    introduction: "This question asks you to explain two views and give your own opinion. You need to do all three things.",
    options: [
      { id: "all", text: "Explain why quiet spaces are useful, explain why sports facilities are useful, and give my opinion." },
      { id: "one", text: "Choose one view and ignore the other one." },
      { id: "cost", text: "Explain how much public parks cost." },
    ],
    answer: { id: "all", feedback: "Explain both views and make your own opinion clear." },
    help: ["Count the jobs in the instruction.", "You need to discuss the first view, discuss the second view and give your opinion.", "Do all three jobs: quiet spaces, sports facilities and your own opinion."],
  });
}

function renderQ4(unit) {
  const source = content.opening.advantages;
  renderQuestionChoice("q4", unit, {
    source,
    introduction: "This question asks for two sides of one situation.",
    options: source.jobs,
    answer: { id: "sides", feedback: "Talk about the good and bad sides of working from home. The question does not ask whether everyone should do it." },
    help: ["Look at the two bold words.", "An advantage is a good side. A disadvantage is a bad or difficult side.", "Write about both sides."],
  });
}

function renderQ5(unit) {
  const id = "q5";
  const source = content.opening.twoQuestions;
  const saved = getUnitState(id);
  const selected = saved.selected || [];
  const preferred = source.required.every((job) => selected.includes(job));
  app.innerHTML = `<article>${unitHeader(unit, "Sometimes the question asks two separate questions. Answer both.")}${openingQuestionMarkup(source)}<fieldset><legend class="prompt">Choose the two things you have to do.</legend><div class="choice-list">${orderedOptions("q5-options", source.jobs, true).map((option) => choiceMarkup({ option, name: id, type: "checkbox", checked: selected.includes(option.id) })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${selected.length === 2 ? "" : "disabled"}>Check my answers</button>${saved.checked ? feedbackMarkup(preferred ? "Yes. Explain why people are having children later, then say whether the change is positive or negative." : "There are two questions: explain why people are having children later, and say whether the change is positive or negative.", preferred ? "success" : "reconsider") : ""}${helpMarkup(id, ["Find the two question marks.", "The first asks why. The second asks if the change is positive or negative.", "Answer both questions."])}${lexicalBankMarkup(id, source.lexical)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => {
    const next = input.checked ? [...selected, input.value] : selected.filter((item) => item !== input.value);
    setUnitState(id, { selected: [...new Set(next)], checked: false });
    render();
  }));
  document.querySelector("[data-check]")?.addEventListener("click", () => {
    if (selected.length !== 2) return;
    recordCompletion(id, completionPolicy.afterCheck, { selected, checked: true, diagnosticResult: { preferred } });
    render();
  });
  bindHelp(id);
}

function planCardsMarkup(plan, name) {
  return `<section class="student-plan" aria-label="${name}'s four-part essay plan">${plan.map((part) => `<section><h2>${part.title}</h2>${part.lines.map((line) => `<p>${escapeHTML(line)}</p>`).join("")}</section>`).join("")}</section>`;
}

function renderN1(unit) {
  recordCompletion("n1", completionPolicy.onArrival);
  app.innerHTML = `<article>${unitHeader(unit, "You have now met five common question situations and found the writing job in each one.")}<section class="model-panel"><h2>IELTS calls this Task Response</h2><p>It is about how well you answer the task you were given.</p></section><blockquote class="principle-panel"><p><strong>Before you start writing, ask: What do I have to talk about?</strong></p></blockquote>${navigationMarkup({ canContinue: true })}</article>`;
}

function renderS1(unit) {
  recordCompletion("s1", completionPolicy.onArrival);
  app.innerHTML = `<article>${unitHeader(unit, "Now we know what the question wants. What are we going to write?")}<p>In this workshop, we will use four clear parts. This is a dependable starting point, not the only possible essay structure.</p><section class="essay-map" aria-label="The four parts we will use"><section><strong>Introduction</strong></section><section><strong>Main paragraph 1</strong></section><section><strong>Main paragraph 2</strong></section><section><strong>Conclusion</strong></section></section><blockquote class="principle-panel"><p>Let's look at how some students planned their essays.</p></blockquote>${navigationMarkup({ canContinue: true })}</article>`;
}

function renderP1(unit) {
  const id = "p1";
  const source = content.workshop1.shaima;
  const saved = getUnitState(id);
  const selected = source.reactions.find((reaction) => reaction.id === saved.choice);
  app.innerHTML = `<article>${unitHeader(unit, "Shaima read the question and made a four-part plan before writing.")}${questionMarkup(source.question)}${planCardsMarkup(source.plan, "Shaima")}<fieldset><legend class="prompt">What do you think about Shaima's example from Taqah?</legend><div class="choice-list">${orderedOptions("p1-reactions", source.reactions, true).map((option) => choiceMarkup({ option, name: id, checked: saved.choice === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${saved.choice ? "" : "disabled"}>Keep my response</button>${saved.checked && selected ? feedbackMarkup(selected.feedback) : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => { setUnitState(id, { choice: input.value, checked: false }); render(); }));
  document.querySelector("[data-check]")?.addEventListener("click", () => {
    const choice = document.querySelector(`input[name="${id}"]:checked`)?.value;
    if (!choice) return;
    recordCompletion(id, completionPolicy.afterCheck, { choice, checked: true });
    render();
  });
}

function optionalPlanMarkup(name, source, saved) {
  const selected = source.reactions.find((reaction) => reaction.id === saved.reaction);
  return `<section class="optional-plan" aria-live="polite"><h2>${name}'s plan</h2>${questionMarkup(source.question)}${planCardsMarkup(source.plan, name)}<fieldset><legend>What do you notice?</legend><div class="choice-list">${orderedOptions(`p2-${name.toLowerCase()}-reactions`, source.reactions, true).map((option) => choiceMarkup({ option, name: `p2-${name.toLowerCase()}`, checked: saved.reaction === option.id })).join("")}</div></fieldset>${selected ? feedbackMarkup(selected.feedback) : ""}</section>`;
}

function renderP2(unit) {
  const id = "p2";
  const saved = getUnitState(id);
  const active = saved.activePlan;
  const source = active ? content.workshop1[active] : null;
  const name = active === "yusuf" ? "Yusuf" : "Mustafa";
  app.innerHTML = `<article>${unitHeader(unit, "Shaima's plan is enough for the core lesson. You can explore another student's plan or go directly to introductions.")}<div class="route-choice"><button class="secondary-button" type="button" data-plan="yusuf">See another student's plan</button><button class="primary-button" type="button" data-go-introductions>Go on to introductions <span aria-hidden="true">→</span></button></div>${source ? `<div class="plan-tabs" role="group" aria-label="Optional student plans"><button type="button" data-plan="yusuf" aria-pressed="${active === "yusuf"}">Yusuf</button><button type="button" data-plan="mustafa" aria-pressed="${active === "mustafa"}">Mustafa</button></div>${optionalPlanMarkup(name, source, saved)}` : ""}<nav class="unit-navigation" aria-label="Learning-unit navigation"><button class="secondary-button" type="button" data-nav="p1">Back</button><span></span></nav></article>`;
  document.querySelectorAll("[data-plan]").forEach((button) => button.addEventListener("click", () => { setUnitState(id, { activePlan: button.dataset.plan, reaction: "" }); render(); }));
  if (active) document.querySelectorAll(`input[name="p2-${active}"]`).forEach((input) => input.addEventListener("change", () => { setUnitState(id, { reaction: input.value }); render(); }));
  document.querySelector("[data-go-introductions]").addEventListener("click", () => {
    recordCompletion(id, completionPolicy.optional, { optionalPlansViewed: [...new Set([...(saved.optionalPlansViewed || []), ...(active ? [active] : [])])] });
    navigateTo("i1");
  });
}

function introductionCardsMarkup() {
  const introductions = content.workshop1.introductions;
  return `<div class="introduction-cards"><section><h2>Shaima</h2><p>${introductions.shaima}</p></section><section><h2>Yusuf</h2><p>${introductions.yusuf}</p></section><section><h2>Mustafa</h2><p>${introductions.mustafa}</p></section></div>`;
}

function renderI1(unit) {
  const id = "i1";
  const saved = getUnitState(id);
  const options = [
    { id: "shaima", text: "Shaima" },
    { id: "yusuf", text: "Yusuf" },
    { id: "mustafa", text: "Mustafa" },
  ];
  app.innerHTML = `<article>${unitHeader(unit, "You've seen what they planned. Now look at how they started their essays.")}${introductionCardsMarkup()}<fieldset><legend class="prompt">Who says that sports facilities can make exercise accessible to more people?</legend><div class="inline-choices">${orderedOptions("i1-writers", options, true).map((option) => compactChoice({ value: option.id, label: option.text, name: id, checked: saved.choice === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${saved.choice ? "" : "disabled"}>Check my answer</button>${saved.checked ? feedbackMarkup(saved.choice === "yusuf" ? "Yes. Yusuf gives that reason in his introduction." : "Look at Yusuf's final words. He says sports facilities can make exercise accessible to more people.", saved.choice === "yusuf" ? "success" : "reconsider") : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => { setUnitState(id, { choice: input.value, checked: false }); render(); }));
  document.querySelector("[data-check]")?.addEventListener("click", () => { recordCompletion(id, completionPolicy.afterCheck, { choice: document.querySelector(`input[name="${id}"]:checked`)?.value, checked: true }); render(); });
}

function renderI2(unit) {
  const id = "i2";
  const saved = getUnitState(id);
  const options = [
    { id: "not-asked", text: "His question asks for causes and solutions, not whether he agrees." },
    { id: "forgot", text: "He forgot to give his opinion." },
    { id: "never", text: "Task 2 introductions should never say ‘I agree’." },
  ];
  app.innerHTML = `<article>${unitHeader(unit, "Read Mustafa's question and introduction together.")}${openingQuestionMarkup(content.opening.problems)}<section class="writing-sample"><h2>Mustafa's introduction</h2><p>${content.workshop1.introductions.mustafa}</p></section><fieldset><legend class="prompt">Mustafa didn't say ‘I agree.’ Why not?</legend><div class="choice-list">${orderedOptions("i2-reasons", options, true).map((option) => choiceMarkup({ option, name: id, checked: saved.choice === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${saved.choice ? "" : "disabled"}>Check my answer</button>${saved.checked ? feedbackMarkup(saved.choice === "not-asked" ? "Yes. Mustafa answers the question he was given: causes and solutions." : "His question asks for causes and solutions. It does not ask whether he agrees or disagrees.", saved.choice === "not-asked" ? "success" : "reconsider") : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => { setUnitState(id, { choice: input.value, checked: false }); render(); }));
  document.querySelector("[data-check]")?.addEventListener("click", () => { recordCompletion(id, completionPolicy.afterCheck, { choice: document.querySelector(`input[name="${id}"]:checked`)?.value, checked: true }); render(); });
}

function supportChoiceMarkup(id, source, saved, draft) {
  if (!saved.support) return "";
  if (saved.support === "most") return `<fieldset><legend>Choose one possible introduction.</legend><div class="choice-list">${orderedOptions(`${id}-choices`, source.choices, true).map((option) => choiceMarkup({ option, name: `${id}-choice`, checked: saved.choice === option.id })).join("")}</div></fieldset>`;
  return `${saved.support === "some" ? `<div class="word-bank" aria-label="Useful words and phrases">${source.words.map((word) => `<span>${word}</span>`).join("")}</div>` : ""}<label class="writing-label" for="${id}-draft">Write the introduction.</label><textarea class="writing-area introduction-area" id="${id}-draft">${escapeHTML(draft)}</textarea>`;
}

function bindSupportedWriting(id, source, draftName) {
  document.querySelectorAll("[data-support]").forEach((button) => button.addEventListener("click", () => { setUnitState(id, { support: button.dataset.support }); render(); }));
  document.querySelectorAll(`input[name="${id}-choice"]`).forEach((input) => input.addEventListener("change", () => {
    const selected = source.choices.find((choice) => choice.id === input.value);
    saveDraft(draftName, selected?.text || "");
    setUnitState(id, { choice: input.value });
    render();
  }));
  const textarea = document.querySelector(`#${id}-draft`);
  textarea?.addEventListener("input", () => {
    saveDraft(draftName, textarea.value);
    document.querySelector("[data-save]").disabled = !textarea.value.trim();
  });
}

function renderF1(unit) {
  const id = "f1";
  const source = content.workshop1.fatma;
  const saved = getUnitState(id);
  const draft = state.drafts.fatmaIntroduction;
  app.innerHTML = `<article>${unitHeader(unit, "Fatma is ready to write her introduction. Can you help her?")}${questionMarkup(source.question)}<section class="workspace-note"><h2>Fatma's plan</h2>${source.plan.map((line) => `<p>${line}</p>`).join("")}</section><p class="prompt">Choose the support you want.</p><div class="support-choices" role="group" aria-label="Choose writing support"><button type="button" data-support="most" aria-pressed="${saved.support === "most"}">Most help</button><button type="button" data-support="some" aria-pressed="${saved.support === "some"}">Some help</button><button type="button" data-support="independent" aria-pressed="${saved.support === "independent"}">Independent</button></div>${supportChoiceMarkup(id, source, saved, draft)}${saved.support ? `<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>Keep this introduction</button>` : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  bindSupportedWriting(id, source, "fatmaIntroduction");
  document.querySelector("[data-save]")?.addEventListener("click", () => { if (!state.drafts.fatmaIntroduction.trim()) return; recordCompletion(id, completionPolicy.afterAttempt, { attempted: true }); render(); });
}

function renderF2(unit) {
  recordCompletion("f2", completionPolicy.onArrival);
  app.innerHTML = `<article>${unitHeader(unit, "Compare the two introductions. Fatma's version is one possibility, not the only correct answer.")}<div class="before-after"><section class="version-panel"><h2>Your version</h2><div class="essay-copy">${escapeHTML(state.drafts.fatmaIntroduction)}</div></section><section class="version-panel"><h2>Fatma's version</h2><div class="essay-copy">${content.workshop1.fatma.model}</div></section></div><p class="choice-note">Both introductions should help the reader understand the topic and the direction of the essay.</p>${navigationMarkup({ canContinue: true })}</article>`;
}

function renderO1(unit) {
  const id = "o1";
  const source = content.workshop1.own;
  const saved = getUnitState(id);
  const selected = saved.selected || [];
  const preferred = source.required.every((job) => selected.includes(job));
  app.innerHTML = `<article>${unitHeader(unit, "Read this new question before you plan or write.")}${questionMarkup(source.question)}<fieldset><legend class="prompt">What do you have to talk about? Choose two.</legend><div class="choice-list">${orderedOptions("o1-jobs", source.jobs, true).map((option) => choiceMarkup({ option, name: id, type: "checkbox", checked: selected.includes(option.id) })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${selected.length === 2 ? "" : "disabled"}>Check my answers</button>${saved.checked ? feedbackMarkup(preferred ? "Yes. Explain why adults choose online courses and say whether this change is positive or negative." : "The two question marks give you the two jobs: explain why, then make a positive-or-negative judgement.", preferred ? "success" : "reconsider") : ""}${lexicalBankMarkup(id, source.lexical)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => { const next = input.checked ? [...selected, input.value] : selected.filter((item) => item !== input.value); setUnitState(id, { selected: [...new Set(next)], checked: false }); render(); }));
  document.querySelector("[data-check]")?.addEventListener("click", () => { if (selected.length !== 2) return; recordCompletion(id, completionPolicy.afterCheck, { selected, checked: true, diagnosticResult: { preferred } }); render(); });
}

function renderO2(unit) {
  const id = "o2";
  const plan = state.drafts.workshop1Plan;
  const ready = plan.position.trim() && plan.body1.trim() && plan.body2.trim();
  app.innerHTML = `<article>${unitHeader(unit, "Make three short notes. They will stay beside you when you write.")}${questionMarkup(content.workshop1.own.question)}<form id="o2-form" class="small-plan"><label><strong>My answer / position</strong><textarea name="position" rows="3">${escapeHTML(plan.position)}</textarea></label><label><strong>Paragraph 1</strong><textarea name="body1" rows="3">${escapeHTML(plan.body1)}</textarea></label><label><strong>Paragraph 2</strong><textarea name="body2" rows="3">${escapeHTML(plan.body2)}</textarea></label><button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Keep my plan</button></form>${getUnitState(id).saved ? feedbackMarkup("Your plan is saved. Use it to keep the introduction focused.") : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#o2-form");
  form.addEventListener("input", () => { const next = Object.fromEntries(new FormData(form).entries()); savePlan("workshop1Plan", next); form.querySelector('button[type="submit"]').disabled = !(next.position.trim() && next.body1.trim() && next.body2.trim()); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const next = Object.fromEntries(new FormData(form).entries()); savePlan("workshop1Plan", next); recordCompletion(id, completionPolicy.afterSave, { saved: true }); render(); });
}

function renderO3(unit) {
  const id = "o3";
  const draft = state.drafts.workshop1Introduction;
  const plan = state.drafts.workshop1Plan;
  app.innerHTML = `<article>${unitHeader(unit, "Use your answer and two paragraph ideas to show the reader where your essay is going.")}<div class="activity-layout writing-layout"><aside>${questionMarkup(content.workshop1.own.question)}<section class="workspace-note"><h2>Your plan</h2><p><strong>My answer:</strong> ${escapeHTML(plan.position)}</p><p><strong>Paragraph 1:</strong> ${escapeHTML(plan.body1)}</p><p><strong>Paragraph 2:</strong> ${escapeHTML(plan.body2)}</p></section></aside><section class="writing-pane"><label for="o3-draft">Write your introduction.</label><textarea class="writing-area introduction-area" id="o3-draft">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span></div>${helpMarkup(id, ["Start by helping the reader recognise the topic.", "Then make your answer to the question clear.", "Use your two paragraph notes to show the direction of the essay without explaining every detail.", "One possible pattern: introduce the situation, give your answer, then name the two ideas your essay will explain."])}${aiMarkup(id)}<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>Keep my introduction</button></section></div>${getUnitState(id).attempted ? feedbackMarkup("Your introduction is saved. You can revise it, or continue to finish Workshop 1.") : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const textarea = document.querySelector("#o3-draft");
  textarea.addEventListener("input", () => { saveDraft("workshop1Introduction", textarea.value); document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`; document.querySelector("[data-save]").disabled = !textarea.value.trim(); });
  document.querySelector("[data-save]").addEventListener("click", () => { if (!textarea.value.trim()) return; saveDraft("workshop1Introduction", textarea.value); recordCompletion(id, completionPolicy.afterAttempt, { attempted: true }); render(); });
  bindHelp(id);
  bindAI({ id, textarea, question: content.workshop1.own.question, analysis: `The question asks for reasons why adults choose online study and a judgement about whether this is a positive or negative development. Learner's plan: ${JSON.stringify(plan)}`, feedback: content.ai.introduction });
}

function getPracticeSession(saved = getUnitState("end")) {
  return (state.drafts.practiceSessions || []).find((session) => session.id === saved.activePracticeId);
}

function savePracticeSession(id, patch) {
  state.drafts.practiceSessions = (state.drafts.practiceSessions || []).map((session) => session.id === id ? { ...session, ...patch } : session);
  saveTask2State(state);
}

function startPractice() {
  const sessions = state.drafts.practiceSessions || [];
  const previousQuestion = sessions[sessions.length - 1]?.questionId;
  const available = content.workshop1.practiceQuestions.filter((question) => question.id !== previousQuestion);
  const questionId = shuffleOptionIds(available.map((question) => question.id))[0];
  const session = {
    id: `practice-${sessions.length + 1}`,
    questionId,
    phase: "understand",
    jobChoice: "",
    jobChecked: false,
    plan: { introduction: "", body1: "", body1Notes: "", body2: "", body2Notes: "", conclusion: "" },
    introduction: "",
    complete: false,
  };
  state.drafts.practiceSessions = [...sessions, session];
  state.units.end = { ...getUnitState("end"), activePracticeId: session.id, finished: false };
  saveTask2State(state);
  render();
}

function practicePlanReady(plan) {
  return [plan.introduction, plan.body1, plan.body2, plan.conclusion].every((value) => value.trim());
}

function practiceMarkup(session, question) {
  if (session.phase === "understand") {
    const selected = question.jobs.find((job) => job.id === session.jobChoice);
    return `<section class="independent-practice"><p class="eyebrow">Independent practice · Step 1 of 3</p><h2>What do I have to do?</h2>${questionMarkup(question.question, { transfer: true })}<fieldset><legend class="prompt">What does this question ask you to talk about?</legend><div class="choice-list">${orderedOptions(`${session.id}-jobs`, question.jobs, true).map((option) => choiceMarkup({ option, name: `${session.id}-job`, checked: session.jobChoice === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-practice-check ${session.jobChoice ? "" : "disabled"}>Check my answer</button>${session.jobChecked && selected ? feedbackMarkup(selected.id === question.answer ? `Yes. ${question.feedback}` : question.feedback, selected.id === question.answer ? "success" : "reconsider") : ""}${session.jobChecked ? `<button class="secondary-button" type="button" data-practice-next="plan">Make my plan</button>` : ""}</section>`;
  }
  if (session.phase === "plan") {
    const plan = session.plan;
    return `<section class="independent-practice"><p class="eyebrow">Independent practice · Step 2 of 3</p><h2>Make my plan</h2>${questionMarkup(question.question, { transfer: true })}<form id="practice-plan" class="practice-plan"><label class="full-width"><strong>Introduction</strong><span>What will your introduction make clear?</span><textarea name="introduction" rows="3">${escapeHTML(plan.introduction)}</textarea></label><fieldset><legend>Main paragraph 1</legend><label><strong>Main idea</strong><textarea name="body1" rows="3">${escapeHTML(plan.body1)}</textarea></label><label><strong>Optional notes, example or explanation</strong><textarea name="body1Notes" rows="3">${escapeHTML(plan.body1Notes)}</textarea></label></fieldset><fieldset><legend>Main paragraph 2</legend><label><strong>Main idea</strong><textarea name="body2" rows="3">${escapeHTML(plan.body2)}</textarea></label><label><strong>Optional notes, example or explanation</strong><textarea name="body2Notes" rows="3">${escapeHTML(plan.body2Notes)}</textarea></label></fieldset><label class="full-width"><strong>Conclusion</strong><span>How will you finish the answer?</span><textarea name="conclusion" rows="3">${escapeHTML(plan.conclusion)}</textarea></label><button class="primary-button full-width" type="submit" ${practicePlanReady(plan) ? "" : "disabled"}>Keep my plan</button></form></section>`;
  }
  return `<section class="independent-practice"><p class="eyebrow">Independent practice · Step 3 of 3</p><h2>Write my introduction</h2><div class="activity-layout writing-layout"><aside>${questionMarkup(question.question, { transfer: true })}<section class="workspace-note"><h3>My plan</h3><p><strong>Introduction:</strong> ${escapeHTML(session.plan.introduction)}</p><p><strong>Main paragraph 1:</strong> ${escapeHTML(session.plan.body1)}</p><p><strong>Main paragraph 2:</strong> ${escapeHTML(session.plan.body2)}</p><p><strong>Conclusion:</strong> ${escapeHTML(session.plan.conclusion)}</p></section></aside><section class="writing-pane"><label for="practice-introduction">Write your introduction.</label><textarea class="writing-area introduction-area" id="practice-introduction">${escapeHTML(session.introduction)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(session.introduction)} words</span></div>${helpMarkup(`${session.id}-help`, ["Read your first plan note. What should the reader understand at the start?", "Make your answer clear if the question asks what you think.", "Use your two main-paragraph ideas to show where the essay will go."])}${aiMarkup(`${session.id}-ai`)}<button class="primary-button" type="button" data-practice-save ${session.introduction.trim() ? "" : "disabled"}>Keep my introduction</button></section></div></section>`;
}

function bindPractice(session, question) {
  if (session.phase === "understand") {
    document.querySelectorAll(`input[name="${session.id}-job"]`).forEach((input) => input.addEventListener("change", () => { savePracticeSession(session.id, { jobChoice: input.value, jobChecked: false }); render(); }));
    document.querySelector("[data-practice-check]")?.addEventListener("click", () => { savePracticeSession(session.id, { jobChecked: true }); render(); });
    document.querySelector("[data-practice-next]")?.addEventListener("click", () => { savePracticeSession(session.id, { phase: "plan" }); render(); });
    return;
  }
  if (session.phase === "plan") {
    const form = document.querySelector("#practice-plan");
    form.addEventListener("input", () => {
      const plan = Object.fromEntries(new FormData(form).entries());
      savePracticeSession(session.id, { plan });
      form.querySelector('button[type="submit"]').disabled = !practicePlanReady(plan);
    });
    form.addEventListener("submit", (event) => { event.preventDefault(); const plan = Object.fromEntries(new FormData(form).entries()); if (!practicePlanReady(plan)) return; savePracticeSession(session.id, { plan, phase: "write" }); render(); });
    return;
  }
  const textarea = document.querySelector("#practice-introduction");
  textarea.addEventListener("input", () => { savePracticeSession(session.id, { introduction: textarea.value }); document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`; document.querySelector("[data-practice-save]").disabled = !textarea.value.trim(); });
  document.querySelector("[data-practice-save]").addEventListener("click", () => { if (!textarea.value.trim()) return; savePracticeSession(session.id, { introduction: textarea.value, complete: true, phase: "complete" }); setUnitState("end", { activePracticeId: "" }); render(); });
  bindHelp(`${session.id}-help`);
  bindAI({ id: `${session.id}-ai`, textarea, question: question.question, analysis: `Independent introduction practice. Learner's own plan: ${JSON.stringify(session.plan)}`, feedback: content.ai.introduction });
}

function renderEnd(unit) {
  const id = "end";
  const saved = getUnitState(id);
  const session = getPracticeSession(saved);
  const question = session ? content.workshop1.practiceQuestions.find((item) => item.id === session.questionId) : null;
  recordCompletion(id, completionPolicy.onArrival);
  app.innerHTML = `<article>${unitHeader(unit, "You've practised three important steps: understand the question, plan your answer and write your introduction.")}<div class="completion-note"><h2>Workshop 1 complete</h2><p>You've practised three important steps:</p><ul><li>Understand the question.</li><li>Plan your answer.</li><li>Write your introduction.</li></ul><p>You can practise again with another question, or finish here.</p><p>Next time, we'll start building the main paragraphs.</p></div>${session && !session.complete ? `${practiceMarkup(session, question)}<div class="route-choice"><button class="secondary-button" type="button" data-leave-practice>Back to workshop end</button><button class="primary-button" type="button" data-finish>Finish workshop</button></div>` : `<div class="route-choice"><button class="secondary-button" type="button" data-practise>${(state.drafts.practiceSessions || []).length ? "Practise again" : "Practise with another question"}</button><button class="primary-button" type="button" data-finish ${saved.finished ? "disabled" : ""}>${saved.finished ? "Workshop finished" : "Finish workshop"}</button></div>${saved.finished ? feedbackMarkup("Workshop finished. Your writing is saved on this device.") : ""}`}<nav class="unit-navigation" aria-label="Learning-unit navigation"><button class="secondary-button" type="button" data-nav="o3">Back</button><span></span></nav></article>`;
  document.querySelector("[data-practise]")?.addEventListener("click", startPractice);
  document.querySelector("[data-leave-practice]")?.addEventListener("click", () => { setUnitState(id, { activePracticeId: "" }); render(); });
  document.querySelector("[data-finish]")?.addEventListener("click", () => { setUnitState(id, { finished: true, activePracticeId: "" }); render(); });
  if (session && !session.complete) bindPractice(session, question);
}

function renderB1(unit) {
  const id = "b1";
  const source = content.b1;
  const saved = getUnitState(id);
  const answers = saved.answers || {};
  const coreIdeas = orderedOptions("b1-core", source.ideas.filter((idea) => idea.core), source.shuffle);
  const extraIdeas = orderedOptions("b1-extra", source.ideas.filter((idea) => !idea.core), source.shuffle);
  const ready = coreIdeas.every((idea) => answers[idea.id]);
  const labelFor = (value) => source.labels.find((label) => label.id === value)?.text || "Not chosen";
  app.innerHTML = `<article>${unitHeader(unit, "An idea can be about university but still not help you answer this question.")}${questionMarkup(content.canonicalQuestion)}<form id="b1-form" class="classification-list"><p class="prompt">Does each idea help answer the question?</p>${coreIdeas.map((idea) => `<div class="classification-row"><label for="b1-${idea.id}">${idea.text}</label><select id="b1-${idea.id}" name="${idea.id}"><option value="">Choose…</option>${source.labels.map((label) => `<option value="${label.id}" ${answers[idea.id] === label.id ? "selected" : ""}>${label.text}</option>`).join("")}</select>${saved.checked && answers[idea.id] ? `<p class="row-feedback"><strong>Your answer:</strong> ${labelFor(answers[idea.id])}<br/><strong>Workshop answer:</strong> ${labelFor(idea.answer)}. ${idea.feedback}</p>` : ""}</div>`).join("")}<button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check my answers</button></form>${saved.checked ? feedbackMarkup("Now you can see why some ideas help more than others. Another answer may still be useful to discuss.", "success") : ""}${saved.checked ? `<details class="workspace-note"><summary>Optional: look at two more ideas</summary>${extraIdeas.map((idea) => `<section><p><strong>${idea.text}</strong></p><p><strong>Workshop answer:</strong> ${labelFor(idea.answer)}. ${idea.feedback}</p></section>`).join("")}</details>` : ""}<blockquote class="principle-panel"><p><strong>Being about the topic is not enough. The idea must help answer the question.</strong></p></blockquote>${helpMarkup(id, source.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#b1-form");
  form.addEventListener("change", () => {
    const data = new FormData(form);
    const next = { ...answers, ...Object.fromEntries(coreIdeas.map((idea) => [idea.id, data.get(idea.id)])) };
    setUnitState(id, { answers: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !coreIdeas.every((idea) => next[idea.id]);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const next = { ...answers, ...Object.fromEntries(coreIdeas.map((idea) => [idea.id, data.get(idea.id)])) };
    recordCompletion(id, completionPolicy.afterCheck, { answers: next, checked: true, diagnosticResult: { preferred: coreIdeas.filter((idea) => next[idea.id] === idea.answer).length, total: coreIdeas.length } });
    render();
  });
  bindHelp(id);
}

function renderSequentialJudgement(id, unit, { source, introduction, prompt, labels, principle, criterion = "", required = 2 }) {
  const saved = getUnitState(id);
  const ordered = orderedOptions(`${id}-examples`, source.options, source.shuffle);
  const reviewed = saved.reviewed || [];
  const judgements = saved.judgements || {};
  const activeId = ordered.some((item) => item.id === saved.activeId) ? saved.activeId : ordered[0].id;
  const active = source.options.find((item) => item.id === activeId);
  const current = judgements[activeId];
  const enough = reviewed.length >= required;
  const next = ordered.find((item) => !reviewed.includes(item.id) && item.id !== activeId);
  const labelFor = (value) => labels.find((label) => label.id === value)?.text || "Not chosen";
  app.innerHTML = `<article>${unitHeader(unit, introduction)}${questionMarkup(content.canonicalQuestion)}${source.idea ? `<blockquote class="principle-panel"><p><strong>First idea:</strong> ${source.idea}</p></blockquote>` : ""}<section class="interaction-pane"><p class="prompt">${prompt}</p><article class="judgement-focus"><p class="eyebrow">Example ${Math.min(reviewed.length + (reviewed.includes(activeId) ? 0 : 1), source.options.length)} of ${source.options.length}</p><p class="judgement-text">${active.text}</p><fieldset><legend>What do you think?</legend><div class="inline-choices">${labels.map((label) => compactChoice({ value: label.id, label: label.text, name: `${id}-judgement`, checked: current?.choice === label.id })).join("")}</div></fieldset>${current?.checked ? `<div class="row-feedback"><p><strong>Your answer:</strong> ${labelFor(current.choice)}</p><p><strong>Workshop answer:</strong> ${labelFor(active.answer)}. ${active.feedback}</p></div>` : ""}</article><div class="action-row">${!current?.checked ? `<button class="primary-button" type="button" data-check-example ${current?.choice ? "" : "disabled"}>Check my answer</button>` : next ? `<button class="${enough ? "secondary-button" : "primary-button"}" type="button" data-next-example>${enough ? "Look at another example" : "Try another example"}</button>` : ""}</div><p class="choice-note">${enough ? `You have checked ${reviewed.length} examples. The others are optional.` : `Check ${required - reviewed.length} more ${required - reviewed.length === 1 ? "example" : "examples"} to continue.`}</p>${principle ? `<blockquote class="principle-panel"><p>${principle}</p></blockquote>` : ""}${criterion ? criterionMarkup("Task Response", criterion) : ""}${helpMarkup(id, source.help)}</section>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}-judgement"]`).forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { activeId, judgements: { ...judgements, [activeId]: { choice: input.value, checked: false } } });
    render();
  }));
  document.querySelector("[data-check-example]")?.addEventListener("click", () => {
    const choice = document.querySelector(`input[name="${id}-judgement"]:checked`)?.value;
    if (!choice) return;
    const nextReviewed = [...new Set([...reviewed, activeId])];
    const nextJudgements = { ...judgements, [activeId]: { choice, checked: true, preferred: choice === active.answer } };
    if (nextReviewed.length >= required) {
      recordCompletion(id, completionPolicy.afterCheck, { activeId, reviewed: nextReviewed, judgements: nextJudgements, checked: true, diagnosticResult: { preferred: Object.values(nextJudgements).filter((item) => item.preferred).length, reviewed: nextReviewed.length } });
    } else {
      setUnitState(id, { activeId, reviewed: nextReviewed, judgements: nextJudgements, checked: true });
    }
    render();
  });
  document.querySelector("[data-next-example]")?.addEventListener("click", () => {
    if (!next) return;
    setUnitState(id, { activeId: next.id, checked: false });
    render();
  });
  bindHelp(id);
}

function renderB2(unit) {
  renderSequentialJudgement("b2", unit, {
    source: content.b2,
    introduction: "Read the first idea. Then look at the next sentence. What does it add?",
    prompt: content.b2.prompt,
    labels: content.b2.labels,
    principle: "<strong>An idea is not an explanation.</strong> The next sentence should help the reader understand more.",
  });
}

function renderB3(unit) {
  const id = "b3";
  const source = content.b3;
  const saved = getUnitState(id);
  const ideas = orderedOptions("b3-ideas", source.ideas, true);
  const whys = saved.idea ? orderedOptions("b3-whys", source.whys.filter((item) => item.idea === saved.idea), true) : [];
  const supports = saved.idea ? orderedOptions("b3-supports", source.supports.filter((item) => item.idea === saved.idea || item.idea === "all"), true) : [];
  const customNeeded = saved.position === "I want to write my position differently";
  const ready = saved.position && saved.idea && saved.why && (!customNeeded || saved.customPosition?.trim());
  app.innerHTML = `<article>${unitHeader(unit, "Start with one idea. Then explain why it is true or how it works. Add more only when it helps the reader.")}${questionMarkup(content.canonicalQuestion)}<form id="b3-form" class="reasoning-builder"><p class="choice-note">Choose what you think, one idea, and a reason. The last two boxes are optional.</p><label class="reasoning-step"><strong>What I think</strong><select name="position"><option value="">Choose…</option>${source.positions.map((position) => `<option ${saved.position === position ? "selected" : ""}>${position}</option>`).join("")}</select></label>${customNeeded ? `<label class="reasoning-step"><strong>What I think, in my own words</strong><input class="reasoning-note" name="customPosition" value="${escapeHTML(saved.customPosition)}"/></label>` : ""}<label class="reasoning-step"><strong>My main idea</strong><select name="idea"><option value="">Choose an idea…</option>${ideas.map((idea) => `<option value="${idea.id}" ${saved.idea === idea.id ? "selected" : ""}>${idea.text}</option>`).join("")}</select></label><label class="reasoning-step"><strong>Why does this happen?</strong><select name="why" ${saved.idea ? "" : "disabled"}><option value="">Choose a reason…</option>${whys.map((item) => `<option value="${item.id}" ${saved.why === item.id ? "selected" : ""}>${item.text}</option>`).join("")}</select></label><label class="reasoning-step"><strong>Optional: What else would help the reader?</strong><select name="support" ${saved.idea ? "" : "disabled"}><option value="">No extra step needed, or choose one…</option>${supports.map((item) => `<option value="${item.id}" ${saved.support === item.id ? "selected" : ""}>${item.text}</option>`).join("")}</select></label><label class="reasoning-step"><strong>Optional: add your own note</strong><textarea name="note" rows="3">${escapeHTML(state.drafts.reasoningNote)}</textarea></label><button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Keep these notes</button></form>${saved.saved ? feedbackMarkup("Your notes are saved. Use only the steps that help your idea.") : ""}<blockquote class="principle-panel"><p>A clear reason may be enough. You can add a result, comparison, clearer detail or a real example when it helps.</p><p>An example shows the idea in one specific case. Another reason or result is a new point, not an example.</p></blockquote>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
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
    recordCompletion(id, completionPolicy.afterSave, { saved: true });
    render();
  });
}

function renderB4(unit) {
  renderSequentialJudgement("b4", unit, {
    source: content.b4,
    introduction: "A longer paragraph is not always better. Look at what the sentences help you understand.",
    prompt: content.b4.prompt,
    labels: [{ id: "strong", text: "Explains the idea clearly" }, { id: "could", text: "Could work with a clearer link" }, { id: "weak", text: "Adds little useful explanation" }],
    principle: "<strong>More words do not always give a better explanation. Difficult words do not make weak thinking strong.</strong>",
  });
}

function reasoningSummary() {
  const saved = getUnitState("b3");
  const idea = content.b3.ideas.find((item) => item.id === saved.idea)?.text || "No saved idea";
  const why = content.b3.whys.find((item) => item.id === saved.why)?.text || "No saved explanation";
  const support = content.b3.supports.find((item) => item.id === saved.support)?.text || "No additional step chosen";
  return `Position: ${saved.customPosition || saved.position || "Not recorded"}\nIdea: ${idea}\nWhy/how: ${why}\nSupport: ${support}${state.drafts.reasoningNote ? `\nOwn note: ${state.drafts.reasoningNote}` : ""}`;
}

function renderB5(unit) {
  const summary = reasoningSummary();
  const saved = getUnitState("b5");
  const draft = state.drafts.bodyParagraph || "";
  app.innerHTML = `<article>${unitHeader(unit, "Now use your notes to write one real paragraph. Give one main idea and help the reader understand it.")}${questionMarkup(content.canonicalQuestion)}<div class="activity-layout writing-layout"><aside><h2>Your notes</h2><pre class="workspace-note">${escapeHTML(summary)}</pre><div class="framework-strip"><section><strong>Main idea</strong><span>How does it help answer?</span></section><section><strong>Explain</strong><span>Why or how?</span></section><section><strong>Finish</strong><span>Has the reader understood the idea?</span></section></div></aside><section class="writing-pane"><label for="b5-draft">Your body paragraph</label><textarea class="writing-area paragraph-area" id="b5-draft">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span></div>${helpMarkup("b5", content.b5.help)}${aiMarkup("b5")}<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>Keep this paragraph</button></section></div>${navigationMarkup({ canContinue: state.completed.includes("b5") })}</article>`;
  const textarea = document.querySelector("#b5-draft");
  textarea.addEventListener("input", () => { saveDraft("bodyParagraph", textarea.value); document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`; document.querySelector("[data-save]").disabled = !textarea.value.trim(); });
  document.querySelector("[data-save]").addEventListener("click", () => { if (!textarea.value.trim()) return; saveDraft("bodyParagraph", textarea.value); recordCompletion("b5", completionPolicy.afterSave, { saved: true }); render(); });
  bindHelp("b5");
  bindAI({ id: "b5", textarea, question: content.canonicalQuestion, analysis: reasoningSummary(), feedback: content.b5.aiFeedback });
}

function renderB6(unit) {
  renderCollect("b6", unit, { introduction: "You have just answered the question, explained an idea and added what the reader needed. We can keep these as three simple checking questions.", items: [
    { id: "answer", label: "Answer", short: "Did I answer every part?", detail: "Check every part of the question. If it asks what you think, make your answer clear." },
    { id: "explain", label: "Explain", short: "Did I show why or how?", detail: "Help the reader understand your main idea. Do not leave it as a short claim." },
    { id: "support", label: "Support", short: "Did I add enough?", detail: "Add a result, comparison, clear detail or real example only when it helps the reader." },
  ], closing: "<strong>We call this check AES: Answer, Explain, Support.</strong> This is a workshop tool, not an official IELTS term." });
}

function renderW1(unit) {
  const id = "w1";
  const saved = getUnitState(id);
  const answers = saved.answers || {};
  const allAnswered = content.w1.tasks.every((task) => Array.isArray(answers[task.id]) && answers[task.id].length);
  const correct = allAnswered && content.w1.tasks.every((task) => task.required.length === answers[task.id].length && task.required.every((job) => answers[task.id].includes(job)));
  const tasks = orderedOptions("w1-tasks", content.w1.tasks, true);
  app.innerHTML = `<article>${unitHeader(unit, "Before you plan the paragraphs, check what each question asks you to do.")}<form id="w1-form" class="judgement-list">${tasks.map((task) => `<fieldset class="judgement-row"><legend>${task.instruction}</legend><div class="choice-list">${orderedOptions(`w1-${task.id}-jobs`, task.jobs, true).map((job) => choiceMarkup({ option: job, name: task.id, type: "checkbox", checked: answers[task.id]?.includes(job.id) })).join("")}</div></fieldset>`).join("")}<button class="primary-button" type="submit" ${allAnswered ? "" : "disabled"}>Check my answers</button></form>${saved.checked ? feedbackMarkup(correct ? "Yes. You found everything each question asks for." : "Look at the workshop answers under each question. One answer may be missing, or one choice may belong to a different kind of question.", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>Read the question first. Then plan the essay it asks for.</strong></p></blockquote>${helpMarkup(id, content.w1.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#w1-form");
  const collect = () => Object.fromEntries(content.w1.tasks.map((task) => [task.id, [...form.querySelectorAll(`input[name="${task.id}"]:checked`)].map((input) => input.value)]));
  form.addEventListener("change", () => { const next = collect(); setUnitState(id, { answers: next, checked: false }); form.querySelector('button[type="submit"]').disabled = !content.w1.tasks.every((task) => next[task.id].length); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const next = collect(); const preferred = content.w1.tasks.every((task) => task.required.length === next[task.id].length && task.required.every((job) => next[task.id].includes(job))); recordCompletion(id, completionPolicy.afterCheck, { answers: next, checked: true, diagnosticResult: { preferred } }); render(); });
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
  app.innerHTML = `<article>${unitHeader(unit, "A clear plan gives each paragraph one useful purpose. More than one plan can work.")}${questionMarkup(content.canonicalQuestion)}<form id="w2-form" class="plan-list">${plans.map((plan) => `<div class="plan-option"><h2>${plan.label}</h2><p>${plan.text}</p><label for="w2-${plan.id}">How well could this plan work?</label><select id="w2-${plan.id}" name="${plan.id}"><option value="">Choose…</option>${labels.map((label) => `<option value="${label.id}" ${answers[plan.id] === label.id ? "selected" : ""}>${label.text}</option>`).join("")}</select>${saved.checked ? `<p class="row-feedback">${plan.feedback}</p>` : ""}</div>`).join("")}<button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check the plans</button></form>${saved.checked ? feedbackMarkup(correct ? "You found a clear plan, another possible plan, and the risks in the weaker plans." : "Read the workshop notes under each plan. A different number of paragraphs is not automatically wrong, but each paragraph needs a clear purpose.", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>A few well-explained ideas can be stronger than many short ideas.</strong></p></blockquote><p class="strategy-note"><strong>In this workshop:</strong> we use an introduction, two main paragraphs and a conclusion as a clear starting point.</p>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#w2-form");
  form.addEventListener("change", () => { const data = new FormData(form); const next = Object.fromEntries(content.w2.options.map((plan) => [plan.id, data.get(plan.id)])); setUnitState(id, { answers: next, checked: false }); form.querySelector('button[type="submit"]').disabled = !content.w2.options.every((plan) => next[plan.id]); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(form); const next = Object.fromEntries(content.w2.options.map((plan) => [plan.id, data.get(plan.id)])); const preferred = content.w2.options.every((plan) => next[plan.id] === plan.status); recordCompletion(id, completionPolicy.afterCheck, { answers: next, checked: true, diagnosticResult: { preferred } }); render(); });
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
  app.innerHTML = `<article>${unitHeader(unit, "Each main paragraph should add something useful to the same answer. Linking words cannot fix repeated or conflicting ideas.")}${questionMarkup(content.canonicalQuestion)}<form id="w3-form" class="judgement-list"><fieldset class="judgement-row"><legend>Which pair of paragraphs moves the answer forward most clearly?</legend><div class="choice-list">${progression.map((option) => choiceMarkup({ option, name: "progression", checked: saved.progression === option.id })).join("")}</div>${saved.checked && pChoice ? `<p class="row-feedback">${pChoice.feedback}</p>` : ""}</fieldset><fieldset class="judgement-row"><legend>The writer says “I mostly agree”, but paragraph 2 says the opposite. What would keep the answer clear?</legend><div class="choice-list">${consistency.map((option) => choiceMarkup({ option, name: "consistency", checked: saved.consistency === option.id })).join("")}</div>${saved.checked && cChoice ? `<p class="row-feedback">${cChoice.feedback}</p>` : ""}</fieldset><button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check my answers</button></form>${saved.checked ? feedbackMarkup(correct ? "The two paragraphs add different ideas to one clear answer." : "Read the notes under your choices. Ask two questions: do the paragraphs add different ideas, and is it still clear what the writer thinks?", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>Linking words help the reader, but the ideas still need to fit together.</strong></p></blockquote>${helpMarkup(id, content.w3.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#w3-form");
  form.addEventListener("change", () => { const data = new FormData(form); setUnitState(id, { progression: data.get("progression"), consistency: data.get("consistency"), checked: false }); form.querySelector('button[type="submit"]').disabled = !(data.get("progression") && data.get("consistency")); });
  form.addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(form); const pc = content.w3.progression.find((item) => item.id === data.get("progression")); const cc = content.w3.consistency.find((item) => item.id === data.get("consistency")); recordCompletion(id, completionPolicy.afterCheck, { progression: data.get("progression"), consistency: data.get("consistency"), checked: true, diagnosticResult: { preferred: Boolean(pc?.viable && cc?.viable) } }); render(); });
  bindHelp(id);
}

function renderW4(unit) {
  const id = "w4";
  const saved = getUnitState(id);
  const intro = state.drafts.introduction || "";
  const conclusions = orderedOptions(id, content.w4.conclusions, true);
  const selected = content.w4.conclusions.find((item) => item.id === saved.conclusion);
  app.innerHTML = `<article>${unitHeader(unit, "The introduction shows where the essay is going. The conclusion finishes the same answer.")}${questionMarkup(content.canonicalQuestion)}<section class="insight-panel"><h2>What the main paragraphs say</h2><p>${content.w4.bodyPlan}</p></section><div class="activity-layout"><section><label class="writing-label" for="w4-intro">Write or check your introduction. Does it tell us what the essay is about and what you think?</label><textarea class="writing-area" id="w4-intro">${escapeHTML(intro)}</textarea></section><form id="w4-form"><fieldset><legend class="prompt">Which conclusion finishes this answer best?</legend><div class="choice-list">${conclusions.map((option) => choiceMarkup({ option, name: "conclusion", checked: saved.conclusion === option.id })).join("")}</div></fieldset><button class="primary-button" type="submit" ${saved.conclusion && intro.trim() ? "" : "disabled"}>Check the beginning and ending</button>${saved.checked && selected ? feedbackMarkup(selected.feedback, selected.viable ? "success" : "reconsider") : ""}</form></div><blockquote class="principle-panel"><p><strong>Finish the answer. Do not start a new main idea.</strong> “In conclusion” is clear and useful.</p></blockquote>${helpMarkup(id, content.w4.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const introField = document.querySelector("#w4-intro");
  introField.addEventListener("input", () => { saveDraft("introduction", introField.value); document.querySelector('#w4-form button[type="submit"]').disabled = !(introField.value.trim() && document.querySelector('input[name="conclusion"]:checked')); });
  document.querySelectorAll('input[name="conclusion"]').forEach((input) => input.addEventListener("change", () => { setUnitState(id, { conclusion: input.value, checked: false }); document.querySelector('#w4-form button[type="submit"]').disabled = !introField.value.trim(); }));
  document.querySelector("#w4-form").addEventListener("submit", (event) => { event.preventDefault(); const conclusion = document.querySelector('input[name="conclusion"]:checked')?.value; const option = content.w4.conclusions.find((item) => item.id === conclusion); saveDraft("introduction", introField.value); recordCompletion(id, completionPolicy.afterCheck, { conclusion, checked: true, diagnosticResult: { preferred: Boolean(option?.viable) } }); render(); });
  bindHelp(id);
}

function planFormMarkup(name, plan, { transfer = false } = {}) {
  return `<form id="${name}-form" class="plan-form"><label class="plan-field"><strong>What does the question ask me to do?</strong><textarea name="job">${escapeHTML(plan.job)}</textarea></label><label class="plan-field"><strong>What do I think? ${transfer ? "— only if the question asks" : ""}</strong><textarea name="position">${escapeHTML(plan.position)}</textarea></label><label class="plan-field"><strong>Main paragraph 1 — main idea</strong><textarea name="body1">${escapeHTML(plan.body1)}</textarea></label><label class="plan-field"><strong>Main paragraph 2 — main idea</strong><textarea name="body2">${escapeHTML(plan.body2)}</textarea></label>${transfer ? "" : `<label class="plan-field"><strong>Did I answer every part without repeating the same idea?</strong><textarea name="check">${escapeHTML(plan.check)}</textarea></label>`}<div class="action-row full-width"><button class="primary-button" type="submit">Keep this quick plan</button></div></form>`;
}

function renderW5(unit) {
  const id = "w5";
  const plan = state.drafts.quickPlan;
  app.innerHTML = `<article>${unitHeader(unit, "Make a short plan that will help you write. Do not write the whole essay here.")}${questionMarkup(content.canonicalQuestion)}<p class="strategy-note"><strong>Our starting point:</strong> use two main paragraphs with a different clear idea in each one.</p>${planFormMarkup("quick-plan", plan)}${getUnitState(id).saved ? feedbackMarkup("Your plan is saved and will stay beside you while you write.") : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
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
  app.innerHTML = `<article>${unitHeader(unit, introduction)}<div class="activity-layout writing-layout"><details class="source-pane" open><summary>View the question and plan</summary>${questionMarkup(question, { transfer, meta: true })}<section class="workspace-note"><h2>Your quick plan</h2><p><strong>Question:</strong> ${escapeHTML(plan.job || "Not recorded")}</p><p><strong>My answer:</strong> ${escapeHTML(plan.position || (transfer ? "The question may not ask for your opinion" : "Not recorded"))}</p><p><strong>Main paragraph 1:</strong> ${escapeHTML(plan.body1 || "Not recorded")}</p><p><strong>Main paragraph 2:</strong> ${escapeHTML(plan.body2 || "Not recorded")}</p></section></details><section class="writing-pane"><label for="${id}-draft">Your complete essay</label><textarea class="writing-area full-essay-area" id="${id}-draft" spellcheck="true">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span><span data-word-requirement>${wordRequirementMessage(wordCount(draft))}</span></div>${helpMarkup(id, ["Look at the question. Which part is hardest to find in your essay?", "Check one thing at a time: did you answer every part, explain each main idea, keep your answer clear and finish it?"])}${aiMarkup(id)}<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>${transfer ? "Keep this new essay" : "Keep this complete essay"}</button></section></div>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const textarea = document.querySelector(`#${id}-draft`);
  textarea.addEventListener("input", () => { saveDraft(draftName, textarea.value); const count = wordCount(textarea.value); document.querySelector("[data-word-count]").textContent = `${count} words`; document.querySelector("[data-word-requirement]").textContent = wordRequirementMessage(count); document.querySelector("[data-save]").disabled = !textarea.value.trim(); });
  document.querySelector("[data-save]").addEventListener("click", () => { if (!textarea.value.trim()) return; saveDraft(draftName, textarea.value); onSave?.(textarea.value); completeUnit(id); render(); });
  bindHelp(id);
  bindAI({ id, textarea, question, analysis, feedback });
}

function renderW6(unit) {
  essayWorkspace({ id: "w6", unit, introduction: "Use your plan and write the complete essay. Your writing is saved on this device.", question: content.canonicalQuestion, draftName: "fullEssay", feedback: content.ai.fullEssay, analysis: `Agreement/position task. Learner's plan: ${JSON.stringify(state.drafts.quickPlan)}`, onSave: (value) => { if (!state.drafts.originalEssay.trim()) state.drafts.originalEssay = value; if (!state.drafts.revisedEssay.trim()) state.drafts.revisedEssay = value; saveTask2State(state); } });
}

function renderW7(unit) {
  const id = "w7";
  const saved = getUnitState(id);
  const answers = saved.answers || {};
  const checks = [
    { id: "jobs", text: "I answered every part of the question." },
    { id: "paragraphs", text: "Each paragraph has a clear purpose." },
    { id: "match", text: "My essay follows my plan, or improves it in a useful way." },
  ];
  const statuses = ["Yes", "Not sure", "Needs attention"];
  const ready = checks.every((check) => answers[check.id]);
  app.innerHTML = `<article>${unitHeader(unit, "Compare your plan with the essay you wrote. Be honest; this is not a score.")}${questionMarkup(content.canonicalQuestion)}<form id="w7-form" class="judgement-list"><p class="prompt">Did your essay follow the plan, or did you make a useful change while writing?</p>${checks.map((check) => `<fieldset class="judgement-row"><legend>${check.text}</legend><div class="inline-choices">${statuses.map((status) => compactChoice({ value: status, label: status, name: check.id, checked: answers[check.id] === status })).join("")}</div></fieldset>`).join("")}<button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Keep this check</button></form>${saved.saved ? feedbackMarkup("Your check is saved. You do not need to invent a problem if the plan worked.") : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
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
  app.innerHTML = `<article>${unitHeader(unit, "Read this short essay. Choose the two paragraphs that need the most work.")}${questionMarkup(content.canonicalQuestion)}<section class="framework-strip" aria-label="AES checking questions"><section><strong>Answer</strong><span>Did it answer every part?</span></section><section><strong>Explain</strong><span>Can I understand why or how?</span></section><section><strong>Support</strong><span>Did the writer add enough?</span></section></section><p class="prompt">Choose two paragraphs.</p><div class="diagnostic-list">${content.c1.paragraphs.map((paragraph) => `<button class="diagnostic-button" type="button" data-paragraph="${paragraph.id}" data-selected="${selected.includes(paragraph.id)}" aria-pressed="${selected.includes(paragraph.id)}"><strong>${paragraph.label}</strong><span>${paragraph.text}</span></button>`).join("")}</div><button class="primary-button" type="button" data-check ${selected.length === 2 ? "" : "disabled"}>Check my answers</button>${saved.checked ? feedbackMarkup(correct ? "Paragraph 2 gives a concern but does not explain how it affects free tuition. The conclusion changes ‘partly agree’ to complete agreement." : "Some parts already work. Compare the answer at the beginning and the end. Then ask whether paragraph 2 explains why funding changes the answer.", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>An essay can look complete but still have an unclear idea or answer.</strong></p></blockquote>${helpMarkup(id, ["First read the introduction and conclusion. Does the writer give the same answer in both?", "Now read each main paragraph. Can you understand why its main idea matters?", "Look closely at main paragraph 2 and the conclusion. One needs a clearer explanation; the other changes the writer's answer."])}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll("[data-paragraph]").forEach((button) => button.addEventListener("click", () => {
    const value = button.dataset.paragraph;
    const next = selected.includes(value) ? selected.filter((item) => item !== value) : selected.length < 2 ? [...selected, value] : selected;
    setUnitState(id, { selected: next, checked: false });
    render();
  }));
  document.querySelector("[data-check]")?.addEventListener("click", () => { recordCompletion(id, completionPolicy.afterCheck, { selected, checked: true, diagnosticResult: { preferred: correct } }); render(); });
  bindHelp(id);
}

function renderC2(unit) {
  const id = "c2";
  const saved = getUnitState(id);
  const options = orderedOptions(id, content.c2.options, content.c2.shuffle);
  const selected = content.c2.options.find((option) => option.id === saved.choice);
  app.innerHTML = `<article>${unitHeader(unit, "Some changes matter more than others. Fix the biggest problem first.")}${questionMarkup(content.canonicalQuestion)}<fieldset><legend class="prompt">What should this writer fix first?</legend><div class="choice-list">${options.map((option) => choiceMarkup({ option, name: id, checked: saved.choice === option.id })).join("")}</div></fieldset><button class="primary-button" type="button" data-check ${saved.choice ? "" : "disabled"}>Check my answer</button>${saved.checked && selected ? feedbackMarkup(selected.feedback, selected.priority === 1 ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p><strong>Fix what most changes the answer first. Small language changes can come later.</strong></p></blockquote>${helpMarkup(id, content.c2.help)}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll(`input[name="${id}"]`).forEach((input) => input.addEventListener("change", () => { setUnitState(id, { choice: input.value, checked: false }); document.querySelector("[data-check]").disabled = false; }));
  document.querySelector("[data-check]").addEventListener("click", () => { const choice = document.querySelector(`input[name="${id}"]:checked`)?.value; const option = content.c2.options.find((item) => item.id === choice); recordCompletion(id, completionPolicy.afterCheck, { choice, checked: true, diagnosticResult: { preferred: option?.priority === 1 } }); render(); });
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
  app.innerHTML = `<article>${unitHeader(unit, "Choose one thing to improve first. Then change your own essay.")}${questionMarkup(content.canonicalQuestion, { meta: true })}<div class="activity-layout writing-layout"><aside><h2>What will you improve first?</h2><div class="priority-choices">${displayedPriorities.map((priority) => compactChoice({ value: priority.id, label: priority.label, name: "priority", checked: saved.priority === priority.id })).join("")}</div><details class="workspace-note"><summary>Optional: IELTS assessment names</summary><p><strong>Task Response:</strong> answering the task.</p><p><strong>Coherence and Cohesion:</strong> organising and connecting ideas.</p><p><strong>Lexical Resource:</strong> choosing words well.</p><p><strong>Grammatical Range and Accuracy:</strong> using sentences clearly and accurately.</p></details></aside><section class="writing-pane"><label for="c3-draft">Your improved essay</label><textarea class="writing-area full-essay-area" id="c3-draft">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span><span data-word-requirement>${wordRequirementMessage(wordCount(draft))}</span></div>${aiMarkup(id, { revision: true })}<button class="primary-button" type="button" data-save ${saved.priority && draft.trim() ? "" : "disabled"}>Keep this revision</button></section></div>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
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
  app.innerHTML = `<article>${unitHeader(unit, "Compare your two versions. Look at what became clearer or more useful.")}${questionMarkup(content.canonicalQuestion)}<div class="before-after"><section class="version-panel"><h2>Before</h2><div class="essay-copy">${escapeHTML(state.drafts.originalEssay)}</div></section><section class="version-panel"><h2>After</h2><div class="essay-copy">${escapeHTML(state.drafts.revisedEssay)}</div></section></div><form id="c4-form"><fieldset><legend class="prompt">What did your change improve?</legend><div class="reflection-options">${displayedEffects.map((effect) => compactChoice({ value: effect.id, label: effect.text, name: "effects", type: "checkbox", checked: reflection.includes(effect.id) })).join("")}</div></fieldset><p class="choice-note">Choose what is true for your essay. “Changed little” cannot be chosen with another improvement.</p><button class="primary-button" type="submit" ${reflection.length ? "" : "disabled"}>Keep this check</button></form>${saved.saved ? `<section class="model-panel"><p class="eyebrow">Teaching example</p><h2>One way to write the essay well</h2><div class="lens-buttons">${content.teachingExample.lenses.map((item) => `<button type="button" data-lens="${item.id}" aria-pressed="${item.id === activeLens}">${item.label}</button>`).join("")}</div><aside class="insight-panel"><h3>${lens.label}</h3><p>${lens.note}</p></aside>${teachingExampleMarkup()}</section>` : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
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
  app.innerHTML = `<article>${unitHeader(unit, "Use the same steps with a new question and less help.")}<div class="context-entry"><section>${questionMarkup(content.transferQuestion, { transfer: true, meta: true })}<details class="workspace-note" ${saved.planOpen ? "open" : ""}><summary>Optional quick plan</summary>${planFormMarkup("transfer-plan", plan, { transfer: true })}</details></section><figure class="context-illustration"><img src="../../media/writing/task-2/home-working-context.png?v=2" alt="A woman writes notes while working on a laptop at home."/><figcaption>This picture shows the situation. It does not tell you whether working from home is good or bad.</figcaption></figure></div><section class="writing-pane"><label for="c5-draft">Your new essay</label><textarea class="writing-area full-essay-area" id="c5-draft">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span><span data-word-requirement>${wordRequirementMessage(wordCount(draft))}</span></div>${helpMarkup(id, ["Look at ‘advantages and disadvantages’. What two sides must you explain?", "Write about the good sides and the bad sides. This question does not ask which side is stronger.", "Use AES if useful: answer both parts, explain each main idea and add enough clear detail."])}${aiMarkup(id)}<button class="primary-button" type="button" data-save ${draft.trim() ? "" : "disabled"}>Keep this new essay</button></section>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
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
    { id: "plan", label: "Plan", text: "Decide your answer and main ideas." },
    { id: "build", label: "Build", text: "Explain and support." },
    { id: "write", label: "Write", text: "Organise clearly." },
    { id: "check", label: "Check", text: "Confirm every required job is answered." },
    { id: "revise", label: "Revise", text: "Fix what most affects the answer first." },
  ];
  const viewed = saved.viewed || [];
  const complete = viewed.length === items.length;
  app.innerHTML = `<article>${unitHeader(unit, "Keep these six steps for your next Task 2 essay.")}<p class="prompt">Select each step once.</p><div class="final-process" role="group" aria-label="Complete Task 2 process">${items.map((item) => `<button type="button" data-process="${item.id}" aria-pressed="${viewed.includes(item.id)}"><strong>${item.label}</strong><span>${item.text}</span></button>`).join("")}</div><p class="choice-note">${viewed.length} of ${items.length} steps selected.</p>${saved.finished ? `<div class="completion-note"><h2>Task 2 workshop complete</h2><p>You understood questions, planned, wrote, checked and improved your work. Your writing is saved on this device.</p></div>` : complete ? feedbackMarkup("You have selected all six steps. Finish when you are ready.") : ""}<div class="action-row"><button class="primary-button" type="button" data-finish ${complete && !saved.finished ? "" : "disabled"}>${saved.finished ? "Workshop complete" : "Finish the workshop"}</button></div>${navigationMarkup({ canContinue: saved.finished })}</article>`;
  document.querySelectorAll("[data-process]").forEach((button) => button.addEventListener("click", () => { setUnitState(id, { viewed: [...new Set([...viewed, button.dataset.process])] }); render(); }));
  document.querySelector("[data-finish]")?.addEventListener("click", () => { setUnitState(id, { finished: true }); completeUnit(id); render(); });
}

const workshop1Renderers = {
  u1: renderU1,
  u2: renderU2,
  q3: renderQ3,
  q4: renderQ4,
  q5: renderQ5,
  n1: renderN1,
  s1: renderS1,
  p1: renderP1,
  p2: renderP2,
  i1: renderI1,
  i2: renderI2,
  f1: renderF1,
  f2: renderF2,
  o1: renderO1,
  o2: renderO2,
  o3: renderO3,
  end: renderEnd,
};

// Retained for the later Workshop 2 redesign. These are intentionally not in today's learner route.
const laterTask2Renderers = { u3: renderU3, u3p: renderU3P, u4: renderU4, u5: renderU5, u6: renderU6, b1: renderB1, b2: renderB2, b3: renderB3, b4: renderB4, b5: renderB5, b6: renderB6, w1: renderW1, w2: renderW2, w3: renderW3, w4: renderW4, w5: renderW5, w6: renderW6, w7: renderW7, c1: renderC1, c2: renderC2, c3: renderC3, c4: renderC4, c5: renderC5, c6: renderC6 };
void laterTask2Renderers;

function render({ focus = false } = {}) {
  const unit = content.units.find((item) => item.id === state.currentUnit) || content.units[0];
  if (state.currentUnit !== unit.id) state.currentUnit = unit.id;
  renderProgress();
  workshop1Renderers[unit.id](unit);
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
