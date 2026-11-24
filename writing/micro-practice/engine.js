import { activities, bonusActivity, source } from './content.js';

export function shuffle(options, random = Math.random) {
  const result = [...options];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export const wordCount = text => (text.trim().match(/\S+/g) || []).length;
export const isAccepted = (gap, value) => (gap.accepted || [gap.answer]).includes(value);
const STORAGE_KEY = 'ielts-writing-micro-practice-v2';
const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = text;
  if (className) node.className = className;
  return node;
};
function button(text, className, action) {
  const node = el('button', text, className);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}
function focus(node) {
  node.tabIndex = -1;
  node.focus({ preventScroll: true });
  node.scrollIntoView({ block: 'nearest', behavior: 'instant' });
}
function status() {
  const node = el('div', null, 'feedback');
  node.setAttribute('role', 'status');
  node.setAttribute('aria-live', 'polite');
  return node;
}
function progress(root, index, total, unit = 'Question') {
  const label = el('p', `${unit} ${Math.min(index + 1, total)} of ${total}`, 'progress-label');
  const bar = el('progress');
  bar.max = total;
  bar.value = index;
  bar.setAttribute('aria-label', `${index} of ${total} completed`);
  root.append(label, bar);
  return bar;
}
function reveal(card, content) {
  if (!content) return;
  card.append(el('h3', content.title), el('p', content.text));
  if (content.examples?.length) {
    const examples = el('div', null, 'examples');
    content.examples.forEach(example => {
      const row = el('p', null, 'example');
      row.setAttribute('aria-label', `${example.stem}${example.removed}: remove ${example.removed}, add ${example.suffix}, to make ${example.result}`);
      const visual = el('span');
      visual.setAttribute('aria-hidden', 'true');
      visual.append(document.createTextNode(example.stem), el('del', example.removed), document.createTextNode(' + '), el('span', example.suffix, 'suffix'), document.createTextNode(' → '), el('strong', example.result));
      row.append(visual);
      examples.append(row);
    });
    card.append(examples);
  }
  if (content.note) card.append(el('p', content.note, 'word-bank'));
}
function chart(data) {
  const figure = el('figure', null, 'chart');
  figure.append(el('figcaption', data.title));
  if (data.subtitle) figure.append(el('p', data.subtitle, 'muted'));
  const table = el('table');
  const head = el('tr');
  head.append(el('th', 'Category'), el('th', 'Percentage'));
  const thead = el('thead'); thead.append(head); table.append(thead);
  const body = el('tbody');
  data.rows.forEach(([name, value]) => {
    const row = el('tr');
    const label = el('th', name); label.scope = 'row';
    const cell = el('td');
    const track = el('span', null, 'bar-track');
    track.setAttribute('aria-hidden', 'true');
    const fill = el('span', null, 'bar-fill'); fill.style.width = `${value}%`; track.append(fill);
    cell.append(el('span', `${value}%`), track);
    row.append(label, cell); body.append(row);
  });
  table.append(body); figure.append(table);
  return figure;
}
function sourcePanel() {
  const details = el('details', null, 'source-panel');
  details.append(el('summary', 'View the practice figures'));
  details.append(chart({ title: source.title, rows: source.usage }));
  const table = el('table');
  const caption = el('caption', 'Reported audience overlap labels'); table.append(caption);
  const body = el('tbody');
  source.overlap.forEach(([label, value]) => {
    const row = el('tr'); const th = el('th', label); th.scope = 'row';
    row.append(th, el('td', `${value}%`)); body.append(row);
  });
  table.append(body); details.append(table, el('p', source.note, 'muted'));
  return details;
}

