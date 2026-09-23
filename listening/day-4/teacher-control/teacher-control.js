import {api,ClassroomConnection} from '../../../shared/classroom/client.js';
import {serviceURL} from '../../../shared/classroom/config.js';
import {workshop,stages,serviceReady} from '../release-config.js';
const key='ielts-teacher-classroom-v1:'+workshop;
const connection=new ClassroomConnection(workshop,stages);
const status=document.querySelector('#teacher-status'),create=document.querySelector('#create-class'),session=document.querySelector('#teacher-session'),list=document.querySelector('#release-activities');
let teacher=null,busy=false;
try{const saved=JSON.parse(localStorage.getItem(key));if(saved?.service===serviceURL&&saved.expiresAt>Date.now())teacher=saved;}catch{}
list.innerHTML=stages.map(s=>`<section class="choice-item"><h2>${s.label}</h2><button data-release="${s.id}" disabled>Release answers</button><p id="code-${s.id}" role="status"></p></section>`).join('');
function render(){
 session.hidden=!teacher;create.hidden=!!teacher;
 if(teacher)document.querySelector('#classroom-code').textContent=teacher.code;
 const ready=teacher&&connection.status==='connected'&&connection.expiresAt>Date.now();
 list.querySelectorAll('button').forEach(button=>{const released=connection.isOpen(button.dataset.release);button.disabled=!ready||busy||released;document.querySelector('#code-'+button.dataset.release).textContent=released?'Released':'';});
 document.querySelector('#release-all').disabled=!ready||busy;
 if(!serviceReady){create.disabled=true;status.textContent="Day 4 classroom activation is pending. The service needs its Day 4 registry configuration before classes can be created.";}
 if(!serviceURL){create.disabled=true;status.textContent='Class connection needs its Cloudflare address before it can be used.';}
}
connection.subscribe(()=>{
 if(teacher&&!connection.code){teacher=null;try{localStorage.removeItem(key);}catch{}status.textContent=connection.message||'This class has ended. Create a new class.';}
 else if(teacher)status.textContent=connection.status==='connected'?'Class connected. Share the class code once.':'Reconnecting… Release commands will be available when the connection returns.';
 render();
});
create.addEventListener('click',async()=>{
 if(!serviceReady)return;
 create.disabled=true;status.textContent='Creating class…';
 try{
  const result=await api('/v1/classes',{method:'POST',body:{workshop}});
  teacher={service:serviceURL,code:result.code,teacherToken:result.teacherToken,createdAt:result.createdAt,expiresAt:result.expiresAt};
  try{localStorage.setItem(key,JSON.stringify(teacher));}catch{}
  connection.stop();connection.code=result.code;connection.createdAt=result.createdAt;connection.accept(result);connection.resume();
 }catch{status.textContent='Could not create a class just now. Please try again.';}
 finally{create.disabled=false;render();}
});
async function release(body){
 if(!teacher||busy)return;busy=true;render();
 try{
  const state=await api(`/v1/classes/${teacher.code}/release?workshop=${workshop}`,{method:'POST',token:teacher.teacherToken,body});
  connection.accept(state);status.textContent=body.all?'All answers released.':'Answers released.';
 }catch(error){status.textContent=error.status===403?'This browser does not have the teacher key for this class.':'Release not confirmed. Please try again when connected.';}
 finally{busy=false;render();}
}
list.addEventListener('click',event=>{const button=event.target.closest('[data-release]');if(button)release({activity:button.dataset.release});});
document.querySelector('#release-all').addEventListener('click',()=>release({all:true}));
// A new class is a separate session; it never resets or rewrites student answers.
document.querySelector('#new-class').addEventListener('click',()=>{if(confirm('Create a different class? The current class will still expire after eight hours.')){teacher=null;try{localStorage.removeItem(key);}catch{}connection.forget();status.textContent='Create a class when ready.';render();}});
render();if(teacher){connection.code=teacher.code;connection.createdAt=teacher.createdAt||0;connection.expiresAt=teacher.expiresAt;connection.start();}
