import {audioComponent} from './audio-component.js';
import {audioLibrary} from '../../content/speaking/audio-library.js';
import {repairs} from '../../content/speaking/notice-and-practise.js';
import {borrowed,shadowPhrases,languageTasks,transferTopics,transferActions,worked,finalReflection} from '../../content/speaking/sound-and-language.js';

export function createSoundPractice({state,save,choices,feedback,esc,app}) {
  const screens=[];
  const add=(label,title,body,next='Continue')=>screens.push({section:8,label,title,body,next});
  const help=(label,body)=>`<details class="help-card"><summary>${label}</summary>${body}</details>`;
  const selected=id=>(state.answers[id]||[])[0];
  const steps=['Listen','Listen and read','Shadow','Use your own voice'];
  const shadowStep=i=>Math.max(0,Math.min(3,state.shadowSteps?.[i]||0));
  function shadowPanel(i){
    const step=shadowStep(i),a=audioLibrary.shadow[i];
    const text=`<p class="transcript">“${esc(a.text)}”</p>`;
    return `<p class="eyebrow">Step ${step+1} — ${steps[step]}</p>`+[
      '<p>Listen once.<br>Don’t speak yet.</p>',
      text+'<p>Where does the voice move?<br>Which words sound important?</p>',
      text+'<p>Play it again.<br>Speak with the recording.</p><p>Try to copy:</p><ul><li>rhythm</li><li>stress</li><li>intonation</li></ul>',
      '<p>Now say the sentence again without the recording.</p><p>Keep ONE thing you borrowed.</p>'+choices('borrowed-'+i,'What did you borrow?',borrowed)
    ][step];
  }
  function shadowScreen(i){
    const a=audioLibrary.shadow[i];
    return audioComponent({...a,speeds:[0.8,1]},esc)+`<div class="shadow-steps" role="group" aria-label="Practice steps">${steps.map((name,n)=>`<button data-shadow="${i}" data-step="${n}" aria-pressed="${n===shadowStep(i)}">${n+1}. ${name}</button>`).join('')}</div><section id="shadow-panel-${i}" class="shadow-panel" tabindex="-1" aria-live="polite">${shadowPanel(i)}</section>`;
  }
  add('Borrow something. Keep what helps.','Try on the sound',()=>'<p>You can borrow the sound of another speaker.</p><p>Listen.<br>Copy the rhythm and intonation.<br>Then use your own voice again.</p><aside class="research-box" aria-label="Why are we doing this?"><h2>WHY ARE WE DOING THIS?</h2><p>Research on shadowing suggests that listening and speaking with a model can help with fluency, rhythm, intonation and how easy speech is to understand.</p><p>You do not need to lose your accent.</p><p>Try the model, then keep only what helps you.</p></aside>');
  // TODO: Add verified shadowing research references when a citation pattern is introduced.
  audioLibrary.shadow.forEach((a,i)=>add(a.label,'Try on the sound',()=>shadowScreen(i)));
  add('Useful phrases','Try on the language',()=>choices('shadow-phrase','Choose ONE phrase.',shadowPhrases)+'<div class="try-prompt"><p>Make it true for you.</p><p>Say it aloud.</p></div>');
  add('Listen · Notice · Try','Try on the language',()=>'<p>You do not need ‘impressive’ vocabulary.</p><p>Try a useful phrase.<br>Change it.<br>Make it yours.</p><p>Listen for useful phrases, real observations and small details.</p>');
  function taskFeedback(i){
    const task=languageTasks[i];
    const correct=i===1?[0,1,2].every(n=>selected('food-order-'+n)===n):((state.answers['language-'+i]||[]).length===task.correct.length&&task.correct.every(n=>(state.answers['language-'+i]||[]).includes(n)));
    return `<p>${correct?'That’s right.':'Listen for this:'}</p><p>${task.feedback}</p>`;
  }
  function foodSequence(){
    return `<fieldset><legend>${languageTasks[1].question}</legend><p class="hint">Choose 1, 2 or 3 for each step.</p>${[2,0,1].map(n=>`<label class="order-label" for="food-order-${n}">${languageTasks[1].stages[n]}</label><select name="food-order-${n}" id="food-order-${n}"><option value="">Choose its place</option>${[0,1,2].map(v=>`<option value="${v}" ${selected('food-order-'+n)===v?'selected':''}>${v+1} — ${['First','Next','Last'][v]}</option>`).join('')}</select>`).join('')}</fieldset>`;
  }
  audioLibrary.language.forEach((a,i)=>{
    const t=languageTasks[i];
    add(a.label,'Listen and notice',()=>audioComponent({...a,transcript:`<p class="transcript">“${esc(a.text)}”</p>`,transcriptOpen:true},esc)+(i===1?foodSequence():choices('language-'+i,t.question,t.options,t.multi))+'<button data-language-check="'+i+'">Check answer'+(t.multi?'s':'')+'</button>'+feedback(state.checked['language-'+i]?taskFeedback(i):'','language-feedback'));
    add(a.label,'Make it personal',()=>
      (t.chunks?help('Useful language',t.chunks.map(c=>`<p>“${esc(c)}”</p>`).join('')):'')+
      (t.contrast?`<p>${t.contrast}</p>`:'')+
      `<div class="try-prompt"><p>${t.prompt}</p><p>Say it aloud.</p></div>`+
      (t.frame?help('Optional · A way to start',`<p>“${t.frame}”</p>`):''));
  });
  add('Your own life','Make it yours',()=>'<p>Now stop copying.</p><p>Use your own life.</p>'+choices('transfer-topic','Choose ONE topic.',transferTopics)+choices('transfer-action','Choose ONE thing to try:',transferActions)+'<div class="try-prompt"><p>Record a 20–30 second answer.</p><p>Use your phone’s voice recorder.</p></div>','I’ve recorded it');
  function nextRepair(){const i=selected('transfer-repair');return i===undefined?'':`<p class="preserve-lines">${esc(repairs[i][1])}</p>`;}
  add('Listen to yourself','What worked?',()=>'<p>Listen once.</p>'+choices('transfer-worked','What worked?',worked,true));
  add('One small change','What would you change next time?',()=>help('Help · Choose one repair',choices('transfer-repair','What would you change next time?',repairs.map(r=>r[0])))+feedback(nextRepair(),'transfer-repair-feedback'));
  function reflection(){return choices('final-reflection','Choose up to TWO.',finalReflection,true).replace('Choose any that fit.','Choose up to TWO. You can also continue.')+feedback('','reflection-feedback');}
  app.addEventListener('click',e=>{
    const shadow=e.target.closest('[data-shadow]');
    if(shadow){
      const i=Number(shadow.dataset.shadow),step=Number(shadow.dataset.step);
      state.shadowSteps={...state.shadowSteps,[i]:step};save();
      if(step===3)document.getElementById(audioLibrary.shadow[i].id).pause();
      shadow.parentElement.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===shadow)));
      const panel=document.getElementById('shadow-panel-'+i);panel.innerHTML=shadowPanel(i);panel.focus({preventScroll:true});
    }
    const check=e.target.closest('[data-language-check]');
    if(check){const i=Number(check.dataset.languageCheck);state.checked['language-'+i]=true;save();document.getElementById('language-feedback').innerHTML=taskFeedback(i);}
  });
  app.addEventListener('change',e=>{
    const name=e.target.name;
    if(name==='transfer-repair')document.getElementById('transfer-repair-feedback').innerHTML=nextRepair();
    if(name==='final-reflection'&&(state.answers[name]||[]).length>2){
      e.target.checked=false;
      state.answers[name]=state.answers[name].filter(n=>n!==Number(e.target.value));save();
      document.getElementById('reflection-feedback').textContent='Choose up to TWO. Uncheck one to choose another.';
    }
    if(name==='final-reflection'&&(state.answers[name]||[]).length<2)document.getElementById('reflection-feedback').textContent='';
    const i=name?.startsWith('food-order-')?1:name?.startsWith('language-')?Number(name.split('-')[1]):undefined;
    if(i!==undefined&&state.checked['language-'+i])document.getElementById('language-feedback').innerHTML=taskFeedback(i);
  });
  return {screens,reflection};
}
