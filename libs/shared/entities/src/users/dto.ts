import { z } from 'zod';

export const createUser = z.object({
  login: z.string(),
  password: z
    .string()
    .min(3, { message: 'Пароль должен быть не менее 3-х символов' }),
  fio: z.string().optional(),
});

export const getUserById = z.object({
  id: z.coerce.number(),
});

export const getUserByLogin = z.object({
  login: z.string(),
});

export const deleteUser = z.object({
  id: z.coerce.number(),
});

export const authUser = z.object({
  login: z.string(),
  password: z.string().min(3),
});

export const changePassword = z.object({
  id: z.coerce.number(),
  oldPassword: z.string(),
  password: z
    .string()
    .min(3, { message: 'Пароль должен быть не менее 3-х символов' }),
});

export const changePasswordFormValues = changePassword
  .extend({
    passwordConfirmation: z.string(),
  })
  .refine((val) => val.password === val.passwordConfirmation, {
    message: 'Пароли должны совпадать',
    path: ['passwordConfirmation'],
  });

export const resetPassword = z.object({
  id: z.coerce.number(),
  password: z
    .string()
    .min(3, { message: 'Пароль должен быть не менее 3-х символов' }),
});

// export const getUserTokens = z.object({
//   id: z.coerce.number(),
//   login: z.string(),
// })

export const updateUser = createUser.partial();

export type CreateUserDto = z.infer<typeof createUser>;
export type GetUserByIdDto = z.infer<typeof getUserById>;
export type GetUserByLoginDto = z.infer<typeof getUserByLogin>;
export type UpdateUserDto = z.infer<typeof updateUser>;
export type DeleteUserDto = z.infer<typeof deleteUser>;
export type AuthUserDto = z.infer<typeof authUser>;
export type ChangeUserPasswordDto = z.infer<typeof changePassword>;
export type ResetUserPasswordDto = z.infer<typeof resetPassword>;
export type ChangeUserPasswordFormValues = z.infer<
  typeof changePasswordFormValues
>;
