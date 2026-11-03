const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.WORKSHOP_BASE || 'http://127.0.0.1:8765';
(async () => {
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
const page = await browser.newPage({viewport:{width:1280,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
await page.goto(base+'/');
const originals = { 'ielts-workshops:writing-task-2:v1': JSON.stringify({version:4,drafts:{workshop1Plan:{body1:'Historical detailed plan'},workshop1Introduction:'Historical introduction'}}), 'ielts-workshops:writing-task-2:workshop-2:v1': JSON.stringify({version:1,drafts:{paragraph1:'Historical paragraph',paragraphPlans:{paragraph1:{explain:'Fuller explanation'}}}}) };
await page.evaluate(originals=>{localStorage.clear();for(const [k,v] of Object.entries(originals))localStorage.setItem(k,v)},originals);await page.goto(base+'/writing/task-2/');await page.waitForSelector('#short-plan');
const canonical=JSON.parse(fs.readFileSync('content/writing/task-2-canonical/task-2-workshop-question-bank-v1.0.json')).questions;
for(const q of canonical){const nodes=page.locator(`[data-question="${q.id}"]`);for(let i=0;i<await nodes.count();i++)assert.equal(await nodes.nth(i).textContent(),q.prompt);}
await page.locator('.contrast-grid summary').first().focus();await page.keyboard.press('Enter');assert.notEqual(await page.locator('.contrast-grid details').first().getAttribute('open'),null);await page.keyboard.press('Enter');
await page.locator('[data-vote="noise-a"] button').first().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-vote="noise-a"] button').first().getAttribute('aria-pressed'),'true');
await page.check('[name=jobs][value=one]');assert.match(await page.locator('#jobs-feedback').textContent(),/why do adults/);await page.check('[name=jobs][value=both]');
for(const id of ['noise-a','noise-b','cash-a','cash-b']){const card=page.locator(`[data-vote="${id}"]`);await card.getByRole('button',{name:'Cool',exact:true}).click();await card.getByRole('button',{name:'Splat',exact:true}).click();assert.match(await card.locator('.vote-feedback').textContent(),/change your vote/);}
await page.fill('#body1','study after work');await page.fill('#body2','wider access');await page.check('[name=view][value=mixed]');await page.fill('#explanation','access, but isolation');
await page.locator('#body1').focus();const scroll=await page.evaluate(()=>scrollY);await page.keyboard.type(' and family');await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>document.activeElement.id),'body1');assert.equal(await page.evaluate(()=>scrollY),scroll);
await page.reload();assert.equal(await page.inputValue('#body1'),'study after work and family');assert.equal(await page.locator('[name=view]:checked').inputValue(),'mixed');
await page.getByRole('link',{name:'Go straight to writing'}).click();await page.waitForSelector('#o3-draft');assert.match(await page.locator('.intro-plan').textContent(),/study after work and family/);await page.fill('#o3-draft','Online study offers adults flexibility.');await page.reload();assert.equal(await page.inputValue('#o3-draft'),'Online study offers adults flexibility.');
await page.goto(base+'/writing/task-2/?lesson=1&historical=1#o3');await page.waitForSelector('#o3-draft');assert.equal(new URL(page.url()).hash,'#saved-work');assert.match(await page.locator('#history-copy').textContent(),/Historical introduction/);assert.equal(await page.inputValue('#o3-draft'),'Online study offers adults flexibility.');
await page.goto(base+'/writing/task-2/#o2');await page.waitForSelector('#short-plan');assert.equal(new URL(page.url()).hash,'#plan');
assert.equal(await page.evaluate(()=>localStorage.getItem('ielts-workshops:writing-task-2:workshop-2:v1')), originals['ielts-workshops:writing-task-2:workshop-2:v1']);
assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ielts-workshops:writing-task-2:v1')).drafts.workshop1Plan.body1),'Historical detailed plan');
// The legacy introduction remains intact even when legacy progress metadata changes.
assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ielts-workshops:writing-task-2:v1')).drafts.workshop1Introduction),'Historical introduction');
const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('ielts-workshops:task2:continuous:v1')));assert.deepEqual(stored.history,originals);
for(const width of [375,768,1280]){await page.setViewportSize({width,height:900});await page.goto(base+'/writing/task-2/#plan');await page.waitForSelector('#short-plan');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow at ${width}`);await page.screenshot({path:`output/task-2-continuous-${width}.png`,fullPage:true});}
await page.setViewportSize({width:1280,height:900});await page.goto(base+'/writing/task-2/#plan');await page.locator('.own-plan').scrollIntoViewIfNeeded();await page.screenshot({path:'output/task-2-plan-preview.png'});
await page.goto(base+'/writing/task-2/workshop-2/');await page.waitForSelector('#app article');
await page.goto(base+'/writing/task-2/');await page.waitForSelector('#short-plan');await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw Error('quota')}});await page.fill('#body1','Still editable');await page.waitForTimeout(250);assert.match(await page.locator('#save-status').textContent(),/Saving unavailable/);assert.equal(await page.inputValue('#body1'),'Still editable');
assert.deepEqual(errors,[]);console.log('PASS: canonical wording, votes/retry, persistence, introduction bridge, legacy history, hashes, three layouts, stable typing/focus/scroll, save failure, resources.');
} finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
