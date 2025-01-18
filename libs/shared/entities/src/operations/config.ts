import { startOfToday } from 'date-fns';
import { GET_DEFAULT_CONTROL_DUE_DATE } from '../userInput/config';

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

export const emptyDispatch = {
  id: 0,
  caseId: 0,
  class: 'dispatch' as 'dispatch',
  typeId: 10,
  dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
  description: '',
  executorId: null,
  controller: 'executor' as 'author' | 'executor',
  dateDescription: 'Первично установленный срок',
};

export const emptyReminder = {
  id: 0,
  caseId: 0,
  class: 'reminder' as 'reminder',
  typeId: 11,
  // observerId: store.getState().auth.user?.id || 0,
  observerId: 0,
  description: '',
  dueDate: null, // GET_DEFAULT_CONTROL_DUE_DATE(),
  doneDate: null,
};
