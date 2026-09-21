const {chromium}=require('playwright');const assert=require('node:assert/strict');
const api=process.env.CLASSROOM_API||'http://127.0.0.1:8787';
const base=process.env.STUDENT_URL||'http://127.0.0.1:8000/listening/day-1/';
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const contexts=await Promise.all([browser.newContext(),browser.newContext({viewport:{width:360,height:850}}),browser.newContext({viewport:{width:390,height:850}})]);
 const [teacher,a,b]=await Promise.all(contexts.map(c=>c.newPage()));const errors=[],payloads=[];
 for(const page of [teacher,a,b]){page.on('pageerror',e=>errors.push(e.message));page.on('request',req=>{if(req.url().startsWith(api))payloads.push({method:req.method(),body:req.postData()});});}
 await Promise.all([teacher.goto(base+'teacher-control/'),a.goto(base),b.goto(base)]);
 await teacher.locator('#create-class').click();await teacher.locator('[data-release=spell1]').waitFor({state:'visible'});
 await teacher.waitForFunction(()=>!document.querySelector('[data-release=spell1]').disabled);
 const code=(await teacher.locator('#classroom-code').textContent()).trim();assert.match(code,/^[A-HJ-NP-Z2-9]{6}$/);
 for(const page of [a,b]){await page.locator('#class-code').fill(code);await page.locator('#class-connect-form button').click();await page.getByText('Connected ✓',{exact:true}).waitFor();await page.locator('[data-spelling="1"] input').first().check();await page.locator('#l14-0').fill('2');assert.equal(await page.locator('[data-answer-check]:visible').count(),0);await page.locator('[data-spelling="1"]').evaluate(f=>f.requestSubmit());assert.equal(await page.locator('[data-spelling="1"] .result').textContent(),'');}
 const snapshots=await Promise.all([a,b].map(p=>p.locator('[data-spelling="1"] input:checked').getAttribute('value')));
 let start=Date.now();await teacher.locator('[data-release=spell1]').click();await Promise.all([a,b].map(p=>p.locator('[data-answer-check=spell1]').waitFor({state:'visible',timeout:7000})));const latency=Date.now()-start;
 for(const [i,page]of [a,b].entries()){assert.equal(await page.locator('[data-spelling="1"] input:checked').getAttribute('value'),snapshots[i]);assert.equal(await page.locator('#l14-0').inputValue(),'2');}
 await teacher.locator('[data-release=l14]').click();for(const page of [a,b]){await page.locator('[data-answer-check=l14]').waitFor({state:'visible'});assert.equal(await page.locator('[data-answer-check=l15]').isVisible(),false);}
 await contexts[1].setOffline(true);await a.locator('#l15-0').fill('offline work');await teacher.locator('[data-release=l15]').click();await b.locator('[data-answer-check=l15]').waitFor({state:'visible'});assert.equal(await a.locator('[data-answer-check=l15]').isVisible(),false);
 await contexts[1].setOffline(false);await a.locator('[data-answer-check=l15]').waitFor({state:'visible',timeout:12000});assert.equal(await a.locator('#l15-0').inputValue(),'offline work');
 for(const page of [a,b]){await page.reload();await page.getByText('Connected ✓',{exact:true}).waitFor();await page.locator('[data-answer-check=l14]').waitFor({state:'visible'});assert.equal(await page.locator('#l14-0').inputValue(),'2');}
 await teacher.reload();await teacher.waitForFunction(()=>!document.querySelector('#release-all').disabled);assert.equal((await teacher.locator('#classroom-code').textContent()).trim(),code);
 await teacher.locator('#release-all').click();for(const page of [a,b])await page.waitForFunction(()=>[...document.querySelectorAll('[data-answer-check]')].every(e=>!e.hidden&&!e.disabled));
 // Class code cannot act as the teacher credential.
 const denied=await a.request.post(`${api}/v1/classes/${code}/release?workshop=listening-day-1`,{headers:{Authorization:'Bearer '+code},data:{all:true}});assert.equal(denied.status(),403);
 for(const width of [360,390,430]){for(const page of [teacher,a,b]){await page.setViewportSize({width,height:850});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}}
 await a.evaluate(()=>scrollTo(0,0));await a.screenshot({path:'/tmp/classroom-student.png'});await teacher.evaluate(()=>scrollTo(0,0));await teacher.screenshot({path:'/tmp/classroom-teacher.png'});
 // Joining another/invalid class clears feedback access, but never student work.
 await a.locator('.connection-summary button').click();await a.locator('#class-code').fill('ZZZZZZ');await a.locator('#class-connect-form button').click();await a.getByText('That code is invalid or has expired. Check with your teacher.',{exact:true}).waitFor();assert.equal(await a.locator('[data-answer-check]:visible').count(),0);assert.equal(await a.locator('#l15-0').inputValue(),'offline work');
 // Expired HTTP response is tested here; real expiry/cleanup is separately tested in workerd.
 await a.route('**/v1/classes/ABC234?*',r=>r.fulfill({status:410,contentType:'application/json',body:'{"error":"expired"}'}));await a.locator('#class-code').fill('ABC234');await a.locator('#class-connect-form button').click();await a.getByText('That code is invalid or has expired. Check with your teacher.',{exact:true}).waitFor();
 const studentKeys=await b.evaluate(()=>Object.keys(localStorage));assert.ok(!studentKeys.some(k=>k.startsWith('ielts-teacher')));
 assert.ok(payloads.every(p=>!p.body||!/(offline work|choices|score|answers|device|student)/i.test(p.body)));
 assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,isolatedContexts:3,pushLatencyMs:latency,checks:'independent phones, preserved answers, separate releases, offline catch-up, refresh, teacher recovery, release all, unauthorized write, invalid/expired code, 360/390/430px, no answer upload'}));
}finally{await browser.close();}})();
