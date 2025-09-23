import { z } from 'zod';
import { getOldBuldings } from '../oldBuildings/dto';

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

export const getOldApartments = getOldBuldings
  .pick({
    limit: true,
    offset: true,
    okrugs: true,
    districts: true,
    deviation: true,
    relocationType: true,
    relocationStatus: true,
    relocationAge: true,
  })
  .extend({
    fio: z.string().optional(),
    buildingIds: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.coerce.number().array())
      .or(z.coerce.number().array()),
    buildingDeviation: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),
    stage: queryNumberArray.optional(),
  })
  .partial();

export const oldApartmetsSearch = getOldApartments
  .omit({ offset: true })
  .extend({
    apartment: z.coerce.number().nullable().optional(),
    stage: queryNumberArray.optional(),
  });

export type GetOldAppartmentsDto = z.infer<typeof getOldApartments>;
export type OldApartmentSearch = z.infer<typeof oldApartmetsSearch>;

export const specialApartmentsSearchSchema = getOldBuldings
  .pick({
    okrugs: true,
    districts: true,
    deviation: true,
  })
  .extend({
    fio: z.string().optional(),
    apartment: z.coerce.number().nullable().optional(),
  })
  .partial();
export type SpecialApartmentSearch = z.infer<
  typeof specialApartmentsSearchSchema
>;

export const apartmentDefectData = z.object({
  unom: z.number(),
  apartmentNum: z.string(),
  // complaintDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  // entryDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  // changedDoneDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  // actualDoneDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  complaintDate: z.string().nullable().default(null),
  entryDate: z.string().nullable().default(null),
  changedDoneDate: z.string().nullable().default(null),
  actualDoneDate: z.string().nullable().default(null),
  isDone: z.coerce.boolean().nullable().default(null),
  description: z.string().nullable().default(null),
  url: z.string().nullable().default(null),
});
export type ApartmentDefectData = z.infer<typeof apartmentDefectData>;

export const addDefectDataSchema = z.object({
  defects: z.array(apartmentDefectData),
});
export type AddDefectDataDto = z.infer<typeof addDefectDataSchema>;
