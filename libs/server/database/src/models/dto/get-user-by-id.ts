import { z } from 'zod';

export const getUserById = z
  .object({
    id: z.coerce.number(),
    edoId: z.coerce.number(),
  })
  .partial();
//   .refine(({ id, edoId }) => id !== undefined || edoId !== undefined, {
//     message: 'One of the Ids must be defined',
//   });

export type GetUserByIdtDto = z.infer<typeof getUserById>;
