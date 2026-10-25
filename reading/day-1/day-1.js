import {syncWorkspace,installWorkspace,workspaceMarkup,rememberWorkspace} from './workspace-prototype.js';
import {installLuxury} from './luxury.js';
import {lesson as C} from './content.js';
import {installContinuation, continuationStages} from './continuation.js';
import {optionOrder, headingOrders, matchingOrders} from './answer-order.js';
const KEY='ielts-reading-day-1-v2';
const groups=['Start here','1 · Flexible Working','2 · Urban Trees','3 · Large Language Model','4 · Curitiba','5 · Mohammed from Sohar','7 · Bedouin life','8 · Electric Vehicles','9 · Digital Football','6 · You Are What You Eat','Take it with you','10 · Ferrari','11 · Amouage'];
const blank=()=>({sequenceVersion:4,step:0,answers:{},checked:{},reveals:{},paragraphs:{},views:{},notes:{},optionOrders:{},activityChecked:{},visited:[]});
let state=blank(),storageOK=true,legacyStep=null;
let activityScope='';
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&typeof saved==='object'&&!Array.isArray(saved)){
 state={...state,...saved};
 if(saved.sequenceVersion!==4)legacyStep=Number.isInteger(saved.step)?saved.step:0;

}}catch{storageOK=false;}
for(const name of ['answers','checked','reveals','paragraphs','views','notes','optionOrders','activityChecked'])if(!state[name]||typeof state[name]!=='object'||Array.isArray(state[name]))state[name]={};
for(const [k,v] of Object.entries(state.answers))if(!Array.isArray(v)||v.some(n=>!Number.isInteger(n)||n<0||n>100))delete state.answers[k];
state.visited=Array.isArray(state.visited)?state.visited.filter(Number.isInteger):[];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=s=>`<p>${esc(s)}</p>`;
const help=(title,html)=>`<details class="help"><summary>${esc(title)}</summary><div>${html}</div></details>`;
const path=(nodes,examples=[])=>`<ol class="path" aria-label="Paragraph structure">${nodes.map((n,i)=>`<li>${esc(n)}${examples[i]?`<small>${esc(examples[i])}</small>`:''}</li>`).join('')}</ol>`;
const passage=text=>`<div class="passage">${p(text)}</div>`;
const registry=new Map();
function question(q,scope=activityScope) {
 registry.set(q.id,q);
 const chosen=state.answers[q.id]||[], checked=state.activityChecked[scope+'-'+q.id]??state.checked[q.id];
 const order=optionOrder(q,state.optionOrders);
 const right=chosen.length===q.correct.length&&q.correct.every(id=>chosen.includes(id));
 const answer=q.correct.map(id=>q.options[id]).join('; ');
 return `<div class="question" data-question="${q.id}" data-question-scope="${scope}"><fieldset><legend>${esc(q.prompt)}</legend><div class="options">${order.map((id,position)=>`<label class="option"><input type="${q.multi?'checkbox':'radio'}" name="${scope}-${q.id}" data-question-id="${q.id}" value="${id}" ${chosen.includes(id)?'checked':''}><span>${q.letters?String.fromCharCode(65+position)+'. ':''}${esc(q.options[id])}</span></label>`).join('')}</div></fieldset>
 <div class="tool-actions"><button class="secondary" data-check="${q.id}">${checked?'Check again':'Check & understand'}</button><button class="secondary" data-answer="${q.id}">Show answer and explanation</button></div>
 <div class="feedback" id="feedback-${scope}-${q.id}" role="status" ${checked?'':'hidden'}>${checked?`<p><strong>${chosen.length?(right?'That fits the text.':'Compare your choice with the text.'):'Here is a reading to compare.'}</strong></p><p>${q.suggested?'Suggested answer':'Answer'}: ${esc(answer)}</p>${p(q.why||`“${answer}” gives the simple meaning. Return to the passage and try that meaning in the sentence.`)}`:''}</div></div>`;
}
const Q=id=>question(C.questions[id]);
function reveal(id,title,html){const open=!!state.reveals[id];return `<button class="secondary" data-reveal="${id}" aria-expanded="${open}" aria-controls="${id}">${esc(title)}</button><div id="${id}" class="feedback" ${open?'':'hidden'}>${html}</div>`;}
const vocabQuestions=ids=>help('Words that may help · optional',ids.map(Q).join(''));
const vocabulary=name=>help('Words that may help · optional',`<div class="vocabulary">${C.vocabulary[name].map(([w,m])=>`<p><strong>${esc(w)}</strong>${esc(m)}</p>`).join('')}</div>`);
function heading(name,i){return question({id:`heading-${name}-${i}`,prompt:`${C.passages[name].length>1?'Paragraph '+String.fromCharCode(65+i)+' · ':''}Choose the best heading`,options:C.headings[name],order:headingOrders[name],correct:[C.keys[name][i]],why:C.feedback[name][i],letters:true,suggested:['curitiba','food'].includes(name)});}
function completePassage(name){return C.passages[name].map((text,i)=>`<section class="c-paragraph">${C.passages[name].length>1?`<h3>Paragraph ${String.fromCharCode(65+i)}</h3>`:''}${passage(text)}</section>`).join('');}
function explorer(name,mode='headings'){
 return C.passages[name].map((_,i)=>{
  const work=mode==='headings'?heading(name,i):mode==='jobs'?Q(i===0?191:194)+reveal('mohammed-map-'+i,'See this paragraph’s jobs',path(C.maps[name][i])):mode==='maps'?reveal('bedouin-map-'+i,'Reveal this paragraph’s structure',path(C.maps[name][i])+p(C.feedback[name][i])):argument(i);
  return `<section class="paragraph-task" data-task-paragraph="${String.fromCharCode(65+i)}"><h2>Paragraph ${String.fromCharCode(65+i)}</h2>${work}</section>`;
 }).join('');
}
function match(id,items,meanings,title){const options=[...meanings].reverse();return `<h2>${esc(title)}</h2>${items.map((w,i)=>{const q={id:id+'-'+i,prompt:w,options,correct:[options.indexOf(meanings[i])],why:`${w} → ${meanings[i]}`};registry.set(q.id,q);return `<div class="match-row"><label for="${q.id}">${esc(w)}</label><select id="${q.id}" name="${q.id}"><option value="">Choose a meaning</option>${matchingOrders[id].map(value=>`<option value="${value}" ${(state.answers[q.id]||[]).includes(value)?'selected':''}>${esc(options[value])}</option>`).join('')}</select></div>`;}).join('')}`+reveal(id+'-key','Compare the matches',`<div class="vocabulary">${items.map((w,i)=>`<p><strong>${esc(w)}</strong>${esc(meanings[i])}</p>`).join('')}</div>`);}
const argumentOptions=['Common claim','Challenge','Evidence / comparison','Qualification','Wider explanation','Synthesis'];
const argumentAnswers=[[0,1,4],[0,2,3],[0,2,1],[4],[5]];
const argumentEvidence=[['Public discussions … simple explanations','Yet … contradicted by everyday observations','a combination of dietary patterns, behaviour, and physiological processes'],['One widely held belief','Studies indicate … whereas','generally … may not … may'],['Certain foods … primary causes','when total energy intake is controlled … similar outcomes','This challenges the assumption'],['small, repeated behaviours … broader context of daily behaviour'],['Taken together … interaction of multiple factors']];
function argument(i){return p('Decide what the writer does in each part. Then compare your answers with our analysis of the paragraph.')+argumentEvidence[i].map((e,j)=>question({id:`argument-${i}-${j}`,prompt:`“${e}”`,options:argumentOptions,correct:[argumentAnswers[i][j]],why:['The opening presents an idea commonly accepted.','The writer questions the simple claim.','The writer uses findings or contrasts cases to support the reasoning.','The writer limits how strongly or how widely the claim applies.','The explanation looks beyond a single factor.','The writer brings the earlier observations together.'][argumentAnswers[i][j]]})).join('')+`<label for="map-note-${i}">My paragraph map · a few words or arrows (optional)</label><textarea id="map-note-${i}" data-note="map-note-${i}" placeholder="What comes first? What changes? Where does it lead?">${esc(state.notes['map-note-'+i]||'')}</textarea>`+reveal('food-map-'+i,'Compare the paragraph map',path(C.maps.food[i])+p(C.feedback.food[i]));}
const screens=[];
const add=(group,title,body,passageName)=>screens.push({group,title,body,passageName});
add(0,'Seeing what the text is doing',()=>p('IELTS Reading · Day 1')+`<p class="lead">A paragraph has a topic. It also has a job.</p><p class="principle">What is the writer doing with the information?</p>`+p('Start with a visible change of direction. Work towards dense language and a sustained argument.')+p('Try the questions, compare the reasons, and continue when you are ready. You can always go back. Nothing requires dragging or a perfect answer.'));
add(1,'Notice the movement',()=>path(['POSITIVE','HOWEVER','NEGATIVE'],['welcomed · improved · satisfaction','changes the direction','concerns · limit · weaken'])+Q(25));
add(1,'Flexible Working',()=>heading('flexible',0),'flexible');
add(2,'Notice the building pattern',()=>path(['POSITIVE','ALSO','FURTHERMORE'],['provide shade · help reduce temperatures','absorb pollutants · reduce rainwater entering drainage','benefits · well-being'])+`<p class="principle">Positive + positive + positive</p>`+vocabQuestions([48,51,54,57,60,63,66,69]));
add(2,'Urban Trees',()=>vocabQuestions([48,51,54,57,60,63,66,69])+heading('trees',0),'trees');
add(3,'Notice the order',()=>path(['FIRST','THEN','NEXT','AFTER'])+Q(82));
add(3,'Make the specialist words familiar',()=>p('Match the words with their meanings. You don’t need to match every word.')+match('llm-words',C.vocabulary.llm.map(x=>x[0]),C.vocabulary.llm.map(x=>x[1]),'A person → a prompt → a response'));
add(3,'Large Language Model',()=>vocabulary('llm')+heading('llm',0),'llm');
add(4,'One paragraph. Several jobs.',()=>p('Now the relationships begin to combine. Match each signal to its job.')+match('signals',['created','rather than','as a result','while'],['CAUSE','CHOICE / ALTERNATIVE','RESULT','CONTRAST'],'Match the signal to its job')+vocabQuestions([125,128,131,134,137,140,143,146]));
add(4,'Curitiba',()=>p('Read both paragraphs. Choose one heading for each. A heading can mention something true and still miss the paragraph’s main job.')+vocabQuestions([125,128,131,134,137,140,143,146])+explorer('curitiba'),'curitiba');
add(4,'True detail ≠ best heading',()=>path(C.maps.curitiba[0])+p('Paragraph A: background → problem → choice / response → result.')+path(C.maps.curitiba[1])+p('Paragraph B: success → limitation → response → purpose.')+Q(167),'curitiba');
add(5,'Mohammed from Sohar',()=>p('Read A, then B. Keep asking: what changes between the two paragraphs?'));
add(5,'What is each paragraph doing?',()=>Q(179)+Q(182)+reveal('topic-function','Compare the two paragraph jobs',`<p class="principle">Topic ≠ function</p>`+p('Both paragraphs discuss Mohammed, communication and social media. Paragraph A explains why online communication was easier. Paragraph B traces how confidence developed and limits the explanation.'))+explorer('mohammed','jobs')+help('Notice the limits in the explanation',p('Initially / over time / gradually trace change. Suggests / can / although / not necessarily limit the explanation. “This does not mean… rather…” corrects an over-simple interpretation.')),'mohammed');
add(6,'The Transformation of Bedouin Life in the Modern Arabian Peninsula',()=>p('Start with the title. It tells you what changed, where, and when.')+path(['TRANSFORM','TRANSFORMATION'],['Bedouin life transformed.','The transformation of Bedouin life.'])+`<div class="sentence">${p('Bedouin life changed.')}${p('The change happened in the Arabian Peninsula.')}${p('The text mainly looks at the modern period.')}</div>`+Q(208)+Q(211));
add(6,'Place the text in context',()=>Q(215)+Q(224));
add(6,'From nomadic to settled',()=>p('Decide if each statement is TRUE or FALSE.')+[228,229,230,231,232].map(i=>{const [text,answer]=C.source[i].split(' — ');return question({id:'context-'+i,prompt:text,options:['True','False'],correct:[answer==='TRUE'?0:1],why:i===230?'Traditional life involved seasonal movement and livestock. Permanent homes, office jobs and modern services belong to the later change.':i<230?'Nomadic communities move from place to place, often with the seasons.':'Settled communities live permanently in one place.'});}).join('')+path(['TRADITIONAL','TRANSFORMATION','SETTLED / MODERN'],['seasonal movement · livestock · environmental knowledge','','permanent homes · education · healthcare · modern employment'])+vocabulary('bedouin'));
add(6,'Bedouin life · read and choose',()=>p('Work through A–D. Take time with each paragraph. Optional word help remains available throughout.')+vocabulary('bedouin')+explorer('bedouin'),'bedouin');
add(6,'Look beneath the paragraphs',()=>p('Before revealing a map, say what the paragraph does first, what changes, and where it ends.')+explorer('bedouin','maps'),'bedouin');
add(6,'Recover the main sentence',()=>p('When extra information interrupts the sentence, temporarily set it aside. Find the main message, then put the extra information back.')+`<div class="sentence" id="repair-sentence">Although these changes provided clear advantages, <span class="embedded" ${state.reveals.middle?'hidden':''}>including improved access to services and greater economic stability, </span>they also placed significant pressure on long-established ways of life.</div><div class="tool-actions"><button data-middle aria-pressed="${!!state.reveals.middle}">${state.reveals.middle?'Put the middle back':'Temporarily remove the middle'}</button></div>`+path(['TEMPORARILY REMOVE IT','FIND THE MAIN MESSAGE','PUT THE EXTRA INFORMATION BACK'])+Q(314)+Q(317));
add(6,'Unpack the noun',()=>p('Academic writing often packs actions, changes and qualities into nouns. Some nouns describe actions or ideas. Rewrite them as actions or descriptions to make the meaning clearer.')+nounTools());
add(6,'Turn the passive around',()=>p('The passive often lets the writer begin with the thing already being discussed. Turning it around can make the actors and actions clearer.')+passiveTools(),'bedouin');
add(6,'Three tools you can use when reading stalls',()=>`<div class="tools"><article><h2>1 · UNPACK THE NOUN</h2>${p('transformation → something transformed')}${p('expansion → something expanded')}${p('formalisation → something became formal')}</article><article><h2>2 · REMOVE THE MIDDLE</h2>${p('Set the extra information aside. Find the main sentence. Put the detail back.')}</article><article><h2>3 · TURN THE PASSIVE AROUND</h2>${p('X was replaced by Y → Y replaced X')}</article></div><p class="principle">Word → sentence → paragraph → whole text</p>`+p('These are reading-repair tools. Use them when a sentence becomes difficult; you do not need to name grammar terms.'));
add(9,'You Are What You Eat—Or Are You?',()=>p('Let the title orient you. This time, follow the writer’s argument across the whole text.')+Q(376)+Q(380));
add(9,'Follow a sustained argument',()=>p('Read A–E in order, then choose the best heading for each. Think beyond the topic: what is this paragraph doing in the argument?')+explorer('food'),'food');
add(9,'Build the argument’s shape',()=>p('Work through A–E. Identify the jobs yourself before revealing a suggested map.')+explorer('food','argument'),'food');
add(9,'Small words. Important limits.',()=>`<div class="word-strength">${['may','suggests','generally','increasingly','appears','can','cannot be explained by X alone','overly simplified'].map(w=>`<span>${esc(w)}</span>`).join('')}</div>`+p('These words control the strength of a claim. Find examples in the passage: does the writer make an absolute claim, or leave room for other factors?')+Q(429)+reveal('qualification','See how the words limit the claims',p('“Generally a more significant factor” does not mean “the only factor”. “May not gain weight” does not mean “will never gain weight”. “Cannot be explained by single factors alone” calls for a wider explanation.')+p('The writer challenges explanations that are too simple, then brings the observations together.')),'food');
add(10,'Take it into your next reading',()=>`<p class="principle">What is it about?<br>What is the writer doing?</p>`+path(['NOTICE A RELATIONSHIP','FOLLOW THE PARAGRAPH','FOLLOW THE ARGUMENT'])+p('A true detail may not be the best heading. Two paragraphs can share a topic but do different jobs. If language blocks the meaning, use a reading-repair tool.')+`<label for="reflection">One thing I will try next time (optional)</label><textarea id="reflection" data-note="reflection">${esc(state.notes.reflection||'')}</textarea>`+p('You can continue to the next topic or use Reading task to revisit another topic.')+`<button class="secondary" id="restart">Return to the beginning · keep my answers</button>`);
installWorkspace({state,save,app:document.getElementById('app')});
const continuationUI=installContinuation({state,save,app:document.getElementById('app')});
screens.splice(22,0,...continuationUI.screens);
const luxuryUI=installLuxury({state,save,app:document.getElementById('app')});
screens.push(...luxuryUI.screens);
const food=screens.filter(screen=>screen.group===9);
screens.splice(screens.findIndex(screen=>screen.group===9),food.length);
screens.splice(screens.findIndex(screen=>screen.group===6),0,...food);
const readingTasks=[
 [1,'Flexible Working'],[2,'Urban Trees'],[3,'Large Language Model'],[4,'Curitiba'],[5,'Mohammed from Sohar'],[9,'You Are What You Eat—Or Are You?'],[6,'Bedouin Life'],[7,'Electric Vehicles'],[8,'Digital Football'],[11,'Ferrari'],[12,'Amouage']
];
const taskSelect=document.getElementById('reading-task');
taskSelect.innerHTML=readingTasks.map(([group,label])=>`<option value="${group}">${esc(label)}</option>`).join('');
taskSelect.addEventListener('change',()=>navigate(readingTasks.findIndex(([group])=>group===Number(taskSelect.value))));
function nounTools(){const start=C.source.indexOf('employ'),rows=Array.from({length:10},(_,i)=>C.source.slice(start+i*3,start+i*3+3));const examples=['the expansion of infrastructure → infrastructure expanded','the formalisation of national borders → national borders became more formal / controlled','a transition towards wage-based employment → people increasingly began working for wages','the transformation of Bedouin society → Bedouin society changed significantly'];return `<div class="vocabulary">${rows.map(([a,n,f],i)=>`<div>${p(n)}${reveal('noun-'+i,'Unpack / compare',p(`${a} → ${n} (${f})`))}</div>`).join('')}</div>`+help('A useful distinction',p('Not every abstract noun is a straightforward grammatical nominalisation. Transformation, formalisation, expansion and settlement clearly come from other word forms. Heritage and livelihood add conceptual density, but do not all follow the same simple word-building pattern.'))+`<h2>Make the action visible</h2>${examples.map((e,i)=>{const [packed,unpacked]=e.split(' → ');return `<div class="sentence">${p(packed)}${reveal('unpack-'+i,'Turn it into an action',p(unpacked))}</div>`;}).join('')}`;}
function passiveTools(){const examples=[['These practices are often understood as cultural knowledge.','Younger generations often understand these practices as cultural knowledge.'],['These functions have largely been replaced by modern transport and logistics systems.','Modern transport and logistics systems have largely replaced these functions.']];return examples.map(([a,b],i)=>`<div class="sentence">${p(a)}${reveal('passive-'+i,'Who or what does this?',p(b)+(i===0?p('“Younger generations” comes from the surrounding sentence in Paragraph B. Use context; do not invent an actor when the text does not tell you.'):''))}</div>`).join('');}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}}
// Former screens remain activity definitions; only topics are navigation destinations.
const sections=['Paragraphs','Ideas and arguments','Reading skills','Reading carefully'];
const ranges=[[1,3],[4,5],[6,8],[9,11],[12,13],[14,17],[18,26],[27,33],[34,41],[42,44],[45,49]];
const topics=readingTasks.map(([group,title],i)=>({group,title,section:sections[i<3?0:i<6?1:i<9?2:3],first:ranges[i][0],last:ranges[i][1]}));
if(legacyStep!==null){state.step=Math.max(0,topics.findIndex(t=>legacyStep+1>=t.first&&legacyStep+1<=t.last));state.visited=[...new Set(state.visited.map(n=>topics.findIndex(t=>n+1>=t.first&&n+1<=t.last)).filter(n=>n>=0))];}
state.sequenceVersion=4;
function activity(n){const s=screens[n-1];activityScope='activity-'+n;let html=s.body();
 return `<section class="topic-activity" data-activity="${n}"><h2>${esc(s.title)}</h2>${html}</section>`;
}
function topicBody(t){
 const before=[],inside=[],after=[];
 for(let n=t.first;n<=t.last;n++){
  if([1,2,4,6,7,9,12,14,18,19,20,27,34].includes(n))before.push(n);
  else if([26,41,44].includes(n))after.push(n);else inside.push(n);
 }
 const original=screens.slice(t.first-1,t.last).find(s=>s.passageName);
 const text=original?completePassage(original.passageName):t.group===7?continuationUI.passage('ev'):t.group===8?continuationUI.passage('football'):luxuryUI.passage(t.group===11?'ferrari':'amouage');
 return before.map(activity).join('')+`<div class="continuation" data-reading-screen="topic-${t.group}">${workspaceMarkup(text,inside.map(activity).join(''))}</div>`+after.map(activity).join('');
}
function render(focus=false){registry.clear();state.step=Number.isInteger(state.step)?Math.max(0,Math.min(topics.length-1,state.step)):0;const t=topics[state.step];if(!state.visited.includes(state.step))state.visited.push(state.step);
 document.getElementById('app').innerHTML=`<p class="eyebrow">${esc(t.section)} · Topic ${state.step+1} of ${topics.length}</p><h1>${esc(t.title)}</h1>${topicBody(t)}`;
 document.getElementById('back').disabled=state.step===0;document.getElementById('back').textContent='← Previous topic';document.getElementById('next').hidden=state.step===topics.length-1;document.getElementById('next').textContent='Next topic →';taskSelect.value=String(t.group);syncWorkspace(document.querySelector('#app > .continuation'));save();if(focus){document.getElementById('main').focus();window.scrollTo({top:0,behavior:'instant'});}}
