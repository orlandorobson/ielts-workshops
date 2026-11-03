export const KEY = 'ielts-workshops:task2:continuous:v1';
export const LEGACY_KEYS = ['ielts-workshops:writing-task-2:v1', 'ielts-workshops:writing-task-2:workshop-2:v1'];
export function loadContinuous() {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const saved = JSON.parse(raw);
    if (saved?.version !== 1 || !saved.plan || !saved.choices || !saved.history) throw Error('Unsupported saved record');
    return saved;
  }
  // Archive both raw records, including unknown versions, without mutating either.
  return { version: 1, questionId: 'WT2-W06', attemptId: 'initial', plan: { body1: '', body2: '', view: '', explanation: '' }, introduction: '', choices: {}, history: Object.fromEntries(LEGACY_KEYS.map(key => [key, localStorage.getItem(key)])) };
}
export function saveContinuous(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch { return false; }
}

export function mergeContinuousChanges(current,latest,fields,baselineIntroduction,baselineDrafts={}) {
  const patch=Object.fromEntries([...fields].map(field=>[field,current[field]]));
  const merged={...current,...latest,...patch};
  if(fields.has('introduction') && latest.introduction && latest.introduction!==baselineIntroduction && latest.introduction!==current.introduction) {
    merged.introductionHistory=[...(latest.introductionHistory||[]),{text:latest.introduction,reason:'Saved in another screen before this edit',preservedAt:new Date().toISOString()}];
  }
  for(const field of ['paragraph1','paragraph2','conclusion']) {
    if(fields.has(field)&&latest[field]&&latest[field]!==baselineDrafts[field]&&latest[field]!==current[field]) {
      merged[`${field}History`]=[...(latest[`${field}History`]||[]),{text:latest[field],reason:'Saved in another screen before this edit',preservedAt:new Date().toISOString()}];
    }
  }
  return merged;
}

export function formatTask2Writing(work,question) {
  const plan=work.plan||{};
  return [
    ['Writing Task 2',question],
    ['My plan — paragraph 1',plan.body1],
    ['My plan — paragraph 2',plan.body2],
    ['My view',[plan.view,plan.explanation].filter(Boolean).join(' — ')],
    ['Introduction',work.introduction],
    ['Paragraph 1',work.paragraph1],
    ['Paragraph 2',work.paragraph2],
    ['Conclusion',work.conclusion],
  ].map(([title,value])=>`${title}\n${value||'Not written yet.'}`).join('\n\n');
}
