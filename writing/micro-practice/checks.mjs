// Run: node --experimental-default-type=module writing/micro-practice/checks.mjs
import assert from 'node:assert/strict';
import { activity, activities, bonusActivity, source } from './content.js';
import { shuffle, wordCount, isAccepted } from './engine.js';

assert.equal(activities.length, 9);
assert.equal(new Set(activities.map(a => a.id)).size, 9);
assert.equal(activity.questions.length, 10);
assert.deepEqual(activity.questions.map(q => q.answer), ['using', 'living', 'arriving', 'using', 'closing', 'saving', 'preparing', 'improving', 'using', 'changing']);
for (const item of [...activities, bonusActivity]) {
  if (item.type === 'choice') {
    for (const q of item.questions) {
      assert(q.options.includes(q.answer), `${item.id}: key must be an option`);
      assert.equal(new Set(q.options).size, q.options.length);
      const original = [...q.options];
      assert.deepEqual(shuffle(q.options, () => .999999), original);
      assert.notDeepEqual(shuffle(q.options, () => 0), original);
      assert.deepEqual(q.options, original, 'shuffle must not mutate content');
      if (q.explanations) assert.equal(q.explanations.length, q.options.length);
      const orders = new Set(Array.from({ length: 1000 }, () => shuffle(q.options).join('|')));
      assert.equal(orders.size, q.options.length === 3 ? 6 : 2, 'every permutation must be reachable');
    }
  }
  if (item.type === 'bank') for (const text of item.texts) {
    assert.equal(text.parts.length, text.answers.length + 1);
    assert.deepEqual([...text.answers].sort(), [...item.bank].sort());
    assert.equal(text.explanations.length, text.answers.length);
  }
  if (item.type === 'punctuation') for (const text of item.texts) {
    for (const gap of text.parts.filter(p => typeof p !== 'string')) {
      assert(isAccepted(gap, gap.answer));
      assert(gap.why);
      if (!gap.kind) assert(['.', ',', ''].includes(gap.answer));
      else assert(gap.options.includes(gap.answer));
    }
  }
}
for (const id of ['subject-verb', 'complete-verbs', 'number-agreement', 'prepositions']) assert.equal(activities.find(a => a.id === id).questions.length, 10);
assert.equal(activities.find(a => a.id === 'overviews').questions.length, 4);
assert.deepEqual(source.usage, [['Shahid', 51], ['Netflix', 29], ['STC TV', 15]]);
assert.deepEqual(source.overlap.map(row => row[1]), [21, 13, 6, 6]);
assert.equal(wordCount('  One  short\nreport. '), 3);
assert.equal(wordCount(''), 0);
assert(isAccepted({ answer: ',', accepted: [',', ''] }, ''));
assert(!isAccepted({ answer: '.' }, ','));
console.log('Passed: 9 activity schemas, original spelling keys, all option permutations, bank slots, punctuation alternatives, source figures and word counts.');
