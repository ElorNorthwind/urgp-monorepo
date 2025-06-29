import { z } from 'zod';
import { equityObjectProblemsValues } from './config';

// Sub-schemas for nested objects
const buildingSchema = z
  .object({
    id: z.coerce.number().int().nonnegative(),
    complexId: z.coerce.number().int().nonnegative(),
    complexName: z.string().nullable(),
    developer: z.string().nullable(),
    developerShort: z.string().nullable(),
    isDone: z.coerce.boolean(),
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
  npp: z.coerce.number().int(),
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

export const equityTotalsSchema = z.object({
  building: buildingSchema,
  objectType: objectTypeSchema,
  status: statusSchema,
  total: z.number().int().nonnegative(),
});
export type EquityTotals = z.infer<typeof equityTotalsSchema>;

export const equityTimelineSchema = z.object({
  year: z.number().int().nonnegative(),
  month: z.number().int().nonnegative(),
  period: z.string(),
  given: z.number().int().nonnegative(),
  taken: z.number().int().nonnegative(),
});
export type EquityTimeline = z.infer<typeof equityTimelineSchema>;

export const equityComplexDataSchema = z.object({
  complex: z.object({
    id: z.coerce.number().int().nonnegative(),
    name: z.string().nullable(),
    developer: z.string().nullable(),
  }),
  buildingsDone: z.number().int().nonnegative(),
  buildingsProject: z.number().int().nonnegative(),
  buildingIds: z.array(z.number().int().nonnegative()),
  maxApartments: z.number().int().nonnegative(),
  maxParkings: z.number().int().nonnegative(),
});
export type EquityComplexData = z.infer<typeof equityComplexDataSchema>;

// to_jsonb(c) as complex,
// COUNT(*) FILTER (WHERE o.apartments > 0) as "buildingsDone",
// COUNT(*) FILTER (WHERE o.apartments IS NULL OR o.apartments = 0) as "buildingsProject",
// ARRAY_AGG(b.id) as "buildingIds",
// MAX(o.apartments) as "maxApartments",
// MAX(o.parkings) as "maxParkings"
