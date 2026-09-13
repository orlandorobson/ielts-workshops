export const borrowed = ['rhythm','stress','intonation','pauses','a sound','I’m not sure'];
export const shadowPhrases = ['I got into _____ a couple of years ago.','It’s probably my favourite way to unwind.','_____ helps me unwind after work.'];
export const languageTasks = [
  {
    question:'What makes this answer interesting?',
    options:['a specific person','a small contrast','a real family habit','difficult vocabulary'], correct:[0,1,2], multi:true,
    feedback:'A specific person, a small contrast and a real family habit make it interesting.',
    chunks:['at family get-togethers','always tells jokes','everyone still laughs'],
    prompt:'Think of ONE person in your family. What do they always do?',
    frame:'My _____ always _____.'
  },
  {
    question:'What happens in this little story?',
    stages:['She found a recipe.','She started making it.','It became a tradition.'],
    feedback:'First, she found a recipe. Then she started making it. It became a tradition.',
    chunks:['started making it a few years ago','everyone expects it','it’s become part of our _____ tradition'],
    prompt:'What food or habit has become part of a tradition in your family or community?'
  },
  {
    question:'What makes the place easy to picture?',
    options:['“old restaurant”','“run-down”','“amazing beef stew”','“nearly always busy”','all of these'],correct:[4],
    feedback:'All of these help you picture the place.',
    contrast:'Notice the contrast: The place does not look impressive. But the food is excellent.',
    prompt:'Think of a place near you with one surprising contrast.',
    frame:'It looks _____, but _____.'
  },
  {
    question:'What makes this personal?',
    options:['the grandfather','the fishing memory','the speaker’s reaction','all of these'],correct:[3],
    feedback:'All of these make it personal.',
    chunks:['loves talking about when…','I’ve heard the stories so many times…','I almost know them by heart.'],
    prompt:'Think of one story someone in your family often tells.'
  }
];
export const transferTopics=['free time','neighbourhood','family','food','celebrations'];
export const transferActions=['one useful phrase','one real detail','one contrast','one small story','one style control'];
export const worked=['I used a more precise phrase','I gave a real detail','my answer developed more','I sounded more natural','my rhythm changed','I made my meaning clearer','something else'];
export const finalReflection=['I can notice small changes in my speaking.','I can repeat the same question and improve one thing.','I can use a more useful phrase.','I can explain something another way.','I can borrow rhythm or intonation from a model.','I can add one real detail.','I can make an answer more personal.','I know one thing I want to practise next.'];
