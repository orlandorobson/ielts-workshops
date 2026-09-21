import {serviceURL} from './config.js';
export async function api(path,{method='GET',body,token}={}){
 if(!serviceURL)throw new Error('not-configured');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
 try {
  const headers={};if(body)headers['Content-Type']='application/json';if(token)headers.Authorization=`Bearer ${token}`;
  const response=await fetch(serviceURL+path,{method,headers,body:body?JSON.stringify(body):undefined,signal:controller.signal,cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});
  const data=await response.json();if(!response.ok){const error=new Error(data.error||'unavailable');error.status=response.status;throw error;}return data;
 }finally{clearTimeout(timer);}
}
export class ClassroomConnection {
 constructor(workshop,activities){
  this.workshop=workshop;this.allowed=activities.map(s=>s.id);this.key=`ielts-classroom-v1:${workshop}`;this.listeners=new Set();this.released=[];this.status='disconnected';this.code='';this.generation=0;this.failures=0;
  try{const saved=JSON.parse(localStorage.getItem(this.key));if(saved?.service===serviceURL&&saved.expiresAt>Date.now()){this.code=saved.code;this.expiresAt=saved.expiresAt;this.createdAt=saved.createdAt;}}catch{}
  window.addEventListener('online',()=>this.resume());
  window.addEventListener('offline',()=>{if(this.code){this.stop();this.status='reconnecting';this.emit();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.stop();else this.resume();});
  window.addEventListener('pageshow',()=>this.resume());
  window.addEventListener('pagehide',()=>this.stop());
 }
 subscribe(callback){this.listeners.add(callback);return ()=>this.listeners.delete(callback);}
 emit(){for(const callback of this.listeners)callback(this);}
 isOpen(id){return !!this.code&&this.expiresAt>Date.now()&&this.released.includes(id);}
 read(){return {released:this.expiresAt>Date.now()?this.released:[]};}
 forget(message=''){
  this.stop();clearTimeout(this.expiryTimer);this.code='';this.released=[];this.expiresAt=0;this.createdAt=0;this.status='disconnected';this.message=message;
  try{localStorage.removeItem(this.key);}catch{}this.emit();
 }
 stop(){
  this.generation++;clearTimeout(this.retry);clearTimeout(this.heartbeat);clearTimeout(this.pongTimer);clearTimeout(this.openTimer);
  if(this.socket){this.socket.onclose=null;this.socket.close();this.socket=null;}
 }
 start(){if(!serviceURL){this.message='Class connection is not set up yet. You can keep working.';this.emit();return;}if(this.code)this.resume();else this.emit();}
 connect(code){
  const clean=code.trim().toUpperCase().replace(/\s/g,'');
  if(!/^[A-HJ-NP-Z2-9]{6}$/.test(clean)){this.message='Check the six-character class code with your teacher.';this.emit();return;}
  this.forget();this.code=clean;this.status='connecting';this.emit();this.resume();
 }
 resume(){
  if(!this.code||document.hidden)return;
  if(this.expiresAt&&this.expiresAt<=Date.now()){this.forget('This class has ended. Ask your teacher for a new code.');return;}
  this.stop();this.status='reconnecting';this.emit();if(navigator.onLine)this.sync(this.generation,true);
 }
 path(suffix=''){return `/v1/classes/${this.code}${suffix}?workshop=${encodeURIComponent(this.workshop)}`;}
 accept(data){
  if(data.error==='expired'){this.forget('This class has ended. Ask your teacher for a new code.');return false;}
  if(data.code!==this.code||data.workshop!==this.workshop||!Array.isArray(data.released)||!Number.isFinite(data.expiresAt)||data.expiresAt<=Date.now())return false;
  if(this.createdAt&&this.createdAt!==data.createdAt){this.forget('This class has ended. Ask your teacher for a new code.');return false;}
  this.createdAt=data.createdAt;this.expiresAt=data.expiresAt;this.released=data.released.filter(id=>this.allowed.includes(id));this.status='connected';this.message='';this.failures=0;
  try{localStorage.setItem(this.key,JSON.stringify({service:serviceURL,code:this.code,createdAt:this.createdAt,expiresAt:this.expiresAt}));}catch{}
  clearTimeout(this.expiryTimer);this.expiryTimer=setTimeout(()=>this.forget('This class has ended. Ask your teacher for a new code.'),Math.max(1,this.expiresAt-Date.now()));this.emit();return true;
 }
 async sync(generation,openSocket=false){
  try{
   const data=await api(this.path());if(generation!==this.generation)return;
   if(!this.accept(data)){this.forget('That code is not available for this workshop. Check with your teacher.');return;}
   if(openSocket)this.openSocket(generation);else this.schedule(generation,5000);
  }catch(error){
   if(generation!==this.generation)return;
   if([404,410,409].includes(error.status)){this.forget('That code is invalid or has expired. Check with your teacher.');return;}
   this.status='reconnecting';this.message='';this.emit();this.failures++;this.schedule(generation,Math.min(30000,5000*2**Math.min(this.failures-1,3)),true);
  }
 }
 schedule(generation,delay,openSocket=false){
  clearTimeout(this.retry);if(!this.code||document.hidden||!navigator.onLine)return;
  this.retry=setTimeout(()=>{if(generation===this.generation)this.sync(generation,openSocket);},delay);
 }
 openSocket(generation){
  const url=new URL(serviceURL+this.path('/stream'));url.protocol=url.protocol==='https:'?'wss:':'ws:';
  const socket=new WebSocket(url);this.socket=socket;
  this.openTimer=setTimeout(()=>socket.close(),5000);
  socket.onopen=()=>{clearTimeout(this.openTimer);this.pingLater(generation);};
  socket.onmessage=event=>{
   if(generation!==this.generation)return;
   if(event.data==='pong'){clearTimeout(this.pongTimer);this.pingLater(generation);return;}
   try{this.accept(JSON.parse(event.data));}catch{}
  };
  socket.onerror=()=>socket.close();
  socket.onclose=()=>{
   clearTimeout(this.openTimer);clearTimeout(this.heartbeat);clearTimeout(this.pongTimer);
   if(generation!==this.generation||!this.code)return;this.socket=null;this.status='reconnecting';this.emit();
   // On blocked WebSockets, simple read-only five-second polling. Visibility/online
   // changes retry push; failed HTTP requests back off to at most one per 30s.
   this.schedule(generation,5000);
  };
 }
 pingLater(generation){
  clearTimeout(this.heartbeat);this.heartbeat=setTimeout(()=>{
   if(generation!==this.generation||this.socket?.readyState!==WebSocket.OPEN)return;
   this.socket.send('ping');this.pongTimer=setTimeout(()=>this.socket?.close(),10000);
  },30000);
 }
}
export function mountStudentConnection(connection,before){
 const panel=document.createElement('section');panel.className='classroom-connection';panel.setAttribute('aria-label','Class connection');
 panel.innerHTML='<form id="class-connect-form"><label for="class-code">Class code</label><p class="muted">Enter the code from your teacher.</p><div class="actions"><input id="class-code" type="text" maxlength="6" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-describedby="class-status" required><button>Connect</button></div></form><div class="connection-summary" hidden><span></span><button type="button" class="secondary">Change class</button></div><p id="class-status" role="status"></p>';
 before.before(panel);const form=panel.querySelector('form'),summary=panel.querySelector('.connection-summary'),status=panel.querySelector('#class-status');
 form.addEventListener('submit',event=>{event.preventDefault();connection.connect(form.querySelector('input').value);});
 summary.querySelector('button').addEventListener('click',()=>{connection.forget();form.querySelector('input').focus();});
 const update=()=>{form.hidden=!!connection.code;summary.hidden=!connection.code;summary.querySelector('span').textContent=connection.status==='connected'?'Connected ✓':'Reconnecting…';status.textContent=connection.message||(connection.code&&connection.status!=='connected'?'Your work stays here. We’ll reconnect automatically.':'');};
 connection.subscribe(update);update();connection.start();return panel;
}