// The choice engine also accepts standalone content matching the original API.
export function mountActivity(root, content, hooks = {}) {
  const round = hooks.round || { index: 0, choices: [], sets: [] };
  const save = hooks.save || (() => {});
  const total = content.questions.length;
  function renderQuestion(moveFocus = true) {
    const index = round.index;
    const question = content.questions[index];
    if (!question) return results();
    root.replaceChildren();
    const bar = progress(root, index, total);
    if (content.showSource) root.append(sourcePanel());
    const card = el('div', null, 'card');
    const heading = el('h2', question.sentence, 'sentence');
    const prompt = el('p', content.instruction || 'Choose the correct spelling.', 'muted');
    const options = el('div', null, `options${question.options.length > 2 ? ' long-options' : ''}`);
    options.setAttribute('role', 'group'); options.setAttribute('aria-label', question.sentence);
    const feedback = status();
    const next = button(index === total - 1 ? 'See what you discovered →' : 'Next question →', 'next', () => {
      round.index++; save(); renderQuestion();
    });
    next.hidden = true;
    function showFeedback(value) {
      const correct = value === question.answer;
      options.querySelectorAll('button').forEach(answer => {
        answer.disabled = true;
        if (answer.textContent === question.answer) answer.classList.add('correct');
        if (answer.textContent === value && !correct) answer.classList.add('incorrect');
      });
      feedback.replaceChildren(el('p', correct ? content.feedback.correct : content.feedback.incorrect));
      if (question.explanations) {
        // Explain alternatives in the displayed order, matching the shuffled buttons.
        const list = el('ul', null, 'explanation-list');
        options.querySelectorAll('button').forEach(answer => {
          const item = el('li');
          item.append(el('strong', `${answer.textContent} `), document.createTextNode(question.explanations[question.options.indexOf(answer.textContent)]));
          list.append(item);
        });
        feedback.append(list);
      } else {
        feedback.append(el('p', question.sentence.replace('___', question.answer), 'correction'));
        if (question.explanation) feedback.append(el('p', question.explanation));
      }
      next.hidden = false;
      bar.value = index + 1;
      bar.setAttribute('aria-label', `${index + 1} of ${total} completed`);
    }
    shuffle(question.options).forEach(option => {
      options.append(button(option, 'answer', () => {
        if (round.choices[index] !== undefined) return;
        round.choices[index] = option; save();
        showFeedback(option);
        next.focus({ preventScroll: true });
      }));
    });
    card.append(heading, prompt, options, feedback, next); root.append(card);
    if (round.choices[index] !== undefined) showFeedback(round.choices[index]);
    if (moveFocus) focus(heading);
  }
  function results() {
    const score = content.questions.filter((q, i) => round.choices[i] === q.answer).length;
    showResults(root, content, score, total, hooks, () => {
      round.index = 0; round.choices = []; save(); renderQuestion();
    });
  }
  renderQuestion(false);
}

function showResults(root, content, score, total, hooks, retry) {
  hooks.complete?.({ correct: score, total });
  root.replaceChildren();
  const card = el('div', null, 'card results');
  const heading = el('h2', 'Practice complete');
  card.append(heading, el('p', `${score} / ${total} · ${Math.round(score / total * 100)}%`, 'score'), el('p', 'First-attempt accuracy for this round', 'muted'));
  const first = hooks.first?.();
  if (first && (first.correct !== score || first.total !== total)) card.append(el('p', `Your first completed round: ${first.correct}/${first.total} (${Math.round(first.correct / first.total * 100)}%).`, 'muted'));
  reveal(card, content.reveal);
  if (content.bonus) {
    const link = el('a', 'Practise second, third and together →', 'activity-link'); link.href = `#${content.bonus}`; card.append(link);
  }
  card.append(button(content.id === 'silent-e-ing' ? 'Try all ten again →' : 'Try again →', 'next', retry));
  const home = el('a', 'Back to all activities', 'activity-link'); home.href = '#'; card.append(home);
  root.append(card); focus(heading);
}

