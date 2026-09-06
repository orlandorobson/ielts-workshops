import { generalTask1Content as content } from "../../content/writing/general-task-1.js";
import { buildGeneralAIFeedbackPrompt, copyText } from "./ai-feedback.js";
import { isValidStoredOrder, shuffleOptionIds } from "./randomise.js";
import { clearGeneralState, loadGeneralState, saveGeneralState } from "./general-storage.js";

const app = document.querySelector("#app");
const progress = document.querySelector("#unit-progress");
const currentStage = document.querySelector("#current-stage");
const resetButton = document.querySelector("#reset-progress");
let state = loadGeneralState();
let saveTimer;

const unitIndex = (id) => content.units.findIndex((unit) => unit.id === id);
const getUnitState = (id) => state.units[id] || {};
const escapeHTML = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function setUnitState(id, patch) {
  state.units[id] = { ...getUnitState(id), ...patch };
  saveGeneralState(state);
}

function completeUnit(id) {
  if (!state.completed.includes(id)) state.completed.push(id);
  saveGeneralState(state);
}

function saveDraft(name, value) {
  state.drafts[name] = value;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveGeneralState(state), 180);
}

function orderedOptions(unitId, options, shouldShuffle) {
  const ids = options.map((option) => option.id);
  const savedOrder = getUnitState(unitId).optionOrder;
  const optionOrder = isValidStoredOrder(savedOrder, ids)
    ? savedOrder
    : shouldShuffle
      ? shuffleOptionIds(ids)
      : ids;
  if (optionOrder !== savedOrder) setUnitState(unitId, { optionOrder });
  const byId = new Map(options.map((option) => [option.id, option]));
  return optionOrder.map((id) => byId.get(id));
}

function canVisit(index) {
  const completedIndexes = state.completed.map(unitIndex).filter((value) => value >= 0);
  const furthest = completedIndexes.length ? Math.max(...completedIndexes) + 1 : 0;
  return index <= Math.min(furthest, content.units.length - 1);
}

function renderProgress() {
  progress.replaceChildren();
  const current = content.units.find((unit) => unit.id === state.currentUnit);
  content.sections.forEach((section) => {
    const sectionUnits = content.units.filter((unit) => unit.section === section.id);
    const first = sectionUnits[0];
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "progress-button";
    button.dataset.section = section.id;
    button.dataset.complete = String(sectionUnits.every((unit) => state.completed.includes(unit.id)));
    button.disabled = !canVisit(unitIndex(first.id));
    button.textContent = section.label;
    if (current?.section === section.id) button.setAttribute("aria-current", "step");
    button.addEventListener("click", () => navigateTo(first.id));
    item.append(button);
    progress.append(item);
  });
  currentStage.textContent = `${current?.label || "Workshop"} · Step ${unitIndex(state.currentUnit) + 1} of ${content.units.length}`;
}

function navigateTo(id, { focus = true } = {}) {
  const index = unitIndex(id);
  if (index < 0 || !canVisit(index)) return;
  state.currentUnit = id;
  saveGeneralState(state);
  if (window.location.hash !== `#${id}`) history.pushState({ unit: id }, "", `#${id}`);
  render({ focus });
}

function unitHeader(unit, introduction) {
  return `<header class="unit-header" data-section="${unit.section}"><p class="eyebrow">${unit.eyebrow}</p><h1 id="unit-title">${unit.label}</h1><p class="lead">${introduction}</p></header>`;
}

function taskMarkup({ open = true } = {}) {
  const scenario = content.scenario;
  return `<details class="source-pane" ${open ? "open" : ""}>
    <summary>View the letter task</summary>
    <section class="letter-task" aria-labelledby="letter-task-title">
      <h2 id="letter-task-title">${scenario.title}</h2>
      <p>${scenario.situation}</p>
      <p><strong>${scenario.instruction}</strong></p>
      <ul>${scenario.bulletPoints.map((point) => `<li>${point.text}</li>`).join("")}</ul>
      <div class="letter-task-meta"><span><strong>IELTS requires:</strong> at least 150 words</span><span><strong>We recommend:</strong> approximately 20 minutes</span></div>
    </section>
  </details>`;
}

function feedbackMarkup(message, kind = "success") {
  return `<div class="feedback" data-kind="${kind}" role="status" aria-live="polite" tabindex="-1"><p>${message}</p></div>`;
}

function choiceMarkup({ type = "radio", name, option, checked = false, disabled = false }) {
  return `<label class="choice"><input type="${type}" name="${name}" value="${option.id}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}/><span>${option.text}</span></label>`;
}

