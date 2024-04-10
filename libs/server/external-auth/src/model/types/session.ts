import { EdoTokenData, RsmTokenData } from './token';

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
