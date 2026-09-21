import { DurableObject } from 'cloudflare:workers';
import { workshops } from '../../shared/classroom/workshops.js';
const lifetime = 8 * 60 * 60 * 1000;
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const codePattern = /^[A-HJ-NP-Z2-9]{6}$/;
const json = (data,status=200) => Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const hash = async value => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),n=>n.toString(16).padStart(2,'0')).join('');
function randomCode(){return Array.from(crypto.getRandomValues(new Uint8Array(6)),n=>alphabet[n%alphabet.length]).join('');}
function randomToken(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');}
async function body(request){
 if(!request.body)return {};
 const reader=request.body.getReader();let size=0,text='';const decoder=new TextDecoder();
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>1024){await reader.cancel();throw new Error('body');}text+=decoder.decode(value,{stream:true});}
 const data=JSON.parse(text+decoder.decode());if(!data||Array.isArray(data)||typeof data!=='object')throw new Error('body');return data;
}
const publicState=s=>({code:s.code,workshop:s.workshop,createdAt:s.createdAt,expiresAt:s.expiresAt,released:s.released});
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin');
  const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim());
  if(origin&&!allowed.includes(origin))return json({error:'origin'},403);
  const cors={'Access-Control-Allow-Origin':origin||allowed[0]||'', 'Vary':'Origin','Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Max-Age':'86400','Cache-Control':'no-store'};
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  let response;
  try {
   const url=new URL(request.url);
   if(url.pathname==='/v1/classes'&&request.method==='POST'){
    const input=await body(request);
    if(Object.keys(input).some(k=>k!=='workshop')||!Object.hasOwn(workshops,input.workshop))response=json({error:'workshop'},400);
    else {
     for(let attempt=0;attempt<5;attempt++){
      const code=randomCode(),token=randomToken(),createdAt=Date.now();
      const state={code,workshop:input.workshop,released:[],createdAt,expiresAt:createdAt+lifetime,teacherHash:await hash(token)};
      const stub=env.CLASSROOMS.get(env.CLASSROOMS.idFromName(code));
      response=await stub.fetch(new Request('https://classroom/internal/create',{method:'POST',body:JSON.stringify(state)}));
      if(response.status===409)continue;
      if(response.ok)response=json({...publicState(state),teacherToken:token},201);
      break;
     }
    }
   }else{
    const match=url.pathname.match(/^\/v1\/classes\/([A-Z2-9]{6})(\/release|\/stream)?$/);
    if(!match||!codePattern.test(match[1]))response=json({error:'invalid'},404);
    else if((!match[2]&&request.method==='GET')||(match[2]==='/stream'&&request.method==='GET')||(match[2]==='/release'&&request.method==='POST')){
     if(!Object.hasOwn(workshops,url.searchParams.get('workshop')))response=json({error:'workshop'},400);
     else response=await env.CLASSROOMS.get(env.CLASSROOMS.idFromName(match[1])).fetch(request);
    }else response=json({error:'method'},405);
   }
  }catch{response=json({error:'unavailable'},400);}
  if(response.status===101)return response;
  const output=new Response(response.body,response);Object.entries(cors).forEach(([k,v])=>output.headers.set(k,v));return output;
 }
};
export class Classroom extends DurableObject {
 constructor(ctx,env){super(ctx,env);ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping','pong'));}
 async fetch(request){
  const url=new URL(request.url);
  if(url.pathname==='/internal/create'){
   const input=await request.json();
   return this.ctx.blockConcurrencyWhile(async()=>{
    if(await this.ctx.storage.get('session'))return json({error:'exists'},409);
    await this.ctx.storage.put('session',input);await this.ctx.storage.setAlarm(input.expiresAt);
    return json({created:true},201);
   });
  }
  const state=await this.ctx.storage.get('session');
  if(!state)return json({error:'invalid-or-expired'},404);
  if(Date.now()>=state.expiresAt){await this.alarm();return json({error:'expired'},410);}
  if(url.searchParams.get('workshop')!==state.workshop)return json({error:'wrong-workshop'},409);
  if(url.pathname.endsWith('/release')){
   const token=request.headers.get('Authorization')?.replace(/^Bearer /,'')||'';
   if(!/^[a-f0-9]{64}$/.test(token)||await hash(token)!==state.teacherHash)return json({error:'teacher-only'},403);
   const input=await body(request),ids=workshops[state.workshop].map(s=>s.id);
   if(Object.keys(input).some(k=>!['activity','all'].includes(k))||!(input.all===true&&!input.activity||input.all===undefined&&ids.includes(input.activity)))return json({error:'activity'},400);
   // Atomic union prevents simultaneous teacher commands overwriting each other.
   const updated=await this.ctx.storage.transaction(async tx=>{
    const current=await tx.get('session');if(!current||Date.now()>=current.expiresAt)return null;
    current.released=input.all?ids:[...new Set([...current.released,input.activity])];await tx.put('session',current);return current;
   });
   if(!updated)return json({error:'expired'},410);
   this.broadcast(publicState(updated));return json(publicState(updated));
  }
  if(url.pathname.endsWith('/stream')){
   if(request.headers.get('Upgrade')?.toLowerCase()!=='websocket')return json({error:'upgrade'},426);
   if(this.ctx.getWebSockets().length>=100)return json({error:'capacity'},429);
   const [client,server]=Object.values(new WebSocketPair());this.ctx.acceptWebSocket(server);
   server.send(JSON.stringify(publicState(state)));
   return new Response(null,{status:101,webSocket:client});
  }
  return json(publicState(state));
 }
 broadcast(state){for(const socket of this.ctx.getWebSockets()){try{socket.send(JSON.stringify(state));}catch{socket.close(1011,'Reconnect');}}}
 // Read-only sockets accept only automatic ping/pong; never release commands.
 webSocketMessage(socket){socket.close(1008,'Read only');}
 webSocketClose(socket,code){socket.close(code);}
 webSocketError(socket){socket.close(1011,'Reconnect');}
 async alarm(){
  const state=await this.ctx.storage.get('session');
  if(state&&Date.now()<state.expiresAt){await this.ctx.storage.setAlarm(state.expiresAt);return;}
  this.broadcast({error:'expired'});
  for(const socket of this.ctx.getWebSockets())socket.close(1000,'Session ended');
  await this.ctx.storage.deleteAll();
 }
}
