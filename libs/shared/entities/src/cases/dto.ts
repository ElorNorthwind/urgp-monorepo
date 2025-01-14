import { z } from 'zod';
import { externalCase } from '../userInput/types';
import { GET_DEFAULT_CONTROL_DUE_DATE } from '../userInput/config';
import { format } from 'date-fns';

// создание заявки
export const caseCreate = z.object({
  class: z.coerce.string().default('control-incedent'),
  typeId: z.coerce.number().default(4),
  externalCases: z.array(externalCase).default([]),
  directionIds: z.array(z.coerce.number()).default([]),
  problemIds: z.array(z.coerce.number()).nullable().default(null),
  description: z.string().min(1, { message: 'Описание не может быть пустым' }),
  fio: z.string().min(1, { message: 'ФИО не может быть пустым' }),
  adress: z.string().nullable().default(''),
  approverId: z.coerce.number().nullable().default(null),
  dueDate: z.coerce
    .date({ message: 'Дата обязательна' })
    .or(z.number())
    .default(GET_DEFAULT_CONTROL_DUE_DATE()),
});
export type CaseCreateDto = z.infer<typeof caseCreate>;

export const caseCreateFormValues = caseCreate.pick({
  class: true,
  typeId: true,
  externalCases: true,
  directionIds: true,
  problemIds: true,
  description: true,
  fio: true,
  adress: true,
  approverId: true,
  dueDate: true,
});
export type CaseCreateFormValuesDto = z.infer<typeof caseCreateFormValues>;

// изменение заявки
export const caseUpdate = caseCreate
  .pick({
    class: true,
    externalCases: true,
    typeId: true,
    directionIds: true,
    problemIds: true,
    description: true,
    approverId: true,
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

// Параметры поиска на странице
const quetyNumberArray = z
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

export const casesPageSearch = z
  .object({
    selectedCase: z.coerce.number(),
    query: z.string(),
    num: z.string(),
    status: quetyNumberArray,
    direction: quetyNumberArray,
    type: quetyNumberArray,
    department: queryStringArray,
    dueFrom: z.coerce.date().transform((value) => format(value, 'yyyy-MM-dd')),
    dueTo: z.coerce.date().transform((value) => format(value, 'yyyy-MM-dd')),
    viewStatus: z.array(z.enum(['unwatched', 'unchanged', 'new', 'changed'])),
  })
  .partial();
export type CasesPageSearchDto = z.infer<typeof casesPageSearch>;
