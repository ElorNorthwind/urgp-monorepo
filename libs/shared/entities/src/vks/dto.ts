import { z } from 'zod';
import { AnketologSurveyTypes, anketologSurveyTypesValues } from './config';

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
      .or(z.literal('-infinity'))
      .default('-infinity'),
    dateTo: z
      .string()
      .datetime()
      .or(z.string().regex(/\d{2}.\d{2}.\d{4}/))
      .or(z.literal('infinity'))
      .default('infinity'),
  })
  .partial();
export type VksCasesQuery = z.infer<typeof vksCasesQuerySchema>;
