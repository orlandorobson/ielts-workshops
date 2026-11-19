// Approved wording matches the existing examiner MP3 filenames exactly.
export const generalIntroduction="In this part, we'll discuss some more general questions. Listen to each question and give your answer. You can stop recording when you've finished.";
export const sets=[
 {id:'P3-S1',title:'Work and Employment',introduction:"Now, let's talk more generally about work and employment.",questions:[
 'What do you think makes a job enjoyable?',
 'Why do some people prefer to work for themselves rather than for a company?',
 "How have people's attitudes towards work changed compared with the past?",
 'Do you think earning a high salary is more important than enjoying your work?',
 'What responsibilities do employers have towards their workers?',
 'How do you think the kinds of jobs people do will change in the future?']},
 {id:'P3-S2',title:'Technology and Communication',introduction:"Let's move on to talk about technology and the way people communicate.",questions:[
 'How has technology changed the way people keep in touch with each other?',
 'Why do some people still prefer talking face to face rather than communicating online?',
 'Do you think young people and older people use technology differently?',
 'What problems can arise when people depend too much on digital communication?',
 'Do you think schools should teach children how to use technology responsibly?',
 'How might the way people communicate change in the future?']},
 {id:'P3-S3',title:'Education and Learning',introduction:"Now, I'd like to ask you some more general questions about education and learning.",questions:[
 'What do you think are the most important things children should learn at school?',
 'Why do some people enjoy learning new things more than others?',
 'How is learning as an adult different from learning as a child?',
 'Do you think examinations are a good way to measure what students have learned?',
 'Should schools give more attention to practical skills or academic subjects?',
 'How do you think education will change in the future?']}
];
export const audioScripts=Object.fromEntries([['P3-GENERAL-INTRO',generalIntroduction],...sets.flatMap(s=>[[`${s.id}-INTRO`,s.introduction],...s.questions.map((text,i)=>[`${s.id}-Q${String(i+1).padStart(2,'0')}`,text])])]);
