// Original source supplied by the user. Null keys are deliberately unmarkable.
const choices=(number,prompt,options,answer=null)=>({number,prompt,options,answer});
const typed=(number,prompt,answer=null,mode='text')=>({number,prompt,answer,mode});
export const sourceActivities=[
 {id:'l11',title:'Audio 1.1 — Choose the correct option',instruction:'Listen and choose the correct option.',audio:true,pending:true,questions:[
 choices('1','',['Parker','Barker']),choices('2','',['Vitec','Fitec']),choices('3','',['J','G']),choices('4','',['K47','Q47']),choices('5','',['EIN','AIN','AEN'])]},
 {id:'l12',title:'Audio 1.2 — Write what is spelt',instruction:'Listen and write the letters.',audio:true,pending:true,questions:Array.from({length:5},(_,i)=>typed(String(i+1),''))},
 {id:'l13',title:'Audio 1.3 — Days and dates',instruction:'Listen and complete the days and dates.',audio:true,pending:true,questions:['Arriving on','Appointment:','Start date:','Event date:','Date:'].map((p,i)=>typed(String(i+1),p))},
 {id:'calendar-spelling',title:'Spelling — days and months',instruction:'Choose the correct spelling.',questions:[
 choices('1','',['Febuary','February','Feburary'],'February'),choices('2','',['Aogast','Augest','August'],'August'),choices('3','',['Tuseday','Thuseday','Tuesday'],'Tuesday'),choices('4','',['Wensday','Wednesday','Wendesday'],'Wednesday'),choices('5','',['Thurdesday','Thursday','Thuesday'],'Thursday')]},
 {id:'l18',title:'Audio 1.8 — Hotel',audio:true,letters:true,questions:[
 typed('1','Write the man’s surname.','Rodriguez'),
 choices('2','How many nights does the guest want to stay in total?',['1 night','2 nights','3 nights'],'3 nights'),
 choices('3','What does the receptionist say about the final price?',['There’s a 25% fee','There’s a reduction','It’s higher'],'There’s a reduction'),
 choices('4','What’s the issue with his current booking?',['The room is not available until later in the day','The room is not available for the whole of his stay','Online booking doesn’t include extra nights'],'The room is not available for the whole of his stay'),
 choices('5','What floor is suggested first?',['Floor 15','Floor 5','Floor 6'],'Floor 5'),
 choices('6','Why doesn’t the guest accept the first room offered?',['It faces the sea','It doesn’t face the garden','It doesn’t have a sea view'],'It doesn’t have a sea view'),
 choices('7','Which floors are available with his request?',['Floors 16 and 17','Floors 6 and 7','Floors 16 and 7'],'Floors 6 and 7'),
 typed('8','Write the final room number.','642','numeric'),typed('9','Write the breakfast time.','6am–10am')]},
 {id:'l19',title:'Audio 1.9 — Numbers',instruction:'Listen and choose the number you hear.',audio:true,compact:true,questions:[
 choices('a','',['1st','3rd'],'1st'),choices('b','',['$10.15','$10.50'],'$10.50'),choices('c','',['6th','5th'],'5th'),choices('d','',['17','70'],'17'),choices('e','',['19','90'],'90'),choices('f','',['15','50'],'15'),choices('g','',['62','52'],'52'),choices('h','',['£110','£810'],'£110'),choices('i','',['27th','31st'],'31st'),choices('j','',['22nd','27th'],'27th')]}
];
export function breakfastMatches(value){
 // Both endpoints required. AM may be shared at the end or expressed as 24-hour time.
 const text=value.toLowerCase().trim().replace(/a\s*\.\s*m\s*\.?/g,'am').replace(/[–—−]/g,'-').replace(/\s+to\s+/g,'-').replace(/\s+/g,'');
 return /^(?:from)?0?6(?:[:.]00)?(?:am)?-10(?:[:.]00)?(?:am)?$/.test(text);
}
export function markSource(activity,question,value){
 if(activity.pending||question.answer===null)return null;
 const correct=activity.id==='l18'&&question.number==='9'?breakfastMatches(value):value.trim().toLowerCase()===question.answer.toLowerCase();
 return {correct,message:correct?'Correct.':`Answer: ${question.answer}.`};
}
