import { prototypeContent as content } from "../../content/writing/academic-prototype.js?v=academic-complete-1";
import { renderAcademicChart } from "../visuals/academic-prototype-chart.js";
import { renderAcademicVisual } from "../visuals/academic-visual-set.js";
import { renderExplorerTaskVisual } from "../visuals/academic-explorer-visuals.js?v=academic-complete-1";
import { isValidStoredOrder, shuffleOptionIds } from "./randomise.js";
import { buildAIFeedbackPrompt, copyText } from "./ai-feedback.js?v=academic-complete-1";
import { clearState, loadState, saveState } from "./storage.js";

const app = document.querySelector("#app");
const progress = document.querySelector("#unit-progress");
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

if (state.openingVersion < 2) {
  state.openingVersion = 2;
  if (["a1", "a2"].includes(state.currentUnit)) state.currentUnit = "a0";
  state.completed = state.completed.filter((id) => !["a0", "a1", "a2"].includes(id));
  delete state.units.a1;
  delete state.units.a2;
  saveState(state);
}

if (state.structurePageVersion < 1) {
  state.structurePageVersion = 1;
  delete state.units.b1;
  state.completed = state.completed.filter((id) => id !== "b1");
  saveState(state);
}

if (state.introductionPageVersion < 1) {
  const previousIntroduction = typeof state.drafts.introduction === "string" ? state.drafts.introduction : "";
  state.introductionPageVersion = 1;
  if (state.currentUnit === "b4") state.currentUnit = "b2";
  delete state.units.b2;
  delete state.units.b4;
  state.units.b2 = previousIntroduction.trim() ? { coolWriting: previousIntroduction } : {};
  state.completed = state.completed.filter((id) => !["b2", "b4"].includes(id));
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

if (state.overviewPageVersion < 1) {
  state.overviewPageVersion = 1;
  ["c1", "c2", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11"].forEach((id) => {
    delete state.units[id];
  });
  state.completed = state.completed.filter((id) => !["c1", "c2", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11"].includes(id));
  if (["c1", "c2", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11"].includes(state.currentUnit)) state.currentUnit = "c1";
  saveState(state);
}

if (state.overviewVisualVersion < 1) {
  const previousReactions = state.units.c2 && typeof state.units.c2 === "object" ? state.units.c2 : {};
  const previousWriting = state.units.c6 && typeof state.units.c6 === "object" ? state.units.c6 : {};
  state.overviewVisualVersion = 1;
  state.units.c2 = previousReactions?.reactionOrders ? { reactionOrders: previousReactions.reactionOrders } : {};
  state.units.c5 = {};
  state.units.c6 = {
    helpLevel: previousWriting.helpLevel || 0,
    legacySpicyWriting: previousWriting.spicyWriting || "",
    legacyAiState: {
      aiFeedbackOpen: previousWriting.aiFeedbackOpen || false,
      aiPromptCopied: previousWriting.aiPromptCopied || false,
      aiOriginal: previousWriting.aiOriginal || "",
      aiRevised: previousWriting.aiRevised || false,
      aiReflection: previousWriting.aiReflection || "",
    },
  };
  state.completed = state.completed.filter((id) => !["c2", "c5", "c6"].includes(id));
  saveState(state);
}

if (state.detailsPageVersion < 1) {
  const previousDetailParagraph = typeof state.drafts.detailParagraph === "string" ? state.drafts.detailParagraph : "";
  state.detailsPageVersion = 1;
  if (previousDetailParagraph.trim() && !state.drafts.legacyDetailParagraph?.trim()) {
    state.drafts.legacyDetailParagraph = previousDetailParagraph;
  }
  state.drafts.detailsParagraph = typeof state.drafts.detailsParagraph === "string" ? state.drafts.detailsParagraph : "";
  ["d1", "d2", "d3", "d4", "d5", "e1", "e2", "e3", "e4", "e5", "details-connect", "details-build"].forEach((id) => {
    delete state.units[id];
  });
  state.completed = state.completed.filter((id) => !["d1", "d2", "d3", "d4", "d5", "e1", "e2", "e3", "e4", "e5"].includes(id));
  if (["d1", "d2", "d3", "d4", "d5", "e1", "e2", "e3", "e4", "e5"].includes(state.currentUnit)) state.currentUnit = "d1";
  saveState(state);
}

if (state.detailsPageVersion < 2) {
  state.detailsPageVersion = 2;
  state.drafts.detailsMapWriting = typeof state.drafts.detailsMapWriting === "string" ? state.drafts.detailsMapWriting : "";
  state.drafts.detailsProcessWriting = typeof state.drafts.detailsProcessWriting === "string" ? state.drafts.detailsProcessWriting : "";
  if (state.units.d1?.reactions) {
    const reactions = { ...state.units.d1.reactions };
    delete reactions["select-matcha-difference"];
    state.units.d1 = { ...state.units.d1, reactions };
  }
  if (state.currentUnit === "practice") state.currentUnit = "d1";
  saveState(state);
}

if (["c2", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11"].includes(state.currentUnit)) {
  state.currentUnit = "c1";
  saveState(state);
}

const unitIndex = (id) => content.units.findIndex((unit) => unit.id === id);
const resolveUnitId = (id) => (["a1", "a2"].includes(id)
  ? "a0"
  : id === "b4"
    ? "b2"
    : ["c2", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11"].includes(id)
      ? "c1"
      : ["d2", "d3", "d4", "d5", "e1", "e2", "e3", "e4", "e5", "practice", "p0", "more-practice"].includes(id)
        ? "d1"
        : id);
const getUnitState = (id) => state.units[id] || {};
const escapeHTML = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const feedbackCommentMarkup = (value) =>
  escapeHTML(value).replace(/(&quot;.*?&quot;)/g, "<strong>$1</strong>");

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
  return index >= 0 && index < content.units.length;
}

function renderProgress() {
  progress.replaceChildren();
  const sections = [
    { id: "intro", label: "Overview" },
    { id: "details", label: "Details" },
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
    button.dataset.complete = String(sectionUnits.every((unit) => state.completed.includes(unit.id)));
    button.textContent = section.label;
    if (current?.section === section.id) button.setAttribute("aria-current", "step");
    button.addEventListener("click", () => navigateTo(firstUnit.id));
    item.append(button);
    progress.append(item);
  });
  let activityJump = document.querySelector("#activity-jump");
  if (!activityJump) {
    const wrapper = document.createElement("details");
    wrapper.className = "activity-jump";
    const summary = document.createElement("summary");
    summary.textContent = "Activities";
    const panel = document.createElement("div");
    panel.className = "activity-menu-panel";
    const label = document.createElement("label");
    label.htmlFor = "activity-jump";
    label.textContent = "Choose an activity";
    activityJump = document.createElement("select");
    activityJump.id = "activity-jump";
    panel.append(label, activityJump, resetButton);
    wrapper.append(summary, panel);
    progress.after(wrapper);
    activityJump.addEventListener("change", () => {
      wrapper.removeAttribute("open");
      navigateTo(activityJump.value);
    });
  }
  activityJump.replaceChildren();
  sections.forEach((section) => {
    const group = document.createElement("optgroup");
    group.label = section.label;
    content.units
      .filter((unit) => unit.section === section.id)
      .forEach((unit) => {
        const option = document.createElement("option");
        option.value = unit.id;
        option.textContent = unit.label;
        group.append(option);
      });
    activityJump.append(group);
  });
  activityJump.value = state.currentUnit;
}

function navigateTo(id, { focus = true } = {}) {
  if (unitIndex(id) < 0 || !canVisit(unitIndex(id))) return;
  state.currentUnit = id;
  saveState(state);
  const hash = `#${id}`;
  if (window.location.hash !== hash) history.pushState({ unit: id }, "", hash);
  render({ focus });
}

function unitHeader(unit, introduction, { showEyebrow = true, visuallyHiddenTitle = false, compact = false } = {}) {
  const classes = ["unit-header", compact ? "unit-header--compact" : "", visuallyHiddenTitle ? "unit-header--visual" : ""]
    .filter(Boolean)
    .join(" ");
  return `
    <header class="${classes}" data-section="${unit.section}">
      ${showEyebrow ? `<p class="eyebrow">${unit.eyebrow}</p>` : ""}
      <h1 id="unit-title" class="${visuallyHiddenTitle ? "visually-hidden" : ""}">${unit.label}</h1>
      ${introduction ? `<p class="lead">${introduction}</p>` : ""}
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

function visualTaskSource(visualId, { open = true, showInstruction = true } = {}) {
  const visual = visualById(visualId);
  return `
    <details class="source-pane" ${open ? "open" : ""}>
      <summary>View task and visual</summary>
      <div class="task-copy"><p>${visual.taskStatement}</p>${showInstruction ? `<p>${visual.taskInstruction}</p>` : ""}</div>
      <div data-academic-visual="${visualId}" data-reveal-overview="false"></div>
    </details>`;
}

function explorerTaskById(id) {
  return content.a0.tasks.find((task) => task.id === id);
}

function overviewTaskVisual(taskId, { showStatement = false } = {}) {
  const task = explorerTaskById(taskId);
  return `
    <div class="overview-visual-reference" data-overview-task="${taskId}">
      ${showStatement ? `<p class="overview-task-statement">${task.taskStatement}</p>` : ""}
      <div class="explorer-visual-host overview-explorer-visual" data-explorer-task="${taskId}"></div>
    </div>`;
}

function hydrateCharts() {
  document.querySelectorAll("[data-chart-host]").forEach((host) => renderAcademicChart(host, content.dataset));
}

function visualById(id) {
  return content.academicVisuals.find((visual) => visual.id === id) || explorerTaskById(id);
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

function hydrateExplorerTaskVisuals() {
  document.querySelectorAll("[data-explorer-task]").forEach((host) => {
    const task = content.a0.tasks.find((item) => item.id === host.dataset.explorerTask);
    if (task) renderExplorerTaskVisual(host, task, { compact: host.dataset.compact === "true" });
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
          ? `<button class="primary-button" type="button" data-finish ${canContinue ? "" : "disabled"}>Finish workshop</button>`
          : next
            ? `<button class="primary-button" type="button" data-nav="${next.id}">Continue</button>`
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
  const selectedTask = source.tasks.find((task) => task.id === saved.selectedId || task.slug === saved.selectedId) || source.tasks[0];
  if (saved.selectedId !== selectedTask.id) setUnitState("a0", { selectedId: selectedTask.id });
  const modelParagraphs = selectedTask.model
    .split(/\n\n+/)
    .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
    .join("");

  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "Explore the visuals, then practise introductions, overviews and details in this complete IELTS Academic Writing Task 1 workshop.", { showEyebrow: false, visuallyHiddenTitle: true, compact: true })}
      <div class="visual-explorer" aria-label="Academic Task 1 visual forms">
        <div class="visual-selector">
          ${source.tasks
            .map((task) => {
              return `<div class="visual-select-item" data-selected="${task.id === selectedTask.id}">
                <div class="visual-preview" data-explorer-task="${task.id}" data-compact="true" aria-hidden="true"></div>
                <strong>${task.label}</strong>
                <button type="button" class="visual-select-button" data-select-task="${task.id}" aria-pressed="${task.id === selectedTask.id}" aria-label="Open ${task.label}: ${task.whatItShows}"></button>
              </div>`;
            })
            .join("")}
        </div>
        <section class="visual-focus visual-explorer-focus" aria-live="polite" aria-labelledby="visual-focus-title">
          <p class="eyebrow">${selectedTask.label}</p>
          <h2 id="visual-focus-title" tabindex="-1">${selectedTask.title}</h2>
          <div class="explorer-task-prompt">
            <p>${selectedTask.taskStatement}</p>
          </div>
          <div class="explorer-visual-host" data-explorer-task="${selectedTask.id}"></div>
          <p><a class="primary-button" href="../../task-2/submit/?task=academic-task-1&amp;question=${selectedTask.id}">Submit an answer to this task</a></p>
          <div class="visual-orientation">
            <section>
              <h3>What does this show?</h3>
              <p>${selectedTask.whatItShows}</p>
            </section>
            <section>
              <h3>What should you do?</h3>
              <p>${selectedTask.whatToDo}</p>
            </section>
          </div>
          <details class="explorer-depth explorer-model">
            <summary>See a realistic student answer</summary>
            <div class="student-model">
              <header><h3>${selectedTask.student.name}</h3><p>Estimated Band ${selectedTask.student.band}</p></header>
              <div class="student-model-writing">${modelParagraphs}</div>
              <p class="model-note">This is one possible student response. Other valid answers are possible.</p>
              <details class="explorer-depth examiner-feedback">
                <summary>See examiner feedback</summary>
                <div class="criteria-feedback">
                  ${selectedTask.feedback.map((criterion) => `<section><h4>${criterion.label} <span>Band ${criterion.band}</span></h4><p>${feedbackCommentMarkup(criterion.comment)}</p></section>`).join("")}
                </div>
              </details>
            </div>
          </details>
        </section>
      </div>
      <p class="estimated-band-disclaimer">${source.estimatedBandDisclaimer}</p>
      <nav class="unit-navigation" aria-label="Learning-unit navigation">
        <span></span>
        <button class="primary-button" type="button" data-nav="b1">Next: Your Task 1 answer</button>
      </nav>
    </article>`;
  hydrateExplorerTaskVisuals();
  document.querySelectorAll("[data-select-task]").forEach((button) => {
    button.addEventListener("click", () => {
      setUnitState("a0", { selectedId: button.dataset.selectTask });
      render();
      focusAfterRender("#visual-focus-title");
    });
  });
}

function renderB1(unit) {
  const saved = getUnitState("b1");
  const selections = saved.selections && typeof saved.selections === "object" ? saved.selections : {};
  const feedbackFor = (paragraph, selected) => {
    if (!selected) return "";
    const explanation = paragraph.answer === "Introduction"
      ? "It says what the task shows."
      : paragraph.answer === "Overview"
        ? "It gives the big picture."
        : "It gives specific information.";
    return selected === paragraph.answer
      ? explanation
      : `Not quite. This is ${paragraph.answer} — ${explanation.charAt(0).toLowerCase()}${explanation.slice(1)}`;
  };
  app.innerHTML = `
    <article aria-labelledby="unit-title">
      ${unitHeader(unit, "", { showEyebrow: false, visuallyHiddenTitle: true, compact: true })}
      <div class="answer-structure-layout">
        <figure class="answer-structure-visual">
          <img src="${content.b1.image.src}" alt="${content.b1.image.alt}" width="1222" height="1287" />
        </figure>
        <section class="structure-recognition" aria-labelledby="b1-prompt">
          <h2 class="prompt" id="b1-prompt">${content.b1.prompt}</h2>
          <div class="structure-paragraphs">
            ${content.b1.paragraphs.map((paragraph, index) => {
            const selected = selections[paragraph.id] || "";
            const feedback = feedbackFor(paragraph, selected);
            const surfaceId = `${paragraph.id}-classifier`;
            return `
              <article class="structure-paragraph" aria-labelledby="${paragraph.id}-title">
                <header class="structure-paragraph-header">
                  <div class="structure-paragraph-identity">
                    <h3 id="${paragraph.id}-title">${index + 1} · ${paragraph.student}</h3>
                    <p>${paragraph.task}</p>
                  </div>
                  <div class="attached-classifier" data-attached-classifier="${paragraph.id}">
                    <button
                      class="attached-classifier-trigger${selected ? " is-selected" : ""}"
                      type="button"
                      data-classifier-trigger
                      aria-expanded="false"
                      aria-controls="${surfaceId}"
                      aria-describedby="${paragraph.id}-feedback"
                      aria-label="${selected ? `Current classification for ${paragraph.student}'s paragraph: ${selected}. Change classification` : `Classify ${paragraph.student}'s paragraph`}">
                      <span data-classifier-label>${selected || "Classify"}</span>
                      <span aria-hidden="true">▾</span>
                    </button>
                    <div class="attached-classifier-surface" id="${surfaceId}" data-classifier-surface hidden>
                      <fieldset aria-describedby="${paragraph.id}-feedback">
                        <legend>Classify ${paragraph.student}'s paragraph</legend>
                        <div class="attached-classifier-choices">
                          ${content.b1.choices.map((choice) => `
                            <label>
                              <input type="radio" name="${paragraph.id}" value="${choice}" data-structure-choice="${paragraph.id}" ${selected === choice ? "checked" : ""} />
                              <span>${choice}</span>
                            </label>`).join("")}
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </header>
                <p class="student-paragraph">${escapeHTML(paragraph.text)}</p>
                <p class="structure-feedback" id="${paragraph.id}-feedback" role="status" aria-live="polite" data-kind="${selected === paragraph.answer ? "success" : "reconsider"}" ${feedback ? "" : "hidden"}>${feedback}</p>
              </article>`;
            }).join("")}
          </div>
        </section>
      </div>
      <p class="structure-takeaway"><strong>The difference is what the paragraph does — not how long it is.</strong></p>
      <nav class="unit-navigation" aria-label="Learning-unit navigation">
        <button class="secondary-button" type="button" data-nav="a0">Back</button>
        <button class="primary-button" type="button" data-nav="b2">Next: Introduction</button>
      </nav>
    </article>`;
  const classifiers = [...document.querySelectorAll("[data-attached-classifier]")];
  const closeClassifier = (classifier, { restoreFocus = false } = {}) => {
    const trigger = classifier.querySelector("[data-classifier-trigger]");
    const surface = classifier.querySelector("[data-classifier-surface]");
    if (surface.hidden) return;
    surface.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    if (restoreFocus) trigger.focus();
  };
  const closeOtherClassifiers = (current) => {
    classifiers.forEach((classifier) => {
      if (classifier !== current) closeClassifier(classifier);
    });
  };
  classifiers.forEach((classifier) => {
    const trigger = classifier.querySelector("[data-classifier-trigger]");
    const surface = classifier.querySelector("[data-classifier-surface]");
    trigger.addEventListener("click", () => {
      const shouldOpen = surface.hidden;
      closeOtherClassifiers(classifier);
      surface.hidden = !shouldOpen;
      trigger.setAttribute("aria-expanded", String(shouldOpen));
      if (shouldOpen) (surface.querySelector("input:checked") || surface.querySelector("input"))?.focus();
    });
    surface.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeClassifier(classifier, { restoreFocus: true });
    });
  });
  document.querySelectorAll("[data-structure-choice]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        input.closest("[data-attached-classifier]").dataset.radioArrowNavigation = "true";
      }
    });
    input.addEventListener("change", () => {
      const paragraph = content.b1.paragraphs.find((item) => item.id === input.dataset.structureChoice);
      const updatedSelections = { ...getUnitState("b1").selections, [paragraph.id]: input.value };
      setUnitState("b1", { selections: updatedSelections });
      if (content.b1.paragraphs.every((item) => updatedSelections[item.id])) completeUnit("b1");
      const classifier = input.closest("[data-attached-classifier]");
      const trigger = classifier.querySelector("[data-classifier-trigger]");
      classifier.querySelector("[data-classifier-label]").textContent = input.value;
      trigger.classList.add("is-selected");
      trigger.setAttribute("aria-label", `Current classification for ${paragraph.student}'s paragraph: ${input.value}. Change classification`);
      const feedback = document.getElementById(`${paragraph.id}-feedback`);
      feedback.textContent = feedbackFor(paragraph, input.value);
      feedback.dataset.kind = input.value === paragraph.answer ? "success" : "reconsider";
      feedback.hidden = false;
    });
    input.addEventListener("click", () => {
      const classifier = input.closest("[data-attached-classifier]");
      if (classifier.dataset.radioArrowNavigation === "true") {
        delete classifier.dataset.radioArrowNavigation;
        return;
      }
      closeClassifier(classifier, { restoreFocus: true });
    });
  });
  document.querySelector(".structure-recognition").addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-attached-classifier]")) return;
    classifiers.forEach((classifier) => closeClassifier(classifier));
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

