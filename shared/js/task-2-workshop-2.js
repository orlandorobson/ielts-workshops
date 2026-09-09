import { task2Content as workshop1Content } from "../../content/writing/task-2.js?v=workshop-1";
import { task2Workshop2Content as content } from "../../content/writing/task-2-workshop-2.js?v=1";
import { buildTask2AIFeedbackPrompt, copyText } from "./ai-feedback.js";
import { isValidStoredOrder, shuffleOptionIds } from "./randomise.js";
import { loadTask2State } from "./task-2-storage.js";
import { clearWorkshop2State, loadWorkshop2State, saveWorkshop2State } from "./task-2-workshop-2-storage.js";

const app = document.querySelector("#app");
const progress = document.querySelector("#unit-progress");
const currentStage = document.querySelector("#current-stage");
const resetButton = document.querySelector("#reset-progress");
let state = loadWorkshop2State();

const escapeHTML = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const unitIndex = (id) => content.units.findIndex((unit) => unit.id === id);
const getUnitState = (id) => state.units[id] || {};
const hasText = (value) => Boolean(String(value || "").trim());
const wordCount = (value) => hasText(value) ? value.trim().split(/\s+/).length : 0;

function setUnitState(id, patch) {
  state.units[id] = { ...getUnitState(id), ...patch };
  saveWorkshop2State(state);
}

function completeUnit(id, patch = {}) {
  setUnitState(id, { ...patch, engaged: true });
  if (!state.completed.includes(id)) state.completed.push(id);
  saveWorkshop2State(state);
}

