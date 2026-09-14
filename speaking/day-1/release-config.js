// Classroom pacing only: these public, static codes are not authentication.
// Screen offsets refer to the existing 46-screen Day 1 sequence; no content is reordered.
export const releaseConfig = {
  dayId:'speaking-day-1', title:'Day 1', storageKey:'ielts-speaking-day-1-releases-v1',
  progressKeys:['ielts-speaking-day-1-v1'], defaultUnlockedStage:'exam', allAccessCode:'9191',
  stages:[
    {id:'exam',label:'Know the exam',firstScreen:0},
    {id:'self',label:'Hear yourself',firstScreen:3,code:'2142',throughCode:'8142'},
    {id:'notice',label:'Notice improvement',firstScreen:6,code:'3184',throughCode:'8184'},
    {id:'control',label:'Build control',firstScreen:17,code:'4276',throughCode:'8276'},
    {id:'sound',label:'Borrow the sound',firstScreen:26,code:'5368',throughCode:'8368'},
    {id:'transfer',label:'Make it yours',firstScreen:30,code:'6451',throughCode:'8451'}
  ]
};
