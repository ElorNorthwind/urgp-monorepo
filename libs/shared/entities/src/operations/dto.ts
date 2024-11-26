import { z } from 'zod';
import { externalCase } from '../userInput/types';

// создание операции
export const operationCreate = z.object({
  caseId: z.coerce.number().nullable().default(null),
  problemId: z.coerce.number().nullable().default(null),
  authorId: z.coerce.number(),
  type: z.coerce.number(),
  externalCase: externalCase.nullable().default(null), // внешний номер,
  description: z.string().nullable().default(null),
});
export type OperationCreateDto = z.infer<typeof operationCreate>;

export const operationCreateFormValues = operationCreate.pick({
  type: true,
  externalCase: true,
  description: true,
});
export type OperationCreateFormValuesDto = z.infer<
  typeof operationCreateFormValues
>;

// изменение операции
export const operationUpdate = operationCreate
  .pick({
    type: true,
    externalCase: true,
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
