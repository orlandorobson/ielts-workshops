import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {activities} from '../content.js';import {transcripts} from '../transcripts.js';
const source=fs.readFileSync(new URL('../day-4.js',import.meta.url),'utf8');
const nodes=new Map();const document={querySelector(selector){if(!nodes.has(selector))nodes.set(selector,{innerHTML:''});return nodes.get(selector);}};
class Connection{isOpen(){return false;}}
const context=vm.createContext({activities,transcripts,document,localStorage:{getItem(){return null;}},ClassroomConnection:Connection,workshop:'listening-day-4',stages:[],console});
const paragraph=source.slice(source.indexOf('function paragraphHTML'),source.indexOf('function renderAnalysis'));
vm.runInContext(paragraph,context);
vm.runInContext(source.slice(0,source.indexOf('const normal=')).replace(/^import .*;\n/gm,''),context);
const html=nodes.get('#activities').innerHTML;
const section=id=>html.slice(html.indexOf(`<section class="activity" id="${id}"`),html.indexOf('</section>',html.indexOf(`<section class="activity" id="${id}"`))+10);
const decode=s=>s.replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const clean=s=>decode(s.replace(/<span class="phrase-number"[^>]*>.*?<\/span>/g,'').replace(/<span class="paragraph-number">.*?<\/span>/g,'').replace(/<[^>]+>/g,''));
const normal=s=>s.replace(/\s+/g,'');
for(const[id,kind,count,phrases,num]of[['read47','petroleum',20,12,'4.7'],['read48','concrete',15,11,'4.8']]){
 const s=section(id);assert(!activities.find(a=>a.id===id).requires);assert(!s.includes('data-source-wait'));assert.equal((s.match(/class="transcript-paragraph"/g)||[]).length,count);assert.equal((s.match(/data-highlight=/g)||[]).length,phrases);
 const body=s.slice(s.indexOf('<div data-transcript>'),s.indexOf('<form'));
 assert(!/hidden|display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0/.test(body));
 const original=fs.readFileSync(new URL(`../source/audio-script-${num}.txt`,import.meta.url),'utf8').replace(/^youthful, intelligent London accent\]\s*\n/,'').replace(/\[(?:short|long) pause\]/g,'');assert.equal(normal(clean(body)),normal(original));
 assert(html.indexOf(`id="${id}"`)<html.indexOf(`id="local${num.replace('.','')}"`));
}
for(const text of ['Good morning everyone.','Now, one area that’s received a lot of attention recently is carbon capture technology.','the petroleum industry is gradually adapting to environmental and economic pressures.','So today I want to talk about concrete.',"But what if we didn’t?","And for something that basically looks like a gray block, that’s pretty remarkable."]){assert(normal(clean(html)).replaceAll("'",'’').includes(normal(text)),text);}
const ai=section('ai44');assert(!ai.includes('hidden="'));assert(!ai.includes('data-opinion hidden'));assert(!ai.includes('data-answer-check'));assert.equal((ai.match(/type="radio"/g)||[]).length,4);for(const o of activities.find(a=>a.id==='ai44').questions[0].options)assert(decode(ai).includes(o.text));
assert(!/After each pause: listen and update|What did you actually hear next\?/.test(html));
const analysis=source.slice(source.indexOf('function renderAnalysis'),source.indexOf('function syncSpeakers'));assert(!analysis.includes('data-transcript'));assert(!source.includes('body.replaceChildren'));
const css=fs.readFileSync(new URL('../day-4.css',import.meta.url),'utf8');assert(css.includes('.transcript-words{color:var(--ink,#172322)}'));assert(css.includes('.transcript-words strong{font-weight:750}'));
const indexURL=new URL('../index.html',import.meta.url);let index=fs.readFileSync(indexURL,'utf8');
if(process.argv.includes('--write')){index=index.replace(/<div id="activities">[\s\S]*?<section class="finish"/,`<div id="activities">${html}</div><section class="finish"`);fs.writeFileSync(indexURL,index);}
assert(index.includes(`<div id="activities">${html}</div>`),'Static student HTML must match the unconditional runtime output. Run with --write.');
console.log('PASS fresh no-release rendered AND static HTML: complete 20/15 paragraphs, 12/11 bold phrases, six required excerpts, no transcript gates/removal, visible unscored AI A–D, duplicate absent.');
