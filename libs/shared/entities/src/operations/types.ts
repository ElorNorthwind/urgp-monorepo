import { BasicPayloadData, ExternalCase, TypeInfo } from '../userInput/types';

type OperationPayload = {
  type: TypeInfo;
  externalCase: ExternalCase | null; // внешний номер
  description: string | null; // описание этапа
} & BasicPayloadData;

export type Operation = {
  id: number;
  caseId: number | null;
  problemId: number | null;
  createdAt: Date;
  authorId: number;
  payload: OperationPayload; // возвращаем только последний пейлоуд, а вообще тут массив
};
