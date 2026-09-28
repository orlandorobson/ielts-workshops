import {continuation as C} from './continuation-content.js';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p = text => `<p>${esc(text)}</p>`;
const letters = n => Array.from({length:n}, (_, i) => String.fromCharCode(65+i));
const dict = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const normalise = value => String(value).toLowerCase().trim().replace(/[.!?,;:]+$/g,'').replace(/[-–—]/g,' ').replace(/\s+/g,' ');
const details = (title, body) => `<details class="help"><summary>${esc(title)}</summary><div>${body}</div></details>`;

// One model per complete task. No per-item checking or exclusive matching choices.
export const tasks = {};
for (const data of [C.ev, C.football]) {
  tasks[data.id+'-summary'] = {
    id:data.id+'-summary', data, kind:'summary', title:'Choose a simple summary',
    instruction:data.summaryInstruction,
    items:data.summaries.map((q,i)=>({prompt:'Paragraph '+q.paragraph, options:q.options.map((text,j)=>({value:letters(3)[j],text})), answer:q.answer, rationale:data.summaryRationales[i], evidence:data.paragraphs[i]}))
  };
  for (const key of ['taskA','taskB']) {
    const source=data[key], people=key==='taskB';
    tasks[source.id]={id:source.id,data,kind:people?'people':'paragraph',title:source.title,instruction:source.instruction,
      items:source.questions.map((text,i)=>({prompt:text,options:(people?data.groups:letters(data.paragraphs.length).map(l=>'Paragraph '+l)).map((text,j)=>({value:letters(people?data.groups.length:data.paragraphs.length)[j],text})),answer:source.answers[i],rationale:source.rationales[i],evidence:source.evidence[i]}))};
  }
}
tasks['ev-stakeholders']={id:'ev-stakeholders',data:C.ev,kind:'stakeholders',title:'Who says what?',instruction:'Match each group to its simple position. Complete all five, then check once.',items:C.ev.groupSummaries.map(([group,summary],i)=>({prompt:group,options:[3,0,4,2,1].map(j=>({value:String(j),text:C.ev.groupSummaries[j][1]})),answer:String(i),rationale:summary,evidence:C.ev.stakeholderEvidence[i]}))};
tasks['football-stakeholders']={id:'football-stakeholders',data:C.football,kind:'retrieval',title:'Reconstruct the viewpoints',instruction:'Complete each simple idea from the passage. A word or short phrase is enough. Try to retrieve the idea before opening the word help.',items:C.football.prompts.map((prompt,i)=>({prompt,group:C.football.groups[i],answer:C.football.completions[i],accepted:C.football.accepted[i],evidence:C.football.stakeholderEvidence[i]}))};

export const continuationStages = [
  {id:'ev-read',group:7,title:'Electric Vehicles · Read the whole text',type:'read',data:C.ev},
  {id:'ev-summary',group:7,title:'First understand the paragraphs',type:'task',task:'ev-summary',data:C.ev},
  {id:'ev-unpack',group:7,title:'Unpack the question before searching',type:'ev-unpack',data:C.ev},
  {id:'ev-reasoning',group:7,title:'Follow the environmental reasoning',type:'ev-reasoning',data:C.ev},
  {id:'ev-task-a',group:7,title:'Task 1A · Paragraph matching',type:'task',task:'ev-task-a',data:C.ev},
  {id:'ev-stakeholders',group:7,title:'Who says what about EVs?',type:'task',task:'ev-stakeholders',data:C.ev},
  {id:'ev-task-b',group:7,title:'Task 1B · Match the groups',type:'task',task:'ev-task-b',data:C.ev},
  {id:'football-read',group:8,title:C.football.title,type:'read',data:C.football},
  {id:'football-summary',group:8,title:'What does each paragraph really say?',type:'task',task:'football-summary',data:C.football},
  {id:'football-unpack',group:8,title:'You do more of the unpacking',type:'football-unpack',data:C.football},
  {id:'football-language',group:8,title:'Small words can change the meaning',type:'football-language',data:C.football},
  {id:'football-task-a',group:8,title:'Task 2A · Find the information',type:'task',task:'football-task-a',data:C.football},
  {id:'football-stakeholders',group:8,title:'Reconstruct who says what',type:'task',task:'football-stakeholders',data:C.football},
  {id:'football-task-b',group:8,title:'Task 2B · Match the viewpoints',type:'task',task:'football-task-b',data:C.football}
];

