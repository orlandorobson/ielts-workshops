import {sourceActivities,markSource} from '../../content/listening/day-1-source.js';
import {answerRelease,checkingControl,syncCheckingControls} from './answer-release.js';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function sourceActivity(id,state,{heading=true}={}){
 const activity=sourceActivities.find(a=>a.id===id);
 return `${heading?`<h3>${activity.title}</h3>`:''}${activity.audio?'<p class="listen">Listen with your teacher.</p>':''}${activity.instruction?`<p>${activity.instruction}</p>`:''}<form data-source-activity="${id}" class="source-activity" novalidate>${activity.questions.map((q,i)=>{
 const name=`source-${id}-${q.number}`,saved=state[id]?.answers?.[i]||'';
 const label=`${q.number}. ${q.prompt}`;
 const feedback=`<p class="feedback" id="${name}-feedback"></p>`;
 if(q.options)return `<fieldset class="choice-item"><legend>${label}</legend><div class="options ${activity.compact?'paired-options':''}">${q.options.map((option,j)=>`<label class="option"><input type="radio" name="${name}" value="${escape(option)}" ${saved===option?'checked':''}><span>${activity.letters?String.fromCharCode(65+j)+'. ':''}${escape(option)}</span></label>`).join('')}</div>${feedback}</fieldset>`;
 return `<div class="answer-row"><label for="${name}">${label}</label><div class="entry"><input type="text" id="${name}" name="${name}" inputmode="${q.mode}" spellcheck="false" autocomplete="off" autocapitalize="none" value="${escape(saved)}" aria-describedby="${name}-feedback"></div>${feedback}</div>`;
 }).join('')}${activity.pending?'<p class="pending">Answer key pending. You can enter and save your answers; checking is not available yet.</p>':`<div class="actions">${checkingControl(id)}</div>`}<p class="result" role="status"></p></form>`;
}
export function mountSourceActivities(state,save){
 const restorers=[];
 document.querySelectorAll('[data-source-activity]').forEach(form=>{
 const id=form.dataset.sourceActivity,activity=sourceActivities.find(a=>a.id===id);
 const answers=()=>activity.questions.map(q=>form.elements[`source-${id}-${q.number}`].value);
 function check(){if(activity.pending||!answerRelease.isOpen(id))return;
 const values=answers();let score=0;
 activity.questions.forEach((q,i)=>{const result=markSource(activity,q,values[i]);if(result.correct)score++;const feedback=form.querySelector(`#source-${id}-${q.number}-feedback`);feedback.textContent=result.message;feedback.classList.toggle('correct',result.correct);});
 form.querySelector('.result').textContent=`${score} / ${activity.questions.length} correct`;state[id]={answers:values,checked:true};save();}
 form.addEventListener('submit',event=>{event.preventDefault();check();});
 form.addEventListener('input',()=>{state[id]={answers:answers(),checked:false};form.querySelectorAll('.feedback,.result').forEach(el=>{el.textContent='';el.classList.remove('correct');});save();});
 restorers.push(()=>{if(state[id]?.checked)check();});
 if(state[id]?.checked)check();
 });syncCheckingControls();return ()=>restorers.forEach(restore=>restore());
}
