// Original workshop simulations. Insert teacher-produced MP3 paths in src; no browser TTS.
// Suggested durations are production targets, not IELTS scores or measured file durations.
export const procedure={id:'d2-procedure',label:'Teacher: Play the Part 2 simulation',src:null,
 intro:'Now I’m going to give you a topic. Please talk about it for one to two minutes. You have one minute to prepare, and you can make notes. Here is your task card. Please describe a person in your family who you enjoy talking to.',
 begin:'Your preparation time is finished. Please begin speaking now.',
 production:'Original examiner simulation, not an official IELTS recording. Calm, clear delivery. Insert exactly 60 seconds of silence between intro and begin, or record the two spoken sections separately and pause for a teacher-timed preparation minute. Do not read this direction aloud.'};
export const performances=[
  {
    "id": "d2-speaker-1",
    "label": "Maryam",
    "src": "../audio/audio-11-maryam.mp3",
    "script": "Okay... I'm going to talk about my older sister.\n\nHer name is Aisha and she's... uhh... twenty-nine years old. I see her almost every day because her house is quite near from us.\n\nWe normally talk about family things, about the work sometimes, and... you know, things that happened during the day.\n\nShe gives me a lot of advices— advice... especially about my work.\n\nAnd...\n\nYeah, I like talking to her because she's a very kind person and she always listen— listens to me.\n\nUmm...\n\nYeah... that's it, I think.",
    "profile": "Understandable and fairly careful; answers the card but runs out of material."
  },
  {
    "id": "d2-speaker-2",
    "label": "Khalid",
    "src": "../audio/audio-12-khalid.mp3",
    "script": "Right, so... I'm going to talk about my uncle, actually, because... yeah, probably he's the person I talk to most in my family.\n\nHe live near us— he lives near us, like maybe five minutes away, so I see him... not every day, but three, four times a week, something like that.\n\nAnd usually we talk about football. He's a big Barcelona fan and I'm... well, I used to support Barcelona when I was younger, but now— actually, that's a long story.\n\nBut, yeah, when there's a match he gets really... really... what's the word... excited. Like, too much excited.\n\nHe starts shouting at the TV and telling the players what to do. Like they can hear him.\n\nAnd... what else?\n\nYeah, he also give me advice about work because he had a business before. He had a small shop, actually, and he was working there for... maybe twelve years? Something like that.\n\nSo he always tell me— tells me— don't rush things, and save your money, and... because nowadays everything is expensive and before it was different, especially here, because—\n\nAnyway... yeah.\n\nI like talking to him because he has a lot of experience and he's funny as well, so... yeah.",
    "profile": "Plenty of lively material; sometimes loses grammatical control and direction."
  },
  {
    "id": "d2-speaker-3",
    "label": "Salim",
    "src": "../audio/audio-13-salim.mp3",
    "script": "Umm... I'll talk about my grandfather, actually.\n\nI don't ... see him as much as I was used to— uhh as much as I used to, uhh... because I work ... quite a lot now.\n\nBut I normally see him at the weekend... usually at his house.\n\nAnd, honestly,... I really like sitting with him because he has ALL these stories about Salalah, y'know... when he was younger... uhhh about...how the life was here— how life was here then.\n\nHe used to work as fisherman— I mean, as A fisherman, uhh... so he'll tell you about going out... uhhh... really early in the morning, sometimes before sunrise.\n\nAnd they used to have this...\n\nI don't know what you call it in English... uhhh... this kind of net they used for fishing.\n\nActually, there's one story he tells ALL the time ... uhh... about getting caught in really bad weather.\n\nI've heard it so many times I almost KNOW exactly what he's going to say next.\n\nBut... I still enjoy it.\n\nAnd the funny thing is, uhh... he's normally quite a quiet person, y'know? If there are lots of people around, he uhh.. don't say ...uhhh... doesn't say... very much.\n\nBut if you sit with him... maybe... with some tea, just, like, two or three people... then he'll talk for ages!\n\nThere wasn't any of this buildings around here before, y'know?... when he was young, so uhh... when he talk about it, it's... uhhh...it's almost like a different Salalah.\n\nI think that's probably why I enjoy talking to him, right?\n\nIt's not really advice, exactly. It's more like... I get a picture of ... of... a LIFE that was here before mine.\n\nAnd, yeah... I suppose it makes me feel connected to the place as well.",
    "profile": "Develops a path with details, repairs and explanation around a missing word; still makes errors."
  }
];
export const moments=[
  {
    "label": "Maryam · Repair and continue",
    "excerpt": "She gives me a lot of advices— advice... especially about my work.",
    "question": "What would you borrow from Maryam?",
    "notice": "She repairs a word and keeps speaking. Her main difficulty is finding more material."
  },
  {
    "label": "Khalid · A moment you can picture",
    "excerpt": "He starts shouting at the TV and telling the players what to do. Like they can hear him.",
    "question": "What would you borrow from Khalid?",
    "notice": "He gives us an action we can picture. His energy helps, even when he later loses the path."
  },
  {
    "label": "Salim · Explain around a missing word",
    "excerpt": "I don't know what you call it in English... uhhh... this kind of net they used for fishing.",
    "question": "What would you borrow from Salim?",
    "notice": "He explains what he means and continues. He does not need the exact word to keep the idea moving."
  }
];
export const finalCard={title:'Describe a time when someone helped you.',points:['who helped you','when and where it happened','what the person did','and explain how you felt about the help.']};
export const weaknesses=['I stopped after the first idea','I named things but did not explain them','I stayed too close to the bullet points','I could not find the next idea','I left out what happened or how I felt','I’m not sure yet'];
export const furtherActions=[
 ['add a small example','Choose one thing you said. Give one example.'],
 ['explain why','Choose one thing the person did. Say why it helped.'],
 ['describe one particular moment','Remember one moment. Say what you saw or heard.'],
 ['say what happened before or afterwards','Tell us what happened just before the help, or what changed afterwards.'],
 ['add what you thought or felt','Say what you thought at the time, or how you felt afterwards.'],
 ['move to another related detail','When one idea ends, look at your next note. Tell us one related detail.']
];
export const suggestedActions=[0,1,2,5,4,0];
export const compareQuestions=['Did I speak for longer?','Did I develop at least one idea?','Did I depend less on the bullet points?','When an idea ended, did I find somewhere else to go?'];
