export const audios = [
  {
    "name": "Fatma",
    "script": "Okay... from what I know, the Speaking exam is about thirty minutes altogether.\n\nThere are three parts, so... around ten minutes for each part, I think.\n\nIn Part 1, the examiner asks you some questions about yourself. It’s kind of like an ice-breaker... you know, just to get you talking.\n\nThen in Part 2, you have a little time to prepare, and you give a short presentation on a topic.\n\nAnd Part 3 is different. The questions make you think more... like explaining your ideas and discussing things in more detail.",
    "performance": "- late 20s\n- Dhofari Omani woman\n- Arabic first language\n- comfortable intermediate English\n- warm, friendly and slightly careful\n- natural Gulf Arabic influence\n- not caricatured and not intentionally “bad English”",
    "src": null
  },
  {
    "name": "Hisham",
    "script": "Hmm... I agree with Fatma about the first part. I’m pretty sure they start by asking you questions about yourself.\n\nBut I don’t think the exam is thirty minutes. I think the whole thing is only about ten minutes.\n\nAnd... as far as I know, there are actually two parts.\n\nFirst, the examiner asks you questions and you answer them.\n\nThen they give you a topic, you have some time to think about it... and you give a short presentation.\n\nAt least, that’s how I understand it.",
    "performance": "- about 25\n- Jibbali man from Dhofar\n- recently graduated\n- quiet and reflective\n- thoughtful, articulate English\n- measured rather than socially dominant\n- clear English with subtle Dhofari influence",
    "src": null
  },
  {
    "name": "Mahmoud",
    "script": "Yeah, Hisham’s right that it’s short. I’m pretty sure it’s somewhere between ten and fifteen minutes.\n\nBut there are definitely three parts.\n\nBasically, Part 1 is where they give you a topic and you do a short presentation.\n\nThen in Part 2, the examiner asks you questions about what you just talked about... so it’s kind of like a follow-up.\n\nAnd then Part 3 is a role-play situation. Like, they give you a situation and you have to respond to it.\n\nSo yeah... three different stages, basically.",
    "performance": "- 19-year-old Sudanese man\n- confident\n- very comfortable conversational English\n- socially expressive\n- picks up appropriate informal expressions from social media/international English\n- relaxed, modern speech\n- should sound natural, not like an exaggerated TikTok character\n- confidence must NOT imply that his information is correct",
    "src": null
  },
  {
    "name": "Attempt 1",
    "script": "In my free time... I like to go to the gym... and also, I like playing football with my friends.\n\nI go to the gym maybe... four times in the week, because... it is good for my health... and I enjoy it.",
    "performance": "- cautious\n- slightly self-conscious\n- thinking about constructing English\n- narrow intonation\n- hesitation inside ideas\n- intelligible\n- NOT incompetent\n- NOT caricatured",
    "src": null
  },
  {
    "name": "Attempt 2",
    "script": "I usually go to the gym in my free time, maybe four times a week, and I play football with my friends as well.\n\nI really enjoy exercise because it makes me feel good... especially after a busy day.",
    "performance": "- same underlying speaker\n- more comfortable\n- thinking about meaning\n- natural pauses between ideas\n- clearer phrasing\n- slightly more expressive stress and intonation\n- not significantly faster",
    "src": null
  },
  {
    "name": "Attempt 3",
    "script": "Probably the gym, actually.\n\nI go about four times a week, and I play football with my friends sometimes as well.\n\nI don’t know... I just really enjoy being active.\n\nI always feel better afterwards.",
    "performance": "- same speaker\n- relaxed\n- conversational\n- engaged with listener\n- natural spontaneous rhythm\n- meaningful intonation\n- “I don’t know...” is natural conversational framing, NOT communication breakdown\n- not formal\n- not exaggerated\n- do NOT simply make him faster",
    "src": null
  }
];
// One continuous recording; speaker text stays exactly as supplied above.
export const listening = { src: null, speakers: audios.slice(0, 3) };
export const question = 'What do you like doing in your free time?';
export const strengths = ['I answered clearly','I kept going','I gave some detail','I used a good word or phrase','I sounded comfortable','My pronunciation was clear','Something else'];
export const changes = ['I stopped too much','I rushed','I repeated words','I couldn’t find a word','I didn’t finish some sentences','My answer was very short','My voice sounded flat','Some words were not clear','Something else','I’m not sure yet'];
export const actions = ['Finish one idea at a time. A short pause is okay.','Slow the start. Pause between ideas.','Choose one repeated word. Try another way to say it.','Don’t stop. Explain the word another way.','Finish one thought before you start the next.','Add ONE reason or detail.','Choose one important word. Make it stand out.','Say the important words clearly. Don’t rush them.','Choose one small change of your own.','Try this: Add one reason.'];
export const palette = [
 ['CALM','Give yourself time.',['Pause between ideas.','Don’t rush your first words.','Restart calmly if you need to.']],
 ['CLEAR','Make your meaning easy to follow.',['Finish the thought.','Make important words clear.','Make one key word stand out.']],
 ['ENGAGED','Talk to the person.',['React to the question.','Answer as if someone really wants to know.','Let your voice show interest.']],
 ['PRECISE','Say what you really mean.',['Change one vague word.','Choose the word that fits.','Don’t use a difficult word just to sound advanced.']],
 ['FLEXIBLE','Find another way.',['Explain a word you cannot remember.','Repair a sentence and continue.','Change direction if your first idea does not work.']],
 ['DEVELOP','Give your answer somewhere to go.',['Add one reason.','Add one detail.','Add one example.']]
];
export const listeningQuestions = [
 ['listening-time','1. Who thinks the Speaking test lasts about 10–15 minutes?',['Fatma','Hisham','Mahmoud'],[2]],
 ['listening-parts','2. Who thinks there are 3 parts?',['Fatma','Hisham','Mahmoud'],[0,2]]
];
export const listeningStages = ['Questions about yourself','Prepare and speak on your own about one topic','Discuss broader ideas and explain your thinking'];
export const listeningSummary = '<p>Put the answers together:</p><p>The IELTS Speaking test lasts about 10–15 minutes.<br>There are 3 parts.</p><p>Part 1 — Questions about you and familiar topics<br>Part 2 — Prepare, then speak on your own about one topic<br>Part 3 — Discuss broader ideas</p>';
export const yusufChanges = ['easier to follow','clearer','better pauses','ideas connect better','sounds more interested','sounds more natural','better words','better sentences','something else'];
export const compareChanges = ['I paused better','I kept going more easily','my answer was clearer','I found words more easily','my answer developed more','my voice sounded more natural','I made fewer mistakes','I made more mistakes','not much changed yet'];
export const reflections = ['I understand the 3 parts of the test.','I heard what my own speaking sounds like.','I changed one thing in my speaking.','I found one style control I want to practise.'];
