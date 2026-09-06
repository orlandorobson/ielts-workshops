import { prototypeContent as content } from "../../content/writing/academic-prototype.js";
import { renderAcademicChart } from "../visuals/academic-prototype-chart.js";
import { renderAcademicVisual } from "../visuals/academic-visual-set.js";
import { isValidStoredOrder, shuffleOptionIds } from "./randomise.js";
import { buildAIFeedbackPrompt, copyText } from "./ai-feedback.js";
import { clearState, loadState, saveState } from "./storage.js";

const app = document.querySelector("#app");
const progress = document.querySelector("#unit-progress");
const currentStage = document.querySelector("#current-stage");
const resetButton = document.querySelector("#reset-progress");
let state = loadState();
let saveTimer;

if (state.openingVersion < 1) {
  state.openingVersion = 1;
  state.currentUnit = "a0";
  state.completed = state.completed.filter((id) => !["a0", "a1", "a2", "c5"].includes(id));
  state.units.a1 = {};
  saveState(state);
}

if (state.overviewBridgeVersion < 1) {
  state.overviewBridgeVersion = 1;
  ["c5", "c6", "c7", "c8", "c9", "c10", "c11"].forEach((id) => {
    delete state.units[id];
  });
  state.completed = state.completed.filter((id) => !["c5", "c6", "c7", "c8", "c9", "c10", "c11"].includes(id));
  if (state.completed.includes("c4")) state.currentUnit = "c5";
  saveState(state);
}

const unitIndex = (id) => content.units.findIndex((unit) => unit.id === id);
const getUnitState = (id) => state.units[id] || {};
const escapeHTML = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function setUnitState(id, patch) {
  state.units[id] = { ...getUnitState(id), ...patch };
  saveState(state);
}

function completeUnit(id) {
  if (!state.completed.includes(id)) state.completed.push(id);
  saveState(state);
}

function saveDraft(name, value) {
  state.drafts[name] = value;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => saveState(state), 180);
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
  const target = content.units[index];
  if (!target) return false;
  if (target.section === "details" && !state.completed.includes("c11")) return false;
  if (target.section === "practice" && (!state.completed.includes("c11") || !state.completed.includes("e5"))) return false;
  const completedIndexes = state.completed.map(unitIndex).filter((index) => index >= 0);
  const furthest = completedIndexes.length ? Math.max(...completedIndexes) + 1 : 0;
  return index <= Math.min(furthest, content.units.length - 1);
}

function renderProgress() {
  progress.replaceChildren();
  const sections = [
    { id: "intro", label: "Introduction & overview" },
    { id: "details", label: "Organising details" },
    { id: "practice", label: "More practice (optional)" },
  ];
  const current = content.units.find((unit) => unit.id === state.currentUnit);
  sections.forEach((section) => {
    const sectionUnits = content.units.filter((unit) => unit.section === section.id);
    const firstUnit = sectionUnits[0];
    const firstIndex = unitIndex(firstUnit.id);
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "progress-button";
    button.disabled = !canVisit(firstIndex);
    button.dataset.section = section.id;
    button.dataset.complete = String(section.id !== "practice" && sectionUnits.every((unit) => state.completed.includes(unit.id)));
    button.textContent = section.label;
    if (current?.section === section.id) button.setAttribute("aria-current", "step");
    button.addEventListener("click", () => navigateTo(firstUnit.id));
    item.append(button);
    progress.append(item);
  });
  const coreUnits = content.units.filter((unit) => unit.section !== "practice");
  const position = coreUnits.findIndex((unit) => unit.id === state.currentUnit) + 1;
  currentStage.textContent = current?.section === "practice"
    ? "More practice · Optional workspace"
    : `${current?.label || "Workshop"} · Step ${position} of ${coreUnits.length}`;
}

function navigateTo(id, { focus = true } = {}) {
  if (unitIndex(id) < 0 || !canVisit(unitIndex(id))) return;
  state.currentUnit = id;
  saveState(state);
  const hash = `#${id}`;
  if (window.location.hash !== hash) history.pushState({ unit: id }, "", hash);
  render({ focus });
}

function unitHeader(unit, introduction) {
  return `
    <header class="unit-header" data-section="${unit.section}">
      <p class="eyebrow">${unit.eyebrow}</p>
      <h1 id="unit-title">${unit.label}</h1>
      <p class="lead">${introduction}</p>
    </header>`;
}

function taskSource({ showStatement = true, open = true } = {}) {
  return `
    <details class="source-pane" ${open ? "open" : ""}>
      <summary>View task and graph</summary>
      ${
        showStatement
          ? `<div class="task-copy"><p>${content.taskStatement}</p><p>${content.taskInstruction}</p></div>`
          : ""
      }
      <div class="chart-host" data-chart-host></div>
    </details>`;
}

function visualTaskSource(visualId, { open = true } = {}) {
  const visual = visualById(visualId);
  return `
    <details class="source-pane" ${open ? "open" : ""}>
      <summary>View task and visual</summary>
      <div class="task-copy"><p>${visual.taskStatement}</p><p>${visual.taskInstruction}</p></div>
      <div data-academic-visual="${visualId}" data-reveal-overview="false"></div>
    </details>`;
}

function hydrateCharts() {
  document.querySelectorAll("[data-chart-host]").forEach((host) => renderAcademicChart(host, content.dataset));
}

function visualById(id) {
  return content.academicVisuals.find((visual) => visual.id === id);
}

function hydrateAcademicVisuals() {
  document.querySelectorAll("[data-academic-visual]").forEach((host) => {
    const visual = visualById(host.dataset.academicVisual);
    if (visual) renderAcademicVisual(host, visual, {
      compact: host.dataset.compact === "true",
      revealOverview: host.dataset.revealOverview !== "false",
    });
  });
}

function feedbackMarkup(message, kind = "success") {
  return `<div class="feedback" data-kind="${kind}" role="status" aria-live="polite" tabindex="-1"><p>${message}</p></div>`;
}

function choiceMarkup({ type, name, value, text, checked = false, disabled = false, note = "" }) {
  return `
    <label class="choice">
      <input type="${type}" name="${name}" value="${value}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} />
      <span>${text}</span>
      ${note ? `<span class="choice-note">${note}</span>` : ""}
    </label>`;
}

function navigationMarkup({ canContinue = false, final = false } = {}) {
  const index = unitIndex(state.currentUnit);
  const previous = content.units[index - 1];
  const next = content.units[index + 1];
  return `
    <nav class="unit-navigation" aria-label="Learning-unit navigation">
      ${previous ? `<button class="secondary-button" type="button" data-nav="${previous.id}">Back</button>` : "<span></span>"}
      ${
        final
          ? `<button class="primary-button" type="button" data-finish ${canContinue ? "" : "disabled"}>Finish prototype</button>`
          : next
            ? `<button class="primary-button" type="button" data-nav="${next.id}" ${canContinue ? "" : "disabled"}>Continue</button>`
            : ""
      }
    </nav>`;
}

function bindNavigation() {
  document.querySelectorAll("[data-nav]").forEach((button) => {
    button.addEventListener("click", () => navigateTo(button.dataset.nav));
  });
}

function focusAfterRender(selector = "#unit-title") {
  requestAnimationFrame(() => document.querySelector(selector)?.focus({ preventScroll: true }));
}

