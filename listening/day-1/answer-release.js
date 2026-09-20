// Reuse Speaking's static code/state engine, without its stage navigation or locks.
import {createReleaseControl} from '../../speaking/shared/release-control.js';
export const answerReleaseConfig={
 title:'Listening Day 1 answers', storageKey:'ielts-listening-day-1-answer-releases-v1',
 progressKeys:[], defaultUnlockedStage:null, allAccessCode:'749281',
 stages:[
  {id:'calendar-spelling',label:'Spelling · Days and months',code:'582746'},
  {id:'spell1',label:'Spelling · Attempt 1',code:'381642'},
  {id:'l14',label:'1.4 · Mirbat snorkelling',code:'527193'},
  {id:'l15',label:'1.5 · Mirbat again',code:'864251'},
  {id:'l16a',label:'1.6A · Gym information',code:'193875'},
  {id:'l16b',label:'1.6B · What did they actually say?',code:'642917'},
  {id:'spell2',label:'Spelling · Attempt 2',code:'275438'},
  {id:'l17',label:'1.7 · A London conversation',code:'918364'},
  {id:'l18',label:'1.8 · Hotel',code:'436729'},
  {id:'l19',label:'1.9 · Numbers',code:'753186'}
 ]
};
export const answerRelease=createReleaseControl(answerReleaseConfig);
export function checkingControl(id){return `<p data-answer-wait="${id}" class="muted">Your teacher will release answer checking. Keep your answers here and continue whenever you’re ready.</p><button type="submit" data-answer-check="${id}" hidden disabled>Check &amp; reflect</button>`;}
export function syncCheckingControls(root=document){
 root.querySelectorAll('[data-answer-check]').forEach(button=>{const open=answerRelease.isOpen(button.dataset.answerCheck);button.hidden=!open;button.disabled=!open;});
 root.querySelectorAll('[data-answer-wait]').forEach(el=>{el.hidden=answerRelease.isOpen(el.dataset.answerWait);});
}
