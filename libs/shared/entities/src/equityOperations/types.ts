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
  priority: z.number(),
});

export const equityOperationSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  objectId: z.coerce.number().int().nonnegative(),
  claimId: z.coerce.number().int().nonnegative().nullable(),

  type: operationTypeSchema.nullable(), // Can be null if no matching type
  date: z.string().datetime().nullable().default(null), // ISO 8601 date string,                 // Timestamp as ISO string
  source: z.string().nullable(),
  notes: z.string().nullable(),
  number: z.string().nullable(),
  result: z.string().nullable(),
  createdAt: z.string().datetime().nullable().default(null), // ISO 8601 date string,
  createdBy: userInfoSchema.nullable(), // Can be null if user deleted
  updatedAt: z.string().datetime().nullable().default(null), // ISO 8601 date string,
  updatedBy: userInfoSchema.nullable(), // Can be null if user deleted
});
export type EquityOperation = z.infer<typeof equityOperationSchema>;
