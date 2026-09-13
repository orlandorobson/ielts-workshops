import {audioLibrary} from '../../content/speaking/audio-library.js';
import {createSoundPractice} from './sound-and-language.js';
import {createExtension} from './notice-and-practise.js';
import {audioComponent,bindAudio} from './audio-component.js';
import {audios,listening,question,strengths,changes,actions,palette,listeningQuestions,listeningStages,listeningSummary,yusufChanges,compareChanges,reflections} from '../../content/speaking/day-1.js';
const key='ielts-speaking-day-1-v1';
let state={step:0,answers:{},checked:{},complete:false};
try{const saved=JSON.parse(localStorage.getItem(key));if(saved && typeof saved.answers==='object' && saved.answers && typeof saved.checked==='object' && saved.checked)state={...state,...saved};}catch{}
// Preserve later progress when replacing the older listening screen sequences.
if(state.listeningVersion!==3){
  const oldSummary=state.listeningVersion===2?9:10;
  if(state.step>=oldSummary)state.step-=oldSummary-2;
  else if(state.step>0)state.step=1;
  state.listeningVersion=3;
}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const app=document.querySelector('#app');
const feedback=(text='',id='feedback')=>`<div class="feedback" id="${id}" role="status">${text}</div>`;
function choices(id,title,options,multi=false){return `<fieldset><legend>${title}</legend><p class="hint">${multi?'Choose any that fit.':'Choose one.'}</p><div class="choices">${options.map((o,i)=>`<label class="choice"><input type="${multi?'checkbox':'radio'}" name="${id}" value="${i}" ${(state.answers[id]||[]).includes(i)?'checked':''}><span>${esc(o)}</span></label>`).join('')}</div></fieldset>`;}
function listeningComponent(){
  return audioComponent(audioLibrary.format,esc)+'<p>Fatma → Hisham → Mahmoud</p><p>Look at all three questions as you listen. Listen again if your teacher chooses.</p>';
}
function listeningTranscript(){
  return `<details><summary>Read the transcript</summary>${listening.speakers.map(speaker=>`<h2>${esc(speaker.name)}</h2><p class="transcript">${esc(speaker.script)}</p>`).join('')}</details>`;
}
const prompt=()=>`<blockquote>“${question}”</blockquote>`;
function listeningFeedback(){
  return listeningQuestions.map(q=>{
    const selected=state.answers[q[0]]||[];
    const correct=selected.length===q[3].length&&selected.every(v=>q[3].includes(v));
    return `<p>${q[0]==='listening-time'?'1':'2'}. ${correct?'That’s right.':selected.length?'Not quite.':'You can leave this unanswered.'} ${q[3].map(i=>q[2][i]).join(' + ')}.</p>`;
  }).join('')+`<p>3. ${[0,1,2].every(i=>(state.answers['order-'+i]||[])[0]===i)?'That’s right.':'The order is shown below.'}</p>`+listeningSummary;
}
function listeningActivity(){
  return '<p>Fatma, Hisham and Mahmoud are talking about the IELTS Speaking test.</p><p>They know some things. They also make mistakes.</p>'+listeningComponent()+
    listeningQuestions.map((q,i)=>`<section class="listening-question">${choices(q[0],q[1],q[2],i===1).replace('Choose any that fit.','Choose TWO.')}</section>`).join('')+
    `<fieldset class="listening-question"><legend>3. What order does Fatma describe?</legend><p class="hint">Choose 1, 2 or 3 for each stage.</p>${[2,0,1].map(i=>`<label class="order-label" for="order-${i}">${esc(listeningStages[i])}</label><select id="order-${i}" name="order-${i}"><option value="">Choose its place</option>${[0,1,2].map(n=>`<option value="${n}" ${(state.answers['order-'+i]||[])[0]===n?'selected':''}>${n+1} — ${['First','Next','Last'][n]}</option>`).join('')}</select>`).join('')}</fieldset>`+
    '<button data-check-listening>Check answers</button>'+feedback(state.checked.listening?listeningFeedback():'','listening-feedback')+listeningTranscript();
}
const screens=[];
const add=(section,label,title,body,next='Continue')=>screens.push({section,label,title,body,next});
add(1,'Day 1 — What do you sound like?','IELTS Speaking Workshop',()=>'<p class="lead">Today you will learn how the Speaking test works.</p><p>Then you will listen to other speakers — and to yourself.</p>','Start Day 1');
add(2,'Listen and choose','What is the IELTS Speaking test?',listeningActivity);
add(3,'The test','IELTS Speaking',()=>`<div class="stats"><div><strong>11–14</strong>minutes</div><div><strong>3</strong>parts</div></div><section class="summary-part"><h2>Part 1 — You and familiar topics</h2><p>The examiner asks questions about you and familiar things.</p></section><section class="summary-part"><h2>Part 2 — Speak on your own</h2><p>You get a topic.<br>You have 1 minute to prepare.<br>You speak for up to 2 minutes.</p></section><section class="summary-part"><h2>Part 3 — Discuss ideas</h2><p>You discuss broader questions connected with the Part 2 topic.</p></section><div class="criteria"><p>The examiner uses the same four assessment criteria throughout the test.</p><ul><li>Fluency &amp; Coherence</li><li>Lexical Resource</li><li>Grammatical Range &amp; Accuracy</li><li>Pronunciation</li></ul></div>`,'Try speaking');
add(4,'Your first attempt','Try speaking',()=>prompt()+'<p>Think for a moment.</p><p>Then answer naturally for about 20 seconds.</p><p>Use your phone to record yourself.</p>','I’ve recorded it');
add(5,'Listen to yourself','What did you like?',()=>'<p>Listen to your recording.</p><p>Don’t think about your band score.</p>'+choices('strength','Choose ONE thing you liked.',strengths));
add(5,'Listen to yourself','What might you change?',()=>choices('change','Choose ONE thing you might change.',changes));
add(6,'Listen to Yusuf','One question. Three attempts.',()=>'<p>Yusuf answered the SAME question three times.</p><p>Listen to what changes.</p>'+prompt());
[3,4,5].forEach(i=>add(6,'Listen to Yusuf',audios[i].name,()=>prompt()));
add(6,'Notice the change','Which attempt works best for you?',()=>choices('best','Choose an attempt.',['1','2','3']));
add(6,'Notice the change','What changed?',()=>choices('yusuf-change','What changed?',yusufChanges,true));
add(6,'Notice the change','Did Yusuf simply speak faster?',()=>choices('faster','Choose your answer.',['Yes','No','Not sure'])+feedback((state.answers.faster||[]).length?'Not necessarily. Good fluency does not mean speaking as fast as possible.':''));
add(7,'Your second attempt','Change one thing',()=>'<p>Listen to your first recording again.</p>'+choices('action','Choose ONE thing to change.',changes)+feedback(actionText(),'action-feedback'));
add(7,'Your second attempt','Try the same question again',()=>'<p>Record the SAME question again.</p>'+prompt()+feedback(actionText()) , 'I’ve recorded it again');
add(8,'Compare','Did your change help?',()=>'<p>Listen to both recordings.</p>'+choices('help','Did your change help?',['Yes, definitely','A little','Not really','I’m not sure']));
add(8,'Compare','What changed?',()=>choices('compare','What changed?',compareChanges,true));
add(8,'Compare','Good.',()=>'<p>You have just changed one part of your speaking and tested it.</p>');
add(9,'Small controls','The Speaking Style Palette',()=>'<p>You can learn to control small parts of your speaking.</p><p>You do NOT need to change everything at once.</p><p class="hint">Open a card. Notice the small actions.</p>'+palette.map(p=>`<details class="palette" name="palette"><summary><span><strong>${p[0]}</strong><small>${p[1]}</small></span></summary><ul>${p[2].map(a=>`<li>${a}</li>`).join('')}</ul></details>`).join(''));
add(10,'Your focus','Choose your focus',()=>choices('focus','Choose ONE style control to practise next.',palette.map(p=>p[0]))+feedback(focusText(),'focus-feedback'));
add(11,'Day 1 reflection','Today I learned…',()=>choices('reflection','Choose what you learned.',reflections,true));
add(11,'Day 1 close','One small thing at a time',()=>'<p>Day 1 is not about becoming perfect.</p><p>It is about noticing your speaking and learning to control one small thing at a time.</p>','Finish Day 1');
function actionText(){const selected=(state.answers.action||[])[0];return selected===undefined?'':actions[selected];}
function focusText(){const p=palette[(state.answers.focus||[])[0]];return p?`<p>My focus today:</p><p class="focus-name">${p[0]}</p><p>${p[2][0]}</p>`:'';}
function render(){app.querySelectorAll('audio').forEach(a=>a.pause());state.step=Number.isInteger(state.step)?Math.max(0,Math.min(state.step,screens.length-1)):0;const s=screens[state.step];document.querySelector('#progress-label').textContent=`Day 1 · ${s.section} of 11 · ${s.label}`;document.querySelector('#progress').value=s.section;app.innerHTML=`<p class="eyebrow">${s.label}</p><h1>${s.title}</h1>${s.body()}<nav class="nav" aria-label="Activity navigation">${state.step?'<button class="back" data-back>Back</button>':''}<button class="primary" data-next>${s.next}</button></nav>`;save();}
function move(delta){state.step+=delta;if(screens[state.step]?.section===7&&!state.answers.action && state.answers.change)state.answers.action=[...state.answers.change];render();document.querySelector('#activity').focus();window.scrollTo(0,0);}
app.addEventListener('change',e=>{const t=e.target;if(!t.matches('input,select'))return;state.answers[t.name]=t.tagName==='SELECT'?(t.value===''?[]:[Number(t.value)]):Array.from(app.querySelectorAll(`input[name="${t.name}"]:checked`),x=>Number(x.value));if(t.name==='action')document.querySelector('#action-feedback').textContent=actionText();if(t.name==='focus')document.querySelector('#focus-feedback').innerHTML=focusText();if(t.name==='faster')document.querySelector('#feedback').textContent='Not necessarily. Good fluency does not mean speaking as fast as possible.';if(state.checked.listening&&document.querySelector('#listening-feedback'))document.querySelector('#listening-feedback').innerHTML=listeningFeedback();save();});
app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-next')){if(state.step===screens.length-1){state.complete=true;save();app.innerHTML='<p class="eyebrow">Day 1 complete</p><h1>Listen to yourself.<br>Change one thing.<br>Try again.</h1>'+feedback(focusText())+'<nav class="nav"><button data-review>Review Day 1</button></nav>';document.querySelector('#activity').focus();window.scrollTo(0,0);}else move(1);}if(b.hasAttribute('data-back'))move(-1);if(b.hasAttribute('data-review')){state.step=0;render();window.scrollTo(0,0);}if(b.hasAttribute('data-check-listening')){state.checked.listening=true;document.querySelector('#listening-feedback').innerHTML=listeningFeedback();save();}});
const oldScreen=screens[state.step];
const extension=createExtension({state,save,choices,feedback,esc,app});
const yusufIndex=screens.findIndex(s=>s.title==='One question. Three attempts.');
screens[yusufIndex].label='Audio 2 · Listen to Yusuf';
screens[yusufIndex].body=()=>'<p>Yusuf answered the SAME question three times.</p><p>Listen to what changes.</p>'+prompt()+audioLibrary.yusuf.map((a,i)=>audioComponent({...a,transcript:`<p class="transcript">${esc(audios[i+3].script)}</p>`},esc)).join('');
const removedAttempts=screens.splice(yusufIndex+1,3);
const makeScreen=([title,body])=>({section:8,label:'Notice · Try · Listen',title:title.startsWith('Useful language · ')?title.replace('Useful language · ','').toLowerCase().replace(/^./,c=>c.toUpperCase()):title,body,next:'Continue'});
const compareIndex=screens.findIndex(s=>s.title==='Did your change help?');
screens.splice(compareIndex,0,...extension.beforeCompare.map(makeScreen));
const paletteIndex=screens.findIndex(s=>s.title==='The Speaking Style Palette');
screens.splice(paletteIndex,0,...extension.afterCompare.map(makeScreen));
if(state.extensionVersion!==1){
  const newIndex=screens.indexOf(oldScreen);
  state.step=removedAttempts.includes(oldScreen)?yusufIndex:Math.max(0,newIndex);
  state.extensionVersion=1;
}
const beforeSoundScreen=screens[state.step];
const sound=createSoundPractice({state,save,choices,feedback,esc,app});
const soundStart=screens.findIndex(s=>s.title==='The Speaking Style Palette');
screens.splice(soundStart,0,...sound.screens);
const reflectionIndex=screens.findIndex(s=>s.title==='Today I learned…');
screens[reflectionIndex]={section:11,label:'Day 1 reflection',title:'What can you control now?',body:sound.reflection,next:'Continue'};
screens[screens.length-1]={section:11,label:'Day 1 close',title:'Small changes',body:()=>'<p>Day 1 was not about sounding perfect.</p><p>It was about hearing your speaking and learning to control small changes.</p>',next:'Finish Day 1'};
if(state.soundVersion!==1){
  // Returning learners reach the newly added practice before the old closing screens.
  const previousIndex=beforeSoundScreen?screens.indexOf(beforeSoundScreen):-1;
  state.step=previousIndex>=soundStart||beforeSoundScreen?.section>=9?soundStart:Math.max(0,previousIndex);
  state.complete=false;
  state.soundVersion=1;
}

bindAudio(app);
render();
