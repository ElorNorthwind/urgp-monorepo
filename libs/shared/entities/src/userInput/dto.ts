import { z } from 'zod';

export const approveControlEntitySchema = z.object({
  id: z.coerce.number(),
  approveStatus: z
    .enum(['project', 'approved', 'pending', 'rejected'])
    .default('project'),
  approveNotes: z.string().nullable().optional(),
  approveToId: z.coerce.number().nullable(),
  dueDate: z.string().datetime().nullable().optional(),
});
export type ApproveControlEntityDto = z.infer<
  typeof approveControlEntitySchema
>;

export const approveControlEntityFormSchema = z.object({
  nextApproverId: z.coerce.number().nullable(),
  approveNotes: z.string().optional(),
  dueDate: z.coerce
    .date()
    .or(z.number())
    .or(z.string().date())
    .nullable()
    .optional(),
});
export type ApproveControlEntityFormDto = z.infer<
  typeof approveControlEntityFormSchema
>;

// удаление сущности по id
export const deleteControlEntirySchema = z.object({
  id: z.coerce.number(),
});
export type DeleteControlEntityDto = z.infer<typeof deleteControlEntirySchema>;
