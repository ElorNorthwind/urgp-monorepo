import {
  BasicPayloadDataSlim,
  ExternalCase,
  TypeInfo,
  UserInfo,
} from '../userInput/types';

type CasePayloadSlim = {
  externalCases: ExternalCase[]; // связанные номера
  typeId: number; // тип дела
  directionIds: number[]; // направления работы
  problemIds: number[]; // системные проблемы
  description: string; // собственно описание проблемы
  fio: string;
  adress: string | null;
} & BasicPayloadDataSlim;

type CasePayload = Omit<
  CasePayloadSlim,
  | 'typeId'
  | 'directionIds'
  | 'problemIds'
  | 'approverId'
  | 'approveById'
  | 'updatedById'
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