function saveDraft(name, value) {
  state.drafts[name] = value;
  saveWorkshop2State(state);
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

function initialiseSource() {
  if (state.source) return;
  const workshop1 = loadTask2State();
  const plan = workshop1.drafts?.workshop1Plan || {};
  const introduction = workshop1.drafts?.workshop1Introduction || "";
  const hasWorkshop1Work = [plan.position, plan.body1, plan.body2, introduction].some(hasText);
  state.source = hasWorkshop1Work
    ? {
        kind: "workshop1",
        question: workshop1Content.workshop1.own.question,
        position: plan.position || "",
        introduction,
        body1: plan.body1 || "",
        body2: plan.body2 || "",
        capturedAt: new Date().toISOString(),
      }
    : { kind: "fallback", capturedAt: new Date().toISOString() };
  saveWorkshop2State(state);
}

function sourceWork() {
  return state.source?.kind === "workshop1" ? state.source : state.drafts.fallback;
}

function canVisit(index) {
  const completedIndexes = state.completed.map(unitIndex).filter((value) => value >= 0);
  const furthest = completedIndexes.length ? Math.max(...completedIndexes) + 1 : 0;
  return index >= 0 && index <= Math.min(furthest, content.units.length - 1);
}

function unitHeader(unit, introduction) {
  return `<header class="unit-header" data-section="${unit.section}">
    <p class="eyebrow">${unit.eyebrow}</p>
    <h1 id="unit-title" tabindex="-1">${unit.label}</h1>
    <p class="lead">${introduction}</p>
  </header>`;
}

function questionMarkup(question, label = "Writing Task 2 question") {
  return `<section class="question-panel" aria-label="${label}">
    <p class="question-label">${label}</p>
    <blockquote><p>${escapeHTML(question)}</p></blockquote>
  </section>`;
}

function feedbackMarkup(message, kind = "success") {
  return `<div class="feedback" data-kind="${kind}" role="status" aria-live="polite" tabindex="-1"><p>${message}</p></div>`;
}

function choiceMarkup(option, name, checked = false) {
  return `<label class="choice"><input type="radio" name="${name}" value="${option.id}" ${checked ? "checked" : ""}/><span>${option.text}</span></label>`;
}

function navigationMarkup({ canContinue = false, hideNext = false } = {}) {
  const index = unitIndex(state.currentUnit);
  const previous = content.units[index - 1];
  const next = content.units[index + 1];
  return `<nav class="unit-navigation" aria-label="Learning-unit navigation">
    ${previous ? `<button class="secondary-button" type="button" data-nav="${previous.id}">Back</button>` : "<span></span>"}
    ${next && !hideNext ? `<button class="primary-button" type="button" data-nav="${next.id}" ${canContinue ? "" : "disabled"}>Continue</button>` : ""}
  </nav>`;
}

function sourceSummaryMarkup({ includeWriting = false } = {}) {
  const source = sourceWork();
  const label = state.source?.kind === "workshop1" ? "Your saved Workshop 1 work" : "Your saved work";
  return `<section class="source-summary" aria-label="${label}">
    <h2>Your work</h2>
    <dl>
      <div class="full-width"><dt>Question</dt><dd>${escapeHTML(source.question || "")}</dd></div>
      <div><dt>My answer / position</dt><dd>${escapeHTML(source.position || "Not added yet")}</dd></div>
      <div><dt>Paragraph 1 idea</dt><dd>${escapeHTML(source.body1 || "Not added yet")}</dd></div>
      <div><dt>Paragraph 2 idea</dt><dd>${escapeHTML(source.body2 || "Not added yet")}</dd></div>
      ${source.introduction ? `<div class="full-width"><dt>My introduction</dt><dd>${escapeHTML(source.introduction)}</dd></div>` : ""}
      ${includeWriting && state.drafts.paragraph1 ? `<div class="full-width"><dt>My Paragraph 1</dt><dd>${escapeHTML(state.drafts.paragraph1)}</dd></div>` : ""}
      ${includeWriting && state.drafts.paragraph2 ? `<div class="full-width"><dt>My Paragraph 2</dt><dd>${escapeHTML(state.drafts.paragraph2)}</dd></div>` : ""}
    </dl>
  </section>`;
}

function helpMarkup(id, items) {
  const level = getUnitState(id).helpLevel || 0;
  const buttonLabels = ["Need help?", "More help", "Show language support", "Show an example"];
  const headings = ["", "Need help?", "More help", "Useful words", "Example"];
  return `<section class="support-panel" aria-label="Optional help">
    ${level < items.length ? `<button class="secondary-button" type="button" data-help-next>${buttonLabels[level]}</button>` : ""}
    ${level ? `<div class="support-content"><h3>${headings[level]}</h3><p>${escapeHTML(items[level - 1])}</p></div>` : ""}
  </section>`;
}

function bindHelp(id) {
  document.querySelector("[data-help-next]")?.addEventListener("click", () => {
    setUnitState(id, { helpLevel: (getUnitState(id).helpLevel || 0) + 1 });
    render();
  });
}

function renderProgress() {
  const current = content.units.find((unit) => unit.id === state.currentUnit);
  document.body.dataset.phase = current?.phase || "build";
  progress.replaceChildren();
  content.sections.forEach((section) => {
    const units = content.units.filter((unit) => unit.section === section.id);
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "progress-button";
    button.dataset.complete = String(units.every((unit) => state.completed.includes(unit.id)));
    button.disabled = !canVisit(unitIndex(units[0].id));
    button.textContent = section.shortLabel;
    button.setAttribute("aria-label", section.label);
    if (current?.section === section.id) button.setAttribute("aria-current", "step");
    button.addEventListener("click", () => navigateTo(units[0].id));
    item.append(button);
    progress.append(item);
  });
  currentStage.textContent = `${current?.label || "Workshop"} · Stage ${unitIndex(state.currentUnit) + 1} of ${content.units.length}`;
}

function bindNavigation() {
  document.querySelectorAll("[data-nav]").forEach((button) => button.addEventListener("click", () => navigateTo(button.dataset.nav)));
}

function navigateTo(id, { focus = true } = {}) {
  const index = unitIndex(id);
  if (!canVisit(index)) return;
  state.currentUnit = id;
  saveWorkshop2State(state);
  if (window.location.hash !== `#${id}`) history.pushState({ unit: id }, "", `#${id}`);
  render({ focus });
}

function renderY1(unit) {
  const id = unit.id;
  const saved = getUnitState(id);
  const notes = orderedOptions("y1-notes", content.yusuf.notes);
  const assignments = saved.assignments || {};
  const ready = content.yusuf.notes.every((note) => assignments[note.id]);
  const preferredCount = content.yusuf.notes.filter((note) => assignments[note.id] === note.preferredGroup).length;
  app.innerHTML = `<article>${unitHeader(unit, "Yusuf has some good ideas. How do they fit together?")}
    ${questionMarkup(content.yusuf.question, "Yusuf's question")}
    <p class="strategy-note"><strong>Yusuf's answer:</strong> ${content.yusuf.position}</p>
    <form id="y1-form"><div class="idea-grouping">${notes.map((note) => `<label class="note-card"><span>${note.text}</span><select name="${note.id}"><option value="">Choose a group</option>${content.yusuf.groups.map((group) => `<option value="${group.id}" ${assignments[note.id] === group.id ? "selected" : ""}>${group.label}</option>`).join("")}</select></label>`).join("")}</div>
      <button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Compare with Yusuf</button>
    </form>
    ${saved.checked ? `<section class="comparison-panel"><p class="eyebrow">Yusuf's organisation</p><div class="student-plan">${content.yusuf.groups.map((group) => `<section><h2>${group.label}</h2>${content.yusuf.notes.filter((note) => note.preferredGroup === group.id).map((note) => `<p>${note.text}</p>`).join("")}</section>`).join("")}</div><p>${preferredCount === content.yusuf.notes.length ? "Your groups match Yusuf's." : "Your groups are not exactly the same as Yusuf's. That can be reasonable if each paragraph has one clear purpose."}</p></section>` : ""}
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#y1-form");
  form.addEventListener("change", () => {
    const data = new FormData(form);
    const next = Object.fromEntries(content.yusuf.notes.map((note) => [note.id, data.get(note.id)]));
    setUnitState(id, { assignments: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !content.yusuf.notes.every((note) => next[note.id]);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const next = Object.fromEntries(content.yusuf.notes.map((note) => [note.id, data.get(note.id)]));
    completeUnit(id, { assignments: next, checked: true });
    render();
  });
}

function topicResponse(saved) {
  return saved.supportMode === "most" ? saved.topicChoice || "" : saved.topicSentence || "";
}

function renderY2(unit) {
  const id = unit.id;
  const saved = { supportMode: "independent", ...getUnitState(id) };
  const bigIdeas = orderedOptions("y2-big-ideas", content.yusuf.bigIdeas);
  const topicChoices = orderedOptions("y2-topic-choices", content.yusuf.topicSentences);
  const selectedBigIdea = content.yusuf.bigIdeas.find((item) => item.id === saved.bigIdea);
  const selectedTopic = content.yusuf.topicSentences.find((item) => item.id === saved.topicChoice);
  const ready = Boolean(saved.bigIdea && hasText(topicResponse(saved)));
  app.innerHTML = `<article>${unitHeader(unit, "Take Yusuf's first group. Help him tell the reader what the paragraph is about.")}
    ${questionMarkup(content.yusuf.question, "Yusuf's question")}
    <section class="note-cluster"><h2>Access to exercise</h2>${content.yusuf.notes.filter((note) => note.preferredGroup === "access").map((note) => `<p>${note.text}</p>`).join("")}</section>
    <fieldset><legend class="prompt">What is the big idea?</legend><div class="choice-list">${bigIdeas.map((option) => choiceMarkup(option, "big-idea", saved.bigIdea === option.id)).join("")}</div></fieldset>
    <section class="supported-writing"><h2>Yusuf needs one sentence that gives the reader the big idea. Can you help him?</h2><p class="choice-note">Support is optional. Choose the amount that helps you.</p>
      <div class="support-choices" role="group" aria-label="Choose support level">
        <button type="button" data-support="independent" aria-pressed="${saved.supportMode === "independent"}">Independent</button>
        <button type="button" data-support="some" aria-pressed="${saved.supportMode === "some"}">Some help</button>
        <button type="button" data-support="most" aria-pressed="${saved.supportMode === "most"}">Most help</button>
      </div>
      ${saved.supportMode === "most" ? `<div class="support-content"><p><strong>Look again:</strong> What do these ideas have in common?</p><p><strong>Narrow it:</strong> What do they tell us about access to exercise?</p></div><fieldset><legend>Choose one possible start.</legend><div class="choice-list">${topicChoices.map((option) => choiceMarkup(option, "topic-choice", saved.topicChoice === option.id)).join("")}</div></fieldset>` : `${saved.supportMode === "some" ? `<div class="support-content"><p><strong>Look again:</strong> What do these ideas have in common?</p><p><strong>Narrow it:</strong> What do they tell us about access to exercise?</p></div><div class="word-bank">${content.yusuf.usefulWords.map((word) => `<span>${word}</span>`).join("")}</div>` : ""}<label for="topic-sentence"><strong>Your sentence</strong></label><textarea class="writing-area compact-area" id="topic-sentence">${escapeHTML(saved.topicSentence || "")}</textarea>`}
      <button class="primary-button" type="button" data-compare ${ready ? "" : "disabled"}>Compare</button>
    </section>
    ${saved.checked ? `<section class="comparison-panel"><p>${escapeHTML(selectedBigIdea?.note || "Yusuf needs one clear point for this paragraph.")}</p><p>${escapeHTML(selectedTopic?.note || "Your sentence gives Yusuf a possible way to start. Compare it with the ideas above and check that the connection is clear.")}</p><blockquote class="principle-panel"><p><strong>We often call this a topic sentence.</strong> It helps the reader understand the main idea of the paragraph.</p><p>A topic sentence is not a separate IELTS requirement. It is a useful way to make your paragraph clear and organised.</p></blockquote></section>` : ""}
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll('input[name="big-idea"]').forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { bigIdea: input.value, checked: false });
    render();
  }));
  document.querySelectorAll("[data-support]").forEach((button) => button.addEventListener("click", () => {
    setUnitState(id, { supportMode: button.dataset.support, checked: false });
    render();
  }));
  document.querySelectorAll('input[name="topic-choice"]').forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { topicChoice: input.value, checked: false });
    render();
  }));
  const textarea = document.querySelector("#topic-sentence");
  textarea?.addEventListener("input", () => {
    setUnitState(id, { topicSentence: textarea.value, checked: false });
    document.querySelector("[data-compare]").disabled = !(getUnitState(id).bigIdea && hasText(textarea.value));
  });
  document.querySelector("[data-compare]")?.addEventListener("click", () => {
    const current = { supportMode: "independent", ...getUnitState(id) };
    if (!current.bigIdea || !hasText(topicResponse(current))) return;
    completeUnit(id, { checked: true });
    render();
  });
}

function renderY3(unit) {
  const id = unit.id;
  const saved = getUnitState(id);
  const reactions = orderedOptions("y3-reactions", content.yusuf.argumentReactions);
  const explanations = orderedOptions("y3-explanations", content.yusuf.explanations);
  const exampleReactions = orderedOptions("y3-example-reactions", content.yusuf.exampleReactions);
  const topicState = getUnitState("y2");
  const selectedTopic = content.yusuf.topicSentences.find((item) => item.id === topicState.topicChoice);
  const topicSentence = topicState.supportMode === "most" ? selectedTopic?.text : topicState.topicSentence;
  const reaction = content.yusuf.argumentReactions.find((item) => item.id === saved.argumentReaction);
  const explanation = content.yusuf.explanations.find((item) => item.id === saved.explanation);
  const exampleReaction = content.yusuf.exampleReactions.find((item) => item.id === saved.exampleReaction);
  app.innerHTML = `<article>${unitHeader(unit, "Stay with the same paragraph. Help Yusuf explain his idea and decide whether support would help.")}
    <section class="writing-sample"><h2>Yusuf's start</h2><p>${escapeHTML(topicSentence || content.yusuf.topicSentences[0].text)}</p><p>${escapeHTML(content.yusuf.incomplete.split(". ").slice(1).join(". "))}</p></section>
    <section class="step-panel"><fieldset><legend class="prompt">Do we understand Yusuf's whole argument yet?</legend><div class="choice-list">${reactions.map((option) => choiceMarkup(option, "argument-reaction", saved.argumentReaction === option.id)).join("")}</div></fieldset><button class="primary-button" type="button" data-check-argument ${saved.argumentReaction ? "" : "disabled"}>Check</button>${saved.argumentChecked && reaction ? feedbackMarkup(reaction.note, reaction.id === "enough" ? "reconsider" : "success") : ""}</section>
    ${saved.argumentChecked ? `<section class="step-panel"><fieldset><legend class="prompt">Which sentence would help Yusuf explain the connection?</legend><div class="choice-list">${explanations.map((option) => choiceMarkup(option, "explanation", saved.explanation === option.id)).join("")}</div></fieldset><button class="primary-button" type="button" data-check-explanation ${saved.explanation ? "" : "disabled"}>Check</button>${saved.explanationChecked && explanation ? feedbackMarkup(explanation.note, explanation.id === "cost-link" ? "success" : "reconsider") : ""}</section>` : ""}
    ${saved.explanationChecked ? `<section class="step-panel"><div class="writing-sample"><h2>One possible example</h2><p>${content.yusuf.example}</p></div><fieldset><legend class="prompt">What do you think about this example?</legend><div class="choice-list">${exampleReactions.map((option) => choiceMarkup(option, "example-reaction", saved.exampleReaction === option.id)).join("")}</div></fieldset><button class="primary-button" type="button" data-check-example ${saved.exampleReaction ? "" : "disabled"}>Keep my answer</button>${saved.exampleChecked && exampleReaction ? feedbackMarkup(exampleReaction.note) : ""}</section>` : ""}
    ${saved.exampleChecked ? `<section class="comparison-panel"><p class="eyebrow">Yusuf's completed paragraph</p><div class="essay-copy"><p>${content.yusuf.completedParagraph}</p></div><p>You helped Yusuf move from notes to a clear paragraph. His example supports the explanation, but the paragraph does not depend on having an example.</p></section>` : ""}
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  document.querySelectorAll('input[name="argument-reaction"]').forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { argumentReaction: input.value, argumentChecked: false });
    render();
  }));
  document.querySelector("[data-check-argument]")?.addEventListener("click", () => { setUnitState(id, { argumentChecked: true }); render(); });
  document.querySelectorAll('input[name="explanation"]').forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { explanation: input.value, explanationChecked: false });
    render();
  }));
  document.querySelector("[data-check-explanation]")?.addEventListener("click", () => { setUnitState(id, { explanationChecked: true }); render(); });
  document.querySelectorAll('input[name="example-reaction"]').forEach((input) => input.addEventListener("change", () => {
    setUnitState(id, { exampleReaction: input.value, exampleChecked: false });
    render();
  }));
  document.querySelector("[data-check-example]")?.addEventListener("click", () => {
    completeUnit(id, { exampleChecked: true });
    render();
  });
}

