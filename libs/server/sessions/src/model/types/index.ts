export type EdoAccessData = {
  dnsid: string;
  authToken: string;
};

export type RsmAccessData = {
  rsmCookie: string;
};

export type ExternalAccessData = EdoAccessData | RsmAccessData;

export type ExternalSystem = 'EDO' | 'RSM';

type GeneralSessionInfo = {
  userId?: number;
  orgId?: number;
  createdAt?: Date;
};

export type EdoSessionInfo = GeneralSessionInfo & {
  system: 'EDO';
  accessdata: EdoAccessData;
};

export type RsmSessionInfo = GeneralSessionInfo & {
  system: 'RSM';
  accessdata: RsmAccessData;
};

export type ExternalSessionInfo = EdoSessionInfo | RsmSessionInfo;
