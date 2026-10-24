// Shared behaviour for the approved Reading workspace; teaching data stays in its renderer.
const FONT_KEY='ielts-reading-workspace-passage-size';
const sizes=[16,18,21];
let size=18,heading=null,app,save,S,timer;
try{const saved=Number(sessionStorage.getItem(FONT_KEY));if(sizes.includes(saved))size=saved;}catch{}
const identity=root=>root?.dataset.readingScreen||root?.dataset.cScreen||root?.dataset.lScreen;
const panes=root=>root.querySelectorAll('.c-workbench > .c-pane');
const name=pane=>pane.classList.contains('c-passage-pane')?'passage':'task';
export function installWorkspace(options){
 app=options.app;save=options.save;
 const dict=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
 S=options.state.workspace=dict(options.state.workspace);
 S.panes=dict(S.panes);S.positions=dict(S.positions);
 for(const [key,value]of Object.entries(S.positions))if(typeof value!=='number'||!Number.isFinite(value)||value<0)delete S.positions[key];
 app.addEventListener('click',event=>{
  const button=event.target.closest('[data-workspace-pane]'),root=button?.closest('.reading-workspace');if(!root)return;
  rememberWorkspace();const view=button.dataset.workspacePane;S.panes[identity(root)]=view;
  root.querySelector('.c-workbench').dataset.cView=view;
  root.querySelectorAll('[data-workspace-pane]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.workspacePane===view)));
  restore(root);save();
 });
 matchMedia('(min-width:1024px)').addEventListener('change',()=>{const root=app.querySelector('.reading-workspace');if(root)restore(root);});
 window.addEventListener('pagehide',()=>{rememberWorkspace();save();});
}
export function workspaceMarkup(passage,questions){
 return `<div class="c-mobile-tabs" role="group" aria-label="Compare the passage and task"><button data-workspace-pane="passage">PASSAGE</button><button data-workspace-pane="task">QUESTIONS</button></div><div class="c-workbench"><section class="c-pane c-passage-pane" tabindex="0" role="region" aria-label="Complete reading passage">${passage}</section><section class="c-pane c-task-pane" tabindex="0" role="region" aria-label="Questions and learning support">${questions}</section></div>`;
}
function restore(root){panes(root).forEach(pane=>{if(pane.getClientRects().length)pane.scrollTop=S.positions[identity(root)+'-'+name(pane)]||0;});}
export function rememberWorkspace(){
 const root=app?.querySelector('.reading-workspace');if(!root)return;
 panes(root).forEach(pane=>{if(pane.getClientRects().length)S.positions[identity(root)+'-'+name(pane)]=pane.scrollTop;});
}
export function syncWorkspace(root){
 const active=!!root?.querySelector('.c-workbench');
 document.body.classList.toggle('workspace-prototype',active);
 if(!active){heading=null;return;}
 if(root.classList.contains('reading-workspace'))return;
 root.classList.add('reading-workspace');root.dataset.passageSize=String(size);
 const title=app.querySelector(':scope > h1'),eyebrow=app.querySelector(':scope > .eyebrow');
 if(title){heading=document.createElement('div');heading.className='workspace-heading';if(eyebrow)heading.append(eyebrow);heading.append(title);}
 // Keep the existing title in the scrollable questions area, including after checking.
 const task=root.querySelector('.c-task-pane');if(heading)task.prepend(heading);
 const passage=root.querySelector('.c-passage-pane');
 root.querySelectorAll(':scope > .c-desktop-hint, :scope > .c-phone-hint').forEach(h=>passage.insertBefore(h,passage.firstChild));
 const controls=document.createElement('div');controls.className='workspace-controls';
 const tabs=root.querySelector('.c-mobile-tabs');
 const view=S.panes[identity(root)]==='task'?'task':'passage';
 root.querySelector('.c-workbench').dataset.cView=view;
 tabs.querySelectorAll('button').forEach((b,i)=>{const value=i===0?'passage':'task';delete b.dataset.cPane;delete b.dataset.lPane;b.dataset.workspacePane=value;b.textContent=i===0?'PASSAGE':'QUESTIONS';b.setAttribute('aria-pressed',String(view===value));});
 controls.append(tabs);
 const fonts=document.createElement('div');fonts.className='workspace-font-controls';fonts.setAttribute('role','group');fonts.setAttribute('aria-label','Passage text size');
 for(const [i,label]of ['A−','A','A+'].entries()){
  const b=document.createElement('button');b.type='button';b.className='secondary';b.textContent=label;b.dataset.passageSize=String(sizes[i]);b.setAttribute('aria-label',`Passage text ${sizes[i]} pixels${sizes[i]===18?' (default)':''}`);b.setAttribute('aria-pressed',String(size===sizes[i]));fonts.append(b);
 }
 fonts.addEventListener('click',event=>{const b=event.target.closest('button[data-passage-size]');if(!b)return;size=Number(b.dataset.passageSize);root.dataset.passageSize=String(size);fonts.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(Number(x.dataset.passageSize)===size)));try{sessionStorage.setItem(FONT_KEY,String(size));}catch{}});
 controls.append(fonts);root.prepend(controls);restore(root);
 panes(root).forEach(pane=>pane.addEventListener('scroll',()=>{if(!pane.getClientRects().length)return;S.positions[identity(root)+'-'+name(pane)]=pane.scrollTop;clearTimeout(timer);timer=setTimeout(save,150);},{passive:true}));
}
