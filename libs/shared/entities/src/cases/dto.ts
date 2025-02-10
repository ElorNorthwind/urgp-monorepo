import { format } from 'date-fns';
import { z } from 'zod';
import { viewStatusValues } from '../userInput/config';
import { caseSlimSchema } from './types';
import { virtualAuthorSchema } from '../userInput/types';

export const createCaseSchema = caseSlimSchema
  .omit({
    id: true,
    authorId: true,
    updatedById: true,
    approveFromId: true,
    updatedAt: true,
    createdAt: true,
    revision: true,
  })
  .extend({
    dueDate: z.string().datetime().optional(), // ISO 8601 date string
  });
export type CreateCaseDto = z.infer<typeof createCaseSchema>;

export const updateCaseSchema = caseSlimSchema
  .omit({
    id: true,
    authorId: true,
    updatedById: true,
    approveFromId: true,
    updatedAt: true,
    createdAt: true,
    revision: true,
  })
  .partial()
  .extend({
    id: z.coerce.number().int().nonnegative(),
    dueDate: z.string().datetime().optional(), // ISO 8601 date string
    //   dueDate: z.coerce
    //     .date({ message: 'Дата обязательна' })
    //     .or(z.number())
    //     .or(z.string().date())
    //     .default(GET_DEFAULT_CONTROL_DUE_DATE()),
  });
export type UpdateCaseDto = z.infer<typeof updateCaseSchema>;

export const caseFormSchema = updateCaseSchema.required().extend({
  authorId: z.coerce.number().int().nonnegative().nullable().optional(),
});
export type CaseFormDto = z.infer<typeof caseFormSchema>;

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
    viewStatus: z.enum(viewStatusValues),
    action: queryStringArray,
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
