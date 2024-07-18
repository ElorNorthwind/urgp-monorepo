import { z } from 'zod';

export const getOldBuldings = z
  .object({
    limit: z.coerce.number().min(1).max(500).default(100).or(z.literal('ALL')),
    offset: z.coerce.number().min(0).default(0),
    // page: z.coerce.number().min(1).default(1),
    okrug: z.string(),
    districts: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),

    // z.string().array(),
    relocationType: z.number().array(),
    status: z.number().array(),
    dificulty: z.number().array(),
    deviation: z.enum(['done', 'normal', 'attention', 'risk']).array(),
    relocationAge: z
      .enum(['done', 'notStarted', '1', '2', '5', '8', 'more'])
      .array(),
    relocationStatus: z
      .enum([
        'done',
        'demolition',
        'secondResetlement',
        'firstResetlement',
        'notStarted',
      ])
      .array(),
    adress: z.string(),
  })
  .partial();

export type GetOldBuldingsDto = z.infer<typeof getOldBuldings>;

export const relocationDeviations = {
  done: 'Завершено',
  normal: 'Без отклонений',
  attention: 'Требует внимания',
  risk: 'Есть риски',
};

export const relocationAge = {
  done: 'Завершено',
  notStarted: 'Не начато',
  '1': 'Менее месяца',
  '2': 'От 1 до 2 месяцев',
  '5': 'От 2 до 5 месяцев',
  '8': 'От 5 до 8 месяцев',
  more: 'Более 8 месяцев',
};

export const relocationStatus = {
  done: 'Завершено',
  demolition: 'Снос',
  secondResetlement: 'Отселение',
  firstResetlement: 'Переселение',
  notStarted: 'Не начато',
};