function introductionTaskMarkup(taskId, { showTaskInstruction = false } = {}) {
  const task = content.a0.tasks.find((item) => item.id === taskId);
  const visualClass = task.visualKind === "process" ? " introduction-task-visual--process" : "";
  return `
    <div class="introduction-task">
      <div class="task-copy">
        <p>${task.taskStatement}</p>
        ${showTaskInstruction ? `<p class="task-instruction">${task.taskInstruction}</p>` : ""}
      </div>
      <div class="introduction-task-visual explorer-visual-host${visualClass}" data-explorer-task="${task.id}"></div>
    </div>`;
}

function levelReactionMarkup(level, { description = false, attached = false, imageOnly = false, decorative = false } = {}) {
  const source = content.b2.levels[level];
  return `
    <span class="level-reaction level-reaction--${level} ${attached ? "level-reaction--attached" : ""} ${imageOnly ? "level-reaction--image-only" : ""}" ${imageOnly && !decorative ? `role="img" aria-label="${source.label}"` : ""} ${decorative ? 'aria-hidden="true"' : ""}>
      <span class="level-reaction__bubble"><img src="${source.image}" alt="" width="26" height="26" /></span>
      ${imageOnly ? "" : `<span class="level-reaction__copy"><strong>${source.label}</strong>${description ? `<small>${source.description}</small>` : ""}</span>`}
    </span>`;
}

