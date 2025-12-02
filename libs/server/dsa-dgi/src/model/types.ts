function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

// export const RenovationSyncDatasets = {
//   11: 'Синхронизация - Старые квартиры',
//   12: 'Синхронизация - Новые квартиры',
//   13: 'Синхронизация - Предложения',
//   14: 'Синхронизация - Ордера',
//   15: 'Синхронизация - Договоры',
// } as const;

export const RenovationSyncDatasets = {
  'Синхронизация - Старые квартиры': 11,
  'Синхронизация - Новые квартиры': 12,
  'Синхронизация - Предложения': 13,
  'Синхронизация - Ордера': 14,
  'Синхронизация - Договоры': 15,
} as const;
export type RenovationSyncDataset =
  (typeof RenovationSyncDatasets)[keyof typeof RenovationSyncDatasets];
export const renovationSyncDatasetsValues = getValues(RenovationSyncDatasets);

export type RenovationSyncResult = {
  id: RenovationSyncDataset;
  name?: keyof typeof RenovationSyncDatasets;
  success: boolean;
  errorDetails?: string;
  updatedAt?: Date | string;
  lastSuccessAt?: Date | string;
};
