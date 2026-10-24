const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.READING_PREVIEW_URL||'http://localhost:8001/reading/day-1/';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.addInitScript(()=>{const seed=sessionStorage.getItem('mobile-test-seed');if(seed){localStorage.setItem('ielts-reading-day-1-v2',seed);sessionStorage.removeItem('mobile-test-seed')}});await page.goto(base);
 const meta=await page.evaluate(async()=>({screens:(await import('./day-1.js')).screens.map(s=>({id:s.id})),tasks:{...(await import('./continuation.js')).tasks,...(await import('./luxury.js')).luxuryTasks}}));
 for(const [width,height]of [[390,844],[844,390]]){
  await page.setViewportSize({width,height});
  for(const [id,task]of Object.entries(meta.tasks)){
   const step=meta.screens.findIndex(s=>s.id===id);await page.evaluate(step=>sessionStorage.setItem('mobile-test-seed',JSON.stringify({step})),step);await page.reload();
   await page.locator('[data-workspace-pane=task]').click();
   for(const [i,q]of task.items.entries()){
    const control=page.locator(`[name="${id}-${i}"]`);
    if(q.accepted)await control.fill(q.accepted[0]);else if(task.kind==='summary')await page.locator(`[name="${id}-${i}"][value="${q.answer}"]`).check();else await control.selectOption(q.answer);
   }
   await page.locator('[data-c-check],[data-l-check]').click();assert(await page.locator('.c-task-pane').isVisible());assert.match(await page.locator('.c-result-summary').innerText(),new RegExp(`^${task.items.length} / ${task.items.length}`));
   assert.equal(await page.locator('.c-pane:visible').count(),1);assert(await page.locator('.c-task-pane').evaluate(e=>e.scrollWidth<=e.clientWidth+1));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.documentElement.scrollHeight<=innerHeight));
   await page.locator('[data-workspace-pane=passage]').click();assert(await page.locator('.c-passage-pane').isVisible());await page.locator('[data-workspace-pane=task]').click();assert.match(await page.locator('.c-result-summary').innerText(),new RegExp(`^${task.items.length} / ${task.items.length}`));
  }
  console.log('PASS all 14 complete tasks / 67 answers, mobile checking and pane restoration:',width,height);
 }
 assert.deepEqual(errors,[]);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
