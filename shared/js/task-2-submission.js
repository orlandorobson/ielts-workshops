import { task2Questions } from "../../content/writing/task-2-question-bank.js";
import { academicExplorerTasks } from "../../content/writing/academic-explorer-tasks.js";
import { generalTask1Questions } from "../../content/writing/general-task-1-question-bank.js";
import { renderExplorerTaskVisual } from "../visuals/academic-explorer-visuals.js";

const form = document.querySelector('#submission-form');
const fields = document.querySelector('#submission-fields');
const selector = form.elements.question_id;
const answer = form.elements.student_response;
const minutes = form.elements.actual_minutes;
const panel = document.querySelector('#selected-question');
const status = document.querySelector('#submission-status');
const confirmation = document.querySelector('#submission-confirmation');
const tabs = [...document.querySelectorAll('[role="tab"]')];
const configurations = {
  'academic-task-1': { label: 'Academic Task 1', limit: 20, words: 150, questions: academicExplorerTasks },
  'general-task-1': { label: 'General Training Task 1', limit: 20, words: 150, questions: generalTask1Questions },
  'task-2': { label: 'Task 2', limit: 40, words: 250, questions: task2Questions },
};
const storageKey = 'ielts-writing-submissions-v1';
let saved = { drafts: {}, selections: {} };
try {
  const value = JSON.parse(localStorage.getItem(storageKey));
  if (value && typeof value.drafts === 'object' && value.drafts && typeof value.selections === 'object' && value.selections) saved = value;
} catch { /* Storage may be unavailable; the form remains usable. */ }
let taskType = 'task-2';
let questionId = '';
let submitting = false;
let submitted = false;
const config = () => configurations[taskType];
const question = () => config().questions.find(q => q.id === selector.value);
const draftKey = () => `${taskType}:${questionId || 'unselected'}`;
const wordCount = text => text.trim() ? text.trim().split(/\s+/).length : 0;
const draftFields = ['student_response', 'student_name', 'whatsapp_number', 'eligibility_status', 'independent_writing_confirmed', 'completion_time_status', 'actual_minutes'];
function persist() {
  if (submitting || submitted) return;
  const draft = {};
  draftFields.forEach(name => { draft[name] = form.elements[name].value; });
  draft.independent_writing_confirmed = form.elements.independent_writing_confirmed.checked;
  draft.time_confirmed = document.querySelector('#time-commitment').checked;
  saved.drafts[draftKey()] = draft;
  saved.selections[taskType] = questionId;
  saved.taskType = taskType;
  try { localStorage.setItem(storageKey, JSON.stringify(saved)); }
  catch { document.querySelector('#draft-status').textContent = 'Draft saving is unavailable in this browser. Keep a copy of your answer before leaving.'; }
}
function restoreDraft() {
  const draft = saved.drafts[draftKey()] || {};
  draftFields.forEach(name => {
    const control = form.elements[name];
    if (control instanceof RadioNodeList) [...control].forEach(radio => { radio.checked = radio.value === draft[name]; });
    else if (control.type === 'checkbox') control.checked = draft[name] === true;
    else control.value = typeof draft[name] === 'string' ? draft[name] : '';
  });
  document.querySelector('#time-commitment').checked = draft.time_confirmed === true;
  updateCount(); updateTime();
  [answer, form.elements.student_name, form.elements.whatsapp_number].forEach(control => control.setCustomValidity(''));
}
function updateCount() {
  const count = wordCount(answer.value);
  document.querySelector('#count').textContent = count;
  form.elements.word_count.value = count;
}
function updateTime() {
  const over = document.querySelector('#over-time').checked;
  minutes.disabled = !over;
  minutes.required = over;
  if (!over) minutes.value = '';
  minutes.setCustomValidity(over && minutes.value !== '' && !(Number.isFinite(Number(minutes.value)) && Number(minutes.value) > config().limit)
    ? `Enter a completion time greater than ${config().limit} minutes.` : '');
  form.elements.time_limit_exceeded.value = String(over);
  form.elements.overrun_minutes.value = over && Number(minutes.value) > config().limit ? String(Number(minutes.value) - config().limit) : '';
}
function renderQuestion() {
  const q = question();
  panel.replaceChildren(); panel.hidden = !q;
  form.elements.question_title.value = q?.title || '';
  const text = q?.taskStatement ? `You should spend about 20 minutes on this task.\n\n${q.taskStatement}\n\n${q.taskInstruction}` : q?.text || '';
  form.elements.question_text.value = text;
  form.elements.question_visual_data.value = q?.taskStatement ? JSON.stringify({ id: q.id, visualKind: q.visualKind, data: q.data }) : '';
  text.split('\n\n').forEach(paragraph => {
    const p = document.createElement('p'); p.textContent = paragraph; panel.append(p);
  });
  if (q?.taskStatement) {
    const host = document.createElement('div'); host.className = 'explorer-visual-host';
    panel.append(host); renderExplorerTaskVisual(host, q, { compact: false });
  }
}
function updateURL() {
  const url = new URL(location.href);
  url.searchParams.set('task', taskType);
  if (questionId) url.searchParams.set('question', questionId); else url.searchParams.delete('question');
  history.replaceState(null, '', url);
}
function chooseTask(next, requestedQuestion) {
  taskType = next;
  const c = config();
  tabs.forEach(tab => { const active = tab.dataset.task === next; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; });
  document.querySelector('#writing-panel').setAttribute('aria-labelledby', `tab-${next}`);
  document.querySelectorAll('[data-time-limit]').forEach(el => { el.textContent = c.limit; });
  document.querySelectorAll('[data-min-words]').forEach(el => { el.textContent = c.words; });
  document.querySelector('#task-label').textContent = c.label;
  document.querySelector('#within-time').value = `Within ${c.limit} minutes`;
  document.querySelector('#over-time').value = `Longer than ${c.limit} minutes`;
  document.querySelector('#time-commitment').name = c.limit === 40 ? 'forty_minute_attempt_confirmed' : 'twenty_minute_attempt_confirmed';
  form.elements.task_type.value = taskType;
  form.elements.expected_minutes.value = c.limit;
  selector.replaceChildren(new Option('Choose a question', ''));
  c.questions.forEach((q, index) => selector.add(new Option(`${q.id} — ${q.title}`, q.id)));
  const selected = requestedQuestion ?? saved.selections[next];
  selector.value = c.questions.some(q => q.id === selected) ? selected : '';
  questionId = selector.value;
  renderQuestion(); restoreDraft(); updateURL();
}
selector.addEventListener('change', () => { persist(); questionId = selector.value; renderQuestion(); restoreDraft(); persist(); updateURL(); });
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => { if (submitting || submitted) return; persist(); chooseTask(tab.dataset.task); });
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
    if (next < 0 || submitting || submitted) return;
    event.preventDefault(); tabs[next].focus(); tabs[next].click();
  });
});
function validateText() {
  answer.setCustomValidity(answer.value.trim() ? '' : 'Enter your answer.');
  form.elements.student_name.setCustomValidity(form.elements.student_name.value.trim() ? '' : 'Enter your name.');
  const phone = form.elements.whatsapp_number;
  const value = phone.value.trim(); const digits = value.replace(/\D/g, '');
  phone.setCustomValidity(/^\+?[\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a WhatsApp number containing 7 to 15 digits, with an optional country code.');
}
form.addEventListener('input', () => { updateCount(); updateTime(); validateText(); persist(); });
form.addEventListener('change', () => { updateTime(); persist(); });
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting || submitted) return;
  updateTime(); validateText();
  if (!form.reportValidity() || !question()) return;
  renderQuestion(); updateCount(); persist();
  form.elements.submitted_at.value = new Date().toISOString();
  const payload = new FormData(form);
  payload.set('actual_minutes', minutes.disabled ? '' : minutes.value);
  payload.set('time_attempt_confirmed', document.querySelector('#time-commitment').checked ? 'Confirmed' : '');
  submitting = true; fields.disabled = true; tabs.forEach(t => { t.disabled = true; });
  form.setAttribute('aria-busy', 'true'); status.hidden = false; status.dataset.error = 'false'; status.textContent = 'Submitting your writing…';
  try {
    const response = await fetch(form.action, { method: 'POST', body: payload, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Submission not confirmed');
    submitted = true;
    delete saved.drafts[draftKey()];
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* Submission succeeded. */ }
    answer.readOnly = true; form.hidden = true; status.hidden = true; confirmation.hidden = false; confirmation.focus();
  } catch {
    fields.disabled = false; tabs.forEach(t => { t.disabled = false; }); updateTime();
    status.dataset.error = 'true'; status.textContent = 'Your writing has not been submitted. Your answer is still here. Please try again.'; status.focus();
  } finally { submitting = false; form.removeAttribute('aria-busy'); }
});
const params = new URLSearchParams(location.search);
const requested = params.get('task');
// An unqualified legacy URL always opens Task 2, even after visiting a Task 1 tab.
const initialTask = Object.hasOwn(configurations, requested) ? requested : 'task-2';
chooseTask(initialTask, params.get('question') ?? params.get('question_id') ?? undefined);
fields.disabled = false;
