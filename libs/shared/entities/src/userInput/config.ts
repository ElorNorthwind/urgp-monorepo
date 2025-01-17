import { addBusinessDays, startOfToday } from 'date-fns';

export const GET_DEFAULT_CONTROL_DUE_DATE = () =>
  addBusinessDays(startOfToday(), 5).toISOString();