export function installContinuation({state, save, app}) {
  state.continuation=dict(state.continuation);
  const S=state.continuation;
  for(const key of ['answers','checked','reveals','notes','panes','positions','progress','marked'])S[key]=dict(S[key]);
  for(const [id,value] of Object.entries(S.answers))if(typeof value!=='string')delete S.answers[id];
  for(const [id,value] of Object.entries(S.progress))if(!Number.isInteger(value)||value<0||value>9)delete S.progress[id];
  for(const [id,value] of Object.entries(S.positions))if(typeof value!=='number'||!Number.isFinite(value)||value<0)delete S.positions[id];
  const key=(task,i)=>task.id+'-'+i;
  const value=(task,i)=>S.answers[key(task,i)]||'';
  const correct=(task,i)=>task.kind==='retrieval'?task.items[i].accepted.includes(normalise(value(task,i))):value(task,i)===task.items[i].answer;
  let timer;
  function scheduleSave(){clearTimeout(timer);timer=setTimeout(save,150);}
  function vocabulary(data){return details('Words that may help · optional',`<div class="vocabulary">${data.vocabulary.map(([word,meaning])=>`<p><strong>${esc(word)}</strong>${esc(meaning)}</p>`).join('')}</div>`);}
  function passage(data){return `<div class="c-full-passage">${data.paragraphs.map((text,i)=>`<section id="c-${data.id}-paragraph-${i}" class="c-paragraph"><h3>Paragraph ${letters(5)[i]}</h3><div class="passage">${p(text)}</div></section>`).join('')}</div>`;}
  function reference(data){return details('People and groups · keep the names nearby',`<ul class="c-reference">${data.groups.map((name,i)=>`<li><strong>${letters(5)[i]}</strong> ${esc(name)}</li>`).join('')}</ul>`);}
  function comparison(stage,body){const pane=S.panes[stage.id]==='task'?'task':'passage';return `<p class="caption c-desktop-hint">Scroll the passage and questions separately to keep your place.</p><p class="caption c-phone-hint">Switch between the passage and questions below. Each panel keeps your place as you scroll.</p><div class="c-mobile-tabs" role="group" aria-label="Compare the passage and task"><button data-c-pane="passage" aria-pressed="${pane==='passage'}">Read passage</button><button data-c-pane="task" aria-pressed="${pane==='task'}">Questions & support</button></div><div class="c-workbench" data-c-view="${pane}"><section class="c-pane c-passage-pane" data-c-scroll="passage" tabindex="0" role="region" aria-label="Complete ${stage.data.id==='ev'?'EV':'Digital Football'} passage"><div class="c-passage-tools"><span>Go to paragraph</span>${stage.data.paragraphs.map((_,i)=>`<button class="secondary" data-c-paragraph="${i}" aria-label="Read paragraph ${letters(5)[i]}">${letters(5)[i]}</button>`).join('')}</div>${vocabulary(stage.data)}${passage(stage.data)}</section><section class="c-pane c-task-pane" data-c-scroll="task" tabindex="0" role="region" aria-label="${esc(stage.title)} questions and support">${body}</section></div>`;}
  function question(task,i){const item=task.items[i],id=key(task,i),picked=value(task,i);
    if(task.kind==='retrieval')return `<div class="c-item"><label for="${id}"><strong>${esc(item.group)}</strong><span>${esc(item.prompt)}</span></label><input id="${id}" name="${id}" data-c-task="${task.id}" data-c-index="${i}" type="text" autocomplete="off" value="${esc(picked)}"><button type="button" class="secondary c-unsure" data-c-unsure="${id}">Not sure yet</button></div>`;
    if(task.kind==='summary')return `<fieldset class="c-item"><legend>${esc(item.prompt)}</legend><div class="options">${item.options.map(o=>`<label class="option"><input type="radio" name="${id}" data-c-task="${task.id}" data-c-index="${i}" value="${esc(o.value)}" ${picked===o.value?'checked':''}><span>${esc(o.value)}. ${esc(o.text)}</span></label>`).join('')}</div></fieldset>`;
    return `<div class="c-item"><label for="${id}">${task.kind==='stakeholders'?'':i+1+'. '}${esc(item.prompt)}</label><select id="${id}" name="${id}" data-c-task="${task.id}" data-c-index="${i}"><option value="">Choose an answer</option>${item.options.map(o=>`<option value="${esc(o.value)}" ${picked===o.value?'selected':''}>${task.kind==='stakeholders'?'':esc(o.value)+'. '}${esc(o.text)}</option>`).join('')}<option value="?" ${picked==='?'?'selected':''}>Not sure yet</option></select>${task.kind==='stakeholders'?`<p class="c-selected-meaning" id="meaning-${id}">${esc(item.options.find(o=>o.value===picked)?.text||'')}</p>`:''}</div>`;
  }
  function results(task){const checked=S.checked[task.id]===true;
    return `<section class="c-results" id="results-${task.id}" ${checked?'':'hidden'} aria-label="Answers and explanations"><p class="c-result-summary" role="status">${checked?`${task.items.filter((_,i)=>correct(task,i)).length} / ${task.items.length} ${task.kind==='retrieval'?'wordings recognised':'answers match'}. Compare the reasoning below.`:''}</p>${checked?task.items.map((item,i)=>{const answer=task.kind==='retrieval'?item.answer:item.options.find(o=>o.value===item.answer).text;return `<article class="c-result"><h3>${task.kind==='summary'?'Paragraph '+letters(5)[i]:i+1+'. '+(item.group||item.prompt)}</h3><p><strong>${correct(task,i)?'That fits the text.':task.kind==='retrieval'?'Compare your wording.':'Compare your choice.'}</strong> ${task.kind==='retrieval'?'One answer':'Answer'}: ${task.kind==='paragraph'||task.kind==='people'?esc(item.answer)+' — ':''}${esc(answer)}</p>${item.rationale?p(item.rationale):p('Other wording may also express this idea. Compare its meaning with the passage.')}${details(task.kind==='stakeholders'||task.kind==='retrieval'?'Show me the words in the text':'Show the connection',`<p><strong>Question / idea</strong><br>${esc(item.prompt)}</p><p><strong>Words in the passage</strong></p><blockquote>${esc(item.evidence)}</blockquote>`)}</article>`;}).join(''):''}</section>`;
  }
  function taskBody(task){return `<form class="c-task" data-c-form="${task.id}" novalidate><h2>${esc(task.title)}</h2>${p(task.instruction)}${task.kind==='people'?p('You may use the same letter more than once.')+reference(task.data):''}${task.kind==='paragraph'?p('You may use a paragraph letter more than once.'):''}${task.kind==='retrieval'?details('A small word bank · if you need it',p('physical · tactics · expand · commercial · improvement')+p('Equivalent words can also work. Try to recall the idea before using this help.')):''}${task.items.map((_,i)=>question(task,i)).join('')}<p class="caption">Check the complete set when you have attempted every item. You can always continue and return later.</p><button type="submit" data-c-check="${task.id}">Check answers</button><p class="c-check-notice" role="status"></p>${results(task)}</form>`;}
  function progressive(id,parts,labels){const count=Math.min(S.progress[id]||0,parts.length);return `<div class="c-progressive" data-c-progressive="${id}">${parts.slice(0,count).map((body,i)=>`<section class="c-reveal-stage">${body}</section>`).join('')}${count<parts.length?`<button class="secondary" data-c-progress="${id}">${esc(labels[count])}</button>`:`<button class="secondary" data-c-reset="${id}">Hide the support and try again</button>`}<p class="c-support-notice" role="status"></p></div>`;}
  function phraseTable(rows){return rows.map(([dense,simple,connection])=>`<div class="c-phrase"><strong>${esc(dense)}</strong>${p(simple)}${connection?`<p class="caption">Look for: ${esc(connection)}</p>`:''}</div>`).join('');}
  function evUnpack(){const u=C.ev.unpack;return `<h2>Read the question slowly</h2><blockquote>${esc(u.question)}</blockquote>${p('What does the question ask you to look for? Unpack one part at a time.')}`+progressive('ev-unpack',[...u.phrases.map(row=>phraseTable([row])),`<h3>The simple idea</h3>${p(u.simple)}`,`<h3>Compare with Paragraph C</h3><blockquote>${esc(u.extract)}</blockquote><p class="principle">SAME MEANING — DIFFERENT WORDS</p>${p(u.lesson)}`],['Unpack “a problem related to”','Unpack “limited practicality”','Unpack “certain locations”','Put the meaning together','Connect it to the passage']);}
  function evReasoning(){const r=C.ev.reasoning,t=tasks['ev-summary'];return `<h2>Look beyond the vehicle</h2><blockquote>${esc(r.question)}</blockquote>${p(r.simple)}${p('Read Paragraph A again. Choose its simple summary before opening the reasoning. Your earlier choice is kept here.')}${question(t,0)}`+progressive('ev-reasoning',[...r.chain.map((text,i)=>`<p class="c-reason-node"><span>${i+1}</span> ${esc(text)}</p>`),`<h3>Connect the ideas</h3>${r.connections.map(([a,b])=>`<div class="c-phrase"><strong>${esc(a)}</strong>${p(b)}</div>`).join('')}${p("‘Environmental impact’ is not a synonym for ‘electricity generation’. Understand how the ideas are connected.")}<p class="principle">How environmentally friendly an EV is also depends on where its electricity comes from.</p>`],['Start the reasoning','What does the battery need?','Where might that come from?','What follows from this?','Connect the question and the paragraph']);}
  function footballUnpack(){const u=C.football.unpack;return `<h2>Which parts need unpacking?</h2><blockquote>${esc(u.question)}</blockquote>${p('Tap one or more phrases that feel difficult. There is no score. Try saying the whole idea in easier language before comparing.') }<div class="c-phrase-choices">${u.phrases.map(([phrase],i)=>`<button class="secondary" data-c-mark="${i}" aria-pressed="${!!S.marked[i]}">${esc(phrase)}</button>`).join('')}</div><label for="c-football-meaning">My simpler meaning · optional</label><textarea id="c-football-meaning" data-c-note="football-meaning">${esc(S.notes['football-meaning']||'')}</textarea>`+progressive('football-unpack',[phraseTable(u.phrases.map(([a,b])=>[a,b])),`<h3>Compare the whole idea</h3>${p(u.simple)}`,`<h3>Find the connection</h3><blockquote>${esc(u.extract)}</blockquote>${phraseTable([u.phrases[3]])}<p class="principle">SAME MEANING — DIFFERENT WORDS</p>${p(u.lesson)}`],['Compare the unpacking','Compare a simpler sentence','Connect expectations and improvement']);}
  function footballLanguage(){const d=C.football;return `<h2>WILL or MAY?<br>ALWAYS or NOT ALWAYS?</h2>${p('Look for these expressions in the passage. Say how much the writer is claiming, then open a meaning if you need it.')}${d.smallWords.map(([word,meaning])=>details(word,p(meaning))).join('')}${details('Reading-repair reminders · only if useful',p('These are the tools you have already used. Try unpacking an expression or turning the passive around.')+d.repairs.map(([a,b])=>details(a,p(b))).join(''))}`;}
  function body(stage){switch(stage.type){case 'read':return p(stage.data.id==='ev'?'Read all three paragraphs before opening the summary activity. The original matching questions come later.':'Read all five paragraphs first. Try to understand the ideas before using vocabulary help.')+vocabulary(stage.data)+passage(stage.data);case 'task':return comparison(stage,taskBody(tasks[stage.task]));case 'ev-unpack':return comparison(stage,evUnpack());case 'ev-reasoning':return comparison(stage,evReasoning());case 'football-unpack':return comparison(stage,footballUnpack());case 'football-language':return comparison(stage,footballLanguage());}}
  function render(stage){return `<div class="continuation" data-c-screen="${stage.id}">${body(stage)}</div>`;}
  function remember(){const root=app.querySelector('.continuation');if(root)root.querySelectorAll('[data-c-scroll]').forEach(el=>{if(el.getClientRects().length)S.positions[root.dataset.cScreen+'-'+el.dataset.cScroll]=el.scrollTop;});}
  function afterRender(){const root=app.querySelector('.continuation');if(!root)return;root.querySelectorAll('[data-c-scroll]').forEach(el=>{if(el.getClientRects().length)el.scrollTop=S.positions[root.dataset.cScreen+'-'+el.dataset.cScroll]||0;el.addEventListener('scroll',()=>{if(!el.getClientRects().length)return;S.positions[root.dataset.cScreen+'-'+el.dataset.cScroll]=el.scrollTop;scheduleSave();},{passive:true});});}
  function refresh(selector){remember();const root=app.querySelector('.continuation'),stage=continuationStages.find(s=>s.id===root?.dataset.cScreen);if(!stage)return;root.outerHTML=render(stage);afterRender();if(selector)app.querySelector(selector)?.focus({preventScroll:true});save();}
  function invalidate(taskId){S.checked[taskId]=false;const region=app.querySelector('#results-'+taskId);if(region){region.hidden=true;region.innerHTML='';}const notice=app.querySelector('.c-check-notice');if(notice)notice.textContent='';}
  function fieldChange(el){const task=tasks[el.dataset.cTask],i=Number(el.dataset.cIndex);if(!task||!task.items[i])return;S.answers[key(task,i)]=el.value;invalidate(task.id);const meaning=app.querySelector('#meaning-'+key(task,i));if(meaning)meaning.textContent=task.items[i].options?.find(o=>o.value===el.value)?.text||'';save();}
  app.addEventListener('change',event=>{if(event.target.dataset.cTask)fieldChange(event.target);});
  app.addEventListener('input',event=>{const el=event.target;if(el.dataset.cTask&&el.type==='text')fieldChange(el);if(el.dataset.cNote){S.notes[el.dataset.cNote]=el.value;save();}});
  app.addEventListener('submit',event=>{const id=event.target.dataset.cForm;if(!id)return;event.preventDefault();const task=tasks[id],missing=task.items.filter((_,i)=>!value(task,i).trim()).length;
    if(missing){event.target.querySelector('.c-check-notice').textContent=`Attempt all ${task.items.length} items before checking (${missing} left). You can still continue and return later.`;return;}
    S.checked[id]=true;refresh(`[data-c-check="${id}"]`);app.querySelector('#results-'+id)?.scrollIntoView({block:'nearest',behavior:'instant'});
  });
  app.addEventListener('click',event=>{const b=event.target.closest('button'),root=b?.closest('.continuation');if(!root)return;
    if(b.dataset.cPane){remember();S.panes[root.dataset.cScreen]=b.dataset.cPane;root.querySelector('.c-workbench').dataset.cView=b.dataset.cPane;root.querySelectorAll('[data-c-pane]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.cPane===b.dataset.cPane)));afterPaneSwitch(root);save();}
    if(b.dataset.cParagraph!==undefined){const pane=root.querySelector('.c-passage-pane'),target=pane.querySelectorAll('.c-paragraph')[Number(b.dataset.cParagraph)];pane.scrollTop+=target.getBoundingClientRect().top-pane.getBoundingClientRect().top-12;remember();save();}
    if(b.dataset.cUnsure){const input=root.querySelector('#'+b.dataset.cUnsure);input.value='Not sure';fieldChange(input);}
    if(b.dataset.cMark!==undefined){const id=b.dataset.cMark;S.marked[id]=!S.marked[id];b.setAttribute('aria-pressed',String(!!S.marked[id]));save();}
    if(b.dataset.cProgress){const id=b.dataset.cProgress;
      if(id==='ev-reasoning'&&!value(tasks['ev-summary'],0)){b.parentElement.querySelector('.c-support-notice').textContent='Choose the Paragraph A summary first, or continue and return to this support later.';return;}
      if(id==='football-unpack'&&!Object.values(S.marked).some(Boolean)&&!String(S.notes['football-meaning']||'').trim()){b.parentElement.querySelector('.c-support-notice').textContent='Tap a phrase you want to unpack or try a simpler meaning first. You can also continue and return later.';return;}
      S.progress[id]=(S.progress[id]||0)+1;refresh(`[data-c-progress="${id}"], [data-c-reset="${id}"]`);
    }
    if(b.dataset.cReset){S.progress[b.dataset.cReset]=0;refresh(`[data-c-progress="${b.dataset.cReset}"]`);}
  });
  function afterPaneSwitch(root){const name=S.panes[root.dataset.cScreen];const pane=root.querySelector(`[data-c-scroll="${name}"]`);if(pane)pane.scrollTop=S.positions[root.dataset.cScreen+'-'+name]||0;}
  window.addEventListener('pagehide',()=>{remember();save();});
  return {screens:continuationStages.map(stage=>({group:stage.group,title:stage.title,id:stage.id,body:()=>render(stage)})),afterRender,remember};
}
