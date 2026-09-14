import {releaseConfig} from '../release-config.js';
import {createReleaseControl} from '../../shared/release-control.js';
const control=createReleaseControl(releaseConfig);
const stages=document.getElementById('teacher-stages');
stages.innerHTML=releaseConfig.stages.map((s,i)=>`<section class="teacher-stage"><h2>Stage ${i+1} — ${s.label}</h2>${i===0?'<p>Already open</p>':`<button data-code="${s.id}" data-kind="code">Show release code · this stage only</button><output id="code-${s.id}" hidden></output><button data-code="${s.id}" data-kind="throughCode">Show code · unlock through Stage ${i+1}</button><output id="throughCode-${s.id}" hidden></output>`}<a href="../?stage=${s.id}" data-demo="${s.id}">Open Stage ${i+1} on this device</a></section>`).join('');
document.getElementById('teacher-app').addEventListener('click',e=>{
 const el=e.target.closest('button,a');if(!el)return;
 const status=document.getElementById('teacher-status');
 if(el.dataset.code){const stage=releaseConfig.stages.find(s=>s.id===el.dataset.code);const output=document.getElementById(el.dataset.kind+'-'+stage.id);output.textContent=stage[el.dataset.kind];output.hidden=!output.hidden;}
 if(el.hasAttribute('data-show-all')){const output=document.getElementById('all-code');output.textContent=releaseConfig.allAccessCode;output.hidden=!output.hidden;}
 if(el.hasAttribute('data-unlock-all')){control.unlockAll();status.textContent='All stages are open on this device.';}
 if(el.dataset.demo)control.open(el.dataset.demo);
 if(el.hasAttribute('data-reset')&&confirm('Reset Day 1 progress and releases on this device? This will not affect other devices.')){control.reset();status.textContent='Day 1 reset. Only Stage 1 is open on this device.';}
});
