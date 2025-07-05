import { z } from 'zod';

// Schema for user information
const userInfoSchema = z.object({
  id: z.number(),
  fio: z.string(),
  department: z.string().nullable(), // Department can be null
});

// Schema for operation type information
const operationTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  fullname: z.string(),
  category: z.string(),
  fields: z.array(z.string()).nullable(),
  priority: z.number(),
});

export const equityOperationSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  class: z.literal('operation').default('operation'),
  objectId: z.coerce.number().int().nonnegative(),
  claimId: z.coerce.number().int().nonnegative().nullable().default(null),

  type: operationTypeSchema.nullable(), // Can be null if no matching type
  date: z.string().datetime().nullable().default(null), // ISO 8601 date string,                 // Timestamp as ISO string
  source: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  number: z.string().nullable().default(null),
  result: z.string().nullable().default(null),
  fio: z.string().nullable().default(null),
  createdAt: z.string().datetime().nullable().default(null), // ISO 8601 date string,
  createdBy: userInfoSchema.nullable(), // Can be null if user deleted
  updatedAt: z.string().datetime().nullable().default(null), // ISO 8601 date string,
  updatedBy: userInfoSchema.nullable(), // Can be null if user deleted
});
export type EquityOperation = z.infer<typeof equityOperationSchema>;
