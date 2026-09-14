// Reusable static-day release state. Each day supplies its own labels, codes and keys.
export function createReleaseControl(config) {
  let memory={released:[config.defaultUnlockedStage],completed:[]};
  const ids=config.stages.map(s=>s.id);
  function read(){
    try {const saved=JSON.parse(localStorage.getItem(config.storageKey));
      if(saved)memory={released:[...new Set([config.defaultUnlockedStage,...(Array.isArray(saved.released)?saved.released:[])].filter(id=>ids.includes(id)))],completed:(Array.isArray(saved.completed)?saved.completed:[]).filter(id=>ids.includes(id))};
    }catch{}
    return memory;
  }
  function write(value){memory=value;try{localStorage.setItem(config.storageKey,JSON.stringify(value));}catch{}return value;}
  function open(id,through=false){const i=ids.indexOf(id);if(i<0)return;const d=read();write({...d,released:[...new Set([...d.released,...(through?ids.slice(0,i+1):[id])])]});}
  function unlockAll(){write({...read(),released:ids.slice()});}
  function applyCode(code){
    const text=code.trim();
    if(text===config.allAccessCode){unlockAll();return {valid:true,all:true};}
    const stage=config.stages.find(s=>s.code===text||s.throughCode===text);
    if(!stage)return {valid:false};
    open(stage.id,stage.throughCode===text);return {valid:true,stage};
  }
  return {config,read,open,unlockAll,applyCode,
    isOpen:id=>read().released.includes(id),
    stageForScreen:index=>[...config.stages].reverse().find(s=>index>=s.firstScreen)||config.stages[0],
    complete(id){const d=read();if(d.released.includes(id))write({...d,completed:[...new Set([...d.completed,id])]});},
    reset(){memory={released:[config.defaultUnlockedStage],completed:[]};try{[config.storageKey,...config.progressKeys].forEach(k=>localStorage.removeItem(k));}catch{}},
    refresh(){memory={released:[config.defaultUnlockedStage],completed:[]};return read();}
  };
}
export function installStudentRelease({control,app,progress,onJump,onRefresh}) {
  const {config}=control;
  const nav=document.createElement('details');nav.className='release-progress';progress.append(nav);
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function update(stage){
    const d=control.read();
    nav.innerHTML=`<summary>Day stages · ${config.stages.indexOf(stage)+1} of ${config.stages.length}</summary><nav aria-label="Day stages">${config.stages.map((s,i)=>{
      const locked=!d.released.includes(s.id),current=s.id===stage.id,done=d.completed.includes(s.id);
      const status=locked?'Locked':current?'Current':done?'Completed':'Available';
      return `<button data-release-jump="${s.id}" ${current?'aria-current="step"':''}><span aria-hidden="true">${locked?'🔒':current?'●':done?'✓':'○'}</span> ${i+1}. ${escape(s.label)}<small>${status}</small></button>`;
    }).join('')}</nav>`;
  }
  function locked(stage){return `<section class="release-lock"><p class="eyebrow">🔒 Stage ${config.stages.indexOf(stage)+1}</p><h1>${escape(stage.label)}</h1><p>Your teacher will release this section when the class is ready.</p><form data-release-form><label for="teacher-code">Enter teacher code</label><input id="teacher-code" data-release-code inputmode="numeric" autocomplete="off" maxlength="4" pattern="[0-9]{4}" type="text"><button type="submit" class="primary">Unlock</button><p role="status" data-release-message></p></form><button data-release-return>Back to an open stage</button></section>`;}
  nav.addEventListener('click',e=>{const b=e.target.closest('[data-release-jump]');if(b)onJump(config.stages.find(s=>s.id===b.dataset.releaseJump).firstScreen);});
  app.addEventListener('submit',e=>{
    if(!e.target.matches('[data-release-form]'))return;e.preventDefault();
    const result=control.applyCode(e.target.querySelector('input').value);
    if(result.valid){if(result.stage)onJump(result.stage.firstScreen);else onRefresh();}
    else e.target.querySelector('[data-release-message]').textContent='That code did not work. Try again.';
  });
  app.addEventListener('click',e=>{if(e.target.closest('[data-release-return]')){
    const last=[...config.stages].reverse().find(s=>control.isOpen(s.id));onJump(last.firstScreen);
  }});
  window.addEventListener('storage',e=>{
    if(e.key===config.storageKey||e.key===null){control.refresh();onRefresh();}
    if(config.progressKeys.includes(e.key)&&e.newValue===null)location.reload();
  });
  return {update,locked};
}
