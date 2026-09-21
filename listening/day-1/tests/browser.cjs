const {release}=require('./classroom-helper.cjs');
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:"chrome"});const page=await browser.newPage({reducedMotion:"reduce"});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8000/listening/day-1/');await page.waitForSelector('#l17-6');
await release(page,'all');
for(const width of [360,390,430,1280]){await page.setViewportSize({width,height:900});await page.reload();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'overflow '+width);await page.screenshot({path:`/tmp/listening-${width}.png`,fullPage:false});}
assert.equal(await page.locator('audio,video,img').count(),0);
await page.locator('#l14-0').fill('2');await page.locator('#l14-1').fill('10:00');await page.locator('#l14-2').fill('trasport');await page.locator('[data-task="l14"] button').click();await page.getByText('I didn’t notice the correction.',{exact:true}).click();assert.match(await page.locator('#l14-1-feedback').textContent(),/not the final time/);assert.match(await page.locator('#l14-2-feedback').textContent(),/spelling/);
await page.reload();await page.getByText('Connected ✓',{exact:true}).waitFor();assert.equal(await page.locator('#l14-1').inputValue(),'10:00');assert.equal(await page.locator('[name=reason]:checked').inputValue(),'1');
for(const [id,answers] of Object.entries({l14:['two','09:30','transport'],l15:['check','coast','water','2 hours','25th'],l16a:['$15','25','guest','all','startup'],l17:['data','Mondays','Wednesdays','6:30','Holborn','Carter','5th June']})){for(let i=0;i<answers.length;i++)await page.locator(`#${id}-${i}`).fill(answers[i]);await page.locator(`[data-task=${id}] button`).click();assert.equal(await page.locator(`[data-task=${id}] .result`).textContent(),`${answers.length} / ${answers.length} correct`);}
await page.locator('.reveal').first().click();assert.equal(await page.locator('#spoken-0').isVisible(),true);await page.locator('.reveal').first().click();assert.equal(await page.locator('#spoken-0').isVisible(),false);
await page.locator('#noticing-form input[value="0"]').evaluateAll(els=>els.forEach(el=>el.click()));await page.locator('#noticing-form button:not([type="button"])').click();assert.match(await page.locator('#noticing-form .result').textContent(),/9 \/ 9/);
const patterns=new Set();for(let i=0;i<24;i++){await page.locator('#new-noticing').click();patterns.add(await page.locator('#noticing-form .options').evaluateAll(els=>els.map(el=>el.querySelector('input').value).join('')));}assert.ok(patterns.size>10);
assert.equal(await page.locator('button:disabled,input:disabled').count(),0);assert.deepEqual(errors,[]);
await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}})});await page.reload();assert.match(await page.locator('#storage-note').textContent(),/unavailable/);await release(page,'l14');await page.locator('[data-task=l14] button').click();
console.log('Browser checks passed at 360, 390, 430 and 1280px; no overflow, console errors or embedded media. Forms, persistence, noticing shuffle, speaking reveal and blocked storage checked.');await browser.close();})();