function renderS1(unit) {
  const id = unit.id;
  const saved = getUnitState(id);
  app.innerHTML = `<article>${unitHeader(unit, "Shaima has a clear main idea and a useful example. Help her connect them.")}
    ${questionMarkup(content.shaima.question, "Shaima's question")}
    <div class="connection-sequence"><section><strong>Main idea</strong><p>${content.shaima.mainIdea}</p></section><span aria-hidden="true">→</span><section class="missing-link"><strong>What is missing?</strong><p>How does removing university cost create opportunity?</p></section><span aria-hidden="true">→</span><section><strong>Shaima's example</strong><p>${content.shaima.example}</p></section></div>
    <section class="compact-writing"><label for="shaima-connection" class="prompt">How can Shaima connect her main idea to her example?</label><textarea class="writing-area" id="shaima-connection">${escapeHTML(saved.response || "")}</textarea><button class="primary-button" type="button" data-save ${hasText(saved.response) ? "" : "disabled"}>Compare</button></section>
    ${helpMarkup(id, content.shaima.help)}
    ${saved.saved ? `<section class="comparison-panel"><p class="eyebrow">One possible connection</p><div class="essay-copy"><p>${content.shaima.comparison}</p></div><p>Your wording can be different. The important job is to help the reader follow the connection before the example.</p></section>` : ""}
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const textarea = document.querySelector("#shaima-connection");
  textarea.addEventListener("input", () => {
    setUnitState(id, { response: textarea.value, saved: false });
    document.querySelector("[data-save]").disabled = !hasText(textarea.value);
  });
  document.querySelector("[data-save]").addEventListener("click", () => {
    if (!hasText(textarea.value)) return;
    completeUnit(id, { response: textarea.value, saved: true });
    render();
  });
  bindHelp(id);
}

function fallbackFieldsMarkup(fallback) {
  return `<section class="fallback-panel"><h2>We can't find your plan from the last workshop. That's OK. Add a short plan here.</h2><div class="plan-form">
    <label class="plan-field full-width"><strong>Question</strong><textarea name="question">${escapeHTML(fallback.question)}</textarea></label>
    <label class="plan-field full-width"><strong>My answer / position</strong><textarea name="position">${escapeHTML(fallback.position)}</textarea></label>
    <label class="plan-field"><strong>Paragraph 1 idea</strong><textarea name="body1">${escapeHTML(fallback.body1)}</textarea></label>
    <label class="plan-field"><strong>Paragraph 2 idea</strong><textarea name="body2">${escapeHTML(fallback.body2)}</textarea></label>
  </div></section>`;
}

function paragraphPlanMarkup(key, label, plan) {
  return `<fieldset class="paragraph-plan"><legend>${label}</legend>
    <label><strong>My big idea</strong><textarea name="${key}-bigIdea">${escapeHTML(plan.bigIdea)}</textarea></label>
    <label><strong>What do I need to explain?</strong><textarea name="${key}-explain">${escapeHTML(plan.explain)}</textarea></label>
    <label><strong>What could help me show what I mean? <span>(optional)</span></strong><textarea name="${key}-support">${escapeHTML(plan.support)}</textarea></label>
  </fieldset>`;
}

function renderM1(unit) {
  const id = unit.id;
  const saved = getUnitState(id);
  const source = sourceWork();
  const plans = state.drafts.paragraphPlans;
  if (state.source.kind === "workshop1" && !hasText(plans.paragraph1.bigIdea) && !hasText(plans.paragraph2.bigIdea)) {
    plans.paragraph1.bigIdea = source.body1 || "";
    plans.paragraph2.bigIdea = source.body2 || "";
    saveWorkshop2State(state);
  }
  const fallbackReady = state.source.kind === "workshop1" || [source.question, source.position, source.body1, source.body2].every(hasText);
  const plansReady = [plans.paragraph1.bigIdea, plans.paragraph1.explain, plans.paragraph2.bigIdea, plans.paragraph2.explain].every(hasText);
  app.innerHTML = `<article>${unitHeader(unit, "Now look at your own plan. Expand both main ideas before you write.")}
    <form id="my-plan-form">${state.source.kind === "fallback" ? fallbackFieldsMarkup(state.drafts.fallback) : sourceSummaryMarkup()}
      <div class="two-paragraph-plans">${paragraphPlanMarkup("paragraph1", "Main paragraph 1", plans.paragraph1)}${paragraphPlanMarkup("paragraph2", "Main paragraph 2", plans.paragraph2)}</div>
      <p class="choice-note">An example is optional. Do not add one unless it helps you show what you mean.</p>
      <button class="primary-button" type="submit" ${fallbackReady && plansReady ? "" : "disabled"}>Keep my paragraph plans</button>
    </form>
    ${saved.saved ? feedbackMarkup("Your two paragraph plans are saved. You can change them later while you write.") : ""}
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#my-plan-form");
  const capture = () => {
    const data = new FormData(form);
    if (state.source.kind === "fallback") {
      state.drafts.fallback = {
        ...state.drafts.fallback,
        question: data.get("question") || "",
        position: data.get("position") || "",
        body1: data.get("body1") || "",
        body2: data.get("body2") || "",
      };
    }
    state.drafts.paragraphPlans = {
      paragraph1: { bigIdea: data.get("paragraph1-bigIdea") || "", explain: data.get("paragraph1-explain") || "", support: data.get("paragraph1-support") || "" },
      paragraph2: { bigIdea: data.get("paragraph2-bigIdea") || "", explain: data.get("paragraph2-explain") || "", support: data.get("paragraph2-support") || "" },
    };
    state.units[id] = { ...getUnitState(id), saved: false };
    saveWorkshop2State(state);
    const currentSource = sourceWork();
    const sourceComplete = state.source.kind === "workshop1" || [currentSource.question, currentSource.position, currentSource.body1, currentSource.body2].every(hasText);
    const currentPlans = state.drafts.paragraphPlans;
    form.querySelector('button[type="submit"]').disabled = !(sourceComplete && [currentPlans.paragraph1.bigIdea, currentPlans.paragraph1.explain, currentPlans.paragraph2.bigIdea, currentPlans.paragraph2.explain].every(hasText));
  };
  form.addEventListener("input", capture);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    capture();
    if (form.querySelector('button[type="submit"]').disabled) return;
    completeUnit(id, { saved: true });
    render();
  });
}

