import {
  ApproveStatus,
  CaseClasses,
  GET_DEFAULT_CONTROL_DUE_DATE,
} from '../userInput/config';
import { ExternalCase } from '../userInput/types';
import { CaseFormDto } from './dto';

export const emptyCase = {
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
} as CaseFormDto;
