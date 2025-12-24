import { z } from 'zod';

export const getDocumentsByUserSchema = z.object({
  userid: z.coerce.number(),
  fullLinks: z.coerce.boolean().optional(),
  skipNumbers: z.string().optional(),
});

export type GetDocumentsByUserDto = z.infer<typeof getDocumentsByUserSchema>;
