import { z } from 'zod';
import { AnketologSurveyTypes } from './config';
import { addDays, format, subDays } from 'date-fns';
import { report } from 'process';

// Параметры поиска на странице
const queryNumberArray = z
  .string()
  .transform((value) => value.split(','))
  .pipe(
    z.array(
      z
        .string()
        .transform((value) => Number(value))
        .pipe(z.number()),
    ),
  )
  .or(z.number().array());

const queryStringArray = z
  .string()
  .transform((value) => value.split(','))
  .pipe(z.string().array())
  .or(z.string().array());

export const anketologQuerySchema = z.object({
  surveyId: z
    .literal(AnketologSurveyTypes.operator)
    .or(z.literal(AnketologSurveyTypes.client)),
  dateFrom: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}/, {
      message: 'Некорректная дата',
    })
    .or(
      z.string().regex(/\d{2}.\d{2}.\d{4}/, {
        message: 'Некорректная дата',
      }),
    ),
  dateTo: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}/, {
      message: 'Некорректная дата',
    })
    .or(
      z.string().regex(/\d{2}.\d{2}.\d{4}/, {
        message: 'Некорректная дата',
      }),
    ),
});
export type AnketologQuery = z.infer<typeof anketologQuerySchema>;

export const qmsQuerySchema = anketologQuerySchema.pick({
  dateFrom: true,
  dateTo: true,
});
export type QmsQuery = z.infer<typeof qmsQuerySchema>;

export const vksCasesQuerySchema = z
  .object({
    dateFrom: z
      .string()
      .datetime()
      .or(z.string().regex(/\d{2}.\d{2}.\d{4}/))
      .or(z.string().regex(/\d{4}\-\d{2}\-\d{2}/))
      .or(z.literal('-infinity'))
      .default('-infinity'),
    dateTo: z
      .string()
      .datetime()
      .or(z.string().regex(/\d{2}.\d{2}.\d{4}/))
      .or(z.string().regex(/\d{4}\-\d{2}\-\d{2}/))
      .or(z.literal('infinity'))
      .default('infinity'),
  })
  .partial();
export type VksCasesQuery = z.infer<typeof vksCasesQuerySchema>;

export const vksCasesPageFilterSchema = z
  .object({
    query: z.string(),
    operator: z.string(),
    service: queryStringArray,
    department: queryNumberArray,
    grade: queryNumberArray,
    status: queryStringArray,
    type: queryStringArray,
    operatorSurvey: queryNumberArray,
    caseType: queryStringArray,
    yandex: queryNumberArray,
    // clientId: z.coerce.number().int().nonnegative(),
  })
  .partial();
export type VksCasesPageFilter = z.infer<typeof vksCasesPageFilterSchema>;

export const vksCasesPageSearchSchema = vksCasesPageFilterSchema
  .extend({
    dateFrom: vksCasesQuerySchema.shape.dateFrom,
    dateTo: vksCasesQuerySchema.shape.dateTo,
    selectedCase: z.coerce.number(),
    sortKey: z.string(),
    sortDir: z.enum(['asc', 'desc']),
  })
  .partial();
// .extend({
//   dateFrom: z
//     .string()
//     .or(z.string().regex(/\d{4}\-\d{2}\-\d{2}/))
//     .default(format(subDays(new Date(), 30), 'yyyy-MM-dd')),
//   dateTo: z
//     .string()
//     .or(z.string().regex(/\d{4}\-\d{2}\-\d{2}/))
//     .default(format(new Date(), 'yyyy-MM-dd')),
// });
export type VksCasesPageSearch = z.infer<typeof vksCasesPageSearchSchema>;

// export const vksDashbordPageSearchSchema = vksCasesPageSearchSchema.pick({
//   department: true,
//   dateFrom: true,
//   dateTo: true,
// });
export const vksDashbordPageSearchSchema = z.object({
  department: queryNumberArray.optional(),
  dateFrom: z
    .string()
    .datetime()
    .or(z.string().regex(/\d{2}.\d{2}.\d{4}/))
    .or(z.string().regex(/\d{4}\-\d{2}\-\d{2}/))
    .or(z.literal('-infinity'))
    .default(format(subDays(new Date(), 30), 'yyyy-MM-dd')),
  dateTo: z
    .string()
    .datetime()
    .or(z.string().regex(/\d{2}.\d{2}.\d{4}/))
    .or(z.string().regex(/\d{4}\-\d{2}\-\d{2}/))
    .or(z.literal('-infinity'))
    .default(format(new Date(), 'yyyy-MM-dd')),
  caseType: z.literal('ВКС').or(z.literal('ГЛ')).optional(),

  // dateFrom: vksCasesQuerySchema.shape.dateFrom,
  // dateTo: vksCasesQuerySchema.shape.dateTo,
});
export type VksDashbordPageSearch = z.infer<typeof vksDashbordPageSearchSchema>;

export const vkaSetBooleanFlagSchema = z.object({
  caseId: z.number().int().nonnegative(),
  value: z.boolean().nullable(),
});
export type VkaSetBooleanFlag = z.infer<typeof vkaSetBooleanFlagSchema>;

const fromDate = z.preprocess(
  (value) =>
    value === undefined || value === null
      ? format(subDays(new Date(), 1), 'dd.MM.yyyy')
      : value,
  z.string().regex(/\d{2}.\d{2}.\d{4}/, {
    message: 'Некорректная дата. Нужен формат дд.мм.гггг',
  }),
);

const toDate = z.preprocess(
  (value) =>
    value === undefined || value === null
      ? format(addDays(new Date(), 1), 'dd.MM.yyyy')
      : value,
  z.string().regex(/\d{2}.\d{2}.\d{4}/, {
    message: 'Некорректная дата. Нужен формат дд.мм.гггг',
  }),
);

export const hotlineRequestSchema = z
  .object({
    dateFrom: fromDate,
    dateTo: toDate,
    page: z.number().int().nonnegative().default(1),
    reportType: z
      .enum(['hotline', 'hotline_score', 'outbound'])
      .default('hotline'),
    idReport: z.coerce.number().int().nonnegative().nullable().default(null),
  })
  .default({});
export type HotlineRequest = z.input<typeof hotlineRequestSchema>;

export const updateDgiVksSurveyHousingFormSchema = z.object({
  id: z.number().int().nonnegative(),
  operator: z.number().int().nonnegative().nullable().optional(),
  type: z.string().nullable().optional(),
  relevance: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  questionType: z.string().nullable().optional(),
  questionClassificator: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  isClient: z.string().nullable().optional(),
  clientType: z.string().nullable().optional(),
  clientNumber: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  docs: z.any().nullable().optional(), // TODO: structure of doc object
  mood: z.string().nullable().optional(),
  needsAnswer: z.string().nullable().optional(),
  problems: z.array(z.string()).nullable().optional(),
  infoSource: z.string().nullable().optional(),
  sentToYandex: z.string().nullable().optional(),
});
export type UpdateDgiVksSurveyHousingForm = z.infer<
  typeof updateDgiVksSurveyHousingFormSchema
>;

export const emptyVksSurveyHousingForm: UpdateDgiVksSurveyHousingForm = {
  id: 0,
  operator: null,
  type: null,
  relevance: null,
  department: null,
  questionType: 'Частный',
  questionClassificator: null,
  summary: null,
  isClient: null,
  clientType: null,
  clientNumber: null,
  address: null,
  docs: null,
  mood: null,
  needsAnswer: null,
  problems: [],
  infoSource: null,
  sentToYandex: null,
};
