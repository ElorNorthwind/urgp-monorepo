import { TypeInfo } from '../userInput/types';

// type CaseDispatchInfo = {
//   caseId: number;
//   problemId: never;
// };
// type ProblemDispatchInfo = {
//   caseId: never;
//   problemId: number;
// };

type DispatchPayload = {
  updatedAt: Date;
  isDeleted: boolean;
  executorId: number;
  type: TypeInfo;
  dueDate: Date | null;
  doneDate: Date | null;
  firstSeen: Date | null;
  lastSeen: Date | null;
  description: string | null;
};

export type Dispatch = {
  id: number;
  caseId: number | null;
  problemId: number | null;
  createdAt: Date;
  authorId: number;
  payload: DispatchPayload; // возвращаем только последний пейлоуд, а вообще тут массив
};
