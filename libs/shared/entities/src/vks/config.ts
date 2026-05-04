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

export const VksCaseTypes = {
  ВКС: 'ВКС',
  ГЛ: 'ГЛ',
} as const;
export type VksCaseTypes = (typeof VksCaseTypes)[keyof typeof VksCaseTypes];
export const vksCaseTypesValues = getValues(VksCaseTypes);

// ======================================
// ВНУТРЕННЯЯ АНКЕТА ДГИ ПО КОНСУЛЬТАЦИЯМ
// ======================================

// по ВКС | по телефону | не удалось связаться
export const VksDgiSurveyConsultationType = {
  'по ВКС': 'по ВКС',
  'по телефону': 'по телефону',
  'не удалось связаться': 'не удалось связаться',
} as const;
export type VksDgiSurveyConsultationType =
  (typeof VksDgiSurveyConsultationType)[keyof typeof VksDgiSurveyConsultationType];
export const VksDgiSurveyConsultationTypeValues = getValues(
  VksDgiSurveyConsultationType,
);

// по ВКС | по телефону | не удалось связаться
export const VksDgiSurveyQuestionType = {
  Частный: 'Частный',
  Общий: 'Общий',
} as const;
export type VksDgiSurveyQuestionType =
  (typeof VksDgiSurveyQuestionType)[keyof typeof VksDgiSurveyQuestionType];
export const VksDgiSurveyQuestionTypeValues = getValues(
  VksDgiSurveyQuestionType,
);

// Жилищный вопрос | Вопрос по нежилью | Вопрос по земле | Иной вопрос ДГИ | Вопрос не в компетенции ДГИ
export const VksDgiSurveyQuestionRelevance = {
  'Жилищный вопрос': 'Жилищный вопрос',
  'Вопрос по нежилью': 'Вопрос по нежилью',
  'Вопрос по земле': 'Вопрос по земле',
  'Иной вопрос ДГИ': 'Иной вопрос ДГИ',
  'Вопрос не в компетенции ДГИ': 'Вопрос не в компетенции ДГИ',
} as const;
export type VksDgiSurveyQuestionRelevance =
  (typeof VksDgiSurveyQuestionRelevance)[keyof typeof VksDgiSurveyQuestionRelevance];
export const VksDgiSurveyQuestionRelevanceValues = getValues(
  VksDgiSurveyQuestionRelevance,
);

// Восторженный | Позитивный | Нейтральный | Негативный | Гневный
export const VksDgiSurveyMood = {
  Восторженный: 'Восторженный',
  Позитивный: 'Позитивный',
  Нейтральный: 'Нейтральный',
  Негативный: 'Негативный',
  Гневный: 'Гневный',
} as const;
export type VksDgiSurveyMood =
  (typeof VksDgiSurveyMood)[keyof typeof VksDgiSurveyMood];
export const VksDgiSurveyMoodValues = getValues(VksDgiSurveyMood);

// Вопрос заявителя вне компетенции подразделения | Вопрос заявителя не соответствует теме консультации | Заявитель опоздал на встречу (не хватило времени на решение вопроса) | Консультация прервана | Заявителю не пришла ссылка | Требуются персональные данные | Проблема с подключением у заявителя | Проблема с подключением у сотрудника | Неадекватное поведение заявителя | Проблемы со звуком или видео у заявителя | Проблемы со звуком или видео у сотрудника
export const VksDgiSurveyProblem = {
  'Вопрос заявителя вне компетенции подразделения':
    'Вопрос заявителя вне компетенции подразделения',
  'Вопрос заявителя не соответствует теме консультации':
    'Вопрос заявителя не соответствует теме консультации',
  'Заявитель опоздал на встречу (не хватило времени на решение вопроса)':
    'Заявитель опоздал на встречу (не хватило времени на решение вопроса)',
  'Консультация прервана': 'Консультация прервана',
  'Заявителю не пришла ссылка': 'Заявителю не пришла ссылка',
  'Требуются персональные данные': 'Требуются персональные данные',
  'Проблема с подключением у заявителя': 'Проблема с подключением у заявителя',
  'Проблема с подключением у сотрудника':
    'Проблема с подключением у сотрудника',
  'Неадекватное поведение заявителя': 'Неадекватное поведение заявителя',
  'Проблемы со звуком или видео у заявителя':
    'Проблемы со звуком или видео у заявителя',
  'Проблемы со звуком или видео у сотрудника':
    'Проблемы со звуком или видео у сотрудника',
} as const;
export type VksDgiSurveyProblem =
  (typeof VksDgiSurveyProblem)[keyof typeof VksDgiSurveyProblem];
export const VksDgiSurveyProblemValues = getValues(VksDgiSurveyProblem);

// Письменные ответы ДГИ | Потрал Мэра Москвы (mos.ru) | Портал МФЦ (md.mos.ru) | Сторонние интернет-ресурсы | Тематические группы в социальных сетях и месенжерах | Друзья и знакомые | Сотрудники "одного окна" ДГИ | Сотрудники МФЦ
export const VksDgiSurveyInfoSource = {
  'Письменные ответы ДГИ': 'Письменные ответы ДГИ',
  'Потрал Мэра Москвы (mos.ru)': 'Потрал Мэра Москвы (mos.ru)',
  'Портал МФЦ (md.mos.ru)': 'Портал МФЦ (md.mos.ru)',
  'Сторонние интернет-ресурсы': 'Сторонние интернет-ресурсы',
  'Тематические группы в социальных сетях и месенжерах':
    'Тематические группы в социальных сетях и месенжерах',
  'Друзья и знакомые': 'Друзья и знакомые',
  'Сотрудники "одного окна" ДГИ': 'Сотрудники "одного окна" ДГИ',
  'Сотрудники МФЦ': 'Сотрудники МФЦ',
} as const;
export type VksDgiSurveyInfoSource =
  (typeof VksDgiSurveyInfoSource)[keyof typeof VksDgiSurveyInfoSource];
export const VksDgiSurveyInfoSourceValues = getValues(VksDgiSurveyInfoSource);
