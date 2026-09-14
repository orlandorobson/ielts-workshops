// Day 2 has isolated progress/releases. Original stage IDs are retained for saved state.
export const releaseConfig={
 dayId:'speaking-day-2',title:'Day 2',storageKey:'ielts-speaking-day-2-releases-v1',
 progressKeys:['ielts-speaking-day-2-v1'],defaultUnlockedStage:'go',allAccessCode:'9292',
 stages:[
  {id:'go',label:'Make it go somewhere',firstScreen:0},
  {id:'part2',label:'Meet Part 2',firstScreen:8,code:'2243',throughCode:'8243'},
  {id:'find',label:'Find something to say',firstScreen:12,code:'3285',throughCode:'8285'},
  {id:'map',label:'Make a map',firstScreen:16,code:'4377',throughCode:'8377'},
  {id:'practice',label:'Hear what works',firstScreen:22,code:'5486',throughCode:'8486'},
  {id:'beyond',label:'Do it for real',firstScreen:26,code:'6579',throughCode:'8579'}
 ]
};