function renderA0(unit) {
  const source = content.a0;
  const saved = getUnitState("a0");
  const selectedId = saved.selectedId || source.visualIds[0];
  const viewed = [...new Set([...(saved.viewed || []), selectedId])];
  const selected = visualById(selectedId);
  if (!saved.selectedId || viewed.length !== (saved.viewed || []).length) setUnitState("a0", { selectedId, viewed });
  if (viewed.length === source.visualIds.length) completeUnit("a0");

  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "Meet the main Academic Task 1 visual forms before learning one example deeply. Select each preview to inspect it.")}
      <div class="visual-explorer" aria-label="Academic Task 1 visual forms">
        <div class="visual-selector">
          ${source.visualIds
            .map((id) => {
              const visual = visualById(id);
              return `<div class="visual-select-item" data-selected="${id === selectedId}">
                <span class="visual-preview" data-academic-visual="${id}" data-compact="true" aria-hidden="true"></span>
                <strong>${visual.label}</strong>
                <button type="button" class="visual-select-button" data-select-visual="${id}" aria-pressed="${id === selectedId}" aria-label="Inspect ${visual.label}: ${visual.description}"></button>
              </div>`;
            })
            .join("")}
        </div>
        <section class="visual-focus" aria-live="polite" aria-labelledby="visual-focus-title">
          <p class="eyebrow">${selected.label}</p>
          <h2 id="visual-focus-title" tabindex="-1">${selected.title}</h2>
          <p>${selected.orientation}</p>
          <div data-academic-visual="${selected.id}"></div>
        </section>
      </div>
      <p class="choice-note">${viewed.length} of ${source.visualIds.length} visual forms inspected.</p>
      ${navigationMarkup({ canContinue: state.completed.includes("a0") })}
    </article>`;
  hydrateAcademicVisuals();
  document.querySelectorAll("[data-select-visual]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextId = button.dataset.selectVisual;
      setUnitState("a0", { selectedId: nextId, viewed: [...new Set([...viewed, nextId])] });
      render();
      focusAfterRender("#visual-focus-title");
    });
  });
}

function renderA1(unit) {
  let saved = getUnitState("a1");
  if (saved.choice && !saved.answers) {
    state.units.a1 = {};
    state.completed = state.completed.filter((id) => id !== "a1");
    saveState(state);
    saved = getUnitState("a1");
  }
  const visualItems = content.a1.visualOrder.ids.map((id) => ({ id }));
  const visualOrder = orderedOptions("a1-visual-order", visualItems, content.a1.visualOrder.shuffle).map((item) => item.id);
  const currentIndex = Math.min(saved.currentIndex || 0, visualOrder.length - 1);
  const visualId = visualOrder[currentIndex];
  const visual = visualById(visualId);
  const answers = saved.answers || {};
  const results = saved.results || {};
  const options = orderedOptions(`a1-${visualId}`, content.a1.options, content.a1.shuffle);
  const checked = saved.checkedVisual === visualId;
  const isCorrect = checked && answers[visualId] === visualId;
  const allComplete = visualOrder.every((id) => results[id]);
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "Use the familiar names for the six visual forms. This is orientation, not an IELTS test.")}
      <div class="activity-layout">
        <section class="recognition-visual" aria-label="Visual to identify" tabindex="-1">
          <p class="choice-note">Visual ${currentIndex + 1} of ${visualOrder.length}</p>
          <div data-academic-visual="${visualId}"></div>
        </section>
        <section class="interaction-pane" aria-labelledby="a1-prompt">
          <form id="a1-form">
            <fieldset>
              <legend class="prompt" id="a1-prompt">${content.a1.prompt}</legend>
              <div class="choice-list">
                ${options
                  .map((option) => choiceMarkup({ type: "radio", name: "visual-type", value: option.id, text: option.text, checked: answers[visualId] === option.id }))
                  .join("")}
              </div>
            </fieldset>
            <div class="action-row">
              <button class="primary-button" type="submit" ${answers[visualId] ? "" : "disabled"}>Check my choice</button>
              ${checked && !isCorrect ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${checked ? feedbackMarkup(isCorrect ? `${visual.label}. ${visual.orientation}` : content.a1.feedback.retry, isCorrect ? "success" : "reconsider") : ""}
          ${isCorrect && !allComplete ? '<button class="primary-button" type="button" data-next-recognition>Next visual</button>' : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes("a1") })}
    </article>`;
  hydrateAcademicVisuals();
  const form = document.querySelector("#a1-form");
  form.addEventListener("change", (event) => {
    setUnitState("a1", { answers: { ...answers, [visualId]: event.target.value }, checkedVisual: null });
    form.querySelector("button[type=submit]").disabled = false;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const choice = new FormData(form).get("visual-type");
    const nextResults = choice === visualId ? { ...results, [visualId]: true } : results;
    setUnitState("a1", { answers: { ...answers, [visualId]: choice }, results: nextResults, checkedVisual: visualId });
    if (visualOrder.every((id) => nextResults[id])) completeUnit("a1");
    render();
    focusAfterRender(".feedback");
  });
  document.querySelector("[data-next-recognition]")?.addEventListener("click", () => {
    setUnitState("a1", { currentIndex: currentIndex + 1, checkedVisual: null });
    render();
    focusAfterRender(".recognition-visual");
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => {
    setUnitState("a1", { checkedVisual: null });
    render();
  });
}

function renderA2(unit) {
  const source = content.a2;
  const saved = getUnitState("a2");
  const activeId = saved.activeId || source.families[0].id;
  const viewed = [...new Set([...(saved.viewed || []), activeId])];
  const active = source.families.find((family) => family.id === activeId);
  if (!saved.activeId || viewed.length !== (saved.viewed || []).length) setUnitState("a2", { activeId, viewed });
  if (viewed.length === source.families.length) completeUnit("a2");
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "Different visual families invite different first questions. Explore the three broad teaching categories.")}
      <p class="principle-panel">${source.note}</p>
      <div class="family-tabs" role="group" aria-label="Visual families">
        ${source.families.map((family) => `<button type="button" data-family="${family.id}" aria-pressed="${family.id === activeId}">${family.label}</button>`).join("")}
      </div>
      <section class="family-focus" aria-live="polite">
        <h2 tabindex="-1">${active.label}</h2>
        <p class="prompt">${active.question}</p>
        <div class="family-visuals">
          ${active.visualIds.map((id) => `<div class="family-visual"><div data-academic-visual="${id}" data-compact="true"></div><p>${visualById(id).label}</p></div>`).join("")}
        </div>
      </section>
      <p class="choice-note">${viewed.length} of ${source.families.length} families explored.</p>
      ${navigationMarkup({ canContinue: state.completed.includes("a2") })}
    </article>`;
  hydrateAcademicVisuals();
  document.querySelectorAll("[data-family]").forEach((button) => button.addEventListener("click", () => {
    setUnitState("a2", { activeId: button.dataset.family, viewed: [...new Set([...viewed, button.dataset.family])] });
    render();
    focusAfterRender(".family-focus h2");
  }));
}

function renderB1(unit) {
  const saved = getUnitState("b1");
  const selected = saved.selected || [];
  const expected = content.b1.options.filter((option) => option.expected).map((option) => option.id);
  const options = orderedOptions("b1", content.b1.options, content.b1.shuffle);
  const success = saved.checked && selected.length === expected.length && expected.every((id) => selected.includes(id));
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "Understand the information before trying to change the wording. Meaning comes first.")}
      <div class="activity-layout">
        ${taskSource()}
        <section class="interaction-pane" aria-labelledby="b1-prompt">
          <form id="b1-form">
            <fieldset>
              <legend class="prompt" id="b1-prompt">${content.b1.prompt}</legend>
              <div class="choice-list">
                ${options
                  .map((option) => choiceMarkup({ type: "checkbox", name: "task-details", value: option.id, text: option.text, checked: selected.includes(option.id) }))
                  .join("")}
              </div>
            </fieldset>
            <div class="action-row">
              <button class="primary-button" type="submit" ${selected.length ? "" : "disabled"}>Check the details</button>
              ${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${saved.checked ? feedbackMarkup(success ? content.b1.success : content.b1.partial, success ? "success" : "reconsider") : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes("b1") })}
    </article>`;
  hydrateCharts();
  bindCheckboxForm("b1", "#b1-form", "task-details", (choices) => {
    const correct = choices.length === expected.length && expected.every((id) => choices.includes(id));
    if (correct) completeUnit("b1");
  });
}

function bindCheckboxForm(unitId, selector, fieldName, onCheck) {
  const form = document.querySelector(selector);
  form.addEventListener("change", () => {
    const choices = new FormData(form).getAll(fieldName);
    setUnitState(unitId, { selected: choices, checked: false });
    form.querySelector("button[type=submit]").disabled = choices.length === 0;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const choices = new FormData(form).getAll(fieldName);
    setUnitState(unitId, { selected: choices, checked: true });
    onCheck(choices);
    render();
    focusAfterRender(".feedback");
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => {
    setUnitState(unitId, { checked: false });
    render();
  });
}

function renderB2(unit) {
  const saved = getUnitState("b2");
  const selected = saved.selected || [];
  const viable = content.b2.options.filter((option) => option.viable).map((option) => option.id);
  const options = orderedOptions("b2", content.b2.options, content.b2.shuffle);
  const success = saved.checked && selected.length === viable.length && viable.every((id) => selected.includes(id));
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "A useful paraphrase protects meaning. It does not need to replace every word in the task.")}
      <div class="activity-layout">
        ${taskSource()}
        <section class="interaction-pane" aria-labelledby="b2-prompt">
          <form id="b2-form">
            <fieldset>
              <legend class="prompt" id="b2-prompt">${content.b2.prompt}</legend>
              <p>Select every version you think is viable, then check your judgement.</p>
              <div class="choice-list">
                ${options
                  .map((option) => choiceMarkup({
                    type: "checkbox",
                    name: "paraphrases",
                    value: option.id,
                    text: option.text,
                    checked: selected.includes(option.id),
                    note: saved.checked ? option.note : "",
                  }))
                  .join("")}
              </div>
            </fieldset>
            <div class="action-row">
              <button class="primary-button" type="submit" ${selected.length ? "" : "disabled"}>Check my judgement</button>
              ${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${saved.checked ? feedbackMarkup(success ? content.b2.success : content.b2.partial, success ? "success" : "reconsider") : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes("b2") })}
    </article>`;
  hydrateCharts();
  bindCheckboxForm("b2", "#b2-form", "paraphrases", (choices) => {
    const correct = choices.length === viable.length && viable.every((id) => choices.includes(id));
    if (correct) completeUnit("b2");
  });
}

function languageSupportMarkup(language, active = "clear") {
  const labels = { clear: "Clear", expand: "Expand", explore: "Explore" };
  return `
    <div class="language-tabs" aria-label="Language options">
      ${Object.keys(labels)
        .map((key) => `<button class="language-tab" type="button" data-language="${key}" aria-pressed="${active === key}">${labels[key]}</button>`)
        .join("")}
    </div>
    <p class="language-example" data-language-example>${language[active]}</p>
    <p class="choice-note">These are different viable choices, not levels or band scores.</p>`;
}

function helpMarkup(unitId, source, maxLevel) {
  const saved = getUnitState(unitId);
  const level = saved.helpLevel || 0;
  if (!level) return "";
  let body = "";
  if (level === 1) body = `<h3 tabindex="-1">Hint</h3><p>${source.hint}</p>`;
  if (level === 2) body = `<h3 tabindex="-1">Break the task down</h3><ul>${source.support.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  if (level === 3) body = `<h3 tabindex="-1">Language options</h3>${languageSupportMarkup(source.language, saved.languageTab || "clear")}`;
  if (level === 4) {
    body = `<h3 tabindex="-1">Teaching example</h3><p class="language-example">${source.example}</p><p>This is something to investigate, not a replacement for your writing.</p>`;
  }
  return `
    <section class="support-panel" aria-label="Writing support">
      ${body}
      <div class="support-actions">
        ${level < maxLevel ? `<button class="secondary-button" type="button" data-more-help>More support</button>` : ""}
        <button class="text-button" type="button" data-close-help>Close help</button>
      </div>
    </section>`;
}

