function secureRandomIndex(maxExclusive) {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1) {
    throw new RangeError("maxExclusive must be a positive integer");
  }

  const range = 2 ** 32;
  const limit = range - (range % maxExclusive);
  const sample = new Uint32Array(1);
  let value;

  do {
    crypto.getRandomValues(sample);
    value = sample[0];
  } while (value >= limit);

  return value % maxExclusive;
}

export function shuffleOptionIds(ids, randomIndex = secureRandomIndex) {
  const shuffled = [...ids];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function isValidStoredOrder(order, ids) {
  if (!Array.isArray(order) || order.length !== ids.length) return false;
  const expected = new Set(ids);
  return new Set(order).size === ids.length && order.every((id) => expected.has(id));
}
