import { z } from 'zod';
import { externalCase } from '../userInput/types';

// создание заявки
export const caseCreate = z.object({
  class: z.coerce.string().default('control-incedent'),
  type: z.coerce.number().default(4),
  externalCases: z.array(externalCase).default([]),
  directions: z.array(z.coerce.number()).default([]),
  problems: z.array(z.coerce.number()).nullable().default(null),
  description: z.string().min(1, { message: 'Описание не может быть пустым' }),
  fio: z.string().min(1, { message: 'ФИО не может быть пустым' }),
  adress: z.string().nullable().default(''),
  approver: z.coerce.number().nullable().default(null),
});
export type CaseCreateDto = z.infer<typeof caseCreate>;

export const caseCreateFormValues = caseCreate.pick({
  class: true,
  type: true,
  externalCases: true,
  directions: true,
  problems: true,
  description: true,
  fio: true,
  adress: true,
  approver: true,
});
export type CaseCreateFormValuesDto = z.infer<typeof caseCreateFormValues>;

// изменение заявки
export const caseUpdate = caseCreate
  .pick({
    class: true,
    externalCases: true,
    type: true,
    directions: true,
    problems: true,
    description: true,
    approver: true,
    fio: true,
    adress: true,
  })
  .partial()
  .extend({
    id: z.coerce.number(),
  });
export type CaseUpdateDto = z.infer<typeof caseUpdate>;

export const caseUpdateFormValues = caseCreateFormValues.partial();
export type CaseUpdateFormValuesDto = z.infer<typeof caseUpdateFormValues>;

export const casesPageSearch = z
  .object({
    selectedCase: z.coerce.number(),
    query: z.string(),
  })
  .partial();
export type CasesPageSearchDto = z.infer<typeof casesPageSearch>;