function writingPlanMarkup(which) {
  const plan = state.drafts.paragraphPlans[which];
  return `<aside class="writing-plan"><h2>Your plan</h2><p><strong>My big idea</strong><br>${escapeHTML(plan.bigIdea)}</p><p><strong>What I need to explain</strong><br>${escapeHTML(plan.explain)}</p>${plan.support ? `<p><strong>What could help</strong><br>${escapeHTML(plan.support)}</p>` : ""}<details><summary>Optional prompts</summary><p>Is your main idea clear?</p><p>Have you explained it?</p><p>If you used an example, does it help show what you mean?</p></details></aside>`;
}

function aiMarkup() {
  return `<section class="ai-feedback-panel" aria-labelledby="paragraph-ai-heading"><h3 id="paragraph-ai-heading">Optional AI feedback</h3><p>Copy a focused prompt, paste it into your chosen AI chatbot, then return here to revise your own paragraph.</p><button class="secondary-button" type="button" data-copy-ai>Copy AI feedback prompt</button><p data-ai-status role="status" aria-live="polite"></p><p class="ai-return-message">This workshop sends nothing automatically.</p></section>`;
}

function bindParagraphAI(textarea) {
  const status = document.querySelector("[data-ai-status]");
  document.querySelector("[data-copy-ai]")?.addEventListener("click", async () => {
    if (!hasText(textarea.value)) {
      status.textContent = "Write your paragraph first. Then use AI to help you check it.";
      return;
    }
    const source = sourceWork();
    const plan = state.drafts.paragraphPlans.paragraph1;
    try {
      const prompt = buildTask2AIFeedbackPrompt({
        question: source.question,
        analysis: `The learner's answer/position: ${source.position}. Their Paragraph 1 plan: big idea — ${plan.bigIdea}; explanation — ${plan.explain}; optional support — ${plan.support || "none planned"}. Treat this as the learner's own defensible plan, not a model answer.`,
        feedback: content.aiFeedback,
        learnerResponse: textarea.value,
      });
      await copyText(prompt);
      setUnitState("m2", { aiPromptCopied: true });
      status.textContent = "Copied. Open your AI chatbot and paste it there.";
    } catch {
      status.textContent = "Copying was unavailable. Check your browser's clipboard permission and try again.";
    }
  });
}