function reactionControlMarkup(level, exampleId, selected) {
  const source = content.b2.levels[level];
  return `<label class="reaction-control" title="${source.label}">
    <input type="radio" name="${exampleId}" value="${level}" data-classify-introduction="${exampleId}" aria-label="${source.label}" ${selected === level ? "checked" : ""} />
    <span class="reaction-control__visual" aria-hidden="true"><img src="${source.image}" alt="" width="26" height="26" /></span>
  </label>`;
}

function introductionChoiceOrder(exampleId) {
  const ids = content.b2.stages.classify.choices;
  const saved = getUnitState("b2");
  const stored = saved.classificationOrders?.[exampleId];
  if (isValidStoredOrder(stored, ids)) return stored;
  const order = shuffleOptionIds(ids);
  setUnitState("b2", {
    classificationOrders: { ...(saved.classificationOrders || {}), [exampleId]: order },
  });
  return order;
}

function introductionBuildOrder(level) {
  const chunks = content.b2.stages.build[level];
  const ids = chunks.map((chunk) => chunk.id);
  const saved = getUnitState("b2");
  const stored = saved.buildOrders?.[level];
  if (isValidStoredOrder(stored, ids)) return stored;
  const order = shuffleOptionIds(ids);
  setUnitState("b2", { buildOrders: { ...(saved.buildOrders || {}), [level]: order } });
  return order;
}

function classificationFeedback(example, selected) {
  if (!selected) return "";
  const correct = selected === example.answer;
  const messages = {
    cool: correct ? "Simple, clear and does the job." : "Not quite. This one is Cool — simple, clear and successful.",
    spicy: correct ? "Clear, with a little more language range." : "Not quite. This one is Spicy — clear, with a little more language range.",
    splat: correct ? "This doesn’t describe the visual information properly." : "Not quite. This one is Splat — it misses the job.",
  };
  return `${messages[example.answer]}${example.answer === "splat" && example.reason ? ` ${example.reason}` : ""}`;
}

function buildActivityMarkup(level, saved) {
  const chunks = content.b2.stages.build[level];
  const byId = new Map(chunks.map((chunk) => [chunk.id, chunk]));
  const order = introductionBuildOrder(level);
  const expected = chunks.map((chunk) => chunk.id);
  const correct = order.every((id, index) => id === expected[index]);
  const checked = Boolean(saved.buildChecked?.[level]);
  return `
    <div class="chunk-builder" data-build-level="${level}">
      <p class="chunk-sentence" aria-label="Current sentence">${order.map((id) => escapeHTML(byId.get(id).text)).join(" ")}.</p>
      <ol class="chunk-order">
        ${order.map((id, index) => `
          <li data-build-item="${id}" tabindex="-1">
            <span>${escapeHTML(byId.get(id).text)}</span>
            <span class="chunk-actions">
              <button class="text-button chunk-move-button" type="button" data-move-chunk="${id}" data-build-level="${level}" data-direction="earlier" aria-label="Move earlier" title="Move earlier" ${index === 0 ? "disabled" : ""}><span aria-hidden="true">↑</span></button>
              <button class="text-button chunk-move-button" type="button" data-move-chunk="${id}" data-build-level="${level}" data-direction="later" aria-label="Move later" title="Move later" ${index === order.length - 1 ? "disabled" : ""}><span aria-hidden="true">↓</span></button>
            </span>
          </li>`).join("")}
      </ol>
      <button class="secondary-button" type="button" data-check-build="${level}">Check my order</button>
      <p class="structure-feedback" role="status" aria-live="polite" data-build-feedback="${level}" data-kind="${correct ? "success" : "reconsider"}" ${checked ? "" : "hidden"}>${correct ? "This introduction does the job." : "Keep arranging the chunks so they make one clear sentence."}</p>
    </div>`;
}