function navigationMarkup({ canContinue = false, finish = false } = {}) {
  const index = unitIndex(state.currentUnit);
  const previous = content.units[index - 1];
  const next = content.units[index + 1];
  return `<nav class="unit-navigation" aria-label="Learning-unit navigation">
    ${previous ? `<button class="secondary-button" type="button" data-nav="${previous.id}">Back</button>` : "<span></span>"}
    ${finish
      ? `<button class="primary-button" type="button" data-finish ${canContinue ? "" : "disabled"}>Complete core workshop</button>`
      : next ? `<button class="primary-button" type="button" data-nav="${next.id}" ${canContinue ? "" : "disabled"}>Continue</button>` : ""}
  </nav>`;
}

function bindNavigation() {
  document.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => navigateTo(button.dataset.nav)));
}

function focusAfterRender(selector = "#unit-title") {
  requestAnimationFrame(() => document.querySelector(selector)?.focus({ preventScroll: true }));
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function wordRequirementMessage(count) {
  return count < 150
    ? "IELTS requires at least 150 words. Use BTP and feedback to diagnose what may need development."
    : "IELTS requires at least 150 words. Meeting the minimum does not show that the content, tone or language is effective.";
}

function aiFeedbackMarkup(unitId, feedback, saved) {
  if (!feedback?.enabled) return "";
  return `<section class="ai-feedback-panel" aria-labelledby="${unitId}-ai-heading">
    <h3 id="${unitId}-ai-heading">Use AI to check your writing</h3>
    <ol class="ai-feedback-steps">
      <li><strong>Write first</strong><span>Finish your own answer above.</span></li>
      <li><strong>Copy</strong><span>Select <strong>Copy AI feedback prompt</strong>.</span></li>
      <li><strong>Paste</strong><span>Open your AI chatbot and paste the copied text.</span></li>
      <li><strong>Read</strong><span>Read the feedback before asking for a model.</span></li>
      <li><strong>Revise</strong><span>Come back here and improve your own writing.</span></li>
    </ol>
    <button class="secondary-button ai-copy-button" type="button" data-copy-ai-prompt="${unitId}">Copy AI feedback prompt</button>
    <p class="ai-copy-status" data-ai-copy-status="${unitId}" role="status" aria-live="polite">${saved.aiPromptCopied ? "Copy an updated prompt whenever you want feedback on a later revision." : ""}</p>
    <p class="ai-return-message" data-ai-return-message="${unitId}">Read the feedback, then improve your answer here. This workshop sends nothing automatically.</p>
    ${feedback.reflection ? `<div class="ai-reflection" data-ai-reflection="${unitId}" ${saved.aiRevised ? "" : "hidden"}><label for="${unitId}-ai-reflection">What did you change?</label><textarea id="${unitId}-ai-reflection" rows="2">${escapeHTML(saved.aiReflection || "")}</textarea><p class="field-note">This reflection is not scored.</p></div>` : ""}
  </section>`;
}

function trackAIRevision(unitId, value) {
  const saved = getUnitState(unitId);
  if (!saved.aiPromptCopied || typeof saved.aiOriginal !== "string" || value === saved.aiOriginal) return;
  if (!saved.aiRevised) setUnitState(unitId, { aiRevised: true });
  document.querySelector(`[data-ai-reflection="${unitId}"]`)?.removeAttribute("hidden");
  const message = document.querySelector(`[data-ai-return-message="${unitId}"]`);
  if (message) message.textContent = "You have revised your own writing after copying the prompt. Your response remains under your control.";
}

function bindAIFeedback(unitId, feedback, textarea) {
  if (!feedback?.enabled) return;
  const status = document.querySelector(`[data-ai-copy-status="${unitId}"]`);
  document.querySelector(`[data-copy-ai-prompt="${unitId}"]`)?.addEventListener("click", async () => {
    const learnerResponse = textarea.value;
    if (!learnerResponse.trim()) {
      status.textContent = "Write your own answer first. Then use AI to help you check it.";
      return;
    }
    try {
      await copyText(buildGeneralAIFeedbackPrompt({ scenario: content.scenario, feedback, learnerResponse }));
      const saved = getUnitState(unitId);
      setUnitState(unitId, { aiPromptCopied: true, aiOriginal: typeof saved.aiOriginal === "string" ? saved.aiOriginal : learnerResponse });
      status.textContent = "Copied. Now open your AI chatbot and paste it there.";
    } catch {
      status.textContent = "Your browser could not copy the prompt. Check clipboard permission and try again.";
    }
  });
  document.querySelector(`#${unitId}-ai-reflection`)?.addEventListener("input", (event) => setUnitState(unitId, { aiReflection: event.target.value }));
}

function helpMarkup(source, saved, hasDraft) {
  if (!saved.helpLevel) return "";
  const index = Math.min(saved.helpLevel, source.help.length) - 1;
  const atExample = index === source.help.length - 1;
  return `<section class="support-panel" aria-live="polite"><h3 tabindex="-1">${index === 0 ? "Thinking hint" : atExample ? "Teaching example" : "More support"}</h3><p>${source.help[index]}</p><div class="support-actions">${!atExample ? `<button class="secondary-button" type="button" data-more-help ${hasDraft || index === 0 ? "" : "disabled"}>${index === 0 ? "More support" : "Show an example"}</button>` : ""}<button class="text-button" type="button" data-close-help>Close help</button></div>${!hasDraft && index === 1 ? '<p class="choice-note">Make your own attempt before opening the example.</p>' : ""}</section>`;
}

function bindHelp(unitId, source, textarea) {
  document.querySelector("[data-open-help]")?.addEventListener("click", () => {
    setUnitState(unitId, { helpLevel: 1 });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-more-help]")?.addEventListener("click", () => {
    const saved = getUnitState(unitId);
    if ((saved.helpLevel || 1) === 2 && !textarea.value.trim()) return;
    setUnitState(unitId, { helpLevel: Math.min((saved.helpLevel || 1) + 1, source.help.length) });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-close-help]")?.addEventListener("click", () => {
    setUnitState(unitId, { helpLevel: 0 });
    render();
  });
}

