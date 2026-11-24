// Content only: the engine supports any two-option language activity.
export const activity = {
  id: 'silent-e-ing',
  questions: [
    { sentence: 'Many people are ___ Netflix.', options: ['using', 'useing'], answer: 'using' },
    { sentence: 'My brother is ___ in Muscat.', options: ['living', 'liveing'], answer: 'living' },
    { sentence: 'The plane is ___ at six.', options: ['arriving', 'arriveing'], answer: 'arriving' },
    { sentence: 'Students are ___ computers in class.', options: ['using', 'useing'], answer: 'using' },
    { sentence: 'The shop is ___ at nine.', options: ['closing', 'closeing'], answer: 'closing' },
    { sentence: 'She is ___ money for a new car.', options: ['saving', 'saveing'], answer: 'saving' },
    { sentence: 'They are ___ for their exam.', options: ['preparing', 'prepareing'], answer: 'preparing' },
    { sentence: 'His English is ___.', options: ['improving', 'improveing'], answer: 'improving' },
    { sentence: 'More adults are ___ streaming platforms.', options: ['using', 'useing'], answer: 'using' },
    { sentence: 'The weather is ___.', options: ['changing', 'changeing'], answer: 'changing' }
  ],
  feedback: { correct: 'Yes — that spelling fits.', incorrect: 'Good try. Notice the correct spelling below.' },
  reveal: {
    title: 'The pattern you have been using',
    text: 'For these verbs ending in a silent e, remove the final e before adding -ing.',
    examples: [
      { stem: 'us', removed: 'e', suffix: 'ing', result: 'using' },
      { stem: 'liv', removed: 'e', suffix: 'ing', result: 'living' },
      { stem: 'prepar', removed: 'e', suffix: 'ing', result: 'preparing' },
      { stem: 'chang', removed: 'e', suffix: 'ing', result: 'changing' }
    ],
    note: 'use → using · live → living · arrive → arriving · close → closing · save → saving · prepare → preparing · improve → improving · change → changing'
  }
};
