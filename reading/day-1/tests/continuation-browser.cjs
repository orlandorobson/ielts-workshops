const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.READING_PREVIEW_URL||'http://localhost:8000/reading/day-1/';
const key='ielts-reading-day-1-v1';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await context.addInitScript(()=>{const seed=sessionStorage.getItem('reading-test-seed');if(seed){localStorage.setItem('ielts-reading-day-1-v1',seed);sessionStorage.removeItem('reading-test-seed');}});
 const page=await context.newPage(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failed.push(r.url())});
 await page.goto(base);
 const meta=await page.evaluate(async()=>{const a=await import('./day-1.js'),b=await import('./continuation.js'),c=await import('./continuation-content.js');return {titles:a.screens.map(s=>s.title),stages:b.continuationStages.map(s=>({id:s.id,index:a.screens.findIndex(x=>x.id===s.id)})),tasks:b.tasks,content:c.continuation}});
 assert.equal(meta.titles.length,49);assert.equal(meta.stages.length,14);assert.deepEqual(meta.stages.map(s=>s.index),Array.from({length:14},(_,i)=>22+i));
 assert.equal(meta.titles[21],'Three tools you can use when reading stalls');assert.equal(meta.titles[36],'You Are What You Eat—Or Are You?');
 const start=async(id,extra={})=>{const n=typeof id==='number'?id:meta.stages.find(s=>s.id===id).index;await page.evaluate(({key,n,extra})=>{const s=JSON.parse(localStorage.getItem(key)||'{}');sessionStorage.setItem('reading-test-seed',JSON.stringify({...s,sequenceVersion:2,step:n,...extra}));},{key,n,extra});await page.reload();await page.locator('h1').waitFor();};
 const showTask=async()=>{if(await page.locator('.c-mobile-tabs').isVisible())await page.locator('[data-c-pane=task]').click();};
 const noOverflow=async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await page.locator('.c-pane:visible').evaluateAll(els=>els.every(e=>e.scrollWidth<=e.clientWidth+1)));};
 // Old draft migration preserves content location, earlier answers, checked work and notes.
 for(const [old,now]of [[16,16],[17,17],[21,21],[22,36],[23,37],[26,40]]){
  await page.evaluate(({key,old})=>sessionStorage.setItem('reading-test-seed',JSON.stringify({step:old,answers:{'heading-bedouin-0':[3]},checked:{'heading-bedouin-0':true},notes:{reflection:'keep this'},visited:[16,22,26]})),{key,old});await page.reload();
  const s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);assert.equal(s.step,now);assert.deepEqual(s.answers['heading-bedouin-0'],[3]);assert.equal(s.notes.reflection,'keep this');assert(s.visited.includes(36)&&s.visited.includes(40));await page.reload();assert.equal((await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key)).step,now);
 }
 await start(17);await page.locator('[data-reveal=bedouin-map-0]').click();assert(await page.locator('#bedouin-map-0').isVisible());await start(18);await page.locator('[data-middle]').click();assert(!await page.locator('.embedded').isVisible());await page.locator('[data-middle]').click();assert(await page.locator('.embedded').isVisible());
 // All new stages remain traversable with unanswered tasks and unopened optional support.
 for(const width of [1440,1280,768,390,360,320]){
  await page.setViewportSize({width,height:900});await start(22,{continuation:{}});
  for(let n=22;n<=35;n++){assert.equal(await page.locator('h1').innerText(),meta.titles[n]);await noOverflow();const taskId=meta.stages[n-22].id;assert.equal(await page.locator('[data-c-check]').count(),meta.tasks[taskId]?1:0);assert.equal(await page.locator('[data-check],[data-answer]').count(),0);await page.locator('#next').click();}
  assert.equal(await page.locator('h1').innerText(),meta.titles[36]);
 }
 await page.setViewportSize({width:1440,height:1000});
 // Both complete passages are verbatim, including the distinct researchers' urban-air-quality view.
 for(const [id,data]of [['ev-read',meta.content.ev],['football-read',meta.content.football]]){await start(id);assert.deepEqual(await page.locator('.c-full-passage .passage').allInnerTexts(),data.paragraphs);await page.locator('.help summary').click();for(const [word,meaning]of data.vocabulary)assert((await page.locator('.vocabulary').innerText()).includes(meaning));await page.locator('.help summary').click();assert(!await page.locator('.vocabulary').isVisible());}
 async function fillTask(task,mode='correct'){
  for(const [i,item]of task.items.entries()){
   const id=task.id+'-'+i,field=page.locator(`[name="${id}"]`);
   if(task.kind==='retrieval'){await field.fill(mode==='correct'?item.accepted[0]:'Not sure');}
   else if(task.kind==='summary'){const answer=mode==='correct'?item.answer:item.options.find(o=>o.value!==item.answer).value;await page.locator(`[name="${id}"][value="${answer}"]`).check();}
   else{await field.selectOption(mode==='correct'?item.answer:'?');}
  }
 }
 let answers=0;
 for(const task of Object.values(meta.tasks)){
  await start(task.id,{continuation:{}});assert.equal(await page.locator('[data-c-check]').count(),1);assert(!await page.locator('.c-results').isVisible());
  assert.equal(await page.locator('.c-task').evaluate(f=>{const items=[...f.querySelectorAll('.c-item')];return !!(items.at(-1).compareDocumentPosition(f.querySelector('[data-c-check]'))&Node.DOCUMENT_POSITION_FOLLOWING)}),true);
  await page.locator('[data-c-check]').click();assert.match(await page.locator('.c-check-notice').innerText(),/Attempt all/);assert(!await page.locator('.c-results').isVisible());assert(await page.locator('#next').isEnabled());
  await fillTask(task,'wrong');await page.locator('[data-c-check]').click();assert.match(await page.locator('.c-result-summary').innerText(),new RegExp('^0 / '+task.items.length));assert(await page.locator('#next').isEnabled());
  await fillTask(task);assert(!await page.locator('.c-results').isVisible());await page.locator('[data-c-check]').click();assert.match(await page.locator('.c-result-summary').innerText(),new RegExp('^'+task.items.length+' / '+task.items.length));
  for(let i=0;i<task.items.length;i++){const result=page.locator('.c-result').nth(i);assert(!await result.locator('blockquote').isVisible());await result.locator('summary').click();assert.equal(await result.locator('blockquote').innerText(),task.items[i].evidence);}
  await page.reload();assert.match(await page.locator('.c-result-summary').innerText(),new RegExp('^'+task.items.length+' / '+task.items.length));answers+=task.items.length;
 }
 assert.equal(answers,39);
 // Duplicate person letters are allowed in the approved final keys.
 for(const [id,indexes,answer]of [['ev-task-b',[3,4],'D'],['football-task-b',[3,5],'A']]){await start(id);const task=meta.tasks[id];await fillTask(task);for(const i of indexes)assert(!(await page.locator(`#${id}-${i} option[value=${answer}]`).isDisabled()));await page.locator('[data-c-check]').click();assert.match(await page.locator('.c-result-summary').innerText(),/^6 \/ 6/);}
 // All approved free-text equivalents and common equivalent wording are recognised.
 await start('football-stakeholders');for(const [i,item]of meta.tasks['football-stakeholders'].items.entries()){for(const variant of item.accepted){await page.locator(`#football-stakeholders-${i}`).fill('  '+variant.toUpperCase()+'  ');await page.locator('[data-c-check]').click();assert.match(await page.locator('.c-result').nth(i).innerText(),/That fits the text/);}}
 // EV model: progressive phrases -> simple meaning -> relevant passage; no matching key on entry.
 await start('ev-unpack',{continuation:{}});assert.equal(await page.locator('.c-reveal-stage').count(),0);for(let i=1;i<=5;i++){await page.locator('[data-c-progress=ev-unpack]').click();assert.equal(await page.locator('.c-reveal-stage').count(),i);}assert((await page.locator('.c-task-pane').innerText()).includes(meta.content.ev.unpack.simple));assert((await page.locator('.c-task-pane').innerText()).includes(meta.content.ev.unpack.extract));
 await start('ev-reasoning',{continuation:{}});await page.locator('[data-c-progress=ev-reasoning]').click();assert.equal(await page.locator('.c-reveal-stage').count(),0);assert(await page.locator('#next').isEnabled());await page.locator('[name=ev-summary-0][value=B]').check();for(let i=0;i<5;i++)await page.locator('[data-c-progress=ev-reasoning]').click();assert.equal(await page.locator('.c-reason-node').count(),4);assert.match(await page.locator('.c-task-pane').innerText(),/where its electricity comes from/);
 // Football asks for an attempt before exposing the model; notes and marked phrases persist.
 await start('football-unpack',{continuation:{}});await page.locator('[data-c-progress=football-unpack]').click();assert.equal(await page.locator('.c-reveal-stage').count(),0);await page.locator('[data-c-mark="3"]').click();await page.locator('[data-c-note]').fill('Games may change what improvement feels like.');for(let i=0;i<3;i++)await page.locator('[data-c-progress=football-unpack]').click();assert.match(await page.locator('.c-task-pane').innerText(),/expectations.*improvement/s);await page.reload();assert.equal(await page.locator('[data-c-note]').inputValue(),'Games may change what improvement feels like.');assert.equal(await page.locator('[data-c-mark="3"]').getAttribute('aria-pressed'),'true');
 await start('football-language');await page.locator('.c-task-pane details').evaluateAll(els=>els.forEach(e=>e.open=true));for(const [word,meaning]of [...meta.content.football.smallWords,...meta.content.football.repairs])assert((await page.locator('.c-task-pane').innerText()).includes(meaning));assert.equal(await page.locator('[data-c-check]').count(),0);
 // Mobile pane switching restores BOTH independent reading positions and input values.
 for(const width of [390,360]){
  await page.setViewportSize({width,height:844});await start('football-task-b',{continuation:{}});
  await page.locator('.c-passage-pane').evaluate(e=>{e.scrollTop=650;e.dispatchEvent(new Event('scroll'))});const passageTop=await page.locator('.c-passage-pane').evaluate(e=>e.scrollTop);
  await showTask();await page.locator('#football-task-b-4').selectOption('C');await page.locator('.c-task-pane').evaluate(e=>{e.scrollTop=430;e.dispatchEvent(new Event('scroll'))});const taskTop=await page.locator('.c-task-pane').evaluate(e=>e.scrollTop);
  await page.locator('[data-c-pane=passage]').click();assert(Math.abs(await page.locator('.c-passage-pane').evaluate(e=>e.scrollTop)-passageTop)<3);
  await page.locator('[data-c-pane=task]').click();assert(Math.abs(await page.locator('.c-task-pane').evaluate(e=>e.scrollTop)-taskTop)<3);assert.equal(await page.locator('#football-task-b-4').inputValue(),'C');
  await page.reload();assert(await page.locator('.c-task-pane').isVisible());assert(Math.abs(await page.locator('.c-task-pane').evaluate(e=>e.scrollTop)-taskTop)<3);await noOverflow();
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/tmp/continuation-mobile-${width}.png`,fullPage:true});
  await page.locator('[data-c-pane=passage]').click();assert(Math.abs(await page.locator('.c-passage-pane').evaluate(e=>e.scrollTop)-passageTop)<3);
 }
 await page.setViewportSize({width:1440,height:1000});await start('ev-task-a');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/continuation-laptop.png',fullPage:true});
 // Keyboard-only selection and checking.
 await start('ev-task-a',{continuation:{}});await page.locator('#ev-task-a-0').focus();await page.keyboard.press('c');await page.keyboard.press('Tab');assert.equal(await page.locator('#ev-task-a-0').inputValue(),'C');await fillTask(meta.tasks['ev-task-a']);await page.locator('[data-c-check]').focus();await page.keyboard.press('Enter');assert.match(await page.locator('.c-result-summary').innerText(),/^4 \/ 4/);
 // Malformed nested state recovers; denied localStorage never prevents the continuation.
 await start('ev-summary',{continuation:{answers:[],checked:null,panes:[],progress:{'ev-unpack':-9},positions:{bad:'bad'},marked:[]}});await page.locator('[data-c-check]').click();assert(await page.locator('#next').isEnabled());
 const denied=await browser.newContext({viewport:{width:390,height:844}});await denied.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Blocked')}}));const dp=await denied.newPage();dp.on('pageerror',e=>errors.push(e.message));await dp.goto(base);await dp.locator('#menu summary').click();await dp.locator('[data-jump="22"]').click();for(let i=22;i<36;i++)await dp.locator('#next').click();assert.equal(await dp.locator('h1').innerText(),meta.titles[36]);assert.match(await dp.locator('#storage-note').innerText(),/Saving is unavailable/);
 await page.goto(base+'teacher-control/');assert.equal(await page.locator('section').count(),12);assert.match(await page.locator('#guide').innerText(),/Steps 23–29/i);assert.match(await page.locator('#guide').innerText(),/Steps 30–36/i);
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);await browser.close();console.log('PASS: 14 added stages / 8 complete tasks / 39 keys; 6 viewport widths; one check per set; exact passages; support and vocabulary; duplicates; retrieval equivalents; old/new state, two-pane position recovery, keyboard, no bottlenecks or console errors.');
})().catch(e=>{console.error(e);process.exit(1)});
