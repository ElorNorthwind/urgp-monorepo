import { BasicPayloadData, ExternalCase, TypeInfo } from '../userInput/types';

type CasePayload = {
  externalCases: ExternalCase[]; // связанные номера
  type: TypeInfo; // тип дела
  directions: TypeInfo[]; // направления работы
  problems: TypeInfo[]; // системные проблемы
  description: string; // собственно описание проблемы
  fio: string;
  adress: string | null;
} & BasicPayloadData;

export type Case = {
  id: number;
  createdAt: Date;
  authorId: number;
  payload: CasePayload; // возвращаем только последний пейлоуд, а вообще тут массив
};