function renderWritingUnit(id, unit, { introduction, draftName, label, meta, buttonLabel }) {
  const source = content[id];
  const saved = getUnitState(id);
  const draft = state.drafts[draftName] || "";
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, introduction)}<div class="activity-layout writing-layout">${taskMarkup()}<section class="writing-pane" aria-labelledby="${id}-prompt"><p class="prompt" id="${id}-prompt">${source.prompt}</p><label for="${id}-draft">${label}</label><textarea class="writing-area" id="${id}-draft" spellcheck="true">${escapeHTML(draft)}</textarea><div class="writing-meta"><span>${meta}</span><span data-word-count>${wordCount(draft)} words</span></div><div class="action-row"><button class="secondary-button" type="button" data-open-help ${saved.helpLevel ? "hidden" : ""}>Need help?</button><button class="primary-button" type="button" data-keep-writing ${draft.trim() ? "" : "disabled"}>${buttonLabel}</button></div>${helpMarkup(source, saved, Boolean(draft.trim()))}${aiFeedbackMarkup(id, source.aiFeedback, saved)}</section></div>${state.completed.includes(id) ? feedbackMarkup("This section is saved. You can still revise it before continuing.") : ""}${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const textarea = document.querySelector(`#${id}-draft`);
  textarea.addEventListener("input", () => {
    saveDraft(draftName, textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-keep-writing]").disabled = !textarea.value.trim();
    trackAIRevision(id, textarea.value);
  });
  document.querySelector("[data-keep-writing]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft(draftName, textarea.value);
    completeUnit(id);
    render();
  });
  bindHelp(id, source, textarea);
  bindAIFeedback(id, source.aiFeedback, textarea);
}

