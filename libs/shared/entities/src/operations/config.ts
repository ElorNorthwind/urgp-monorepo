import { startOfToday } from 'date-fns';

export const emptyStage = {
  id: 0,
  caseId: 0,
  class: 'stage',
  typeId: 6,
  doneDate: startOfToday().toISOString(),
  num: '',
  description: '',
  approverId: null,
};
