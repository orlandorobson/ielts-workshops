const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{
const page=await browser.newPage({reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:8000/listening/day-1/');await page.waitForSelector('#l17-6');
const forbidden=/\b(data|mondays|wednesdays|holborn|carter|june)\b|6:30/i;
async function audit(){
 // textContent includes collapsed/hidden content. Inspect learner-facing attributes and values too.
 const content=await page.locator('body').evaluate(el=>({text:el.textContent,attributes:Array.from(el.querySelectorAll('*')).flatMap(e=>['aria-label','title','placeholder','alt','value'].map(a=>e.getAttribute(a)||'')).join('\n'),values:Array.from(el.querySelectorAll('input,textarea')).map(e=>e.value).join('\n')}));
 for(const [kind,value] of Object.entries(content))assert.equal(value.match(forbidden)?.[0],undefined,`Leaked ${kind}: ${value.match(forbidden)?.[0]}`);
 assert.equal(await page.locator('.feedback:not(:empty),.followup:not(:empty),.result:not(:empty)').count(),0);
}
await audit();await page.locator('details').evaluateAll(els=>els.forEach(e=>e.open=true));
for(const button of await page.locator('.reveal').all())await button.click();await audit();
assert.equal(await page.locator('#l17-title').textContent(),'A London conversation');assert.equal(await page.locator('#l17 .sheet h3').textContent(),'Course information');
assert.deepEqual(await page.locator('#l17 .examples summary').allTextContents(),['library','£45','12 March','on the 12th of March']);
assert.deepEqual(await page.locator('#l17 .examples details p').allTextContents(),['✓ — one word','✓ — a number','✓ — a number + a word','✕ — too many words']);
assert.equal(await page.locator('#l17 .entry input').evaluateAll(els=>els.every(e=>!e.value&&!e.getAttribute('placeholder'))),true);
await page.locator('[data-task=l17]').evaluate(f=>f.requestSubmit());await audit();
await page.reload();await audit();
// Students' own saved input is retained, without correctness or pre-filled solutions.
await page.locator('#l17-0').fill('my guess');await page.locator('#l17-0').press('Enter');await page.reload();assert.equal(await page.locator('#l17-0').inputValue(),'my guess');await audit();
// Release alone shows no solution, and the renamed release status contains no answer.
await page.locator('#answer-release-form').evaluate(f=>{f.querySelector('input').value='918364';f.requestSubmit();});await audit();
await page.locator('[data-answer-check=l17]').click();assert.match(await page.locator('#l17-0-feedback').textContent(),/Answer: data/);
for(const [i,v]of ['data','Mondays','Wednesdays','6:30','Holborn','Carter','5th June'].entries())await page.locator(`#l17-${i}`).fill(v);await page.locator('[data-answer-check=l17]').click();assert.equal(await page.locator('[data-task=l17] .result').textContent(),'7 / 7 correct');
await page.setViewportSize({width:390,height:900});await page.locator('#l17').evaluate(e=>e.scrollIntoView());await page.screenshot({path:'/tmp/listening-17-fixed.png'});
assert.deepEqual(errors,[]);console.log('Leakage audit passed: full DOM text, expanded content, accessible attributes, HTML/live values, blank/restored state, submit/Enter, release-only state and unchanged seven answer keys.');
}finally{await browser.close();}})();
