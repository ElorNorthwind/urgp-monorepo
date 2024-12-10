import {
  BasicPayloadData,
  ExternalCase,
  TypeInfo,
  UserInfo,
} from '../userInput/types';

type CasePayload = {
  externalCases: ExternalCase[]; // связанные номера
  type: TypeInfo; // тип дела
  directions: TypeInfo[]; // направления работы
  problems: TypeInfo[]; // системные проблемы
  description: string; // собственно описание проблемы
  fio: string;
  adress: string | null;
} & BasicPayloadData;

type CasePayloadSlim = Omit<CasePayload, 'type' | 'directions' | 'problems'> & {
  type: number;
  directions: number[];
  problems: number[];
};

export type Case = {
  id: number;
  createdAt: Date;
  status: TypeInfo;
  author: UserInfo;
  payload: CasePayload; // возвращаем только последний пейлоуд, а вообще тут массив
};

export type CaseSlim = Omit<Case, 'payload' | 'author'> & {
  authorId: number;
  payload: CasePayloadSlim;
};
