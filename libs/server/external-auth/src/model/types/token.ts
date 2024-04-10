export type EdoTokenData = {
  dnsid: string;
  authToken: string;
};

export type RsmTokenData = {
  rsmCookie: string;
};

export type ExternalTokenData = EdoTokenData | RsmTokenData;