function bindLanguageSupport(unitId, source) {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      const active = button.dataset.language;
      setUnitState(unitId, { languageTab: active });
      document.querySelectorAll("[data-language]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      document.querySelector("[data-language-example]").textContent = source.language[active];
    });
  });
}

function bindHelp(
  unitId,
  source,
  maxLevel,
  canShowExample = () => true,
  snapshot = { draft: "overview", initial: "overviewInitial" },
) {
  document.querySelector("[data-open-help]")?.addEventListener("click", () => {
    setUnitState(unitId, { helpLevel: 1 });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-more-help]")?.addEventListener("click", () => {
    const saved = getUnitState(unitId);
    const nextLevel = Math.min((saved.helpLevel || 0) + 1, maxLevel);
    if (nextLevel === 4 && !canShowExample()) return;
    const patch = { helpLevel: nextLevel };
    if (nextLevel === 4) patch.modelViewed = true;
    setUnitState(unitId, patch);
    if (nextLevel === 4 && !state.drafts[snapshot.initial]) {
      state.drafts[snapshot.initial] = state.drafts[snapshot.draft];
    }
    saveState(state);
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-close-help]")?.addEventListener("click", () => {
    setUnitState(unitId, { helpLevel: 0 });
    render();
    focusAfterRender("[data-open-help]");
  });
  bindLanguageSupport(unitId, source);
}

function wordCount(value) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function aiFeedbackMarkup(unitId, feedback, saved) {
  if (!feedback?.enabled) return "";
  return `
    <section class="ai-feedback-panel" aria-labelledby="${unitId}-ai-heading">
      <h3 id="${unitId}-ai-heading">Use AI to check your writing</h3>
      <ol class="ai-feedback-steps">
        <li><strong>Write first</strong><span>Finish your own answer above.</span></li>
        <li><strong>Copy</strong><span>Select <strong>Copy AI feedback prompt</strong>.</span></li>
        <li><strong>Paste</strong><span>Open your AI chatbot and paste the copied text.</span></li>
        <li><strong>Read</strong><span>Read the feedback before asking for a model answer.</span></li>
        <li><strong>Revise</strong><span>Come back here and improve your own writing.</span></li>
      </ol>
      <button class="secondary-button ai-copy-button" type="button" data-copy-ai-prompt="${unitId}">Copy AI feedback prompt</button>
      <p class="ai-copy-status" data-ai-copy-status="${unitId}" role="status" aria-live="polite">${saved.aiPromptCopied ? "Copy an updated prompt whenever you want feedback on a later revision." : ""}</p>
      <p class="ai-return-message" data-ai-return-message="${unitId}">Read the feedback, then improve your answer here. Your writing is copied only when you choose; this workshop does not send it anywhere.</p>
      ${
        feedback.reflection
          ? `<div class="ai-reflection" data-ai-reflection="${unitId}" ${saved.aiRevised ? "" : "hidden"}>
              <label for="${unitId}-ai-reflection">What did you change?</label>
              <textarea id="${unitId}-ai-reflection" rows="2">${escapeHTML(saved.aiReflection || "")}</textarea>
              <p class="field-note">A brief note can help you notice your own correction. It is not scored.</p>
            </div>`
          : ""
      }
    </section>`;
}

function trackAIRevision(unitId, value) {
  const saved = getUnitState(unitId);
  if (!saved.aiPromptCopied || typeof saved.aiOriginal !== "string" || value === saved.aiOriginal) return;
  if (!saved.aiRevised) setUnitState(unitId, { aiRevised: true });
  document.querySelector(`[data-ai-reflection="${unitId}"]`)?.removeAttribute("hidden");
  const returnMessage = document.querySelector(`[data-ai-return-message="${unitId}"]`);
  if (returnMessage) returnMessage.textContent = "You have revised your own answer after copying the feedback prompt. Your writing remains here and is not sent by the workshop.";
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

    const visual = visualById(feedback.visualId);
    const prompt = buildAIFeedbackPrompt({ visual, feedback, learnerResponse });
    try {
      await copyText(prompt);
      const saved = getUnitState(unitId);
      setUnitState(unitId, {
        aiPromptCopied: true,
        aiOriginal: typeof saved.aiOriginal === "string" ? saved.aiOriginal : learnerResponse,
      });
      status.textContent = "Copied. Now open your AI chatbot and paste it there.";
    } catch {
      status.textContent = "Your browser could not copy the prompt. Check clipboard permission and try again.";
    }
  });

  document.querySelector(`#${unitId}-ai-reflection`)?.addEventListener("input", (event) => {
    setUnitState(unitId, { aiReflection: event.target.value });
  });
}

function renderB4(unit) {
  const saved = getUnitState("b4");
  const draft = state.drafts.introduction;
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "Now produce one clear sentence. Your language can be simple, natural and accurate.")}
      <div class="activity-layout writing-layout">
        ${taskSource()}
        <section class="writing-pane" aria-labelledby="b4-prompt">
          <p class="prompt" id="b4-prompt">${content.b4.prompt}</p>
          <label for="introduction-draft">Your introduction</label>
          <textarea class="writing-area" id="introduction-draft" spellcheck="true">${escapeHTML(draft)}</textarea>
          <div class="writing-meta"><span>One sentence is usually sufficient.</span><span data-word-count>${wordCount(draft)} words</span></div>
          <div class="action-row">
            <button class="secondary-button" type="button" data-open-help ${saved.helpLevel ? "hidden" : ""}>Need help?</button>
            <button class="primary-button" type="button" data-keep-writing ${draft.trim() ? "" : "disabled"}>Keep this introduction</button>
          </div>
          ${helpMarkup("b4", content.b4, 3)}
          ${aiFeedbackMarkup("b4", content.b4.aiFeedback, saved)}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes("b4") })}
    </article>`;
  hydrateCharts();
  const textarea = document.querySelector("#introduction-draft");
  textarea.addEventListener("input", () => {
    saveDraft("introduction", textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-keep-writing]").disabled = !textarea.value.trim();
    trackAIRevision("b4", textarea.value);
  });
  document.querySelector("[data-keep-writing]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft("introduction", textarea.value);
    completeUnit("b4");
    render();
  });
  bindHelp("b4", content.b4, 3);
  bindAIFeedback("b4", content.b4.aiFeedback, textarea);
}

function renderC1(unit) {
  const saved = getUnitState("c1");
  const selected = saved.selected || [];
  const options = orderedOptions("c1", content.observations, content.c1.shuffle);
  const selectedMajor = selected.filter((id) => content.observations.find((item) => item.id === id)?.major).length;
  const success = saved.checked && selectedMajor === 2;
  const message = selectedMajor === 2 ? content.c1.success : selectedMajor === 1 ? content.c1.partial : content.c1.retry;
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "An overview begins when you stop reporting isolated values and look across the whole visual.")}
      <div class="activity-layout">
        ${taskSource()}
        <section class="interaction-pane" aria-labelledby="c1-prompt">
          <form id="c1-form">
            <fieldset aria-describedby="selection-count">
              <legend class="prompt" id="c1-prompt">${content.c1.prompt}</legend>
              <p id="selection-count" aria-live="polite">Select exactly two. <span data-selection-count>${selected.length} of 2 selected.</span></p>
              <div class="choice-list">
                ${options
                  .map((observation) => choiceMarkup({
                    type: "checkbox",
                    name: "observations",
                    value: observation.id,
                    text: observation.text,
                    checked: selected.includes(observation.id),
                    disabled: selected.length >= 2 && !selected.includes(observation.id),
                  }))
                  .join("")}
              </div>
            </fieldset>
            <div class="action-row">
              <button class="primary-button" type="submit" ${selected.length === 2 ? "" : "disabled"}>Check the big picture</button>
              ${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${saved.checked ? feedbackMarkup(message, success ? "success" : "reconsider") : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes("c1") })}
    </article>`;
  hydrateCharts();
  const form = document.querySelector("#c1-form");
  form.addEventListener("change", () => {
    const choices = new FormData(form).getAll("observations");
    setUnitState("c1", { selected: choices, checked: false });
    document.querySelector("[data-selection-count]").textContent = `${choices.length} of 2 selected.`;
    form.querySelector("button[type=submit]").disabled = choices.length !== 2;
    form.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.disabled = choices.length >= 2 && !choices.includes(input.value);
    });
    document.querySelector(".feedback")?.remove();
    document.querySelector("[data-retry]")?.remove();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const choices = new FormData(form).getAll("observations");
    setUnitState("c1", { selected: choices, checked: true });
    const majors = choices.filter((id) => content.observations.find((item) => item.id === id)?.major).length;
    if (majors === 2) completeUnit("c1");
    render();
    focusAfterRender(".feedback");
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => {
    setUnitState("c1", { checked: false });
    render();
  });
}

