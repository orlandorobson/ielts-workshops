const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const base='http://127.0.0.1:8000/listening/day-1/';
await page.goto(base);
// Old checked state must never bypass the new release state.
await page.evaluate(()=>localStorage.setItem('ielts-listening-day-1-v1',JSON.stringify({l14:{answers:['2','10:00','trasport'],checked:true},noticing:{orders:Array.from({length:9},(_,i)=>i===6?null:[0,1]),choices:{0:'0'},checked:true}})));
await page.reload();
async function noFeedback(){assert.equal(await page.locator('.feedback:not(:empty),.result:not(:empty),.followup:not(:empty),[aria-invalid]').count(),0);assert.equal(await page.locator('[data-answer-check]:visible').count(),0);}
await noFeedback();
for(const form of await page.locator('[data-task]').all()){await form.locator('input[name^=q]').first().fill('some answer');await form.locator('input[name^=q]').first().press('Enter');await form.evaluate(f=>f.requestSubmit());}
await page.locator('#noticing-form').evaluate(f=>{f.querySelector('input').click();f.requestSubmit();});await noFeedback();
await page.locator('#l17-6').fill('5 June');await page.reload();await noFeedback();assert.equal(await page.locator('#l17-6').inputValue(),'5 June');
await page.goto(base+'#complete');await page.goBack();await noFeedback();
await page.locator('.reveal').first().click();assert.equal(await page.locator('#spoken-0').isVisible(),true);
await page.locator('.examples summary').first().click();assert.equal(await page.locator('.examples details').first().getAttribute('open'),'');
// Invalid code and codes on another origin/device have no release effect.
await page.locator('#answer-release-form').evaluate(f=>{f.querySelector('input').value='000000';f.requestSubmit();});await noFeedback();
const teacher=await context.newPage();await teacher.goto(base+'teacher-control/');await teacher.locator('[data-release=l14]').click();await page.waitForSelector('[data-answer-check=l14]:visible');assert.equal(await page.locator('[data-answer-check]:visible').count(),1);
await page.locator('#l14-1').fill('10:00');await page.locator('[data-answer-check=l14]').click();assert.match(await page.locator('#l14-1-feedback').textContent(),/not the final time/);
await page.reload();assert.equal(await page.locator('[data-answer-check=l14]').isVisible(),true);assert.match(await page.locator('#l14-1-feedback').textContent(),/not the final time/);
const remote=await browser.newContext({reducedMotion:'reduce'});const student=await remote.newPage();await student.goto(base);assert.equal(await student.locator('[data-answer-check]:visible').count(),0);
const code=(await teacher.locator('#code-l14').textContent()).match(/\d{6}/)[0];await student.locator('#answer-release-form').evaluate((f,code)=>{f.querySelector('input').value=code;f.requestSubmit();},code);assert.equal(await student.locator('[data-answer-check]:visible').count(),1);
await teacher.locator('#release-all').click();await page.waitForSelector('[data-answer-check=l16b]:visible');assert.equal(await page.locator('[data-answer-check]:visible').count(),10);
const allCode=(await teacher.locator('#all-code').textContent()).match(/\d{6}/)[0];await student.locator('#answer-release-form').evaluate((f,code)=>{f.querySelector('input').value=code;f.requestSubmit();},allCode);assert.equal(await student.locator('[data-answer-check]:visible').count(),10);
for(const width of [360,390,430,1280]){await page.setViewportSize({width,height:900});await teacher.setViewportSize({width,height:900});for(const p of [page,teacher])assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
// Reset elsewhere clears rendered feedback, without clearing answers.
await teacher.evaluate(()=>localStorage.removeItem('ielts-listening-day-1-answer-releases-v1'));await page.waitForSelector('[data-answer-check=l14]',{state:'hidden'});await noFeedback();
// Exercise the actual authored spelling dataset.
const fixture=await browser.newContext({reducedMotion:'reduce'});
const sp=await fixture.newPage();await sp.goto(base);assert.equal(await sp.locator('[data-spelling]').count(),2);
for(const form of await sp.locator('[data-spelling]').all()){await form.evaluate(f=>{f.querySelectorAll('.options').forEach(o=>o.querySelector('input').click());f.requestSubmit();});}assert.equal(await sp.locator('[data-spelling] .result:not(:empty)').count(),0);
await sp.reload();assert.equal(await sp.locator('[data-spelling] .result:not(:empty)').count(),0);
await sp.locator('#answer-release-form').evaluate(f=>{f.querySelector('input').value='381642';f.requestSubmit();});await sp.locator('[data-answer-check=spell1]').click();assert.match(await sp.locator('[data-spelling="1"] .result').textContent(),/First attempt:/);assert.equal(await sp.locator('[data-answer-check=spell2]').isVisible(),false);
await sp.reload();assert.match(await sp.locator('[data-spelling="1"] .result').textContent(),/First attempt:/);assert.equal(await sp.locator('[data-spelling="2"] .result').textContent(),'');
assert.deepEqual(errors,[]);console.log('Answer release checks passed: guarded submissions/Enter, old state, reload/history, individual/all release, separate-device codes, spelling fixture, free speaking/examples, storage sync and four responsive widths.');
}finally{await browser.close();}})();