function navigate(step){rememberWorkspace();state.step=step;state.views={};render(true);}
document.getElementById('back').addEventListener('click',()=>navigate(state.step-1));document.getElementById('next').addEventListener('click',()=>navigate(state.step+1));
document.getElementById('app').addEventListener('change',e=>{const el=e.target,id=el.dataset.questionId||el.name;if(!registry.has(id))return;const q=registry.get(id);
 state.answers[id]=el.tagName==='SELECT'?(el.value===''?[]:[Number(el.value)]):q.multi?[...el.closest('.question').querySelectorAll('input:checked')].map(x=>Number(x.value)):[Number(el.value)];
 delete state.checked[id];
 document.querySelectorAll(`[data-question="${id}"]`).forEach(holder=>{delete state.activityChecked[holder.dataset.questionScope+'-'+id];holder.querySelectorAll('input').forEach(input=>input.checked=state.answers[id].includes(Number(input.value)));const feedback=holder.querySelector('.feedback');feedback.hidden=true;feedback.textContent='';});save();});
document.getElementById('app').addEventListener('input',e=>{if(e.target.dataset.note){state.notes[e.target.dataset.note]=e.target.value;save();}});
document.getElementById('app').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.check||b.dataset.answer){
  const id=b.dataset.check||b.dataset.answer;
  if(b.dataset.check&&!(state.answers[id]||[]).length){
   const feedback=b.closest('.question').querySelector('.feedback');
   feedback.hidden=false;
   feedback.textContent='Choose an option to check. You can also show the explanation or continue.';
  }else{
   const holder=b.closest('.question'),q=registry.get(id),scope=holder.dataset.questionScope;
   state.activityChecked[scope+'-'+id]=true;
   holder.outerHTML=question(q,scope);save();
   document.querySelector(`[data-question-scope="${scope}"][data-question="${id}"] [${b.dataset.check?'data-check':'data-answer'}]`).focus({preventScroll:true});
  }
 }
 if(b.dataset.reveal){const id=b.dataset.reveal;state.reveals[id]=!state.reveals[id];document.getElementById(id).hidden=!state.reveals[id];b.setAttribute('aria-expanded',String(state.reveals[id]));save();}
 if(b.hasAttribute('data-middle')){state.reveals.middle=!state.reveals.middle;document.querySelector('.embedded').hidden=!!state.reveals.middle;b.textContent=state.reveals.middle?'Put the middle back':'Temporarily remove the middle';b.setAttribute('aria-pressed',String(!!state.reveals.middle));save();}
 if(b.id==='restart')navigate(0);
});
render();
export {screens,topics,KEY,readingTasks};
