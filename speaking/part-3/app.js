import {toMP3} from '../part-1/mp3.js';
import {bundle} from '../part-1/bundle.js';
import {sets,audioScripts} from './content.js';
import {submission} from '../part-1/submission-config.js';
const $=id=>document.getElementById(id), titles=sets.map(s=>s.title);
const stamp=()=>new Date().toISOString();
let state='setup', stream, recorder, attempt, selected, question=1, answers=new Map(), archive, zipURL, answerURL, timer, started, retryAudio, heard=false, sent=false;
const status=t=>$('status').textContent=t;
const asset=id=>`../audio/part-3/${id}.mp3`;
const qid=()=>`P3-S${selected}-Q${String(question).padStart(2,'0')}`;
const release=()=>{stream?.getTracks().forEach(t=>{t.onended=null;t.stop();});stream=null;};
function controls(){const idle=state==='ready';$('question-select').disabled=!idle||sent;$('listen').disabled=!idle||sent;$('record').disabled=!idle||!heard||sent;$('record').textContent=answers.has(question)?'Re-record answer':'Record answer';$('stop').disabled=state!=='recording';$('package').disabled=!idle||!answers.size||sent;$('new').disabled=!idle;$('submit').disabled=!idle||!archive||archive.size>submission.maxBytes||!$('upload-consent').checked||sent;$('progress').textContent=`${answers.size} of 6 answers saved. You may submit a partial set.`;}
function invalidate(){archive=null;sent=false;if(zipURL)URL.revokeObjectURL(zipURL);zipURL=null;$('download').hidden=true;$('package-status').textContent='';$('submit').textContent='Submit Part 3';}
function showAnswer(){if(answerURL)URL.revokeObjectURL(answerURL);const a=answers.get(question);$('answer').hidden=!a;if(a){answerURL=URL.createObjectURL(a.blob);$('answer').src=answerURL;}else{$('answer').removeAttribute('src');$('answer').load();}}
function play(id,done){
 state='listening';controls();heard=false;$('phase').textContent='Listen to the examiner';const player=$('examiner');let completed=false;
 const failed=()=>{if(completed)return;player.pause();$('retry').hidden=false;status('Audio could not finish. Retry before recording.');};
 const run=()=>{$('retry').hidden=true;player.src=asset(id);player.play().catch(failed);};
 $('prompt-text').textContent=audioScripts[id];$('prompt-text').hidden=false;
 player.onended=()=>{if(completed)return;completed=true;player.onerror=null;retryAudio=null;$('retry').hidden=true;attempt.audio_asset_ids.push(id);done();};player.onerror=failed;retryAudio=run;run();
}
function listen(){if(state!=='ready')return;play(qid(),()=>{state='ready';heard=true;$('phase').textContent='Ready to record';status('');controls();});}
for(let i=1;i<=3;i++)$('set-select').add(new Option(titles[i-1],i));
for(let i=1;i<=6;i++)$('question-select').add(new Option(`Question ${i}`,i));
function startControl(){$('start').disabled=state!=='setup'||!$('student-id').value.trim()||!$('consent').checked;}
$('student-id').oninput=startControl;$('consent').onchange=startControl;
$('start').onclick=async()=>{
 if($('start').disabled)return;state='requesting';startControl();
 // Start playback inside the gesture to unlock the audio element on mobile Safari.
 const player=$('examiner');player.src=asset('P3-GENERAL-INTRO');player.muted=true;const unlock=player.play().then(()=>{player.pause();player.muted=false;}).catch(()=>{player.muted=false;});
 try{stream=await navigator.mediaDevices.getUserMedia({audio:true});await unlock;release();selected=Number($('set-select').value);answers=new Map();question=1;sent=false;invalidate();
 attempt={schema_version:1,attempt_id:`P3-S${selected}-${crypto.randomUUID()}`,submission_kind:'IELTS Speaking Part 3',student_identifier:$('student-id').value.trim(),recording_consent_at:stamp(),started_at_utc:stamp(),set_id:`P3-S${selected}`,set_title:titles[selected-1],max_answer_seconds:90,audio_asset_ids:[],responses:[]};
 $('setup').hidden=true;$('practice').hidden=false;$('set-title').textContent=titles[selected-1];$('question-select').value='1';showAnswer();play('P3-GENERAL-INTRO',()=>play(`P3-S${selected}-INTRO`,()=>{state='ready';listen();}));
 }catch(e){release();state='setup';startControl();status(`Could not begin: ${e.message}. Allow microphone access and try again.`);}
};
$('retry').onclick=()=>retryAudio?.();$('listen').onclick=listen;
$('question-select').onchange=()=>{question=Number($('question-select').value);heard=false;$('prompt-text').hidden=true;$('examiner').pause();$('examiner').removeAttribute('src');$('phase').textContent='Listen before recording';showAnswer();controls();};
$('record').onclick=async()=>{
 if(state!=='ready'||!heard||sent)return;state='requesting';controls();$('answer').pause();$('examiner').pause();
 try{stream=await navigator.mediaDevices.getUserMedia({audio:true});const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);const chunks=[];const id=question;
 recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
 recorder.onstop=()=>{clearInterval(timer);const seconds=Math.min(90,(performance.now()-started)/1000);const blob=new Blob(chunks,{type:recorder.mimeType||chunks[0]?.type});release();if(blob.size){answers.set(id,{blob,seconds,recorded_at:stamp(),stop_reason:recorder.stopReason||'manual'});invalidate();showAnswer();status('Answer saved. Listen back, re-record or choose another question.');}else status('No audio captured. Try recording again.');state='ready';$('phase').textContent='Answer saved';controls();};
 recorder.onerror=()=>{status('Recording interrupted. Listen back before submitting.');stop('interrupted');};stream.getTracks().forEach(t=>t.onended=()=>stop('microphone_ended'));
 recorder.start(250);started=performance.now();state='recording';$('phase').textContent='Recording your answer';controls();const tick=()=>{const s=Math.min(90,Math.floor((performance.now()-started)/1000));$('clock').textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')} / 01:30`;if(s>=90)stop('limit');};tick();timer=setInterval(tick,100);
 }catch(e){release();state='ready';status(`Recording could not start: ${e.message}. Try again.`);controls();}
};
function stop(reason='manual'){if(state!=='recording')return;state='saving';clearInterval(timer);controls();recorder.stopReason=reason;recorder.stop();}
$('stop').onclick=()=>stop();
$('package').onclick=async()=>{
 if(state!=='ready'||!answers.size||sent)return;state='packaging';controls();$('package-status').textContent='Preparing MP3 recordings and backup ZIP…';archive=null;$('download').hidden=true;
 try{const files=[],responses=[];for(const [n,a] of [...answers].sort((a,b)=>a[0]-b[0])){const id=`P3-S${selected}-Q${String(n).padStart(2,'0')}`, ext=a.blob.type.includes('mp4')?'m4a':a.blob.type.includes('ogg')?'ogg':'webm';a.mp3??=await toMP3(a.blob);files.push({name:`${id}.mp3`,blob:a.mp3},{name:`originals/${id}.${ext}`,blob:a.blob});responses.push({question_number:n,exact_question_text_snapshot:sets[selected-1].questions[n-1],question_audio_asset:`${id}.mp3`,recording_reference:`${id}.mp3`,original_audio_mime:a.blob.type,duration_seconds:a.seconds,recorded_at:a.recorded_at,stop_reason:a.stop_reason});}
 attempt.responses=responses;attempt.partial=responses.length<6;attempt.packaged_at_utc=stamp();files.push({name:'attempt.json',blob:new Blob([JSON.stringify(attempt,null,2)],{type:'application/json'})},{name:'manifest.txt',blob:new Blob([`${attempt.set_id} — ${attempt.set_title}\nStandalone Part 3 practice\n${responses.map(a=>`Question ${a.question_number}: ${a.recording_reference}; examiner ${a.question_audio_asset}\n${a.exact_question_text_snapshot}`).join('\n')}`])});archive=await bundle(files);if(zipURL)URL.revokeObjectURL(zipURL);zipURL=URL.createObjectURL(archive);$('download').href=zipURL;$('download').download=`${attempt.attempt_id}.zip`;$('download').hidden=false;$('package-status').textContent=`${responses.length} answers · ${(archive.size/1e6).toFixed(2)} MB${archive.size>submission.maxBytes?' · Too large to upload; download and share with your teacher.':''}`;
 }catch(e){status(`Could not prepare ZIP: ${e.message}. Your recordings remain on this page. Retry packaging.`);}finally{state='ready';controls();}
};
$('upload-consent').onchange=controls;
$('submit').onclick=async()=>{
 if($('submit').disabled)return;state='uploading';controls();$('submit').textContent='Uploading…';const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),45000);
 try{const data=new FormData();for(const [key,value] of Object.entries({student_identifier:attempt.student_identifier,submission_kind:'IELTS Speaking Part 3',attempt_id:attempt.attempt_id,set_id:attempt.set_id,upload_consent:'Agreed',upload_consent_at:stamp(),attempt:JSON.stringify(attempt)}))data.append(key,value);data.append('attachment',archive,`${attempt.attempt_id}.zip`);const response=await fetch(submission.endpoint,{method:'POST',body:data,headers:{Accept:'application/json'},signal:controller.signal});const body=await response.json().catch(()=>null);if(!response.ok||body?.ok!==true)throw Error(`Upload not confirmed (${response.status}). ${body?.errors?.map(e=>e.message).join(' ')||''}`);sent=true;status('Formspree accepted your Part 3 attempt. Keep your backup. Ask your teacher to confirm receipt and attachment access.');
 }catch(e){status(`${e.name==='AbortError'?'Upload timed out.':e.message} Keep your backup. Check with your teacher before retrying to avoid duplicates.`);}finally{clearTimeout(timeout);state='ready';$('submit').textContent=sent?'Accepted by Formspree':'Retry submission';controls();}
};
$('new').onclick=()=>{if(state!=='ready'||(answers.size&&!confirm('Have you downloaded your backup? Choosing another set removes these recordings from this page.')))return;answers.clear();invalidate();$('answer').pause();$('examiner').pause();showAnswer();$('upload-consent').checked=false;attempt=null;state='setup';$('practice').hidden=true;$('setup').hidden=false;status('');startControl();};
window.addEventListener('beforeunload',e=>{if(answers.size||state!=='setup'){e.preventDefault();e.returnValue='';}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='recording')status('Keep this page in the foreground. Listen back for interruptions before submitting.');});
if(!isSecureContext||!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){$('start').hidden=true;status('Use HTTPS in a browser that supports microphone recording.');}

for(const id of ['examiner','answer'])$(id).addEventListener('play',()=>{if(!$('practice').hidden&&['recording','requesting','saving'].includes(state))$(id).pause();});
