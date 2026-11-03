import {conclusionMarkup,bindConclusions,updateConclusionContext} from './task-2-conclusions.js?v=quality-check-3';
import {paragraphMarkup,bindParagraphs,updateParagraphContext} from './task-2-paragraphs.js?v=quality-check-3';
import { introductionMarkup, bindIntroductions, updateIntroPlan } from './task-2-introductions.js?v=quality-check-3';
import { levelMarkup, levelKeyMarkup, mountTask2Navigation } from './task-2-ui.js?v=quality-check-3';
import { loadContinuous, saveContinuous, mergeContinuousChanges, formatTask2Writing } from './task-2-continuous-storage.js?v=quality-check-3';
const escape = (s = '') => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let state;
let loadError = false;
try { state = loadContinuous(); } catch { loadError = true; state = { plan: {}, choices: {}, history: {}, introduction: '' }; }
const bank = await fetch('../../content/writing/task-2-canonical/task-2-workshop-question-bank-v1.0.json').then(r => { if (!r.ok) throw Error('Question bank unavailable'); return r.json(); });
const prompt = id => bank.questions.find(q => q.id === id).prompt;
const question = id => `<blockquote class="canonical-question" data-question="${id}">${escape(prompt(id))}</blockquote>`;
const vote = (id, answer, text, why) => `<section class="plan-card" data-vote="${id}" data-answer="${answer}"><h4>Plan ${id.endsWith('a') ? 'A' : 'B'}</h4><p>${text}</p><div role="group" aria-label="Judge plan ${id}">${['Cool','Splat'].map(v => `<button type="button" data-value="${v}" aria-label="${v}" title="${v}" aria-pressed="false">${levelMarkup(v.toLowerCase(), false, true)}</button>`).join(' ')}</div><p class="vote-feedback" role="status" data-why="${escape(why)}"></p></section>`;
document.body.classList.add('continuous-task2');
document.documentElement.style.scrollBehavior = 'auto';
document.querySelector('.workshop-options')?.remove();
document.querySelector('#app').innerHTML = `<header class="continuous-heading"><p class="eyebrow">Writing Task 2 · Think, then write</p><h1>A clear question.<br>A simple plan.</h1><p class="lead">You do not need a perfect plan or perfect sentences to get started. Understand the question, put related ideas together, and help the reader follow your answer.</p></header>
<section id="understand" class="workshop-section"><p class="eyebrow">01 · Understand the question</p><h2>What must your answer do?</h2><p>What is the question about? What must you answer? Look closely at who or what it asks about.</p>
<div class="contrast-grid"><details><summary>Causes or problems?</summary>${question('WT2-W07')}<p><strong>Causes:</strong> explain why there is noise, then suggest solutions.</p>${question('WT2-W05')}<p><strong>Problems:</strong> explain the problems local people have. Then suggest ways to help. Why tourists visit is a different question.</p><p>Effects are results of a change; causes are reasons it happens.</p></details>
<details><summary>Explain both sides or choose a side?</summary>${question('WT2-W03')}<p>Explain the good points and the problems. You do not need to choose a winning side.</p>${question('WT2-W04')}<p>Look at both sides. Which side matters more? Explain why. More points do not always make a stronger answer.</p></details>
<details><summary>Explain why, then say what you think?</summary><p>City noise asks you to explain causes and suggest solutions. You do not need to say “I agree”.</p>${question('WT2-W09')}<p>Say whether you think this change is good or bad.</p><p>The online-courses question below also asks why the change is happening.</p></details></div>
<h3>Your question · Adult online courses</h3>${question('WT2-W06')}<p><strong>Who and what?</strong> adults choosing online courses instead of classes in person.</p><fieldset class="job-choice" id="jobs"><legend>Which pair answers this question?</legend>${[['both','Explain why adults choose online courses, and say if the change is good or bad.'],['one','Only list the advantages and disadvantages of online courses.']].map(([v,t]) => `<label><input type="radio" name="jobs" value="${v}"> ${t}</label>`).join('')}<p id="jobs-feedback" role="status"></p></fieldset><p>For this question, tell the reader what you think near the start. This is our advice, not an IELTS rule.</p></section>
<section id="plan" class="workshop-section"><p class="eyebrow">02 · Plan the structure</p><h2>Which ideas belong together?</h2><p class="lead">Put ideas that belong together in the same group. A few words are enough.</p>${levelKeyMarkup()}<p>Cool: the plan answers the question. Splat: part of the answer is missing. The pictures describe the plan, not your level.</p>
<h3>City noise · Does each plan cover both jobs?</h3>${question('WT2-W07')}<div class="plan-grid">${vote('noise-a','Cool','Paragraph 1: causes — traffic, construction.<br>Paragraph 2: solutions — control noisy vehicles; limit building-work hours.','The first group says why there is noise. The second gives ways to reduce it. Both parts of this question have a place.')}${vote('noise-b','Splat','Paragraph 1: traffic noise.<br>Paragraph 2: construction noise.','These groups show two causes. Where are the solutions? Give solutions a place too. Two groups of causes could work for a different question.')}</div>
<h3>Cashless payments · Are both sides here?</h3>${question('WT2-W03')}<div class="plan-grid">${vote('cash-a','Cool','Paragraph 1: convenience and spending records.<br>Paragraph 2: access difficulties and failed payments.','There are good points and problems. Both parts of this question have a place. You do not need to choose a winning side.')}${vote('cash-b','Splat','Paragraph 1: advantages of cards.<br>Paragraph 2: advantages of phones.','Both groups show good points. This question also asks about problems. Add a group for those.')}</div>
<div class="own-plan" id="my-plan"><h3>Your plan · Adult online courses</h3><aside class="jobs-reminder"><strong>Your two jobs</strong><br>1. Explain why adults choose online courses.<br>2. Say if this change is good, bad or both.</aside><p>Try these groups to start. You can change them while writing. They are a useful option, not an IELTS rule.</p><form id="short-plan"><div class="plan-grid">${[['body1','Paragraph 1 — Why?'],['body2','Paragraph 2 — Positive or negative?']].map(([id,label]) => `<label for="${id}"><strong>${label}</strong><span>Short idea notes</span><textarea id="${id}" name="${id}" rows="4">${escape(state.plan[id])}</textarea></label>`).join('')}</div><fieldset><legend>My view</legend>${['positive','negative','mixed'].map(v => `<label class="view-choice"><input type="radio" name="view" value="${v}" ${state.plan.view === v ? 'checked' : ''}> ${v}</label>`).join('')}</fieldset><label for="explanation">Optional: a few words about your view</label><input id="explanation" name="explanation" value="${escape(state.plan.explanation)}"></form>
<details><summary>Need an idea?</summary><p>First ask why adults choose this way of studying. Then decide what the change means for them.</p><p>Study after work · Less contact with classmates</p></details><details><summary>See one example plan</summary><p>This is one possible plan. Your ideas can be different.</p><p>Why: study after work; no travel.<br>Good or bad? More adults can learn, but some need help.<br>My view: mostly good if learners can get help.</p></details><p id="save-status" role="status"></p><button type="button" id="retry-save">Retry saving</button> <button type="button" id="download-work">Download my work</button><p><a class="primary-button" href="#introductions">Start my introduction →</a> <a href="#intro-write">Go straight to writing</a></p></div></section>
${introductionMarkup(state,question)}
${paragraphMarkup(state,question)}
${conclusionMarkup(state,question)}
<details id="saved-work"><summary>Recover earlier workshop drafts</summary><p>Earlier plans and writing stay in their original records. They have not been replaced by this new plan.</p><pre id="history-copy"></pre><p>Download a backup to keep earlier drafts and your activity choices too.</p><button type="button" id="download-backup">Download backup</button></details>`;
const status = document.querySelector('#save-status');
const dirtyFields = new Set();
let timer;
let baselineIntroduction = state.introduction;
const baselineDrafts={paragraph1:state.paragraph1,paragraph2:state.paragraph2,conclusion:state.conclusion};
function changed(field) {
  dirtyFields.add(field);
  if(field==='plan'||field==='introduction') updateParagraphContext(state);
  if(['plan','introduction','paragraph1','paragraph2'].includes(field)) updateConclusionContext(state);
  clearTimeout(timer);
  if(status.textContent!=='Saving…') status.textContent = 'Saving…';
  document.querySelector('#intro-save-status').textContent='Saving…';
  document.querySelectorAll('.paragraph-save-status,.conclusion-save-status').forEach(node=>node.textContent='Saving…');
  timer = setTimeout(save,150);
}
function save() {
  let ok = false;
  if (!loadError) {
    try {
      const latest = loadContinuous();
      const merged = mergeContinuousChanges(state,latest,dirtyFields,baselineIntroduction,baselineDrafts);
      ok = saveContinuous(merged);
      if (ok) { if(dirtyFields.has('introduction')) baselineIntroduction=state.introduction;
        if(merged.introductionHistory) state.introductionHistory=merged.introductionHistory;
        for(const field of ['paragraph1','paragraph2','conclusion']) {
          if(dirtyFields.has(field)) baselineDrafts[field]=state[field];
          if(merged[`${field}History`]) state[`${field}History`]=merged[`${field}History`];
        }
        dirtyFields.clear(); }
    } catch { /* Preserve unreadable records; the editor and download remain available. */ }
  }
  document.querySelector('#retry-save').hidden = ok;
  status.textContent = ok ? 'Saved on this device.' : 'Saving unavailable. Your work is still here: download a copy, or retry saving. Existing records have been kept.';
  document.querySelector('#intro-save-status').textContent=status.textContent;
  document.querySelector('#intro-retry-save').hidden=ok;
  document.querySelectorAll('.paragraph-save-status,.conclusion-save-status').forEach(node=>node.textContent=status.textContent);
  document.querySelectorAll('.paragraph-retry-save,.conclusion-retry-save').forEach(button=>button.hidden=ok);
  return ok;
}
document.querySelector('#retry-save').onclick = save;
document.querySelector('#intro-retry-save').onclick=save;
document.querySelector('#intro-download-work').onclick=()=>document.querySelector('#download-work').click();
function downloadableWork() {
  try { if(!loadError) return mergeContinuousChanges(state,loadContinuous(),dirtyFields,baselineIntroduction,baselineDrafts); } catch { /* Keep the current session downloadable. */ }
  return state;
}
function downloadFile(text,name,type) {
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
document.querySelector('#download-work').onclick=()=>downloadFile(formatTask2Writing(downloadableWork(),prompt('WT2-W06')),'task-2-writing.txt','text/plain');
document.querySelector('#download-backup').onclick=()=>downloadFile(JSON.stringify(downloadableWork(),null,2),'task-2-backup.json','application/json');
document.querySelector('#history-copy').textContent = Object.entries(state.history).filter(([,v]) => v).map(([k,v]) => `${k}\n${v}`).join('\n\n') || 'No earlier saved drafts found on this device.';
for(const field of ['paragraph1','paragraph2','conclusion']) if(state[`${field}History`]?.length) document.querySelector('#history-copy').textContent += '\n\nPreserved writing versions\n'+JSON.stringify(state[`${field}History`],null,2);
if(state.introductionHistory?.length) document.querySelector('#history-copy').textContent += '\n\nPreserved introduction versions\n'+JSON.stringify(state.introductionHistory,null,2);
document.querySelector('#short-plan').addEventListener('input', () => { state.plan = {...state.plan,...Object.fromEntries(new FormData(document.querySelector('#short-plan')))}; updateIntroPlan(state); changed('plan'); });
function jobs(value) { document.querySelector('#jobs-feedback').textContent = value === 'both' ? 'Yes. Say why adults choose online courses and what you think about the change. Answer both questions.' : 'You could use some of these ideas. But why do adults choose online courses? Choose the answer that includes why and what you think.'; }
document.querySelectorAll('[name="jobs"]').forEach(input => { input.checked = state.choices.jobs === input.value; input.onchange = () => { state.choices.jobs = input.value; jobs(input.value); dirtyFields.add('choices'); save(); }; });
if (state.choices.jobs) jobs(state.choices.jobs);
function feedback(card,value) { card.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.value === value))); card.querySelector('.vote-feedback').textContent = `${value === card.dataset.answer ? 'Yes.' : 'Look again.'} ${card.dataset.answer}: ${card.querySelector('.vote-feedback').dataset.why} You can change your vote.`; }
document.querySelectorAll('[data-vote]').forEach(card => { const id=card.dataset.vote; if(state.choices[id]) feedback(card,state.choices[id]); card.querySelectorAll('button').forEach(button => button.onclick = () => { state.choices[id] = button.dataset.value; feedback(card,button.dataset.value); dirtyFields.add('choices'); save(); }); });
window.addEventListener('pagehide',save);
document.addEventListener('visibilitychange', () => { if(document.hidden) save(); });
bindIntroductions(state,changed);
bindParagraphs(state,changed,save,()=>document.querySelector('#download-work').click());
bindConclusions(state,changed,save,()=>document.querySelector('#download-work').click());
const map = {c1:'conclusions',c2:'conclusion-check',c3:'conclusion-write',c4:'conclusion-write',b1:'paragraph-check',b2:'paragraph-repair',b3:'paragraph-one',b4:'paragraph-one',b5:'paragraph-two',b6:'paragraph-two',i1:'introductions',i2:'intro-demand',f1:'intro-cool',f2:'intro-decide',o3:'intro-write',end:'intro-write',u1:'understand',u2:'understand',u3:'understand',u3p:'understand',u4:'understand',u5:'understand',u6:'understand',q3:'understand',q4:'understand',q5:'understand',n1:'understand',o1:'understand',s1:'plan',p1:'plan',p2:'plan',o2:'plan'};
if(map[location.hash.slice(1)]) history.replaceState(null,'',`#${map[location.hash.slice(1)]}`);
function revealTarget(id) {
  const target=document.getElementById(id);
  if(target?.matches('details')) target.open=true;
  if(id==='saved-work') document.querySelector('.activity-jump').open=true;
  return target;
}
if(location.hash) requestAnimationFrame(() => revealTarget(location.hash.slice(1))?.scrollIntoView());
save();

