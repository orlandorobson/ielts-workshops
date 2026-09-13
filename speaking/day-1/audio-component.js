// All Day 1 playback uses this native, keyboard-accessible player.
export function audioComponent({id,label,src=null,transcript='',transcriptOpen=false,speeds=[]},esc) {
  const speedControls=speeds.length?`<div class="speed-controls" role="group" aria-label="Playback speed for ${esc(label)}">${speeds.map(speed=>`<button data-speed="${speed}" data-player="${id}" aria-label="Set ${esc(label)} playback speed to ${speed} times" aria-pressed="${speed===1}">${speed}×</button>`).join('')}</div>`:'';
  const playback=src
    ? `<audio id="${id}" aria-label="${esc(label)}" controls preload="metadata" src="${esc(src)}"></audio>${speedControls}<p class="audio-error" id="${id}-error" role="status" hidden>Audio could not load. You can still continue.</p>`
    : `<p class="audio-note">Audio is not available yet. You can continue.</p>`;
  const text=transcript?(transcriptOpen?`<div class="audio-transcript">${transcript}</div>`:`<details><summary>Read the transcript</summary>${transcript}</details>`):'';
  return `<article class="audio-card"><p class="audio-label">${esc(label)}</p>${playback}${text}</article>`;
}
export function bindAudio(app){
  app.addEventListener('play',e=>{
    if(!e.target.matches('audio'))return;
    app.querySelectorAll('audio').forEach(other=>{if(other!==e.target)other.pause();});
  },true);
  app.addEventListener('error',e=>{
    if(e.target.matches('audio')){
      const message=document.getElementById(e.target.id+'-error');
      if(message)message.hidden=false;
    }
  },true);
  app.addEventListener('click',e=>{
    const b=e.target.closest('[data-speed]');if(!b)return;
    const player=document.getElementById(b.dataset.player);
    player.playbackRate=Number(b.dataset.speed);
    b.parentElement.querySelectorAll('[data-speed]').forEach(button=>button.setAttribute('aria-pressed',String(button===b)));
  });
}
