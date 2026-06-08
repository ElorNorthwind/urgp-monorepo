import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
} from '../userInput/types';

export type VksDgiSurveyElementType =
  | 'boolean'
  | 'text'
  | 'textArea'
  | 'singleSelect'
  | 'multipleSelect'
  | 'docList';

type VksDgiSurveyElementCommon = {
  key: string;
  label: string;
  width?: 'half' | 'full';
  order?: number;
  isHidden?: boolean;
  showCondition?: Record<string, any>;
};

export type VksDgiSurveyBooleanElement = VksDgiSurveyElementCommon & {
  type: 'boolean';
  trueLabel: string;
  falseLabel: string;
  defaultValue?: boolean;
  lockedValue?: boolean;
};

export type DgiSurveyTextElement = VksDgiSurveyElementCommon & {
  type: 'text';
  placeholder?: string;
  defaultValue?: string;
  lockedValue?: string;
};

export type DgiSurveyTextAreaElement = VksDgiSurveyElementCommon & {
  type: 'textArea';
  placeholder?: string;
  defaultValue?: string;
  lockedValue?: string;
};

export type DgiSurveySingleSelectStringElement = VksDgiSurveyElementCommon & {
  type: 'singleSelectString';
  options?: NestedClassificatorInfoString[];
  serverOptionsQueryKey?: string;
  defaultValue?: string;
  lockedValue?: string;
};

export type DgiSurveySingleSelectNumberElement = VksDgiSurveyElementCommon & {
  type: 'singleSelectNumber';
  options?: NestedClassificatorInfo[];
  serverOptionsQueryKey?: string;
  defaultValue?: number;
  lockedValue?: number;
};
export type DgiSurveyMultiSelectStringElement = VksDgiSurveyElementCommon & {
  type: 'multiSelectString';
  options?: NestedClassificatorInfoString[];
  serverOptionsQueryKey?: string;
  defaultValue?: string;
  lockedValue?: string;
};

export type DgiSurveyMultiSelectNumberElement = VksDgiSurveyElementCommon & {
  type: 'multiSelectNumber';
  options?: NestedClassificatorInfo[];
  serverOptionsQueryKey?: string;
  defaultValue?: number;
  lockedValue?: number;
};

export type DgiSurveyDocListElement = VksDgiSurveyElementCommon & {
  type: 'docList';
  defaultValue?: any[];
  lockedValue?: any[];
};

export type VksDgiSurveyElement =
  | VksDgiSurveyBooleanElement
  | DgiSurveyTextElement
  | DgiSurveyTextAreaElement
  | DgiSurveySingleSelectStringElement
  | DgiSurveySingleSelectNumberElement
  | DgiSurveyMultiSelectStringElement
  | DgiSurveyMultiSelectNumberElement
  | DgiSurveyDocListElement;

export type VksDgiSurveyConfig = {
  elements: VksDgiSurveyElement[];
};