function renderJudgement(id, unit, introduction, { context = "", principle = "" } = {}) {
  const source = content[id];
  const saved = getUnitState(id);
  const options = orderedOptions(id, source.options, source.shuffle);
  const selected = source.options.find((option) => option.id === saved.choice);
  const success = Boolean(saved.checked && selected?.viable);
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, introduction)}<div class="activity-layout">${taskMarkup()}<section class="interaction-pane" aria-labelledby="${id}-prompt">${context}<form id="${id}-form"><fieldset><legend class="prompt" id="${id}-prompt">${source.prompt}</legend><div class="choice-list">${options.map((option) => choiceMarkup({ name: `${id}-choice`, option, checked: saved.choice === option.id })).join("")}</div></fieldset><div class="action-row"><button class="primary-button" type="submit" ${saved.choice ? "" : "disabled"}>Check my judgement</button>${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}</div></form>${saved.checked && selected ? feedbackMarkup(selected.feedback, success ? "success" : "reconsider") : ""}${principle ? `<blockquote class="principle-panel"><p>${principle}</p></blockquote>` : ""}</section></div>${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector(`#${id}-form`);
  form.addEventListener("change", (event) => {
    setUnitState(id, { choice: event.target.value, checked: false });
    form.querySelector('button[type="submit"]').disabled = false;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const choice = new FormData(form).get(`${id}-choice`);
    setUnitState(id, { choice, checked: true });
    if (source.options.find((option) => option.id === choice)?.viable) completeUnit(id);
    render();
    focusAfterRender(".feedback");
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => {
    setUnitState(id, { checked: false });
    render();
  });
}

function renderG0(unit) {
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "General Training Task 1 is a letter-writing task. You respond to a situation and communicate three required points to a reader.")}<blockquote class="principle-panel"><p><strong>You are not just answering three bullet points. You are writing to someone for a reason.</strong></p></blockquote><div class="framework-grid"><section><strong>WHO?</strong><p>Who is the reader, and what is your relationship?</p></section><section><strong>WHY?</strong><p>Why are you writing, and what should be clear early?</p></section><section><strong>WHAT?</strong><p>What does this reader need from you?</p></section></div><section class="authority-note"><h2>Know the task</h2><p><strong>IELTS requires:</strong> a letter responding to the situation and three bullet points, with at least 150 words. Task 2 carries twice the Writing weight of Task 1.</p><p><strong>We recommend:</strong> allowing approximately 20 minutes for Task 1 so that you protect time for Task 2.</p></section><button class="primary-button" type="button" data-start>Read the situation</button>${navigationMarkup({ canContinue: state.completed.includes("g0") })}</article>`;
  document.querySelector("[data-start]").addEventListener("click", () => { completeUnit("g0"); render(); });
}

function renderG1(unit) {
  renderJudgement("g1", unit, "Begin with the real communication situation before choosing language.");
}

function renderG2(unit) {
  const source = content.g2;
  const saved = getUnitState("g2");
  const answers = saved.answers || {};
  const allChosen = source.categories.every((category) => answers[category.id]);
  const allCorrect = source.categories.every((category) => category.options.find((option) => option.id === answers[category.id])?.viable);
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "Before you write: identify the reader, the purpose and the information that person needs.")}<div class="activity-layout">${taskMarkup()}<section class="interaction-pane"><form id="g2-form" class="scenario-analysis">${source.categories.map((category) => {
    const options = orderedOptions(`g2-${category.id}`, category.options, category.shuffle);
    const chosen = category.options.find((option) => option.id === answers[category.id]);
    return `<fieldset class="scenario-question"><legend class="prompt">${category.question}</legend><div class="choice-list">${options.map((option) => choiceMarkup({ name: category.id, option, checked: answers[category.id] === option.id })).join("")}</div>${saved.checked && chosen ? feedbackMarkup(chosen.feedback, chosen.viable ? "success" : "reconsider") : ""}</fieldset>`;
  }).join("")}<div class="action-row"><button class="primary-button" type="submit" ${allChosen ? "" : "disabled"}>Check WHO, WHY and WHAT</button>${saved.checked && !allCorrect ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}</div></form></section></div>${navigationMarkup({ canContinue: state.completed.includes("g2") })}</article>`;
  const form = document.querySelector("#g2-form");
  form.addEventListener("change", () => {
    const formData = new FormData(form);
    const next = Object.fromEntries(source.categories.map((category) => [category.id, formData.get(category.id)]));
    setUnitState("g2", { answers: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !source.categories.every((category) => next[category.id]);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const next = Object.fromEntries(source.categories.map((category) => [category.id, formData.get(category.id)]));
    setUnitState("g2", { answers: next, checked: true });
    if (source.categories.every((category) => category.options.find((option) => option.id === next[category.id])?.viable)) completeUnit("g2");
    render();
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => { setUnitState("g2", { checked: false }); render(); });
}

function renderG3(unit) {
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "WHO, WHY and WHAT helps you understand the communication. BTP helps you check your response before finishing.")}<p>BTP is our course memory tool, not official IELTS terminology.</p><div class="btp-grid"><section><strong>Bullet points</strong><p>Have I covered what the task asks me to communicate?</p></section><section><strong>Tone</strong><p>Does this sound appropriate for this reader and situation?</p></section><section><strong>Purpose</strong><p>Is it clear why I am writing?</p></section></div><button class="primary-button" type="button" data-complete-unit>Keep BTP for later</button>${navigationMarkup({ canContinue: state.completed.includes("g3") })}</article>`;
  document.querySelector("[data-complete-unit]").addEventListener("click", () => { completeUnit("g3"); render(); });
}

function renderG4(unit) {
  renderJudgement("g4", unit, "A bullet point is a communication job: it tells you what the reader needs from you.", { principle: "Give the reader enough information to understand and respond." });
}

function renderG5(unit) {
  const source = content.g5;
  const saved = getUnitState("g5");
  const answers = saved.answers || {};
  const options = orderedOptions("g5", source.options, source.shuffle);
  const labels = ["Not yet", "Enough", "More than needed"];
  const allChosen = options.every((option) => answers[option.id]);
  const correct = options.every((option) => answers[option.id] === option.label);
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "Effective development sits between merely mentioning a point and adding an unnecessary story.")}<div class="activity-layout">${taskMarkup()}<section class="interaction-pane"><form id="g5-form"><fieldset><legend class="prompt">${source.prompt}</legend><div class="development-scale">${options.map((option) => `<div class="development-option"><label for="g5-${option.id}"><strong>${option.text}</strong></label><select id="g5-${option.id}" name="${option.id}"><option value="">Choose</option>${labels.map((label) => `<option value="${label}" ${answers[option.id] === label ? "selected" : ""}>${label}</option>`).join("")}</select>${saved.checked ? `<p>${option.feedback}</p>` : ""}</div>`).join("")}</div></fieldset><div class="action-row"><button class="primary-button" type="submit" ${allChosen ? "" : "disabled"}>Check the amount of detail</button>${saved.checked && !correct ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}</div></form>${saved.checked ? feedbackMarkup(correct ? "You have distinguished mention, useful development and excessive detail." : "Use the feedback under each extract, then reconsider the amount of information.", correct ? "success" : "reconsider") : ""}<blockquote class="principle-panel"><p>Give the reader enough information to understand and respond.</p></blockquote></section></div>${navigationMarkup({ canContinue: state.completed.includes("g5") })}</article>`;
  const form = document.querySelector("#g5-form");
  form.addEventListener("change", () => {
    const formData = new FormData(form);
    const next = Object.fromEntries(options.map((option) => [option.id, formData.get(option.id)]));
    setUnitState("g5", { answers: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !options.every((option) => next[option.id]);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const next = Object.fromEntries(options.map((option) => [option.id, formData.get(option.id)]));
    setUnitState("g5", { answers: next, checked: true });
    if (options.every((option) => next[option.id] === option.label)) completeUnit("g5");
    render();
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => { setUnitState("g5", { checked: false }); render(); });
}

function renderG6(unit) {
  const source = content.g6;
  const saved = getUnitState("g6");
  const activeId = saved.activeId || source.relationships[0].id;
  const viewed = [...new Set([...(saved.viewed || []), activeId])];
  const active = source.relationships.find((item) => item.id === activeId);
  if (!saved.activeId || viewed.length !== (saved.viewed || []).length) setUnitState("g6", { activeId, viewed });
  if (viewed.length === source.relationships.length) completeUnit("g6");
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "Tone is not a formal/informal switch. It changes with the relationship, purpose and situation.")}<p class="prompt">Would you speak to all of these people in exactly the same way?</p><div class="tone-contexts" role="group" aria-label="Explore tone by relationship">${source.relationships.map((item) => `<button type="button" data-tone-context="${item.id}" aria-pressed="${item.id === activeId}"><strong>${item.label}</strong>${item.id === activeId ? `<span>${item.guidance}</span>` : ""}</button>`).join("")}</div><blockquote class="principle-panel"><p><strong>${active.label}:</strong> ${active.guidance}</p></blockquote><p class="choice-note">${viewed.length} of ${source.relationships.length} relationships considered.</p>${navigationMarkup({ canContinue: state.completed.includes("g6") })}</article>`;
  document.querySelectorAll("[data-tone-context]").forEach((button) => button.addEventListener("click", () => { setUnitState("g6", { activeId: button.dataset.toneContext, viewed: [...new Set([...viewed, button.dataset.toneContext])] }); render(); }));
}

function renderG7(unit) { renderJudgement("g7", unit, "Appropriate tone is the language that fits this relationship and purpose—not the sentence with the most formal vocabulary."); }
function renderG8(unit) { renderJudgement("g8", unit, "The opening has a communicative job: help the reader understand why you are writing.", { principle: "Make the purpose clear early. No single opening formula is compulsory." }); }
function renderG9(unit) { renderWritingUnit("g9", unit, { introduction: "Write before opening support. The task remains visible while you work.", draftName: "opening", label: "Your opening", meta: "One or two purposeful sentences are enough.", buttonLabel: "Keep this opening" }); }
function renderG10(unit) { renderJudgement("g10", unit, "Organise paragraphs around useful communicative jobs. More than one sensible organisation can work."); }
function renderG11(unit) { renderJudgement("g11", unit, "Mentioning a bullet point is not the same as developing it sufficiently for the reader.", { principle: "Relevant specifics help. Invented drama and unnecessary storytelling do not." }); }

function renderG12(unit) {
  const source = content.g12;
  const saved = getUnitState("g12");
  const activeId = saved.activeId || source.stages[0].id;
  const viewed = [...new Set([...(saved.viewed || []), activeId])];
  const active = source.stages.find((stage) => stage.id === activeId);
  if (!saved.activeId || viewed.length !== (saved.viewed || []).length) setUnitState("g12", { activeId, viewed });
  if (viewed.length === source.stages.length) completeUnit("g12");
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "Adapt the existing paragraph architecture to communication: every part should help the reader.")}<div class="stage-inspector" role="group" aria-label="Paragraph architecture">${source.stages.map((stage) => `<button type="button" data-paragraph-stage="${stage.id}" aria-pressed="${stage.id === activeId}"><strong>${stage.label}</strong></button>`).join("")}</div><section class="model-panel"><h2>${active.label}</h2><p class="prompt">${active.question}</p><p class="language-example">${active.example}</p></section><blockquote class="principle-panel"><p>Close the idea. Do not keep adding information because you think the paragraph needs another sentence.</p></blockquote>${navigationMarkup({ canContinue: state.completed.includes("g12") })}</article>`;
  document.querySelectorAll("[data-paragraph-stage]").forEach((button) => button.addEventListener("click", () => { setUnitState("g12", { activeId: button.dataset.paragraphStage, viewed: [...new Set([...viewed, button.dataset.paragraphStage])] }); render(); }));
}

function renderG13(unit) { renderWritingUnit("g13", unit, { introduction: "The preparation is complete. Write a substantial body paragraph without beginning with sentence-choice support.", draftName: "body", label: "Your body paragraph", meta: "Focus on one useful communicative job.", buttonLabel: "Keep this paragraph" }); }
function renderG14(unit) {
  const source = content.g14;
  const saved = getUnitState("g14");
  const options = orderedOptions("g14", source.options, source.shuffle);
  const selected = source.options.find((option) => option.id === saved.choice);
  const success = Boolean(saved.checked && selected?.viable);
  const signoffs = `<section class="signoff-list"><h2>A few dependable choices</h2>${source.signOffs.map((item) => `<div><strong>${item.text}</strong><span>${item.fit}</span></div>`).join("")}</section>`;
  renderJudgement("g14", unit, "Finish the practical message before choosing how to sign off.", { context: saved.checked ? signoffs : "", principle: "Close the communication. Don’t just stop writing." });
}
function renderG15(unit) { renderWritingUnit("g15", unit, { introduction: "Complete the practical communication, then end the letter in a way that fits the relationship.", draftName: "closing", label: "Your closing and sign-off", meta: "Content closing and sign-off perform different jobs.", buttonLabel: "Keep this closing" }); }

function assembledDraft() {
  const opening = state.drafts.opening || "";
  const greeting = /^dear\b/i.test(opening.trim()) ? "" : "Dear Property Manager,";
  return [greeting, opening, state.drafts.body, state.drafts.closing].filter((part) => part.trim()).join("\n\n");
}

function renderFullWorkspace(id, unit, { introduction, prompt, feedback, actionLabel, canComplete = () => true, finish = false, extra = "" }) {
  const saved = getUnitState(id);
  const draft = state.drafts.fullLetter || "";
  const count = wordCount(draft);
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, introduction)}<div class="activity-layout writing-layout">${taskMarkup()}<section class="writing-pane" aria-labelledby="${id}-prompt"><p class="prompt" id="${id}-prompt">${prompt}</p>${id === "g16" ? `<div class="assemble-panel"><p>Your saved opening, body and closing remain separate until you choose to bring them together.</p><button class="secondary-button" type="button" data-assemble ${draft.trim() ? "" : ""}>Bring my sections together</button></div>` : ""}<label for="${id}-draft">Your complete letter</label><textarea class="writing-area full-letter-area" id="${id}-draft" spellcheck="true">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${count} words</span><span data-word-requirement>${wordRequirementMessage(count)}</span></div>${extra}${feedback ? aiFeedbackMarkup(id, feedback, saved) : ""}<div class="action-row"><button class="primary-button" type="button" data-save-full ${draft.trim() && canComplete(draft) ? "" : "disabled"}>${actionLabel}</button></div></section></div>${navigationMarkup({ canContinue: state.completed.includes(id), finish })}</article>`;
  const textarea = document.querySelector(`#${id}-draft`);
  textarea.addEventListener("input", () => {
    saveDraft("fullLetter", textarea.value);
    const nextCount = wordCount(textarea.value);
    document.querySelector("[data-word-count]").textContent = `${nextCount} words`;
    document.querySelector("[data-word-requirement]").textContent = wordRequirementMessage(nextCount);
    document.querySelector("[data-save-full]").disabled = !(textarea.value.trim() && canComplete(textarea.value));
    trackAIRevision(id, textarea.value);
  });
  document.querySelector("[data-assemble]")?.addEventListener("click", () => {
    const combined = assembledDraft();
    if (textarea.value.trim() && textarea.value !== combined && !window.confirm("Replace the current complete-letter draft with your saved sections?")) return;
    textarea.value = combined;
    saveDraft("fullLetter", combined);
    const combinedCount = wordCount(combined);
    document.querySelector("[data-word-count]").textContent = `${combinedCount} words`;
    document.querySelector("[data-word-requirement]").textContent = wordRequirementMessage(combinedCount);
    document.querySelector("[data-save-full]").disabled = !combined.trim();
  });
  document.querySelector("[data-save-full]").addEventListener("click", () => {
    if (!textarea.value.trim() || !canComplete(textarea.value)) return;
    saveDraft("fullLetter", textarea.value);
    completeUnit(id);
    render();
  });
  if (feedback) bindAIFeedback(id, feedback, textarea);
}

