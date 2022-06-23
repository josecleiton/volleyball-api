export function arrayToInClause(array: readonly unknown[]) {
  return array.map((x) => `'${x}'`).join(', ');
}
