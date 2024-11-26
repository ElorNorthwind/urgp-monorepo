import { z } from 'zod';

// создание поручения
export const dispatchCreate = z.object({
  caseId: z.coerce.number().nullable().default(null),
  problemId: z.coerce.number().nullable().default(null),
  authorId: z.coerce.number(),
  executorId: z.coerce.number(),
  type: z.coerce.number(),
  dueDate: z.coerce.date().nullable().default(null),
  description: z.string().nullable().default(null),
});
export type DispatchCreateDto = z.infer<typeof dispatchCreate>;

export const dispatchCreateFormValues = dispatchCreate.pick({
  executorId: true,
  type: true,
  dueDate: true,
  description: true,
});
export type DispatchCreateFormValuesDto = z.infer<
  typeof dispatchCreateFormValues
>;

// изменение поручения
export const dispatchUpdate = dispatchCreate
  .pick({
    executorId: true,
    type: true,
    dueDate: true,
    description: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
  });
export type DispatchUpdateDto = z.infer<typeof dispatchUpdate>;

export const dispatchUpdateFormValues = dispatchCreateFormValues.partial();
export type DispatchUpdateFormValuesDto = z.infer<
  typeof dispatchUpdateFormValues
>;