function renderB2(unit) {
  const saved = getUnitState("b2");
  const stages = content.b2.stages;
  const classifications = saved.classifications || {};
  app.innerHTML = `
    <article class="introduction-page" aria-labelledby="unit-title">
      ${unitHeader(unit, content.b2.instruction, { showEyebrow: false, compact: true })}
      <section class="level-key" aria-label="Cool, Spicy and Splat meanings">
        ${["cool", "spicy", "splat"].map((level) => `<div>${levelReactionMarkup(level, { description: true })}</div>`).join("")}
      </section>

      <section class="introduction-stage" aria-labelledby="intro-see-heading">
        <h2 id="intro-see-heading">See it</h2>
        ${introductionTaskMarkup(stages.see.taskId, { showTaskInstruction: true })}
        <div class="introduction-examples introduction-examples-two">
          ${stages.see.examples.map((example) => `
            <div class="introduction-example" data-level="${example.level}">
              <div class="introduction-answer-card">
                <p>${example.text}</p>
                ${levelReactionMarkup(example.level, { attached: true, imageOnly: true })}
              </div>
            </div>`).join("")}
        </div>
      </section>

      <section class="introduction-stage" aria-labelledby="intro-misses-heading">
        <h2 id="intro-misses-heading">See what misses</h2>
        ${introductionTaskMarkup(stages.misses.taskId)}
        <div class="introduction-examples introduction-examples-three">
          ${stages.misses.examples.map((example) => `
            <div class="introduction-example" data-level="${example.level}">
              <div class="introduction-answer-card">
                <p>${example.text}</p>
                ${levelReactionMarkup(example.level, { attached: true, imageOnly: true })}
              </div>
              ${example.reason ? `<p class="splat-reason">${example.reason}</p>` : "<small>Simple, clear and does the job.</small>"}
            </div>`).join("")}
        </div>
      </section>

      <section class="introduction-stage" aria-labelledby="intro-classify-heading">
        <h2 id="intro-classify-heading">Cool, Spicy or Splat?</h2>
        ${introductionTaskMarkup(stages.classify.taskId)}
        <div class="classification-list">
          ${stages.classify.examples.map((example, index) => {
            const selected = classifications[example.id] || "";
            const feedback = classificationFeedback(example, selected);
            const order = introductionChoiceOrder(example.id);
            return `
              <article class="classification-item">
                <p class="classification-question"><strong>${index + 1}.</strong> ${example.text}</p>
                <fieldset aria-describedby="${example.id}-feedback">
                  <legend class="visually-hidden">Classify introduction ${index + 1}</legend>
                  <div class="reaction-controls" aria-label="Choose a reaction">
                    ${order.map((level) => reactionControlMarkup(level, example.id, selected)).join("")}
                  </div>
                </fieldset>
                <p class="structure-feedback" id="${example.id}-feedback" role="status" aria-live="polite" data-kind="${selected === example.answer ? "success" : "reconsider"}" ${feedback ? "" : "hidden"}>${feedback}</p>
              </article>`;
          }).join("")}
        </div>
      </section>

      <section class="introduction-stage" aria-labelledby="intro-build-heading">
        <h2 id="intro-build-heading">Build it</h2>
        ${introductionTaskMarkup(stages.build.taskId)}
        <section class="build-level" aria-labelledby="cool-build-heading">
          <h3 id="cool-build-heading">${levelReactionMarkup("cool", { imageOnly: true, decorative: true })} Build a Cool introduction</h3>
          ${buildActivityMarkup("cool", saved)}
        </section>
        <details class="optional-spicy build-level" ${saved.spicyBuildOpen ? "open" : ""}>
          <summary>${levelReactionMarkup("spicy", { imageOnly: true })} Optional: build another introduction</summary>
          ${buildActivityMarkup("spicy", saved)}
        </details>
      </section>

      <section class="introduction-stage" aria-labelledby="intro-write-heading">
        <h2 id="intro-write-heading">Write it</h2>
        ${introductionTaskMarkup(stages.write.taskId)}
        <div class="introduction-writing-stack">
          <div class="introduction-writing" data-level="cool">
            <h3>Write a Cool introduction</h3>
            <p>Keep it simple and clear.</p>
            <label for="introduction-cool-writing">Your Cool introduction</label>
            <div class="writing-reaction-wrap">
              <textarea class="writing-area" id="introduction-cool-writing" rows="4" spellcheck="true">${escapeHTML(saved.coolWriting || "")}</textarea>
              ${levelReactionMarkup("cool", { attached: true, imageOnly: true, decorative: true })}
            </div>
          </div>
          <details class="optional-spicy-writing" ${saved.spicyWritingOpen || saved.spicyWriting?.trim() ? "open" : ""}>
            <summary>${levelReactionMarkup("spicy", { imageOnly: true })}<span>Try another version</span></summary>
            <div class="introduction-writing" data-level="spicy">
              <p>Try another clear way to describe the same information.</p>
              <label for="introduction-spicy-writing">Your optional Spicy introduction</label>
              <div class="writing-reaction-wrap">
                <textarea class="writing-area" id="introduction-spicy-writing" rows="4" spellcheck="true">${escapeHTML(saved.spicyWriting || "")}</textarea>
                ${levelReactionMarkup("spicy", { attached: true, imageOnly: true, decorative: true })}
              </div>
            </div>
          </details>
        </div>
        <details class="introduction-help">
          <summary>Need help?</summary>
          <div class="help-phrases">
            <section><h3>${levelReactionMarkup("cool")}</h3><ul>${stages.write.help.cool.map((item) => `<li>${item}</li>`).join("")}</ul></section>
            <section><h3>${levelReactionMarkup("spicy")}</h3><ul>${stages.write.help.spicy.map((item) => `<li>${item}</li>`).join("")}</ul></section>
          </div>
        </details>
      </section>

      <section class="introduction-stage optional-extra" aria-labelledby="intro-extra-heading">
        <h2 id="intro-extra-heading">Want another one?</h2>
        ${introductionTaskMarkup(stages.extra.taskId)}
        <fieldset>
          <legend>Choose your approach</legend>
          <div class="extra-level-choices compact-mode-choice">
            ${["cool", "spicy"].map((level) => `<label><input type="radio" name="extra-level" value="${level}" aria-label="Choose ${content.b2.levels[level].label}" ${saved.extraLevel === level ? "checked" : ""} />${levelReactionMarkup(level)}</label>`).join("")}
          </div>
        </fieldset>
        <label for="introduction-extra-writing">Your optional introduction</label>
        <textarea class="writing-area" id="introduction-extra-writing" rows="4" spellcheck="true">${escapeHTML(saved.extraWriting || "")}</textarea>
      </section>

      <section class="introduction-complete" aria-labelledby="introduction-complete-heading">
        <h2 id="introduction-complete-heading">Introduction ✓</h2>
        <p>You can describe what the visual shows in your own words.</p>
      </section>
      <nav class="unit-navigation" aria-label="Learning-unit navigation">
        <button class="secondary-button" type="button" data-nav="b1">Back</button>
        <button class="primary-button" type="button" data-nav="c1">Next: Overview</button>
      </nav>
    </article>`;

  hydrateExplorerTaskVisuals();
  document.querySelectorAll("[data-classify-introduction]").forEach((input) => {
    input.addEventListener("change", () => {
      const example = stages.classify.examples.find((item) => item.id === input.dataset.classifyIntroduction);
      const updated = { ...(getUnitState("b2").classifications || {}), [example.id]: input.value };
      setUnitState("b2", { classifications: updated });
      const feedback = document.getElementById(`${example.id}-feedback`);
      feedback.textContent = classificationFeedback(example, input.value);
      feedback.dataset.kind = input.value === example.answer ? "success" : "reconsider";
      feedback.hidden = false;
    });
  });
  document.querySelectorAll("[data-move-chunk]").forEach((button) => {
    button.addEventListener("click", () => {
      const savedState = getUnitState("b2");
      const level = button.dataset.buildLevel;
      const order = [...savedState.buildOrders[level]];
      const index = order.indexOf(button.dataset.moveChunk);
      const swapIndex = button.dataset.direction === "earlier" ? index - 1 : index + 1;
      [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
      setUnitState("b2", {
        buildOrders: { ...savedState.buildOrders, [level]: order },
        buildChecked: { ...(savedState.buildChecked || {}), [level]: false },
        ...(level === "spicy" ? { spicyBuildOpen: true } : {}),
      });
      render();
      focusAfterRender(`[data-build-item="${button.dataset.moveChunk}"]`);
    });
  });
  document.querySelectorAll("[data-check-build]").forEach((button) => {
    button.addEventListener("click", () => {
      const savedState = getUnitState("b2");
      setUnitState("b2", {
        buildChecked: { ...(savedState.buildChecked || {}), [button.dataset.checkBuild]: true },
        ...(button.dataset.checkBuild === "spicy" ? { spicyBuildOpen: true } : {}),
      });
      render();
      focusAfterRender(`[data-build-feedback="${button.dataset.checkBuild}"]`);
    });
  });
  [
    ["#introduction-cool-writing", "coolWriting"],
    ["#introduction-spicy-writing", "spicyWriting"],
    ["#introduction-extra-writing", "extraWriting"],
  ].forEach(([selector, key]) => {
    document.querySelector(selector).addEventListener("input", (event) => {
      setUnitState("b2", { [key]: event.target.value });
      if (["coolWriting", "spicyWriting"].includes(key) && event.target.value.trim()) completeUnit("b2");
    });
  });
  document.querySelector(".optional-spicy")?.addEventListener("toggle", (event) => {
    setUnitState("b2", { spicyBuildOpen: event.target.open });
  });
  document.querySelector(".optional-spicy-writing")?.addEventListener("toggle", (event) => {
    setUnitState("b2", { spicyWritingOpen: event.target.open });
  });
  document.querySelectorAll('input[name="extra-level"]').forEach((input) => {
    input.addEventListener("change", () => setUnitState("b2", { extraLevel: input.value }));
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

function aiFeedbackMarkup(unitId, feedback, saved, learnerWriting = "") {
  if (!feedback?.enabled) return "";
  const available = Boolean(learnerWriting.trim());
  const open = available && Boolean(saved.aiFeedbackOpen || saved.aiPromptCopied);
  return `
    <section class="ai-feedback-disclosure" data-ai-feedback-disclosure="${unitId}" ${available ? "" : "hidden"}>
      <button class="secondary-button ai-feedback-toggle" type="button" data-toggle-ai-feedback="${unitId}" aria-expanded="${open}" aria-controls="${unitId}-ai-panel">
        <span>Use AI feedback</span><span aria-hidden="true">▾</span>
      </button>
      <div id="${unitId}-ai-panel" data-ai-feedback-panel="${unitId}" ${open ? "" : "hidden"}>
        <section class="ai-feedback-panel" aria-labelledby="${unitId}-ai-heading">
          <h3 id="${unitId}-ai-heading" tabindex="-1">Use AI to check your writing</h3>
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
        </section>
      </div>
    </section>`;
}

function updateAIFeedbackAvailability(unitId, learnerWriting) {
  const disclosure = document.querySelector(`[data-ai-feedback-disclosure="${unitId}"]`);
  if (!disclosure) return;
  const available = Boolean(learnerWriting.trim());
  disclosure.hidden = !available;
  if (!available) {
    disclosure.querySelector("[data-toggle-ai-feedback]")?.setAttribute("aria-expanded", "false");
    const panel = disclosure.querySelector("[data-ai-feedback-panel]");
    if (panel) panel.hidden = true;
  }
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
  document.querySelector(`[data-toggle-ai-feedback="${unitId}"]`)?.addEventListener("click", (event) => {
    const button = event.currentTarget;
    const panel = document.querySelector(`[data-ai-feedback-panel="${unitId}"]`);
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    setUnitState(unitId, { aiFeedbackOpen: open });
    if (open) requestAnimationFrame(() => panel.querySelector("h3")?.focus({ preventScroll: true }));
  });
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
          ${aiFeedbackMarkup("b4", content.b4.aiFeedback, saved, draft)}
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
    updateAIFeedbackAvailability("b4", textarea.value);
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
          ${aiFeedbackMarkup("c4", content.c4.aiFeedback, saved, draft)}
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
    updateAIFeedbackAvailability("c4", textarea.value);
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
          <p class="structure-feedback" role="status" aria-live="polite" tabindex="-1" data-kind="${success ? "success" : "reconsider"}" ${saved.checked ? "" : "hidden"}>${saved.checked ? (success ? source.success : source.partial) : ""}</p>
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
    focusAfterRender(".structure-feedback");
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
          ${aiFeedbackMarkup(id, source.aiFeedback, saved, draft)}
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
    updateAIFeedbackAvailability(id, textarea.value);
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

// Overview page v2. CB01 is intentionally excluded until its two visual forms and
// historical data are verified; a whole-task combined-visual example can slot into
// the judgement sequence once that source is sound.
function overviewReactionOrder(exampleId) {
  const ids = ["cool", "splat"];
  const saved = getUnitState("c2");
  const stored = saved.reactionOrders?.[exampleId];
  if (isValidStoredOrder(stored, ids)) return stored;
  const order = shuffleOptionIds(ids);
  setUnitState("c2", { reactionOrders: { ...(saved.reactionOrders || {}), [exampleId]: order } });
  return order;
}

function overviewReactionControl(level, exampleId, selected) {
  const source = content.b2.levels[level];
  return `<label class="reaction-control" title="${source.label}">
    <input type="radio" name="${exampleId}" value="${level}" data-overview-reaction="${exampleId}" aria-label="${source.label}" ${selected === level ? "checked" : ""} />
    <span class="reaction-control__visual" aria-hidden="true"><img src="${source.image}" alt="" width="26" height="26" /></span>
  </label>`;
}

function renderOverviewC1(unit) {
  completeUnit("c1");
  app.innerHTML = `
    <article class="overview-page" aria-labelledby="unit-title">
      ${unitHeader(unit, "An overview gives the big picture.", { showEyebrow: false, compact: true })}
      <div class="activity-layout overview-model-layout">
        ${visualTaskSource(content.c1.visualId)}
        <section class="overview-model" aria-label="Cool overview example">
          <p>${content.c1.example}</p>
          <div class="overview-reaction-feedback">${levelReactionMarkup("cool", { imageOnly: true })}<span>${content.c1.explanation}</span></div>
          <aside class="overview-hot-tip">
            <strong>Hot tip</strong>
            <p>${content.c1.hotTip}</p>
            <small>${content.c1.hotTipNote}</small>
          </aside>
        </section>
      </div>
      ${navigationMarkup({ canContinue: true })}
    </article>`;
  hydrateAcademicVisuals();
}

function renderOverviewC2(unit) {
  const saved = getUnitState("c2");
  const reactions = saved.reactions || {};
  completeUnit("c2");
  const groups = [];
  content.c2.examples.forEach((example) => {
    let group = groups.find((item) => item.visualId === example.visualId);
    if (!group) {
      group = { visualId: example.visualId, examples: [] };
      groups.push(group);
    }
    group.examples.push(example);
  });
  app.innerHTML = `
    <article class="overview-page" aria-labelledby="unit-title">
      ${unitHeader(unit, "Does it give the big picture?", { showEyebrow: false, compact: true })}
      <section class="overview-binary-key" aria-label="Reaction meanings">
        <div>${levelReactionMarkup("cool", { description: true })}</div>
        <div>${levelReactionMarkup("splat", { description: true })}</div>
      </section>
      <div class="overview-judgement-groups">
        ${groups.map((group) => `
          <section class="overview-judgement-group" aria-labelledby="${group.visualId}-overview-heading">
            <h2 class="visually-hidden" id="${group.visualId}-overview-heading">${visualById(group.visualId).label} overview examples</h2>
            <div class="overview-judgement-visual" data-academic-visual="${group.visualId}" data-compact="true" data-reveal-overview="false"></div>
            <div class="overview-judgement-list">
              ${group.examples.map((example) => {
                const selected = reactions[example.id] || "";
                return `<div class="overview-judgement-item">
                  <p>${example.text}</p>
                  <div class="reaction-controls" role="radiogroup" aria-label="Does this work as an overview?">
                    ${overviewReactionOrder(example.id).map((level) => overviewReactionControl(level, example.id, selected)).join("")}
                  </div>
                  <p class="structure-feedback" id="${example.id}-feedback" role="status" aria-live="polite" data-kind="${selected === example.answer ? "success" : "reconsider"}" ${selected ? "" : "hidden"}>${selected ? `${selected === example.answer ? "" : "Not quite. "}${example.feedback}` : ""}</p>
                </div>`;
              }).join("")}
            </div>
          </section>`).join("")}
      </div>
      ${navigationMarkup({ canContinue: true })}
    </article>`;
  hydrateAcademicVisuals();
  document.querySelectorAll("[data-overview-reaction]").forEach((input) => {
    input.addEventListener("change", () => {
      const example = content.c2.examples.find((item) => item.id === input.dataset.overviewReaction);
      const updated = { ...(getUnitState("c2").reactions || {}), [example.id]: input.value };
      setUnitState("c2", { reactions: updated });
      const feedback = document.getElementById(`${example.id}-feedback`);
      feedback.textContent = `${input.value === example.answer ? "" : "Not quite. "}${example.feedback}`;
      feedback.dataset.kind = input.value === example.answer ? "success" : "reconsider";
      feedback.hidden = false;
    });
  });
}

function renderOverviewC4(unit) {
  completeUnit("c4");
  app.innerHTML = `
    <article class="overview-page" aria-labelledby="unit-title">
      ${unitHeader(unit, "Both give the big picture.", { showEyebrow: false, compact: true })}
      <div class="activity-layout overview-comparison-layout">
        ${visualTaskSource(content.c4.visualId)}
        <div class="overview-level-comparison">
          <section>${levelReactionMarkup("cool", { description: true })}<p>${content.c4.cool}</p></section>
          <section>${levelReactionMarkup("spicy", { description: true })}<p>${content.c4.spicy}</p></section>
          <p class="choice-note">Both work. Spicy is optional, not a higher band score.</p>
        </div>
      </div>
      ${navigationMarkup({ canContinue: true })}
    </article>`;
  hydrateAcademicVisuals();
}

function renderOverviewC5(unit) {
  const source = content.c5;
  const saved = getUnitState("c5");
  const selected = saved.selected || [];
  const expected = source.options.filter((option) => option.expected).map((option) => option.id);
  const options = orderedOptions("c5", source.options, source.shuffle);
  const success = saved.checked && selected.length === expected.length && expected.every((id) => selected.includes(id));
  const selectedText = selected.map((id) => source.options.find((option) => option.id === id)?.text).filter(Boolean);
  app.innerHTML = `
    <article class="overview-page" aria-labelledby="unit-title">
      ${unitHeader(unit, "Select and combine the ideas that matter most.", { showEyebrow: false, compact: true })}
      <div class="activity-layout overview-build-layout">
        ${visualTaskSource(source.visualId)}
        <section class="interaction-pane" aria-labelledby="c5-prompt">
          <form id="overview-build-form">
            <fieldset>
              <legend class="prompt" id="c5-prompt">${source.prompt}</legend>
              <div class="choice-list">
                ${options.map((option) => choiceMarkup({ type: "checkbox", name: "overview-ideas", value: option.id, text: option.text, checked: selected.includes(option.id), disabled: selected.length >= 2 && !selected.includes(option.id) })).join("")}
              </div>
            </fieldset>
            <p class="overview-built-sentence" ${selectedText.length ? "" : "hidden"}><strong>Overall,</strong> ${selectedText.join(" ")}</p>
            <div class="action-row">
              <button class="primary-button" type="submit" ${selected.length === 2 ? "" : "disabled"}>Check my overview</button>
              ${saved.checked && !success ? '<button class="secondary-button" type="button" data-retry>Reconsider</button>' : ""}
            </div>
          </form>
          <p class="structure-feedback" role="status" aria-live="polite" tabindex="-1" data-kind="${success ? "success" : "reconsider"}" ${saved.checked ? "" : "hidden"}>${saved.checked ? (success ? source.success : source.partial) : ""}</p>
        </section>
      </div>
      ${navigationMarkup({ canContinue: true })}
    </article>`;
  hydrateAcademicVisuals();
  const form = document.querySelector("#overview-build-form");
  form.addEventListener("change", () => {
    setUnitState("c5", { selected: new FormData(form).getAll("overview-ideas"), checked: false });
    render();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setUnitState("c5", { selected: new FormData(form).getAll("overview-ideas"), checked: true });
    completeUnit("c5");
    render();
    focusAfterRender(".structure-feedback");
  });
  document.querySelector("[data-retry]")?.addEventListener("click", () => {
    setUnitState("c5", { checked: false });
    render();
  });
}

function renderOverviewC6(unit) {
  const source = content.c6;
  const saved = getUnitState("c6");
  const draft = state.drafts.mapOverview || "";
  const spicyDraft = saved.spicyWriting || "";
  app.innerHTML = `
    <article class="overview-page" aria-labelledby="unit-title">
      ${unitHeader(unit, "Look at the whole visual, then say what matters most.", { showEyebrow: false, compact: true })}
      <div class="activity-layout writing-layout">
        ${visualTaskSource(source.visualId)}
        <section class="writing-pane" aria-labelledby="c6-prompt">
          <div class="writing-reaction-wrap">
            <p class="prompt" id="c6-prompt">${source.prompt}</p>
            ${levelReactionMarkup("cool", { attached: true, imageOnly: true })}
            <label for="overview-cool-draft" class="visually-hidden">Your Cool overview</label>
            <textarea class="writing-area short-writing-area" id="overview-cool-draft" spellcheck="true">${escapeHTML(draft)}</textarea>
          </div>
          <div class="writing-meta"><span>Give the big picture.</span><span data-word-count>${wordCount(draft)} words</span></div>
          <div class="action-row">
            <button class="secondary-button" type="button" data-open-transfer-help ${saved.helpLevel ? "hidden" : ""}>Need help?</button>
            <button class="primary-button" type="button" data-keep-overview ${draft.trim() ? "" : "disabled"}>Keep this overview</button>
          </div>
          ${transferHelpMarkup("c6", source, saved, Boolean(draft.trim()))}
          ${aiFeedbackMarkup("c6", source.aiFeedback, saved, draft)}
          <details class="optional-spicy-writing" ${saved.spicyWritingOpen || spicyDraft.trim() ? "open" : ""}>
            <summary>${levelReactionMarkup("spicy", { imageOnly: true })}<span>Try a Spicy version</span></summary>
            <label for="overview-spicy-draft" class="visually-hidden">Your optional Spicy overview</label>
            <textarea class="writing-area short-writing-area" id="overview-spicy-draft" spellcheck="true">${escapeHTML(spicyDraft)}</textarea>
            <div class="writing-meta"><span>Same big picture, with more language range.</span><span data-spicy-word-count>${wordCount(spicyDraft)} words</span></div>
          </details>
        </section>
      </div>
      ${state.completed.includes("c6") ? '<div class="completion-note"><h2 tabindex="-1">Overview ✓</h2><p>You can identify and write the big picture.</p></div>' : ""}
      <nav class="unit-navigation" aria-label="Learning-unit navigation">
        <button class="secondary-button" type="button" data-nav="c5">Back</button>
        <button class="primary-button" type="button" data-nav="d1">Next: Details</button>
      </nav>
    </article>`;
  hydrateAcademicVisuals();
  const textarea = document.querySelector("#overview-cool-draft");
  textarea.addEventListener("input", () => {
    saveDraft("mapOverview", textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-keep-overview]").disabled = !textarea.value.trim();
    updateAIFeedbackAvailability("c6", textarea.value);
    trackAIRevision("c6", textarea.value);
  });
  document.querySelector("[data-keep-overview]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft("mapOverview", textarea.value);
    completeUnit("c6");
    render();
    focusAfterRender(".completion-note h2");
  });
  document.querySelector("#overview-spicy-draft").addEventListener("input", (event) => {
    setUnitState("c6", { spicyWriting: event.target.value, spicyWritingOpen: true });
    document.querySelector("[data-spicy-word-count]").textContent = `${wordCount(event.target.value)} words`;
  });
  document.querySelector(".optional-spicy-writing").addEventListener("toggle", (event) => setUnitState("c6", { spicyWritingOpen: event.target.open }));
  document.querySelector("[data-open-transfer-help]")?.addEventListener("click", () => {
    setUnitState("c6", { helpLevel: 1 });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-more-transfer-help]")?.addEventListener("click", () => {
    const level = getUnitState("c6").helpLevel || 1;
    if (level === source.help.length - 1 && !textarea.value.trim()) return;
    setUnitState("c6", { helpLevel: Math.min(level + 1, source.help.length) });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-close-transfer-help]")?.addEventListener("click", () => {
    setUnitState("c6", { helpLevel: 0 });
    render();
    focusAfterRender("[data-open-transfer-help]");
  });
  bindAIFeedback("c6", source.aiFeedback, textarea);
}

function renderOverviewPage(unit) {
  const reactionState = getUnitState("c2");
  const reactions = reactionState.reactions || {};
  const reactionGroups = [];
  content.c2.examples.forEach((example) => {
    let group = reactionGroups.find((item) => item.taskId === example.taskId);
    if (!group) {
      group = { taskId: example.taskId, examples: [] };
      reactionGroups.push(group);
    }
    group.examples.push(example);
  });

  const buildSource = content.c5;
  const buildState = getUnitState("c5");
  const buildSelected = buildState.selected || [];
  const buildExpected = buildSource.options.filter((option) => option.expected).map((option) => option.id);
  const buildOptions = orderedOptions("c5", buildSource.options, buildSource.shuffle);
  const buildSuccess = Boolean(buildState.checked) && buildSelected.length === buildExpected.length && buildExpected.every((id) => buildSelected.includes(id));
  const buildText = buildSelected.map((id) => buildSource.options.find((option) => option.id === id)?.text).filter(Boolean);

  const writingSource = content.c6;
  const writingState = getUnitState("c6");
  const draft = state.drafts.mp01Overview || "";
  const spicyDraft = writingState.mp01SpicyWriting || "";
  completeUnit("c1");

  app.innerHTML = `
    <article class="overview-page overview-page--continuous" aria-labelledby="unit-title">
      ${unitHeader(unit, "An overview gives the big picture.", { showEyebrow: false, compact: true })}

      <section class="overview-stage overview-stage--see" aria-label="See a clear overview">
        <div class="activity-layout overview-model-layout">
          ${overviewTaskVisual(content.c1.taskId)}
          <div class="overview-model">
            <p>${content.c1.example}</p>
            <div class="overview-reaction-feedback">${levelReactionMarkup("cool", { imageOnly: true })}<span>${content.c1.explanation}</span></div>
            <aside class="overview-hot-tip">
              <strong>Hot tip</strong>
              <p>${content.c1.hotTip}</p>
              <small>${content.c1.hotTipNote}</small>
            </aside>
          </div>
        </div>
      </section>

      <section class="overview-stage overview-stage--judge" aria-labelledby="overview-judge-heading">
        <h2 id="overview-judge-heading">Cool or Splat?</h2>
        <div class="overview-binary-key" aria-label="Reaction meanings">
          <div>${levelReactionMarkup("cool", { description: true })}</div>
          <div>${levelReactionMarkup("splat", { description: true })}</div>
        </div>
        <div class="overview-judgement-groups">
          ${reactionGroups.map((group) => `
            <section class="overview-judgement-group" data-overview-task="${group.taskId}" aria-labelledby="${group.taskId}-overview-heading">
              <h3 class="visually-hidden" id="${group.taskId}-overview-heading">${explorerTaskById(group.taskId).label} overview examples</h3>
              <div class="overview-judgement-visual explorer-visual-host overview-explorer-visual" data-explorer-task="${group.taskId}"></div>
              <div class="overview-judgement-list">
                ${group.examples.map((example) => {
                  const selected = reactions[example.id] || "";
                  return `<div class="overview-judgement-item">
                    <p>${example.text}</p>
                    <div class="reaction-controls" role="radiogroup" aria-label="Does this work as an overview?">
                      ${overviewReactionOrder(example.id).map((level) => overviewReactionControl(level, example.id, selected)).join("")}
                    </div>
                    <p class="structure-feedback" id="${example.id}-feedback" role="status" aria-live="polite" data-kind="${selected === example.answer ? "success" : "reconsider"}" ${selected ? "" : "hidden"}>${selected ? `${selected === example.answer ? "" : "Not quite. "}${example.feedback}` : ""}</p>
                  </div>`;
                }).join("")}
              </div>
            </section>`).join("")}
        </div>
      </section>

      <section class="overview-stage overview-stage--extend" aria-labelledby="overview-extend-heading">
        <h2 id="overview-extend-heading">Cool and Spicy</h2>
        <div class="activity-layout overview-comparison-layout">
          ${overviewTaskVisual(content.c4.taskId)}
          <div class="overview-level-comparison">
            <section>${levelReactionMarkup("cool", { description: true })}<p>${content.c4.cool}</p></section>
            <section>${levelReactionMarkup("spicy", { description: true })}<p>${content.c4.spicy}</p></section>
            <p class="choice-note">Both work.</p>
          </div>
        </div>
      </section>

      <section class="overview-stage overview-stage--build" aria-labelledby="overview-build-heading">
        <h2 id="overview-build-heading">Build an overview</h2>
        <div class="activity-layout overview-build-layout">
          ${overviewTaskVisual(buildSource.taskId)}
          <div class="interaction-pane">
            <form id="overview-build-form">
              <fieldset>
                <legend class="prompt">${buildSource.prompt}</legend>
                <div class="choice-list overview-build-choices">
                  ${buildOptions.map((option) => choiceMarkup({
                    type: "checkbox",
                    name: "overview-build-choices",
                    value: option.id,
                    text: option.text,
                    checked: buildSelected.includes(option.id),
                    disabled: buildSelected.length >= 2 && !buildSelected.includes(option.id),
                  })).join("")}
                </div>
              </fieldset>
              <p class="overview-built-sentence" data-built-overview ${buildText.length ? "" : "hidden"}><strong>Overall,</strong> <span>${buildText.join(" ")}</span></p>
              <div class="action-row">
                <button class="primary-button" type="submit" ${buildSelected.length === 2 ? "" : "disabled"}>Check my overview</button>
                <button class="secondary-button" type="button" data-reconsider-overview ${buildState.checked && !buildSuccess ? "" : "hidden"}>Reconsider</button>
              </div>
            </form>
            <p class="structure-feedback" id="overview-build-feedback" role="status" aria-live="polite" tabindex="-1" data-kind="${buildSuccess ? "success" : "reconsider"}" ${buildState.checked ? "" : "hidden"}>${buildState.checked ? (buildSuccess ? buildSource.success : buildSource.partial) : ""}</p>
          </div>
        </div>
      </section>

      <section class="overview-stage overview-stage--write" aria-labelledby="overview-write-heading">
        <div class="activity-layout writing-layout">
          ${overviewTaskVisual(writingSource.taskId, { showStatement: true })}
          <div class="writing-pane">
            <h2 id="overview-write-heading">Write an overview</h2>
            <div class="writing-reaction-wrap">
              ${levelReactionMarkup("cool", { attached: true, imageOnly: true })}
              <label for="overview-cool-draft" class="visually-hidden">Your Cool overview</label>
              <textarea class="writing-area short-writing-area" id="overview-cool-draft" spellcheck="true" placeholder="Write a clear overview.">${escapeHTML(draft)}</textarea>
            </div>
            <div class="writing-meta"><span>Give the big picture.</span><span data-word-count>${wordCount(draft)} words</span></div>
            <div class="action-row">
              <button class="secondary-button" type="button" data-open-transfer-help ${writingState.helpLevel ? "hidden" : ""}>Need help?</button>
              <button class="primary-button" type="button" data-keep-overview ${draft.trim() ? "" : "disabled"}>Keep this overview</button>
            </div>
            ${transferHelpMarkup("c6", writingSource, writingState, Boolean(draft.trim()))}
            ${aiFeedbackMarkup("c6", writingSource.aiFeedback, writingState, draft)}
            <details class="optional-spicy-writing" ${writingState.mp01SpicyWritingOpen || spicyDraft.trim() ? "open" : ""}>
              <summary>${levelReactionMarkup("spicy", { imageOnly: true })}<span>Try a Spicy version</span></summary>
              <label for="overview-spicy-draft" class="visually-hidden">Your optional Spicy overview</label>
              <textarea class="writing-area short-writing-area" id="overview-spicy-draft" spellcheck="true">${escapeHTML(spicyDraft)}</textarea>
              <div class="writing-meta"><span>Same big picture, with more language range.</span><span data-spicy-word-count>${wordCount(spicyDraft)} words</span></div>
            </details>
          </div>
        </div>
      </section>

      <div class="completion-note overview-completion"><h2>Overview ✓</h2><p>You can identify and write the big picture.</p></div>
      <nav class="unit-navigation" aria-label="Learning-unit navigation">
        <button class="secondary-button" type="button" data-nav="b2">Back</button>
        <button class="primary-button" type="button" data-nav="d1">Next: Details</button>
      </nav>
    </article>`;

  hydrateExplorerTaskVisuals();

  document.querySelectorAll("[data-overview-reaction]").forEach((input) => {
    input.addEventListener("change", () => {
      const example = content.c2.examples.find((item) => item.id === input.dataset.overviewReaction);
      const updated = { ...(getUnitState("c2").reactions || {}), [example.id]: input.value };
      setUnitState("c2", { reactions: updated });
      const feedback = document.getElementById(`${example.id}-feedback`);
      feedback.textContent = `${input.value === example.answer ? "" : "Not quite. "}${example.feedback}`;
      feedback.dataset.kind = input.value === example.answer ? "success" : "reconsider";
      feedback.hidden = false;
    });
  });

  const buildForm = document.querySelector("#overview-build-form");
  const updateBuildInterface = () => {
    const choices = new FormData(buildForm).getAll("overview-build-choices");
    const sentence = document.querySelector("[data-built-overview]");
    const texts = choices.map((id) => buildSource.options.find((option) => option.id === id)?.text).filter(Boolean);
    sentence.querySelector("span").textContent = texts.join(" ");
    sentence.hidden = texts.length === 0;
    buildForm.querySelector('button[type="submit"]').disabled = choices.length !== 2;
    buildForm.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.disabled = choices.length >= 2 && !choices.includes(input.value);
    });
    document.querySelector("#overview-build-feedback").hidden = true;
    document.querySelector("[data-reconsider-overview]").hidden = true;
    return choices;
  };
  buildForm.addEventListener("change", () => {
    const choices = updateBuildInterface();
    setUnitState("c5", { selected: choices, checked: false });
  });
  buildForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const choices = new FormData(buildForm).getAll("overview-build-choices");
    const success = choices.length === buildExpected.length && buildExpected.every((id) => choices.includes(id));
    setUnitState("c5", { selected: choices, checked: true });
    completeUnit("c5");
    const feedback = document.querySelector("#overview-build-feedback");
    feedback.textContent = success ? buildSource.success : buildSource.partial;
    feedback.dataset.kind = success ? "success" : "reconsider";
    feedback.hidden = false;
    document.querySelector("[data-reconsider-overview]").hidden = success;
    feedback.focus({ preventScroll: true });
  });
  document.querySelector("[data-reconsider-overview]").addEventListener("click", () => {
    setUnitState("c5", { checked: false });
    document.querySelector("#overview-build-feedback").hidden = true;
    document.querySelector("[data-reconsider-overview]").hidden = true;
  });

  const textarea = document.querySelector("#overview-cool-draft");
  textarea.addEventListener("input", () => {
    saveDraft("mp01Overview", textarea.value);
    document.querySelector("[data-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-keep-overview]").disabled = !textarea.value.trim();
    updateAIFeedbackAvailability("c6", textarea.value);
    trackAIRevision("c6", textarea.value);
  });
  document.querySelector("[data-keep-overview]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft("mp01Overview", textarea.value);
    completeUnit("c6");
    document.querySelector(".overview-completion h2").focus({ preventScroll: true });
  });
  document.querySelector("#overview-spicy-draft").addEventListener("input", (event) => {
    setUnitState("c6", { mp01SpicyWriting: event.target.value, mp01SpicyWritingOpen: true });
    document.querySelector("[data-spicy-word-count]").textContent = `${wordCount(event.target.value)} words`;
  });
  document.querySelector(".optional-spicy-writing").addEventListener("toggle", (event) => setUnitState("c6", { mp01SpicyWritingOpen: event.target.open }));
  document.querySelector("[data-open-transfer-help]")?.addEventListener("click", () => {
    setUnitState("c6", { helpLevel: 1 });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-more-transfer-help]")?.addEventListener("click", () => {
    const level = getUnitState("c6").helpLevel || 1;
    if (level === writingSource.help.length - 1 && !textarea.value.trim()) return;
    setUnitState("c6", { helpLevel: Math.min(level + 1, writingSource.help.length) });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-close-transfer-help]")?.addEventListener("click", () => {
    setUnitState("c6", { helpLevel: 0 });
    render();
    focusAfterRender("[data-open-transfer-help]");
  });
  bindAIFeedback("c6", writingSource.aiFeedback, textarea);
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

