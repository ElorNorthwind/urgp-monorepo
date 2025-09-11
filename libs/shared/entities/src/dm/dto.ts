import { z } from 'zod';

export const dmDateRangeQuerySchema = z.object({
  from: z
    .string()
    .regex(/\d{2}.\d{2}.\d{4}/, {
      message: 'Некорректная дата',
    })
    .optional(),
  to: z
    .string()
    .regex(/\d{2}.\d{2}.\d{4}/, {
      message: 'Некорректная дата',
    })
    .optional(),
});
export type DmDateRangeQuery = z.infer<typeof dmDateRangeQuerySchema>;
