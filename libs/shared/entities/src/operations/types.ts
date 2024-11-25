import { BasicPayloadData, ExternalCase, TypeInfo } from '../userInput/types';

type OperationPayload = {
  type: TypeInfo;
  externalCase?: ExternalCase; // внешний номер
  description: string; // собственно описание проблемы
} & BasicPayloadData;

export type Operation = {
  id: number;
  createdAt: Date;
  authorId: number;
  payload: OperationPayload; // возвращаем только последний пейлоуд, а вообще тут массив
};
