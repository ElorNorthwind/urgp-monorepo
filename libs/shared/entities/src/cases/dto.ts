import { z } from 'zod';
import { externalCase } from '../userInput/types';

// создание заявки
export const caseCreate = z.object({
  authorId: z.coerce.number(),
  approver: z.coerce.number(),
  externalCases: z.array(externalCase).default([]),
  type: z.coerce.number(),
  directions: z.array(z.coerce.number()),
  problems: z.array(z.coerce.number()).nullable().default(null),
  description: z.string().min(1, { message: 'Описание не может быть пустым' }),
  fio: z.string().min(1, { message: 'ФИО не может быть пустым' }),
  adress: z.string().nullable().default(null),
});
export type CaseCreateDto = z.infer<typeof caseCreate>;

export const caseCreateFormValues = caseCreate.pick({
  externalCases: true,
  description: true,
  type: true,
  directions: true,
  problems: true,
  approver: true,
});
export type CaseCreateFormValuesDto = z.infer<typeof caseCreateFormValues>;

// изменение заявки
export const caseUpdate = caseCreate
  .pick({
    externalCases: true,
    type: true,
    directions: true,
    problems: true,
    description: true,
    approver: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
  });
export type CaseUpdateDto = z.infer<typeof caseUpdate>;

export const caseUpdateFormValues = caseCreateFormValues.partial();
export type CaseUpdateFormValuesDto = z.infer<typeof caseUpdateFormValues>;
