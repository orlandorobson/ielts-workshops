import {answerRelease,answerReleaseConfig} from '../answer-release.js';
const list=document.querySelector('#release-activities');
list.innerHTML=answerReleaseConfig.stages.map(s=>`<section class="choice-item"><h2>${s.label}</h2><button data-release="${s.id}" aria-describedby="code-${s.id}">Release answers</button><p id="code-${s.id}" role="status"></p></section>`).join('');
function show(id){const stage=answerReleaseConfig.stages.find(s=>s.id===id);document.querySelector('#code-'+id).textContent=`Share code: ${stage.code} · Checking enabled in this browser.`;}
list.addEventListener('click',event=>{const button=event.target.closest('[data-release]');if(!button)return;answerRelease.open(button.dataset.release);show(button.dataset.release);});
document.querySelector('#release-all').addEventListener('click',()=>{answerRelease.unlockAll();document.querySelector('#all-code').textContent=`Share code: ${answerReleaseConfig.allAccessCode} · All answer checking enabled in this browser.`;answerReleaseConfig.stages.forEach(s=>show(s.id));});
answerReleaseConfig.stages.filter(s=>answerRelease.isOpen(s.id)).forEach(s=>show(s.id));
