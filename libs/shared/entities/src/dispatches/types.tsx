import { TypeInfo } from '../userInput/types';

type CaseDispatchInfo = {
  caseId: number;
  problemId: never;
};
type ProblemDispatchInfo = {
  caseId: never;
  problemId: number;
};

type DispatchPayload = {
  updatedAt: Date;
  isDeleted: boolean;
  executorId: number;
  type: TypeInfo;
  dueDate: Date | null;
  doneDate: Date | null;
  firstSeen: Date | null;
  lastSeen: Date | null;
  notes: string | null;
};

export type Dispatch = (CaseDispatchInfo | ProblemDispatchInfo) & {
  id: number;
  createdAt: Date;
  authorId: number;
  payload: DispatchPayload; // возвращаем только последний пейлоуд, а вообще тут массив
};
