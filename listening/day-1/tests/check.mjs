import assert from 'node:assert/strict';
import {tasks,mark,shuffle,phrases} from '../../../content/listening/day-1.js';
for (const task of tasks) for (const [i,q] of task.questions.entries()) {
 for(const answer of q[2]) assert.equal(mark(task.id,i,'  '+answer.toUpperCase()+'  ').correct,true,`${task.id} ${i} ${answer}`);
 assert.equal(mark(task.id,i,'wrong').correct,false);
 assert.equal(mark(task.id,i,'').correct,false);
}
assert.ok(mark('l14',1,'10:00').correction);
assert.match(mark('l14',2,'trasport').message,/spelling/);
assert.match(mark('l17',1,'Tuesdays').message,/information changed/);
assert.equal(mark('l17',6,'the 5th of June').correct,false);
assert.equal(mark('l15',3,'two hours').correct,false);
assert.equal(mark('l17',6,'5 Juen').correct,false);
const positions=new Set(Array.from({length:200},()=>shuffle([0,1]).join('')));
assert.equal(positions.size,2);
const patterns=new Set(Array.from({length:200},()=>phrases.filter(Boolean).map(()=>shuffle([0,1])[0]).join('')));
assert.ok(patterns.size>80);
assert.deepEqual([...shuffle(Array.from({length:20},(_,i)=>i))].sort((a,b)=>a-b),Array.from({length:20},(_,i)=>i));
console.log('Answer variants, diagnostic feedback, rejected answers and shuffle checks passed.');

const {sourceActivities,markSource,breakfastMatches}=await import('../../../content/listening/day-1-source.js');
for(const activity of sourceActivities)for(const q of activity.questions){
 if(activity.pending){assert.equal(markSource(activity,q,'anything'),null);continue;}
 assert.equal(markSource(activity,q,q.answer).correct,true);
 assert.equal(markSource(activity,q,'wrong').correct,false);
 assert.equal(markSource(activity,q,'').correct,false);
}
assert.deepEqual(sourceActivities.find(a=>a.id==='l18').questions.map(q=>q.number),['1','2','3','4','5','6','7','8','9']);
for(const value of ['6am–10am','6 am - 10 am','6 a.m. to 10 a.m.','06:00–10:00','6–10am','6 to 10','from 6am to 10am','6.00am—10.00am'])assert.equal(breakfastMatches(value),true,value);
for(const value of ['6am','10am','6am–10pm','6pm–10am','6:30–10:00','6–11','16–10','6am–22am','breakfast',''])assert.equal(breakfastMatches(value),false,value);
console.log('Source answer keys, pending keys, Hotel numbering and breakfast time variants passed.');
