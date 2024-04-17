import { z } from 'zod';

// ========= СУЩНОСТИ =============

// Собственно, внешние системы, в которые мы входим
const externalSystem = z
  .union([z.literal('EDO'), z.literal('RSM')])
  .default('EDO');
export type ExternalSystem = z.infer<typeof externalSystem>;

// Credentials - данные для непосредственного входа во внешние системы. Получаем из БД или с клиента
const credentialsCommpn = z.object({
  userId: z.number(),
  orgId: z.array(z.number()).nullable().default(null),
  password: z.string(),
  name: z.string().nullable().optional(),
  groupId: z
    .union([z.number(), z.string()])
    .optional()
    .pipe(z.coerce.number().default(21)),
});

export const edoCredentials = credentialsCommpn.extend({
  system: z.literal('EDO'),
  login: z
    .union([z.number(), z.string().regex(/^\d+$/)])
    .pipe(z.coerce.string()),
});

export const rsmCredentials = credentialsCommpn.extend({
  system: z.literal('RSM'),
  login: z.string(),
});

export const externalCredentials = z.discriminatedUnion('system', [
  edoCredentials,
  rsmCredentials,
]);

export type EdoCredentials = z.input<typeof edoCredentials>;
export type RsmCredentials = z.input<typeof rsmCredentials>;
export type ExternalCredentials = z.input<typeof externalCredentials>;

// Token - полученные после авторизации во внешней системе данные для запросов
const edoToken = z.object({
  dnsid: z.string(),
  authToken: z.string(),
});
const rsmToken = z.object({
  rsmCookie: z.string(),
});
const externalToken = edoToken.or(rsmToken);

export type EdoToken = z.input<typeof edoToken>;
export type RsmToken = z.input<typeof rsmToken>;
export type ExternalToken = z.input<typeof externalToken>;

// Session - данные сохранённой сессии с токеном
const generalSessionInfo = z.object({
  userId: z.number(),
  orgId: z.array(z.number()).nullable().default(null),
  createdAt: z.date().default(new Date()),
  isFresh: z.boolean().default(false),
});

export const edoSessionInfo = generalSessionInfo.extend({
  system: z.literal('EDO'),
  token: edoToken,
});

export const rsmSessionInfo = generalSessionInfo.extend({
  system: z.literal('RSM'),
  token: rsmToken,
});

export const externalSessionInfo = z.discriminatedUnion('system', [
  edoSessionInfo,
  rsmSessionInfo,
]);

export type EdoSessionInfo = z.input<typeof edoSessionInfo>;
export type RsmSessionInfo = z.input<typeof rsmSessionInfo>;
export type ExternalSessionInfo = z.input<typeof externalSessionInfo>;

// ========= ОПЕРАЦИИ =============

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
    name: z.string().nullable().optional(),
  }),
);
export type FindOrCreateSessionDto = z.input<typeof findOrCreateSessionDto>;

// Логин по заданным креденшиалам и ID юзера
export const createSessionFromCredentialsDto = z
  .object({
    refresh: z.boolean().default(false),
    // userId: z.coerce.number(),
    orgId: z.coerce.number().nullable().default(null),
    name: z.string().nullable().optional(),
  })
  .and(externalCredentials);
export type CreateSessionFromCredentialsDto = z.input<
  typeof createSessionFromCredentialsDto
>;

// Самый общий запрос на получение аутентификации
export const authRequestDto = z.union([
  findOrCreateSessionDto,
  createSessionFromCredentialsDto,
]);

export type AuthRequestDto = z.input<typeof authRequestDto>;
