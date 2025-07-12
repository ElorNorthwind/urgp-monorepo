import { z } from 'zod';

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

export const equityObjectsPageFilterSchema = z
  .object({
    query: z.string(),
    apartment: z.string(),
    building: queryNumberArray,
    problem: queryStringArray,
    status: queryNumberArray,
    type: queryNumberArray,
    documents: queryStringArray,

    opinionUrgp: queryStringArray,
    opinionUpozh: queryStringArray,
    opinionUork: queryStringArray,
    opinionUpozi: queryStringArray,

    claimTransfer: queryStringArray,
  })
  .partial();
export type EquityObjectsPageFilter = z.infer<
  typeof equityObjectsPageFilterSchema
>;

export const equityObjectsPageSearchSchema = equityObjectsPageFilterSchema
  .extend({
    selectedObject: z.coerce.number(),
    sortKey: z.string(),
    sortDir: z.enum(['asc', 'desc']),
  })
  .partial();
export type EquityObjectsPageSearch = z.infer<
  typeof equityObjectsPageSearchSchema
>;

export const getEquityObjectById = z.object({
  id: z.coerce.number(),
});

export type GetEquityObjectDto = z.infer<typeof getEquityObjectById>;

export const equityOperationLogPageFilterSchema = z
  .object({
    query: z.string(),
    building: queryNumberArray,
    type: queryNumberArray,
    opType: queryNumberArray,
  })
  .partial();
export type EquityOperationLogPageFilter = z.infer<
  typeof equityObjectsPageFilterSchema
>;

export const equityOperationLogPageSearchSchema =
  equityOperationLogPageFilterSchema
    .extend({
      selectedObject: z.coerce.number(),
      sortKey: z.string(),
      sortDir: z.enum(['asc', 'desc']),
    })
    .partial();
export type EquityOperationLogPageSearch = z.infer<
  typeof equityOperationLogPageSearchSchema
>;