function mountTextActivity(root, content, hooks) {
  const round = hooks.round;
  function render(moveFocus = true) {
    const index = round.index;
    const text = content.texts[index];
    if (!text) {
      const correct = round.sets.reduce((sum, set) => sum + set.correct, 0);
      const total = round.sets.reduce((sum, set) => sum + set.total, 0);
      return showResults(root, content, correct, total, hooks, () => {
        round.index = 0; round.sets = []; hooks.save(); render();
      });
    }
    root.replaceChildren();
    const bar = progress(root, index, content.texts.length, content.type === 'bank' ? 'Text' : 'Paragraph');
    root.append(sourcePanel());
    const card = el('div', null, 'card');
    const heading = el('h2', text.title || `Text ${index + 1}`);
    card.append(heading, el('p', content.instruction, 'muted'));
    let values = [];
    const saved = round.sets[index];
    if (saved) values = [...saved.values];
    let locked = Boolean(saved);
    let selected = null;
    const gaps = content.type === 'bank' ? text.answers.map((answer, i) => ({ answer, why: text.explanations[i] })) : text.parts.filter(part => typeof part !== 'string');
    const bank = el('div', null, 'bank');
    const bankStatus = status();
    if (content.type === 'bank') {
      bank.setAttribute('role', 'group'); bank.setAttribute('aria-label', 'Word bank');
      card.append(bank, bankStatus);
    }
    const paragraph = el('p', null, 'practice-paragraph');
    const controls = [];
    const bankOrder = content.type === 'bank' ? shuffle(content.bank) : [];
    function updateBank() {
      bank.replaceChildren();
      bankOrder.forEach(word => {
        const used = values.includes(word);
        const token = button(word, `token${selected === word ? ' selected' : ''}`, () => {
          if (token.dataset.dragged === 'true') { token.dataset.dragged = 'false'; return; }
          selected = selected === word ? null : word;
          updateBank();
          bankStatus.textContent = selected ? `${selected} selected. Tap an empty gap.` : 'Selection cleared.';
          const active = [...bank.querySelectorAll('button')].find(b => b.textContent === word); active?.focus({ preventScroll: true });
        });
        token.disabled = locked || used;
        token.setAttribute('aria-pressed', String(selected === word));
        token.draggable = !used && !locked;
        token.addEventListener('dragstart', event => {
          event.dataTransfer.setData('text/plain', word);
          event.dataTransfer.effectAllowed = 'move';
        });
        // Touch browsers do not consistently expose HTML drag-and-drop.
        // Pointer dragging supplements native mouse dragging; taps still use click.
        let touchDrag;
        token.addEventListener('pointerdown', event => {
          if (event.pointerType !== 'touch' || used || locked) return;
          touchDrag = { x: event.clientX, y: event.clientY, moved: false };
          token.setPointerCapture(event.pointerId);
        });
        token.addEventListener('pointermove', event => {
          if (!touchDrag) return;
          if (Math.hypot(event.clientX - touchDrag.x, event.clientY - touchDrag.y) > 8) touchDrag.moved = true;
          if (!touchDrag.moved) return;
          event.preventDefault();
          const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.gap');
          controls.forEach(control => control.classList.toggle('drop-target', control === target));
        });
        const endTouch = event => {
          if (!touchDrag) return;
          const moved = touchDrag.moved;
          touchDrag = undefined;
          controls.forEach(control => control.classList.remove('drop-target'));
          if (moved && event.type === 'pointerup') {
            token.dataset.dragged = 'true';
            const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.gap');
            const gapIndex = controls.indexOf(target);
            if (gapIndex !== -1) place(gapIndex, word);
          }
        };
        token.addEventListener('pointerup', endTouch);
        token.addEventListener('pointercancel', endTouch);
        bank.append(token);
      });
    }
    function place(i, word) {
      if (locked || !content.bank.includes(word) || values.includes(word)) return;
      values[i] = word; selected = null;
      updateBank(); updateGaps();
      bankStatus.textContent = `${word} placed in gap ${i + 1}.`;
    }
    function updateGaps() {
      controls.forEach((control, i) => {
        control.textContent = values[i] || `Gap ${i + 1}`;
        control.setAttribute('aria-label', `Gap ${i + 1}: ${values[i] || 'empty'}. ${values[i] ? 'Tap to return word.' : 'Tap to place selected word.'}`);
        control.disabled = locked;
      });
    }
    let gapIndex = 0;
    const parts = content.type === 'bank' ? text.parts.flatMap((part, i) => i < text.answers.length ? [part, { answer: text.answers[i] }] : [part]) : text.parts;
    parts.forEach(part => {
      if (typeof part === 'string') { paragraph.append(document.createTextNode(part)); return; }
      const i = gapIndex++;
      if (content.type === 'bank') {
        const gap = button('', 'gap', () => {
          if (values[i]) { const old = values[i]; values[i] = undefined; selected = null; updateBank(); updateGaps(); bankStatus.textContent = `${old} returned to the bank.`; }
          else if (selected) place(i, selected);
          else bankStatus.textContent = 'Tap a word in the bank first.';
        });
        gap.addEventListener('dragover', event => { if (!locked) event.preventDefault(); });
        gap.addEventListener('drop', event => { event.preventDefault(); place(i, event.dataTransfer.getData('text/plain')); });
        controls.push(gap); paragraph.append(gap);
      } else {
        const menu = el('select', null, part.kind === 'case' ? 'inline-case' : 'inline-punctuation');
        menu.setAttribute('aria-label', `${part.kind === 'case' ? 'Capital letter' : 'Punctuation'} ${i + 1}`);
        const placeholder = el('option', `${i + 1} · Choose`); placeholder.value = '?'; menu.append(placeholder);
        shuffle(part.options || ['.', ',', '']).forEach(value => {
          const option = el('option', part.kind === 'case' ? value : value === '.' ? '. full stop' : value === ',' ? ', comma' : 'no punctuation');
          option.value = value; menu.append(option);
        });
        menu.value = values[i] ?? '?'; menu.disabled = locked;
        menu.addEventListener('change', () => { values[i] = menu.value === '?' ? undefined : menu.value; });
        controls.push(menu); paragraph.append(menu);
      }
    });
    if (content.type === 'bank') { updateBank(); updateGaps(); }
    const feedback = status();
    const check = button('Check this text', 'next', () => {
      if (gaps.some((_, i) => values[i] === undefined)) {
        feedback.textContent = 'Choose an answer for every gap first.';
        controls[gaps.findIndex((_, i) => values[i] === undefined)].focus(); return;
      }
      locked = true;
      const correct = gaps.filter((gap, i) => isAccepted(gap, values[i])).length;
      round.sets[index] = { values: [...values], correct, total: gaps.length }; hooks.save();
      showFeedback(correct); next.focus({ preventScroll: true });
    });
    const next = button(index === content.texts.length - 1 ? 'Finish activity →' : 'Next text →', 'next', () => { round.index++; hooks.save(); render(); }); next.hidden = true;
    function showFeedback(correct) {
      bar.value = index + 1;
      bar.setAttribute('aria-label', `${index + 1} of ${content.texts.length} completed`);
      controls.forEach(control => { control.disabled = true; });
      if (content.type === 'bank') updateBank();
      check.hidden = true; next.hidden = false;
      feedback.replaceChildren(el('p', correct === gaps.length ? 'Well done — all your choices fit.' : 'Good effort. Read the corrected text and notice the changes.'), el('p', `${correct} / ${gaps.length} correct on your first check.`, 'correction'));
      const corrected = parts.map(part => typeof part === 'string' ? part : part.answer).join('');
      feedback.append(el('h3', 'Read it together'), el('p', corrected));
      const list = el('ul');
      gaps.forEach((gap, i) => {
        const correct = isAccepted(gap, values[i]);
        const value = correct ? values[i] : gap.answer;
        const label = value === '' ? 'no punctuation' : value === '.' ? 'full stop' : value === ',' ? 'comma' : value;
        list.append(el('li', `Gap ${i + 1}: ${correct ? 'Correct' : 'Try this'} — ${label}. ${gap.why}`));
      });
      feedback.append(list);
    }
    card.append(paragraph, feedback, check, next); root.append(card);
    if (saved) showFeedback(saved.correct);
    if (moveFocus) focus(heading);
  }
  render(false);
}

