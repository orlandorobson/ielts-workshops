import {mountStudentConnection} from '../../shared/classroom/client.js';
import {sourceActivity,mountSourceActivities} from './source-activities.js';
import {answerRelease,answerReleaseConfig,checkingControl,syncCheckingControls} from './answer-release.js';
import {tasks,instruction,phrases,speaking,spellingWords,validSpellingItems,shuffle,mark} from '../../content/listening/day-1.js';
const key='ielts-listening-day-1-v1';
let state={}; let storageOK=true;
try {state=JSON.parse(localStorage.getItem(key)||'{}')||{}; if(typeof state!=='object'||Array.isArray(state)) state={};} catch {storageOK=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{storageOK=false;} if(!storageOK) document.querySelector('#storage-note').textContent='Saving is unavailable in this browser. You can still use every activity.';}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const activities=document.querySelector('#activities');
document.querySelector('#workshop-menu').open=matchMedia('(min-width: 851px)').matches;
const order=[['precision','Precision warm-up'],['spell1','Spelling · Attempt 1'],['l14','1.4 · Mirbat snorkelling'],['l15','1.5 · Mirbat again'],['l16a','1.6A · Gym information'],['l16b','1.6B · What did they say?'],['l16c','1.6C · Can you say it?'],['spell2','Spelling · Attempt 2'],['l17','1.7 · A London conversation'],['l18','1.8 · Hotel'],['l19','1.9 · Numbers']];
document.querySelector('#navigation').innerHTML=order.map(([id,title])=>`<a href="#${id}">${title}</a>`).join('');
function shell(id,kicker,title,html){const index=order.findIndex(x=>x[0]===id);return `<section class="activity" id="${id}" aria-labelledby="${id}-title"><div class="activity-title"><p class="eyebrow">${kicker}</p><h2 id="${id}-title">${title}</h2></div>${html}<a class="next" href="#${order[index+1]?.[0]||'complete'}">Continue <span aria-hidden="true">→</span></a></section>`;}
function pending(message){return `<p class="pending">${message}</p>`;}
function inputTask(task){return `<p class="listen">Listen with your teacher.</p><p class="instruction">${instruction}</p><form data-task="${task.id}" novalidate><div class="sheet"><h3>${task.heading}</h3>${task.questions.map(([label,suffix,,mode],i)=>`<div class="answer-row"><label for="${task.id}-${i}">${i+1}. ${label}</label><div class="entry"><input id="${task.id}-${i}" name="q${i}" type="text" inputmode="${mode}" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="${task.id}-${i}-suffix ${task.id}-${i}-feedback" value="${esc(state[task.id]?.answers?.[i]||'')}"><span id="${task.id}-${i}-suffix">${suffix}</span></div><p class="feedback" id="${task.id}-${i}-feedback"></p></div>`).join('')}</div><div class="actions">${checkingControl(task.id)}</div><div class="result" role="status"></div><div class="followup"></div></form>`;}
function spelling(attempt){
 const id='spell'+attempt;
 if(!validSpellingItems(state[id]?.items)) state[id]={items:shuffle(spellingWords).map(w=>({target:w.target,options:shuffle(w.options)})),choices:{}};
 const s=state[id];
 return `<form data-spelling="${attempt}"><p>Choose the correctly spelt word in each group.</p>${s.items.map((w,i)=>`<fieldset class="choice-item"><legend>Word ${i+1}</legend><div class="options">${w.options.map((v,j)=>`<label class="option"><input type="radio" name="word${i}" value="${j}" ${String(s.choices[i])===String(j)?'checked':''}><span>${esc(v)}</span></label>`).join('')}</div></fieldset>`).join('')}<div class="actions">${checkingControl(id)}</div><p class="result" role="status"></p></form>`;
}
activities.innerHTML=shell('precision','Precision','Small details matter',['l11','l12','l13','calendar-spelling'].map(id=>`<div class="precision-part" id="${id}">${sourceActivity(id,state)}</div>`).join(''))+
 shell('spell1','IELTS SKILL · SPELLING','Spelling Challenge · Attempt 1',spelling(1))+
 tasks.slice(0,3).map(t=>shell(t.id,'Listening '+t.code,t.title,inputTask(t))).join('')+
 shell('l16b','Listening 1.6B · Gym membership','What did they actually say?',`<p class="listen">Listen with your teacher.</p><p>Listen again. Which sentence did you actually hear?</p><div id="noticing"></div>`)+
 shell('l16c','Listening 1.6C · Gym membership','Can you say it?',`<p>Say each answer aloud. The original phrase is one natural way to say it.</p>${speaking.map((item,i)=>item?`<div class="speak-item"><p class="eyebrow">${i+1} · SAY IT</p><p>${item[0]}</p><button type="button" class="secondary reveal" aria-expanded="false" aria-controls="spoken-${i}">SHOW ONE WAY</button><div class="phrase" id="spoken-${i}" hidden>${item[1]}</div></div>`:pending('7 · The exact Black Card phrase is awaiting the recording transcript.')).join('')}<p class="notice">Good listening can give you new ways to speak.</p>`)+
 shell('spell2','IELTS SKILL · SPELLING','Spelling Challenge · Attempt 2',spelling(2))+
 shell('l17','Listening 1.7','A London conversation',`<div class="notice"><h3>Check the instruction</h3><p>Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.</p><p>Tap each example to check what is allowed.</p><div class="examples">${[['library','✓ — one word'],['£45','✓ — a number'],['12 March','✓ — a number + a word'],['on the 12th of March','✕ — too many words']].map(([a,b])=>`<details><summary>${a}</summary><p>${b}</p></details>`).join('')}</div><p>Always check how many words and numbers you are allowed to write.</p></div><br>${inputTask(tasks[3])}`)+
 shell('l18','Listening 1.8','Hotel',sourceActivity('l18',state,{heading:false}))+
 shell('l19','Listening 1.9','Numbers',sourceActivity('l19',state,{heading:false}));