function detailsTaskVisual(taskId, { showStatement = false } = {}) {
  const task = explorerTaskById(taskId);
  return `<div class="details-visual-reference" data-details-task="${taskId}">
    ${showStatement ? `<p class="details-task-statement">${task.taskStatement}</p>` : ""}
    <div class="explorer-visual-host details-explorer-visual" data-explorer-task="${taskId}"></div>
  </div>`;
}

function detailsReactionOrder(exampleId) {
  const ids = ["cool", "splat"];
  const saved = getUnitState("d1");
  const stored = saved.reactionOrders?.[exampleId];
  if (isValidStoredOrder(stored, ids)) return stored;
  const order = shuffleOptionIds(ids);
  setUnitState("d1", { reactionOrders: { ...(saved.reactionOrders || {}), [exampleId]: order } });
  return order;
}

function detailsReactionControl(level, exampleId, selected) {
  const source = content.b2.levels[level];
  return `<label class="reaction-control" title="${source.label}">
    <input type="radio" name="${exampleId}" value="${level}" data-details-reaction="${exampleId}" aria-label="${source.label}" ${selected === level ? "checked" : ""} />
    <span class="reaction-control__visual" aria-hidden="true"><img src="${source.image}" alt="" width="26" height="26" /></span>
  </label>`;
}