function mountWriting(root, content, hooks) {
  root.replaceChildren();
  const card = el('div', null, 'card');
  card.append(el('h2', 'A new chart'), el('p', content.instruction), chart(content.chart));
  const label = el('label', 'Your report (40–60 words)'); label.htmlFor = 'independent-response';
  const input = el('textarea'); input.id = 'independent-response'; input.rows = 9;
  const count = el('p', '0 words', 'muted'); count.id = 'word-count'; count.setAttribute('aria-live', 'polite');
  input.setAttribute('aria-describedby', 'word-count');
  input.addEventListener('input', () => { count.textContent = `${wordCount(input.value)} words`; });
  const feedback = status();
  const review = el('fieldset'); review.hidden = true;
  review.append(el('legend', 'Read your writing. Tick each check when it is ready.'));
  const checks = content.checks.map((text, i) => {
    const row = el('label', null, 'check-row'); const box = el('input'); box.type = 'checkbox'; box.id = `review-${i}`;
    row.append(box, document.createTextNode(text)); review.append(row); return box;
  });
  const finish = button('Save completion', 'next', () => {
    if (checks.some(box => !box.checked)) { feedback.textContent = 'Read your writing and tick all three checks first.'; return; }
    hooks.complete({ selfReviewed: true, words: wordCount(input.value) });
    feedback.replaceChildren(el('p', 'Well done — you have written and checked your report.'));
    input.disabled = true; finish.hidden = true; submit.hidden = true; retry.hidden = false;
    const first = hooks.first?.();
    feedback.append(el('p', `First draft: ${first?.words ?? wordCount(input.value)} words. Writing is self-reviewed; there is no automatic language accuracy score.`, 'muted'));
    focus(feedback);
  });
  finish.hidden = true;
  const submit = button('Check my draft', 'next', () => {
    const words = wordCount(input.value);
    if (words === 0) { feedback.textContent = 'Write your report first.'; input.focus(); return; }
    hooks.draft?.(words);
    if (words < 40 || words > 60) {
      feedback.textContent = `You have ${words} words. Aim for 40–60 words. Add a comparison or shorten your report, then check again.`;
      review.hidden = true; finish.hidden = true; return;
    }
    feedback.textContent = 'Your report is in the 40–60-word range. Now read it and use the three checks. This page does not mark your grammar automatically.';
    review.hidden = false; finish.hidden = false;
  });
  const retry = button('Write again →', 'next', () => mountWriting(root, content, hooks)); retry.hidden = true;
  input.addEventListener('input', () => { review.hidden = true; finish.hidden = true; checks.forEach(box => { box.checked = false; }); });
  card.append(label, input, count, feedback, submit, review, finish, retry);
  const home = el('a', 'Back to all activities', 'activity-link'); home.href = '#'; card.append(home);
  if (hooks.first?.()) card.append(el('p', 'You have completed this activity before. You can write another report here.', 'muted'));
  root.append(card);
}

