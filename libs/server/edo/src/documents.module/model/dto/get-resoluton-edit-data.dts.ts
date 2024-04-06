import { z } from 'zod';

export const getResolutionEditDataSchema = z.object({
  id: z.coerce.number().optional(),
  documentId: z.coerce.number(),
});

export type GetResolutionEditDataDto = z.infer<
  typeof getResolutionEditDataSchema
>;