function renderM2(unit) {
  const id = unit.id;
  const saved = getUnitState(id);
  const paragraph1 = state.drafts.paragraph1;
  const paragraph2 = state.drafts.paragraph2;
  app.innerHTML = `<article>${unitHeader(unit, "Use your plan and write your first main paragraph.")}
    <div class="activity-layout writing-layout">${writingPlanMarkup("paragraph1")}<section class="writing-pane"><label for="paragraph-1" class="prompt">Write your first paragraph.</label><textarea class="writing-area paragraph-area" id="paragraph-1">${escapeHTML(paragraph1)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(paragraph1)} words</span><span>Your paragraph is saved on this device.</span></div>${aiMarkup()}<button class="primary-button" type="button" data-save-p1 ${hasText(paragraph1) ? "" : "disabled"}>Keep Paragraph 1</button></section></div>
    ${saved.paragraph1Saved ? `<section class="optional-writing"><h2>What would you like to do?</h2><div class="route-choice"><button class="secondary-button" type="button" data-write-p2>Write Paragraph 2</button><button class="primary-button" type="button" data-go-conclusion>Go on to the conclusion →</button></div>
      ${saved.paragraph2Open ? `<div class="activity-layout writing-layout">${writingPlanMarkup("paragraph2")}<section class="writing-pane"><label for="paragraph-2" class="prompt">Write Paragraph 2 <span>(optional)</span></label><textarea class="writing-area paragraph-area" id="paragraph-2">${escapeHTML(paragraph2)}</textarea><div class="writing-meta"><span data-p2-count>${wordCount(paragraph2)} words</span><span>This paragraph is optional.</span></div><button class="secondary-button" type="button" data-save-p2 ${hasText(paragraph2) ? "" : "disabled"}>Keep Paragraph 2</button><p data-p2-status role="status" aria-live="polite">${saved.paragraph2Saved ? "Paragraph 2 is saved." : ""}</p></section></div>` : ""}
    </section>` : ""}
    ${navigationMarkup({ canContinue: state.completed.includes(id), hideNext: saved.paragraph1Saved })}</article>`;
  const textarea = document.querySelector("#paragraph-1");
  textarea.addEventListener("input", () => {
    saveDraft("paragraph1", textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-save-p1]").disabled = !hasText(textarea.value);
  });
  document.querySelector("[data-save-p1]").addEventListener("click", () => {
    if (!hasText(textarea.value)) return;
    state.drafts.paragraph1 = textarea.value;
    completeUnit(id, { paragraph1Saved: true });
    render();
  });
  bindParagraphAI(textarea);
  document.querySelector("[data-write-p2]")?.addEventListener("click", () => { setUnitState(id, { paragraph2Open: true }); render(); });
  document.querySelector("[data-go-conclusion]")?.addEventListener("click", () => navigateTo("f1"));
  const textarea2 = document.querySelector("#paragraph-2");
  textarea2?.addEventListener("input", () => {
    saveDraft("paragraph2", textarea2.value);
    document.querySelector("[data-p2-count]").textContent = `${wordCount(textarea2.value)} words`;
    document.querySelector("[data-save-p2]").disabled = !hasText(textarea2.value);
  });
  document.querySelector("[data-save-p2]")?.addEventListener("click", () => {
    if (!hasText(textarea2.value)) return;
    state.drafts.paragraph2 = textarea2.value;
    setUnitState(id, { paragraph2Saved: true });
    document.querySelector("[data-p2-status]").textContent = "Paragraph 2 is saved. You can go on to the conclusion.";
  });
}

