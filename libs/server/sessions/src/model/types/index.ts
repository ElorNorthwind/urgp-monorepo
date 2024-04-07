export type EdoCredentials = {
  dnsid: string;
  authToken: string;
};

export type RsmCredentials = {
  rsmCookie: string;
};

export type ExternalCredentials = EdoCredentials | RsmCredentials;

export type ExternalSystem = 'EDO' | 'RSM';

type GeneralSessionInfo = {
  userId?: number;
  orgId?: number;
  createdAt?: Date;
};

export type EdoSessionInfo = GeneralSessionInfo & {
  system: 'EDO';
  credentials: EdoCredentials;
};

export type RsmSessionInfo = GeneralSessionInfo & {
  system: 'RSM';
  credentials: RsmCredentials;
};

export type ExternalSessionInfo = EdoSessionInfo | RsmSessionInfo;