function renderG16(unit) {
  renderFullWorkspace("g16", unit, { introduction: "Bring your earlier work into one letter, then edit it as a complete communication. You decide what enters the final text.", prompt: "Build and edit your complete response.", actionLabel: "Keep this complete draft" });
}

function btpSummary() {
  const answers = getUnitState("g17").answers || {};
  return content.g17.checks.map((check) => `${check.label}: ${answers[check.id] || "Not checked"}`).join("\n");
}

function renderG17(unit) {
  const source = content.g17;
  const saved = getUnitState("g17");
  const answers = saved.answers || {};
  const complete = source.checks.every((check) => answers[check.id]);
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "BTP is an active self-check, not a score. Use uncertainty to choose where to revise.")}<div class="activity-layout">${taskMarkup()}<section class="interaction-pane"><form id="g17-form" class="btp-check-form">${source.checks.map((check) => `<div class="btp-check-row"><fieldset><legend><strong>${check.label}</strong><span>${check.question}</span></legend>${source.statuses.map((status) => `<label class="status-choice"><input type="radio" name="${check.id}" value="${status}" ${answers[check.id] === status ? "checked" : ""}/><span>${status}</span></label>`).join("")}</fieldset></div>`).join("")}<button class="primary-button" type="submit" ${complete ? "" : "disabled"}>Save my BTP check</button></form>${saved.checked ? feedbackMarkup(Object.values(answers).some((value) => value !== "Yes") ? "Your check has identified at least one useful revision target. Carry it into the next stage." : "Your self-check suggests the main communication is in place. AI feedback remains optional; do not invent changes without a reason.") : ""}</section></div>${navigationMarkup({ canContinue: state.completed.includes("g17") })}</article>`;
  const form = document.querySelector("#g17-form");
  form.addEventListener("change", () => {
    const formData = new FormData(form);
    const next = Object.fromEntries(source.checks.map((check) => [check.id, formData.get(check.id)]));
    setUnitState("g17", { answers: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !source.checks.every((check) => next[check.id]);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const next = Object.fromEntries(source.checks.map((check) => [check.id, formData.get(check.id)]));
    setUnitState("g17", { answers: next, checked: true });
    completeUnit("g17");
    render();
  });
}

function renderG18(unit) {
  const feedback = { ...content.g18.aiFeedback, additionalContext: `BTP is our course checking tool. The learner recorded:\n${btpSummary()}` };
  renderFullWorkspace("g18", unit, { introduction: "Optional AI feedback should diagnose the response and return you to your own writing—not produce a replacement letter.", prompt: "Read any feedback, then improve your own letter here.", feedback, actionLabel: "Keep this revision" });
}

function teachingLetterMarkup() {
  const model = content.scenario.teachingExample;
  return `<div class="teaching-letter"><p>${model.greeting}</p>${model.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}<p>${model.signOff}</p></div>`;
}

function renderG19(unit) {
  const source = content.g19;
  const saved = getUnitState("g19");
  const activeId = saved.activeId || source.lenses[0].id;
  const viewed = [...new Set([...(saved.viewed || []), activeId])];
  const lens = source.lenses.find((item) => item.id === activeId);
  if (!saved.activeId || viewed.length !== (saved.viewed || []).length) setUnitState("g19", { activeId, viewed });
  if (viewed.length === source.lenses.length) completeUnit("g19");
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "This is an original teaching example, not an official model or band-scored response. Investigate its decisions instead of copying it.")}<div class="lens-grid" role="group" aria-label="Teaching-example lenses">${source.lenses.map((item) => `<button type="button" data-lens="${item.id}" aria-pressed="${item.id === activeId}"><strong>${item.label}</strong></button>`).join("")}</div><div class="activity-layout"><section>${teachingLetterMarkup()}</section><aside class="lens-note" aria-live="polite"><h2 tabindex="-1">${lens.label}</h2><p>${lens.note}</p></aside></div><p class="choice-note">${viewed.length} of ${source.lenses.length} lenses investigated.</p>${navigationMarkup({ canContinue: state.completed.includes("g19") })}</article>`;
  document.querySelectorAll("[data-lens]").forEach((button) => button.addEventListener("click", () => { setUnitState("g19", { activeId: button.dataset.lens, viewed: [...new Set([...viewed, button.dataset.lens])] }); render(); focusAfterRender(".lens-note h2"); }));
}

