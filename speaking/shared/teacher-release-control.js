import {createReleaseControl} from './release-control.js';
export function mountTeacherControl(config){
 const control=createReleaseControl(config),stages=document.getElementById('teacher-stages');
 stages.innerHTML=config.stages.map((s,i)=>`<section class="teacher-stage"><h2>Stage ${i+1} — ${s.label}</h2>${s.available===false?'<p>Not yet built · cannot be released.</p>':`${i===0?'<p>Already open</p>':`<button data-code="${s.id}" data-kind="code">Show release code · this stage only</button><output id="code-${s.id}" hidden></output><button data-code="${s.id}" data-kind="throughCode">Show code · unlock through Stage ${i+1}</button><output id="throughCode-${s.id}" hidden></output>`}<a href="../?stage=${s.id}" data-demo="${s.id}">Open Stage ${i+1} on this device</a>`}</section>`).join('');
 document.getElementById('teacher-app').addEventListener('click',e=>{
  const el=e.target.closest('button,a');if(!el)return;
  const status=document.getElementById('teacher-status');
  if(el.dataset.code){const s=config.stages.find(s=>s.id===el.dataset.code),output=document.getElementById(el.dataset.kind+'-'+s.id);output.textContent=s[el.dataset.kind];output.hidden=!output.hidden;}
  if(el.hasAttribute('data-show-all')){const output=document.getElementById('all-code');output.textContent=config.allAccessCode;output.hidden=!output.hidden;}
  if(el.hasAttribute('data-unlock-all')){control.unlockAll();status.textContent='All ready stages are open on this device.';}
  if(el.dataset.demo)control.open(el.dataset.demo);
  if(el.hasAttribute('data-reset')&&confirm(`Reset ${config.title} progress and releases on this device? Other days will not be affected.`)){control.reset();status.textContent=`${config.title} reset. Only Stage 1 is open.`;}
 });
}
