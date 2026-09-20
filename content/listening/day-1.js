// Source: the supplied Day 1 specification. Missing original material is not reconstructed.
export const instruction = 'Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.';
export const tasks = [
 {id:'l14', code:'1.4', title:'Mirbat snorkelling', heading:'Mirbat snorkelling trip', questions:[
  ['Approximate duration:','hours',['2','two'],'numeric'],
  ['Departure time:','',['9:30','9.30','09:30','09.30','9:30 am','9.30 am','9:30 a.m.'],'text'],
  ['Price also includes:','from Salalah',['transport'],'text']
 ]},
 {id:'l15',code:'1.5',title:'Mirbat again',heading:'Mirbat snorkelling trip',questions:[
  ['Reason for calling: to','some information',['check'],'text'],
  ['The trip follows the','',['coast'],'text'],
  ['Beginners need to feel OK in','',['water'],'text'],
  ['The trip normally takes','',['2 hours','2 hour','2hrs','2 hrs','2h','2 h'],'text'],
  ['Booking wanted for: Friday','',['25','25th'],'text']
 ]},
 {id:'l16a',code:'1.6A',title:'Listen for the information',heading:'Membership information',questions:[
  ['Basic · Monthly cost:','Home club',['15','$15','15 dollars','15.00','$15.00'],'decimal'],
  ['Black Card · Monthly cost:','Any club',['25','$25','25 dollars','25.00','$25.00'],'decimal'],
  ['Black Card · Extra benefit: bring a','',['guest'],'text'],
  ['Other costs · An annual fee applies to','memberships',['all'],'text'],
  ['Other costs · There is usually a small','fee',['startup','start-up'],'text']
 ]},
 {id:'l17',code:'1.7',title:'A London conversation',heading:'Course information',questions:[
  ['He wants to know about the','analytics course',['data'],'text'],
  ['Classes take place on','and…',['mondays','monday'],'text'],
  ['…and','',['wednesdays','wednesday'],'text'],
  ['Class start time:','',['6:30','6.30','06:30','06.30','18:30','18.30','6:30 pm','6.30 pm','6:30 p.m.'],'text'],
  ['Campus is near','',['holborn'],'text'],
  ['Surname:','',['carter'],'text'],
  ['Intake date:','',['5 june','5th june'],'text']
 ]}
];
export const phrases = [
 ['How can I help you?','Can I help you?'],
 ['I’m calling about your gym in Downtown LA.','I’m calling about your gym in LA city centre.'],
 ['I was just looking at the website and, uh, wanted to check a couple of things.','I checked your website and… uh… I have some questions.'],
 ['Yeah, sure. No worries.','OK, no problem.'],
 ['Okay. So, uh, I saw there are 2 different membership options?','What types of membership options do you have?'],
 ['Actually, before I go on, there’s also an annual fee that applies to all memberships.','Additionally, you need to pay an annual fee. It’s the same for all members.'],
 ['Yeah. So, um, the other option is the black card, which is around… let me check, 25 dollars a month','The Black Card membership costs… uh… just a minute… 25 dollars per month.'],
 ['Okay. I see.','Yes, I understand.'],
 ['Right. Okay. Yeah, I think I’ll go with the black card.','I have decided to choose the Black Card membership.']
];
export const speaking = [
 ['You’re working at the gym. Pick up the phone and ask what the caller wants.',phrases[0][0]],
 ['You’re the caller. Explain that you’re calling about the gym in LA city centre.',phrases[1][0]],
 ['Say that you were checking the website and want to know a little more.',phrases[2][0]],
 ['You’re the employee. Show that you’re happy to answer.',phrases[3][0]],
 ['You’re the caller. You think there are two membership options. Check that you’re right.',phrases[4][0]],
 ['You’re explaining the memberships. You suddenly remember something important. Add it before you continue.',phrases[5][0]],
 ['Tell them about the Black Card. You’re not completely sure of the price, so check it while you’re speaking.',phrases[6][0]],
 ['You’re the caller. Show that you’ve understood.',phrases[7][0]],
 ['You’ve decided. Choose the Black Card.','Yeah, I think I’ll go with the black card.']
];
export const spellingTargets = ['accommodation','environment','government','beginning','occurred','successful','necessary','definitely','separate','foreign','business','restaurant','library','February','chocolate','beautiful','medicine','college','traffic','tourism'];
// Exact authored options; the repeated beginning distractor is intentional.
export const spellingWords = [
 ['accommodation',['acomodation','acommodation','accomodation','accommodation']],
 ['environment',['environment','envaironment','enviornment','enviroment']],
 ['government',['governmant','goverment','govenment','government']],
 ['beginning',['beggining','beggining','beginning','begining']],
 ['occurred',['occurred','ocurred','occured','occurrred']],
 ['successful',['sucsessful','sucessful','successful','succesful']],
 ['necessary',['necasary','neccessary','nessasary','necessary']],
 ['definitely',['definitely','definately','definatly','defanitely']],
 ['separate',['seprate','seperete','seperate','separate']],
 ['foreign',['foren','forein','foreign','foriegn']],
 ['business',['buisness','business','bisness','bussiness']],
 ['restaurant',['restarant','restaurant','restuarant','resturante']],
 ['library',['libary','lybrary','library','librery']],
 ['February',['February','Fabruary','Febrery','Febuary']],
 ['chocolate',['chocolate','chocolet','chocalate','choclate']],
 ['beautiful',['beautifel','beautiful','beautifull','butiful']],
 ['medicine',['medicine','medicen','madicine','medecine']],
 ['college',['college','colage','colege','collage']],
 ['traffic',['trafec','traffick','traffic','trafick']],
 ['tourism',['tourism','tourrism','tourisim','tourizum']]
].map(([target,options])=>({target,options}));
export function validSpellingItems(items){
 return Array.isArray(items)&&items.length===20&&new Set(items.map(w=>w?.target)).size===20&&items.every(w=>{
 const source=spellingWords.find(s=>s.target===w?.target);
 return source&&Array.isArray(w.options)&&JSON.stringify([...w.options].sort())===JSON.stringify([...source.options].sort());
 });
}
export function shuffle(items, random = Math.random) {
 const result = [...items];
 for (let i=result.length-1;i>0;i--) {const j=Math.floor(random()*(i+1)); [result[i],result[j]]=[result[j],result[i]];}
 return result;
}
export const normalise = value => value.trim().toLowerCase().replace(/\s+/g,' ');
export function mark(id,index,value) {
 const q=tasks.find(t=>t.id===id).questions[index];
 const answer=normalise(value);
 if(q[2].includes(answer)) return {correct:true,message:'Correct.'};
 if(id==='l14' && index===1 && /^(10([:.]00)?)(\s*a\.?m\.?)?$/.test(answer)) return {correct:false,correction:true,message:'You heard a real time — but not the final time.'};
 if(id==='l14' && index===2 && ['trasport','tranport','transort','transpot','transprot'].includes(answer)) return {correct:false,message:'You understood the answer. Check the spelling. Answer: transport.'};
 if(id==='l17' && [1,2].includes(index) && ['tuesday','tuesdays','thursday','thursdays'].includes(answer)) return {correct:false,message:'Those days were mentioned, but the information changed. Keep listening after a possible answer. Answer: '+q[2][0]+'.'};
 return {correct:false,message:(answer?'Check this answer.':'No answer yet.')+' Answer: '+q[2][0]+'.'};
}