function renderF1(unit) {
  const id = unit.id;
  const saved = getUnitState(id);
  const conclusions = orderedOptions("f1-conclusions", content.mustafa.conclusions);
  const categories = orderedOptions("f1-categories", content.mustafa.categories);
  const answers = saved.answers || {};
  const allAnswered = content.mustafa.conclusions.every((item) => answers[item.id]);
  app.innerHTML = `<article>${unitHeader(unit, "Read how Mustafa might finish his essay. First notice what each conclusion does. Then help him improve one.")}
    ${questionMarkup(content.mustafa.question, "Mustafa's question")}
    <section class="strategy-note"><h2>Mustafa's answer</h2><p>${content.mustafa.answer}</p></section>
    <form id="mustafa-notice"><div class="conclusion-list">${conclusions.map((conclusion) => `<fieldset class="judgement-row"><legend>${conclusion.text}</legend><div class="inline-choices">${categories.map((category) => `<label class="compact-choice"><input type="radio" name="${conclusion.id}" value="${category.id}" ${answers[conclusion.id] === category.id ? "checked" : ""}/><span>${category.text}</span></label>`).join("")}</div>${saved.checked ? `<p class="row-feedback">${conclusion.feedback}</p>` : ""}</fieldset>`).join("")}</div><button class="primary-button" type="submit" ${allAnswered ? "" : "disabled"}>Check what they do</button></form>
    ${saved.checked ? `<section class="compact-writing"><label for="mustafa-improvement" class="prompt">Can you help Mustafa improve his conclusion?</label><textarea class="writing-area" id="mustafa-improvement">${escapeHTML(saved.improvement || "")}</textarea><button class="primary-button" type="button" data-save-improvement ${hasText(saved.improvement) ? "" : "disabled"}>Keep my improvement</button></section>` : ""}
    ${saved.improvementSaved ? `<section class="comparison-panel"><p class="eyebrow">One possible conclusion</p><div class="essay-copy"><p>${content.mustafa.possibleImprovement}</p></div><blockquote class="principle-panel"><p><strong>The conclusion finishes your answer. It doesn't start a new one.</strong></p></blockquote></section>` : ""}
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const form = document.querySelector("#mustafa-notice");
  form.addEventListener("change", () => {
    const data = new FormData(form);
    const next = Object.fromEntries(content.mustafa.conclusions.map((item) => [item.id, data.get(item.id)]));
    setUnitState(id, { answers: next, checked: false });
    form.querySelector('button[type="submit"]').disabled = !content.mustafa.conclusions.every((item) => next[item.id]);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    setUnitState(id, { answers: Object.fromEntries(content.mustafa.conclusions.map((item) => [item.id, data.get(item.id)])), checked: true });
    render();
  });
  const textarea = document.querySelector("#mustafa-improvement");
  textarea?.addEventListener("input", () => {
    setUnitState(id, { improvement: textarea.value, improvementSaved: false });
    document.querySelector("[data-save-improvement]").disabled = !hasText(textarea.value);
  });
  document.querySelector("[data-save-improvement]")?.addEventListener("click", () => {
    if (!hasText(textarea.value)) return;
    completeUnit(id, { improvement: textarea.value, improvementSaved: true });
    render();
  });
}

