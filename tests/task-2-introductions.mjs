import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {task2Introductions as content,validChunkOrder,successfulChunkOrder} from '../content/writing/task-2-introductions.js';
import {loadContinuous,saveContinuous,mergeContinuousChanges,KEY,LEGACY_KEYS} from '../shared/js/task-2-continuous-storage.js';
const bank=JSON.parse(readFileSync(new URL('../content/writing/task-2-canonical/task-2-workshop-question-bank-v1.0.json',import.meta.url)));
assert.equal(new Set(content.judgements.map(item=>item.id)).size,content.judgements.length);
for(const item of content.judgements) assert(bank.questions.some(question=>question.id===(item.questionId||content.questionId)));
for(const builder of Object.values(content.builders)) {
 assert(validChunkOrder(builder.start,builder));
 assert(!successfulChunkOrder(builder.start,builder));
 for(const order of builder.valid) {assert(validChunkOrder(order,builder));assert(successfulChunkOrder(order,builder));}
 assert(!validChunkOrder(['missing'],builder));
 assert(!validChunkOrder(Array(builder.chunks.length).fill(builder.chunks[0].id),builder));
}
const records=new Map(LEGACY_KEYS.map((key,i)=>[key,JSON.stringify({unknownVersion:i,fullerDraft:'Original work'})]));
globalThis.localStorage={getItem:key=>records.get(key)||null,setItem:(key,value)=>records.set(key,value)};
const original=new Map(records);const initial=loadContinuous();assert.deepEqual(initial.history,Object.fromEntries(original));assert(saveContinuous(initial));assert.deepEqual(loadContinuous().history,initial.history);
const current={...initial,introduction:'My local draft',plan:{body1:'New reason'}};
const latest={...initial,introduction:'Newer writing in another screen',plan:{body1:'Newer plan'}};
let merged=mergeContinuousChanges(current,latest,new Set(['plan']),'Old introduction');
assert.equal(merged.introduction,latest.introduction);assert.deepEqual(merged.plan,current.plan);
merged=mergeContinuousChanges(current,latest,new Set(['introduction']),'Old introduction');
assert.equal(merged.introduction,current.introduction);assert.equal(merged.introductionHistory[0].text,latest.introduction);assert.deepEqual(merged.plan,latest.plan);
assert(saveContinuous(merged));for(const [key,value] of original)assert.equal(records.get(key),value);
records.set(KEY,'broken JSON');assert.throws(loadContinuous);assert.equal(records.get(KEY),'broken JSON');
globalThis.localStorage.setItem=()=>{throw Error('quota')};assert.equal(saveContinuous(current),false);
console.log('PASS: both valid sentence orders, invalid chunk IDs, repeatable legacy preservation, field merging, conflicting introduction recovery, corrupt records and saving failure.');
