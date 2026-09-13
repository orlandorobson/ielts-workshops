// Paths resolve from speaking/day-1/ and work under a GitHub Pages project prefix.
export const audioLibrary = {
  format: {id:'audio-01',label:'Audio 1 · The Speaking test',src:'../audio/audio-01-speaking-exam-format.mp3'},
  yusuf: [1,2,3].map(n=>({id:`audio-02-${n}`,label:`Audio 2 · Attempt ${n}`,src:`../audio/audio-02.${n}-yusuf.mp3`})),
  small: {id:'audio-03',label:'Audio 3 · Small improvement',src:'../audio/audio-03-small-improvement.mp3'},
  picture: {id:'audio-04',label:'Audio 4 · Picture the place',src:'../audio/audio-04-picture-the-place.mp3'},
  shadow: [
    {id:'audio-05',label:'Audio 5 · Neighbourhood',src:'../audio/audio-05-shadow-neighbourhood.mp3',text:'The thing I like about my neighbourhood is that there’s always something going on in the evening.'},
    {id:'audio-06',label:'Audio 6 · Free time',src:'../audio/audio-06-shadow-free-time.mp3',text:'I got into running a couple of years ago, and now it’s probably my favourite way to unwind after work.'}
  ],
  language: [
    {id:'audio-07',label:'Audio 7 · Family',src:'../audio/audio-07-family-get-togethers.mp3',text:"My uncle has a terrible sense of humour, but he always tells jokes at family get-togethers. Half the family complains about him, but everyone still laughs."},
    {id:'audio-08',label:'Audio 8 · Food / tradition',src:'../audio/audio-08-food.mp3',text:"So, my mother found this chocolate dessert on YouTube a few years ago ... uhh... and started making it for Iftar. Now everyone expects it, so somehow it’s become part of our Ramadan tradition."},
    {id:'audio-09',label:'Audio 9 · Neighbourhood',src:'../audio/audio-09-neighbourhood.mp3',text:"Right, so, there’s an old restaurant on my street. Honestly, the place looks pretty run-down, but they make this amazing beef stew, so it’s nearly always busy in the evening."},
    {id:'audio-10',label:'Audio 10 · Family memory',src:'../audio/audio-10-family.mp3',text:"My grandfather loves talking about when he was a fisherman in the seventies and eighties. I’ve heard some of the stories so many times I almost know them by heart."}
  ]
};
