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

export const VksConsultationTypes = {
  'Нет данных': 'Нет данных',
  'По телефону': 'По телефону',
  'Вопрос заявителя не в компетенции': 'Вопрос заявителя не в компетенции',
  'Заявитель не явился по вызову': 'Заявитель не явился по вызову',
  'По ВКС': 'По ВКС',
} as const;
export type VksConsultationTypes =
  (typeof VksConsultationTypes)[keyof typeof VksConsultationTypes];
export const vksConsultationTypesValues = getValues(VksConsultationTypes);
