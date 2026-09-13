import {audioComponent} from './audio-component.js';
import {audioLibrary} from '../../content/speaking/audio-library.js';
import {noticing,repairs,topics,missions,practiceQuestions} from '../../content/speaking/notice-and-practise.js';

// Shared patterns: expandable help, phrase choices, short research notes and practice prompts.
export function createExtension({state,save,choices,feedback,esc,app}) {
  const selected = id => (state.answers[id] || [])[0];
  const help = (title,body) => `<details class="help-card"><summary>${title}</summary>${body}</details>`;
  const paragraphs = text => `<p class="preserve-lines">${esc(text)}</p>`;
  const researchBox = text => `<aside class="research-box" aria-label="Why are we doing this?"><h2>WHY ARE WE DOING THIS?</h2>${paragraphs(text)}</aside>`;
  const phraseChoices = (id,phrases) => choices(id,'Choose ONE phrase.',phrases);
  const smallChangeOptions = ['The idea is complete.','There are fewer stops.','The language is more precise.','The grammar is much more complicated.'];
  const detailOptions = ['a specific place','a small detail','a contrast','very difficult vocabulary'];
  function correction(id,options,ending) {
    const answer=state.answers[id]||[];
    const right=answer.length===3&&[0,1,2].every(i=>answer.includes(i));
    return `<p>${right?'That’s right.':'Look for these changes:'}</p><ul>${options.slice(0,3).map(o=>`<li>${o}</li>`).join('')}</ul><p>${ending}</p>`;
  }
  function repairAction() {
    const i=selected('repair');
    return i===undefined?'':paragraphs(repairs[i][1])+(i===4?'<p>Weak / limited:<br>“Exercise is good after work.”</p><p>More precise:<br>“Exercise helps me unwind after work.”</p>':'');
  }
  function topicScreen(i) {
    const t=topics[i];
    let supports='';
    if(t.examples.length)supports+=help(i===0?'Help · Repair a phrase':'Optional · Real observations',t.examples.map(paragraphs).join(''));
    if(i===1)supports+=help('Help · Avenue','<p>A wide street or road, often with trees along it.</p><p>Use the word that really matches the place.</p>')+help('Optional · Monsoon climate','<p>A climate with a clear rainy or wet season caused by seasonal winds.</p><p>In Dhofar, the khareef is connected with the summer monsoon.</p>');
    return '<p>Choose ONE phrase. Say it aloud.</p>'+help('Useful language',phraseChoices('phrase-'+i,t.phrases))+supports+`<div class="try-prompt"><p>${t.prompt}</p><p>Say one sentence now.</p></div>`;
  }
  // Only a few task-specific phrases; never the whole bank under a question.
  const practiceLanguage=[
    topics[0].phrases.slice(0,3),
    ['I enjoy making _____.','It’s homemade.','I started cooking a few years ago.'],
    [topics[1].phrases[0],topics[1].phrases[6],topics[1].phrases[7]],
    ['I spend most of my free time with _____.','We usually get together for _____.','Whenever we get together, _____.'],
    ['We usually get together for _____.','It’s become a family tradition.','We usually have it during _____.'],
    [topics[3].phrases[0],topics[3].phrases[4],topics[3].phrases[3]],
    ['I prefer _____ because _____.','I usually feel more relaxed in the _____.'],
    ['I try to keep active.','It helps me relax.','It helps me unwind after work.']
  ];
  const attemptControls=['pauses','one sentence','one phrase','one detail','pronunciation','development'];
  function practiceBody() {
    const q=selected('practice-question');
    if(q===undefined)return '';
    return `<blockquote>${esc(practiceQuestions[q])}</blockquote>`+help('Useful language',practiceLanguage[q].map(p=>`<p>“${esc(p)}”</p>`).join(''))+`<p>Use your phone’s recorder.</p>`+[0,1,2].map(n=>help(`Attempt ${n+1}`,choices(`practice-${q}-${n}`,'What will you change this time?',attemptControls)+`<p class="try-prompt">${n===0?'Record your answer. Listen to it.':'Change ONE small thing. Record again. Listen for that change.'}</p>`)).join('');
  }
  const beforeCompare = [
    ['Listen for small changes',()=>audioComponent(audioLibrary.small,esc)+'<p>Better does not always sound very different.</p><p>Listen for ONE small change.</p><div class="noticing-grid">'+noticing.map(([name,p])=>`<article><h2>${name}</h2><p>${p}</p></article>`).join('')+'<div class="try-prompt"><p>Don’t ask: Was my English better?</p><p><strong>Ask: What changed?</strong></p></div>'],
    ['What changed?',()=>'<p class="eyebrow">Attempt 1</p><blockquote>“I like... um... going to the gym because... because it’s good and...”</blockquote><p class="eyebrow">Attempt 2</p><blockquote>“I like going to the gym because it helps me unwind after work.”</blockquote>'+choices('small-change','What changed?',smallChangeOptions,true)+'<button data-extension-check="small-change">Check answers</button>'+feedback(state.checked['small-change']?correction('small-change',smallChangeOptions,'Small changes matter. Listen for one change at a time.'):'','small-change-feedback')]
  ];
  const afterCompare = [
    ['What can I try?',()=>'<p>Choose ONE problem.<br>Try ONE small change.</p>'+help('Help · Choose a problem',choices('repair','Choose ONE problem.',repairs.map(r=>r[0])))+feedback(repairAction(),'repair-action')+'<p>If you still can’t hear a difference, ask a partner or teacher to listen for ONE thing.</p>'],
    ...topics.map((t,i)=>['Useful language · '+t.title,()=>topicScreen(i)]),
    ['Look closer',()=>'<p>You don’t need an impressive story.</p><p>Notice something real.</p><p class="hint">Optional · Try one idea when it fits your day.</p>'+missions.map(([name,text])=>help(name,paragraphs(text))).join('')],
    ['Help the listener see it',()=>audioComponent(audioLibrary.picture,esc)+'<p class="eyebrow">Answer A</p><p>“There is an old restaurant near my house. It is a good restaurant and the food is very nice. I like going there.”</p><p class="eyebrow">Answer B</p><p>“There’s this old restaurant at the end of my street. Everything about it looks a bit run-down, but they make this amazing beef stew. It’s usually full in the evening.”</p>'+choices('picture','Which place can you picture more clearly?',['A','B'])+choices('real-detail','What helps?',detailOptions,true)+'<button data-extension-check="real-detail">Check answers</button>'+feedback(state.checked['real-detail']?'<p>Answer B gives a clearer picture.</p>'+correction('real-detail',detailOptions,'You don’t need a big story. Sometimes ONE real detail is enough.'):'','real-detail-feedback')],
    ['Use a real detail',()=>'<div class="try-prompt"><p>Think about your neighbourhood.</p><p>Choose ONE real detail.</p><p>Help us see it.</p><p>Say it aloud.</p></div>'+researchBox('Research in psychology and language learning shows that concrete information is often easier to picture and remember than abstract information.\n\nSpecific details can help a listener build a clearer picture of what you mean.\n\nYou do not need a big story. One useful detail can be enough.')],
    // TODO: Add verified psychology/language-learning source references when a citation pattern is introduced. No invented citations or IELTS score claims.
    ['Try three times',()=>'<p class="eyebrow">Optional practice</p><p>Choose one question.</p><p>Record your answer three times.<br>Each time, change ONE small thing.</p>'+help('Choose a question',choices('practice-question','Choose one question.',practiceQuestions))+`<div id="practice-body">${practiceBody()}</div>`+help('Help · I can’t hear much change.','<p>That can happen.</p><p>Make the change smaller.</p><p>Listen for ONE thing, not the whole answer.</p><p>Too many stops?<br>Finish one sentence calmly.</p><p>Vocabulary sounds the same?<br>Change one phrase.</p><p>Still not sure?<br>Ask someone to listen for one thing.</p><p>You may have improved something you were not listening for.</p>')]
  ];
  app.addEventListener('change',e=>{
    const name=e.target.name;
    // Main form handler saves the choice before this handler updates its support.
    if(name==='repair')document.querySelector('#repair-action').innerHTML=repairAction();
    if(name==='practice-question')document.querySelector('#practice-body').innerHTML=practiceBody();
    if((name==='small-change'||name==='real-detail')&&state.checked[name]){
      const options=name==='small-change'?smallChangeOptions:detailOptions;
      document.querySelector('#'+name+'-feedback').innerHTML=correction(name,options,name==='small-change'?'Small changes matter. Listen for one change at a time.':'You don’t need a big story. Sometimes ONE real detail is enough.');
    }
  });
  app.addEventListener('click',e=>{
    const id=e.target.closest('[data-extension-check]')?.dataset.extensionCheck;
    if(!id)return;
    state.checked[id]=true;save();
    document.querySelector('#'+id+'-feedback').innerHTML=(id==='real-detail'?'<p>Answer B gives a clearer picture.</p>':'')+correction(id,id==='small-change'?smallChangeOptions:detailOptions,id==='small-change'?'Small changes matter. Listen for one change at a time.':'You don’t need a big story. Sometimes ONE real detail is enough.');
  });
  return {beforeCompare,afterCompare};
}