function observationText(id) {
  return content.observations.find((observation) => observation.id === id)?.text || "";
}

function renderC2(unit) {
  const saved = getUnitState("c2");
  const selectedOption = content.c2.options.find((option) => option.id === saved.choice);
  const options = orderedOptions("c2", content.c2.options, content.c2.shuffle);
  const success = saved.checked && selectedOption?.viable;
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "A statement can be factually accurate and still be too narrow to give the reader an overview.")}
      <div class="activity-layout">
        ${taskSource()}
        <section class="interaction-pane" aria-labelledby="c2-prompt">
          <form id="c2-form">
            <fieldset>
              <legend class="prompt" id="c2-prompt">${content.c2.prompt}</legend>
              <div class="choice-list">
                ${options
                  .map((option) => choiceMarkup({
                    type: "radio",
                    name: "observation-pair",
                    value: option.id,
                    text: option.observationIds.map(observationText).join(" "),
                    checked: saved.choice === option.id,
                    note: saved.checked && saved.choice === option.id ? option.note : "",
                  }))
                  .join("")}
              </div>
            </fieldset>
            <div class="action-row">
              <button class="primary-button" type="submit" ${saved.choice ? "" : "disabled"}>Check my judgement</button>
              ${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${saved.checked && selectedOption ? feedbackMarkup(selectedOption.note, success ? "success" : "reconsider") : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes("c2") })}
    </article>`;
  hydrateCharts();
  const form = document.querySelector("#c2-form");
  form.addEventListener("change", (event) => {
    setUnitState("c2", { choice: event.target.value, checked: false });
    form.querySelector("button[type=submit]").disabled = false;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const choice = new FormData(form).get("observation-pair");
    setUnitState("c2", { choice, checked: true });
    if (content.c2.options.find((option) => option.id === choice)?.viable) completeUnit("c2");
    render();
    focusAfterRender(".feedback");
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => {
    setUnitState("c2", { checked: false });
    render();
  });
}

function modelMarkup() {
  return `
    <section class="model-panel" aria-labelledby="model-heading">
      <h3 id="model-heading" tabindex="-1">Compare with a teaching example</h3>
      <p class="language-example">${content.c4.example}</p>
      <p>The example is not a script or an official band response. Compare its decisions with yours.</p>
      <ul class="reflection-list">${content.c4.reflection.map((item) => `<li>${item}</li>`).join("")}</ul>
    </section>`;
}

function renderC4(unit) {
  const saved = getUnitState("c4");
  const draft = state.drafts.overview;
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "Turn your big-picture observations into an overview, then compare and decide whether you want to revise.")}
      <div class="activity-layout writing-layout">
        ${taskSource()}
        <section class="writing-pane" aria-labelledby="c4-prompt">
          <p class="prompt" id="c4-prompt">${content.c4.prompt}</p>
          <label for="overview-draft">Your overview</label>
          <textarea class="writing-area" id="overview-draft" spellcheck="true">${escapeHTML(draft)}</textarea>
          <div class="writing-meta"><span>Exact figures are usually unnecessary here.</span><span data-word-count>${wordCount(draft)} words</span></div>
          <div class="action-row">
            <button class="secondary-button" type="button" data-open-help ${saved.helpLevel ? "hidden" : ""}>Need help?</button>
            <button class="secondary-button" type="button" data-compare ${draft.trim() ? "" : "disabled"}>Compare with an example</button>
            ${saved.modelViewed ? `<button class="primary-button" type="button" data-complete-c4 ${draft.trim() ? "" : "disabled"}>Keep this overview</button>` : ""}
          </div>
          ${helpMarkup("c4", content.c4, 4)}
          ${saved.modelViewed && saved.helpLevel !== 4 ? modelMarkup() : ""}
          ${saved.modelViewed ? `<p class="choice-note">${saved.revised ? "You have revised your original attempt." : "Your original attempt is preserved. Revise it only where you see a useful reason."}</p>` : ""}
          ${aiFeedbackMarkup("c4", content.c4.aiFeedback, saved)}
        </section>
      </div>
      ${state.completed.includes("c4") ? '<div class="completion-note"><h2 tabindex="-1">Overview built</h2><p>Next, transfer big-picture thinking to other familiar visual forms.</p></div>' : ""}
      ${navigationMarkup({ canContinue: state.completed.includes("c4") })}
    </article>`;
  hydrateCharts();
  const textarea = document.querySelector("#overview-draft");
  textarea.addEventListener("input", () => {
    saveDraft("overview", textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-compare]").disabled = !textarea.value.trim();
    if (saved.modelViewed && textarea.value !== state.drafts.overviewInitial) {
      setUnitState("c4", { revised: true });
    }
    const finish = document.querySelector("[data-finish]");
    if (finish) finish.disabled = !(saved.modelViewed && textarea.value.trim());
    const complete = document.querySelector("[data-complete-c4]");
    if (complete) complete.disabled = !textarea.value.trim();
    trackAIRevision("c4", textarea.value);
  });
  document.querySelector("[data-compare]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft("overview", textarea.value);
    if (!state.drafts.overviewInitial) state.drafts.overviewInitial = textarea.value;
    setUnitState("c4", { modelViewed: true });
    saveState(state);
    render();
    focusAfterRender("#model-heading");
  });
  document.querySelector("[data-complete-c4]")?.addEventListener("click", () => {
    if (!textarea.value.trim() || !getUnitState("c4").modelViewed) return;
    saveDraft("overview", textarea.value);
    completeUnit("c4");
    render();
    focusAfterRender(".completion-note h2");
  });
  bindHelp("c4", content.c4, 4, () => Boolean(textarea.value.trim()));
  bindAIFeedback("c4", content.c4.aiFeedback, textarea);
}

