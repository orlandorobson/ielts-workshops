import {shuffleOptionIds, isValidStoredOrder} from '../../shared/js/randomise.js';

// These numbers are immutable source option values, NOT displayed positions.
// Fixed orders were balanced across the entire lesson, not separately per screen.
export const fixedOrders = {
  "q48": [
    1,
    0
  ],
  "q51": [
    0,
    1
  ],
  "q54": [
    1,
    0
  ],
  "q57": [
    1,
    0
  ],
  "q60": [
    1,
    0
  ],
  "q63": [
    1,
    0
  ],
  "q66": [
    0,
    1
  ],
  "q69": [
    1,
    0
  ],
  "q125": [
    0,
    1
  ],
  "q128": [
    1,
    0
  ],
  "q131": [
    1,
    0
  ],
  "q134": [
    0,
    1
  ],
  "q137": [
    0,
    1
  ],
  "q140": [
    0,
    1
  ],
  "q143": [
    0,
    1
  ],
  "q146": [
    1,
    0
  ],
  "q167": [
    1,
    0
  ],
  "q179": [
    1,
    0
  ],
  "q182": [
    0,
    1
  ],
  "q191": [
    0,
    1
  ],
  "q194": [
    0,
    1
  ],
  "q208": [
    0,
    1
  ],
  "q211": [
    1,
    0
  ],
  "q224": [
    0,
    1
  ],
  "context-228": [
    0,
    1
  ],
  "context-229": [
    1,
    0
  ],
  "context-230": [
    1,
    0
  ],
  "context-231": [
    0,
    1
  ],
  "context-232": [
    1,
    0
  ],
  "q314": [
    0,
    1
  ],
  "q317": [
    1,
    0
  ],
  "q380": [
    0,
    1
  ],
  "q429": [
    0,
    1
  ],
  "q25": [
    0,
    2,
    1
  ],
  "q82": [
    2,
    1,
    0
  ],
  "q376": [
    1,
    0,
    2
  ],
  "argument-0-0": [
    1,
    2,
    3,
    0,
    4,
    5
  ],
  "argument-0-1": [
    1,
    2,
    3,
    4,
    5,
    0
  ],
  "argument-0-2": [
    2,
    3,
    5,
    0,
    1,
    4
  ],
  "argument-1-0": [
    1,
    2,
    0,
    3,
    4,
    5
  ],
  "argument-1-1": [
    3,
    4,
    5,
    0,
    2,
    1
  ],
  "argument-1-2": [
    3,
    4,
    5,
    0,
    1,
    2
  ],
  "argument-2-0": [
    2,
    0,
    3,
    4,
    5,
    1
  ],
  "argument-2-1": [
    3,
    4,
    5,
    2,
    0,
    1
  ],
  "argument-2-2": [
    4,
    5,
    0,
    2,
    3,
    1
  ],
  "argument-3-0": [
    3,
    5,
    0,
    1,
    4,
    2
  ],
  "argument-4-0": [
    4,
    0,
    5,
    1,
    2,
    3
  ]
};

// Share one stable pool across all paragraphs/rows in each matching activity.
export const headingOrders = {
  "flexible": [
    1,
    2,
    0
  ],
  "trees": [
    2,
    0,
    1
  ],
  "llm": [
    1,
    2,
    0
  ],
  "curitiba": [
    4,
    2,
    5,
    0,
    1,
    3
  ],
  "bedouin": [
    4,
    7,
    2,
    6,
    0,
    5,
    3,
    1
  ],
  "food": [
    4,
    7,
    2,
    8,
    5,
    6,
    3,
    1,
    0
  ]
};
export const matchingOrders = {
  "llm-words": [
    6,
    1,
    4,
    8,
    5,
    2,
    0,
    7,
    3
  ],
  "signals": [
    2,
    0,
    3,
    1
  ]
};

const countryIds = [0,1,2,3,4,5,6,7];
export function isMixedCountryOrder(order) {
  if (!isValidStoredOrder(order, countryIds)) return false;
  const gap = Math.abs(order.indexOf(6) - order.indexOf(7));
  const correct = order.filter(id => id < 6).join(',');
  // Distractors are separated, but every slot (including either end) may be wrong.
  // Exclude a six-correct block and the source/reversed-source country sequence.
  return gap >= 2 && gap <= 6 && correct !== '0,1,2,3,4,5' && correct !== '5,4,3,2,1,0'
    && correct !== '5,2,4,0,3,1' && correct !== '1,3,0,4,2,5';
}
export function makeCountryOrder(randomIndex) {
  for (let attempt = 0; attempt < 50; attempt++) {
    const order = shuffleOptionIds(countryIds, randomIndex);
    if (isMixedCountryOrder(order)) return order;
  }
  return [4,6,0,3,1,7,5,2]; // Bounded fallback; no possibility of a stuck activity.
}
export function optionOrder(q, storedOrders) {
  const ids = q.options.map((_, id) => id);
  if (q.id === 'q215') {
    if (!isMixedCountryOrder(storedOrders.q215)) storedOrders.q215 = makeCountryOrder();
    return storedOrders.q215;
  }
  const order = q.order || fixedOrders[q.id];
  // Unknown future questions stay usable rather than losing choices.
  return isValidStoredOrder(order, ids) ? order : ids;
}
