import { z } from 'zod';

export const userInputApprove = z.object({
  id: z.coerce.number(),
  approveStatus: z
    .literal('pending')
    .or(z.literal('approved'))
    .or(z.literal('rejected')),
  approveNotes: z.string().nullable().optional(),
});
export type UserInputApproveDto = z.infer<typeof userInputApprove>;

export const userInputApproveFormValues = z.object({
  approveNotes: z.string().optional(),
});
export type UserInputApproveFormValuesDto = z.infer<
  typeof userInputApproveFormValues
>;

// удаление сущности по id
export const userInputDelete = z.object({
  id: z.coerce.number(),
});
export type UserInputDeleteDto = z.infer<typeof userInputDelete>;
