export const addOptions=['WHEN','WHY','ONE DETAIL','WHEN I STARTED','HOW I FEEL'];
export const addPrompts=['When do you usually do it?','Why do you enjoy it?','What is one small thing about it?','When did you start doing it?','How do you feel afterwards?'];
export const places=[
 {name:'PERSON',prompt:'Who is actually in this story?',examples:['my father','my uncle','my friend','my teacher'],action:'Choose ONE person.',question:'Who do you want to talk about?'},
 {name:'PLACE',prompt:'Where does something usually happen?',examples:['at home','in the car','at a coffee shop','at the football ground'],action:'Choose ONE place you can picture.',question:'Where are you when you talk to this person?'},
 {name:'MOMENT',prompt:'Can you remember ONE time this happened?',examples:['Last week we watched a match together.'],action:'Find ONE moment.',question:'Can you remember one conversation or one time you were together?'},
 {name:'DETAIL',prompt:'What is one small thing you remember?',examples:['what someone said','what they were drinking','something you could see','something that always happens'],action:'Choose ONE detail.',question:'What is one small thing you remember from that time?'},
 {name:'CHANGE',prompt:'Was it always like this?',examples:['We didn’t talk much when I was younger.','I only started doing this recently.'],action:'Say what changed.',question:'Did you talk about the same things when you were younger?'},
 {name:'CONTRAST',prompt:'Is there something surprising or different?',examples:['My father is normally very quiet, but during football matches he never stops talking.'],action:'Find ONE contrast.',question:'Does this person behave differently in some situations?'},
 {name:'FEELING',prompt:'Why does this matter to you?',examples:['It makes me feel close to him.','I always feel calmer afterwards.','It reminds me of when I was younger.'],action:'Say how it affects you.',question:'How do you feel after talking to this person?'}
];
export const familyCard={title:'Describe a person in your family who you enjoy talking to.',points:['who this person is','how often you see them','what you talk about','and explain why you enjoy talking to this person.']};
export const placeCard={title:'Describe a place in your neighbourhood that you often go to.',points:['where it is','what kind of place it is','what you do there','and explain why you often go there.']};
export const quizzes={
 wrong:{question:'Is this answer wrong?',options:['YES','NO'],correct:[1],feedback:'The answer is not wrong. But it stops very quickly.'},
 next:{question:'What could the speaker do next?',options:['say when he goes','give one reason','remember when he started','say how it affects him','repeat “it’s healthy”','use a very difficult word'],correct:[0,1,2,3],multi:true,feedback:'Say when, give a reason, remember when he started, or say how it affects him.'},
 minute:{question:'What is the preparation minute for?',options:['write my whole answer','find some things to talk about','write complete sentences','prepare a map for my speaking'],correct:[1,3],multi:true,feedback:'Do not try to write your speech. Give yourself places to go.'},
 trap:{question:'What happened?',options:['the English is completely wrong','the speaker answered the points','the speaker ran out of material','the speaker needs much harder vocabulary'],correct:[1,2],multi:true,feedback:'He answered the points. But he treated them like four short questions.'},
 writing:{question:'What is the problem?',options:['it takes too long','I may start reading','I have only prepared the beginning','I still do not know where to go next'],correct:[0,1,2,3],multi:true,feedback:'Each of these can happen. Do not write your speech. Make a map.'}
};
export const runout=['I did not run out','after my first idea','between ideas','I had notes but did not know how to use them','I needed more detail','I was trying to make perfect sentences'];
export const repairs=['','Choose one note and add a moment or detail.','Look at the next note. Start simply: “Another thing is…” or move directly to the next idea.','Make notes that remind you of a story, place, person or detail.','Choose ONE thing you can picture.','Your notes are directions, not a script. Speak first. Repair if you need to.'];
export const officialSource={title:'Official IELTS Speaking test format',url:'https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking',verified:'2026-09-14'};
