// Tests use the real local shared service, never storage-based release shortcuts.
const sessions=new WeakMap();const api=process.env.CLASSROOM_API||'http://127.0.0.1:8787',workshop='listening-day-1';
async function classroom(page){
 let session=sessions.get(page);if(!session){const response=await page.request.post(api+'/v1/classes',{data:{workshop}});if(!response.ok())throw Error('Local classroom service is not available');session=await response.json();sessions.set(page,session);}
 if(await page.locator('#class-connect-form').isVisible()){await page.locator('#class-code').fill(session.code);await page.locator('#class-connect-form button').click();}
 await page.getByText('Connected ✓',{exact:true}).waitFor();return session;
}
async function release(page,activity){const session=await classroom(page);const response=await page.request.post(api+`/v1/classes/${session.code}/release?workshop=${workshop}`,{headers:{Authorization:'Bearer '+session.teacherToken},data:activity==='all'?{all:true}:{activity}});if(!response.ok())throw Error('Release failed');await page.waitForFunction(id=>id==='all'?[...document.querySelectorAll('[data-answer-check]')].every(e=>!e.hidden):!document.querySelector(`[data-answer-check="${id}"]`).hidden,activity);}
module.exports={release,classroom};
