/* Run with NODE_PATH pointing to an existing Playwright installation. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.READING_PREVIEW_URL||'http://127.0.0.1:8000/reading/day-1/';
const key='ielts-reading-day-1-v1';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const errors=[], failures=[];
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failures.push(r.url())});
 await page.goto(base);
 const C=await page.evaluate(async()=>(await import('./content.js')).lesson);
 const O=await page.evaluate(async()=>{const m=await import('./answer-order.js');return {fixed:m.fixedOrders,headings:m.headingOrders,matching:m.matchingOrders}});
 const titles=await page.evaluate(async()=>(await import('./day-1.js')).screens.map(s=>s.title));
 assert.equal(titles.length,27);assert(titles.indexOf('Mohammed from Sohar')<titles.indexOf('The Transformation of Bedouin Life in the Modern Arabian Peninsula'));
 async function step(n,p=page){await p.evaluate(({key,n})=>{const s=JSON.parse(localStorage.getItem(key)||'{}');s.step=n;s.views={};localStorage.setItem(key,JSON.stringify(s))},{key,n});await p.reload();await p.locator('h1').waitFor();}
 async function overflow(){assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),await page.locator('h1').innerText());}
 // Every step can be reached with no answers, including phone-sized layouts.
 for(const width of [1440,1280,768,390,360,320]){
  await page.setViewportSize({width,height:900});await step(0);
  for(let n=0;n<27;n++){assert.equal(await page.locator('h1').innerText(),titles[n]);await overflow();if(n<26){assert(await page.locator('#next').isEnabled());await page.locator('#next').click();}}
 }
 await page.setViewportSize({width:1440,height:1000});
 // All source concept/vocabulary questions: wrong answer, source-correct answer, feedback, retry.
 const seen=new Set();
 for(let n=0;n<27;n++){
  await step(n);await page.locator('details.help').evaluateAll(els=>els.forEach(e=>e.open=true));
  for(const [id,q] of Object.entries(C.questions)){
   if(seen.has(q.id)||!await page.locator(`[data-check="${q.id}"]`).count())continue;
   assert.deepEqual(await page.locator(`[name="${q.id}"]`).evaluateAll(els=>els.map(e=>Number(e.value))),q.id==='q215'?await page.evaluate(()=>JSON.parse(localStorage.getItem('ielts-reading-day-1-v1')).optionOrders.q215):O.fixed[q.id]);
   const wrong=q.options.findIndex((_,i)=>!q.correct.includes(i));
   await page.locator(`[name="${q.id}"][value="${wrong}"]`).check();
   await page.locator(`[data-check="${q.id}"]`).click();
   assert.match(await page.locator(`#feedback-${q.id}`).innerText(),/Compare your choice/);
   if(q.multi)await page.locator(`[name="${q.id}"][value="${wrong}"]`).uncheck();
   for(const i of q.correct)await page.locator(`[name="${q.id}"][value="${i}"]`).check();
   await page.locator(`[data-check="${q.id}"]`).click();
   assert.match(await page.locator(`#feedback-${q.id}`).innerText(),/That fits/);seen.add(q.id);
  }
 }
 assert.equal(seen.size,Object.keys(C.questions).length-1); // Mohammed B is in the second paragraph view.
 await step(12);await page.locator('[data-paragraph="mohammed-jobs"][data-index="1"]').first().click();
 await page.locator('[name=q194][value="1"]').check();await page.locator('[data-check=q194]').click();assert.match(await page.locator('#feedback-q194').innerText(),/That fits/);seen.add('q194');
 assert.equal(seen.size,Object.keys(C.questions).length);
 // Every heading, all 16 rendered paragraphs, and exact full-passage text.
 const steps={flexible:2,trees:4,llm:7,curitiba:9,bedouin:16,food:23};
 for(const [name,n] of Object.entries(steps)){
  await step(n);
  for(let i=0;i<C.passages[name].length;i++){
   if(C.passages[name].length>1)await page.locator(`[data-paragraph="${name}-headings"][data-index="${i}"]`).first().click();
   assert.equal(await page.locator('.passage-wrap .passage').innerText(),C.passages[name][i]);
   const id=`heading-${name}-${i}`;
   assert.deepEqual(await page.locator(`[name="${id}"]`).evaluateAll(els=>els.map(e=>Number(e.value))),O.headings[name]);
   assert.deepEqual(await page.locator(`[name="${id}"] + span`).allInnerTexts(),O.headings[name].map((value,pos)=>String.fromCharCode(65+pos)+'. '+C.headings[name][value]));
   await page.locator(`[data-check="${id}"]`).click(); // blank checking gives a hint; explicit model reveal is available
   await page.locator(`[name="${id}"][value="${C.keys[name][i]}"]`).check();
   await page.locator(`[data-check="${id}"]`).click();
   assert.match(await page.locator(`#feedback-${id}`).innerText(),/That fits/);
   assert((await page.locator(`#feedback-${id}`).innerText()).includes(C.feedback[name][i]));
  }
 }
 await step(11);assert.deepEqual(await page.locator('.passage').allInnerTexts(),C.passages.mohammed);
 // Saved answers and hidden optional help on reload.
 await step(4);assert(!(await page.locator('details.help').first().getAttribute('open')));await page.locator('details.help summary').click();assert(await page.locator('[name=q48]').first().isVisible());
 await page.reload();assert(await page.locator('[name="heading-trees-0"][value="0"]').isChecked());assert.match(await page.locator('#feedback-heading-trees-0').innerText(),/That fits/);
 // Match controls work by selecting, with no drag-and-drop dependency.
 await step(6);for(const [i,[word,meaning]] of C.vocabulary.llm.entries()){await page.locator(`#llm-words-${i}`).selectOption({label:meaning});}
 await page.locator('[data-reveal=llm-words-key]').click();assert(await page.locator('#llm-words-key').isVisible());
 // Bedouin repair interactions preserve the whole sentence and can be reversed.
 await step(18);const full=await page.locator('#repair-sentence').innerText();await page.locator('[data-middle]').click();assert(!await page.locator('.embedded').isVisible());assert(!(await page.locator('#repair-sentence').innerText()).includes('including improved'));await page.locator('[data-middle]').click();assert.equal(await page.locator('#repair-sentence').innerText(),full);
 await step(19);assert.equal(await page.locator('[data-reveal^=noun-]').count(),10);for(let i=0;i<4;i++){await page.locator(`[data-reveal=unpack-${i}]`).click();assert(await page.locator(`#unpack-${i}`).isVisible());}for(let i=0;i<10;i++){await page.locator(`[data-reveal=noun-${i}]`).click();assert(await page.locator(`#noun-${i}`).isVisible());}assert.match(await page.locator('#noun-0').innerText(),/employ → employment/);
 await step(20);for(let i=0;i<2;i++){await page.locator(`[data-reveal=passive-${i}]`).click();assert(await page.locator(`#passive-${i}`).isVisible());}
 // Late maps hidden initially; inspect every paragraph and save a learner map.
 await step(24);for(let i=0;i<5;i++){await page.locator(`[data-paragraph="food-argument"][data-index="${i}"]`).first().click();assert(!await page.locator(`#food-map-${i}`).isVisible());for(const[j,value]of [[0,1,4],[0,2,3],[0,2,1],[4],[5]][i].entries()){const id=`argument-${i}-${j}`;assert.deepEqual(await page.locator(`[name="${id}"]`).evaluateAll(els=>els.map(e=>Number(e.value))),O.fixed[id]);await page.locator(`[name="${id}"][value="${value}"]`).check();await page.locator(`[data-check="${id}"]`).click();assert.match(await page.locator(`#feedback-${id}`).innerText(),/That fits/);}await page.locator(`#map-note-${i}`).fill('claim → challenge → evidence');await page.locator(`[data-reveal=food-map-${i}]`).click();assert(await page.locator(`#food-map-${i}`).isVisible());}
 await page.reload();assert.equal(await page.locator('#map-note-4').inputValue(),'claim → challenge → evidence');
 // All source true/false checks and both matching pools are independent of displayed position.
 await step(15);for(const i of [228,229,230,231,232]){const id=`context-${i}`;assert.deepEqual(await page.locator(`[name="${id}"]`).evaluateAll(els=>els.map(e=>Number(e.value))),O.fixed[id]);await page.locator(`[name="${id}"][value="${i===230?1:0}"]`).check();await page.locator(`[data-check="${id}"]`).click();assert.match(await page.locator(`#feedback-${id}`).innerText(),/That fits/);}
 for(const [n,id,meanings] of [[6,'llm-words',C.vocabulary.llm.map(x=>x[1])],[8,'signals',['CAUSE','CHOICE / ALTERNATIVE','RESULT','CONTRAST']]]){
  await step(n);for(const [i,m]of meanings.entries()){assert.deepEqual(await page.locator(`#${id}-${i} option[value]:not([value=""])`).evaluateAll(els=>els.map(e=>Number(e.value))),O.matching[id]);await page.locator(`#${id}-${i}`).selectOption({label:m});}await page.reload();for(const[i,m]of meanings.entries())assert.equal(await page.locator(`#${id}-${i} option:checked`).innerText(),m);
 }
 // Neutral task titles do not pre-answer the LLM heading or Mohammed concept checks.
 await step(7);assert.equal(await page.locator('h1').innerText(),'Large Language Model');
 await step(12);assert.equal(await page.locator('h1').innerText(),'What is each paragraph doing?');assert(!await page.locator('#topic-function').isVisible());await page.locator('[data-reveal=topic-function]').click();assert.match(await page.locator('#topic-function').innerText(),/Topic ≠ function/);
 // Original v1 values remain attached to their original meanings after reordering.
 const legacy={step:14,answers:{q215:[0,1,2,3,4,5],'heading-bedouin-0':[3],'llm-words-0':[8]},checked:{q215:true,'heading-bedouin-0':true},notes:{reflection:'Keep this note'},visited:[0,14]};
 await page.evaluate(({key,legacy})=>localStorage.setItem(key,JSON.stringify(legacy)),{key,legacy});await page.reload();
 const countryOrder=await page.locator('[name=q215]').evaluateAll(els=>els.map(e=>Number(e.value)));
 assert(await page.evaluate(async()=>{const m=await import('./answer-order.js');return m.isMixedCountryOrder(JSON.parse(localStorage.getItem('ielts-reading-day-1-v1')).optionOrders.q215)}));
 assert.deepEqual((await page.locator('[name=q215]:checked + span').allInnerTexts()).sort(),['Saudi Arabia','Yemen','Oman','United Arab Emirates','Qatar','Kuwait'].sort());assert.match(await page.locator('#feedback-q215').innerText(),/That fits/);
 await page.reload();assert.deepEqual(await page.locator('[name=q215]').evaluateAll(els=>els.map(e=>Number(e.value))),countryOrder);
 await step(16);assert(await page.locator('[name="heading-bedouin-0"][value="3"]').isChecked());assert.match(await page.locator('#feedback-heading-bedouin-0').innerText(),/That fits/);await step(6);assert.equal(await page.locator('#llm-words-0 option:checked').innerText(),C.vocabulary.llm[0][1]);
 // Checking a blank answer never leaks the key; deliberate model access does not gate progression.
 await step(1);assert(!await page.locator('#feedback-q25').isVisible());await page.locator('[data-check=q25]').click();assert.match(await page.locator('#feedback-q25').innerText(),/^Choose an option/);assert(!(await page.locator('#feedback-q25').innerText()).includes(C.questions['25'].options[1]));await page.locator('[data-answer=q25]').click();assert((await page.locator('#feedback-q25').innerText()).includes(C.questions['25'].options[1]));
 await step(14);await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/reading-country-audit.png',fullPage:true});
 // Mobile comparison, touch-sized controls and screenshots.
 for(const width of [390,360]){
  await page.setViewportSize({width,height:844});await step(16);
  for(let i=0;i<4;i++){
   await page.locator(`[data-paragraph="bedouin-headings"][data-index="${i}"]`).first().click();assert(await page.locator('.passage-wrap').isVisible());assert(!await page.locator('.question-wrap').isVisible());
   await page.locator('[data-value=answer]').click();assert(await page.locator('.question-wrap').isVisible());assert(!await page.locator('.passage-wrap').isVisible());await overflow();
   await page.locator('[data-value=read]').click();assert(await page.locator('.passage-wrap').isVisible());
  }
  await page.locator('[data-paragraph="bedouin-headings"][data-index="0"]').first().click();await page.screenshot({path:`/tmp/reading-mobile-${width}.png`,fullPage:true});
  await page.locator('[data-value=answer]').click();await page.screenshot({path:`/tmp/reading-mobile-answers-${width}.png`,fullPage:true});
 }
 await page.setViewportSize({width:1440,height:1000});await step(16);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/reading-desktop.png',fullPage:true});await step(19);await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/tmp/reading-nouns.png',fullPage:true});
 // Navigation remains available when crossing the responsive breakpoint.
 await page.setViewportSize({width:390,height:844});assert(!await page.locator('#menu').evaluate(e=>e.open));await page.setViewportSize({width:1440,height:1000});await page.locator('#navigation button').first().waitFor({state:'visible'});
 // Keyboard-only interaction and focus after navigation.
 await step(1);await page.locator('[name=q25][value="1"]').focus();await page.keyboard.press('Space');await page.locator('[data-check=q25]').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#feedback-q25').innerText(),/That fits/);await page.locator('#next').focus();await page.keyboard.press('Enter');assert(await page.locator('#main').evaluate(e=>e===document.activeElement));
 // Corrupt and blocked storage must not block a full journey.
 for(const saved of ['broken-json','{"step":-999,"answers":null,"paragraphs":[],"visited":"bad"}','{"step":9999,"answers":{"q25":"bad"},"notes":[],"reveals":null}']){await page.evaluate(({key,saved})=>localStorage.setItem(key,saved),{key,saved});await page.reload();assert(await page.locator('h1').isVisible());assert(await page.locator('#navigation button').count()===9);}
 const blocked=await browser.newContext({viewport:{width:390,height:844}});await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('Storage blocked')}})});const bp=await blocked.newPage();bp.on('pageerror',e=>errors.push(e.message));await bp.goto(base);for(let i=0;i<26;i++)await bp.locator('#next').click();assert.equal(await bp.locator('h1').innerText(),titles[26]);assert.match(await bp.locator('#storage-note').innerText(),/Saving is unavailable/);
 await page.goto(base+'teacher-control/');assert.equal(await page.locator('section').count(),8);await overflow();
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);await browser.close();
 console.log('PASS: 27-step blank progression at six widths; all 32 source questions and heading keys; exact passages; wrong/blank/retry feedback; mobile paragraph comparison; vocabulary; repair tools; fading maps; keyboard; saved/legacy/corrupt/blocked storage; balanced option values, country persistence, true/false and argument keys, matching pools, explicit model access; teacher guide; no runtime/HTTP errors.');
})().catch(e=>{console.error(e);process.exit(1)});
