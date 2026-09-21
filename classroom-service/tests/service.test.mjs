import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
const bundled=await build({entryPoints:[fileURLToPath(new URL('../src/worker.js',import.meta.url))],bundle:true,format:'esm',platform:'neutral',external:['cloudflare:workers'],write:false});
const make=()=>new Miniflare(convertV4MiniflareOptions({unsafeInspectDurableObjects:true,workers:[{name:'test-release',modules:true,script:bundled.outputFiles[0].text,compatibilityDate:'2026-09-21',bindings:{ALLOWED_ORIGINS:'http://localhost:8000'},durableObjects:{CLASSROOMS:{className:'Classroom',useSQLite:true}}}]}));
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
test('real workerd: read-only code, atomic releases, socket hibernation and expiry cleanup',async()=>{
 const mf=make();
 try{
 const dispatch=(path,options={})=>mf.dispatchFetch('http://service'+path,options);
 const create=await dispatch('/v1/classes',{method:'POST',body:JSON.stringify({workshop:'listening-day-1'})});assert.equal(create.status,201);const session=await create.json();
 assert.match(session.code,/^[A-HJ-NP-Z2-9]{6}$/);assert.equal(session.expiresAt-session.createdAt,8*60*60*1000);
 const path='/v1/classes/'+session.code,query='?workshop=listening-day-1';
 const state=await (await dispatch(path+query)).json();assert.deepEqual(Object.keys(state).sort(),['code','createdAt','expiresAt','released','workshop']);
 for(const token of ['',session.code,'0'.repeat(64)])assert.equal((await dispatch(path+'/release'+query,{method:'POST',headers:{Authorization:'Bearer '+token},body:'{"all":true}'})).status,403);
 assert.equal((await dispatch('/v1/classes',{method:'POST',body:'{"workshop":"listening-day-1","scores":[20]}'})).status,400);
 assert.equal((await dispatch(path+query,{headers:{Origin:'https://wrong.example'}})).status,403);
 assert.equal((await dispatch(path+'?workshop=speaking-day-1')).status,400);
 const socketResponse=await dispatch(path+'/stream'+query,{headers:{Upgrade:'websocket'}});assert.equal(socketResponse.status,101);const socket=socketResponse.webSocket;socket.accept();const messages=[];socket.addEventListener('message',event=>messages.push(event.data));
 const release=activity=>dispatch(path+'/release'+query,{method:'POST',headers:{Authorization:'Bearer '+session.teacherToken},body:JSON.stringify({activity})});
 await Promise.all([release('spell1'),release('l14')]);assert.deepEqual(new Set((await (await dispatch(path+query)).json()).released),new Set(['spell1','l14']));
 await mf.unsafeEvictDurableObject('test-release','Classroom',{name:session.code,webSockets:'hibernate'});
 await release('l15');await wait(100);assert.ok(messages.some(m=>m.includes('l15')),'hibernating socket receives next release');
 socket.send('ping');await wait(100);assert.ok(messages.includes('pong'));
 // Any student socket message other than the static heartbeat is rejected.
 socket.send('{"all":true}');await wait(100);assert.equal((await (await dispatch(path+query)).json()).released.length,3);
 // Test-only direct namespace access creates a genuinely expiring object, without
 // adding a production API, override credential or debug route.
 const ns=await mf.getDurableObjectNamespace('CLASSROOMS');const stub=ns.get(ns.idFromName('ABC234'));const now=Date.now();
 const expiry={...session,code:'ABC234',teacherHash:'not-a-real-token',expiresAt:now+300,createdAt:now,released:[]};delete expiry.teacherToken;
 assert.equal((await stub.fetch('https://classroom/internal/create',{method:'POST',body:JSON.stringify(expiry)})).status,201);
 await wait(800);const gone=await dispatch('/v1/classes/ABC234'+query);assert.ok([404,410].includes(gone.status));
 // A new internal creation succeeds only if expiry deleted ALL prior session data.
 assert.equal((await stub.fetch('https://classroom/internal/create',{method:'POST',body:JSON.stringify({...expiry,expiresAt:Date.now()+10000})})).status,201);
 const storage=await mf.unsafeGetDurableObjectStorage('test-release','Classroom',{name:session.code});const tables=await storage.exec("SELECT name FROM sqlite_master WHERE type='table'");assert.ok(tables.length>0,'real SQLite-backed storage');
 }finally{await mf.dispose();}
});

test('Day 2 registry: isolated workshop, scoped releases, two final activities',async()=>{
 const mf=make();try{
 const dispatch=(path,options={})=>mf.dispatchFetch('http://service'+path,options);
 const result=await dispatch('/v1/classes',{method:'POST',body:JSON.stringify({workshop:'listening-day-2'})});assert.equal(result.status,201);const s=await result.json();
 const path=`/v1/classes/${s.code}`,query='?workshop=listening-day-2';
 assert.equal((await dispatch(path+'?workshop=listening-day-1')).status,409);
 const release=(body,token=s.teacherToken)=>dispatch(path+'/release'+query,{method:'POST',headers:{Authorization:'Bearer '+token},body:JSON.stringify(body)});
 assert.equal((await release({all:true},s.code)).status,403);
 assert.equal((await release({activity:'l14'})).status,400);
 assert.equal((await release({activity:'unknown'})).status,400);
 assert.equal((await release({activity:'l29'})).status,200);
 assert.deepEqual((await (await dispatch(path+query)).json()).released,['l29']);
 await release({all:true});assert.deepEqual(new Set((await (await dispatch(path+query)).json()).released),new Set(['l21','l22','l23','l24','l25','l26','l27','l28','l29','l210']));
 }finally{await mf.dispose();}
});
