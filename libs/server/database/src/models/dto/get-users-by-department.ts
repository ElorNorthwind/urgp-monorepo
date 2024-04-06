import { z } from 'zod';

export const getUsersByDepartment = z.object({
  uprId: z.coerce.number().optional(),
});

export type GetUsersByDepartmentDto = z.infer<typeof getUsersByDepartment>;
