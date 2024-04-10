import { EdoTokenData, RsmTokenData } from './token';

type GeneralSessionInfo = {
  userId: number;
  orgId?: number;
  createdAt?: Date;
};

export type EdoSessionInfo = GeneralSessionInfo & {
  system: 'EDO';
  token: EdoTokenData;
};

export type RsmSessionInfo = GeneralSessionInfo & {
  system: 'RSM';
  token: RsmTokenData;
};

export type ExternalSessionInfo = EdoSessionInfo | RsmSessionInfo;
