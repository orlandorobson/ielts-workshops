const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8000/listening/day-1/');await page.waitForSelector('[data-spelling="2"]');
const saved=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('ielts-listening-day-1-v1')));
let initial=await saved();
assert.equal(await page.locator('[data-spelling] fieldset').count(),40);assert.equal(await page.locator('[data-spelling] input').count(),160);
assert.notDeepEqual(initial.spell1.items.map(w=>w.target),initial.spell2.items.map(w=>w.target));assert.notDeepEqual(initial.spell1.items.map(w=>w.options),initial.spell2.items.map(w=>w.options));
for(const id of ['spell1','spell2']){assert.deepEqual(initial[id].choices,{});const beginning=initial[id].items.find(w=>w.target==='beginning');assert.equal(beginning.options.filter(v=>v==='beggining').length,2);}
// Independently sampled order/positions over 200 real-dataset permutations.
const random=await page.evaluate(async()=>{const {spellingWords,shuffle,validSpellingItems}=await import('/content/listening/day-1.js');const counts=Array(4).fill(0);const order=new Set();for(let i=0;i<200;i++){const items=shuffle(spellingWords).map(w=>({...w,options:shuffle(w.options)}));if(!validSpellingItems(items))throw Error('invalid permutation');order.add(items.map(w=>w.target).join(','));items.forEach(w=>counts[w.options.indexOf(w.target)]++);}return {counts,orders:order.size};});assert.ok(random.counts.every(n=>n>700&&n<1300));assert.equal(random.orders,200);
async function choose(attempt,correct){const s=(await saved())['spell'+attempt];for(let i=0;i<20;i++){const w=s.items[i],j=w.options.findIndex(v=>correct?v===w.target:v!==w.target);await page.locator(`[data-spelling="${attempt}"] input[name=word${i}][value="${j}"]`).check();}}
await choose(1,true);assert.equal(await page.locator('[data-spelling="2"] input:checked').count(),0);
await page.locator('[data-spelling="1"]').evaluate(f=>f.requestSubmit());assert.equal(await page.locator('[data-spelling="1"] .result').textContent(),'');assert.equal((await saved()).spell1.score,undefined);
await page.reload();assert.deepEqual((await saved()).spell1.items,initial.spell1.items);assert.equal(await page.locator('[data-spelling="1"] input:checked').count(),20);
await page.locator('#answer-release-form').evaluate(f=>{f.querySelector('input').value='381642';f.requestSubmit();});await page.locator('[data-answer-check=spell1]').click();assert.equal((await saved()).spell1.score,20);assert.equal((await saved()).spell1.results.filter(r=>r.correct).length,20);
await choose(2,false);await page.locator('[data-spelling="2"]').evaluate(f=>f.requestSubmit());assert.equal(await page.locator('[data-spelling="2"] .result').textContent(),'');
await page.locator('#answer-release-form').evaluate(f=>{f.querySelector('input').value='275438';f.requestSubmit();});await page.locator('[data-answer-check=spell2]').click();assert.deepEqual(await page.locator('[data-spelling="2"] .result p').allTextContents(),['First attempt: 20 / 20','This attempt: 0 / 20','The score is information. Look at which words are becoming easier and which still need practice.']);
await page.reload();assert.equal((await saved()).spell2.score,0);assert.match(await page.locator('[data-spelling="2"] .result').textContent(),/First attempt: 20 \/ 20/);
// Editing clears stale scores without revealing item correctness.
const second=(await saved()).spell2.items[0];await page.locator(`[data-spelling="2"] input[name=word0][value="${second.options.indexOf(second.target)}"]`).check();assert.equal(await page.locator('[data-spelling="2"] .result').textContent(),'');await page.locator('[data-answer-check=spell2]').click();assert.equal((await saved()).spell2.score,1);
for(const width of [360,390,430,1280]){await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
await page.setViewportSize({width:390,height:900});await page.locator('#spell1').evaluate(e=>e.scrollIntoView());await page.screenshot({path:'/tmp/listening-spelling-390.png'});
assert.deepEqual(errors,[]);console.log('Spelling checks passed: 40 groups/160 exact options, duplicate preserved, independent shuffle distribution, isolated attempts, persistence, release guards, 20/20 versus 0/20 comparison, editable results and responsive widths.');
}finally{await browser.close();}})();
