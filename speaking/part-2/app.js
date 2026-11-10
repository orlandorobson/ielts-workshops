import {cards} from './content.js';
import {toMP3} from '../part-1/mp3.js';
import {bundle} from '../part-1/bundle.js';
const $=id=>document.getElementById(id), endpoint='https://formspree.io/f/xdeeqgyg', maxBytes=25_000_000;
const scripts={'BRIEF-SHORT':"Now, you're going to talk about a topic for one to two minutes. You'll have one minute to prepare, and you can make notes. Please have some paper and a pencil ready. Try to keep speaking for two minutes.",'CARD-INTRO':'Here is your topic. The points on the card will help you organise your talk.','PREP-START':'You have one minute to prepare. You can make notes. Your preparation time starts now.','SPEAK-START':'Please begin speaking now.','END-EARLY':'Thank you.','CLOSE':'That is the end of this Part Two practice.'};
let state='setup',stream,recorder,attempt,card,blob,archive,answerURL,zipURL,clockTimer,startTime,finishPromise,resumePrompt,sending=false,sent=false,packaging=false;
const status=s=>$('status').textContent=s;
const stamp=()=>new Date().toISOString();
const event=(type,extra={})=>attempt.events.push({type,at:stamp(),...extra});
const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s)%60).padStart(2,'0')}`;
const release=()=>{stream?.getTracks().forEach(t=>{t.onended=null;t.stop();});stream=null;};
function submitControl(){$('submit').disabled=!archive||archive.size>maxBytes||!$('upload-consent').checked||sending||sent||packaging||!attempt?.complete;}
for(const c of cards){const o=document.createElement('option');o.value=c.id;o.textContent=`${c.id} · ${c.title}`;$('card-select').append(o);}
function renderCard(){const lines=card.text.split('\n');$('cue-card').replaceChildren();const h=document.createElement('h2');h.textContent=lines[0];$('cue-card').append(h);const label=document.createElement('p');label.textContent='You should say:';const ul=document.createElement('ul');for(const line of lines.filter(l=>l.startsWith('- '))){const li=document.createElement('li');li.textContent=line.slice(2);ul.append(li);}const ending=document.createElement('p');ending.textContent=lines.filter(Boolean).at(-1);$('cue-card').append(label,ul,ending);}
async function prompt(id){
 const player=$('examiner');$('phase').textContent='Listen to the practice examiner';$('prompt-text').textContent=scripts[id];$('prompt-fallback').hidden=false;$('prompt-fallback').open=false;
 const asset=`P2-S01-${id}`;event('prompt_requested',{audio_asset_id:asset});
 await new Promise(resolve=>{
 let settled=false,timeout;
 const done=()=>{if(settled)return;settled=true;clearTimeout(timeout);player.onended=null;player.onerror=null;resumePrompt=null;$('resume').hidden=true;event('prompt_ended',{audio_asset_id:asset});resolve();};
 const blocked=()=>{clearTimeout(timeout);player.pause();$('resume').hidden=false;status('Audio paused or unavailable. Tap to retry this prompt; timing waits until it finishes. You can also open “Can’t hear? Read the prompt”.');event('prompt_retry_required',{audio_asset_id:asset});};
 const play=()=>{if(settled)return;$('resume').hidden=true;status('');player.currentTime=0;event('prompt_play',{audio_asset_id:asset});timeout=setTimeout(blocked,60000);player.play().catch(blocked);};
 player.onended=done;player.onerror=blocked;player.src=`assets/v0.2.0/${asset}.mp3`;resumePrompt=()=>{player.load();play();};play();
 });
}
$('resume').onclick=()=>resumePrompt?.();
async function begin(){
 if(state!=='setup'||!$('consent').checked||!$('student-id').value.trim())return;
 state='requesting';$('start').disabled=true;status('Checking microphone permission…');
 // Unlock the reusable media element directly inside the start gesture for Safari.
 const player=$('examiner');player.src='assets/v0.2.0/P2-S01-BRIEF-SHORT.mp3';player.muted=true;const unlock=player.play().then(()=>{player.pause();player.currentTime=0;player.muted=false;}).catch(()=>{player.muted=false;});
 try{
 stream=await navigator.mediaDevices.getUserMedia({audio:true});await unlock;
 card=cards.find(c=>c.id===$('card-select').value);
 attempt={schema_version:1,attempt_id:`P2-S01-${crypto.randomUUID()}`,student_identifier:$('student-id').value.trim(),recording_consent_at:stamp(),set_id:'ielts-speaking-part-2-set-1',content_version:'0.2.0',content_status_at_attempt:'draft',review_status:'pending_editorial_approval',card_id:card.id,exact_card_text_snapshot:card.text,instruction_version:'0.2.0',audio_asset_version:'0.2.0',audio_asset_ids:[],started_at_utc:stamp(),preparation_target_seconds:60,speaking_target_seconds:120,automatic_stop:false,practice_features_used:['learner_selected_card','noninterrupting','learner_controlled_finish'],events:[],complete:false};
 stream.getTracks().forEach(t=>t.onended=()=>{event('microphone_ended');if(state==='speaking')finish(true);else{status('Microphone disconnected. Reload to check permission and start again.');}});
 blob=null;archive=null;sent=false;$('upload-consent').checked=false;$('setup').hidden=true;$('result').hidden=true;$('practice').hidden=false;$('finish').hidden=true;renderCard();state='prompts';status('Microphone ready. Keep this page in the foreground.');
 await prompt('BRIEF-SHORT');await prompt('CARD-INTRO');await prompt('PREP-START');
 if(!stream?.active)throw Error('Microphone disconnected');
 state='preparing';$('phase').textContent='Preparation';$('prompt-text').textContent='';$('prompt-fallback').hidden=true;$('prompt-fallback').open=false;$('guidance').textContent='Start writing your notes now';startTime=performance.now();attempt.preparation_started_at=stamp();event('preparation_started');
 await new Promise(resolve=>{const tick=()=>{const elapsed=(performance.now()-startTime)/1000;$('clock').textContent=fmt(Math.max(0,Math.ceil(60-elapsed)));if(elapsed>=60){clearInterval(clockTimer);resolve();}};tick();clockTimer=setInterval(tick,100);});
 attempt.preparation_duration_seconds=(performance.now()-startTime)/1000;attempt.preparation_ended_at=stamp();event('preparation_ended');state='prompts';await prompt('SPEAK-START');startRecording();
 }catch(e){clearInterval(clockTimer);release();state='setup';$('setup').hidden=false;$('practice').hidden=true;updateStart();status(`Could not begin: ${e.message}. Allow microphone access and try again.`);}
}
function startRecording(){
 const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t));
 recorder=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);const chunks=[];
 recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
 finishPromise=new Promise(resolve=>{recorder.onstop=()=>{attempt.capture_ended_at=stamp();event('capture_ended');blob=new Blob(chunks,{type:recorder.mimeType||chunks[0]?.type});release();resolve();};});
 recorder.onerror=()=>finish(true);
 recorder.start(250);startTime=performance.now();attempt.speaking_started_at=stamp();event('speaking_started');state='speaking';$('phase').textContent='Recording your answer';$('prompt-text').textContent='';$('prompt-fallback').hidden=true;$('prompt-fallback').open=false;$('finish').hidden=false;$('finish').disabled=false;
 const tick=()=>{const s=(performance.now()-startTime)/1000;$('clock').textContent=`${fmt(s)} / 02:00`;$('phase-controls').classList.toggle('target',s>=120);$('guidance').textContent=s>=120?'Two-minute target reached. Recording continues until you finish.':'Aim for two minutes. Finish when you are ready.';};tick();clockTimer=setInterval(tick,200);
}
async function finish(interrupted=false){
 if(state!=='speaking')return;state='saving';$('finish').disabled=true;clearInterval(clockTimer);attempt.finish_requested_at=stamp();attempt.speaking_duration_seconds=(performance.now()-startTime)/1000;attempt.complete=!interrupted;event('finish_requested',{interrupted});recorder.stop();await finishPromise;
 if(!blob.size){status('No audio captured. Reload to try again.');return;}
 if(answerURL)URL.revokeObjectURL(answerURL);answerURL=URL.createObjectURL(blob);$('answer').src=answerURL;
 await prompt('END-EARLY');await prompt('CLOSE');attempt.finished_at_utc=stamp();attempt.audio_asset_ids=[...new Set(attempt.events.filter(e=>e.type==='prompt_ended').map(e=>e.audio_asset_id))];
 $('practice').hidden=true;$('result').hidden=false;state='result';status(interrupted?'Recording interrupted. Listen and practise again before submitting.':'Answer saved. Listen back and download your backup.');await packageAttempt();
}
async function packageAttempt(){
 if(!blob||packaging||sending)return;packaging=true;$('package').disabled=true;$('rerecord').disabled=true;$('new').disabled=true;submitControl();$('package-status').textContent='Converting your recording to MP3…';
 try{
 const mp3=await toMP3(blob);const ext=blob.type.includes('mp4')?'m4a':blob.type.includes('ogg')?'ogg':'webm';attempt.recording_reference=`${card.id}.mp3`;attempt.original_audio_mime=blob.type;attempt.audio_mime='audio/mpeg';attempt.audio_bytes=mp3.size;
 archive=await bundle([{name:`${card.id}.mp3`,blob:mp3},{name:`originals/${card.id}.${ext}`,blob},{name:'card.txt',blob:new Blob([`${card.id}\n\n${card.text}`])},{name:'attempt.json',blob:new Blob([JSON.stringify(attempt,null,2)],{type:'application/json'})}]);
 if(zipURL)URL.revokeObjectURL(zipURL);zipURL=URL.createObjectURL(archive);$('download').textContent='Download backup ZIP';$('download').href=zipURL;$('download').download=`${attempt.attempt_id}.zip`;$('download').hidden=false;$('package-status').textContent=`MP3 + original recording + exact card + metadata · ${(archive.size/1e6).toFixed(2)} MB${archive.size>maxBytes?' · Too large to upload. Download and share with your teacher.':''}`;
 }catch(e){archive=null;$('package-status').textContent=`MP3 conversion failed. Your recording is retained. Retry packaging: ${e.message}`;const a=$('download');a.href=answerURL;a.download=`${card.id}-original.${blob.type.includes('mp4')?'m4a':'webm'}`;a.textContent='Download original recording backup';a.hidden=false;}
 finally{packaging=false;$('package').disabled=false;$('rerecord').disabled=false;$('new').disabled=false;submitControl();}
}
function updateStart(){$('start').disabled=state!=='setup'||!$('consent').checked||!$('student-id').value.trim();}
$('consent').onchange=updateStart;$('student-id').oninput=updateStart;$('start').onclick=begin;$('finish').onclick=()=>finish();$('package').onclick=packageAttempt;$('upload-consent').onchange=submitControl;
function reset(){if(sending||packaging||!confirm('Have you downloaded your backup? A new attempt replaces this recording on the page.'))return;state='setup';$('result').hidden=true;$('setup').hidden=false;$('download').hidden=true;$('download').textContent='Download backup ZIP';$('phase-controls').classList.remove('target');$('submit').textContent='Submit Part 2';archive=null;blob=null;status('');updateStart();}
$('rerecord').onclick=reset;$('new').onclick=reset;
$('submit').onclick=async()=>{
 submitControl();if($('submit').disabled)return;sending=true;submitControl();$('rerecord').disabled=true;$('new').disabled=true;$('package').disabled=true;$('submit').textContent='Uploading…';const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),45000);
 try{
 const data=new FormData();data.append('student_identifier',attempt.student_identifier);data.append('submission_kind','IELTS Speaking Part 2');data.append('upload_consent','Agreed');data.append('upload_consent_at',stamp());data.append('attempt_id',attempt.attempt_id);data.append('attempt',JSON.stringify(attempt));data.append('attachment',archive,`${attempt.attempt_id}.zip`);
 const response=await fetch(endpoint,{method:'POST',body:data,headers:{Accept:'application/json'},signal:controller.signal});const body=await response.json().catch(()=>null);if(!response.ok||body?.ok!==true)throw Error(`Upload not confirmed (${response.status}). ${body?.errors?.map(e=>e.message).join(' ')||'Check ZIP upload access with your teacher.'}`);sent=true;status('Formspree accepted your attempt. Keep your backup. Your teacher must confirm receipt and attachment access.');
 }catch(e){status(`${e.name==='AbortError'?'Upload timed out.':e.message} Your backup is available. Check with your teacher before retrying to avoid duplicates. Reference: ${attempt.attempt_id}`);}
 finally{clearTimeout(timeout);sending=false;$('rerecord').disabled=false;$('new').disabled=false;$('package').disabled=false;$('submit').textContent=sent?'Accepted by Formspree':'Retry submission';submitControl();}
};
window.addEventListener('beforeunload',e=>{if(blob||!['setup','result'].includes(state)){e.preventDefault();e.returnValue='';}});
document.addEventListener('visibilitychange',()=>{if(attempt){event(document.hidden?'page_hidden':'page_visible');if(document.hidden&&state==='speaking')status('Keep this page in the foreground. Listen back for any interruption before submitting.');}});
if(!isSecureContext||!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){$('start').hidden=true;status('Use HTTPS in a browser that supports microphone recording.');}
