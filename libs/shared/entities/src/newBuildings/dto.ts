import { format } from 'date-fns';
import { z } from 'zod';

export const newBuildingsSearchSchema = z
  .object({
    okrugs: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),
    districts: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),
    relocationAge: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),
    relocationStatus: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),
    deviation: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),
    sortingKey: z.string(),
    sortingDirection: z.string(),
    adress: z.string(),
    startFrom: z.coerce
      .date()
      .transform((value) => format(value, 'yyyy-MM-dd')),
    startTo: z.coerce.date().transform((value) => format(value, 'yyyy-MM-dd')),
    selectedBuildingId: z.coerce.number().optional(),
    apartment: z.coerce.number().optional(),
    tab: z.literal('terms').or(z.literal('newBuildings')).optional(),
  })
  .partial();
export type NewBuildingsSearch = z.infer<typeof newBuildingsSearchSchema>;
