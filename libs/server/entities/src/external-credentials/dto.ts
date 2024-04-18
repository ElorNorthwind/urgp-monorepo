import { z } from 'zod';

// Собственно, внешние системы, в которые мы входим
const externalSystem = z
  .union([z.literal('EDO'), z.literal('RSM')])
  .default('EDO');
export type ExternalSystem = z.infer<typeof externalSystem>;

// ========  SessionInfo -  Базовая маркировка сессии ========
export const externalSessionInfo = z.object({
  system: externalSystem,
  userId: z.number().nullable().default(null),
  orgId: z.number().array().nullable().default(null),
});
export type ExternalSessionInfo = z.infer<typeof externalSessionInfo>;

// ========  Lookup - набор данных для поиска сессии или креденшиалов в БД ========
export const externalLookup = z
  .object({
    system: externalSystem,
    userId: z.number().nullable().default(null),
    orgId: z.number().nullable().default(null),
  })
  .transform((session) =>
    !session.userId && !session.orgId
      ? { system: session.system || 'EDO', userId: null, orgId: 0 }
      : session,
  );
export type ExternalLookup = z.input<typeof externalLookup>;
export type ExternalLookupResult = z.infer<typeof externalLookup>;

// ========  Credentials - логин и пароль для входа в систему (из нашей БД или от клиента) ========
export const externalCredentials = z.object({
  login: z.coerce.string(),
  password: z.string(),
  groupId: z.coerce.number().default(21),
  name: z.string().optional(),
});
export const externalCredentialsWithSystem = externalCredentials.and(
  z.object({ system: externalSystem }),
);
export type ExternalCredentials = z.input<typeof externalCredentials>;
export type ExternalCredentialsWithSystem = z.input<
  typeof externalCredentialsWithSystem
>;

// ========  Token - результат входа в систему ========
export const edoToken = z.object({
  dnsid: z.string(),
  authToken: z.string(),
});
export const rsmToken = z.object({
  rsmCookie: z.string(),
});
export const externalToken = z.union([edoToken, rsmToken]);
export type EdoToken = z.infer<typeof edoToken>;
export type RsmToken = z.infer<typeof rsmToken>;
export type ExternalToken = z.infer<typeof externalToken>;

// Полная сессия
export const edoFullSession = externalSessionInfo.omit({ system: true }).merge(
  z.object({
    system: z.literal('EDO'),
    credentials: externalCredentials,
    token: edoToken,
    createdAt: z.coerce.date().default(new Date()),
  }),
);

export const rsmFullSession = externalSessionInfo.omit({ system: true }).merge(
  z.object({
    system: z.literal('RSM'),
    credentials: externalCredentials,
    token: rsmToken,
    createdAt: z.coerce.date().default(new Date()),
  }),
);

export const externalFullSession = z.discriminatedUnion('system', [
  edoFullSession,
  rsmFullSession,
]);
export type ExternalFullSession = z.infer<typeof externalFullSession>;
export type ExternalFullSessionInput = z.input<typeof externalFullSession>;

export const externalFullSessionReturnValue = externalFullSession.and(
  z.object({
    isFresh: z.boolean().default(false),
  }),
);
export type ExternalFullSessionReturnValue = z.infer<
  typeof externalFullSessionReturnValue
>;

// Полный запрос на залогинивание или поиск сессии
export const externalAuthRequest = z.object({
  lookup: externalLookup.optional(),
  credentials: externalCredentials.optional(),
  refresh: z.boolean().default(false),
});
export type ExternalAuthRequest = z.input<typeof externalAuthRequest>;
