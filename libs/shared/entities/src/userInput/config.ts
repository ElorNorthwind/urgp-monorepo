import { addBusinessDays } from 'date-fns';

export const GET_DEFAULT_CONTROL_DUE_DATE = () =>
  addBusinessDays(new Date().setHours(0, 0, 0, 0), 5);