const housingConfig: VksDgiSurveyConfig = {
  elements: [
    {
      key: 'operator',
      label: 'Оператор',
      type: 'singleSelectNumber',
      width: 'half',
      order: 1,
      serverOptionsQueryKey: 'vksOperators',
    },
    {
      key: 'type',
      label: 'Тип проведенной консультации',
      type: 'singleSelectString',
      width: 'half',
      order: 2,
      options: [
        {
          value: 'options',
          label: 'Варианты',
          items: [
            {
              value: 'по ВКС',
              label: 'по ВКС',
              fullname: 'Консультация проведена по ВКС',
              category: 'options',
              tags: [],
            },
            {
              value: 'по телефону',
              label: 'по телефону',
              fullname: 'Консультация проведена по телефону',
              category: 'options',
              tags: [],
            },
            {
              value: 'не удалось связаться',
              label: 'не удалось связаться',
              fullname:
                'Не удалось связаться с заявителем для проведения консультации',
              category: 'options',
              tags: [],
            },
          ],
        },
      ],
    },
    {
      key: 'relevance',
      label: 'Общая тема вопроса',
      type: 'singleSelectString',
      width: 'half',
      order: 3,
      options: [
        {
          value: 'options',
          label: 'Варианты',
          items: [
            {
              value: 'Жилищный вопрос',
              label: 'Жилищный вопрос',
              fullname: 'Жилищный вопрос',
              category: 'options',
              tags: [],
            },
            {
              value: 'Вопрос по нежилью',
              label: 'Вопрос по нежилью',
              fullname: 'Вопрос по нежилью',
              category: 'options',
              tags: [],
            },
            {
              value: 'Вопрос по земле',
              label: 'Вопрос по земле',
              fullname: 'Вопрос по земле',
              category: 'options',
              tags: [],
            },
            {
              value: 'Иной вопрос ДГИ',
              label: 'Иной вопрос ДГИ',
              fullname: 'Иной вопрос ДГИ',
              category: 'options',
              tags: [],
            },
            {
              value: 'Вопрос не в компетенции ДГИ',
              label: 'Вопрос не в компетенции ДГИ',
              fullname: 'Вопрос не в компетенции ДГИ',
              category: 'options',
              tags: [],
            },
          ],
        },
      ],
    },
    {
      key: 'department',
      label: 'Вопрос в компетенции',
      placeholder: 'УРЖП',
      type: 'text',
      width: 'half',
      order: 4,
    },
    {
      key: 'questionType',
      label: 'Характер вопроса',
      type: 'singleSelectString',
      width: 'half',
      order: 5,
      options: [
        {
          value: 'options',
          label: 'Варианты',
          items: [
            {
              value: 'Частный',
              label: 'Частный',
              fullname: 'Вопрос по конкретной ситуации заявителя',
              category: 'options',
              tags: [],
            },
            {
              value: 'Общий',
              label: 'Общий',
              fullname: 'Общий вопрос, без привязки к ситуации заявителя',
              category: 'options',
              tags: [],
            },
          ],
        },
      ],
      defaultValue: 'Частный',
    },
    {
      key: 'questionClassificator',
      label: 'Тематика обращения',
      placeholder: 'Постановка на жилищный учет...',
      type: 'text',
      width: 'full',
      order: 6,
    },
    {
      key: 'summary',
      label: 'Суть вопроса',
      placeholder: 'Просит поставить в очередь на квартиру...',
      type: 'textArea',
      width: 'full',
      order: 7,
    },
    {
      key: 'isClient',
      label: 'Якляется клиентом',
      type: 'boolean',
      trueLabel: 'Да (клиент ДГИ)',
      falseLabel: 'Нет (не клиент ДГИ)',
      width: 'full',
      order: 8,
    },
    {
      key: 'clientType',
      label: 'Тип клиента',
      type: 'text',
      placeholder: 'Очередник города',
      width: 'half',
      order: 9,
      showCondition: { isClient: true },
    },
    {
      key: 'clientNumber',
      label: 'Номер КПУ',
      type: 'text',
      width: 'half',
      order: 10,
      showCondition: { isClient: true },
    },
    {
      key: 'address',
      label: 'Адрес',
      placeholder: 'ул. Ненастоящая, д. 1, кв. 10',
      type: 'text',
      width: 'full',
      order: 11,
    },
    {
      key: 'docs',
      label: 'Документы',
      type: 'docList',
      width: 'full',
      order: 12,
    },
    {
      key: 'mood',
      label: 'Настроение заявителя',
      type: 'singleSelectString',
      width: 'half',
      order: 13,
      options: [
        {
          value: 'options',
          label: 'Варианты',
          items: [
            {
              value: 'Восторженный',
              label: 'Восторженный',
              fullname: 'Эмоциональное состояние заявителя: Восторженный',
              category: 'options',
              tags: [],
            },
            {
              value: 'Позитивный',
              label: 'Позитивный',
              fullname: 'Эмоциональное состояние заявителя: Позитивный',
              category: 'options',
              tags: [],
            },
            {
              value: 'Нейтральный',
              label: 'Нейтральный',
              fullname: 'Эмоциональное состояние заявителя: Нейтральный',
              category: 'options',
              tags: [],
            },
            {
              value: 'Негативный',
              label: 'Негативный',
              fullname: 'Эмоциональное состояние заявителя: Негативный',
              category: 'options',
              tags: [],
            },
            {
              value: 'Гневный',
              label: 'Гневный',
              fullname: 'Эмоциональное состояние заявителя: Гневный',
              category: 'options',
              tags: [],
            },
          ],
        },
      ],
    },
    {
      key: 'needsAnswer',
      label: 'Требуется ли ответ',
      type: 'boolean',
      trueLabel: 'Да',
      falseLabel: 'Нет',
      width: 'half',
      order: 14,
    },
    {
      key: 'problems',
      label: 'Проблемы',
      type: 'multiSelectString',
      width: 'full',
      order: 15,
      options: [
        {
          value: 'options',
          label: 'Варианты',
          items: [
            {
              value: 'Вопрос заявителя вне компетенции подразделения',
              label: 'Вопрос заявителя вне компетенции подразделения',
              fullname: 'Вопрос заявителя вне компетенции подразделения',
              category: 'options',
              tags: [],
            },
            {
              value: 'Вопрос заявителя не соответствует теме консультации',
              label: 'Вопрос заявителя не соответствует теме консультации',
              fullname: 'Вопрос заявителя не соответствует теме консультации',
              category: 'options',
              tags: [],
            },
            {
              value:
                'Заявитель опоздал на встречу (не хватило времени на решение вопроса)',
              label:
                'Заявитель опоздал на встречу (не хватило времени на решение вопроса)',
              fullname:
                'Заявитель опоздал на встречу (не хватило времени на решение вопроса)',
              category: 'options',
              tags: [],
            },
            {
              value: 'Консультация прервана',
              label: 'Консультация прервана',
              fullname: 'Консультация прервана',
              category: 'options',
              tags: [],
            },
            {
              value: 'Заявителю не пришла ссылка',
              label: 'Заявителю не пришла ссылка',
              fullname: 'Заявителю не пришла ссылка',
              category: 'options',
              tags: [],
            },
            {
              value: 'Требуются персональные данные',
              label: 'Требуются персональные данные',
              fullname: 'Требуются персональные данные',
              category: 'options',
              tags: [],
            },
            {
              value: 'Проблема с подключением у заявителя',
              label: 'Проблема с подключением у заявителя',
              fullname: 'Проблема с подключением у заявителя',
              category: 'options',
              tags: [],
            },
            {
              value: 'Проблема с подключением у сотрудника',
              label: 'Проблема с подключением у сотрудника',
              fullname: 'Проблема с подключением у сотрудника',
              category: 'options',
              tags: [],
            },
            {
              value: 'Неадекватное поведение заявителя',
              label: 'Неадекватное поведение заявителя',
              fullname: 'Неадекватное поведение заявителя',
              category: 'options',
              tags: [],
            },
            {
              value: 'Проблемы со звуком или видео у заявителя',
              label: 'Проблемы со звуком или видео у заявителя',
              fullname: 'Проблемы со звуком или видео у заявителя',
              category: 'options',
              tags: [],
            },
            {
              value: 'Проблемы со звуком или видео у сотрудника',
              label: 'Проблемы со звуком или видео у сотрудника',
              fullname: 'Проблемы со звуком или видео у сотрудника',
              category: 'options',
              tags: [],
            },
          ],
        },
      ],
    },
    {
      key: 'infoSource',
      label: 'Откуда узнал о консультации',
      type: 'singleSelectString',
      width: 'full',
      order: 16,
      options: [
        {
          value: 'options',
          label: 'Варианты',
          items: [
            {
              value: 'Письменные ответы ДГИ',
              label: 'Письменные ответы ДГИ',
              fullname: 'Письменные ответы ДГИ',
              category: 'options',
              tags: [],
            },
            {
              value: 'Портал Мэра Москвы (mos.ru)',
              label: 'Портал Мэра Москвы (mos.ru)',
              fullname: 'Портал Мэра Москвы (mos.ru)',
              category: 'options',
              tags: [],
            },
            {
              value: 'Портал МФЦ (md.mos.ru)',
              label: 'Портал МФЦ (md.mos.ru)',
              fullname: 'Портал МФЦ (md.mos.ru)',
              category: 'options',
              tags: [],
            },
            {
              value: 'Сторонние интернет-ресурсы',
              label: 'Сторонние интернет-ресурсы',
              fullname: 'Сторонние интернет-ресурсы',
              category: 'options',
              tags: [],
            },
            {
              value: 'Тематические группы в социальных сетях и меседжерах',
              label: 'Тематические группы в социальных сетях и меседжерах',
              fullname: 'Тематические группы в социальных сетях и мессенджерах',
              category: 'options',
              tags: [],
            },
            {
              value: 'Друзья и знакомые',
              label: 'Друзья и знакомые',
              fullname: 'Друзья и знакомые',
              category: 'options',
              tags: [],
            },
            {
              value: 'Сотрудники "одного окна" ДГИ',
              label: 'Сотрудники "одного окна" ДГИ',
              fullname: 'Сотрудники "одного окна" ДГИ',
              category: 'options',
              tags: [],
            },
            {
              value: 'Сотрудники МФЦ',
              label: 'Сотрудники МФЦ',
              fullname: 'Сотрудники МФЦ',
              category: 'options',
              tags: [],
            },
          ],
        },
      ],
    },
    {
      key: 'sentToYandex',
      label: 'Заявитель направлен на Яндекс',
      type: 'boolean',
      trueLabel: 'Да, направлен',
      falseLabel: 'Нет, не направлен',
      width: 'half',
      order: 17,
    },
  ],
};