const restoreSourceFeedback=mountSourceActivities(state,save);
function followup(id,results){if(id==='l14')return `${results[1].correction?`<fieldset class="notice"><legend>What happened?</legend>${['I stopped listening after 10:00.','I didn’t notice the correction.','I noticed the correction but missed the new time.','Something else.'].map((t,i)=>`<label class="option"><input type="radio" name="reason" value="${i}" ${state.reason===String(i)?'checked':''}><span>${t}</span></label>`).join('')}</fieldset>`:''}<p class="notice">Keep listening. Information can change.</p>`;
 if(id==='l15')return `<div class="notice"><h3>Listen to the whole idea</h3><p>The trip is suitable for beginners. Is that the whole message?</p><p>No. The speaker adds that beginners need to be comfortable in the water. Notice <strong>but</strong>.</p><p>The trip normally takes two hours. Is that always true?</p><p>No. It can sometimes be shorter depending on conditions. Notice <strong>although</strong>.</p><p>Sometimes the first idea is true — but it isn’t the whole message.</p></div>`;
 if(id==='l16a')return '<p class="notice">The annual fee comes up during one membership option, but it applies to <strong>all</strong> memberships.</p>';
 return '';
}
function checkTask(form){const id=form.dataset.task;if(!answerRelease.isOpen(id))return;const answers=tasks.find(t=>t.id===id).questions.map((_,i)=>form.elements['q'+i].value);const results=answers.map((v,i)=>mark(id,i,v));
 results.forEach((r,i)=>{const input=form.elements['q'+i];input.setAttribute('aria-invalid',String(!r.correct));const feedback=document.getElementById(`${id}-${i}-feedback`);feedback.textContent=r.message;feedback.classList.toggle('correct',r.correct);});
 form.querySelector('.result').textContent=`${results.filter(r=>r.correct).length} / ${results.length} correct`;
 form.querySelector('.followup').innerHTML=followup(id,results);state[id]={answers,checked:true};save();
}
document.querySelectorAll('[data-task]').forEach(form=>{form.addEventListener('submit',e=>{e.preventDefault();checkTask(form);});form.addEventListener('input',e=>{if(!e.target.name.startsWith('q'))return;state[form.dataset.task]={answers:tasks.find(t=>t.id===form.dataset.task).questions.map((_,i)=>form.elements['q'+i].value),checked:false};form.querySelector('.result').textContent='';form.querySelector('.followup').innerHTML='';form.querySelectorAll('.feedback').forEach(el=>el.textContent='');form.querySelectorAll('input').forEach(el=>el.removeAttribute('aria-invalid'));save();});if(state[form.dataset.task]?.checked)checkTask(form);});
activities.addEventListener('change',e=>{if(e.target.name==='reason'){state.reason=e.target.value;save();}});
document.querySelectorAll('.reveal').forEach(button=>button.addEventListener('click',()=>{const phrase=document.getElementById(button.getAttribute('aria-controls'));phrase.hidden=!phrase.hidden;button.setAttribute('aria-expanded',String(!phrase.hidden));button.textContent=phrase.hidden?'SHOW ONE WAY':'TRY AGAIN';}));
function newNoticing(){state.noticing={version:2,orders:phrases.map(p=>p?shuffle([0,1]):null),choices:{},checked:false};save();}
if(state.noticing?.version!==2||!Array.isArray(state.noticing?.orders)||state.noticing.orders.length!==9||state.noticing.orders.some(o=>!Array.isArray(o)||o.length!==2))newNoticing();
let restoreNoticingFeedback=()=>{};
function renderNoticing(){const n=state.noticing;document.querySelector('#noticing').innerHTML=`<form id="noticing-form">${phrases.map((p,i)=>p?`<fieldset class="choice-item"><legend>${i+1}. Which sentence?</legend><div class="options">${n.orders[i].map(v=>`<label class="option"><input type="radio" name="phrase${i}" value="${v}" ${String(n.choices[i])===String(v)?'checked':''}><span>${p[v]}</span></label>`).join('')}</div><p class="feedback" id="phrase-feedback-${i}"></p></fieldset>`:pending('7 · Awaiting the exact wording from the recording transcript.')).join('')}<div class="actions">${checkingControl('l16b')}<button type="button" class="secondary" id="new-noticing">New attempt</button></div><div class="result" role="status"></div></form>`;
 const form=document.querySelector('#noticing-form');
 function show(){if(!answerRelease.isOpen('l16b'))return;let score=0;phrases.forEach((p,i)=>{if(!p)return;const correct=String(n.choices[i])==='0';if(correct)score++;const el=document.getElementById('phrase-feedback-'+i);el.textContent=(correct?'Correct. ':'You heard: ')+p[0];el.classList.toggle('correct',correct);});form.querySelector('.result').innerHTML=`<p>${score} / ${phrases.length} correct</p><p>You probably knew many of these words already. Notice how people put them together in conversation.</p>`;}
 form.addEventListener('change',e=>{n.choices[e.target.name.replace('phrase','')]=e.target.value;n.checked=false;form.querySelectorAll('.feedback').forEach(el=>el.textContent='');form.querySelector('.result').textContent='';save();});
 form.addEventListener('submit',e=>{e.preventDefault();if(!answerRelease.isOpen('l16b'))return;n.checked=true;show();save();});document.querySelector('#new-noticing').addEventListener('click',()=>{newNoticing();renderNoticing();document.querySelector('#noticing-form input').focus();});restoreNoticingFeedback=()=>{if(n.checked)show();};if(n.checked)show();syncCheckingControls(form);
}
renderNoticing();
const spellingResults=[];
document.querySelectorAll('[data-spelling]').forEach(form=>{
 const attempt=form.dataset.spelling,id='spell'+attempt,s=state[id];
 function result(){
  const output=form.querySelector('.result');output.replaceChildren();
  if(!answerRelease.isOpen(id)||!s.checked||s.score==null)return;
  if(attempt==='1'){output.textContent=`First attempt: ${s.score} / 20. The same words will return later.`;return;}
  const first=answerRelease.isOpen('spell1')?(state.spell1?.score!=null?`${state.spell1.score} / 20`:'not completed'):'awaiting release';
  for(const line of [`First attempt: ${first}`,`This attempt: ${s.score} / 20`,'The score is information. Look at which words are becoming easier and which still need practice.']){const p=document.createElement('p');p.textContent=line;output.append(p);}
 }
 spellingResults.push(result);
 form.addEventListener('change',e=>{s.choices[e.target.name.replace('word','')]=Number(e.target.value);s.checked=false;delete s.score;delete s.results;spellingResults.forEach(render=>render());save();});
 form.addEventListener('submit',e=>{e.preventDefault();if(!answerRelease.isOpen(id))return;s.results=s.items.map((w,i)=>({target:w.target,selected:w.options[s.choices[i]]??null,correct:w.options[s.choices[i]]===w.target}));s.score=s.results.filter(r=>r.correct).length;s.checked=true;spellingResults.forEach(render=>render());save();});
 result();
});
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('#navigation a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-10% 0px -65% 0px'});document.querySelectorAll('.activity').forEach(s=>observer.observe(s));
save();

// Shared classroom state controls feedback only; inputs are never re-rendered.
function refreshAnswerRelease(){syncCheckingControls();document.querySelectorAll('[data-task],#noticing-form,[data-spelling],[data-source-activity]').forEach(form=>{const id=form.dataset.sourceActivity||form.dataset.task||(form.dataset.spelling?'spell'+form.dataset.spelling:'l16b');if(answerRelease.isOpen(id))return;form.querySelectorAll('.feedback,.result,.followup').forEach(el=>el.replaceChildren());form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));});document.querySelectorAll('[data-task]').forEach(form=>{if(state[form.dataset.task]?.checked)checkTask(form);});restoreSourceFeedback();restoreNoticingFeedback();spellingResults.forEach(render=>render());}
answerRelease.subscribe(refreshAnswerRelease);
mountStudentConnection(answerRelease,document.querySelector('.draft-note'));
syncCheckingControls();
