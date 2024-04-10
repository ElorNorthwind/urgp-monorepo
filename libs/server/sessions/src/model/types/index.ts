export type EdoTokenData = {
  dnsid: string;
  authToken: string;
};

export type RsmTokenData = {
  rsmCookie: string;
};

export type ExternalTokenData = EdoTokenData | RsmTokenData;

export type ExternalSystem = 'EDO' | 'RSM';

type GeneralSessionInfo = {
  userId?: number;
  orgId?: number;
  createdAt?: Date;
};

export type EdoSessionInfo = GeneralSessionInfo & {
  system: 'EDO';
  accessdata: EdoTokenData;
};

export type RsmSessionInfo = GeneralSessionInfo & {
  system: 'RSM';
  accessdata: RsmTokenData;
};

export type ExternalSessionInfo = EdoSessionInfo | RsmSessionInfo;