export function startWorkshop(root) {
  let state = {};
  let storageAvailable = true;
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); if (!state || typeof state !== 'object' || Array.isArray(state)) state = {}; }
  catch { state = {}; storageAvailable = false; }
  const persist = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { storageAvailable = false; }
    const notice = document.querySelector('#storage-note');
    if (notice) notice.textContent = storageAvailable ? 'Progress and first-round scores are saved only on this device. Your writing is not saved.' : 'This browser cannot save progress. Keep this page open to keep your results. Your writing is not saved.';
  };
  const title = document.querySelector('h1');
  const intro = document.querySelector('.intro');
  function route() {
    const id = location.hash.slice(1);
    const content = [...activities, bonusActivity].find(item => item.id === id);
    root.replaceChildren();
    if (!content) {
      title.textContent = 'Writing micro-practice';
      intro.textContent = 'Small steps for clearer writing. Start anywhere. Take your time.';
      document.title = 'Writing micro-practice · IELTS Workshops';
      const completed = activities.filter(item => state[item.id]?.complete).length;
      root.append(el('h2', 'Choose your practice'), el('p', `${completed} of 9 activities completed on this device`, 'progress-label'));
      const nav = el('nav', null, 'activity-grid'); nav.setAttribute('aria-label', 'Workshop activities');
      activities.forEach((item, i) => {
        const entry = state[item.id];
        const link = el('a', null, 'activity-tile'); link.href = `#${item.id}`;
        link.append(el('span', String(i + 1).padStart(2, '0'), 'tile-number'), el('h3', item.title), el('p', item.description));
        const badge = entry?.complete ? 'Completed ✓' : entry?.round?.choices?.length || entry?.round?.sets?.length ? 'In progress' : 'Start practice →';
        link.append(el('span', badge, entry?.complete ? 'completion' : 'muted'));
        if (entry?.first?.total) link.append(el('span', `First round: ${entry.first.correct}/${entry.first.total} · ${Math.round(entry.first.correct / entry.first.total * 100)}%`, 'saved-score'));
        if (entry?.first?.selfReviewed) link.append(el('span', 'Self-reviewed writing', 'saved-score'));
        nav.append(link);
      });
      root.append(nav, sourcePanel());
    } else {
      title.textContent = content.title;
      intro.textContent = content.id === 'silent-e-ing' ? 'Ten small choices. One useful pattern.' : content.description;
      document.title = `${content.title} · IELTS micro-practice`;
      const home = el('a', '← All activities', 'back-link'); home.href = '#'; root.append(home);
      if (content.id === 'silent-e-ing') {
        const extra = el('a', 'More spellings: second, third, together →', 'activity-link small-link'); extra.href = '#more-word-forms'; root.append(extra);
      }
      const area = el('div'); root.append(area);
      const entry = state[content.id] ||= {};
      entry.round ||= { index: 0, choices: [], sets: [] };
      const hooks = {
        round: entry.round, save: persist, first: () => entry.first,
        complete: result => { entry.first ||= result; entry.latest = result; entry.complete = true; persist(); },
        draft: words => { entry.firstDraftWords ??= words; persist(); }
      };
      if (content.type === 'choice') mountActivity(area, content, hooks);
      else if (content.type === 'writing') {
        hooks.first = () => entry.first ? { ...entry.first, words: entry.firstDraftWords ?? entry.first.words } : undefined;
        mountWriting(area, content, hooks);
      } else mountTextActivity(area, content, hooks);
    }
    persist();
    focus(title);
  }
  window.addEventListener('hashchange', route);
  route();
}
if (typeof document !== 'undefined') {
  const root = document.querySelector('#activity');
  if (root) startWorkshop(root);
}
