import {
  ApproveStatus,
  CaseClasses,
  GET_DEFAULT_CONTROL_DUE_DATE,
} from '../userInput/config';
import { ExternalCase } from '../userInput/types';
import { CaseFormDto } from './dto';
import { CaseFull } from './types';

export const emptyIncident = {
  id: 0,
  class: CaseClasses.incident,
  typeId: 4,
  approveToId: null,
  approveStatus: ApproveStatus.project,
  approveDate: null,
  approveNotes: null,
  externalCases: [
    {
      system: 'NONE',
      num: '',
      date: new Date().toISOString(),
    } as ExternalCase,
  ],
  directionIds: [],
  title: '',
  notes: '',
  extra: '',
  dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
  connectionsToIds: [],
  connectionsFromIds: [],
} as CaseFormDto;

export const emptyProblem = {
  id: 0,
  class: CaseClasses.problem,
  typeId: 5,
  approveToId: null,
  approveStatus: ApproveStatus.project,
  approveDate: null,
  approveNotes: null,
  externalCases: [],
  directionIds: [],
  title: '',
  notes: '',
  extra: '',
  dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
  connectionsToIds: [],
  connectionsFromIds: [],
} as CaseFormDto;

export const getFormDataFromCaseFull = (payload: CaseFull) => {
  return {
    id: payload?.id,
    authorId: payload?.author?.id,
    class: payload?.class,
    typeId: payload?.type?.id,
    externalCases: payload?.externalCases.map((ec) => ({
      ...ec,
      date: ec?.date ? new Date(ec.date).toISOString() : null,
    })),
    directionIds: payload?.directions?.map((d) => d?.id) || [],
    title: payload?.title || '', // fio
    notes: payload?.notes || '', // descrition
    extra: payload?.extra || '', // adress
    approveToId: payload?.approveTo?.id,
    approveStatus: payload?.approveStatus,
    approveDate: payload?.approveDate
      ? new Date(payload?.approveDate).toISOString()
      : null,
    approveNotes: payload?.approveNotes,
    dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
    connectionsToIds: payload?.connectionsTo?.map((p) => p?.id) || [],
    connectionsFromIds: payload?.connectionsFrom?.map((p) => p?.id) || [],
  };
};
