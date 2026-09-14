// A non-blocking timer. Stores elapsed state/deadlines; never stores or requests microphone audio.
export function createPracticeTimer({state,save,app}){
 state.timers=state.timers&&typeof state.timers==='object'?state.timers:{};
 function snapshot(id,seconds){
  const old=state.timers[id]||{};
  let remaining=Number.isFinite(old.remaining)?Math.max(0,Math.min(seconds,old.remaining)):seconds;
  let end=Number.isFinite(old.end)?old.end:null;
  if(end){remaining=Math.max(0,Math.min(seconds,Math.ceil((end-Date.now())/1000)));if(!remaining)end=null;}
  return {remaining,end};
 }
 const time=n=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
 function markup(id,seconds,label){const t=snapshot(id,seconds);return `<section class="practice-timer" data-timer="${id}" data-seconds="${seconds}" aria-label="${label}"><p>${label}</p><output class="timer-clock" aria-label="Time remaining">${time(t.remaining)}</output><div class="timer-buttons"><button data-timer-toggle>${t.end?'Pause timer':t.remaining?'Start timer':'Start again'}</button><button data-timer-reset>Reset timer</button></div><p class="timer-status" role="status">${t.remaining?'Use this timer or your phone timer. Continue is always available.':'Time is up. Stop this attempt and continue when ready.'}</p></section>`;}
 function update(){app.querySelectorAll('[data-timer]').forEach(el=>{
  const id=el.dataset.timer,seconds=Number(el.dataset.seconds),t=snapshot(id,seconds);
  el.querySelector('output').textContent=time(t.remaining);
  el.querySelector('[data-timer-toggle]').textContent=t.end?'Pause timer':t.remaining?'Start timer':'Start again';
  const status=t.remaining?'Use this timer or your phone timer. Continue is always available.':'Time is up. Stop this attempt and continue when ready.';
  if(el.querySelector('.timer-status').textContent!==status)el.querySelector('.timer-status').textContent=status;
  if(state.timers[id]?.end&&!t.end){state.timers[id]=t;save();}
 });}
 app.addEventListener('click',e=>{const b=e.target.closest('[data-timer-toggle],[data-timer-reset]');if(!b)return;
  const el=b.closest('[data-timer]'),id=el.dataset.timer,seconds=Number(el.dataset.seconds);let t=snapshot(id,seconds);
  if(b.hasAttribute('data-timer-reset'))t={remaining:seconds,end:null};
  else if(t.end)t.end=null;
  else {if(!t.remaining)t.remaining=seconds;t.end=Date.now()+t.remaining*1000;}
  state.timers[id]=t;save();update();
 });
 const tick=setInterval(update,250);window.addEventListener('pagehide',e=>{if(!e.persisted)clearInterval(tick);});
 function pauseVisible(){app.querySelectorAll('[data-timer]').forEach(el=>{const id=el.dataset.timer;const t=snapshot(id,Number(el.dataset.seconds));state.timers[id]={remaining:t.remaining,end:null};});save();}
 return {markup,pauseVisible};
}
