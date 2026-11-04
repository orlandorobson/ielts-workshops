import { shuffleOptionIds } from './randomise.js';

export function paragraphPool(models) {
  return models.flatMap(model => {
    const parts = model.essay.split(/\n\n+/);
    return parts.map((text,index) => ({
      id: `${model.model_id}-${index}`, text, student: model.student,
      answer: index === 0 ? 'Introduction' : index === parts.length-1 ? 'Conclusion' : 'Paragraph',
    }));
  });
}

export function mountStructurePractice(host, models) {
  const pool = paragraphPool(models);
  const byId = new Map(pool.map(item=>[item.id,item]));
  const key = 'ielts-task2-structure-recognition-v1';
  const categories = ['Introduction','Paragraph','Conclusion'];
  let attempt;
  try { attempt = JSON.parse(localStorage.getItem(key)); } catch {}
  if (!Array.isArray(attempt?.ids) || attempt.ids.length!==6 || new Set(attempt.ids).size!==6 || !attempt.ids.every(id=>byId.has(id))) attempt = null;
  function save() { try {localStorage.setItem(key,JSON.stringify(attempt));} catch {} }
  function fresh() {
    // Uniform sampling without replacement from the entire bank. No category quotas,
    // fixed alternation, sorted answers or forced difference from the previous set.
    attempt = {ids:shuffleOptionIds(pool.map(p=>p.id)).slice(0,6), answers:{}, options:{}};
    save(); render();
  }
  const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  function render() {
    attempt.answers ||= {}; attempt.options ||= {};
    host.innerHTML = `<h2 id="recognition-title">Which part of an essay is this?</h2><p>Read each extract. Choose Introduction, Paragraph or Conclusion.</p><p class="model-provenance">Six randomly chosen extracts from the fictional learner answers. You can change your choices.</p><div class="structure-paragraphs">${attempt.ids.map((id,i)=>{
      const item=byId.get(id);
      const options=attempt.options[id];
      if(!Array.isArray(options) || options.length!==3 || new Set(options).size!==3 || !options.every(x=>categories.includes(x))) attempt.options[id]=shuffleOptionIds(categories);
      const selected=categories.includes(attempt.answers[id])?attempt.answers[id]:'';
      return `<article class="structure-paragraph"><header class="structure-paragraph-header"><h3>${i+1} · ${escape(item.student)}</h3><label class="paragraph-classifier"><span class="visually-hidden">Choose the part for extract ${i+1}</span><select data-extract="${id}" aria-label="Choose the part for extract ${i+1}" aria-describedby="feedback-${i}"><option value="">Choose a part</option>${attempt.options[id].map(value=>`<option ${selected===value?'selected':''}>${value}</option>`).join('')}</select></label></header><p class="student-paragraph">${escape(item.text)}</p><p id="feedback-${i}" class="structure-feedback" role="status" ${selected?'':'hidden'}></p></article>`;
    }).join('')}</div><button type="button" class="secondary-button" id="new-paragraphs">Try six new extracts</button>`;
    function feedback(select) {
      const item=byId.get(select.dataset.extract), node=document.getElementById(select.getAttribute('aria-describedby'));
      const explanation={Introduction:'It introduces the topic and sets out the answer.',Paragraph:'It develops ideas in the main part of the essay.',Conclusion:'It brings the answer together at the end.'}[item.answer];
      node.hidden=!select.value;
      node.textContent=select.value ? `${select.value===item.answer?'Yes.':`This is ${item.answer === 'Introduction'?'an':'a'} ${item.answer.toLowerCase()}.`} ${explanation}` : '';
    }
    host.querySelectorAll('select').forEach(select=>{
      feedback(select);
      select.onchange=()=>{attempt.answers[select.dataset.extract]=select.value;save();feedback(select);};
    });
    host.querySelector('#new-paragraphs').onclick=()=>{fresh();host.querySelector('h2').setAttribute('tabindex','-1');host.querySelector('h2').focus();};
    save();
  }
  if(attempt) render(); else fresh();
}
