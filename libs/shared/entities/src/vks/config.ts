// Хелпер функция для выборки ключей в виде массива
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const AnketologSurveyTypes = {
  operator: 124684,
  client: 124915,
} as const;
export type AnketologReportTypes =
  (typeof AnketologSurveyTypes)[keyof typeof AnketologSurveyTypes];
export const anketologSurveyTypesValues = getValues(AnketologSurveyTypes);