function renderC5(unit) {
  const source = content.c5;
  const saved = getUnitState("c5");
  const activeId = saved.activeId || source.families[0].id;
  const viewed = [...new Set([...(saved.viewed || []), activeId])];
  const family = source.families.find((item) => item.id === activeId);
  if (!saved.activeId || viewed.length !== (saved.viewed || []).length) setUnitState("c5", { activeId, viewed });
  if (viewed.length === source.families.length) completeUnit("c5");

  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, source.message)}
      <blockquote class="principle-panel"><p>An overview always asks: <strong>What is most important when I step back and look at the whole visual?</strong></p></blockquote>
      <p>These are our teaching categories, not official IELTS terminology.</p>
      <div class="transfer-tabs" role="group" aria-label="Overview thinking by visual family">
        ${source.families.map((item) => `<button type="button" data-transfer-family="${item.id}" aria-pressed="${item.id === activeId}">${item.label}</button>`).join("")}
      </div>
      <section class="family-focus" aria-live="polite">
        <h2 tabindex="-1">${family.label}</h2>
        <p class="prompt">${family.question}</p>
        <div class="family-visuals">
          ${family.visualIds.map((id) => `<div class="family-visual"><div data-academic-visual="${id}" data-compact="true" data-reveal-overview="false"></div><p>${visualById(id).label}</p></div>`).join("")}
        </div>
      </section>
      <p class="choice-note">${viewed.length} of ${source.families.length} ways of thinking inspected.</p>
      ${navigationMarkup({ canContinue: state.completed.includes("c5") })}
    </article>`;
  hydrateAcademicVisuals();
  document.querySelectorAll("[data-transfer-family]").forEach((button) => button.addEventListener("click", () => {
    setUnitState("c5", { activeId: button.dataset.transferFamily, viewed: [...new Set([...viewed, button.dataset.transferFamily])] });
    render();
    focusAfterRender(".family-focus h2");
  }));
}

function renderTransferJudgement(id, unit, introduction) {
  const source = content[id];
  const saved = getUnitState(id);
  const selected = saved.selected || [];
  const expected = source.options.filter((option) => option.expected).map((option) => option.id);
  const options = orderedOptions(id, source.options, source.shuffle);
  const success = saved.checked && selected.length === expected.length && expected.every((optionId) => selected.includes(optionId));
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, introduction)}
      <div class="activity-layout">
        ${visualTaskSource(source.visualId)}
        <section class="interaction-pane" aria-labelledby="${id}-prompt">
          <form id="${id}-form">
            <fieldset>
              <legend class="prompt" id="${id}-prompt">${source.prompt}</legend>
              <p>Every option is accurate. Select the two that best communicate the whole visual.</p>
              <div class="choice-list">
                ${options.map((option) => choiceMarkup({ type: "checkbox", name: `${id}-choices`, value: option.id, text: option.text, checked: selected.includes(option.id), disabled: selected.length >= 2 && !selected.includes(option.id) })).join("")}
              </div>
            </fieldset>
            <div class="action-row">
              <button class="primary-button" type="submit" ${selected.length === 2 ? "" : "disabled"}>Check the big picture</button>
              ${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${saved.checked ? feedbackMarkup(success ? source.success : source.partial, success ? "success" : "reconsider") : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes(id) })}
    </article>`;
  hydrateAcademicVisuals();
  const form = document.querySelector(`#${id}-form`);
  form.addEventListener("change", () => {
    const choices = new FormData(form).getAll(`${id}-choices`);
    setUnitState(id, { selected: choices, checked: false });
    form.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.disabled = choices.length >= 2 && !choices.includes(input.value);
    });
    form.querySelector('button[type="submit"]').disabled = choices.length !== 2;
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const choices = new FormData(form).getAll(`${id}-choices`);
    setUnitState(id, { selected: choices, checked: true });
    if (choices.length === expected.length && expected.every((optionId) => choices.includes(optionId))) completeUnit(id);
    render();
    focusAfterRender(".feedback");
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => {
    setUnitState(id, { checked: false });
    render();
  });
}

function renderC6(unit) {
  renderTransferJudgement("c6", unit, "For data visuals, look for the biggest patterns and relationships. Exact figures usually belong more naturally in the details.");
}

function renderC7(unit) {
  renderTransferJudgement("c7", unit, "For maps, ask what changed when you look at the whole place—not how many individual replacements you can list.");
}

function transferHelpMarkup(id, source, saved, hasDraft) {
  if (!saved.helpLevel) return "";
  const index = Math.min(saved.helpLevel, source.help.length) - 1;
  const atExample = index === source.help.length - 1;
  return `<section class="support-panel" aria-live="polite">
    <h3 tabindex="-1">${index === 0 ? "Thinking hint" : atExample ? "Teaching example" : "More support"}</h3>
    <p>${source.help[index].replace(/^(Thinking hint|More support|Example):\s*/, "")}</p>
    <div class="support-actions">
      ${!atExample ? `<button class="secondary-button" type="button" data-more-transfer-help ${hasDraft || index < source.help.length - 2 ? "" : "disabled"}>${index === 0 ? "More support" : "Show an example"}</button>` : ""}
      <button class="text-button" type="button" data-close-transfer-help>Close help</button>
    </div>
    ${!hasDraft && index === source.help.length - 2 ? '<p class="choice-note">Write your own attempt before opening the example.</p>' : ""}
  </section>`;
}

function renderTransferWriting(id, unit, draftName, introduction) {
  const source = content[id];
  const saved = getUnitState(id);
  const draft = state.drafts[draftName] || "";
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, introduction)}
      <div class="activity-layout writing-layout">
        ${visualTaskSource(source.visualId)}
        <section class="writing-pane" aria-labelledby="${id}-prompt">
          <p class="prompt" id="${id}-prompt">${source.prompt}</p>
          <label for="${id}-draft">Your overview</label>
          <textarea class="writing-area short-writing-area" id="${id}-draft" spellcheck="true">${escapeHTML(draft)}</textarea>
          <div class="writing-meta"><span>Keep the big picture in focus.</span><span data-word-count>${wordCount(draft)} words</span></div>
          <div class="action-row">
            <button class="secondary-button" type="button" data-open-transfer-help ${saved.helpLevel ? "hidden" : ""}>Need help?</button>
            <button class="primary-button" type="button" data-keep-transfer-writing ${draft.trim() ? "" : "disabled"}>Keep this overview</button>
          </div>
          ${transferHelpMarkup(id, source, saved, Boolean(draft.trim()))}
          ${aiFeedbackMarkup(id, source.aiFeedback, saved)}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes(id) })}
    </article>`;
  hydrateAcademicVisuals();
  const textarea = document.querySelector(`#${id}-draft`);
  textarea.addEventListener("input", () => {
    saveDraft(draftName, textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-keep-transfer-writing]").disabled = !textarea.value.trim();
    const exampleButton = document.querySelector("[data-more-transfer-help]");
    if (exampleButton && getUnitState(id).helpLevel === source.help.length - 1) exampleButton.disabled = !textarea.value.trim();
    trackAIRevision(id, textarea.value);
  });
  document.querySelector("[data-keep-transfer-writing]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft(draftName, textarea.value);
    completeUnit(id);
    render();
  });
  document.querySelector("[data-open-transfer-help]")?.addEventListener("click", () => {
    setUnitState(id, { helpLevel: 1 });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-more-transfer-help]")?.addEventListener("click", () => {
    const level = getUnitState(id).helpLevel || 1;
    if (level === source.help.length - 1 && !textarea.value.trim()) return;
    setUnitState(id, { helpLevel: Math.min(level + 1, source.help.length) });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-close-transfer-help]")?.addEventListener("click", () => {
    setUnitState(id, { helpLevel: 0 });
    render();
    focusAfterRender("[data-open-transfer-help]");
  });
  bindAIFeedback(id, source.aiFeedback, textarea);
}

function renderC8(unit) {
  renderTransferWriting("c8", unit, "mapOverview", "Look at Harbour Park as a whole, then write a short map overview. Individual location details can wait.");
}

function renderC9(unit) {
  renderTransferJudgement("c9", unit, "For a process, the overview is not mainly about trends or numerical comparisons. Ask what the complete journey does.");
}

function renderC10(unit) {
  renderTransferWriting("c10", unit, "processOverview", "Describe the process's broad journey from used paper to new paper without listing every stage.");
}

