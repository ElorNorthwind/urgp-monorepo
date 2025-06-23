import { z } from 'zod';
import { equityObjectProblemsValues } from './config';

// Sub-schemas for nested objects
const buildingSchema = z
  .object({
    id: z.coerce.number().int().nonnegative(),
    complexId: z.coerce.number().int().nonnegative(),
    complexName: z.string().nullable(),
    developer: z.string().nullable(),
    unom: z.coerce.number().int().nonnegative().nullable(),
    cadNum: z.string().nullable(),
    addressShort: z.string().nullable(),
    addressFull: z.string().nullable(),
    addressConstruction: z.string().nullable(),
  })
  .nullable();

const objectTypeSchema = z
  .object({
    id: z.coerce.number().int().nonnegative(),
    name: z.string(),
  })
  .nullable();

const statusSchema = z
  .object({
    id: z.coerce.number().int().nonnegative(),
    name: z.string(),
  })
  .nullable();

const lastOperationSchema = z
  .object({
    id: z.coerce.number().int().nonnegative().nullable(),
    typeId: z.number().int().nonnegative().nullable(),
    typeName: z.string().nullable(),
    date: z.string().datetime().nullable().default(null), // ISO 8601 date string,
  })
  .nullable();

// Main schema for query results
export const equityObjectSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  isIdentified: z.coerce.boolean(),

  building: buildingSchema,
  objectType: objectTypeSchema,
  status: statusSchema,

  // Core object properties
  cadNum: z.string().nullable(),
  num: z.string(),
  claimsCount: z.number().int().nonnegative().nullable(), // Count of claims
  identificationNotes: z.string().nullable(), // Claim identification notes
  creditor: z.string().nullable(), // Aggregated creditor names

  lastOperation: lastOperationSchema,
  problems: z.array(z.enum(equityObjectProblemsValues)).default([]),

  // Additional attributes
  unom: z.number().int().nonnegative().nullable(),
  unkv: z.string().nullable(),
  rooms: z.number().int().nonnegative().nullable(),
  floor: z.number().int().nullable(),
  s: z.number().nonnegative().nullable(),

  // EGRN registry information
  egrnStatus: z.string().nullable(), // Ownership status
  egrnTitleNum: z.string().nullable(), // Title number
  egrnTitleDate: z.string().datetime().nullable().default(null), // ISO 8601 date string // Title registration date
  egrnHolderName: z.string().nullable(), // Current title holder
});

export type EquityObject = z.infer<typeof equityObjectSchema>;
