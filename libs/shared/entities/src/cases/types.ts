import {
  BasicPayloadData,
  ExternalCase,
  TypeInfo,
  UserInfo,
} from '../userInput/types';

type CasePayloadSlim = {
  externalCases: ExternalCase[]; // связанные номера
  type: number; // тип дела
  directions: number[]; // направления работы
  problems: number[]; // системные проблемы
  description: string; // собственно описание проблемы
  fio: string;
  adress: string | null;
  approver: UserInfo;
  approveBy: UserInfo;
  updatedBy: UserInfo;
} & BasicPayloadData;

type CasePayload = Omit<
  CasePayloadSlim,
  'type' | 'directions' | 'problems' | 'approver' | 'approveBy' | 'updatedBy'
> & {
  type: TypeInfo;
  directions: TypeInfo[];
  problems: TypeInfo[];
  approver: UserInfo;
  approveBy: UserInfo;
  updatedBy: UserInfo;
};

export type Case = {
  id: number;
  class: string;
  createdAt: Date;
  status: TypeInfo;
  author: UserInfo;
  payload: CasePayload; // возвращаем только последний пейлоуд, а вообще тут массив
};

export type CaseSlim = Omit<Case, 'payload' | 'author'> & {
  authorId: number;
  payload: CasePayloadSlim;
};
