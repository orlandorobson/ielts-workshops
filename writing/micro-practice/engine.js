import { activity } from './content.js';

// Fisher–Yates: a fresh, independent shuffle, never a forced alternation.
export function shuffle(options, random = Math.random) {
  const result = [...options];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function mountActivity(root, content) {
  let index = 0;
  let score = 0;
  let answered = false;
  const total = content.questions.length;
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  function focus(node) {
    node.tabIndex = -1;
    node.focus({ preventScroll: true });
  }
  function renderQuestion(moveFocus = true) {
    answered = false;
    const question = content.questions[index];
    root.replaceChildren();
    const progressLabel = el('p', `Question ${index + 1} of ${total}`, 'progress-label');
    const progress = el('progress');
    progress.max = total;
    progress.value = index;
    progress.setAttribute('aria-label', `${index} of ${total} questions completed`);
    const card = el('div', null, 'card');
    const heading = el('h2', question.sentence, 'sentence');
    const prompt = el('p', 'Choose the correct spelling.', 'muted');
    const options = el('div', null, 'options');
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', question.sentence);
    const feedback = el('div', null, 'feedback');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    const next = el('button', index === total - 1 ? 'See what you discovered →' : 'Next question →', 'next');
    next.type = 'button';
    next.hidden = true;
    next.addEventListener('click', () => {
      index++;
      if (index === total) renderResults();
      else renderQuestion();
    });
    shuffle(question.options).forEach(option => {
      const button = el('button', option, 'answer');
      button.type = 'button';
      button.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const correct = option === question.answer;
        if (correct) score++;
        options.querySelectorAll('button').forEach(answer => {
          answer.disabled = true;
          if (answer.textContent === question.answer) answer.classList.add('correct');
        });
        if (!correct) button.classList.add('incorrect');
        feedback.append(el('p', correct ? content.feedback.correct : content.feedback.incorrect));
        feedback.append(el('p', question.sentence.replace('___', question.answer), 'correction'));
        next.hidden = false;
        progress.value = index + 1;
        progress.setAttribute('aria-label', `${index + 1} of ${total} questions completed`);
        // Keep the next keyboard action reachable after disabling the answer buttons.
        next.focus({ preventScroll: true });
      });
      options.append(button);
    });
    card.append(heading, prompt, options, feedback, next);
    root.append(progressLabel, progress, card);
    if (moveFocus) focus(heading);
  }
  function renderResults() {
    root.replaceChildren();
    const card = el('div', null, 'card results');
    const heading = el('h2', 'Practice complete');
    card.append(heading, el('p', `${score} / ${total} · ${Math.round(score / total * 100)}%`, 'score'), el('p', 'First-attempt accuracy for this round', 'muted'));
    card.append(el('h3', content.reveal.title), el('p', content.reveal.text));
    const examples = el('div', null, 'examples');
    content.reveal.examples.forEach(example => {
      const row = el('p', null, 'example');
      row.setAttribute('aria-label', `${example.stem}${example.removed}: remove ${example.removed}, add ${example.suffix}, to make ${example.result}`);
      const visual = el('span');
      visual.setAttribute('aria-hidden', 'true');
      visual.append(document.createTextNode(example.stem), el('del', example.removed), document.createTextNode(' + '), el('span', example.suffix, 'suffix'), document.createTextNode(' → '), el('strong', example.result));
      row.append(visual);
      examples.append(row);
    });
    card.append(examples, el('p', content.reveal.note, 'word-bank'));
    const retry = el('button', 'Try all ten again →', 'next');
    retry.type = 'button';
    retry.addEventListener('click', () => { index = 0; score = 0; renderQuestion(); });
    card.append(retry);
    root.append(card);
    focus(heading);
  }
  renderQuestion(false);
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('#activity');
  if (root) mountActivity(root, activity);
}
