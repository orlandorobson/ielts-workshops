import {activities} from './content.js';
import {finalLearning} from './final-activities.js';
import {classificationLearning} from './classification-learning.js';
import {workshop,stages,serviceReady} from './release-config.js';
import {ClassroomConnection,mountStudentConnection} from '../../shared/classroom/client.js';
const key='ielts-listening-day-2-v1';let state={responses:{},checked:{}};
try{const saved=JSON.parse(localStorage.getItem(key));if(saved?.responses&&saved?.checked)state=saved;}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{document.querySelector('#storage-note').textContent='Keep this page open to retain your answers. Saving in this browser is unavailable.';}}
// Dubai's six-question assessment replaces unrelated eight-mark questions.
// Archive old local work; never interpret it as responses to different questions.
if(state.contentVersions?.l29!=='final-six'){
 const old=Object.fromEntries(Object.entries(state.responses).filter(([n])=>n.startsWith('l29-')||n==='reflection-l29'));
 if(Object.keys(old).length){state.archivedResponses={...state.archivedResponses,dubaiEightMark:{responses:old,checked:!!state.checked.l29}};for(const n of Object.keys(old))delete state.responses[n];}
 delete state.checked.l29;state.contentVersions={...state.contentVersions,l29:'final-six'};save();
}
// A new recording order requires new responses; preserve old work in an archive.
if(state.contentVersions?.l28!=='final-BACBCAACBBCA'){
 const old=Object.fromEntries(Object.entries(state.responses).filter(([n])=>n.startsWith('l28-')));
 if(Object.keys(old).length){state.archivedResponses={...state.archivedResponses,classificationOldOrder:{responses:old,checked:!!state.checked.l28}};for(const n of Object.keys(old))delete state.responses[n];}
 delete state.checked.l28;state.contentVersions={...state.contentVersions,l28:'final-BACBCAACBBCA'};save();
}
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const connection=new ClassroomConnection(workshop,stages);
const map=(file,caption='',small=false)=>`<figure class="map-figure ${small?'map-small':''}"><img src="assets/${file}" alt="${escape(caption||'Listening task map with numbered locations')}" loading="lazy"><figcaption>${escape(caption)} <a href="assets/${file}" target="_blank" rel="noopener">Open full-size map ↗</a></figcaption></figure>`;
const name=(a,q)=>`${a.id}-${q.number}`;
function question(a,q){
 const n=name(a,q);let body=q.map?map(q.map,`Map for question ${q.number}`,true):'';
 if(q.before&&q.type!=='text')body+=`<p>${escape(q.before)}</p>`;
 if(q.type==='select')body+=`<select class="answer-select" name="${n}" aria-label="Question ${q.number}"><option value="">${q.options?'Choose a stage':'Choose a location'}</option>${(q.options||a.options).map(o=>`<option value="${o.value}">${o.value}. ${escape(o.text)}</option>`).join('')}</select>`;
 else if(q.type==='two')body+=`<p id="help-${n}">Choose TWO answers. To change one after selecting two, deselect it first.</p><div class="options">${q.options.map(o=>`<label class="option"><input type="checkbox" name="${n}" value="${o.value}" aria-describedby="help-${n} count-${n}"><span>${o.value}. ${escape(o.text)}</span></label>`).join('')}</div><p class="selection-count muted" id="count-${n}" role="status">0 of 2 selected</p>`;
 else if(q.type==='order')body+=q.parts.map((part,i)=>`<label class="order-row">${q.options?`<select name="${n}-${i}" aria-label="Order: ${escape(part)}"><option value="">—</option>${q.options.map(x=>`<option>${x}</option>`).join('')}</select>`:`<input type="text" name="${n}-${i}" aria-label="Order: ${escape(part)}" autocomplete="off">`}<span>${escape(part)}</span></label>`).join('');
 else if(q.type==='text')body+=`${q.before?`<p>${escape(q.before)}</p>`:''}<label class="typed-row">${escape(q.inputLabel||'Your answer')}<input name="${n}" type="text" autocomplete="off" spellcheck="false"></label>${q.after?`<p>${escape(q.after)}</p>`:''}`;
 else body+=`<div class="options">${q.options.map(o=>`<label class="option"><input type="radio" name="${n}" value="${o.value}"><span>${escape(o.value)}. ${escape(o.text)}</span></label>`).join('')}</div>`;
 if(q.after&&q.type!=='text')body+=`<p class="provided-stage">${escape(q.after)}</p>`;
 return `<fieldset class="choice-item"><legend>${q.number}. ${escape(q.label||'')}</legend>${body}<p class="feedback" data-feedback="${n}"></p></fieldset>`;
}
const editorial=`<details class="editorial" id="author-note" hidden><summary>Names worth noticing · Optional</summary><p><strong>Kazuo Ishiguro</strong><br>A major British novelist and Nobel literature laureate.</p><p><strong>Abdulrazak Gurnah</strong><br>A Zanzibar-born novelist and academic who won the 2021 Nobel Prize in Literature. He was Professor of English and Postcolonial Literatures at the University of Kent. His novels include <em>Paradise</em>.</p><p>Gurnah grew up in Zanzibar, whose history connects with Oman and the wider Indian Ocean world.</p><p class="sources">Explore: <a href="https://www.nobelprize.org/prizes/literature/2017/summary/" target="_blank" rel="noopener">Ishiguro · Nobel Prize</a> · <a href="https://www.nobelprize.org/prizes/literature/2021/bio-bibliography/" target="_blank" rel="noopener">Gurnah · Nobel Prize</a> · <a href="https://whc.unesco.org/en/urban-heritage-atlas/stone-town" target="_blank" rel="noopener">Zanzibar · UNESCO</a></p></details>`;
document.querySelector('#navigation').innerHTML=activities.map(a=>`<a href="#${a.id}">${a.audio} · ${escape(a.title)}</a>`).join('');
document.querySelector('#activities').innerHTML=activities.map(a=>`${a.id==='l25'?'<div class="recovery"><strong>Lost your place?</strong><p>Don’t stop listening.</p><p>Rejoin at the next place or landmark you recognise.</p></div>':''}<section class="activity" id="${a.id}"><p class="eyebrow">Audio ${a.audio}</p><h2>${escape(a.title)}</h2><p class="listen">Listen with your teacher.</p>${a.principle?`<p class="principle">${escape(a.principle)}</p>`:''}<p class="instruction">${escape(a.instruction)}</p>${a.id==='l28'?'<dl class="category-guide"><dt>Recommendation</dt><dd>The speaker thinks this is a good idea.</dd><dt>Requirement</dt><dd>You need to do this.</dd><dt>Restriction</dt><dd>You cannot do this.</dd></dl>':''}${a.map?map(a.map,a.mapCaption):''}${a.options?`<ol class="answer-options" type="A">${a.options.map(o=>`<li>${escape(o.text)}</li>`).join('')}</ol>`:''}<form data-activity="${a.id}">${a.questions.map(q=>question(a,q)).join('')}<div class="actions">${a.answers?`<button type="submit" data-answer-check="${a.id}" hidden disabled>Check &amp; reflect</button>`:''}</div><p class="muted" data-wait>${a.answers?'Your teacher will release answer checking. Keep your answers here and continue whenever you’re ready.':'Keep your responses here for discussion with your teacher.'}</p><p class="result" role="status"></p>${a.reflection?`<p class="reflection" hidden>${escape(a.reflection)}</p>`:''}</form>${a.id==='l26'?editorial:''}<a class="next" href="#${activities[activities.indexOf(a)+1]?.id||'complete'}">Continue →</a></section>`).join('');
function clearFeedback(a){document.querySelector(`#${a.id} .learning-layer`)?.remove();const form=document.querySelector(`[data-activity="${a.id}"]`);form.querySelectorAll('.feedback').forEach(e=>{e.textContent='';e.classList.remove('correct');});form.querySelector('.result').textContent='';form.querySelectorAll('[aria-invalid]').forEach(e=>e.removeAttribute('aria-invalid'));if(a.answers&&form.querySelector('.reflection'))form.querySelector('.reflection').hidden=true;if(a.id==='l26'){const note=document.querySelector('#author-note');note.hidden=true;note.open=false;}}
function mark(a){
 if(!a.answers||!connection.isOpen(a.id))return;
 let score=0;const form=document.querySelector(`[data-activity="${a.id}"]`);
 let total=0;
 a.questions.forEach((q,i)=>{
  const n=name(a,q),answer=a.answers[i];
  if(q.type==='order'||q.type==='text'){
   total++;const normal=value=>String(value??'').trim().replace(/\s+/g,' ').toLowerCase();
   const right=q.type==='order'?answer.every((value,j)=>normal(state.responses[`${n}-${j}`])===normal(value)):normal(state.responses[n])===normal(answer);
   score+=Number(right);const feedback=form.querySelector(`[data-feedback="${n}"]`);feedback.textContent=right?'Correct.':`Review this one. Answer: ${Array.isArray(answer)?answer.join(' → '):answer}.`;feedback.classList.toggle('correct',right);return;
  }
  const expected=Array.isArray(answer)?answer:[answer];total+=expected.length;
  const selected=Array.isArray(state.responses[n])?state.responses[n]:[state.responses[n]];
  const points=expected.filter(value=>selected.includes(value)).length;score+=points;
  const label=value=>{const option=(q.options||a.options).find(o=>o.value===value);return `${value}${option?` — ${option.text}`:''}`;};
  const feedback=form.querySelector(`[data-feedback="${n}"]`),right=points===expected.length;
  feedback.textContent=right?'Correct.':`${selected.some(Boolean)?'Review this one.':'Not answered.'} ${expected.length===2?`${points} / 2. Answers`:'Answer'}: ${expected.map(label).join('; ')}.`;feedback.classList.toggle('correct',right);
 });
 form.querySelector('.result').textContent=`${score} / ${total} · The score is information. Notice what helped you follow the speaker.`;
 const learning=finalLearning[a.id]||(a.id==='l28'?classificationLearning:null);if(learning){
  form.parentElement.querySelector('.learning-layer')?.remove();const layer=document.createElement('div');layer.className='learning-layer';layer.innerHTML=learning;form.after(layer);
  layer.querySelectorAll('input').forEach(input=>{input.checked=state.responses[input.name]===input.value;});
  layer.addEventListener('input',event=>{if(event.target.name){state.responses[event.target.name]=event.target.value;save();}});
 }
 if(form.querySelector('.reflection'))form.querySelector('.reflection').hidden=false;
 if(a.id==='l26')document.querySelector('#author-note').hidden=false;
 state.checked[a.id]=true;save();
}
function updateTwo(form){
 for(const field of form.querySelectorAll('fieldset')){const boxes=[...field.querySelectorAll('input[type=checkbox]')];if(!boxes.length)continue;const count=boxes.filter(input=>input.checked).length;boxes.forEach(input=>{input.disabled=!input.checked&&count>=2;});field.querySelector('.selection-count').textContent=`${count} of 2 selected`;}
}
for(const a of activities){const form=document.querySelector(`[data-activity="${a.id}"]`);
 form.querySelectorAll('input,select').forEach(input=>{const saved=state.responses[input.name];if(input.type==='checkbox')input.checked=Array.isArray(saved)&&saved.includes(input.value);else if(input.type==='radio')input.checked=saved===input.value;else input.value=saved??'';});
 updateTwo(form);
 form.addEventListener('input',event=>{if(!event.target.name)return;if(event.target.type==='checkbox'){state.responses[event.target.name]=[...form.querySelectorAll('input[type=checkbox]')].filter(input=>input.name===event.target.name&&input.checked).map(input=>input.value);updateTwo(form);}else state.responses[event.target.name]=event.target.value;state.checked[a.id]=false;clearFeedback(a);save();});
 form.addEventListener('submit',event=>{event.preventDefault();mark(a);});
 if(!a.answers&&a.reflection){const reflect=document.createElement('button');reflect.type='button';reflect.className='secondary';reflect.textContent='Pause & reflect';reflect.addEventListener('click',()=>{form.querySelector('.reflection').hidden=false;});form.querySelector('.actions').append(reflect);}
}
connection.subscribe(()=>{for(const a of activities){const form=document.querySelector(`[data-activity="${a.id}"]`),button=form.querySelector('[data-answer-check]');if(!button)continue;const open=connection.isOpen(a.id);button.hidden=!open;button.disabled=!open;form.querySelector('[data-wait]').hidden=open;if(!open)clearFeedback(a);else if(state.checked[a.id])mark(a);}});
const panel=mountStudentConnection(connection,document.querySelector('#activities'));
if(!serviceReady){panel.querySelector('button').disabled=true;panel.querySelector('input').disabled=true;panel.querySelector('#class-status').textContent='Your teacher will let you know when to connect. You can keep working.';}
if(matchMedia('(max-width:850px)').matches)document.querySelector('#workshop-menu').open=false;
document.querySelector('#navigation').addEventListener('click',event=>{if(event.target.closest('a')&&matchMedia('(max-width:850px)').matches)document.querySelector('#workshop-menu').open=false;});