function renderF2(unit) {
  const id = unit.id;
  const saved = getUnitState(id);
  const draft = state.drafts.conclusion;
  app.innerHTML = `<article>${unitHeader(unit, "Return to your own answer and finish it simply.")}
    ${sourceSummaryMarkup({ includeWriting: true })}
    <div class="reflection-prompts"><p><strong>What was your main answer?</strong></p><p><strong>What were your two main ideas?</strong></p></div>
    <section class="compact-writing"><label for="my-conclusion" class="prompt">Finish your essay.</label><textarea class="writing-area" id="my-conclusion">${escapeHTML(draft)}</textarea><div class="writing-meta"><span data-word-count>${wordCount(draft)} words</span><span>Your conclusion is saved on this device.</span></div><button class="primary-button" type="button" data-save ${hasText(draft) ? "" : "disabled"}>Keep my conclusion</button></section>
    ${saved.saved ? feedbackMarkup("Your conclusion is saved. You have completed the core writing for Workshop 2.") : ""}
    ${navigationMarkup({ canContinue: state.completed.includes(id) })}</article>`;
  const textarea = document.querySelector("#my-conclusion");
  textarea.addEventListener("input", () => {
    saveDraft("conclusion", textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-save]").disabled = !hasText(textarea.value);
  });
  document.querySelector("[data-save]").addEventListener("click", () => {
    if (!hasText(textarea.value)) return;
    state.drafts.conclusion = textarea.value;
    completeUnit(id, { saved: true });
    render();
  });
}

