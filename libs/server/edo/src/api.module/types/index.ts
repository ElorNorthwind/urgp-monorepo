import { ClsStore } from 'nestjs-cls';

export type EdoSessonLookupRequest = {
  password?: string; // never used, but hey, we won't throw if it's here (на самом деле я просто не могу сделать нормальный union без него)
  groupid?: string;
  uprid?: string;
  userid?: string;
  forceNewSession?: boolean;
};

export type EdoSessonLoginRequest = {
  userid: string;
  password: string;
  forceNewSession?: boolean;
};

export type EdoAuthTokenRequest = {
  userid: string;
  password: string;
  dnsid: string;
  groupid?: string;
};

export interface EdoClsStore extends ClsStore {
  // edo?: EdoSessonLookupRequest & { sessionIsNew?: boolean };
  edo?: {
    password?: string;
    groupid?: string;
    uprid?: string;
    userid?: string;
    forceNewSession?: boolean;
    sessionIsNew?: boolean;
  };
}

export type EdoClsStoreTemp = {
  edo?: {
    password?: string;
    groupid?: string;
    uprid?: string;
    userid?: string;
    forceNewSession?: boolean;
    sessionIsNew?: boolean;
  };
};

export type EdoSessionAuthData = {
  dnsid: string;
  authToken: string;
  userid: string;
};

type EdoSessionDate = {
  createdAt: Date;
};

export type EdoSession = EdoSessionAuthData & EdoSessionDate;
