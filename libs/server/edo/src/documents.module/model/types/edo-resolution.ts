import { EdoUserInfo } from './edo-document';

export type EdoResolution = {
  id: string;
  utv?: boolean;
  level?: number;
  author?: EdoUserInfo;
  createdAt?: Date;
  behalfText?: string;
  isCanceled?: boolean;
  isVzamen?: boolean;
  orders?: EdoResolutionOrder[];
  parent?: string;
};

export type EdoResolutionOrder = {
  id?: string;
  questionId?: number;
  questionText?: string;
  resText?: string;
  toUsers?: EdoResolutionOrderToUser[];
};

export type EdoResolutionOrderToUser = {
  id?: string;
  user?: EdoUserInfo;
  plus?: boolean;
  redControl?: boolean;
  execDate?: Date;
  doneDate?: Date;
  changedDate?: Date;
};
