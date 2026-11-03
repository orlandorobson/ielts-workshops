const assetBase = new URL('../../writing/task-1/academic/assets/', import.meta.url);
const levels = {
  cool: ['Cool', 'level-cool-lollipop.png', 'Clear and answers the question.'],
  spicy: ['Spicy', 'level-spicy-chilli.png', 'Another clear way to say it. Optional.'],
  splat: ['Splat', 'level-splat-tomato.png', 'One part needs a change.'],
};
export function levelMarkup(level, description = false, imageOnly = false) {
  const [label, file, text] = levels[level];
  return `<span class="level-reaction level-reaction--${level}"><span class="level-reaction__bubble"><img src="${new URL(file, assetBase)}" alt="" width="26" height="26"></span>${imageOnly ? '' : `<span class="level-reaction__copy"><strong>${label}</strong>${description ? `<small>${text}</small>` : ''}</span>`}</span>`;
}
export function levelKeyMarkup() {
  return `<section class="level-key" aria-label="Cool, Spicy and Splat meanings">${Object.keys(levels).map(level => `<div>${levelMarkup(level,true)}</div>`).join('')}</section>`;
}
export function mountTask2Navigation({current, onNavigate} = {}) {
  const root = new URL('../../writing/task-2/', import.meta.url);
  const groups = [
    ['Understand the question', [['understand','Understand the question', '#understand'],['jobs','Your question: online courses','#jobs']]],
    ['Plan the structure', [['plan','Compare plans','#plan'],['my-plan','Your short plan','#my-plan']]],
    ['Introduction', [['introductions','See what works','#introductions'],['intro-demand','Use your plan to start','#intro-demand'],['intro-decide','Judge introductions','#intro-decide'],['intro-cool','Build a Cool introduction','#intro-cool'],['intro-spicy','Optional Spicy build','#intro-spicy'],['intro-write','Write your introduction','#intro-write']]],
    ['Main paragraphs', [['paragraphs','See how a paragraph works','#paragraphs'],['paragraph-check','Cool or Splat paragraphs','#paragraph-check'],['paragraph-repair','Add a useful example','#paragraph-repair'],['paragraph-one','Write paragraph 1','#paragraph-one'],['paragraph-two','Write paragraph 2','#paragraph-two']]],
    ['Conclusion', [['conclusions','See how an ending works','#conclusions'],['conclusion-check','Cool, Spicy or Splat endings','#conclusion-check'],['conclusion-write','Write my conclusion','#conclusion-write']]],
  ];
  const section = String(current).startsWith('conclusion') ? 4 : String(current).startsWith('paragraph') ? 3 : ['understand','jobs'].includes(current) ? 0 : ['plan','my-plan'].includes(current) ? 1 : ['introductions','intro-demand','intro-decide','intro-cool','intro-spicy','intro-write','i1','i2','f1','f2','o3','end'].includes(current) ? 2 : 3;
  const nav = document.querySelector('.journey-nav');
  const reset = document.querySelector('#reset-progress');
  nav.innerHTML = `<ol>${groups.slice(0,5).map(([title,items],i) => `<li><a class="progress-button" data-section-index="${i}" ${section === i ? 'aria-current="step"' : ''} href="${new URL(items[0][2],root)}">${['Understand','Plan','Introduction','Paragraphs','Conclusion'][i]}</a></li>`).join('')}</ol><details class="activity-jump"><summary>Activities</summary><div class="activity-menu-panel"><label for="activity-jump">Choose an activity</label><select id="activity-jump">${groups.map(([title,items])=>`<optgroup label="${title}">${items.map(([id,label,path])=>`<option value="${id}" data-href="${new URL(path,root)}" ${id === current ? 'selected' : ''}>${label}</option>`).join('')}</optgroup>`).join('')}</select><a href="${new URL('#saved-work',root)}">Saved work and earlier drafts</a><a href="${new URL('submit/',root)}">Submit an answer</a></div></details>`;
  const wrapper = nav.querySelector('details');
  const select = nav.querySelector('select');
  if(reset) nav.querySelector('.activity-menu-panel').append(reset);
  select.addEventListener('change',()=>{wrapper.open=false; const option=select.selectedOptions[0]; onNavigate ? onNavigate(option.value,option.dataset.href) : location.assign(option.dataset.href);});
  nav.querySelectorAll('a[data-section-index]').forEach(link => link.addEventListener('click',event=>{
    if(!onNavigate || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();const id=groups[Number(link.dataset.sectionIndex)][1][0][0];onNavigate(id,link.href);
  }));
}
