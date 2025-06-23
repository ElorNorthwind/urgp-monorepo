// Хелпер функция для выборки ключей в виде массива
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const EquityObjectProblems = {
  'double-sell': 'double-sell',
  unidentified: 'unidentified',
  defects: 'defects',
} as const;
export type EquityObjectProblems =
  (typeof EquityObjectProblems)[keyof typeof EquityObjectProblems];
export const equityObjectProblemsValues = getValues(EquityObjectProblems);
