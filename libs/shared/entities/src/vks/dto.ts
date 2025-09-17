import { z } from 'zod';
import { AnketologSurveyTypes } from './config';
import { format, subDays } from 'date-fns';

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
});
export type VksDashbordPageSearch = z.infer<typeof vksDashbordPageSearchSchema>;

export const vkaSetIsTechnicalSchema = z.object({
  caseId: z.number().int().nonnegative(),
  value: z.boolean().nullable(),
});
export type VkaSetIsTechnical = z.infer<typeof vkaSetIsTechnicalSchema>;
