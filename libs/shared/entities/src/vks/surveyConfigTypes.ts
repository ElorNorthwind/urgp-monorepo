import type { RtkApiEndpoint } from '@urgp/client/shared';

import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
} from '../userInput/types';

export type VksDgiSurveyElementType =
  | 'boolean'
  | 'text'
  | 'singleSelect'
  | 'multipleSelect'
  | 'docList';

type VksDgiSurveyElementCommon = {
  key: string;
  label: string;
  width?: 'half' | 'full';
  order?: number;
  isHidden?: boolean;
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
  placeholder: string;
  defaultValue?: string;
  lockedValue?: string;
};

export type DgiSurveySingleSelectStringElement = VksDgiSurveyElementCommon & {
  type: 'singleSelectString';
  options: NestedClassificatorInfoString[];
  serverOptionsQuery?: RtkApiEndpoint;
  defaultValue?: string;
  lockedValue?: string;
};

export type DgiSurveySingleSelectNumberElement = VksDgiSurveyElementCommon & {
  type: 'singleSelectNumber';
  options: NestedClassificatorInfo[];
  serverOptionsQuery?: RtkApiEndpoint;
  defaultValue?: number;
  lockedValue?: number;
};
export type DgiSurveyMultiSelectStringElement = VksDgiSurveyElementCommon & {
  type: 'multiSelectString';
  options: NestedClassificatorInfoString[];
  serverOptionsQuery?: RtkApiEndpoint;
  defaultValue?: string;
  lockedValue?: string;
};

export type DgiSurveyMultiSelectNumberElement = VksDgiSurveyElementCommon & {
  type: 'multiSelectNumber';
  options: NestedClassificatorInfo[];
  serverOptionsQuery?: RtkApiEndpoint;
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
  | DgiSurveySingleSelectStringElement
  | DgiSurveySingleSelectNumberElement
  | DgiSurveyDocListElement;

export type VksDgiSurveyConfig = {
  elements: VksDgiSurveyElement[];
};

const housingConfig: VksDgiSurveyConfig = {
  elements: [
    {
      key: 'operator',
      label: 'Оператор',
      type: 'singleSelectString',
      options: [
        {
          value: 'vks',
          label: 'ВКС',
          items: [
            {
              value: '123',
              label: '123',
              fullname: 'qe',
              tags: ['123'],
              category: '123',
            },
          ],
        },
      ],
      defaultValue: 'w',
    },
  ],
};

// // Заполнение анкеты
//   // Проводивший консультация
//   operator: vksSurveyUserSchema,
//   type: z.enum(VksDgiSurveyConsultationTypeValues).nullable(),
//   relevance: z.enum(VksDgiSurveyQuestionRelevanceValues).nullable(),
//   department: z.string().nullable(), // TBD: добавить выгружаемый классификатор?
//   questionType: z.enum(VksDgiSurveyQuestionTypeValues).nullable(),
//   // questionClassificator: z.string().nullable(), // TBD: добавить выгружаемый классификатор?
//   summary: z.string().nullable(),
//   // isClient: z.coerce.boolean().nullable(),
//   // clientType: z.string().nullable(),
//   // clientNumber: z.string().nullable(),
//   address: z.string().nullable(),
//   docs: z.array(vksSurveyDocumentSchema).nullable(),
//   mood: z.enum(VksDgiSurveyMoodValues).nullable(),
//   needsAnswer: z.coerce.boolean().nullable(),
//   problems: z.array(z.enum(VksDgiSurveyProblemValues)).nullable(),
//   infoSource: z.enum(VksDgiSurveyInfoSourceValues).nullable(),
//   sentToYandex: z.coerce.boolean().nullable(),
