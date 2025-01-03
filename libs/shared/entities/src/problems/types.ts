import { BasicPayloadDataSlim, TypeInfo } from '../userInput/types';

type ProblemPayload = {
  shortName: string;
  directions: TypeInfo[]; // направления работы
  description: string; // собственно описание проблемы
} & BasicPayloadDataSlim;

export type Problem = {
  id: number;
  createdAt: Date;
  authorId: number;
  payload: ProblemPayload; // возвращаем только последний пейлоуд, а вообще тут массив
};
