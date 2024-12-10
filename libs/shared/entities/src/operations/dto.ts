import { z } from 'zod';

// создание операции
export const operationCreate = z.object({
  caseId: z.coerce.number().nullable().default(null),
  problemId: z.coerce.number().nullable().default(null),
  authorId: z.coerce.number(),
  type: z.coerce.number(),
  doneDate: z.coerce.date(),
  num: z.string().nullable().default(null),
  // externalCase: externalCase.nullable().default(null), // внешний номер,
  description: z.string().nullable().default(null),
});
export type OperationCreateDto = z.infer<typeof operationCreate>;

export const operationCreateFormValues = operationCreate.pick({
  type: true,
  // externalCase: true,
  doneDate: true,
  num: true,
  description: true,
});
export type OperationCreateFormValuesDto = z.infer<
  typeof operationCreateFormValues
>;

// изменение операции
export const operationUpdate = operationCreate
  .pick({
    type: true,
    // externalCase: true,
    doneDate: true,
    num: true,
    description: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
  });
export type OperationUpdateDto = z.infer<typeof operationUpdate>;

export const operationUpdateFormValues = operationCreateFormValues.partial();
export type OperationUpdateFormValuesDto = z.infer<
  typeof operationUpdateFormValues
>;
