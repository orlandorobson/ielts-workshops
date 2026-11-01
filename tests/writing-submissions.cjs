// Run with Playwright installed: NODE_PATH=/path/to/node_modules node tests/writing-submissions.cjs
// All Formspree requests are intercepted; no student/test records are sent.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const base = process.env.PORTAL_BASE || 'http://127.0.0.1:8017';
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
 const page = await browser.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 const url=base+'/writing/task-2/submit/';
 const open=async suffix=>{await page.goto(url+suffix);await page.waitForFunction(()=>!document.querySelector('#submission-fields').disabled);};
 await open(''); assert.equal(await page.locator('[role=tab][aria-selected=true]').textContent(),'Task 2');
 assert.equal(await page.locator('#question-id option').count(),11);
 await page.selectOption('#question-id','T2-01'); await page.fill('#student-response','Task two draft');
 await page.getByRole('tab',{name:'Academic Task 1',exact:true}).click();
 for(const id of ['LG01','BC01','PC01','TB01','MP01','PR01','CB01']) {
  await page.selectOption('#question-id',id);
  assert.match(await page.locator('#selected-question').textContent(),/Write at least 150 words/);
  assert.ok(await page.locator('#selected-question svg, #selected-question table').count());
 }
 await page.selectOption('#question-id','LG01'); await page.fill('#student-response','Line draft');
 await page.selectOption('#question-id','BC01'); assert.equal(await page.inputValue('#student-response'),'');
 await page.fill('#student-response','Bar draft'); await page.selectOption('#question-id','LG01'); assert.equal(await page.inputValue('#student-response'),'Line draft');
 await page.reload(); await page.waitForFunction(()=>!document.querySelector('#submission-fields').disabled); assert.equal(await page.inputValue('#student-response'),'Line draft');
 await page.getByRole('tab',{name:'General Training Task 1'}).click();
 const salutations=['Dear Sir or Madam,','Dear Sir or Madam,','Dear Mr or Ms Brown,','Dear Alex,','Dear Sam,','Dear Jamie,'];
 for(let i=0;i<6;i++){await page.selectOption('#question-id',`GT0${i+1}`);assert.ok((await page.locator('#selected-question').textContent()).endsWith(salutations[i]));}
 await page.getByRole('tab',{name:'Task 2',exact:true}).click(); assert.equal(await page.inputValue('#student-response'),'Task two draft');
 // Keyboard tab activation, arrow wrapping, Home/End.
 await page.locator('#tab-task-2').focus(); await page.keyboard.press('ArrowRight'); assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('data-task'),'academic-task-1');
 await page.keyboard.press('End'); assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('data-task'),'task-2');
 for(const [task,id,limit] of [['academic-task-1','MP01',20],['general-task-1','GT03',20],['task-2','T2-02',40]]) {
  await open(`?task=${task}&question=${id}`);
  await page.check('[name=eligibility_status][value="Current Polyglot Salalah IELTS student"]');
  await page.check('[name=independent_writing_confirmed]'); await page.check('#time-commitment');
  await page.fill('#student-response','A short diagnostic answer is allowed.'); await page.fill('#student-name','Test Student'); await page.fill('#whatsapp-number','+968 9999 9999');
  await page.check('#within-time');
  assert.equal(await page.locator('#actual-minutes').isDisabled(),true);
  assert.equal(await page.locator('[name=time_limit_exceeded]').inputValue(),'false');
  await page.check('#over-time'); await page.fill('#actual-minutes',String(limit));
  assert.equal(await page.locator('#actual-minutes').evaluate(e=>e.checkValidity()),false);
  await page.fill('#actual-minutes',String(limit+7.5));
  let payload; let requests=0;
  await page.route('https://formspree.io/**',async route=>{requests++;payload=route.request().postDataBuffer().toString();await route.fulfill({status:503,body:'unavailable'});});
  await page.getByRole('button',{name:'Submit my writing'}).click(); await page.waitForFunction(()=>document.querySelector('#submission-status').dataset.error==='true');
  assert.equal(await page.inputValue('#student-response'),'A short diagnostic answer is allowed.');
  for(const value of [task,id,'7.5',String(limit+7.5),'time_limit_exceeded','question_text','student_response','time_attempt_confirmed']) assert.ok(payload.includes(value),value);
  assert.ok(payload.includes(limit===40?'forty_minute_attempt_confirmed':'twenty_minute_attempt_confirmed'));
  await page.unroute('https://formspree.io/**');
  await page.route('https://formspree.io/**',async route=>{requests++;await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
  await page.getByRole('button',{name:'Submit my writing'}).click(); await page.locator('#submission-confirmation').waitFor({state:'visible'}); assert.equal(requests,2);
  await page.unroute('https://formspree.io/**');
 }
 await open(''); assert.equal(await page.locator('[role=tab][aria-selected=true]').getAttribute('data-task'),'task-2');
 await open('?question_id=T2-03'); assert.equal(await page.inputValue('#question-id'),'T2-03');
 await open('?task=invalid&question=GT01'); assert.equal(await page.inputValue('#question-id'),'');
 await open('?task=academic-task-1&question=PR01');
 for(const width of [360,390,768,1280]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await page.screenshot({path:'/private/tmp/ielts-academic-portal.png',fullPage:true});
 await page.goto(base+'/writing/task-1/academic/');
 await page.locator('[data-select-task="MP01"]').click();
 const workshopLink=page.getByRole('link',{name:'Submit an answer to this task'});
 assert.match(await workshopLink.getAttribute('href'),/question=MP01/);
 await workshopLink.click();await page.waitForFunction(()=>!document.querySelector('#submission-fields').disabled);
 assert.equal(await page.inputValue('#question-id'),'MP01');
 // Storage denial must not disable the form.
 const noStorage=await browser.newContext(); await noStorage.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('denied');}}));
 const p=await noStorage.newPage();await p.goto(url);await p.waitForFunction(()=>!document.querySelector('#submission-fields').disabled);await p.selectOption('#question-id','T2-01');await p.fill('#student-response','Unsaved draft');assert.match(await p.locator('#draft-status').textContent(),/unavailable/);await noStorage.close();
 assert.deepEqual(errors,[]); console.log('PASS: all 3 submission paths, 7 full Academic visuals, 6 GT salutations, timing validation, payloads, failure/retry, drafts/reload, keyboard, responsive layouts, legacy links and storage denial.');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