function renderG20(unit) {
  renderJudgement("g20", unit, "A nearly-good response can contain accurate language while still giving the reader too little useful information.", { context: `<blockquote class="nearly-good-extract"><p>${content.g20.extract}</p></blockquote>` });
}

function renderG21(unit) {
  const source = content.g21;
  const saved = getUnitState("g21");
  const draft = state.drafts.fullLetter || "";
  const count = wordCount(draft);
  const finished = state.completed.includes("g21");
  app.innerHTML = `<article aria-labelledby="unit-title">${unitHeader(unit, "Return to the same letter for one final, purposeful revision. Change only what has a clear reason.")}<div class="activity-layout writing-layout">${taskMarkup()}<section class="writing-pane"><p class="prompt">Use your diagnosis to improve your own letter.</p><label for="g21-draft">Your final letter</label><textarea class="writing-area full-letter-area" id="g21-draft" spellcheck="true">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${count} words</span><span data-word-requirement>${wordRequirementMessage(count)}</span></div><fieldset class="final-reflection-grid"><legend>What did you change? <span class="field-note">Optional and not scored.</span></legend>${source.reflectionOptions.map((option) => `<label class="choice"><input type="checkbox" name="final-reflection" value="${option}" ${(saved.reflection || []).includes(option) ? "checked" : ""}/><span>${option}</span></label>`).join("")}</fieldset><div class="action-row"><button class="primary-button" type="button" data-finish ${draft.trim() && !finished ? "" : "disabled"}>${finished ? "Core workshop complete" : "Complete core workshop"}</button></div></section></div>${finished ? `<div class="completion-note"><h2 tabindex="-1">General Training Task 1 core complete</h2><p>You analysed the communication, wrote each part, built a full letter, checked it with BTP, diagnosed it and revised your own response.</p></div><section class="future-practice-foundation"><p class="eyebrow">Future more practice</p><h2>Same principles, different communication</h2><p>The reusable scenario structure is ready for later practice with different readers, purposes and tones. No additional routes are presented as required core work yet.</p><ul class="future-relationships">${content.futureScenarioRelationships.map((relationship) => `<li>${relationship}</li>`).join("")}</ul></section>` : ""}${navigationMarkup({ canContinue: finished, finish: false })}</article>`;
  const textarea = document.querySelector("#g21-draft");
  textarea.addEventListener("input", () => {
    saveDraft("fullLetter", textarea.value);
    const nextCount = wordCount(textarea.value);
    document.querySelector("[data-word-count]").textContent = `${nextCount} words`;
    document.querySelector("[data-word-requirement]").textContent = wordRequirementMessage(nextCount);
    document.querySelector("[data-finish]").disabled = !textarea.value.trim() || finished;
  });
  document.querySelectorAll('input[name="final-reflection"]').forEach((input) => input.addEventListener("change", () => {
    const reflection = [...document.querySelectorAll('input[name="final-reflection"]:checked')].map((item) => item.value);
    setUnitState("g21", { reflection });
  }));
  document.querySelector("[data-finish]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft("fullLetter", textarea.value);
    completeUnit("g21");
    render();
    focusAfterRender(".completion-note h2");
  });
}

