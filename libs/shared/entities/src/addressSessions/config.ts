// Хелпер функция для выборки ключей в виде массива
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const AddressSessionStatuses = {
  pending: 'pending',
  running: 'running',
  error: 'error',
  done: 'done',
} as const;
export type AddressSessionStatuses =
  (typeof AddressSessionStatuses)[keyof typeof AddressSessionStatuses];
export const addressSessionStatusesValues = getValues(AddressSessionStatuses);
