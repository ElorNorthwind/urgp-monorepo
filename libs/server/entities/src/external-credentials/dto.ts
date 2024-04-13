import { z } from 'zod';

// Собственно, внешние системы, в которые мы входим
// const externalSystem = z.literal('EDO').or(z.literal('RSM')).default('EDO');
const externalSystem = z
  .union([z.literal('EDO'), z.literal('RSM')])
  .default('EDO');
export type ExternalSystem = z.infer<typeof externalSystem>;

// Credentials - данные для непосредственного входа во внешние системы. Получаем из БД или с клиента
export const edoCredentials = z.object({
  system: z.literal('EDO'),
  login: z
    .union([z.number(), z.string().regex(/^\d+$/)])
    .pipe(z.coerce.string()),
  password: z.string(),
  groupid: z
    .union([z.number(), z.string()])
    .optional()
    .pipe(z.coerce.number().default(21)),
  name: z.string().nullable().optional(),
});
export const rsmCredentials = z.object({
  system: z.literal('RSM'),
  login: z.string(),
  password: z.string(),
  groupid: z.null().optional(),
  name: z.string().nullable().optional(),
});
export const externalCredentials = edoCredentials.or(rsmCredentials);

export type EdoCredentials = z.input<typeof edoCredentials>;
export type RsmCredentials = z.input<typeof rsmCredentials>;
export type ExternalCredentials = z.input<typeof externalCredentials>;

// поиск Credentials в БД, поиск сессии
export const findSessionDto = z
  .object({
    system: externalSystem,
    userId: z.coerce.number().nullable().default(null),
    orgId: z.coerce.number().nullable().default(null),
  })
  .transform((data) =>
    !data.userId && !data.orgId
      ? { system: data.system, userId: null, orgId: 0 }
      : data,
  );
export type FindSessionDto = z.input<typeof findSessionDto>;

// Логин или поиск сессии по данным сервера
export const findOrCreateSessionDto = findSessionDto.and(
  z.object({
    refresh: z.boolean().default(false),
    login: z.never().optional(),
    password: z.never().optional(),
  }),
);
export type FindOrCreateSessionDto = z.input<typeof findOrCreateSessionDto>;

// Логин по заданным креденшиалам и ID юзера
export const createSessionFromCredentialsDto = z
  .object({
    userId: z.coerce.number(),
    orgId: z.coerce.number().nullable().default(null),
  })
  .and(externalCredentials);
export type CreateSessionFromCredentialsDto = z.input<
  typeof createSessionFromCredentialsDto
>;

// Самый общий запрос на получение аутентификации
export const authRequestDto = findOrCreateSessionDto.or(
  createSessionFromCredentialsDto,
);
export type AuthRequestDto = z.input<typeof authRequestDto>;
