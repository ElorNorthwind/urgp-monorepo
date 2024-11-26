import { z } from 'zod';

// создание системной проблемы
export const problemCreate = z.object({
  authorId: z.coerce.number(),
  directions: z.array(z.coerce.number()),
  shortName: z.string().min(1, {
    message: 'Краткое наименование системной проблемы не может быть пустым',
  }),
  description: z
    .string()
    .min(1, { message: 'Описание системной проблемы не может быть пустым' }),
});
export type ProblemCreateDto = z.infer<typeof problemCreate>;

export const problemCreateFormValues = problemCreate.pick({
  description: true,
  shortName: true,
  directions: true,
});
export type ProblemCreateFormValuesDto = z.infer<
  typeof problemCreateFormValues
>;

// изменение системной проблемы
export const problemUpdate = problemCreate
  .pick({
    description: true,
    shortName: true,
    directions: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
  });
export type ProblemUpdateDto = z.infer<typeof problemUpdate>;

export const problemUpdateFormValues = problemCreateFormValues.partial();
export type ProblemUpdateFormValuesDto = z.infer<
  typeof problemUpdateFormValues
>;
