// Token - полученные после авторизации во внешней системе данные для запросов

export type EdoTokenData = {
  dnsid: string;
  authToken: string;
};

export type RsmTokenData = {
  rsmCookie: string;
};

export type ExternalToken = EdoTokenData | RsmTokenData;

// Session - данные сохранённой сессии с токеном

export type GeneralSessionInfo = {
  userId: number;
  orgId?: number;
  createdAt?: Date;
};

export type EdoSessionInfo = GeneralSessionInfo & {
  system: 'EDO';
  token: EdoTokenData;
};

type RsmSessionInfo = GeneralSessionInfo & {
  system: 'RSM';
  token: RsmTokenData;
};

export type ExternalSessionInfo = EdoSessionInfo | RsmSessionInfo;
