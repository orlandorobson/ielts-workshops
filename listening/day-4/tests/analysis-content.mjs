import fs from 'node:fs';import assert from 'node:assert/strict';import {activities} from '../content.js';import {transcripts} from '../transcripts.js';import {stages} from '../release-config.js';
const a=id=>activities.find(a=>a.id===id),normal=x=>x.normalize('NFKC').replace(/\s+/g,' ').trim();
assert.equal(activities.length,18);assert.equal(stages.length,12);
assert.deepEqual(a('l44').questions.map(q=>[q.label,q.answer]),[['Sceptical','4'],['Amused','1'],['Optimistic','3'],['Fascinated','2']]);assert(a('l44').questions.every(q=>q.type==='speaker'));assert(a('ai44').independent);assert(a('ai44').questions.every(q=>q.answer==null));
for(const [kind,num]of[['petroleum',12],['concrete',11]]){const t=transcripts[kind];assert.equal(t.phrases.length,num);t.phrases.forEach((p,i)=>{assert.equal(p.number,i+1);assert(t.paragraphs[p.paragraph-1].includes(p.text),p.text);});}
assert.equal(normal(transcripts.concrete.paragraphs.join(' ')),normal(fs.readFileSync(new URL('../source/audio-script-4.8.txt',import.meta.url),'utf8')));
for(const id of['local47','local48']){assert.equal(a(id).questions.length,8);assert(a(id).questions.every(q=>q.options.some(o=>o.value===q.answer)&&q.refs.length));}
for(const id of['pattern47','pattern48']){assert.equal(a(id).questions.length,3);assert(a(id).questions.every(q=>q.options.some(o=>o.value===q.answer)&&q.refs.length));}
assert(!activities.some(a=>a.questions.some(q=>q.say)));assert(!activities.some(a=>['notice47','notice48','journey','transfer'].includes(a.id)));
assert.deepEqual(a('l47').questions.map(q=>q.answer[0]),['public','processing','formations','energy','waste materials','land','costs','intervals','30%','expensive']);
assert.deepEqual(a('l48').questions.map(q=>Array.isArray(q.answer)?q.answer[0]:q.answer),['water','corrode','limestone','small','capsules','A','D','C','F','G']);
console.log('PASS analytical source contracts: 18 sections / 12 releases; exact concrete text; 12/11 verbatim numbered phrases; 8+3 keyed questions each; dropdown key; unscored AI; no old Say It.');

const spoken47=fs.readFileSync(new URL('../source/audio-script-4.7.txt',import.meta.url),'utf8').replace(/^youthful, intelligent London accent\]\s*\n/,'').replace(/\[(?:short|long) pause\]/g,'');
assert.equal(normal(transcripts.petroleum.paragraphs.join(' ')),normal(spoken47));
assert(!/\[(short|long) pause\]|London accent/.test(transcripts.petroleum.paragraphs.join(' ')));
assert.equal(transcripts.petroleum.source,'source/audio-script-4.7.txt');
assert.equal(transcripts.concrete.source,'source/audio-script-4.8.txt');
