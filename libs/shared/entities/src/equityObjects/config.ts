// Хелпер функция для выборки ключей в виде массива
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const EquityObjectProblems = {
  doublesell: 'doublesell',
  unidentified: 'unidentified',
  defects: 'defects',
  potentialclaim: 'potentialclaim',
  idproblem: 'idproblem',
  unpaid: 'unpaid',
} as const;
export type EquityObjectProblems =
  (typeof EquityObjectProblems)[keyof typeof EquityObjectProblems];
export const equityObjectProblemsValues = getValues(EquityObjectProblems);

export const EquityObjectDocuments = {
  ok: 'ok',
  problem: 'problem',
  none: 'none',
} as const;
export type EquityObjectDocuments =
  (typeof EquityObjectDocuments)[keyof typeof EquityObjectDocuments];
export const equityObjectDocumentsValues = getValues(EquityObjectDocuments);
