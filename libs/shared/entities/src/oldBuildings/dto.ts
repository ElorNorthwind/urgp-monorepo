import { z } from 'zod';

export const getOldBuldings = z
  .object({
    limit: z.coerce.number().min(1).default(500).or(z.literal('ALL')),
    offset: z.coerce.number().min(0).default(0),
    okrug: z.string(),
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
    MFRInvolvment: z
      .string()
      .transform((value) => value.split(','))
      .pipe(z.string().array())
      .or(z.string().array()),
    noMFR: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .or(z.boolean().default(false)),
    adress: z.string(),
    status: z.number().array(),
    dificulty: z.number().array(),
  })
  .partial();

export type GetOldBuldingsDto = z.infer<typeof getOldBuldings>;