function detailsJudgementMarkup(example, selected) {
  return `<div class="details-judgement-item">
    <p>${example.text}</p>
    <div class="reaction-controls" role="radiogroup" aria-label="Does this do the current Details job?">
      ${detailsReactionOrder(example.id).map((level) => detailsReactionControl(level, example.id, selected)).join("")}
    </div>
    <p class="structure-feedback" id="${example.id}-feedback" role="status" aria-live="polite" data-kind="${selected === example.answer ? "success" : "reconsider"}" ${selected ? "" : "hidden"}>${selected ? `${selected === example.answer ? "" : "Not quite. "}${example.feedback}` : ""}</p>
  </div>`;
}

function detailsOptionMarkup(name, option, selected) {
  return `<label class="details-option">
    <input type="radio" name="${name}" value="${option.id}" ${selected === option.id ? "checked" : ""} />
    <span>${option.text}</span>
  </label>`;
}

function detailsIndependentWritingMarkup({ id, writing, value, saved }) {
  return `<div class="details-independent-writing">
    <label for="${id}-draft">${writing.prompt}</label>
    <textarea class="writing-area short-writing-area" id="${id}-draft" rows="4" spellcheck="true">${escapeHTML(value)}</textarea>
    <div class="writing-meta"><span>Your work saves on this device.</span><span data-${id}-count>${wordCount(value)} words</span></div>
    <details class="details-fragment-help" ${saved.helpOpen ? "open" : ""}>
      <summary>Need help?</summary>
      <p>${writing.help.map((fragment) => `<span>${fragment}</span>`).join("")}</p>
    </details>
    ${aiFeedbackMarkup(id, writing.aiFeedback, saved, value)}
  </div>`;
}

