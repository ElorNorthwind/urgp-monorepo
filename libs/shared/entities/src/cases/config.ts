import {
  ApproveStatus,
  CaseClasses,
  GET_DEFAULT_CONTROL_DUE_DATE,
} from '../userInput/config';
import { ExternalCase } from '../userInput/types';

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
};

// + Server side values:
// authorId: 1,
// updatedById: 1,
// approveFromId: 1,
// createdAt: '2024-12-04T08:26:56.000Z',
// updatedAt: '2025-01-17T16:17:11.198Z',