function renderC11(unit) {
  const source = content.c11;
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "The purpose of an overview stays the same. The question you ask changes with the information.")}
      <div class="overview-synthesis">
        ${source.questions.map((item) => `<section><p class="eyebrow">${item.label}</p><p>${item.question}</p></section>`).join("")}
      </div>
      <button class="primary-button" type="button" data-complete-synthesis>${state.completed.includes("c11") ? "Bridge complete" : "Continue to detail work"}</button>
      ${navigationMarkup({ canContinue: state.completed.includes("c11") })}
    </article>`;
  document.querySelector("[data-complete-synthesis]").addEventListener("click", () => {
    completeUnit("c11");
    render();
  });
}

const practiceDataStages = ["inspect", "introduction", "overview", "grouping", "detail"];
const practiceShortStages = ["inspect", "introduction", "overview"];
const practiceStageLabels = {
  inspect: "Inspect",
  introduction: "Introduction",
  overview: "Overview",
  grouping: "Grouping plan",
  detail: "Detail paragraph",
};

function practiceKey(visualId, stage) {
  return `practice-${visualId}-${stage}`;
}

function practiceStages(visual) {
  return visual.family === "data" ? practiceDataStages : practiceShortStages;
}

function practiceWorkspaceState() {
  const saved = getUnitState("practice");
  return {
    selectedVisual: saved.selectedVisual || content.practice.visualIds[0],
    stageByVisual: saved.stageByVisual || {},
    completedVisuals: saved.completedVisuals || [],
  };
}

function setPracticeStage(visualId, stage) {
  const saved = practiceWorkspaceState();
  setUnitState("practice", {
    selectedVisual: visualId,
    stageByVisual: { ...saved.stageByVisual, [visualId]: stage },
  });
}

function practiceHelp(visual, stage) {
  if (stage === "introduction") return [
    "Identify the visual form, subject and any place or time information.",
    `Check the task statement again: ${visual.taskStatement}`,
    visual.practice.introductionExample,
  ];
  if (stage === "overview") {
    const question = visual.family === "data"
      ? "What are the main patterns, differences or relationships?"
      : visual.family === "place"
        ? "What changed overall when you compare the whole place?"
        : "What is the overall journey from beginning to end?";
    return [question, "Choose the broad information a reader most needs before the individual details. Do not try to mention everything.", visual.overview];
  }
  if (stage === "grouping") return ["Look for categories that share a pattern or create a useful contrast.", visual.detailPotential, visual.practice.groupingExample];
  return ["Return to your grouping plan. State its focus, then support it with selected figures and comparisons.", visual.detailPotential, visual.practice.detailExample];
}

function practiceHelpMarkup(visual, stage, saved, hasAttempt) {
  if (!saved.helpLevel) return "";
  const help = practiceHelp(visual, stage);
  const index = Math.min(saved.helpLevel, help.length) - 1;
  const atExample = index === help.length - 1;
  return `<section class="support-panel" aria-live="polite">
    <h3 tabindex="-1">${index === 0 ? "Thinking hint" : atExample ? "Teaching example" : "More support"}</h3>
    <p>${help[index]}</p>
    <div class="support-actions">
      ${!atExample ? `<button class="secondary-button" type="button" data-more-practice-help ${hasAttempt || index === 0 ? "" : "disabled"}>${index === 0 ? "More support" : "Show an example"}</button>` : ""}
      <button class="text-button" type="button" data-close-practice-help>Close help</button>
    </div>
    ${!hasAttempt && index === 1 ? '<p class="choice-note">Make your own attempt before opening the example.</p>' : ""}
  </section>`;
}

function practiceStageNavigation(visual, stage) {
  const stages = practiceStages(visual);
  const index = stages.indexOf(stage);
  return `<div class="practice-stage-heading"><p class="eyebrow">${visual.label} · ${index + 1} of ${stages.length}</p><h2>${practiceStageLabels[stage]}</h2><p>${content.practice.scopes[visual.id]}</p></div>`;
}

function renderPracticeInspect(visual) {
  const stages = practiceStages(visual);
  return `${practiceStageNavigation(visual, "inspect")}<p class="prompt">Read the task and inspect the visual before writing.</p><p>${visual.orientation}</p><button class="primary-button" type="button" data-practice-next="${stages[1]}">Start the introduction</button>`;
}

function renderPracticeWriting(visual, stage) {
  const key = practiceKey(visual.id, stage);
  const saved = getUnitState(key);
  const writing = saved.writing || "";
  const labels = {
    introduction: { prompt: "Write one accurate introductory sentence.", field: "Your introduction", action: "Keep this introduction" },
    overview: { prompt: "Write a short overview of the most important big-picture information.", field: "Your overview", action: "Keep this overview" },
    detail: { prompt: "Write at least one organised detail paragraph based on your grouping plan.", field: "Your detail paragraph", action: "Keep this paragraph" },
  };
  const copy = labels[stage];
  const feedback = {
    ...content.practice.aiFeedback[stage],
    visualId: visual.id,
    ...(stage === "detail" ? { additionalContext: getUnitState(practiceKey(visual.id, "grouping")).writing || "No grouping plan has been saved." } : {}),
  };
  return `${practiceStageNavigation(visual, stage)}
    <p class="prompt" id="${key}-prompt">${copy.prompt}</p>
    <label for="${key}-draft">${copy.field}</label>
    <textarea class="writing-area short-writing-area" id="${key}-draft" spellcheck="true">${escapeHTML(writing)}</textarea>
    <div class="writing-meta"><span>Your work saves on this device.</span><span data-practice-word-count>${wordCount(writing)} words</span></div>
    <div class="action-row"><button class="secondary-button" type="button" data-open-practice-help ${saved.helpLevel ? "hidden" : ""}>Need help?</button><button class="primary-button" type="button" data-save-practice-writing ${writing.trim() ? "" : "disabled"}>${copy.action}</button></div>
    ${practiceHelpMarkup(visual, stage, saved, Boolean(writing.trim()))}
    ${aiFeedbackMarkup(key, feedback, saved)}`;
}

function renderPracticeGrouping(visual) {
  const stage = "grouping";
  const key = practiceKey(visual.id, stage);
  const saved = getUnitState(key);
  const writing = saved.writing || "";
  return `${practiceStageNavigation(visual, stage)}
    <p class="prompt" id="${key}-prompt">Which information belongs together, and why?</p>
    <label for="${key}-draft">Your grouping plan</label>
    <textarea class="writing-area short-writing-area" id="${key}-draft" spellcheck="true">${escapeHTML(writing)}</textarea>
    <div class="writing-meta"><span>A concise plan is enough.</span><span data-practice-word-count>${wordCount(writing)} words</span></div>
    <div class="action-row"><button class="secondary-button" type="button" data-open-practice-help ${saved.helpLevel ? "hidden" : ""}>Need help?</button><button class="primary-button" type="button" data-save-practice-writing ${writing.trim() ? "" : "disabled"}>Keep this plan</button></div>
    ${practiceHelpMarkup(visual, stage, saved, Boolean(writing.trim()))}`;
}

function bindPracticeStage(visual, stage) {
  const stages = practiceStages(visual);
  const stageIndex = stages.indexOf(stage);
  document.querySelector("[data-practice-next]")?.addEventListener("click", (event) => {
    setPracticeStage(visual.id, event.currentTarget.dataset.practiceNext);
    render({ focus: true });
  });
  if (stage === "inspect") return;

  const key = practiceKey(visual.id, stage);
  const textarea = document.querySelector(`#${key}-draft`);
  const feedback = stage === "grouping" ? null : {
    ...content.practice.aiFeedback[stage],
    visualId: visual.id,
    ...(stage === "detail" ? { additionalContext: getUnitState(practiceKey(visual.id, "grouping")).writing || "" } : {}),
  };
  textarea.addEventListener("input", () => {
    setUnitState(key, { writing: textarea.value });
    document.querySelector("[data-practice-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-save-practice-writing]").disabled = !textarea.value.trim();
    const moreHelp = document.querySelector("[data-more-practice-help]");
    if (moreHelp && getUnitState(key).helpLevel === 2) moreHelp.disabled = !textarea.value.trim();
    if (feedback) trackAIRevision(key, textarea.value);
  });
  document.querySelector("[data-save-practice-writing]")?.addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    setUnitState(key, { writing: textarea.value, kept: true });
    if (stageIndex < stages.length - 1) setPracticeStage(visual.id, stages[stageIndex + 1]);
    else {
      const workspace = practiceWorkspaceState();
      setUnitState("practice", { completedVisuals: [...new Set([...workspace.completedVisuals, visual.id])] });
    }
    render({ focus: true });
  });
  document.querySelector("[data-open-practice-help]")?.addEventListener("click", () => {
    setUnitState(key, { helpLevel: 1 });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-more-practice-help]")?.addEventListener("click", () => {
    const current = getUnitState(key);
    if ((current.helpLevel || 1) === 2 && !textarea.value.trim()) return;
    setUnitState(key, { helpLevel: Math.min((current.helpLevel || 1) + 1, 3) });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-close-practice-help]")?.addEventListener("click", () => {
    setUnitState(key, { helpLevel: 0 });
    render();
  });
  if (feedback) bindAIFeedback(key, feedback, textarea);
}

function renderPractice(unit) {
  const workspace = practiceWorkspaceState();
  const visual = visualById(workspace.selectedVisual);
  const stages = practiceStages(visual);
  const stage = stages.includes(workspace.stageByVisual[visual.id]) ? workspace.stageByVisual[visual.id] : stages[0];
  const stageIndex = stages.indexOf(stage);
  const body = stage === "inspect" ? renderPracticeInspect(visual) : stage === "grouping" ? renderPracticeGrouping(visual) : renderPracticeWriting(visual, stage);
  const practiceComplete = workspace.completedVisuals.includes(visual.id);
  app.innerHTML = `<article aria-labelledby="unit-title">
    ${unitHeader(unit, "The core route is complete. Choose another canonical visual and practise only as much as you need; this workspace is optional.")}
    <div class="practice-selector" role="group" aria-label="Choose a practice visual">
      ${content.practice.visualIds.map((id) => {
        const item = visualById(id);
        return `<button type="button" data-practice-visual="${id}" aria-pressed="${id === visual.id}"><strong>${item.label}</strong><span>${content.practice.scopes[id]}</span>${workspace.completedVisuals.includes(id) ? "<small>Practice saved</small>" : ""}</button>`;
      }).join("")}
    </div>
    <div class="activity-layout writing-layout practice-workspace">${visualTaskSource(visual.id)}<section class="writing-pane" aria-live="polite">${body}${practiceComplete ? `<div class="completion-note"><h3>Practice saved</h3><p>Your ${visual.label.toLowerCase()} work remains available here. You can revise it or choose another visual.</p></div>` : ""}</section></div>
    <nav class="unit-navigation" aria-label="Optional-practice navigation">
      ${stageIndex > 0 ? `<button class="secondary-button" type="button" data-practice-previous="${stages[stageIndex - 1]}">Previous practice step</button>` : '<button class="secondary-button" type="button" data-nav="e5">Back to completed core</button>'}
      <p class="choice-note">Optional · your core completion is unchanged</p>
    </nav>
  </article>`;
  hydrateAcademicVisuals();
  document.querySelectorAll("[data-practice-visual]").forEach((button) => button.addEventListener("click", () => {
    setUnitState("practice", { selectedVisual: button.dataset.practiceVisual });
    render({ focus: true });
  }));
  document.querySelector("[data-practice-previous]")?.addEventListener("click", (event) => {
    setPracticeStage(visual.id, event.currentTarget.dataset.practicePrevious);
    render({ focus: true });
  });
  bindPracticeStage(visual, stage);
}

