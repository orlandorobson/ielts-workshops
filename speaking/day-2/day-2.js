import {createLongTurn} from './long-turn-practice.js';
import {releaseConfig} from './release-config.js';
import {createReleaseControl,installStudentRelease} from '../shared/release-control.js';
import {addOptions,addPrompts,places,familyCard,placeCard,quizzes,runout,repairs,officialSource} from '../../content/speaking/day-2.js';
const key=releaseConfig.progressKeys[0];
let state={step:0,answers:{},text:{},checked:{},reveal:0,iterationComplete:false};
try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.answers&&saved.text&&saved.checked)state={...state,...saved};}catch{}
// Recover malformed local state without granting releases or dropping valid notes.
state.answers=state.answers&&typeof state.answers==='object'&&!Array.isArray(state.answers)?state.answers:{};
for(const [id,value] of Object.entries(state.answers))state.answers[id]=Array.isArray(value)?value.filter(n=>Number.isInteger(n)&&n>=0):[];
state.answers.material=(state.answers.material||[]).filter(n=>n<7).slice(0,2);
state.text=state.text&&typeof state.text==='object'&&!Array.isArray(state.text)?Object.fromEntries(Object.entries(state.text).filter(([,v])=>typeof v==='string')):{};
state.checked=state.checked&&typeof state.checked==='object'?state.checked:{};
state.reveal=Number.isInteger(state.reveal)?Math.max(0,Math.min(3,state.reveal)):0;
if(state.longTurnVersion!==1){if(state.step===23)state.step=26;state.longTurnVersion=1;state.complete=false;}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const app=document.getElementById('app'),control=createReleaseControl(releaseConfig);
const picked=id=>(state.answers[id]||[])[0];
const feedback=(text='',id='feedback')=>`<div class="feedback" role="status" id="${id}">${text}</div>`;
const help=(title,body)=>`<details class="help-card"><summary>${title}</summary>${body}</details>`;
const notes=text=>`<div class="note-sheet">${esc(text)}</div>`;
const prompt=text=>`<blockquote>“${esc(text)}”</blockquote>`;
const card=data=>`<section class="practice-card"><p class="eyebrow">Workshop practice · not an official IELTS question</p><h2>${data.title}</h2><p>You should say:</p><ul>${data.points.map(p=>`<li>${p}</li>`).join('')}</ul></section>`;
function choices(id,title,options,multi=false,hint=''){
 return `<fieldset><legend>${title}</legend><p class="hint">${hint||(multi?'Choose any that fit.':'Choose one.')}</p><div class="choices">${options.map((o,i)=>`<label class="choice"><input type="${multi?'checkbox':'radio'}" name="${id}" value="${i}" ${(state.answers[id]||[]).includes(i)?'checked':''}><span>${esc(o)}</span></label>`).join('')}</div></fieldset>`;
}
function quizFeedback(id){const q=quizzes[id],a=state.answers[id]||[];const right=a.length===q.correct.length&&q.correct.every(v=>a.includes(v));return `<p>${right?'That’s right.':a.length?'Look again.':'You can choose an answer or continue.'}</p><p>${q.feedback}</p>`;}
function quiz(id){const q=quizzes[id];return choices(id,q.question,q.options,q.multi)+`<button data-check="${id}">Check answer${q.multi?'s':''}</button>`+feedback(state.checked[id]?quizFeedback(id):'');}
function addition(){const i=picked('add');return i===undefined?'':`<p>${addPrompts[i]}</p>`;}
const revealParts=[['ADD WHEN','I usually go after work.'],['ADD WHY','It helps me unwind.'],['ADD A SMALL HISTORY','I started going regularly about two years ago.']];
function revealBody(){return '<p class="eyebrow">START</p>'+prompt('I like going to the gym.')+revealParts.slice(0,state.reveal).map(([label,text])=>`<section class="reveal-line"><strong>${label}</strong><p>“${text}”</p></section>`).join('')+(state.reveal<3?`<button id="reveal-more" data-reveal>${revealParts[state.reveal][0]}</button>`:prompt('I like going to the gym. I usually go after work because it helps me unwind. I started going regularly about two years ago.')+'<p>You did not need a big idea.</p><p>You gave the listener somewhere to go.</p>');}
function ownQuestions(){return (state.answers.material||[]).map(i=>`<section class="material-question"><label for="own-${i}"><strong>${places[i].name}</strong><br>${places[i].question}</label><textarea class="notes-input" id="own-${i}" data-text="own-${i}" aria-label="Your ${places[i].name.toLowerCase()} notes">${esc(state.text['own-'+i]||'')}</textarea></section>`).join('');}
function notePrompts(){return places.filter(p=>p.name!=='PERSON').map(p=>help(p.name,`<p>${p.prompt}</p><p>${p.action}</p>`)).join('');}
// Research placeholder: verify against relevant L2 speech/task-planning research before final publication.
// Review planning time, conceptual preparation, task performance and formulation demands. No empirical claim or invented citation is displayed.
const evidenceBox=()=>'<aside class="research-box" data-evidence-status="pending"><h2>WHY ARE WE DOING THIS?</h2><p>Try short notes, then speak from them.</p><p>Listen to where you stop.</p></aside>';
const screens=[];const add=(stage,title,body,next='Continue')=>screens.push({stage,title,body,next});
add('go','Keep it going',()=>'<p class="eyebrow">Yesterday</p><p>You listened to your speaking and changed small things.</p><p class="eyebrow">Today</p><p>Can you take an idea and make it go somewhere?</p>','Start Day 2');
add('go','Does it stop too soon?',()=>prompt('Do you enjoy exercising?')+'<p>“Yes, I do. I like going to the gym because it’s healthy.”</p>'+quiz('wrong'));
add('go','What could come next?',()=>'<p>“Yes, I do. I like going to the gym because it’s healthy.”</p>'+quiz('next'));
add('go','Add one part',()=>`<div id="development">${revealBody()}</div>`);
add('go','Answer once',()=>prompt('What do you like doing in your free time?')+'<p>Answer once.</p><p>Use your phone’s recorder.</p>','I’ve answered');
add('go','Add one thing',()=>choices('add','Now choose ONE thing to add.',addOptions)+feedback(addition(),'addition')+'<div class="try-prompt"><p>Answer again.</p><p>Keep your first idea.<br>Add the new part.</p><p>Use your phone’s recorder.</p></div>','I’ve answered again');
add('go','What changed?',()=>'<p>Listen to both answers.</p>'+choices('changed','What changed?',['my answer was longer','I gave a reason','I added a detail','I talked about time','I explained a feeling','something else'],true));
add('go','Now try a longer answer',()=>'<p>That works for a short answer.</p><p>But Part 2 asks you to do much more.</p>');
add('part2','Meet Part 2',()=>'<ol class="timeline" aria-label="Part 2 sequence"><li><strong>TOPIC</strong><span>You receive a topic card.</span></li><li><strong>1 MINUTE — THINK + NOTES</strong><span>You can make notes.</span></li><li><strong>SPEAK — 1 TO 2 MINUTES</strong><span>Speak about the topic.</span></li><li><strong>SHORT FOLLOW-UP</strong><span>The examiner may ask one or two short questions afterwards.</span></li></ol>'+help('Official test information',`<p><a href="${officialSource.url}" target="_blank" rel="noopener">${officialSource.title}</a></p><p><a href="https://takeielts.britishcouncil.org/sites/default/files/%5Bdownloads%5D/ielts-speaking-sample-tasks-2023.pdf" target="_blank" rel="noopener">Official sample task · page 5</a></p>`));
add('part2','Use the preparation minute',()=>quiz('minute'));
add('part2','Read the task',()=>card(familyCard)+'<p>Think of a person you could talk about.</p>');
add('part2','Four points. Then what?',()=>'<p>A student’s preparation:</p>'+notes('Father\nEvery day\nFootball\nGood advice')+'<p>“I’d like to talk about my father. I see him every day. We talk about football. I enjoy talking to him because he gives me good advice.”</p>'+quiz('trap')+'<div class="try-prompt"><p>The points help you.</p><p>They are not your whole speech.</p></div>');
add('find','Where can I look for more?',()=>'<p>Open a card. Try its question.</p>'+places.map(p=>help(p.name,`<p>${p.prompt}</p>${p.name==='FEELING'?'<p>Go beyond “It is very important.”</p>':''}<ul>${p.examples.map(e=>`<li>${e}</li>`).join('')}</ul><p><strong>${p.action}</strong></p>`)).join('')+'<div class="try-prompt"><p>You do NOT need all seven.</p><p>When you run out of things to say, choose ONE place to look.</p></div>');
add('find','Find your own material',()=>prompt(familyCard.title)+help('Starting notes',notes('Father\nEvery day\nFootball\nGood advice'))+choices('material','Choose TWO places to look.',places.map(p=>p.name),true,'Choose up to TWO. Think of your own answers.')+feedback('','material-limit')+`<div id="own-questions">${ownQuestions()}</div>`);
add('find','One student looks closer',()=>'<p>Starting notes:</p>'+notes('Father\nfootball\nadvice')+'<p>Look closer:</p><div class="note-sheet"><strong>MOMENT</strong>\nwatched Liverpool match together last weekend\n\n<strong>CONTRAST</strong>\nnormally quiet → talks constantly during football\n\n<strong>DETAIL</strong>\nTurkish coffee</div><p>Notice the moment, contrast and detail.</p>');
add('find','Notes, not sentences',()=>notes('Dad\nfootball\nLiverpool last weekend\nquiet → talks nonstop\nTurkish coffee\nwork advice')+'<p>This is enough.</p><p>You have places to go.</p>'+help('Useful language · Say it again','<p>“We talk many things.” → “We talk about all sorts of things.”</p><p>“He give me advices.” → “He gives me good advice.”</p><p>Choose one. Say a sentence about your person.</p>'));
add('map','Do not write your speech',()=>'<p>Make a map.</p><p class="eyebrow">Too much writing</p><p>“My father is a very important person in my life because he always gives me good advice and I really enjoy talking to him because…”</p>'+quiz('writing'));
add('map','Each note opens a door',()=>notes('DAD\n\nfootball\nLiverpool match\nquiet → talks nonstop\n\ncoffee\ndoctor says less!\n\nwork\ngood advice')+'<p>Tap one note. Say what it reminds you of.</p>'+['football','coffee','work'].map((n,i)=>`<button class="map-key" data-door="${i}">${n}</button>`).join('')+feedback('','door'));
add('map','Make your own map',()=>card(placeCard)+'<p>You have one minute.</p><p>Do NOT write sentences.</p><label class="note-entry" for="map-notes">Write 4–6 short notes.</label><textarea id="map-notes" data-text="map" class="notes-input" rows="6">'+esc(state.text.map||'')+'</textarea>'+help('Optional · Places to look',notePrompts())+help('Optional · Short-note style',notes('coffee shop\n5 mins walk\nafter gym\nold tables\nsame waiter\nbusy evenings')),'Use my notes');
add('map','Now speak',()=>'<p>Try to speak for about 45–60 seconds.</p><p>Follow your notes.</p><p>If one idea becomes interesting, stay with it.</p><p>Use your phone’s recorder.</p>'+help('Read the practice card',card(placeCard))+'<p class="eyebrow">Your notes</p>'+notes(state.text.map||'You can speak without notes, or go back to write some.')+help('Useful language · Try one phrase','<p>“I go there for relaxing.” → “I go there to relax.”</p>'),'I’ve spoken');
add('map','Where did you run out?',()=>'<p>Listen to your recording.</p>'+choices('runout','Where did you run out?',runout)+feedback(repairs[picked('runout')]||'','repair'));
add('map','Keep your map',()=>'<p>Keep your notes. You will use one again.</p><p>Now listen to three speakers. Notice who finds somewhere to go.</p>'+evidenceBox());
const longTurn=createLongTurn({state,save,app,esc,card,choices,help,notes,feedback});
screens.push(...longTurn.screens);
let releaseUI;
function render(){
 longTurn.beforeLeave();
 state.step=Number.isInteger(state.step)?Math.max(0,Math.min(state.step,screens.length-1)):0;
 const screen=screens[state.step],stage=releaseConfig.stages.find(s=>s.id===screen.stage);
 releaseUI.update(stage);document.getElementById('progress-label').textContent=`Day 2 · Stage ${releaseConfig.stages.indexOf(stage)+1} of 6 · ${stage.label}`;document.getElementById('progress').value=releaseConfig.stages.indexOf(stage)+1;
 app.innerHTML=control.isOpen(stage.id)?`<p class="eyebrow">Day 2 · ${stage.label}</p><h1>${screen.title}</h1>${screen.body()}<nav class="nav" aria-label="Activity navigation">${state.step?'<button data-back>Back</button>':''}<button data-next class="primary">${screen.next}</button></nav>`:releaseUI.locked(stage);save();
}
function jump(index){const url=new URL(location.href);url.searchParams.delete('stage');history.replaceState(null,'',url.pathname+url.search+url.hash);state.step=index;render();document.getElementById('activity').focus();window.scrollTo(0,0);}
app.addEventListener('input',e=>{const id=e.target.dataset.text;if(id){state.text[id]=e.target.value;save();}});
app.addEventListener('change',e=>{
 const t=e.target;if(!t.matches('input[name]'))return;
 let values=Array.from(app.querySelectorAll(`input[name="${t.name}"]:checked`),i=>Number(i.value));
 if(t.name==='material'&&values.length>2){t.checked=false;values=values.filter(i=>i!==Number(t.value));document.getElementById('material-limit').textContent='Choose up to TWO. Uncheck one to choose another.';}
 state.answers[t.name]=values;save();
 if(t.name==='material')document.getElementById('own-questions').innerHTML=ownQuestions();
 if(t.name==='add')document.getElementById('addition').innerHTML=addition();
 if(t.name==='runout')document.getElementById('repair').textContent=repairs[picked('runout')]||'';
 if(quizzes[t.name]&&state.checked[t.name])document.getElementById('feedback').innerHTML=quizFeedback(t.name);
});
app.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-next')){
  const stage=control.stageForScreen(state.step);
  if(state.step===screens.length-1){control.complete(stage.id);state.complete=true;save();releaseUI.update(stage);longTurn.beforeLeave();app.innerHTML='<p class="eyebrow">Day 2 complete</p><h1>Keep the talk going</h1><p>Your map and choices are saved on this device.</p><button data-review>Review Day 2</button>';return;}
  if(control.stageForScreen(state.step+1).id!==stage.id)control.complete(stage.id);jump(state.step+1);
 }
 if(b.hasAttribute('data-back'))jump(state.step-1);
 if(b.hasAttribute('data-review'))jump(0);
 if(b.dataset.check){state.checked[b.dataset.check]=true;save();document.getElementById('feedback').innerHTML=quizFeedback(b.dataset.check);}
 if(b.hasAttribute('data-reveal')){state.reveal=Math.min(3,state.reveal+1);save();document.getElementById('development').innerHTML=revealBody();}
 if(b.dataset.door!==undefined)document.getElementById('door').textContent=['What happens when you watch together?','What is the story here?','What advice does he give you?'][Number(b.dataset.door)];
});
releaseUI=installStudentRelease({control,app,progress:document.querySelector('.progress-wrap'),onJump:jump,onRefresh:render});
const requested=releaseConfig.stages.find(s=>s.id===new URLSearchParams(location.search).get('stage'));if(requested)state.step=requested.firstScreen;
render();
