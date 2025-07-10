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

export const EquityObjectOpinions = {
  положительное: 'положительное',
  'условно-положительное': 'условно-положительное',
  отрицательное: 'отрицательное',
  нет: 'нет',
} as const;
export type EquityObjectOpinions =
  (typeof EquityObjectOpinions)[keyof typeof EquityObjectOpinions];
export const equityObjectOpinionsValues = getValues(EquityObjectOpinions);

export const EquityClaimTransferStatuses = {
  'До передачи': 'До передачи',
  'После передачи': 'После передачи',
  'Не в РТУС': 'Не в РТУС',
} as const;
export type EquityClaimTransferStatuses =
  (typeof EquityClaimTransferStatuses)[keyof typeof EquityClaimTransferStatuses];
export const equityClaimTransferStatusesValues = getValues(
  EquityClaimTransferStatuses,
);