function renderRadioLearningUnit(id, unit, introduction, { principle = "", context = "" } = {}) {
  const source = content[id];
  const saved = getUnitState(id);
  const options = orderedOptions(id, source.options, source.shuffle);
  const selected = source.options.find((option) => option.id === saved.choice);
  const success = Boolean(saved.checked && selected?.viable);
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, introduction)}
      <div class="activity-layout">
        ${taskSource()}
        <section class="interaction-pane" aria-labelledby="${id}-prompt">
          ${context}
          <form id="${id}-form">
            <fieldset>
              <legend class="prompt" id="${id}-prompt">${source.prompt}</legend>
              <div class="choice-list">
                ${options
                  .map((option) =>
                    choiceMarkup({
                      type: "radio",
                      name: `${id}-choice`,
                      value: option.id,
                      text: option.text,
                      checked: saved.choice === option.id,
                      note: saved.checked && saved.choice === option.id ? option.note : "",
                    }),
                  )
                  .join("")}
              </div>
            </fieldset>
            <div class="action-row">
              <button class="primary-button" type="submit" ${saved.choice ? "" : "disabled"}>Check my judgement</button>
              ${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${saved.checked && selected ? feedbackMarkup(selected.note, success ? "success" : "reconsider") : ""}
          ${principle ? `<blockquote class="principle-panel"><p>${principle}</p></blockquote>` : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes(id) })}
    </article>`;
  hydrateCharts();
  const form = document.querySelector(`#${id}-form`);
  form.addEventListener("change", (event) => {
    setUnitState(id, { choice: event.target.value, checked: false });
    form.querySelector("button[type=submit]").disabled = false;
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

function renderMultipleLearningUnit(id, unit, introduction, { context = "" } = {}) {
  const source = content[id];
  const saved = getUnitState(id);
  const selected = saved.selected || [];
  const expected = source.options.filter((option) => option.expected).map((option) => option.id);
  const options = orderedOptions(id, source.options, source.shuffle);
  const success = saved.checked && selected.length === expected.length && expected.every((optionId) => selected.includes(optionId));
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, introduction)}
      <div class="activity-layout">
        ${taskSource()}
        <section class="interaction-pane" aria-labelledby="${id}-prompt">
          ${context}
          <form id="${id}-form">
            <fieldset>
              <legend class="prompt" id="${id}-prompt">${source.prompt}</legend>
              <p>Select every statement that works.</p>
              <div class="choice-list">
                ${options
                  .map((option) => choiceMarkup({ type: "checkbox", name: `${id}-choices`, value: option.id, text: option.text, checked: selected.includes(option.id) }))
                  .join("")}
              </div>
            </fieldset>
            <div class="action-row">
              <button class="primary-button" type="submit" ${selected.length ? "" : "disabled"}>Check my choices</button>
              ${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${saved.checked ? feedbackMarkup(success ? source.success : source.partial, success ? "success" : "reconsider") : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes(id) })}
    </article>`;
  hydrateCharts();
  bindCheckboxForm(id, `#${id}-form`, `${id}-choices`, (choices) => {
    const correct = choices.length === expected.length && expected.every((optionId) => choices.includes(optionId));
    if (correct) completeUnit(id);
  });
}

function renderD1(unit) {
  renderMultipleLearningUnit("d1", unit, "Read the figures, then express the relationships they reveal. Begin with meaning, not trend vocabulary.");
}

function renderD2(unit) {
  renderRadioLearningUnit("d2", unit, "Figures support an observation. They should not leave the reader to discover the pattern alone.", {
    principle: content.d2.principle,
  });
}

function renderD3(unit) {
  renderRadioLearningUnit("d3", unit, "A comparison is useful when the relationship helps the reader understand the data.", {
    principle: content.d3.principle,
  });
}

function renderD4(unit) {
  const source = content.d4;
  let saved = getUnitState("d4");
  if (saved.choice && !saved.assignments) {
    state.units.d4 = {};
    state.completed = state.completed.filter((id) => id !== "d4");
    saveState(state);
    saved = getUnitState("d4");
  }
  const assignments = saved.assignments || {};
  const rationale = saved.rationale || "";
  const items = orderedOptions("d4-items", source.items.options, source.items.shuffle);
  const allAssigned = source.items.options.every((item) => assignments[item.id]);
  const viable =
    allAssigned &&
    assignments.bus === assignments.bicycle &&
    assignments.car !== assignments.bus;
  const ready = allAssigned && rationale.trim();

  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "Put information together because it shares a useful relationship—not simply because it appears beside other information.")}
      <div class="activity-layout">
        ${taskSource()}
        <section class="interaction-pane" aria-labelledby="d4-prompt">
          <form id="d4-form">
            <h2 class="prompt" id="d4-prompt">${source.prompt}</h2>
            <div class="grouping-list">
              ${items
                .map(
                  (item) => `
                    <fieldset class="grouping-item">
                      <legend><strong>${item.label}</strong> <span>— ${item.trend}</span></legend>
                      <div class="grouping-options">
                        ${source.groups.options
                          .map((group) => choiceMarkup({
                            type: "radio",
                            name: `d4-${item.id}`,
                            value: group.id,
                            text: group.label,
                            checked: assignments[item.id] === group.id,
                          }))
                          .join("")}
                      </div>
                    </fieldset>`,
                )
                .join("")}
            </div>
            <label class="writing-label" for="d4-rationale">Why does your grouping help the reader?</label>
            <textarea id="d4-rationale" class="writing-area grouping-rationale" rows="3" placeholder="For example: These forms belong together because…">${escapeHTML(rationale)}</textarea>
            <p class="field-note">Your reason helps you test the plan. It is not automatically scored.</p>
            <div class="action-row">
              <button class="primary-button" type="submit" ${ready ? "" : "disabled"}>Check my grouping</button>
              ${saved.checked && !viable ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          ${saved.checked ? feedbackMarkup(viable ? source.feedback.viable : source.feedback.reconsider, viable ? "success" : "reconsider") : ""}
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes("d4") })}
    </article>`;
  hydrateCharts();

  const form = document.querySelector("#d4-form");
  const submit = form.querySelector("button[type=submit]");
  const updateReadiness = () => {
    const currentAssignments = Object.fromEntries(
      source.items.options.map((item) => [item.id, new FormData(form).get(`d4-${item.id}`)]),
    );
    const currentRationale = document.querySelector("#d4-rationale").value;
    submit.disabled = !(Object.values(currentAssignments).every(Boolean) && currentRationale.trim());
    setUnitState("d4", { assignments: currentAssignments, rationale: currentRationale, checked: false });
  };
  form.addEventListener("change", updateReadiness);
  document.querySelector("#d4-rationale").addEventListener("input", updateReadiness);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const currentAssignments = Object.fromEntries(
      source.items.options.map((item) => [item.id, new FormData(form).get(`d4-${item.id}`)]),
    );
    const currentRationale = document.querySelector("#d4-rationale").value;
    const groupingWorks =
      currentAssignments.bus === currentAssignments.bicycle &&
      currentAssignments.car !== currentAssignments.bus;
    setUnitState("d4", { assignments: currentAssignments, rationale: currentRationale, checked: true });
    if (groupingWorks) completeUnit("d4");
    render();
    focusAfterRender(".feedback");
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => {
    setUnitState("d4", { checked: false });
    render();
  });
}

function renderD5(unit) {
  renderRadioLearningUnit("d5", unit, "The graph can support more than one sensible organisation. Choose the grouping you would find easier to explain.");
}

function renderE1(unit) {
  const source = content.e1;
  const saved = getUnitState("e1");
  const viewed = saved.viewed || [];
  const activeId = saved.activeStage || source.stages[0].id;
  const active = source.stages.find((stage) => stage.id === activeId);
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "A dependable paragraph develops one information group. Explore what each part contributes.")}
      <blockquote class="principle-panel"><p>${source.recommendation}</p><p><strong>This is our strategy, not an official IELTS rule.</strong></p></blockquote>
      <div class="activity-layout">
        ${taskSource()}
        <section class="interaction-pane" aria-labelledby="e1-structure">
          <h2 class="prompt" id="e1-structure">Explore the paragraph architecture</h2>
          <div class="stage-inspector" aria-label="Paragraph stages">
            ${source.stages
              .map((stage) => `<button type="button" data-stage="${stage.id}" aria-pressed="${stage.id === activeId}"><strong>${stage.label}</strong><br><span>${stage.question}</span></button>`)
              .join("")}
          </div>
          <section class="model-panel" aria-live="polite">
            <h3>${active.label}</h3>
            <p>${active.question}</p>
            <p class="language-example">${active.example}</p>
          </section>
          <p class="choice-note">${viewed.length} of ${source.stages.length} parts explored.</p>
        </section>
      </div>
      ${navigationMarkup({ canContinue: state.completed.includes("e1") })}
    </article>`;
  hydrateCharts();
  document.querySelectorAll("[data-stage]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextViewed = [...new Set([...viewed, button.dataset.stage])];
      setUnitState("e1", { activeStage: button.dataset.stage, viewed: nextViewed });
      if (nextViewed.length === source.stages.length) completeUnit("e1");
      render();
      focusAfterRender(".model-panel h3");
    });
  });
}

