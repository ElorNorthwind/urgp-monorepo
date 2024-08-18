import { z } from 'zod';
import { getOldBuldings } from '../oldBuildings/dto';

export const getOldApartments = getOldBuldings
  .pick({
    limit: true,
    offset: true,
    okrugs: true,
    districts: true,
  })
  .extend({
    fio: z.string().optional(),
    buildingIds: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.coerce.number().array())
      .or(z.coerce.number().array()),
  })
  .partial();

export const oldApartmetsSearch = getOldApartments
  .omit({ offset: true })
  .extend({
    apartment: z.coerce.number().nullable().optional(),
  });

export type GetOldAppartmentsDto = z.infer<typeof getOldApartments>;
export type OldApartmentSearch = z.infer<typeof oldApartmetsSearch>;
