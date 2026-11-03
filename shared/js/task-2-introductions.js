import { task2Introductions as content, validChunkOrder, successfulChunkOrder } from '../../content/writing/task-2-introductions.js?v=own-words-4';
import { levelMarkup } from './task-2-ui.js?v=quality-check-3';
const escape = (value='') => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const badge = level => `<span role="img" aria-label="${level}" class="intro-badge">${levelMarkup(level,false,true)}</span>`;
const reactions = id => `<div class="intro-reactions" role="group" aria-label="Judge introduction ${id}">${['cool','spicy','splat'].map(level=>`<button class="intro-reaction" type="button" data-intro-vote="${id}" data-level="${level}" aria-label="${level[0].toUpperCase()+level.slice(1)}" title="${level[0].toUpperCase()+level.slice(1)}" aria-pressed="false">${levelMarkup(level,false,true)}</button>`).join('')}</div>`;
function judgementMarkup(item,number) {
  return `<article class="intro-judgement" data-intro-item="${item.id}"><p><strong>${number}.</strong> ${escape(item.text)}</p>${reactions(item.id)}<p class="intro-vote-feedback" role="status"></p></article>`;
}
function builderMarkup(level) {
  return `<section class="intro-builder" data-builder="${level}" aria-labelledby="intro-${level}-heading"><h3 id="intro-${level}-heading">${badge(level)} Build a ${level==='cool'?'Cool':'Spicy'} introduction</h3><p>Use the arrows to put the groups of words in order.</p><p class="chunk-preview" aria-label="Your assembled introduction"></p><ol class="intro-chunks"></ol><button type="button" class="secondary-button" data-check-order>Check my order</button><p class="chunk-feedback" role="status"></p><details><summary>See one clear order</summary><p>${escape(content.builders[level].chunks.map(chunk=>chunk.text).join(' '))}</p><p>This is one way to start. You can write it in your own way.</p></details></section>`;
}
export function introductionMarkup(state, question) {
  return `<section class="workshop-section introductions-section" id="introductions"><p class="eyebrow">03 · Introduction</p><h2>Write it in your own words.</h2><p class="lead">Read the question. Say the same idea in your own way.</p><p><strong>Why plan first?</strong> Your notes help you decide what to say. Then your introduction can give the reader a clear start. You are only planning the main paragraphs now. When you write your essay, start with the introduction.</p><p>You can keep useful words, such as “adults” and “online courses”. You do not need to change every word.</p>${question(content.questionId)}
<section class="intro-stage" id="intro-see"><h3>Compare these starts</h3><p>Read the Cool start, then Spicy and Splat. Is the meaning clear? Does the writer answer both questions?</p><div class="intro-demonstrations">${content.demonstrations.map(item=>`<article class="intro-demonstration"><p>${escape(item.text)}</p>${badge(item.level)}<p class="intro-note"><strong>${item.level[0].toUpperCase()+item.level.slice(1)}:</strong> ${escape(item.note)}</p></article>`).join('')}</div></section>
<section class="intro-stage" id="intro-demand"><h3>Use your plan to start</h3><p>Look at your notes.</p><p><strong>Paragraph 1 — Why?</strong><br>Why do adults choose online courses? A few words in your plan are enough.</p><p><strong>Paragraph 2 — Good, bad or both?</strong><br>What do you think about this change? Note the main reason for your view.</p><p><strong>Now start your introduction.</strong><br>Tell the reader about online courses. Use your plan to give a short answer to both questions. Save the details for later.</p><details><summary>What about a different question?</summary><p>Does it ask what you think, if you agree, or which side matters more? Say what you think near the start.</p><p>Does it ask for reasons, problems or solutions? Tell the reader what you will explain.</p>${question('WT2-W03')}<p>Here, write about the good points and the problems. You do not need to say “I agree”.</p><p>Try a start like this:<br>“Using cards and phones can make payments easier, but it can also create difficulties.”</p></details></section>
<section class="intro-stage" id="intro-decide"><h3>Which starts answer the question?</h3><p>Choose a picture. Read why it works or what to change.</p>${content.judgements.filter(item=>!item.questionId).map((item,index)=>judgementMarkup(item,index+1)).join('')}<details id="intro-more"><summary>Try other questions · optional</summary><h4>Do I need to say “I agree” here?</h4>${question('WT2-W03')}<p>This question asks for good points and problems. Look for both.</p>${content.judgements.filter(item=>item.questionId==='WT2-W03').map((item,index)=>judgementMarkup(item,index+1)).join('')}<h4>Here, the question asks if you agree.</h4>${question('WT2-W01')}<p>Look for the writer’s answer.</p>${content.judgements.filter(item=>item.questionId==='WT2-W01').map((item,index)=>judgementMarkup(item,index+1)).join('')}</details><details class="intro-repair"><summary>Help this writer answer the question</summary><label for="intro-repair">Why do adults choose online courses? Is the change good or bad? Help the writer answer both.</label><textarea id="intro-repair" rows="3">${escape(state.introActivities?.repair)}</textarea><details><summary>See one way to change it</summary><p>Adults often choose online courses because they can study at a convenient time. I see this as a positive change because it makes learning possible for more people.</p><p>Now we know why adults choose online courses and what the writer thinks. Your answer can be different.</p></details></details></section>
<section class="intro-stage" id="intro-cool">${builderMarkup('cool')}<details class="optional-spicy" id="intro-spicy"><summary>${badge('spicy')} Try a Spicy build · optional</summary><p>Cool is enough. Try this if you want to show a problem and a good point together.</p>${builderMarkup('spicy')}</details></section>
<section class="intro-stage" id="intro-write"><h3>Now write it in your own words</h3><div class="intro-writing-layout"><aside class="intro-plan"><h4>Your two jobs</h4><p>Why do adults choose online courses? Is this change good, bad or both?</p><h4>Your plan</h4><p><strong>Why?</strong> <span data-intro-plan="body1">${escape(state.plan.body1)||'A few words are enough. You can start writing now.'}</span></p><p><strong>Positive or negative?</strong> <span data-intro-plan="body2">${escape(state.plan.body2)||'Is the change good, bad or both? Add a reason.'}</span></p><p><strong>My view:</strong> <span data-intro-plan="view">${escape([state.plan.view,state.plan.explanation].filter(Boolean).join(' — '))||'What do you think? You can change your mind as you write.'}</span></p><a href="#my-plan">Change my plan</a></aside><div><label for="o3-draft"><strong>Your introduction — in your own words</strong></label><textarea id="o3-draft" class="writing-area" rows="6">${escape(state.introduction)}</textarea><p class="intro-writing-meta"><span id="intro-word-count"></span> · <span id="intro-save-status">Saved on this device.</span></p><button type="button" id="intro-retry-save" hidden>Retry saving</button> <button type="button" id="intro-download-work">Download my work</button><details><summary>A small hint</summary><p>Tell the reader about adults studying online in your own words. Use your plan to say why they choose it and what you think. Keep it short. You can improve it later.</p></details><details><summary>A phrase if you need one</summary><p>“Adults often choose online courses because…”<br>“I see this as a mainly positive/negative change…”<br>“Although this offers…, …”</p><p>Choose a phrase that helps you say what you think.</p></details><details><summary>See one example</summary><p>${escape(content.demonstrations[0].text)}</p><p>This writer thinks the change is mostly good. You can think it is bad, or see both sides. Explain your view as you write your essay.</p></details></div></div><p><a href="#paragraphs" class="primary-button">Write the main paragraphs →</a></p><p class="choice-note">You can return to your introduction and change it as you write.</p></section></section>`;
}
export function bindIntroductions(state, changed) {
  state.introActivities ||= {};
  state.introActivities.votes ||= {};
  state.introActivities.builders ||= {};
  function showVote(item) {
    const card=document.querySelector(`[data-intro-item="${item.id}"]`);
    const value=state.introActivities.votes[item.id];
    card.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(value===button.dataset.level)));
    card.querySelector('.intro-vote-feedback').textContent=value ? `${value===item.level?'Yes.':'Look again.'} ${item.level[0].toUpperCase()+item.level.slice(1)}: ${item.feedback} You can change your choice.` : '';
  }
  content.judgements.forEach(item=>{
    showVote(item);
    document.querySelectorAll(`[data-intro-vote="${item.id}"]`).forEach(button=>button.addEventListener('click',()=>{state.introActivities.votes[item.id]=button.dataset.level;showVote(item);changed('introActivities');}));
  });
  for(const [level,builder] of Object.entries(content.builders)) {
    const root=document.querySelector(`[data-builder="${level}"]`);
    let saved=state.introActivities.builders[level];
    if(!saved||!validChunkOrder(saved.order,builder)) saved=state.introActivities.builders[level]={order:[...builder.start],checked:false};
    const list=root.querySelector('ol');
    const byId=new Map(builder.chunks.map(chunk=>[chunk.id,chunk.text]));
    function renderList(focus) {
      list.innerHTML=saved.order.map((id,index)=>`<li data-chunk="${id}"><span>${escape(byId.get(id))}</span><span class="chunk-controls"><button type="button" data-move="up" data-id="${id}" aria-label="Move chunk ${index+1} earlier" ${index===0?'disabled':''}>↑</button><button type="button" data-move="down" data-id="${id}" aria-label="Move chunk ${index+1} later" ${index===saved.order.length-1?'disabled':''}>↓</button></span></li>`).join('');
      root.querySelector('.chunk-preview').textContent=saved.order.map(id=>byId.get(id)).join(' ');
      root.querySelector('.chunk-feedback').textContent=saved.checked ? (successfulChunkOrder(saved.order,builder) ? `This works. ${builder.feedback}` : 'Not yet. Which words finish each sentence? Move the groups and try again. You can also look at one clear order.') : '';
      if(focus) {
        const target=list.querySelector(`[data-id="${focus.id}"][data-move="${focus.direction}"]:not(:disabled)`)||list.querySelector(`[data-id="${focus.id}"]:not(:disabled)`);
        target?.focus({preventScroll:true});
      }
    }
    list.addEventListener('click',event=>{
      const button=event.target.closest('button[data-move]');if(!button)return;
      const index=saved.order.indexOf(button.dataset.id);const next=index+(button.dataset.move==='up'?-1:1);
      if(next<0||next>=saved.order.length)return;
      [saved.order[index],saved.order[next]]=[saved.order[next],saved.order[index]];saved.checked=false;
      renderList({id:button.dataset.id,direction:button.dataset.move});changed('introActivities');
    });
    root.querySelector('[data-check-order]').addEventListener('click',()=>{saved.checked=true;root.querySelector('.chunk-feedback').textContent=successfulChunkOrder(saved.order,builder)?`This works. ${builder.feedback}`:'Not yet. Which words finish each sentence? Move the groups and try again. You can also look at one clear order.';changed('introActivities');});
    renderList();
  }
  document.querySelector('#intro-repair').addEventListener('input',event=>{state.introActivities.repair=event.target.value;changed('introActivities');});
  const draft=document.querySelector('#o3-draft');
  const count=()=>{document.querySelector('#intro-word-count').textContent=`${draft.value.trim()?draft.value.trim().split(/\s+/).length:0} words`;};
  count();draft.addEventListener('input',()=>{state.introduction=draft.value;count();changed('introduction');});
}

export function updateIntroPlan(state) {
  document.querySelector('[data-intro-plan="body1"]').textContent=state.plan.body1||'A few words are enough. You can start writing now.';
  document.querySelector('[data-intro-plan="body2"]').textContent=state.plan.body2||'Is the change good, bad or both? Add a reason.';
  document.querySelector('[data-intro-plan="view"]').textContent=[state.plan.view,state.plan.explanation].filter(Boolean).join(' — ')||'What do you think? You can change your mind as you write.';
}
