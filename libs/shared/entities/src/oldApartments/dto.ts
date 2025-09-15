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
  })
  .extend({
    fio: z.string().optional(),
    buildingIds: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.coerce.number().array())
      .or(z.coerce.number().array()),
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
