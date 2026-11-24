// The original ten-question spelling activity is retained unchanged.
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


const question = (sentence, options, answer, explanation) => ({ sentence, options, answer, explanation });
const choice = (id, title, description, questions, rule) => ({
  id, title, description, type: 'choice', questions,
  instruction: 'Choose the words that complete the sentence.',
  feedback: { correct: 'Yes — that fits.', incorrect: 'Good try. Read the complete sentence below.' },
  reveal: { title: 'What to remember', text: rule, examples: [] }
});

export const source = {
  title: 'Saudi adult streaming platform use in 2025',
  usage: [['Shahid', 51], ['Netflix', 29], ['STC TV', 15]],
  overlap: [['Shahid and Netflix', 21], ['Shahid and STC TV', 13], ['Netflix and STC TV', 6], ['All three platforms', 6]],
  note: 'Figures supplied for this practice. Overlap figures are reported labels. Do not add them or use them to calculate separate audiences.'
};

export const activities = [
  choice('subject-verb', 'Subject–verb agreement', '10 choices · Match the subject and verb', [
    question('The bar chart ___ platform use.', ['show', 'shows'], 'shows'),
    question('People ___ streaming platforms.', ['use', 'uses'], 'use'),
    question('The Venn diagram ___ audience overlap.', ['show', 'shows'], 'shows'),
    question('This ___ the most popular platform.', ['show', 'shows'], 'shows'),
    question('Shahid ___ the highest figure.', ['have', 'has'], 'has'),
    question('Netflix and STC TV ___ lower figures.', ['have', 'has'], 'have'),
    question('The chart ___ information about Saudi adults.', ['give', 'gives'], 'gives'),
    question('These figures ___ platform use in 2025.', ['describe', 'describes'], 'describe'),
    question('The largest overlap label ___ 21%.', ['show', 'shows'], 'shows'),
    question('The two smallest overlap labels ___ 6%.', ['show', 'shows'], 'show')
  ], 'Use shows, uses or has with one thing: the chart shows; this shows. Use show, use or have with people or more than one thing: people use; these figures show.'),
  choice('complete-verbs', 'Complete verb structures', '10 choices · Make a complete sentence', [
    question('Many people ___ streaming platforms.', ['use', 'using'], 'use'),
    question('Saudi adults ___ online programmes.', ['watch', 'watching'], 'watch'),
    question('People ___ these apps for entertainment.', ['use', 'using'], 'use'),
    question('The chart ___ three platforms.', ['compares', 'comparing'], 'compares'),
    question('Some adults are ___ Netflix.', ['use', 'using'], 'using'),
    question('More people are ___ online video.', ['watch', 'watching'], 'watching'),
    question('The diagram ___ audience overlap.', ['shows', 'showing'], 'shows'),
    question('People ___ themselves with these apps.', ['entertain', 'entertaining'], 'entertain'),
    question('Some adults ___ more than one platform.', ['choose', 'choosing'], 'choose'),
    question('Adults are ___ programmes on Shahid.', ['watch', 'watching'], 'watching')
  ], 'A complete main clause needs a complete verb: people use these apps. An -ing form needs a helping verb here: people are using these apps.'),
  { ...activity, type: 'choice', title: 'Written word forms', description: '10 choices · Choose & notice', instruction: 'Choose the correct spelling.', bonus: 'more-word-forms' },
  choice('number-agreement', 'Singular, plural and pronoun agreement', '10 choices · Keep words in agreement', [
    question('The chart compares three ___.', ['application', 'applications'], 'applications'),
    question('___ apps provide entertainment.', ['This', 'These'], 'These'),
    question('People entertain ___ with online programmes.', ['himself', 'themselves'], 'themselves'),
    question('___ platform has the highest figure.', ['This', 'These'], 'This'),
    question('The diagram includes three ___.', ['platform', 'platforms'], 'platforms'),
    question('___ figures describe Saudi adults.', ['This', 'These'], 'These'),
    question('One ___ is Netflix.', ['application', 'applications'], 'application'),
    question('Adults choose programmes for ___.', ['himself', 'themselves'], 'themselves'),
    question('The chart shows two lower ___.', ['percentage', 'percentages'], 'percentages'),
    question('___ diagram shows audience overlap.', ['This', 'These'], 'This')
  ], 'Use a plural after two or three: three applications. Use this with one thing and these with more than one: this app; these apps. With people, use themselves.'),
  choice('prepositions', 'Prepositions', '10 choices · Choose a small linking word', [
    question('The figures describe platform use ___ 2025.', ['at', 'in'], 'in'),
    question('The adults live ___ Saudi Arabia.', ['at', 'in'], 'in'),
    question('The chart gives information ___ streaming platforms.', ['about', 'at'], 'about'),
    question('Shahid leads ___ 51%.', ['at', 'on'], 'at'),
    question('Netflix is second ___ 29%.', ['at', 'in'], 'at'),
    question('STC TV accounts ___ 15% in the supplied usage figures.', ['for', 'to'], 'for'),
    question('The label ___ Shahid and Netflix is 21%.', ['for', 'at'], 'for'),
    question('The data refer ___ Saudi adults.', ['to', 'at'], 'to'),
    question('People use these apps ___ entertainment.', ['for', 'in'], 'for'),
    question('The chart compares Netflix ___ Shahid.', ['with', 'at'], 'with')
  ], 'Use in with a year or country: in 2025; in Saudi Arabia. Use at with a percentage: at 51%. Other useful groups are information about, accounts for, refer to and compare with.'),
  {
    id: 'overviews', title: 'Writing an overview', description: '4 choices · Find the main picture', type: 'choice', showSource: true,
    instruction: 'Choose the best short overview. Look for the main picture, not every number.',
    feedback: { correct: 'Yes — this gives the main picture.', incorrect: 'Good try. Compare the three explanations below.' },
    questions: [
      {
        sentence: 'Which overview best describes the platform-use figures?',
        options: [
          'Shahid was the most widely used platform, while STC TV had the lowest figure.',
          'Overall, people use three applications. Shahid is first, Netflix is second and STC TV is third. People entertain themselves with these apps.',
          'Netflix was the most widely used platform, while Shahid had the lowest figure.'
        ],
        answer: 'Shahid was the most widely used platform, while STC TV had the lowest figure.',
        explanations: [
          'This selects the main contrast: the highest and lowest figures. Exact numbers are not needed here.',
          'The ranking is right, but the extra comments do not summarise the main contrast. The chart does not tell us why people use the apps.',
          'This reverses the ranking. Shahid is highest at 51%; Netflix is 29%.'
        ]
      },
      {
        sentence: 'Which overview best describes the reported overlap labels?',
        options: [
          'Overall, the Shahid–Netflix label was the largest, and the Netflix–STC TV and all-three labels were the joint smallest.',
          'The Venn diagram shows people use applications together. Shahid and Netflix is 21%, Shahid and STC TV is 13%, Netflix and STC TV is 6%, and all three is 6%.',
          'The overlap labels show that no adults used all three platforms.'
        ],
        answer: 'Overall, the Shahid–Netflix label was the largest, and the Netflix–STC TV and all-three labels were the joint smallest.',
        explanations: [
          'This summarises the largest and smallest reported labels without calculating new groups.',
          'The numbers are copied correctly, but this lists every detail. It also needs plural verbs such as “Shahid and Netflix are”. A short overview should select a pattern.',
          'The all-three label is 6%, so this statement is incorrect.'
        ]
      },
      {
        sentence: 'Which overview brings the two sets of figures together most clearly?',
        options: [
          'Shahid led platform use, and the largest reported overlap label was for Shahid and Netflix.',
          'Overall, Shahid is first with 51%, Netflix is second with 29% and STC TV is third with 15%. The Venn diagram shows 21%, 13%, 6% and 6% together.',
          'Shahid led platform use because its programmes were cheaper than those on the other platforms.'
        ],
        answer: 'Shahid led platform use, and the largest reported overlap label was for Shahid and Netflix.',
        explanations: [
          'This selects one clear main feature from each set of figures.',
          'This resembles a list of observations. It includes many numbers but does not explain the main overlap pattern.',
          'The source has no prices or reasons for platform use. Do not invent an explanation.'
        ]
      },
      {
        sentence: 'Which overview gives an accurate comparison of platform use?',
        options: [
          'Overall, Shahid had a clear lead, while Netflix ranked above STC TV.',
          'People using three apps in Saudi Arabia in 2025. Shahid 51%, Netflix 29% and STC TV 15%.',
          'Platform use increased during 2025, with Shahid growing fastest.'
        ],
        answer: 'Overall, Shahid had a clear lead, while Netflix ranked above STC TV.',
        explanations: [
          'This gives the ranking as a clear, complete summary. “Overall” is useful, but the accurate main picture is what matters.',
          'The numbers are right, but “People using” is not a complete main clause. It lists details instead of giving a short overview.',
          'There is only one year. The figures cannot show growth or change over time.'
        ]
      }
    ],
    reveal: { title: 'A useful overview', text: 'Choose the main features. Compare the highest and lowest figures or the main pattern. Use complete sentences. Do not add reasons or changes that the chart does not show.', examples: [] }
  },
  {
    id: 'cohesion', title: 'Connecting information', description: '2 texts · Put linking words in place', type: 'bank', showSource: true,
    instruction: 'Tap a word, then tap a gap. Or drag a word into a gap. Tap a filled gap to return its word.',
    bank: ['while', 'compared with', 'both', 'followed by', 'Overall'],
    texts: [
      { parts: ['People use three streaming applications in Saudi Arabia. ', ', Shahid has the highest usage figure. Shahid leads at 51%, ', ' Netflix at 29% and STC TV at 15%. Netflix stands at 29%, ', ' 15% for STC TV. Shahid has the highest figure, ', ' STC TV has the lowest. The largest reported pair label is for ', ' Shahid and Netflix, at 21%.'], answers: ['Overall', 'followed by', 'compared with', 'while', 'both'], explanations: [
        'Overall starts a short summary.', 'Followed by puts the platforms in order.', 'Compared with links two figures.', 'While links two complete clauses and shows a contrast.', 'Both refers to the two named platforms.'
      ] },
      { parts: ['The diagram reports audience overlap. The largest pair label names ', ' Shahid and Netflix. This label is 21%, ', ' 13% for Shahid and STC TV. The largest label is 21%, ', ' the all-three label is 6%. In size order, the 21% label is ', ' the 13% label, then the two 6% labels. ', ', Shahid and Netflix have the largest reported overlap label.'], answers: ['both', 'compared with', 'while', 'followed by', 'Overall'], explanations: [
        'Both goes before the two platform names.', 'Compared with introduces the second figure.', 'While links two clauses with contrasting figures.', 'Followed by introduces the next item in the order.', 'Overall introduces the final summary.'
      ] }
    ],
    reveal: { title: 'Connect the ideas', text: 'Use while for a contrast between clauses, compared with for a comparison, both for two things, followed by for an order, and Overall for a summary.' }
  },
  {
    id: 'punctuation', title: 'Full stops and commas', description: '2 paragraphs · Make the meaning clear', type: 'punctuation', showSource: true,
    instruction: 'Read the whole paragraph. Choose a full stop, a comma or no punctuation in each menu.',
    texts: [
      { title: 'Paragraph 1 · Capitals are ready', parts: [
        'The bar chart compares Shahid', { answer: ',', why: 'A comma separates the first and second names in this list of three.' },
        ' Netflix and STC TV', { answer: '.', why: 'This ends a complete sentence. A comma alone cannot join it to the next sentence.' },
        ' Shahid has the highest usage figure at 51%', { answer: '.', why: 'The next words start a new complete sentence.' },
        ' Netflix is second at 29%', { answer: ',', accepted: [',', ''], why: 'A comma is helpful before contrasting clauses with while. No comma is also acceptable here.' },
        ' while STC TV is third at 15%', { answer: '.', why: 'This ends the sentence comparing Netflix and STC TV.' },
        ' The label for Shahid and Netflix', { answer: '', why: 'Do not separate this subject from its verb, is.' },
        ' is 21%', { answer: '.', why: 'Use a full stop to end the paragraph.' }
      ] },
      { title: 'Paragraph 2 · Choose capitals too', parts: [
        { kind: 'case', options: ['The', 'the'], answer: 'The', why: 'Start the paragraph with a capital letter.' },
        ' diagram reports overlap', { answer: '.', why: 'End this complete sentence before starting the next one.' },
        ' ', { kind: 'case', options: ['Shahid', 'shahid'], answer: 'Shahid', why: 'Shahid is a platform name and starts this sentence. Use a capital letter.' },
        ' and Netflix have a reported label of 21%', { answer: '.', why: 'A full stop separates these two complete sentences.' },
        ' ', { kind: 'case', options: ['The', 'the'], answer: 'The', why: 'Use a capital letter after a full stop.' },
        ' label for Shahid and STC TV', { answer: '', why: 'Keep the subject and verb together without punctuation.' },
        ' is 13%', { answer: '.', why: 'The next words start another complete sentence.' },
        ' ', { kind: 'case', options: ['Both', 'both'], answer: 'Both', why: 'Start this new sentence with a capital letter.' },
        ' the Netflix–STC TV label and the all-three label are 6%', { answer: '.', why: 'End the paragraph with a full stop.' }
      ] }
    ],
    reveal: { title: 'Give each sentence an ending', text: 'Use a full stop between complete sentences. Start the next sentence with a capital letter. Use commas in lists. Keep the subject and verb together.' }
  },
  {
    id: 'independent-writing', title: 'Independent writing', description: '40–60 words · Use a new chart', type: 'writing',
    instruction: 'Write 40–60 words about this chart. Say what it shows. Give the main picture and compare the figures.',
    chart: { title: 'How adults travelled to a town library in 2026', subtitle: 'Invented data for writing practice · percentage of visits', rows: [['Walking', 46], ['Bus', 32], ['Bicycle', 22]] },
    checks: ['I said what the chart shows.', 'I gave the main picture and compared the figures.', 'I checked complete verbs, word forms and punctuation.']
  }
];

export const bonusActivity = choice('more-word-forms', 'More written word forms', '3 extra choices · Common chart words', [
  question('Netflix is in ___ place.', ['second', 'secend'], 'second'),
  question('STC TV is in ___ place.', ['third', 'theared'], 'third'),
  question('Some adults use these platforms ___.', ['together', 'togher'], 'together')
], 'Remember these written forms: second, third and together.');