function renderEnd(unit) {
  if (!state.completed.includes(unit.id)) completeUnit(unit.id, { finished: true });
  app.innerHTML = `<article>${unitHeader(unit, "You have moved from ideas to main paragraphs and a conclusion.")}
    <div class="completion-note"><h2>Workshop 2 complete</h2><p>You have:</p><ul><li>organised ideas;</li><li>found a big idea;</li><li>built a paragraph;</li><li>planned both main paragraphs;</li><li>written Paragraph 1;</li>${state.drafts.paragraph2 ? "<li>written Paragraph 2;</li>" : "<li>chosen to leave Paragraph 2 for later;</li>"}<li>written a conclusion.</li></ul><p>Your work is saved on this device.</p></div>
    <nav class="unit-navigation" aria-label="Workshop navigation"><button class="secondary-button" type="button" data-nav="f2">Back to my conclusion</button><a class="primary-button button-link" href="../">Return to Workshop 1</a></nav></article>`;
}

const renderers = { y1: renderY1, y2: renderY2, y3: renderY3, s1: renderS1, m1: renderM1, m2: renderM2, f1: renderF1, f2: renderF2, end: renderEnd };

function render({ focus = false } = {}) {
  const unit = content.units.find((item) => item.id === state.currentUnit) || content.units[0];
  if (state.currentUnit !== unit.id) state.currentUnit = unit.id;
  renderProgress();
  renderers[unit.id](unit);
  bindNavigation();
  if (focus) requestAnimationFrame(() => document.querySelector("#unit-title")?.focus({ preventScroll: true }));
}

resetButton.addEventListener("click", () => {
  if (!window.confirm("Reset Workshop 2 progress and writing on this device? Workshop 1 will not be changed.")) return;
  state = clearWorkshop2State();
  initialiseSource();
  history.replaceState({ unit: "y1" }, "", "#y1");
  render({ focus: true });
});

window.addEventListener("popstate", () => {
  const requested = window.location.hash.slice(1);
  if (requested && canVisit(unitIndex(requested))) state.currentUnit = requested;
  render({ focus: true });
});

initialiseSource();
const requested = window.location.hash.slice(1);
if (requested && canVisit(unitIndex(requested))) state.currentUnit = requested;
render();
