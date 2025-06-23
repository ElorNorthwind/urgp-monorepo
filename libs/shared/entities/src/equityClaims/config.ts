// Хелпер функция для выборки ключей в виде массива
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const EquityClaimStatuses = {
  active: 'active',
  settled: 'settled',
  excluded: 'excluded',
} as const;
export type EquityClaimStatuses =
  (typeof EquityClaimStatuses)[keyof typeof EquityClaimStatuses];
export const equityClaimStatusesValues = getValues(EquityClaimStatuses);
