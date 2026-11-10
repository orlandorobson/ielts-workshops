import { content } from './content.js';
import { toMP3 } from './mp3.js';
import { bundle } from './bundle.js';
import { submission } from './submission-config.js';
const $ = id => document.getElementById(id);
const names = {W:'Work',S:'Studies',D:'Daily routine',E:'Weekends',R:'Places to relax'};
let attempt, answers = [], index = 0, state = 'idle', recorder, stream, timer, started, interrupted, archive, archiveURL, sending = false, sent = false;
let overallStarted = 0, overallEnded = 0, finishing = false;
const totalSeconds = () => overallStarted ? ((overallEnded || performance.now()) - overallStarted)/1000 : 0;
function updateClock() {
 const elapsed=totalSeconds();
 $('total-elapsed').textContent=`${format(elapsed)} / 04:00`;
 $('total-progress').value=Math.min(elapsed,240);
 $('total-progress').setAttribute('aria-valuetext',`${format(elapsed)} elapsed; four-minute practice target`);
 $('attempt-clock').classList.toggle('overtime',elapsed>=240);
 $('target-note').textContent=overallEnded ? `Attempt finished · ${format(elapsed)} total. Four minutes is a practice target.` : elapsed>=240 ? `Four-minute target reached · +${format(elapsed-240)}. Continue naturally, or finish when ready.` : 'Aim for about 4–5 minutes. The clock includes audio, answers and navigation.';
}
setInterval(updateClock,250);
const status = text => { $('status').textContent = text; };
const format = seconds => `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds)%60).padStart(2,'0')}`;
const release = () => { stream?.getTracks().forEach(t=>{t.onended=null;t.stop();}); stream=null; };
const validStudent = () => $('student-id').value.trim().length > 0;
const updateSubmit = () => { $('submit').disabled=finishing || sending || sent || !archive || !canSend() || !validStudent() || !$('upload-consent').checked || archive.size>submission.maxBytes || !answers.some(Boolean) || answers.some(a=>a && !a.complete); };
const canSend = () => submission.enabled && /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(submission.endpoint);
let examinerBusy = false, audioRun = 0, cancelAudio;
function stopExaminer() {
 audioRun++; cancelAudio?.(); cancelAudio=null;
 $('examiner-player').pause(); examinerBusy=false;
}
async function playExaminer(ids) {
 stopExaminer();
 const run=audioRun, player=$('examiner-player');
 document.querySelectorAll('audio').forEach(a=>a.pause());
 examinerBusy=true; controls();
 $('examiner-status').textContent='Listen to the examiner…';
 try {
  for(const id of ids) {
   if(run!==audioRun)return;
   await new Promise((resolve,reject)=>{
    let timeout;
    const finish=error=>{clearTimeout(timeout);player.onended=null;player.onerror=null;cancelAudio=null;error?reject(error):resolve();};
    cancelAudio=()=>finish();
    player.onended=()=>finish();player.onerror=()=>finish(Error('audio'));
    timeout=setTimeout(()=>finish(Error('timeout')),45000);
    player.src=`../audio/part-1/${id}.mp3`;
    player.play().catch(e=>finish(e));
   });
  }
  if(run===audioRun)$('examiner-status').textContent='Examiner finished. You can record your answer.';
 } catch {
  if(run===audioRun){player.pause();$('examiner-status').textContent='Audio could not play. Try Replay question, or choose Show question to read it and record your answer.';}
 } finally {
  if(run===audioRun){examinerBusy=false;controls();}
 }
}
function controls() {
 const busy = finishing || state==='requesting' || state==='recording' || state==='stopping';
 $('record').hidden = state==='recording' || state==='stopping'; $('record').disabled=busy || examinerBusy;
 $('replay-question').disabled=busy || examinerBusy;
 $('stop').hidden=state!=='recording' && state!=='stopping'; $('stop').disabled=state==='stopping';
 $('previous').disabled=busy || index===0; $('next').disabled=busy || !answers[index]?.complete;
 $('finish').disabled=busy;
 $('record').textContent=answers[index]?'Record again':'Start recording';
 $('record-state').textContent=({idle:'Ready',requesting:'Requesting microphone…',recording:'Recording',stopping:'Saving answer…',stopped:'Answer saved'})[state];
}
function render(audioIds = []) {
 stopExaminer();
 document.querySelectorAll('audio').forEach(a=>a.pause());
 const id=attempt.question_ids[index], answer=answers[index];
 $('progress').textContent=`Question ${index+1} of ${attempt.question_ids.length}`;
 $('topic').textContent=names[id[0]]; $('question').textContent=content.questions[id]; $('question-id').textContent=`P1-S01-${id}`;
 $('elapsed').textContent=format(answer?.duration_seconds || 0);
 $('answer-player').hidden=!answer; if(answer) $('answer-player').src=answer.url; else $('answer-player').removeAttribute('src');
 $('next').textContent=index===attempt.question_ids.length-1?'Review attempt':'Next';
 state=answer?'stopped':'idle'; $('question-fallback').open=false; controls(); $('question-heading').focus();
 if(audioIds.length)playExaminer(audioIds); else $('examiner-status').textContent='Replay the question or record your answer.';
}
async function record() {
 if(examinerBusy || !['idle','stopped'].includes(state))return;
 state='requesting';controls();status('Requesting microphone access…');
 try {
  document.querySelectorAll('audio').forEach(a=>a.pause());
  stream=await navigator.mediaDevices.getUserMedia({audio:true});
  const mimeType=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
  recorder=new MediaRecorder(stream,mimeType?{mimeType}:undefined);
  const chunks=[]; interrupted=false;
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
  recorder.onstop=()=>{
   clearInterval(timer); release();
   const blob=new Blob(chunks,{type:recorder.mimeType || chunks[0]?.type || 'audio/webm'});
   const duration=Number(((performance.now()-started)/1000).toFixed(2));
   if(blob.size){
    if(answers[index])URL.revokeObjectURL(answers[index].url);
    answers[index]={blob,url:URL.createObjectURL(blob),duration_seconds:duration,complete:!interrupted,recorded_at:new Date().toISOString()};
    archive=null;sent=false;render();
   } else {state=answers[index]?'stopped':'idle';controls();}
   status(interrupted?'Recording interrupted. Listen to the partial answer, then record again. Earlier answers are safe.':blob.size?'Answer saved. Listen back, record again, or continue.':'No audio captured. Your earlier recording, if any, is safe. Try again.');
  };
  recorder.onerror=()=>stop(true);
  stream.getAudioTracks().forEach(t=>t.onended=()=>stop(true));
  recorder.start(250); started=performance.now(); state='recording'; $('elapsed').textContent='00:00';$('answer-player').hidden=true;
  timer=setInterval(()=>{$('elapsed').textContent=format((performance.now()-started)/1000);},200);
  controls();status('');$('stop').focus();
 } catch(error) {
  release();state=answers[index]?'stopped':'idle';controls();status('Could not start recording. Allow microphone access, check your microphone, then try again. Saved answers are safe.');
 }
}
function stop(failed=false) {
 if(state!=='recording')return;
 interrupted=failed;state='stopping';clearInterval(timer);controls();
 if(recorder.state!=='inactive')recorder.stop();
}
function manifest() {
 return {...attempt,total_elapsed_seconds:Number(totalSeconds().toFixed(2)),target_seconds:240,recorded_answers:answers.filter(Boolean).length,complete:answers.length===attempt.question_ids.length && answers.every(a=>a?.complete),questions:attempt.question_ids.map((id,i)=>{
  const a=answers[i],ext=a?.blob.type.includes('mp4')?'m4a':a?.blob.type.includes('ogg')?'ogg':'webm';
  return {order:i+1,topic:names[id[0]],status:!a?'not_recorded':a.complete?'recorded':'interrupted',id:`P1-S01-${id}`,text:content.questions[id],audio_file:a?`P1-S01-${id}.${a.mp3?'mp3':ext}`:null,original_audio_file:a?`${a.mp3?'originals/':''}P1-S01-${id}.${ext}`:null,original_audio_bytes:a?.blob.size,original_audio_mime:a?.blob.type,duration_seconds:a?.duration_seconds,audio_bytes:(a?.mp3 || a?.blob)?.size,audio_mime:(a?.mp3 || a?.blob)?.type,complete:a?.complete,recorded_at:a?.recorded_at};
 })};
}
async function review() {
 if(finishing || ['requesting','recording','stopping'].includes(state))return;
 finishing=true;controls();
 stopExaminer();
 await playExaminer(['CLOSE']);
 overallEnded=performance.now();attempt.finished_at=new Date().toISOString();updateClock();
 $('practice').hidden=true;$('result').hidden=false;$('answers').replaceChildren();
 $('download').hidden=true;$('submit').disabled=true;status('Preparing your complete attempt…');
 $('review').disabled=true;$('restart').disabled=true;
 let conversionFailed=false;
 for(let i=0;i<answers.length;i++){const a=answers[i];if(!a || a.mp3)continue;status(`Preparing MP3 ${i+1} of ${attempt.question_ids.length}… Keep this page open.`);try{a.mp3=await toMP3(a.blob);}catch{conversionFailed=true;}}
 const meta=manifest();
 meta.questions.forEach((q,i)=>{
  const box=document.createElement('div'),label=document.createElement('p'),audio=document.createElement('audio');
  label.textContent=`${i+1}. ${q.id} · ${q.topic} · ${q.text} · ${q.status==='not_recorded'?'Not recorded':format(q.duration_seconds)+(q.status==='interrupted'?' (interrupted)':'')}`;audio.controls=true;if(answers[i])audio.src=answers[i].url;else audio.hidden=true;audio.setAttribute('aria-label',`Answer ${i+1}`);
  box.append(label,audio);$('answers').append(box);
 });
 try {
  const readable=[`IELTS Speaking Part 1 — ${meta.complete?'Complete':'Partial'} attempt`, `Attempt: ${meta.attempt_id}`, `Selected topics: ${meta.selected_topics.join(' → ')}`, `Total elapsed: ${meta.total_elapsed_seconds}s (240s practice target)`, `Started: ${meta.started_at}`, `Finished: ${meta.finished_at}`, `Recordings: ${meta.recorded_answers}/${meta.question_ids.length}`, '', ...meta.questions.map(q=>`${q.order}. ${q.id} | ${q.topic} | ${q.status}\n${q.text}\nFile: ${q.audio_file || 'none'} | Duration: ${q.duration_seconds ?? 'not recorded'} seconds`)].join('\n');
  archive=await bundle([...answers.flatMap((a,i)=>a?[{name:meta.questions[i].audio_file,blob:a.mp3 || a.blob},...(a.mp3?[{name:meta.questions[i].original_audio_file,blob:a.blob}]:[])]:[]),{name:'manifest.txt',blob:new Blob([readable],{type:'text/plain'})},{name:'attempt.json',blob:new Blob([JSON.stringify(meta,null,2)],{type:'application/json'})}]);
  if(archiveURL)URL.revokeObjectURL(archiveURL);archiveURL=URL.createObjectURL(archive);
  $('download').textContent=conversionFailed?'Download ZIP (original audio preserved)':'Download attempt ZIP (MP3)';$('download').href=archiveURL;$('download').download=`${attempt.attempt_id}.zip`;$('download').hidden=false;
  $('package-status').textContent=`One ZIP · ${meta.recorded_answers}/${meta.question_ids.length} recordings · ${meta.complete?'Complete':'Partial'} attempt + manifest + original audio backup · ${(archive.size/1024/1024).toFixed(2)} MB`;
  updateSubmit();
  $('submission-note').textContent=!canSend()?'Online submission is not connected yet. Download this complete attempt to share with your teacher.':archive.size>submission.maxBytes?'This attempt exceeds the upload limit. Download it to share with your teacher.':'Maximum ZIP size: 25 MB. Agree below to submit. Partial attempts include all saved answers and mark missing questions. Interrupted recordings must be recorded again. Keep a downloaded backup.';
  status(conversionFailed?'Some MP3 conversions failed. This ZIP preserves those original recordings. Choose Review answers, then finish again to retry conversion.':'MP3 recordings are ready. Original audio is included in the originals folder as a backup.');
 }catch {status('Could not package your attempt. Your answers are safe; review them and try again.');}
 finishing=false;updateSubmit();$('review').disabled=false;$('restart').disabled=false;$('result-title').focus();
}
$('welcome-start').onclick=()=>{$('welcome').hidden=true;$('setup').hidden=false;$('route').focus();};
const updateStart=()=>{$('start').disabled=!$('consent').checked || !validStudent();};
$('consent').onchange=updateStart;
$('student-id').oninput=updateStart;
$('upload-consent').onchange=updateSubmit;
$('start').onclick=()=>{
 if(!$('consent').checked || !validStudent())return;
 const route=$('route').value,blocks=[route,...($('include-weekends').checked?['E']:[]),...($('include-relax').checked?['R']:[])];
 attempt={student_identifier:$('student-id').value.trim(),recording_consent_at:new Date().toISOString(),attempt_id:`P1-S01-${crypto.randomUUID()}`,set_id:'P1-S01',version:content.version,content_status:content.status,route,selected_topics:blocks.map(b=>names[b]),topic_order:blocks,started_at:new Date().toISOString(),continuous_recording:false,question_ids:blocks.flatMap(b=>Array.from({length:4},(_,i)=>`${b}0${i+1}`)),events:[]};
 $('upload-consent').checked=false;$('submit').textContent='Submit complete attempt';answers=[];index=0;sent=false;archive=null;overallStarted=performance.now();overallEnded=0;$('attempt-clock').hidden=false;updateClock();$('setup').hidden=true;$('practice').hidden=false;render(['OPEN',`T-${route}`,attempt.question_ids[0]]);status('');
};
$('replay-question').onclick=()=>playExaminer([attempt.question_ids[index]]);
$('record').onclick=record;$('stop').onclick=()=>stop();
$('next').onclick=()=>{if($('next').disabled)return;if(index===attempt.question_ids.length-1)review();else{index++;const id=attempt.question_ids[index];render([...(id[0]!==attempt.question_ids[index-1][0]?[`T-${id[0]}`]:[]),id]);status('');}};
$('previous').onclick=()=>{if(!$('previous').disabled){index--;render([attempt.question_ids[index]]);status('');}};
$('finish').onclick=()=>{if(!$('finish').disabled && confirm('Finish now? Unanswered questions will be listed as not recorded in your partial attempt.'))review();};
$('review').onclick=()=>{if(sending || finishing)return;overallEnded=0;delete attempt.finished_at;$('result').hidden=true;$('practice').hidden=false;render();};
$('restart').onclick=()=>{
 if(sending || finishing || !confirm('Have you saved this attempt? Starting a new attempt removes these recordings from this page.'))return;
 stopExaminer();answers.forEach(a=>a && URL.revokeObjectURL(a.url));if(archiveURL)URL.revokeObjectURL(archiveURL);answers=[];attempt=null;archive=null;
 overallStarted=0;overallEnded=0;$('attempt-clock').hidden=true;$('result').hidden=true;$('setup').hidden=false;status('');
};
$('submit').onclick=async()=>{
 updateSubmit();if($('submit').disabled)return;
 sending=true;$('submit').textContent='Uploading…';$('submit').setAttribute('aria-busy','true');$('upload-consent').disabled=true;$('submit').disabled=true;$('review').disabled=true;$('restart').disabled=true;status('Sending your complete attempt…');
 const abort=new AbortController(), timeout=setTimeout(()=>abort.abort(),30000);
 try {
  const data=new FormData();data.append('student_identifier',attempt.student_identifier);data.append('submission_kind','IELTS Speaking Part 1');data.append('upload_consent','Agreed');data.append('upload_consent_at',new Date().toISOString());data.append('attempt_id',attempt.attempt_id);data.append('attempt',JSON.stringify(manifest()));data.append('attachment',archive,`${attempt.attempt_id}.zip`);
  const response=await fetch(submission.endpoint,{method:'POST',body:data,headers:{Accept:'application/json'},signal:abort.signal});
  const body=await response.json().catch(()=>null);
  if(!response.ok || body?.ok!==true)throw new Error(response.status===429?'Too many requests. Wait before retrying.':`Upload not confirmed (${response.status}). ${body?.errors?.map(e=>e.message).join(' ') || 'Check with your teacher that ZIP uploads are enabled.'}`);
  sent=true;status('Formspree accepted your attempt. Keep a downloaded copy; your teacher can confirm receipt and file access.');
 }catch(error){status(`${error.name==='AbortError'?'Upload timed out.':error.message} Your recordings are safe. If the connection failed, check with your teacher before retrying to avoid duplicates. Attempt ID: ${attempt.attempt_id}`);}
 finally{clearTimeout(timeout);sending=false;$('upload-consent').disabled=false;$('submit').removeAttribute('aria-busy');$('submit').textContent=sent?'Accepted by Formspree':'Retry submission';updateSubmit();$('review').disabled=false;$('restart').disabled=false;}
};
window.addEventListener('beforeunload',e=>{if(answers.length || ['requesting','recording','stopping'].includes(state)){e.preventDefault();e.returnValue='';}});
document.addEventListener('visibilitychange',()=>{if(attempt && state==='recording'){attempt.events.push({type:document.hidden?'page_hidden':'page_visible',at:new Date().toISOString()});if(document.hidden)status('Keep this page open and in the foreground. If recording is interrupted, record this answer again.');}});
if(!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.MediaRecorder){$('welcome-start').disabled=true;status('Open this practice using HTTPS in a browser with microphone recording support.');}
