import { format } from 'date-fns';
import { z } from 'zod';

// const sortingOption = z.object({
//   id: z.string(),
//   desc: z.boolean(),
// });

export const getOldBuldings = z
  .object({
    limit: z.coerce.number().min(1).default(500).or(z.literal('ALL')),
    offset: z.coerce.number().min(0).default(0),
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
    relocationType: z
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
      .or(z.number().array()),
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
    status: z.number().array(),
    dificulty: z.number().array(),
    startFrom: z.coerce
      .date()
      .transform((value) => format(value, 'yyyy-MM-dd')),
    startTo: z.coerce.date().transform((value) => format(value, 'yyyy-MM-dd')),
    control: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),
  })
  .partial();

export const oldBuildingsPageSearch = getOldBuldings
  .omit({ offset: true })
  .extend({
    selectedBuildingId: z.coerce.number().optional(),
    apartment: z.coerce.number().optional(),
    tab: z.literal('terms').or(z.literal('newBuildings')).optional(),
  });

export const relocationMapPageSerch = z.object({
  selectedBuildingId: z.coerce.number().optional(),
  selectedPlotId: z.coerce.number().optional(),
  apartment: z.coerce.number().optional(),
  tab: z.literal('terms').or(z.literal('newBuildings')).optional(),
  expanded: z.boolean().default(false),
});

export type GetOldBuldingsDto = z.infer<typeof getOldBuldings>;
export type OldBuildingsPageSearch = z.infer<typeof oldBuildingsPageSearch>;
export type RelocationMapPageSerch = z.infer<typeof relocationMapPageSerch>;
