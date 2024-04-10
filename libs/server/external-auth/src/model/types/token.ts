import { ExternalSystem, GetCredentialsDto } from '@urgp/server/database';

export type EdoTokenData = {
  dnsid: string;
  authToken: string;
};

export type RsmTokenData = {
  rsmCookie: string;
};

export type ExternalTokenData = EdoTokenData | RsmTokenData;

// move to a zod dto?
export type ExternalAuthDataRequest = GetCredentialsDto & {
  login?: string;
  password?: string;
  refresh?: boolean;
};

export type EternalAuthData = {
  system: ExternalSystem;
  token: ExternalTokenData;
  isOld?: boolean;
};
