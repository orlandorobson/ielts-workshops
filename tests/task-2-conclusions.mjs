import assert from 'node:assert/strict';
import {formatTask2Writing,mergeContinuousChanges,saveContinuous,loadContinuous,KEY} from '../shared/js/task-2-continuous-storage.js';
const current={version:1,questionId:'WT2-W06',plan:{body1:'My notes'},choices:{},history:{legacy:'Original draft'},introduction:'Old intro',paragraph1:'Old first paragraph',paragraph2:'Old second paragraph',conclusion:'My edited ending',conclusionActivities:{votes:{'WT2-C-VOTE-03':'splat'},repair:'My repair'}};
const latest={...current,introduction:'Newer introduction',paragraph1:'Newer first paragraph',paragraph2:'Newer second paragraph',conclusion:'Ending from another screen',conclusionHistory:[{text:'Earlier ending'}]};
const merged=mergeContinuousChanges(current,latest,new Set(['conclusion']),'Old intro',{conclusion:'Original ending'});
assert.equal(merged.conclusion,current.conclusion);assert.equal(merged.introduction,latest.introduction);assert.equal(merged.paragraph1,latest.paragraph1);assert.equal(merged.paragraph2,latest.paragraph2);
assert.equal(merged.conclusionHistory.length,2);assert.equal(merged.conclusionHistory[1].text,latest.conclusion);assert.deepEqual(merged.history,current.history);
const notesOnly=mergeContinuousChanges(current,latest,new Set(['plan']),'Old intro');assert.equal(notesOnly.conclusion,latest.conclusion);
const records=new Map();globalThis.localStorage={getItem:key=>records.get(key)||null,setItem:(key,value)=>records.set(key,value)};
assert(saveContinuous(merged));assert.equal(loadContinuous().conclusion,current.conclusion);assert.deepEqual(loadContinuous().conclusionActivities,current.conclusionActivities);
const before=records.get(KEY);globalThis.localStorage.setItem=()=>{throw Error('quota')};assert.equal(saveContinuous(current),false);assert.equal(records.get(KEY),before);
console.log('PASS: conclusion-only saves preserve paragraphs/introduction, conflicting endings retained, plan changes keep newer endings, conclusion activities reload, save failure preserves stored work.');

const writing=formatTask2Writing(merged,'Exact question wording');for(const value of ['Exact question wording',merged.introduction,merged.paragraph1,merged.paragraph2,merged.conclusion]) assert(writing.includes(value));assert(!writing.includes('conclusionActivities'));
