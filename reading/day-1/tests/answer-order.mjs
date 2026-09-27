import assert from 'node:assert/strict';
import {lesson as C} from '../content.js';
import {fixedOrders,headingOrders,matchingOrders,optionOrder,makeCountryOrder,isMixedCountryOrder} from '../answer-order.js';
const rows=[];
for(const q of Object.values(C.questions))if(!q.multi)rows.push({...q,order:fixedOrders[q.id]});
for(const [name,keys] of Object.entries(C.keys))for(const [i,key] of keys.entries())rows.push({id:`heading-${name}-${i}`,options:C.headings[name],correct:[key],order:headingOrders[name]});
for(const i of [228,229,230,231,232])rows.push({id:`context-${i}`,options:['True','False'],correct:[i===230?1:0],order:fixedOrders[`context-${i}`]});
for(const [i,keys] of [[0,1,4],[0,2,3],[0,2,1],[4],[5]].entries())for(const [j,key] of keys.entries())rows.push({id:`argument-${i}-${j}`,options:['Common claim','Challenge','Evidence / comparison','Qualification','Wider explanation','Synthesis'],correct:[key],order:fixedOrders[`argument-${i}-${j}`]});
assert.equal(rows.length,61);
const before={},after={};
for(const q of rows){
 assert(q.order,`Unaudited question: ${q.id}`);
 assert.deepEqual([...q.order].sort((a,b)=>a-b),q.options.map((_,i)=>i));
 const count=q.options.length;
 before[count]??=Array(count).fill(0);after[count]??=Array(count).fill(0);
 before[count][q.correct[0]]++;after[count][q.order.indexOf(q.correct[0])]++;
 assert.deepEqual(optionOrder(q,{}),q.order);
}
assert.deepEqual(after[2],[16,17]);assert.deepEqual(after[3],[2,2,2]);assert.deepEqual(after[6],[2,2,2,2,3,2]);
const binarySequence=[48,51,54,57,60,63,66,69,125,128,131,134,137,140,143,146,167,179,182,191,194,208,211,224,'context-228','context-229','context-230','context-231','context-232',314,317,380,429].map(id=>{const q=rows.find(q=>q.id===(typeof id==='number'?'q'+id:id));return q.order.indexOf(q.correct[0]);}).join('');
assert(!/0000|1111|01010|10101/.test(binarySequence),'A long streak or alternating run developed');
for(const [id,order]of Object.entries(matchingOrders)){assert.deepEqual([...order].sort((a,b)=>a-b),order.map((_,i)=>i));assert.notDeepEqual(order,order.map((_,i)=>i));assert.notDeepEqual(order,order.map((_,i)=>order.length-1-i));}
// Reproducible random sampling checks every position can contain either type.
let seed=3901;const randomIndex=max=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)%max;};
const wrongSlots=Array(8).fill(0),unique=new Set();
for(let i=0;i<5000;i++){const order=makeCountryOrder(randomIndex);assert(isMixedCountryOrder(order));unique.add(order.join(','));order.forEach((id,pos)=>{if(id>=6)wrongSlots[pos]++});}
assert(unique.size>200);assert(wrongSlots.every(n=>n>0&&n<5000));
for(const old of [undefined,null,[],[0,1,2,3,4,5,6,7],[0,0,1,2,3,4,5,6]]){const state={q215:old};assert(isMixedCountryOrder(optionOrder(C.questions['215'],state)));assert.strictEqual(optionOrder(C.questions['215'],state),state.q215);}
const answerLengths=rows.map(q=>{const lens=q.options.map(o=>o.split(/\s+/).length);return {id:q.id,right:lens[q.correct[0]],max:Math.max(...lens),uniqueLongest:lens.filter(n=>n===Math.max(...lens)).length===1&&lens[q.correct[0]]===Math.max(...lens)};});
console.log(JSON.stringify({singleChoiceCount:rows.length,before,after,binarySequence,matchingCorrectPositions:Object.fromEntries(Object.entries(matchingOrders).map(([id,o])=>[id,o.map((_,i)=>o.indexOf(o.length-1-i)+1)])),countryUniqueOrders:unique.size,countryWrongSlots:wrongSlots,uniqueLongestCorrect:answerLengths.filter(x=>x.uniqueLongest).length},null,2));
console.log('PASS: complete position inventory, fixed pools, balanced positions, stable canonical values, bounded mixed country shuffle and corrupt-order recovery.');
