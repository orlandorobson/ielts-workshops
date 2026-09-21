import {workshops} from '../../shared/classroom/workshops.js';
import {ClassroomConnection} from '../../shared/classroom/client.js';
export const answerReleaseConfig={title:'Listening Day 1 answers',workshop:'listening-day-1',stages:workshops['listening-day-1']};
// Old per-browser static release codes are intentionally not migrated or accepted.
export const answerRelease=new ClassroomConnection(answerReleaseConfig.workshop,answerReleaseConfig.stages);
export function checkingControl(id){return `<p data-answer-wait="${id}" class="muted">Your teacher will release answer checking. Keep your answers here and continue whenever you’re ready.</p><button type="submit" data-answer-check="${id}" hidden disabled>Check &amp; reflect</button>`;}
export function syncCheckingControls(root=document){
 root.querySelectorAll('[data-answer-check]').forEach(button=>{const open=answerRelease.isOpen(button.dataset.answerCheck);button.hidden=!open;button.disabled=!open;});
 root.querySelectorAll('[data-answer-wait]').forEach(el=>{el.hidden=answerRelease.isOpen(el.dataset.answerWait);});
}
