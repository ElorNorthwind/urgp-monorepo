import { z } from 'zod';
import {
  equityObjectOpinionsValues,
  equityObjectProblemsValues,
} from './config';

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

// const lastOperationSchema = z
//   .object({
//     id: z.coerce.number().int().nonnegative().nullable(),
//     typeId: z.number().int().nonnegative().nullable(),
//     typeName: z.string().nullable(),
//     date: z.string().datetime().nullable().default(null), // ISO 8601 date string,
//   })
//   .nullable();

export const equityObjectSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  isIdentified: z.coerce.boolean(),
  class: z.literal('object').default('object'),

  buildingId: z.coerce.number().int().nonnegative(),
  buildingCadNum: z.string().nullable(),
  developerShort: z.string(),
  complexId: z.coerce.number().int().nonnegative(),
  complexName: z.string(),
  buildingIsDone: z.coerce.boolean(),
  addressShort: z.string(),

  objectTypeId: z.coerce.number().int().nonnegative(),
  objectTypeName: z.string(),

  statusId: z.coerce.number().int().nonnegative(),
  statusName: z.string(),

  cadNum: z.string().nullable(),
  num: z.string(),
  npp: z.coerce.number().int(),
  claimsCount: z.number().int().nonnegative(),
  creditor: z.string().nullable(),
  claimTransfer: z.string().nullable(), // TODO: сделать enum

  lastOpId: z.coerce.number().int().nonnegative().nullable(),
  lastOpTypeId: z.coerce.number().int().nonnegative().nullable(),
  lastOpTypeName: z.string().nullable(),
  lastOpDate: z.string().datetime().nullable().default(null), // ISO 8601 date string

  problems: z.array(z.enum(equityObjectProblemsValues)).default([]),

  unom: z.number().int().nonnegative().nullable(),
  unkv: z.string().nullable(),
  rooms: z.number().int().nonnegative().nullable(),
  floor: z.number().int().nullable(),
  s: z.number().nonnegative().nullable(),

  egrnStatus: z.string().nullable(),

  needsOpinion: z.boolean(),
  // TBD - show opinion result
  opinionUrgp: z.enum(equityObjectOpinionsValues).default('нет'),
  opinionUpozh: z.enum(equityObjectOpinionsValues).default('нет'),
  opinionUork: z.enum(equityObjectOpinionsValues).default('нет'),
  opinionUpozi: z.enum(equityObjectOpinionsValues).default('нет'),
  // opinionUrgp: z.boolean(),
  // opinionUpozh: z.boolean(),
  // opinionUork: z.boolean(),
  // opinionUpozi: z.boolean(),

  documentsFio: z.string().nullable(),
  documentsDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  transferDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  claimRegistryDate: z.string().datetime().nullable().default(null), // ISO 8601 date string

  documentsOk: z.boolean(),
  documentsProblem: z.boolean(),
  operationsFio: z.string().nullable(),
});
export type EquityObject = z.infer<typeof equityObjectSchema>;

export const egrnDetailsSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  status: z.string().nullable(),
  titleNum: z.string().nullable(),
  titleDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  holderName: z.string().nullable(),
  holderType: z.string().nullable(),
});
export type EgrnDetails = z.infer<typeof egrnDetailsSchema>;

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
