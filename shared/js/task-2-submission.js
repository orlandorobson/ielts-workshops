import { task2Questions } from "../../content/writing/task-2-question-bank.js";

const form = document.querySelector("#submission-form");
const fields = document.querySelector("#submission-fields");
const selector = form.elements.question_id;
const answer = form.elements.student_response;
const minutes = form.elements.actual_minutes;
const phone = form.elements.whatsapp_number;
const studentName = form.elements.student_name;
const panel = document.querySelector("#selected-question");
const count = document.querySelector("#count");
const status = document.querySelector("#submission-status");
const confirmation = document.querySelector("#submission-confirmation");
let submitting = false;
let submitted = false;

const wordCount = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;
const selectedQuestion = () => task2Questions.find((question) => question.id === selector.value);

task2Questions.forEach((question, index) => {
  selector.add(new Option(`Question ${index + 1} — ${question.title}`, question.id));
});

function updateQuestion() {
  const question = selectedQuestion();
  panel.replaceChildren();
  panel.hidden = !question;
  form.elements.question_title.value = question?.title || "";
  form.elements.question_text.value = question?.text || "";
  question?.text.split("\n\n").forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    panel.append(p);
  });
}

function updateCount() {
  const value = wordCount(answer.value);
  count.textContent = value;
  form.elements.word_count.value = value;
}

function updateTime() {
  const overTime = form.elements.completion_time_status.value === "Longer than 40 minutes";
  minutes.disabled = !overTime;
  minutes.required = overTime;
  if (!overTime) minutes.value = "";
  minutes.setCustomValidity(overTime && minutes.value !== "" && !(Number(minutes.value) > 40)
    ? "Enter a completion time greater than 40 minutes." : "");
}

function validateText() {
  answer.setCustomValidity(answer.value.trim() ? "" : "Enter your answer.");
  studentName.setCustomValidity(studentName.value.trim() ? "" : "Enter your name.");
  // Accept international/local formats, spaces, brackets, hyphens and a leading +.
  const value = phone.value.trim();
  const digits = value.replace(/\D/g, "");
  phone.setCustomValidity(/^\+?[\d\s().-]+$/.test(value) && digits.length >= 7 && digits.length <= 15
    ? "" : "Enter a WhatsApp number containing 7 to 15 digits, with an optional country code.");
}

selector.addEventListener("change", updateQuestion);
answer.addEventListener("input", () => { updateCount(); validateText(); });
studentName.addEventListener("input", validateText);
phone.addEventListener("input", validateText);
form.querySelectorAll('[name="completion_time_status"]').forEach((radio) => radio.addEventListener("change", updateTime));
minutes.addEventListener("input", updateTime);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitting || submitted) return;
  updateTime();
  validateText();
  if (!form.reportValidity()) return;
  if (!selectedQuestion()) return;
  updateQuestion();
  updateCount();
  form.elements.submitted_at.value = new Date().toISOString();
  // Snapshot before disabling controls: disabled fields are omitted by FormData.
  const payload = new FormData(form);
  payload.set("actual_minutes", minutes.disabled ? "" : minutes.value);
  submitting = true;
  fields.disabled = true;
  form.setAttribute("aria-busy", "true");
  status.hidden = false;
  status.dataset.error = "false";
  status.textContent = "Submitting your writing…";
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Submission not confirmed");
    submitted = true;
    answer.readOnly = true;
    form.hidden = true;
    status.hidden = true;
    confirmation.hidden = false;
    confirmation.focus();
  } catch {
    fields.disabled = false;
    updateTime();
    status.dataset.error = "true";
    status.textContent = "Your writing has not been submitted. Your answer is still here. Please try again.";
    status.focus();
  } finally {
    submitting = false;
    form.removeAttribute("aria-busy");
  }
});

updateQuestion();
updateCount();
updateTime();
fields.disabled = false;