function renderD1(unit) {
  const source = content.details;
  const saved = getUnitState("d1");
  const reactions = saved.reactions || {};
  const connectSaved = getUnitState("details-connect");
  const connectOptions = orderedOptions("details-connect", source.connect.options, source.connect.shuffle);
  const connectChoice = source.connect.options.find((option) => option.id === connectSaved.choice);
  const buildSaved = getUnitState("details-build");
  const buildOptions = orderedOptions("details-build", source.build.relationships, true);
  const buildChoice = source.build.relationships.find((option) => option.id === buildSaved.relationship);
  const buildSentence = buildSaved.sentence || "";
  const writeSaved = getUnitState("details-write");
  const mapWriteSaved = getUnitState("details-map-write");
  const processWriteSaved = getUnitState("details-process-write");
  const draft = state.drafts.detailsParagraph || "";
  const mapDraft = state.drafts.detailsMapWriting || "";
  const processDraft = state.drafts.detailsProcessWriting || "";
  const spicyDraft = writeSaved.spicyWriting || "";
  const legacyDraft = state.drafts.legacyDetailParagraph || "";
  completeUnit("d1");

  app.innerHTML = `<article class="details-page details-page--continuous" aria-labelledby="unit-title">
    ${unitHeader(unit, source.anchor, { showEyebrow: false, compact: true })}

    <section class="details-stage" aria-labelledby="details-select-heading">
      <h2 id="details-select-heading">Select useful details</h2>
      <p class="details-stage-intro">You don't need to describe everything. Choose information that helps the reader understand something.</p>
      <div class="activity-layout details-evidence-layout">
        ${detailsTaskVisual(source.select.taskId)}
        <div class="details-judgement-list">
          ${source.select.examples.map((example) => detailsJudgementMarkup(example, reactions[example.id] || "")).join("")}
        </div>
      </div>
    </section>

    <section class="details-stage" aria-labelledby="details-connect-heading">
      <h2 id="details-connect-heading">Connect what belongs together</h2>
      <div class="activity-layout details-evidence-layout">
        ${detailsTaskVisual(source.connect.taskId)}
        <fieldset class="details-compact-choice" id="details-connect-form">
          <legend class="prompt">${source.connect.prompt}</legend>
          <div class="details-option-list">${connectOptions.map((option) => detailsOptionMarkup("details-connect-choice", option, connectSaved.choice)).join("")}</div>
          <p class="structure-feedback" id="details-connect-feedback" role="status" aria-live="polite" data-kind="${connectChoice?.viable ? "success" : "reconsider"}" ${connectChoice ? "" : "hidden"}>${connectChoice?.feedback || ""}</p>
        </fieldset>
      </div>
    </section>

    <section class="details-stage" aria-labelledby="details-compare-heading">
      <h2 id="details-compare-heading">Show the comparison</h2>
      <p class="details-stage-intro">Numbers support the meaning. They should not leave the reader to discover the relationship alone.</p>
      <div class="activity-layout details-evidence-layout">
        ${detailsTaskVisual(source.compare.taskId)}
        <div class="details-judgement-list">
          ${source.compare.examples.map((example) => detailsJudgementMarkup(example, reactions[example.id] || "")).join("")}
        </div>
      </div>
      <div class="details-transfer-grid">
        ${source.compare.transfer.map((example) => `<section class="details-transfer-group" data-details-task="${example.taskId}" aria-labelledby="${example.id}-heading">
          <h3 id="${example.id}-heading">Try the same thinking with ${explorerTaskById(example.taskId).label.toLowerCase()}</h3>
          <div class="activity-layout details-evidence-layout">
            ${detailsTaskVisual(example.taskId)}
            ${detailsJudgementMarkup(example, reactions[example.id] || "")}
          </div>
        </section>`).join("")}
      </div>
    </section>

    <section class="details-stage" aria-labelledby="details-maps-heading">
      <h2 id="details-maps-heading">Maps: connect related changes</h2>
      <div class="activity-layout details-evidence-layout">
        ${detailsTaskVisual(source.maps.taskId)}
        <div>
          <div class="details-group-list" aria-label="Meaningful map-change groups">
            ${source.maps.groups.map((group) => `<p><strong>${group.label}</strong><span>${group.items}</span></p>`).join("")}
          </div>
          <div class="details-judgement-list">${source.maps.examples.map((example) => detailsJudgementMarkup(example, reactions[example.id] || "")).join("")}</div>
          <p class="details-transformation"><span>Connected changes</span><span aria-hidden="true">→</span><strong>${source.maps.sentence}</strong></p>
          ${detailsIndependentWritingMarkup({ id: "details-map-write", writing: source.maps.writing, value: mapDraft, saved: mapWriteSaved })}
        </div>
      </div>
    </section>

    <section class="details-stage" aria-labelledby="details-process-heading">
      <h2 id="details-process-heading">Processes: connect the stages</h2>
      <div class="activity-layout details-evidence-layout details-process-layout">
        ${detailsTaskVisual(source.process.taskId)}
        <div>
          <div class="details-group-list" aria-label="Meaningful process-stage groups">
            ${source.process.groups.map((group) => `<p><strong>${group.label}</strong><span>${group.items}</span></p>`).join("")}
          </div>
          <div class="details-judgement-list">${source.process.examples.map((example) => detailsJudgementMarkup(example, reactions[example.id] || "")).join("")}</div>
          ${detailsIndependentWritingMarkup({ id: "details-process-write", writing: source.process.writing, value: processDraft, saved: processWriteSaved })}
        </div>
      </div>
    </section>

    <section class="details-stage" aria-labelledby="details-build-heading">
      <h2 id="details-build-heading">Build the details</h2>
      <div class="activity-layout details-evidence-layout">
        ${detailsTaskVisual(source.build.taskId)}
        <div class="details-build-workspace">
          <p class="prompt">Evidence</p>
          <p class="details-evidence-strip">${source.build.evidence.join("<span aria-hidden=\"true\">·</span>")}</p>
          <fieldset class="details-compact-choice" id="details-build-relationship">
            <legend>Choose how to connect it.</legend>
            <div class="details-option-list details-option-list--pills">${buildOptions.map((option) => detailsOptionMarkup("details-build-choice", option, buildSaved.relationship)).join("")}</div>
            <p class="structure-feedback" id="details-build-relationship-feedback" role="status" aria-live="polite" data-kind="${buildChoice?.viable ? "success" : "reconsider"}" ${buildChoice ? "" : "hidden"}>${buildChoice?.feedback || ""}</p>
          </fieldset>
          <label for="details-build-sentence">${source.build.writingPrompt}</label>
          <textarea class="writing-area short-writing-area" id="details-build-sentence" rows="3">${escapeHTML(buildSentence)}</textarea>
          <button class="secondary-button" type="button" data-check-details-build ${buildSentence.trim() ? "" : "disabled"}>Check my sentence</button>
          <p class="structure-feedback" id="details-build-feedback" role="status" aria-live="polite" data-kind="success" ${buildSaved.checked ? "" : "hidden"}>${source.build.feedback}</p>
        </div>
      </div>
    </section>

    <section class="details-stage details-stage--write" aria-labelledby="details-write-heading">
      <div class="activity-layout writing-layout details-writing-layout">
        ${detailsTaskVisual(source.write.taskId, { showStatement: true })}
        <div class="writing-pane">
          <h2 id="details-write-heading">Write the details</h2>
          <p class="prompt">${source.write.prompt}</p>
          <label for="details-paragraph-draft">Your Details paragraph</label>
          <textarea class="writing-area details-writing-area" id="details-paragraph-draft" spellcheck="true">${escapeHTML(draft)}</textarea>
          <div class="writing-meta"><span>Your work saves on this device.</span><span data-details-word-count>${wordCount(draft)} words</span></div>
          <div class="action-row">
            <button class="secondary-button" type="button" data-open-details-help ${writeSaved.helpLevel ? "hidden" : ""}>Need help?</button>
            <button class="primary-button" type="button" data-keep-details ${draft.trim() ? "" : "disabled"}>Keep this paragraph</button>
          </div>
          ${transferHelpMarkup("details-write", source.write, writeSaved, Boolean(draft.trim()))}
          ${aiFeedbackMarkup("details-write", source.write.aiFeedback, writeSaved, draft)}
          ${writeSaved.kept ? '<p class="structure-feedback" data-kind="success">Your paragraph is saved. You can keep revising it.</p>' : ""}
          ${legacyDraft.trim() ? `<details class="legacy-details-writing"><summary>Previous saved Details paragraph</summary><p>This writing came from the earlier line-graph version. It is preserved here, but it is not used as your answer to the bar chart.</p><div>${escapeHTML(legacyDraft)}</div></details>` : ""}
        </div>
      </div>
    </section>

    <section class="details-stage details-stage--spicy" aria-labelledby="details-spicy-heading">
      <h2 id="details-spicy-heading">Want to say it with more range?</h2>
      <p class="details-stage-intro">Spicy is optional. It performs the same job with more language range.</p>
      <div class="details-spicy-examples">
        ${source.spicy.map((example) => `<section><h3>${example.family}</h3><p>${levelReactionMarkup("cool", { imageOnly: true })}<span>${example.cool}</span></p><p>${levelReactionMarkup("spicy", { imageOnly: true })}<span>${example.spicy}</span></p><small>Both work.</small></section>`).join("")}
      </div>
      <details class="optional-spicy-writing" ${spicyDraft.trim() || writeSaved.spicyWritingOpen ? "open" : ""}>
        <summary>${levelReactionMarkup("spicy", { imageOnly: true })}<span>Try a Spicy version of your paragraph</span></summary>
        <label for="details-spicy-draft">Your optional Spicy paragraph</label>
        <textarea class="writing-area details-writing-area" id="details-spicy-draft" spellcheck="true">${escapeHTML(spicyDraft)}</textarea>
        <div class="writing-meta"><span>Keep the same communicative job.</span><span data-details-spicy-count>${wordCount(spicyDraft)} words</span></div>
      </details>
    </section>

    <div class="completion-note details-completion"><h2>Academic Task 1 ✓</h2><p>You can now plan and write an Academic Task 1 response.</p></div>
    <nav class="unit-navigation" aria-label="Learning-unit navigation">
      <button class="secondary-button" type="button" data-nav="c1">Back to Overview</button>
      <a class="primary-button" href="../../task-2/submit/?task=academic-task-1&amp;question=${source.write.taskId}">Submit a complete Academic Task 1 answer</a>
    </nav>
  </article>`;

  hydrateExplorerTaskVisuals();

  const allExamples = [
    ...source.select.examples,
    ...source.compare.examples,
    ...source.compare.transfer,
    ...source.maps.examples,
    ...source.process.examples,
  ];
  document.querySelectorAll("[data-details-reaction]").forEach((input) => {
    input.addEventListener("change", () => {
      const example = allExamples.find((item) => item.id === input.dataset.detailsReaction);
      const updated = { ...(getUnitState("d1").reactions || {}), [example.id]: input.value };
      setUnitState("d1", { reactions: updated });
      const feedback = document.querySelector(`#${example.id}-feedback`);
      feedback.textContent = `${input.value === example.answer ? "" : "Not quite. "}${example.feedback}`;
      feedback.dataset.kind = input.value === example.answer ? "success" : "reconsider";
      feedback.hidden = false;
    });
  });

  document.querySelector("#details-connect-form").addEventListener("change", (event) => {
    const option = source.connect.options.find((item) => item.id === event.target.value);
    setUnitState("details-connect", { choice: option.id });
    const feedback = document.querySelector("#details-connect-feedback");
    feedback.textContent = option.feedback;
    feedback.dataset.kind = option.viable ? "success" : "reconsider";
    feedback.hidden = false;
  });

  [
    { id: "details-map-write", draft: "detailsMapWriting", value: mapDraft, source: source.maps.writing },
    { id: "details-process-write", draft: "detailsProcessWriting", value: processDraft, source: source.process.writing },
  ].forEach((item) => {
    const writingArea = document.querySelector(`#${item.id}-draft`);
    writingArea.addEventListener("input", () => {
      saveDraft(item.draft, writingArea.value);
      document.querySelector(`[data-${item.id}-count]`).textContent = `${wordCount(writingArea.value)} words`;
      updateAIFeedbackAvailability(item.id, writingArea.value);
      trackAIRevision(item.id, writingArea.value);
    });
    const help = writingArea.parentElement.querySelector(".details-fragment-help");
    help.addEventListener("toggle", () => setUnitState(item.id, { helpOpen: help.open }));
    bindAIFeedback(item.id, item.source.aiFeedback, writingArea);
  });

  document.querySelector("#details-build-relationship").addEventListener("change", (event) => {
    const option = source.build.relationships.find((item) => item.id === event.target.value);
    setUnitState("details-build", { relationship: option.id });
    const feedback = document.querySelector("#details-build-relationship-feedback");
    feedback.textContent = option.feedback;
    feedback.dataset.kind = option.viable ? "success" : "reconsider";
    feedback.hidden = false;
  });

  const buildTextarea = document.querySelector("#details-build-sentence");
  buildTextarea.addEventListener("input", () => {
    setUnitState("details-build", { sentence: buildTextarea.value, checked: false });
    document.querySelector("[data-check-details-build]").disabled = !buildTextarea.value.trim();
    document.querySelector("#details-build-feedback").hidden = true;
  });
  document.querySelector("[data-check-details-build]").addEventListener("click", () => {
    if (!buildTextarea.value.trim()) return;
    setUnitState("details-build", { sentence: buildTextarea.value, checked: true });
    document.querySelector("#details-build-feedback").hidden = false;
  });

  const textarea = document.querySelector("#details-paragraph-draft");
  textarea.addEventListener("input", () => {
    saveDraft("detailsParagraph", textarea.value);
    document.querySelector("[data-details-word-count]").textContent = `${wordCount(textarea.value)} words`;
    document.querySelector("[data-keep-details]").disabled = !textarea.value.trim();
    updateAIFeedbackAvailability("details-write", textarea.value);
    trackAIRevision("details-write", textarea.value);
  });
  document.querySelector("[data-keep-details]").addEventListener("click", () => {
    if (!textarea.value.trim()) return;
    saveDraft("detailsParagraph", textarea.value);
    setUnitState("details-write", { kept: true });
    render();
    focusAfterRender("[data-keep-details]");
  });
  document.querySelector("[data-open-details-help]")?.addEventListener("click", () => {
    setUnitState("details-write", { helpLevel: 1 });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-more-transfer-help]")?.addEventListener("click", () => {
    const current = getUnitState("details-write");
    setUnitState("details-write", { helpLevel: Math.min((current.helpLevel || 1) + 1, source.write.help.length) });
    render();
    focusAfterRender(".support-panel h3");
  });
  document.querySelector("[data-close-transfer-help]")?.addEventListener("click", () => {
    setUnitState("details-write", { helpLevel: 0 });
    render();
    focusAfterRender("[data-open-details-help]");
  });
  bindAIFeedback("details-write", source.write.aiFeedback, textarea);

  const spicyTextarea = document.querySelector("#details-spicy-draft");
  spicyTextarea.addEventListener("input", () => {
    setUnitState("details-write", { spicyWriting: spicyTextarea.value, spicyWritingOpen: true });
    document.querySelector("[data-details-spicy-count]").textContent = `${wordCount(spicyTextarea.value)} words`;
  });
  document.querySelector(".details-stage--spicy .optional-spicy-writing").addEventListener("toggle", (event) => {
    setUnitState("details-write", { spicyWritingOpen: event.target.open });
  });
}

function render({ focus = false } = {}) {
  const unit = content.units.find((item) => item.id === state.currentUnit) || content.units[0];
  state.currentUnit = unit.id;
  renderProgress();
  const renderers = {
    a0: renderA0,
    b1: renderB1,
    b2: renderB2,
    b4: renderB4,
    c1: renderOverviewPage,
    d1: renderD1,
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
  const requested = resolveUnitId(window.location.hash.slice(1));
  if (unitIndex(requested) >= 0 && canVisit(unitIndex(requested))) {
    state.currentUnit = requested;
    saveState(state);
    if (window.location.hash !== `#${requested}`) history.replaceState({ unit: requested }, "", `#${requested}`);
    render({ focus: true });
  }
});

const requestedUnit = resolveUnitId(window.location.hash.slice(1));
if (unitIndex(requestedUnit) >= 0 && canVisit(unitIndex(requestedUnit))) state.currentUnit = requestedUnit;
history.replaceState({ unit: state.currentUnit }, "", `#${state.currentUnit}`);
render();
