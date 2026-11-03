// Local skill demonstrations. These do not alter the frozen learner-model bank.
export const task2Introductions = {
  questionId: 'WT2-W06',
  demonstrations: [
    {id:'WT2-I-SEE-01',level:'cool',text:'More adults now take courses on the internet instead of going to a classroom. Busy adults can study after work, and I think this is a positive change.',note:'The writer gives the same idea in their own words. We also know why adults choose online courses and what the writer thinks.'},
    {id:'WT2-I-SEE-02',level:'spicy',text:'More adults are fitting online courses around work rather than travelling to classes. Although they may miss their classmates, I see this as a mainly positive change.',note:'The writer shows a problem, then explains why online study is still useful. You can try this too. Cool is enough.'},
    {id:'WT2-I-SEE-03',level:'splat',text:'Adults can now study online after work. This helps them save travel time and choose when to study.',note:'We know why adults choose online courses. What does the writer think about this change? Add that answer.'},
  ],
  judgements: [
    {id:'WT2-I-VOTE-01',level:'cool',text:'Adults often choose online courses to save travel time and study when they are free. I believe this change is mostly positive.',feedback:'We know why adults choose online courses and what the writer thinks. This is a clear start. Explain more later.'},
    {id:'WT2-I-VOTE-02',level:'splat',text:'Online courses and classroom courses both have advantages. This essay will compare the two ways of studying.',feedback:'This compares two ways to study. Our question asks why adults choose online courses and whether this change is good or bad. Add those two answers.'},
    {id:'WT2-I-VOTE-03',level:'spicy',text:'While adults may miss face-to-face contact, online courses let them study around work and family. Overall, I consider the wider access to learning a positive development.',feedback:'The writer shows a problem, but still thinks the change is good. Both answers are clear. A Cool introduction works well too.'},
    {id:'WT2-I-VOTE-04',level:'splat',text:'More adults are taking courses at home instead of going to classes. This lets them study at a time that fits their work.',feedback:'The writer uses their own words and gives a reason. What do they think about the change? Add that answer too.'},
    {id:'WT2-I-VOTE-05',questionId:'WT2-W03',level:'splat',text:'More people now pay by card or phone. I agree that everyone should stop using cash, and I will explain why these payments are always better.',feedback:'This question asks for good points and problems. This start only gives one side. Add the problems too. An opinion alone is not the problem: part of the answer is missing.'},
    {id:'WT2-I-VOTE-06',questionId:'WT2-W03',level:'cool',text:'More people now pay by card or phone instead of cash. This can make shopping easier, but it can also cause problems.',feedback:'The writer uses their own words and shows both parts: good points and problems. There is no need to say “I agree”.'},
    {id:'WT2-I-VOTE-07',questionId:'WT2-W01',level:'cool',text:'Some people want libraries to buy more printed books than digital resources. I partly agree because books matter, but libraries should offer both.',feedback:'This question asks how much you agree. “I partly agree” gives a clear answer. You can also agree or disagree if you explain why in your essay.'},
  ],
  builders: {
    cool: {
      chunks:[{id:'c1',text:'Adults often choose online courses'},{id:'c2',text:'because they can study around work and family.'},{id:'c3',text:'I see this as a positive change'},{id:'c4',text:'because it gives more people a chance to learn.'}],
      start:['c3','c1','c4','c2'], valid:[['c1','c2','c3','c4'],['c3','c4','c1','c2']],
      feedback:'You have a reason and a clear opinion. Well done. You can start with either sentence.',
    },
    spicy: {
      chunks:[{id:'s1',text:'Although adults may miss learning with classmates,'},{id:'s2',text:'online courses let them study around work.'},{id:'s3',text:'In my view,'},{id:'s4',text:'this is a mainly positive development.'}],
      start:['s3','s1','s4','s2'], valid:[['s1','s2','s3','s4'],['s3','s4','s1','s2']],
      feedback:'“Although” shows a problem. The next part shows why online study still helps. You can start with either sentence.',
    },
  },
};
export function validChunkOrder(order, builder) {
  return Array.isArray(order) && order.length===builder.chunks.length && new Set(order).size===order.length && order.every(id=>builder.chunks.some(chunk=>chunk.id===id));
}
export function successfulChunkOrder(order,builder) {
  return builder.valid.some(valid=>valid.length===order.length&&valid.every((id,index)=>id===order[index]));
}
