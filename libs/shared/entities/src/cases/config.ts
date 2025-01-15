import { GET_DEFAULT_CONTROL_DUE_DATE } from '../userInput/config';
import { Case } from './types';

export const emptyCase = {
  id: 0,
  class: 'control-incident',
  typeId: 4,
  externalCases: [
    {
      system: 'NONE',
      num: '',
      date: new Date().toISOString() as unknown as Date,
    } as Case['payload']['externalCases'][0],
  ],
  directionIds: [],
  problemIds: [],
  description: '',
  fio: '',
  adress: '',
  approverId: null,
  dueDate: GET_DEFAULT_CONTROL_DUE_DATE().toISOString(),
};
