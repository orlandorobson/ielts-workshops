const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.READING_PREVIEW_URL||'http://localhost:8001/reading/day-1/';
const key='ielts-reading-day-1-v2';
const sizes=[[390,844],[768,1024],[844,390],[1023,768],[1024,768],[1199,800],[1200,800],[1280,800],[1440,900],[1920,1080]];
const taskNames=['Flexible Working','Urban Trees','Large Language Model','Curitiba','Mohammed from Sohar','You Are What You Eat—Or Are You?','Bedouin Life','Electric Vehicles','Digital Football','Ferrari','Amouage'];
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1280,height:800},reducedMotion:'reduce'});
 await context.addInitScript(()=>{
  if(!localStorage.getItem('structure-test-initialised')){localStorage.setItem('ielts-reading-day-1-v1','{"step":36,"visited":[36]}');localStorage.setItem('unrelated-workshop','keep');localStorage.setItem('structure-test-initialised','yes');}
  const seed=sessionStorage.getItem('structure-seed');if(seed){localStorage.setItem('ielts-reading-day-1-v2',seed);sessionStorage.removeItem('structure-seed');}
 });
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});await page.goto(base);
 assert.match(await page.locator('h1').innerText(),/Flexible Working/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('ielts-reading-day-1-v1')),'{"step":36,"visited":[36]}');assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-workshop')),'keep');
 const meta=await page.evaluate(async()=>{const a=await import('./day-1.js'),c=await import('./content.js'),d=await import('./continuation.js'),e=await import('./luxury.js');return{topics:a.topics,screens:a.screens.map(s=>({title:s.title,group:s.group,passage:s.passageName,id:s.id})),groups:a.readingTasks,lesson:c.lesson,tasks:{...d.tasks,...e.luxuryTasks},data:(await import('./luxury-content.js')).luxury,continuation:(await import('./continuation-content.js')).continuation};});
 assert.equal(meta.screens.length,49);assert.deepEqual(await page.locator('#reading-task option').allTextContents(),taskNames);assert.equal(await page.locator('#reading-task').inputValue(),'1');assert.equal(meta.topics.length,11);
 assert.equal(meta.screens[13].title,taskNames[5]);assert.equal(meta.screens[17].group,6);
 const start=async(n,extra={})=>{await page.evaluate(({n,extra})=>sessionStorage.setItem('structure-seed',JSON.stringify({step:n-1,sequenceVersion:3,...extra})),{n,extra});await page.reload();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));};
 const taskView=async()=>{const b=page.locator('[data-workspace-pane=task]');if(await b.isVisible())await b.click();};
 const noOverflow=async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await page.locator('.c-pane:visible').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1)));};
 // Topic navigation, all 49 source activity clusters, continuous passage fidelity.
 const enter=async i=>page.locator('#reading-task').selectOption(String(meta.groups[i][0]));
 const duplicateIds=async()=>assert.deepEqual(await page.locator('[id]').evaluateAll(es=>es.map(e=>e.id).filter((id,i,all)=>all.indexOf(id)!==i)),[]);
 for(let i=0;i<11;i++){
  await enter(i);assert.equal(await page.locator('h1').innerText(),taskNames[i]);assert((await page.locator('.eyebrow').textContent()).startsWith(meta.topics[i].section));
  const {first,last}=meta.topics[i];assert.deepEqual(await page.locator('[data-activity]').evaluateAll(es=>es.map(e=>+e.dataset.activity)),Array.from({length:last-first+1},(_,j)=>first+j));
  assert.equal(await page.locator('.reading-workspace').count(),1);await duplicateIds();
  const names=['flexible','trees','llm','curitiba','mohammed','food','bedouin'];const expected=i<7?meta.lesson.passages[names[i]]:i===7?meta.continuation.ev.paragraphs:i===8?meta.continuation.football.paragraphs:i===9?meta.data.ferrari.paragraphs:meta.data.amouage.paragraphs;
  assert.deepEqual(await page.locator('.c-passage-pane .passage').allTextContents(),expected);assert.equal(await page.locator('#app .passage').count(),expected.length);
  assert.equal(await page.locator('.feedback:not([hidden]),.c-results:not([hidden])').count(),0);
  if(i<10){await page.locator('#next').click();assert.equal(await page.locator('h1').innerText(),taskNames[i+1]);await page.locator('#back').click();assert.equal(await page.locator('h1').innerText(),taskNames[i]);}else assert(await page.locator('#next').isHidden());
 }
 // Every legacy numeric location maps to its containing topic, preserving answer dictionaries.
 for(let n=1;n<=49;n++){
  await start(n,{answers:{q25:[0]},notes:{reflection:'Saved reflection'},continuation:{answers:{'ev-summary-0':'B'}},luxury:{answers:{'amouage-completion-0':'discerning clientele'}}});
  const i=meta.topics.findIndex(t=>n>=t.first&&n<=t.last);assert.equal(await page.locator('h1').innerText(),taskNames[i]);
  const saved=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(saved.sequenceVersion,4);assert.deepEqual(saved.answers.q25,[0]);assert.equal(saved.notes.reflection,'Saved reflection');assert.equal(saved.continuation.answers['ev-summary-0'],'B');assert.equal(saved.luxury.answers['amouage-completion-0'],'discerning clientele');
 }
 console.log('PASS 11 topic destinations, all 49 activity clusters, full passages and 49 legacy navigation migrations');
 // All eleven shared workspaces at every exact benchmark; the surrounding page scrolls naturally.
 if(!process.env.SKIP_BENCHMARKS)for(const [width,height]of sizes){
  await page.setViewportSize({width,height});await start(1);let minimum=Infinity;
  for(let i=0;i<11;i++){
   await enter(i);assert.equal(await page.locator('.c-pane:visible').count(),width<1024?1:2);
   if(width>=1024){const geometry=await page.locator('.c-pane').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,c:e.clientWidth-parseFloat(getComputedStyle(e).paddingLeft)-parseFloat(getComputedStyle(e).paddingRight)})));geometry.forEach(g=>assert(g.c>=400,`${i}/${width}: ${g.c}`));minimum=Math.min(minimum,...geometry.map(g=>g.c));assert(Math.abs(geometry[0].w/(geometry[0].w+geometry[1].w)*100-(width<1200?50:55))<.1);}
   assert(await page.evaluate(()=>getComputedStyle(document.body).overflow!=='hidden'&&document.documentElement.scrollHeight>innerHeight));
   const p=page.locator('.c-passage-pane'),q=page.locator('.c-task-pane');const ptop=await p.evaluate(e=>{e.scrollTop=180;return e.scrollTop});
   await taskView();const qtop=await q.evaluate(e=>{e.scrollTop=160;return e.scrollTop});
   if(width<1024){await page.locator('[data-workspace-pane=passage]').click();assert(Math.abs(await p.evaluate(e=>e.scrollTop)-ptop)<2);await page.locator('[data-workspace-pane=task]').click();assert(Math.abs(await q.evaluate(e=>e.scrollTop)-qtop)<2);}else{assert(Math.abs(await p.evaluate(e=>e.scrollTop)-ptop)<2);await p.evaluate(e=>e.scrollTop+=90);assert(Math.abs(await q.evaluate(e=>e.scrollTop)-qtop)<2);}
   const questionFont=await q.evaluate(e=>getComputedStyle(e).fontSize);
   for(const [size,line]of [[16,24.8],[18,28.8],[21,34.65]]){await page.locator(`button[data-passage-size="${size}"]`).click();await page.waitForFunction(size=>parseFloat(getComputedStyle(document.querySelector('.c-passage-pane .passage')).fontSize)===size,size);assert(Math.abs(await p.locator('.passage').first().evaluate(e=>parseFloat(getComputedStyle(e).lineHeight))-line)<.02);assert.equal(await q.evaluate(e=>getComputedStyle(e).fontSize),questionFont);assert.equal(await page.locator('.c-pane:visible').count(),width<1024?1:2);}
   await noOverflow();await duplicateIds();
  }
  console.log('PASS benchmark',width,height,'minimum two-pane width',minimum===Infinity?'n/a':minimum);
 }
 // Original question controls: check every rendered question, including all six explorers.
 await page.setViewportSize({width:1280,height:800});await start(1);let questionCount=0;
 const sourceQuestions=Object.fromEntries(Object.values(meta.lesson.questions).map(q=>[q.id,q]));
 for(let n=1;n<=11;n++){
  await taskView();await page.locator('#app details.help').evaluateAll(es=>es.forEach(e=>e.open=true));
  const ids=await page.locator('[data-check]').evaluateAll(es=>es.map(e=>({id:e.dataset.check,scope:e.closest('.question').dataset.questionScope})));
  for(const {id,scope} of ids){
   let correct,expected;
   if(sourceQuestions[id]){correct=sourceQuestions[id].correct;expected=sourceQuestions[id].why;}
   else if(id.startsWith('heading-')){const [,name,index]=id.split('-');correct=[meta.lesson.keys[name][Number(index)]];expected=meta.lesson.feedback[name][Number(index)];}
   else if(id.startsWith('context-'))correct=[id==='context-230'?1:0];
   else if(id.startsWith('argument-')){const [,i,j]=id.split('-');correct=[[[0,1,4],[0,2,3],[0,2,1],[4],[5]][i][j]];}
   else throw Error('Unknown question '+id);
   const holder=page.locator(`[data-question="${id}"][data-question-scope="${scope}"]`);
   await holder.locator('input').evaluateAll(es=>es.forEach(e=>{e.checked=false}));
   for(const value of correct)await holder.locator(`input[value="${value}"]`).check();
   await holder.locator(`[data-check="${id}"]`).click();assert.match(await holder.locator('.feedback').innerText(),/That fits the text/);if(expected)assert((await holder.locator('.feedback').innerText()).includes(expected));questionCount++;
  }
  if(n<11)await page.locator('#next').click();
 }
 console.log('PASS original question checking',questionCount);
 // Whole-task checks retain blank, incorrect, correct and evidence behaviour.
 for(const [id,task]of Object.entries(meta.tasks)){
  const index=meta.screens.findIndex(s=>s.id===id);assert(index>=0,id);await start(index+1);await taskView();
  const form=page.locator(`[data-c-form="${id}"],[data-l-form="${id}"]`);
  const prefix=id.startsWith('ev-')||id.startsWith('football-')?'c':'l';
  await form.locator(`[data-${prefix}-check]`).click();assert.match(await form.locator('.c-check-notice').innerText(),/Attempt all/);
  for(const [i,item]of task.items.entries()){
   const input=form.locator(`[name="${id}-${i}"]`);
   if(item.accepted)await input.fill('Not sure');else if(task.kind==='summary')await form.locator(`[name="${id}-${i}"][value="${item.options.find(o=>o.value!==item.answer).value}"]`).check();else await input.selectOption('?');
  }
  await form.locator(`[data-${prefix}-check]`).click();assert.match(await form.locator('.c-result-summary').innerText(),/^0 \/ /);assert.equal(await page.locator('.c-results:not([hidden])').count(),1);
  for(const [i,item]of task.items.entries()){
   const input=form.locator(`[name="${id}-${i}"]`);
   if(item.accepted)await input.fill(item.accepted[0]);else if(task.kind==='summary')await form.locator(`[name="${id}-${i}"][value="${item.answer}"]`).check();else await input.selectOption(item.answer);
  }
  await form.locator(`[data-${prefix}-check]`).click();assert.match(await form.locator('.c-result-summary').innerText(),new RegExp('^'+task.items.length+' / '+task.items.length));
  for(const [i,item]of task.items.entries()){const result=form.locator('.c-result').nth(i);await result.locator('summary').click();assert.equal(await result.locator('blockquote').innerText(),item.evidence);}
  await page.reload();await taskView();assert.match(await form.locator('.c-result-summary').innerText(),new RegExp('^'+task.items.length+' / '+task.items.length));
 }
 console.log('PASS all complete task keys and evidence',Object.keys(meta.tasks).length);
 // Repeated controls share logical answers, never DOM groups or checking state.
 await start(4);await page.locator('details.help').evaluateAll(es=>es.forEach(e=>e.open=true));
 const first=page.locator('[data-activity="4"] [data-question="q48"]'),second=page.locator('[data-activity="5"] [data-question="q48"]');
 const answer=sourceQuestions.q48.correct[0];await first.locator(`input[value="${answer}"]`).check();assert(await second.locator(`input[value="${answer}"]`).isChecked());
 await first.locator('[data-check]').click();assert(await first.locator('.feedback').isVisible());assert(await second.locator('.feedback').isHidden());
 await page.reload();await page.locator('details.help').evaluateAll(es=>es.forEach(e=>e.open=true));assert(await first.locator('.feedback').isVisible());assert(await second.locator('.feedback').isHidden());
 await second.locator(`input[value="${(answer+1)%sourceQuestions.q48.options.length}"]`).check();assert(await first.locator('.feedback').isHidden());assert(await second.locator('.feedback').isHidden());
 await start(27);await page.locator('[name="ev-reasoning-summary-0"][value="B"]').check();assert(await page.locator('[name="ev-summary-0"][value="B"]').isChecked());
 await page.locator('[name="ev-summary-0"][value="A"]').check();assert(await page.locator('[name="ev-reasoning-summary-0"][value="A"]').isChecked());
 await page.evaluate(()=>window.untouchedActivity=document.querySelector('[data-c-screen="ev-task-a"]'));
 await page.locator('[data-c-progress="ev-unpack"]').click();assert(await page.evaluate(()=>window.untouchedActivity===document.querySelector('[data-c-screen="ev-task-a"]')));
 for(let i=1;i<5;i++)await page.locator('[data-c-progress="ev-unpack"]').click();await page.locator('[data-c-reset="ev-unpack"]').click();assert.equal(await page.locator('[data-c-progressive="ev-unpack"] .c-reveal-stage').count(),0);
 await duplicateIds();console.log('PASS repeated-control synchronisation, isolated checks, sibling DOM retention and support reset');
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
 await start(24);await taskView();for(let i=0;i<10;i++){await page.locator(`[data-reveal="noun-${i}"]`).click();assert(await page.locator(`[id="noun-${i}"]`).isVisible());}for(let i=0;i<4;i++){await page.locator(`[data-reveal="unpack-${i}"]`).click();assert(await page.locator(`[id="unpack-${i}"]`).isVisible());}
 await start(23);await taskView();await page.locator('[data-middle]').click();assert(!await page.locator('.embedded').isVisible());await page.locator('[data-middle]').click();assert(await page.locator('.embedded').isVisible());
 await start(25);await taskView();for(let i=0;i<2;i++){await page.locator(`[data-reveal="passive-${i}"]`).click();assert(await page.locator(`[id="passive-${i}"]`).isVisible());}
 for(const [n,id,count]of [[29,'ev-unpack',5],[30,'ev-reasoning',5],[36,'football-unpack',3]]){
  await start(n);await taskView();
  if(id==='ev-reasoning')await page.locator('[name="ev-reasoning-summary-0"][value="B"]').check();
  if(id==='football-unpack')await page.locator('[data-c-mark="0"]').click();
  for(let i=0;i<count;i++)await page.locator(`[data-c-progress="${id}"]`).click();
  assert.equal(await page.locator('.c-reveal-stage').count(),count);await page.reload();await taskView();assert.equal(await page.locator('.c-reveal-stage').count(),count);
 }
 await start(43);await taskView();await page.locator('[data-l-note=nuance]').fill('Keep the limits');for(let i=0;i<4;i++){assert.equal(await page.locator('.l-nuance-claim').innerText(),meta.data.ferrari.nuance[i]);if(i<3)await page.locator('[data-l-nuance="1"]').click();}await page.reload();await taskView();assert.equal(await page.locator('[data-l-note=nuance]').inputValue(),'Keep the limits');await page.locator('[data-l-nuance="-1"]').click();assert.equal(await page.locator('.l-nuance-claim').innerText(),meta.data.ferrari.nuance[2]);
 await start(48);await taskView();for(const [i,q]of meta.tasks['amouage-completion'].items.entries())await page.locator(`#amouage-completion-${i}`).fill(q.answer);for(const [i,bad]of [[0,'clientele'],[1,'identity'],[4,'culture'],[5,'Oman'],[1,'recognisable creative identity']]){await page.locator(`#amouage-completion-${i}`).fill(bad);await page.locator('[data-l-check=amouage-completion]').click();assert.match(await page.locator('[data-l-form=amouage-completion] .c-result').nth(i).innerText(),/Compare your answer/);await page.locator(`#amouage-completion-${i}`).fill(meta.tasks['amouage-completion'].items[i].answer);}
 console.log('PASS six explorers, notes/reveals, reading tools, progressive support, Ferrari experiment and strict Amouage answers');
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{for(const k of ['localStorage','sessionStorage'])Object.defineProperty(window,k,{get(){throw Error('Blocked')}})});const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(base);await bp.locator('#reading-task').selectOption({label:'Amouage'});await bp.locator('button[data-passage-size="21"]').click();await bp.locator('#back').click();assert.equal(await bp.locator('.reading-workspace').getAttribute('data-passage-size'),'21');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS all structural checks; no console/runtime/HTTP errors');
})().catch(e=>{console.error(e);process.exit(1)});
