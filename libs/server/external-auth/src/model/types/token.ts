import { ExternalSystem } from '@urgp/server/database';

export type EdoTokenData = {
  dnsid: string;
  authToken: string;
};

export type RsmTokenData = {
  rsmCookie: string;
};

export type ExternalTokenData = EdoTokenData | RsmTokenData;

export type EternalAuthData = {
  system: ExternalSystem;
  // credentials?: DbExternalCredentials;
  token: ExternalTokenData;
  isOld?: boolean;
};
