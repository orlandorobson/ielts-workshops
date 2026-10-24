const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.READING_PREVIEW_URL||'http://localhost:8001/reading/day-1/';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.addInitScript(()=>{const seed=sessionStorage.getItem('workspace-test-seed');if(seed){localStorage.setItem('ielts-reading-day-1-v2',seed);sessionStorage.removeItem('workspace-test-seed');}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(base);
 const start=async(step=47)=>{await page.evaluate(step=>sessionStorage.setItem('workspace-test-seed',JSON.stringify({sequenceVersion:3,step})),step);await page.reload();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));};
 const pane=k=>page.locator(`[data-l-scroll="${k}"]`);
 const scroll=async(k,n)=>{await pane(k).evaluate((e,n)=>{e.scrollTop=n;e.dispatchEvent(new Event('scroll'))},n);return pane(k).evaluate(e=>e.scrollTop);};
 const pos=k=>pane(k).evaluate(e=>e.scrollTop);
 const near=(a,b)=>assert(Math.abs(a-b)<3,`${a} != ${b}`);
 const taskView=async()=>{if(await page.locator('[data-workspace-pane=task]').isVisible())await page.locator('[data-workspace-pane=task]').click();};
 const task=await page.evaluate(async()=> (await import('./luxury.js')).luxuryTasks['amouage-completion']);
 for(const [width,height]of [[390,844],[768,1024],[844,390],[1023,768],[1024,768],[1199,800],[1200,800],[1280,800],[1440,900],[1920,1080]]){
  await page.setViewportSize({width,height});await start();
  assert.equal(await page.locator('aside,#navigation,#menu,#storage-note').count(),0);
  const geometry=await page.evaluate(()=>[...document.querySelectorAll('.c-pane')].map(e=>({w:e.getBoundingClientRect().width,usable:e.clientWidth-parseFloat(getComputedStyle(e).paddingLeft)-parseFloat(getComputedStyle(e).paddingRight)})));
  if(width>=1024){geometry.forEach(x=>assert(x.usable>=400));near(geometry[0].w/(geometry[0].w+geometry[1].w)*100,width<1200?50:55);}
  const uiFont=await page.locator('.c-task-pane label').first().evaluate(e=>getComputedStyle(e).fontSize);
  for(const [size,line]of [[16,24.8],[18,28.8],[21,34.65]]){
   await page.locator(`button[data-passage-size="${size}"]`).click();
   await page.waitForFunction(size=>parseFloat(getComputedStyle(document.querySelector(".passage")).fontSize)===size,size);
   const font=await page.locator('.passage').first().evaluate(e=>[parseFloat(getComputedStyle(e).fontSize),parseFloat(getComputedStyle(e).lineHeight)]);
   assert.equal(font[0],size);near(font[1],line);assert.equal(await page.locator('.c-task-pane label').first().evaluate(e=>getComputedStyle(e).fontSize),uiFont);
   assert.equal(await page.locator('.c-pane:visible').count(),width<1024?1:2);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
   assert(await page.locator('.c-pane:visible').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1)));
  }
  const p=await scroll('passage',250);await taskView();const q=await scroll('task',200);
  if(width<1024){await page.locator('[data-workspace-pane=passage]').click();near(await pos('passage'),p);await page.locator('[data-workspace-pane=task]').click();near(await pos('task'),q);}else{near(await pos('passage'),p);await scroll('passage',350);near(await pos('task'),q);}
  await page.locator('[data-l-check]').click();assert.match(await page.locator('.c-check-notice').innerText(),/Attempt all/);
  for(const [i,item]of task.items.entries())await page.locator(`#amouage-completion-${i}`).fill(item.answer);
  await page.locator('[data-l-check]').click();assert.match(await page.locator('.c-result-summary').innerText(),/^6 \/ 6/);
  await page.locator('#amouage-completion-1').fill('identity');await page.locator('[data-l-check]').click();assert.match(await page.locator('.c-result-summary').innerText(),/^5 \/ 6/);
  await page.reload();await taskView();assert.equal(await page.locator('#amouage-completion-1').inputValue(),'identity');assert.equal(await page.locator('.reading-workspace').getAttribute('data-passage-size'),'21');assert.match(await page.locator('.c-result-summary').innerText(),/^5 \/ 6/);
  await scroll('task',0);if(width===390||width===844||width===1200)await page.screenshot({path:`/tmp/reading-workspace-${width}.png`});
  await page.locator('#next').click();assert.equal(await page.locator('.reading-workspace').count(),1);assert.equal(await page.locator('.luxury').getAttribute('data-l-screen'),'amouage-endings');await page.locator('#back').click();assert.equal(await page.locator('.reading-workspace').getAttribute('data-passage-size'),'21');
  console.log('PASS',width,height,JSON.stringify(geometry));
 }
 // Exercise both boundary transitions with answers and independent positions retained.
 await page.setViewportSize({width:1023,height:800});await start();const p=await scroll('passage',300);await taskView();await scroll('task',200);await page.locator('#amouage-completion-0').fill('discerning clientele');
 for(const width of [1024,1023,1024,1199,1200,1199,1200]){await page.setViewportSize({width,height:800});await page.waitForTimeout(180);assert.equal(await page.locator('.c-pane:visible').count(),width<1024?1:2);assert.equal(await page.locator('#amouage-completion-0').inputValue(),'discerning clientele');if(width===1024)near(await pos('passage'),p);}
 // Back/Continue traverse all 49 steps and preserve the underlying visited state.
 const workspaceSteps=[3,5,8,10,11,13,15,16,17,21,22,25,28,29,30,31,32,33,35,36,37,38,39,40,42,43,45,46,47,48,49];
 await start(0);for(let i=0;i<49;i++){assert.equal(await page.locator('.reading-workspace').count(),workspaceSteps.includes(i+1)?1:0);if(i<48)await page.locator('#next').click();}assert.equal(await page.evaluate(()=>new Set(JSON.parse(localStorage.getItem('ielts-reading-day-1-v2')).visited).size),49);
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{for(const k of ['localStorage','sessionStorage'])Object.defineProperty(window,k,{get(){throw Error('Blocked')}})});const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(base);for(let i=0;i<47;i++)await bp.locator('#next').click();await bp.locator('button[data-passage-size="21"]').click();await bp.locator('#next').click();await bp.locator('#back').click();assert.equal(await bp.locator('.reading-workspace').getAttribute('data-passage-size'),'21');
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: all benchmarks, three sizes, checking, saved answers, scroll restoration, boundaries, all 49 steps, blocked storage, no console/runtime errors');
})().catch(e=>{console.error(e);process.exit(1)});
