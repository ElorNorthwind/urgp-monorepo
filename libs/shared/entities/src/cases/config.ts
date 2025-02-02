import { GET_DEFAULT_CONTROL_DUE_DATE } from '../userInput/config';
import { ExternalCase } from '../userInput/types';

export const emptyCase = {
  id: 0,
  class: 'control-incident',
  typeId: 4,
  externalCases: [
    {
      system: 'NONE',
      num: '',
      date: new Date().toISOString(),
    } as ExternalCase,
  ],
  directionIds: [],
  problemIds: [],
  description: '',
  fio: '',
  adress: '',
  approverId: null,
  dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
};