function render({ focus = false } = {}) {
  const unit = content.units.find((item) => item.id === state.currentUnit) || content.units[0];
  state.currentUnit = unit.id;
  renderProgress();
  const renderers = { g0: renderG0, g1: renderG1, g2: renderG2, g3: renderG3, g4: renderG4, g5: renderG5, g6: renderG6, g7: renderG7, g8: renderG8, g9: renderG9, g10: renderG10, g11: renderG11, g12: renderG12, g13: renderG13, g14: renderG14, g15: renderG15, g16: renderG16, g17: renderG17, g18: renderG18, g19: renderG19, g20: renderG20, g21: renderG21 };
  renderers[unit.id](unit);
  bindNavigation();
  if (focus) {
    document.querySelector("#unit-title")?.setAttribute("tabindex", "-1");
    document.querySelector("#unit-title")?.focus({ preventScroll: true });
    document.querySelector("#learning-unit")?.scrollIntoView({ block: "start" });
  }
}

resetButton.addEventListener("click", () => {
  const hasWriting = Object.values(state.drafts).some((value) => typeof value === "string" && value.trim());
  if (!window.confirm(hasWriting ? "Reset this workshop? Your saved letter writing and progress will be erased from this device." : "Reset this workshop progress?")) return;
  state = clearGeneralState();
  history.replaceState({ unit: "g0" }, "", "#g0");
  render({ focus: true });
});

window.addEventListener("popstate", () => {
  const requested = window.location.hash.slice(1);
  if (unitIndex(requested) >= 0 && canVisit(unitIndex(requested))) {
    state.currentUnit = requested;
    saveGeneralState(state);
    render({ focus: true });
  }
});

const requestedUnit = window.location.hash.slice(1);
if (unitIndex(requestedUnit) >= 0 && canVisit(unitIndex(requestedUnit))) state.currentUnit = requestedUnit;
history.replaceState({ unit: state.currentUnit }, "", `#${state.currentUnit}`);
render();