function renderE2(unit) {
  renderRadioLearningUnit("e2", unit, "A focus sentence should establish the main relationship the paragraph will develop.");
}

function renderE3(unit) {
  renderMultipleLearningUnit("e3", unit, "Development reports, compares and supports. It does not invent explanations the graph does not provide.", {
    context: `<blockquote class="principle-panel"><p><strong>Focus:</strong> ${content.e3.focus}</p></blockquote>`,
  });
}

function renderE4(unit) {
  renderRadioLearningUnit("e4", unit, "A paragraph is complete when its information group is clear. A special final sentence is not compulsory.", {
    context: `<div class="weak-paragraph"><p>${content.e4.paragraph}</p></div>`,
    principle: content.e4.principle,
  });
}

function detailModelMarkup() {
  return `
    <section class="model-panel" aria-labelledby="detail-model-heading">
      <h3 id="detail-model-heading" tabindex="-1">Compare with a teaching example</h3>
      <p class="language-example">${content.e5.example}</p>
      <p>The example reorganises the same figures. It does not add an explanation for the changes.</p>
      <ul class="reflection-list">${content.e5.reflection.map((item) => `<li>${item}</li>`).join("")}</ul>
    </section>`;
}

function renderE5(unit) {
  const saved = getUnitState("e5");
  const draft = state.drafts.detailParagraph;
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "The information below is accurate but list-like. Reorganise it so the relationship and evidence are easier to follow.")}
      <div class="activity-layout writing-layout">
        ${taskSource()}
        <section class="writing-pane" aria-labelledby="e5-prompt">
          <div class="weak-paragraph"><h2>Accurate, but not organised helpfully</h2><p>${content.e5.weakParagraph}</p></div>
          <p class="prompt" id="e5-prompt">${content.e5.prompt}</p>
          <label for="detail-draft">Your detail paragraph</label>
          <textarea class="writing-area" id="detail-draft" spellcheck="true">${escapeHTML(draft)}</textarea>
          <div class="writing-meta"><span>Use the same information.</span><span data-word-count>${wordCount(draft)} words</span></div>
          <div class="action-row">
            <button class="secondary-button" type="button" data-open-help ${saved.helpLevel ? "hidden" : ""}>Need help?</button>
            <button class="secondary-button" type="button" data-compare-detail ${draft.trim() ? "" : "disabled"}>Compare with an example</button>
          </div>
          ${helpMarkup("e5", content.e5, 4)}
          ${saved.modelViewed && saved.helpLevel !== 4 ? detailModelMarkup() : ""}
          ${saved.modelViewed ? `<p class="choice-note">${saved.revised ? "You have revised your original paragraph." : "Your original paragraph is preserved. Revise it only where you see a useful reason."}</p>` : ""}
          ${aiFeedbackMarkup("e5", content.e5.aiFeedback, saved)}
          <blockquote class="principle-panel"><p>${content.e5.principle}</p></blockquote>
        </section>
      </div>
      ${state.completed.includes("e5") ? '<div class="completion-note"><h2 tabindex="-1">Core workshop complete</h2><p>You interpreted, grouped, compared, supported and reorganised the graph information. Optional transfer practice is now available.</p></div>' : ""}
      ${state.completed.includes("e5")
        ? '<nav class="unit-navigation" aria-label="Learning-unit navigation"><button class="secondary-button" type="button" data-nav="e4">Back</button><button class="primary-button" type="button" data-nav="practice">Explore more practice</button></nav>'
        : navigationMarkup({ canContinue: Boolean(saved.modelViewed && draft.trim()), final: true })}
    </article>`;
  hydrateCharts();
  const textarea = document.querySelector("#detail-draft");
  textarea.addEventListener("input", () => {
    saveDraft("detailParagraph", textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-compare-detail]").disabled = !textarea.value.trim();
    if (saved.modelViewed && textarea.value !== state.drafts.detailInitial) setUnitState("e5", { revised: true });
    const finish = document.querySelector("[data-finish]");
    if (finish) finish.disabled = !(saved.modelViewed && textarea.value.trim());
    trackAIRevision("e5", textarea.value);
  });
  document.querySelector("[data-compare-detail]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft("detailParagraph", textarea.value);
    if (!state.drafts.detailInitial) state.drafts.detailInitial = textarea.value;
    setUnitState("e5", { modelViewed: true });
    saveState(state);
    render();
    focusAfterRender("#detail-model-heading");
  });
  document.querySelector("[data-finish]")?.addEventListener("click", () => {
    if (!textarea.value.trim() || !getUnitState("e5").modelViewed) return;
    saveDraft("detailParagraph", textarea.value);
    completeUnit("e5");
    render();
    focusAfterRender(".completion-note h2");
  });
  bindHelp(
    "e5",
    content.e5,
    4,
    () => Boolean(textarea.value.trim()),
    { draft: "detailParagraph", initial: "detailInitial" },
  );
  bindAIFeedback("e5", content.e5.aiFeedback, textarea);
}

function render({ focus = false } = {}) {
  const unit = content.units.find((item) => item.id === state.currentUnit) || content.units[0];
  state.currentUnit = unit.id;
  renderProgress();
  const renderers = {
    a0: renderA0,
    a1: renderA1,
    a2: renderA2,
    b1: renderB1,
    b2: renderB2,
    b4: renderB4,
    c1: renderC1,
    c2: renderC2,
    c4: renderC4,
    c5: renderC5,
    c6: renderC6,
    c7: renderC7,
    c8: renderC8,
    c9: renderC9,
    c10: renderC10,
    c11: renderC11,
    d1: renderD1,
    d2: renderD2,
    d3: renderD3,
    d4: renderD4,
    d5: renderD5,
    e1: renderE1,
    e2: renderE2,
    e3: renderE3,
    e4: renderE4,
    e5: renderE5,
    practice: renderPractice,
  };
  renderers[unit.id](unit);
  bindNavigation();
  if (focus) {
    document.querySelector("#unit-title")?.setAttribute("tabindex", "-1");
    document.querySelector("#unit-title")?.focus({ preventScroll: true });
    document.querySelector("#learning-unit")?.scrollIntoView({ block: "start" });
  }
}

resetButton.addEventListener("click", () => {
  const hasWriting = Boolean(
    Object.values(state.drafts).some((value) => typeof value === "string" && value.trim())
    || Object.values(state.units).some((unit) => typeof unit?.writing === "string" && unit.writing.trim()),
  );
  const message = hasWriting
    ? "Reset this workshop? Your saved introduction, overview, detail paragraph and progress will be erased from this device."
    : "Reset this workshop progress?";
  if (!window.confirm(message)) return;
  state = clearState();
  history.replaceState({ unit: "a0" }, "", "#a0");
  render({ focus: true });
});

window.addEventListener("popstate", () => {
  const requested = window.location.hash.slice(1);
  if (unitIndex(requested) >= 0 && canVisit(unitIndex(requested))) {
    state.currentUnit = requested;
    saveState(state);
    render({ focus: true });
  }
});

const requestedUnit = window.location.hash.slice(1);
if (unitIndex(requestedUnit) >= 0 && canVisit(unitIndex(requestedUnit))) state.currentUnit = requestedUnit;
history.replaceState({ unit: state.currentUnit }, "", `#${state.currentUnit}`);
render();
