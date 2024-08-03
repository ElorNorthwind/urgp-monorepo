import { z } from 'zod';

export const createUser = z.object({
  login: z.string(),
  password: z.string().min(3),
  fio: z.string().optional(),
});

export const getUserById = z.object({
  id: z.coerce.number(),
});

export const getUserByLogin = z.object({
  login: z.string(),
});

export const updateUser = createUser.partial();

export type CreateUserDro = z.infer<typeof createUser>;
export type GetUserByIdDto = z.infer<typeof getUserById>;
export type GetUserByLoginDto = z.infer<typeof getUserByLogin>;
export type UpdateUserDto = z.infer<typeof updateUser>;
