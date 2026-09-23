import assert from 'node:assert/strict';
import {activities} from '../content.js';
import {stages,serviceReady} from '../release-config.js';
const a=id=>activities.find(x=>x.id===id);
assert.equal(activities.length,18);assert.equal(stages.length,12);assert.equal(serviceReady,true);
for(const id of ['l41','l42','l43','l44','l45','l46']){assert(!a(id).pending);assert(a(id).questions.every(q=>q.answer!=null));}
assert.deepEqual(a('l46').questions.map(q=>q.label),['Conclusion','Promising development','Limitations','Evidence']);
assert.deepEqual(a('l48').questions.map(q=>q.number),[31,32,33,34,35,36,37,38,39,40]);
assert.deepEqual(a('l48').questions.map(q=>Array.isArray(q.answer)?q.answer[0]:q.answer),['water','corrode','limestone','small','capsules','A','D','C','F','G']);
assert.deepEqual(a('l48').questions.slice(0,5).map(q=>q.label),['Small cracks allow ______ to enter the concrete.','This can cause the steel reinforcement to ______.','When water enters through a crack, the bacteria produce calcium carbonate, which is similar to ______.','The technology is most effective at dealing with relatively ______ cracks.','Tiny ______ can protect the bacteria from the conditions inside the concrete.']);
assert(a('l48').questions.slice(0,5).every(q=>q.limit===1));
assert.deepEqual(a('l48').questions.slice(5).map(q=>q.label),['cost of conventional repairs','environmental impact','value in difficult-to-reach structures','initial cost of self-healing concrete','future development']);
assert.deepEqual(a('l47').questions.map(q=>q.answer[0]),['public','processing','formations','energy','waste materials','land','costs','intervals','30%','expensive']);
assert(!JSON.stringify(activities).includes('checkpoint'));
console.log('PASS source contracts: 4.8 definitive questions/key, petroleum key, authoritative 4.1–4.6, original order choices, follow-up dependencies, no old checkpoint.');

assert.deepEqual(a('l41').questions[0].answer,['emission levels','emissions']);
assert.deepEqual(a('l44').questions.map(q=>q.options.find(o=>o.value===q.answer).text),['Speaker 4','Speaker 1','Speaker 3','Speaker 2']);
assert.deepEqual(a('l46').questions.map(q=>q.answer),['4','1','3','2']);
assert.deepEqual(a('l47').questions[5].answer,['land']);
assert.equal(a('l47').questions[4].limit,2);
