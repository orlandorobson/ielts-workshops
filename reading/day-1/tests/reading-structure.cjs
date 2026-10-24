const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.READING_PREVIEW_URL||'http://localhost:8001/reading/day-1/';
const key='ielts-reading-day-1-v2';
const sizes=[[390,844],[768,1024],[844,390],[1023,768],[1024,768],[1199,800],[1200,800],[1280,800],[1440,900],[1920,1080]];
const workspaceSteps=[3,5,8,10,11,13,15,16,17,21,22,25,28,29,30,31,32,33,35,36,37,38,39,40,42,43,45,46,47,48,49];
const taskNames=['Flexible Working','Urban Trees','Large Language Model','Curitiba','Mohammed from Sohar','You Are What You Eat—Or Are You?','Bedouin life','Electric Vehicles','Digital Football','Ferrari','Amouage'];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 await context.addInitScript(()=>{
  if(!localStorage.getItem('structure-test-initialised')){localStorage.setItem('ielts-reading-day-1-v1','{"step":36,"visited":[36]}');localStorage.setItem('unrelated-workshop','keep');localStorage.setItem('structure-test-initialised','yes');}
  const seed=sessionStorage.getItem('structure-seed');if(seed){localStorage.setItem('ielts-reading-day-1-v2',seed);sessionStorage.removeItem('structure-seed');}
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});await page.goto(base);
 assert.match(await page.locator('h1').innerText(),/Seeing what the text is doing/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('ielts-reading-day-1-v1')),'{"step":36,"visited":[36]}');assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-workshop')),'keep');
 const meta=await page.evaluate(async()=>{const a=await import('./day-1.js'),c=await import('./content.js'),d=await import('./continuation.js'),e=await import('./luxury.js');return{screens:a.screens.map(s=>({title:s.title,group:s.group,passage:s.passageName,id:s.id})),groups:a.readingTasks,lesson:c.lesson,tasks:{...d.tasks,...e.luxuryTasks},data:(await import('./luxury-content.js')).luxury,continuation:(await import('./continuation-content.js')).continuation};});
 assert.equal(meta.screens.length,49);assert.deepEqual(await page.locator('#reading-task option').allTextContents(),taskNames);assert.equal(await page.locator('#reading-task').inputValue(),'');
 assert.equal(meta.screens[13].title,taskNames[5]);assert.equal(meta.screens[17].group,6);
 const start=async(n,extra={})=>{await page.evaluate(({n,extra})=>sessionStorage.setItem('structure-seed',JSON.stringify({step:n-1,sequenceVersion:3,...extra})),{n,extra});await page.reload();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));};
 const taskView=async()=>{const b=page.locator('[data-workspace-pane=task]');if(await b.isVisible())await b.click();};
 const noOverflow=async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await page.locator('.c-pane:visible').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1)));};
 // Every task can be entered forwards or backwards, always at its first screen.
 for(const i of [...taskNames.keys(),...taskNames.keys()].map((x,i)=>i<11?x:10-x)){
  await page.locator('#reading-task').selectOption({label:taskNames[i]});const first=meta.screens.findIndex(s=>s.group===meta.groups[i][0]);assert.equal(await page.locator('h1').innerText(),meta.screens[first].title);
  await page.locator('#next').click();assert.equal(await page.locator('#reading-task').inputValue(),String(meta.screens[first+1].group));await page.locator('#back').click();assert.equal(await page.locator('h1').innerText(),meta.screens[first].title);
 }
 // Traverse all screens, checking full passage fidelity and classification.
 const passages=[];
 await start(1);
 for(let n=1;n<=49;n++){
  const screen=meta.screens[n-1],workspace=workspaceSteps.includes(n);assert.equal(await page.locator('h1').innerText(),screen.title);assert.equal(await page.locator('.reading-workspace').count(),workspace?1:0);
  assert.equal(await page.locator('#reading-task').inputValue(),[0,10].includes(screen.group)?'':String(screen.group));
  assert.equal(await page.locator('[data-paragraph],[data-c-paragraph],[data-l-paragraph]').count(),0);
  let expected=screen.passage?meta.lesson.passages[screen.passage]:screen.id?.startsWith('ev-')?meta.continuation.ev.paragraphs:screen.id?.startsWith('football-')?meta.continuation.football.paragraphs:screen.id?.startsWith('ferrari-')&&screen.id!=='ferrari-bridge'?meta.data.ferrari.paragraphs:screen.id?.startsWith('amouage-')?meta.data.amouage.paragraphs:n===12?meta.lesson.passages.mohammed:null;
  if(expected){assert.deepEqual(await page.locator(workspace?'.c-passage-pane .passage':'#app .passage').allTextContents(),expected);passages.push(n);}
  if(workspace){assert(await page.locator('.c-task-pane').innerText());assert(await page.locator('.c-passage-pane').innerText());if(expected.length>1)assert.deepEqual(await page.locator('.c-passage-pane .c-paragraph > h3').allTextContents(),expected.map((_,i)=>'Paragraph '+String.fromCharCode(65+i)));}
  await noOverflow();if(n<49)await page.locator('#next').click();
 }
 assert.equal(await page.evaluate(key=>new Set(JSON.parse(localStorage.getItem(key)).visited).size,key),49);
 console.log('PASS navigation: 49 screens, 11 dropdown tasks, preserved introduction/reflection, Food order, complete passages:',passages.join(','));
 // Every workspace at every benchmark: layout, width, scroll independence and font scopes.
 if(!process.env.SKIP_BENCHMARKS)for(const [width,height]of sizes){
  await page.setViewportSize({width,height});await start(1);let minimum=Infinity;
  for(let n=1;n<=49;n++){
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   if(workspaceSteps.includes(n)){
    const panes=page.locator('.c-pane');assert.equal(await page.locator('.c-pane:visible').count(),width<1024?1:2);
    if(width>=1024){const geometry=await panes.evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,c:e.clientWidth-parseFloat(getComputedStyle(e).paddingLeft)-parseFloat(getComputedStyle(e).paddingRight)})));geometry.forEach(g=>assert(g.c>=400,`${n}/${width}: ${g.c}`));minimum=Math.min(minimum,...geometry.map(g=>g.c));assert(Math.abs(geometry[0].w/(geometry[0].w+geometry[1].w)*100-(width<1200?50:55))<.1);}
    assert(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight));
    const p=page.locator('.c-passage-pane'),q=page.locator('.c-task-pane');
    const ptop=await p.evaluate(e=>{e.scrollTop=180;return e.scrollTop});
    await taskView();const qtop=await q.evaluate(e=>{e.scrollTop=160;return e.scrollTop});
    if(width<1024){await page.locator('[data-workspace-pane=passage]').click();assert(Math.abs(await p.evaluate(e=>e.scrollTop)-ptop)<2,`passage scroll ${n}/${width}: expected ${ptop}, got ${await p.evaluate(e=>e.scrollTop)}`);await page.locator('[data-workspace-pane=task]').click();assert(Math.abs(await q.evaluate(e=>e.scrollTop)-qtop)<2,`question scroll ${n}/${width}: expected ${qtop}, got ${await q.evaluate(e=>e.scrollTop)}`);}else{assert(Math.abs(await p.evaluate(e=>e.scrollTop)-ptop)<2,`passage scroll ${n}/${width}: expected ${ptop}, got ${await p.evaluate(e=>e.scrollTop)}`);await p.evaluate(e=>e.scrollTop+=90);assert(Math.abs(await q.evaluate(e=>e.scrollTop)-qtop)<2,`question scroll ${n}/${width}: expected ${qtop}, got ${await q.evaluate(e=>e.scrollTop)}`);}
    const questionFont=await q.evaluate(e=>getComputedStyle(e).fontSize);
    for(const [size,line]of [[16,24.8],[18,28.8],[21,34.65]]){
     await page.locator(`button[data-passage-size="${size}"]`).click();await page.waitForFunction(size=>parseFloat(getComputedStyle(document.querySelector('.c-passage-pane .passage')).fontSize)===size,size);
     assert(Math.abs(await p.locator('.passage').first().evaluate(e=>parseFloat(getComputedStyle(e).lineHeight))-line)<.02);assert.equal(await q.evaluate(e=>getComputedStyle(e).fontSize),questionFont);assert.equal(await page.locator('.c-pane:visible').count(),width<1024?1:2);
    }
    await noOverflow();
   }else await noOverflow();
   if(n<49)await page.locator('#next').click();
  }
  console.log('PASS benchmark',width,height,'minimum two-pane width',minimum===Infinity?'n/a':minimum);
 }
 // Original question controls: check every rendered question, including all six explorers.
 await page.setViewportSize({width:1280,height:800});await start(1);let questionCount=0;
 const sourceQuestions=Object.fromEntries(Object.values(meta.lesson.questions).map(q=>[q.id,q]));
 for(let n=1;n<=49;n++){
  await taskView();await page.locator('#app details.help').evaluateAll(es=>es.forEach(e=>e.open=true));
  const ids=await page.locator('[data-check]').evaluateAll(es=>es.map(e=>e.dataset.check));
  for(const id of ids){
   let correct,expected;
   if(sourceQuestions[id]){correct=sourceQuestions[id].correct;expected=sourceQuestions[id].why;}
   else if(id.startsWith('heading-')){const [,name,index]=id.split('-');correct=[meta.lesson.keys[name][Number(index)]];expected=meta.lesson.feedback[name][Number(index)];}
   else if(id.startsWith('context-'))correct=[id==='context-230'?1:0];
   else if(id.startsWith('argument-')){const [,i,j]=id.split('-');correct=[[[0,1,4],[0,2,3],[0,2,1],[4],[5]][i][j]];}
   else throw Error('Unknown question '+id);
   const holder=page.locator(`[data-check="${id}"]`).locator('..').locator('..');
   await holder.locator('input').evaluateAll(es=>es.forEach(e=>{e.checked=false}));
   for(const value of correct)await page.locator(`input[name="${id}"][value="${value}"]`).check();
   await page.locator(`[data-check="${id}"]`).click();assert.match(await page.locator('#feedback-'+id).innerText(),/That fits the text/);if(expected)assert((await page.locator('#feedback-'+id).innerText()).includes(expected));questionCount++;
  }
  if(n<49)await page.locator('#next').click();
 }
 console.log('PASS original question checking',questionCount);
 // Whole-task checks retain blank, incorrect, correct and evidence behaviour.
 for(const [id,task]of Object.entries(meta.tasks)){
  const index=meta.screens.findIndex(s=>s.id===id);assert(index>=0,id);await start(index+1);await taskView();
  const prefix=id.startsWith('ev-')||id.startsWith('football-')?'c':'l';
  await page.locator(`[data-${prefix}-check]`).click();assert.match(await page.locator('.c-check-notice').innerText(),/Attempt all/);
  for(const [i,item]of task.items.entries()){
   const input=page.locator(`[name="${id}-${i}"]`);
   if(item.accepted)await input.fill('Not sure');else if(task.kind==='summary')await page.locator(`[name="${id}-${i}"][value="${item.options.find(o=>o.value!==item.answer).value}"]`).check();else await input.selectOption('?');
  }
  await page.locator(`[data-${prefix}-check]`).click();assert.match(await page.locator('.c-result-summary').innerText(),/^0 \/ /);
  for(const [i,item]of task.items.entries()){
   const input=page.locator(`[name="${id}-${i}"]`);
   if(item.accepted)await input.fill(item.accepted[0]);else if(task.kind==='summary')await page.locator(`[name="${id}-${i}"][value="${item.answer}"]`).check();else await input.selectOption(item.answer);
  }
  await page.locator(`[data-${prefix}-check]`).click();assert.match(await page.locator('.c-result-summary').innerText(),new RegExp('^'+task.items.length+' / '+task.items.length));
  for(const [i,item]of task.items.entries()){const result=page.locator('.c-result').nth(i);await result.locator('summary').click();assert.equal(await result.locator('blockquote').innerText(),item.evidence);}
  await page.reload();await taskView();assert.match(await page.locator('.c-result-summary').innerText(),new RegExp('^'+task.items.length+' / '+task.items.length));
 }
 console.log('PASS all complete task keys and evidence',Object.keys(meta.tasks).length);
 // Session font persistence and saved pane positions on a long converted explorer.
 await page.setViewportSize({width:390,height:844});await start(16);await page.locator('button[data-passage-size="21"]').click();await page.waitForFunction(()=>getComputedStyle(document.querySelector('.passage')).fontSize==='21px');await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.locator('.c-passage-pane').evaluate(e=>{e.scrollTop=300;e.dispatchEvent(new Event('scroll'))});await taskView();await page.locator('[data-note="map-note-0"]').fill('Retained paragraph A note');await page.locator('.c-task-pane').evaluate(e=>{e.scrollTop=250;e.dispatchEvent(new Event('scroll'))});await page.waitForTimeout(200);await page.reload();assert.equal(await page.locator('.reading-workspace').getAttribute('data-passage-size'),'21');assert(Math.abs(await page.locator('.c-task-pane').evaluate(e=>e.scrollTop)-250)<2);assert.equal(await page.locator('[data-note="map-note-0"]').inputValue(),'Retained paragraph A note');await page.locator('[data-workspace-pane=passage]').click();assert(Math.abs(await page.locator('.c-passage-pane').evaluate(e=>e.scrollTop)-300)<2,`saved passage: ${await page.locator('.c-passage-pane').evaluate(e=>e.scrollTop)}`);
 for(const width of [1023,1024,1023,1024,1199,1200,1199,1200]){await page.setViewportSize({width,height:800});assert.equal(await page.locator('.c-pane:visible').count(),width<1024?1:2);await noOverflow();}
 // Reveals and paragraph maps remain associated with each paragraph.
 for(const [n,prefix,count]of [[13,'mohammed-map-',2],[22,'bedouin-map-',4],[16,'food-map-',5]]){
  await start(n);await taskView();const before=await page.locator('.c-passage-pane .passage').allTextContents();
  for(let i=0;i<count;i++){await page.locator(`[data-reveal="${prefix+i}"]`).click();assert(await page.locator(`[id="${prefix+i}"]`).isVisible());assert.deepEqual(await page.locator('.c-passage-pane .passage').allTextContents(),before);}
  await page.reload();await taskView();for(let i=0;i<count;i++)assert(await page.locator(`[id="${prefix+i}"]`).isVisible());
 }
 for(const [n,id,meanings]of [[7,'llm-words',meta.lesson.vocabulary.llm.map(x=>x[1])],[9,'signals',['CAUSE','CHOICE / ALTERNATIVE','RESULT','CONTRAST']]]){
  await start(n);for(const [i,meaning]of meanings.entries())await page.locator(`#${id}-${i}`).selectOption({label:meaning});await page.locator(`[data-reveal="${id}-key"]`).click();assert(await page.locator(`[id="${id}-key"]`).isVisible());await page.reload();for(const [i,meaning]of meanings.entries())assert.equal(await page.locator(`#${id}-${i} option:checked`).innerText(),meaning);
 }
 await start(24);for(let i=0;i<10;i++){await page.locator(`[data-reveal="noun-${i}"]`).click();assert(await page.locator(`[id="noun-${i}"]`).isVisible());}for(let i=0;i<4;i++){await page.locator(`[data-reveal="unpack-${i}"]`).click();assert(await page.locator(`[id="unpack-${i}"]`).isVisible());}
 await start(23);await page.locator('[data-middle]').click();assert(!await page.locator('.embedded').isVisible());await page.locator('[data-middle]').click();assert(await page.locator('.embedded').isVisible());
 await start(25);await taskView();for(let i=0;i<2;i++){await page.locator(`[data-reveal="passive-${i}"]`).click();assert(await page.locator(`[id="passive-${i}"]`).isVisible());}
 for(const [n,id,count]of [[29,'ev-unpack',5],[30,'ev-reasoning',5],[36,'football-unpack',3]]){
  await start(n);await taskView();
  if(id==='ev-reasoning')await page.locator('[name="ev-summary-0"][value="B"]').check();
  if(id==='football-unpack')await page.locator('[data-c-mark="0"]').click();
  for(let i=0;i<count;i++)await page.locator(`[data-c-progress="${id}"]`).click();
  assert.equal(await page.locator('.c-reveal-stage').count(),count);await page.reload();await taskView();assert.equal(await page.locator('.c-reveal-stage').count(),count);
 }
 await start(43);await taskView();await page.locator('[data-l-note]').fill('Keep the limits');for(let i=0;i<4;i++){assert.equal(await page.locator('.l-nuance-claim').innerText(),meta.data.ferrari.nuance[i]);if(i<3)await page.locator('[data-l-nuance="1"]').click();}await page.reload();await taskView();assert.equal(await page.locator('[data-l-note]').inputValue(),'Keep the limits');await page.locator('[data-l-nuance="-1"]').click();assert.equal(await page.locator('.l-nuance-claim').innerText(),meta.data.ferrari.nuance[2]);
 await start(48);await taskView();for(const [i,q]of meta.tasks['amouage-completion'].items.entries())await page.locator(`#amouage-completion-${i}`).fill(q.answer);for(const [i,bad]of [[0,'clientele'],[1,'identity'],[4,'culture'],[5,'Oman'],[1,'recognisable creative identity']]){await page.locator(`#amouage-completion-${i}`).fill(bad);await page.locator('[data-l-check]').click();assert.match(await page.locator('.c-result').nth(i).innerText(),/Compare your answer/);await page.locator(`#amouage-completion-${i}`).fill(meta.tasks['amouage-completion'].items[i].answer);}
 console.log('PASS six explorers, notes/reveals, reading tools, progressive support, Ferrari experiment and strict Amouage answers');
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{for(const k of ['localStorage','sessionStorage'])Object.defineProperty(window,k,{get(){throw Error('Blocked')}})});const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(base);await bp.locator('#reading-task').selectOption({label:'Amouage'});await bp.locator('button[data-passage-size="21"]').click();await bp.locator('#next').click();assert.equal(await bp.locator('.reading-workspace').getAttribute('data-passage-size'),'21');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS all structural checks; no console/runtime/HTTP errors');
})().catch(e=>{console.error(e);process.exit(1)});
