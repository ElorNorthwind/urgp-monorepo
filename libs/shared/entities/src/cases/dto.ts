import { format } from 'date-fns';
import { z } from 'zod';
import { GET_DEFAULT_CONTROL_DUE_DATE } from '../userInput/config';
import { externalCaseSchema } from '../userInput/types';

export const DISPATCH_PREFIX = 'dispatch-';

const fullCaseSelectorSchema = z
  .enum(['default', 'all', 'pending'])
  .or(z.coerce.number())
  .or(
    z.preprocess((obj) => {
      if (typeof obj === 'string' && obj.startsWith(DISPATCH_PREFIX)) {
        return obj;
      } else {
        return null;
      }
    }, z.string()),
  )
  .or(
    z.preprocess((obj) => {
      if (Array.isArray(obj)) {
        return obj;
      } else if (typeof obj === 'string') {
        return obj.split(',');
      } else {
        return null;
        // return [];
      }
    }, z.array(z.coerce.number()).or(z.string()).default('default')),
  )
  .default('default');

const slimCaseSelectorSchema = z.coerce.number().or(
  z.preprocess((obj) => {
    if (Array.isArray(obj)) {
      return obj;
    } else if (typeof obj === 'string') {
      return obj.split(',');
    } else {
      return null;
      // return [];
    }
  }, z.array(z.coerce.number())),
);

export const readFullCaseSchema = z.object({
  selector: fullCaseSelectorSchema,
});
export const readSlimCaseSchema = z.object({
  selector: slimCaseSelectorSchema,
});

export type FullCaseSelector = z.infer<typeof fullCaseSelectorSchema>;
export type SlimCaseSelector = z.infer<typeof slimCaseSelectorSchema>;
export type ReadFullCaseDto = z.infer<typeof readFullCaseSchema>;
export type ReadSlimCaseDto = z.infer<typeof readSlimCaseSchema>;

// создание заявки
export const caseCreate = z.object({
  class: z.coerce.string().default('control-incedent'),
  typeId: z.coerce.number().default(4),
  externalCases: z.array(externalCaseSchema).default([]),
  directionIds: z.array(z.coerce.number()).default([]),
  problemIds: z.array(z.coerce.number()).nullable().default(null),
  description: z.string().min(1, { message: 'Описание не может быть пустым' }),
  fio: z.string().min(1, { message: 'ФИО не может быть пустым' }),
  adress: z.string().nullable().default(''),
  approverId: z.coerce.number().nullable().default(null),
  dueDate: z.coerce
    .date({ message: 'Дата обязательна' })
    .or(z.number())
    .or(z.string().date())
    .default(GET_DEFAULT_CONTROL_DUE_DATE()),
});
export type CaseCreateDto = z.infer<typeof caseCreate>;

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

export const caseFormValuesDto = caseCreate
  .pick({
    class: true,
    typeId: true,
    externalCases: true,
    directionIds: true,
    problemIds: true,
    description: true,
    fio: true,
    adress: true,
    dueDate: true,
    approverId: true,
  })
  .extend({
    id: z.coerce.number().nullable().default(null),
  });
export type CaseFormValuesDto = z.infer<typeof caseFormValuesDto>;

// export const caseUpdateFormValues = caseCreateFormValues.partial();
// export type CaseUpdateFormValuesDto = z.infer<typeof caseUpdateFormValues>;

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

export const casesPageFilter = z
  .object({
    query: z.string(),
    num: z.string(),
    author: z.string(),
    status: queryNumberArray,
    direction: queryNumberArray,
    type: queryNumberArray,
    department: queryStringArray,
    relevant: z.boolean(),
    dueFrom: z.coerce.date().transform((value) => format(value, 'yyyy-MM-dd')),
    dueTo: z.coerce.date().transform((value) => format(value, 'yyyy-MM-dd')),
    viewStatus: z.array(z.enum(['unwatched', 'unchanged', 'new', 'changed'])),
    action: queryStringArray,
    // action: z.array(
    //   z.enum([
    //     'unknown',
    //     'case-approve',
    //     'both-approve',
    //     'operation-approve',
    //     'case-rejected',
    //     'reminder-done',
    //     'reminder-overdue',
    //   ]),
    // ),
  })
  .partial();
export type CasesPageFilter = z.infer<typeof casesPageFilter>;

export const casesPageSearch = casesPageFilter
  .extend({
    selectedCase: z.coerce.number(),
    sortKey: z.string(),
    sortDir: z.enum(['asc', 'desc']),
  })
  .partial();
export type CasesPageSearchDto = z.infer<typeof casesPageSearch>;
