import { mountStructurePractice } from './task-2-structure.js?v=recognition-1';
const app = document.querySelector('#app');
const escape = (s = '') => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const paragraphs = s => s.split(/\n\n+/).map(p=>`<p>${escape(p)}</p>`).join('');
const base = new URL('../../content/writing/task-2-canonical/', import.meta.url);
document.body.classList.add('task2-start');
document.querySelector('.workshop-options')?.remove();
const layout = location.hash === '#layout';
document.querySelector('.journey-nav').innerHTML = `<ol><li><a href="#explore" ${!layout?'aria-current="page"':''}>1 · Question types</a></li><li><a href="#layout" ${layout?'aria-current="page"':''}>2 · Essay layout</a></li><li><a href="#understand">Continue the workshop →</a></li></ol>`;
if (layout) {
  app.innerHTML = `<header class="unit-header"><p class="eyebrow">02 · Essay layout</p><h1>Four clear parts.</h1><p class="lead">A simple way to organise your answer.</p></header><figure class="essay-layout"><img src="assets/task-2-answer-structure.png" width="1024" height="1280" alt="Your Task 2 essay. Introduction: introduce the topic and answer the question. Paragraph 1: develop your first main idea. Paragraph 2: develop your second main idea. Conclusion: bring your answer together."><figcaption>We recommend this as a starting point. The question guides what each paragraph does. Some answers use more paragraphs.</figcaption></figure><section id="structure-practice" aria-labelledby="recognition-title"><p role="status">Loading extracts…</p></section><nav class="unit-navigation" aria-label="Page navigation"><a href="#explore">← Question types</a><a class="primary-button" href="#understand">Continue the workshop →</a></nav>`;
  try {
    const response = await fetch(new URL('task-2-complete-learner-model-bank.json',base));
    if(!response.ok) throw Error('Model bank unavailable');
    const data = await response.json();
    if(data.models.length!==9) throw Error('Incomplete model bank');
    mountStructurePractice(document.querySelector('#structure-practice'),data.models);
  } catch(e) {
    document.querySelector('#structure-practice').innerHTML='<p>The extracts could not load. Reload to try again. You can still continue the workshop.</p>';
    console.error(e);
  }
} else {
  app.innerHTML = '<p role="status">Loading the question and model bank…</p>';
  try {
    const [bank, models] = await Promise.all(['task-2-workshop-question-bank-v1.0.json','task-2-complete-learner-model-bank.json'].map(async name => {const res=await fetch(new URL(name,base));if(!res.ok)throw Error(name);return res.json();}));
    // The accepted Aisha model stores its approved comments as Markdown only.
    for (const m of models.models) if (!m.feedback) {
      const comments = [...m.feedback_markdown.matchAll(/\*\*[^\n]+\*\*\n+([\s\S]*?)(?=\n\n\*\*|$)/g)].map(match=>match[1]);
      m.feedback = Object.fromEntries(['TR','CC','LR','GRA'].map((key,i)=>[key,comments[i]]));
    }
    if (bank.questions.length !== 9 || models.models.length !== 9) throw Error('Incomplete bank');
    for (const q of bank.questions) {
      const m=models.models.find(m=>m.question_id===q.id);
      if(!m || m.prompt!==q.prompt || !m.essay || !['TR','CC','LR','GRA'].every(k=>m.feedback[k] && Number.isFinite(m.scores[k]))) throw Error('Question/model mismatch');
    }
    let selected;
    try { selected = localStorage.getItem('ielts-task2-explorer-selection-v1'); } catch {}
    if (!bank.questions.some(q=>q.id===selected)) selected=bank.questions[0].id;
    const labels=['Agree or disagree','Both views and opinion','Advantages and disadvantages','Do advantages outweigh disadvantages?','Problems and solutions','Reasons and evaluation','Causes and solutions','Causes and effects','Positive or negative development'];
    app.innerHTML = `<header class="unit-header"><p class="eyebrow">01 · Explore Writing Task 2</p><h1>Nine ways to ask.<br>A complete answer for each.</h1><p class="lead">Choose a question type. Read the question, a learner answer and its feedback.</p></header><div class="question-explorer"><div class="question-selector" role="group" aria-label="Nine question types">${bank.questions.map((q,i)=>`<button type="button" data-question-id="${q.id}" aria-pressed="false"><span class="question-number">${String(i+1).padStart(2,'0')}</span><strong>${labels[i]}</strong><small>${escape(q.title.split(': ').slice(1).join(': '))}</small></button>`).join('')}</div><section class="question-focus" aria-labelledby="question-title"></section></div><nav class="unit-navigation" aria-label="Page navigation"><span></span><a class="primary-button" href="#layout">Next: essay layout →</a></nav>`;
    function show(id, focus=false) {
      const q=bank.questions.find(q=>q.id===id), m=models.models.find(m=>m.question_id===id);
      document.querySelectorAll('[data-question-id]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.questionId===id)));
      document.querySelector('.question-focus').innerHTML=`<p class="eyebrow">${escape(q.id)} · ${labels[bank.questions.indexOf(q)]}</p><h2 id="question-title" tabindex="-1">${escape(q.title.split(': ').slice(1).join(': '))}</h2><div class="approved-question">${paragraphs(q.prompt)}</div><section class="learner-answer" aria-labelledby="model-title"><header><h3 id="model-title">${escape(m.student)}’s answer</h3><p>Fictional learner · Estimated Task 2 Band ${m.estimated_task_band.toFixed(1)}</p></header><div class="learner-writing">${paragraphs(m.essay)}</div></section><details class="examiner-feedback"><summary>See examiner-style feedback</summary><p>Provisional teaching estimates, not official IELTS marks or a full Writing-test result.</p>${[['TR','Task Response'],['CC','Coherence and Cohesion'],['LR','Lexical Resource'],['GRA','Grammatical Range and Accuracy']].map(([key,label])=>`<section><h4>${label} <span>· ${m.scores[key]}</span></h4><p>${escape(m.feedback[key])}</p></section>`).join('')}</details><p class="model-provenance">Original IELTS-style question, approved workshop bank v${escape(bank.version)}. ${escape(m.student)} and this deliberately imperfect response are fictional teaching constructions informed by learner patterns. Other valid answers are possible.</p><p class="model-provenance">Model ${escape(m.model_id)} · v${escape(m.version)} · <a href="${new URL('task-2-complete-learner-model-bank.md',base)}">Model bank and assessment notes</a> · <a href="${new URL('ielts-writing-task-2-canonical-workshop-questions.md',base)}">Question sources</a></p>`;
      try {localStorage.setItem('ielts-task2-explorer-selection-v1',id);} catch {}
      if(focus) document.querySelector('#question-title').focus({preventScroll:true});
    }
    document.querySelectorAll('[data-question-id]').forEach(b=>b.onclick=()=>show(b.dataset.questionId,true));
    show(selected);
  } catch (e) {
    app.innerHTML = `<h1>The model bank could not load.</h1><p>Please reload to try again. You can still <a href="#layout">see the essay layout</a> or <a href="#understand">continue the workshop</a>.</p>`;
    console.error('Task 2 explorer:',e);
  }
}