mountTask2Navigation({current: location.hash.slice(1) || 'understand', onNavigate: (id,href) => {
  const target = revealTarget(id);
  if(!target) { location.assign(href); return; }
  history.pushState(null,'',`#${id}`);
  target.scrollIntoView();
  const heading = target.querySelector('h2,h3,legend') || target;
  heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true});
}});
// Recovery is a menu utility, not another step after the conclusion.
const recovery=document.querySelector('#saved-work');
recovery.querySelector('summary').textContent='Saved work and earlier drafts';
const savedWorkLink=document.querySelector('.activity-menu-panel a[href$="#saved-work"]');
savedWorkLink.replaceWith(recovery);
// Use page position, rather than observer arrival order, to show the current activity.
const activityIds=[...document.querySelectorAll('#activity-jump option')].map(option=>option.value);
let navigationFrame;
function updateCurrentActivity() {
  navigationFrame=null;
  const select=document.querySelector('#activity-jump');
  if(select.closest('details').open) return;
  const positions=activityIds.map(id=>({id,node:document.getElementById(id)})).filter(item=>item.node?.getClientRects().length).map(item=>({...item,top:item.node.getBoundingClientRect().top}));
  const passed=positions.filter(item=>item.top<=120).sort((a,b)=>b.top-a.top);
  const id=passed[0]?.id||'understand';
  const section=id==='understand'||id==='jobs'?0:['plan','my-plan'].includes(id)?1:id.startsWith('paragraph')?3:id.startsWith('conclusion')?4:2;
  document.querySelectorAll('[data-section-index]').forEach(link=>{if(Number(link.dataset.sectionIndex)===section) link.setAttribute('aria-current','step');else link.removeAttribute('aria-current');});
  select.value=id;
}
window.addEventListener('scroll',()=>{if(!navigationFrame)navigationFrame=requestAnimationFrame(updateCurrentActivity);},{passive:true});
requestAnimationFrame(updateCurrentActivity);
