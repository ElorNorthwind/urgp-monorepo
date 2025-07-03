import { CreateEquityOperationDto } from './dto';
import { EquityOperation } from './types';

export const emptyEquityOperation = {
  class: 'operation',
  objectId: 0,
  claimId: null,
  typeId: 1,
  date: new Date().toISOString(),
  source: '',
  notes: '',
  number: '',
  result: '',
  fio: '',
} as CreateEquityOperationDto;

export const getFormDataFromEquityOperation = (
  payload: EquityOperation,
): CreateEquityOperationDto => {
  return {
    class: 'operation',
    createdById: payload?.createdBy?.id || 0,
    objectId: payload?.objectId || 0,
    claimId: payload?.claimId || null,
    typeId: payload?.type?.id || 1,
    date: payload?.date
      ? new Date(payload?.date).toISOString()
      : new Date().toISOString(),
    source: payload?.source || '',
    notes: payload?.notes || '',
    number: payload?.number || '',
    result: payload?.result || '',
    fio: payload?.fio || '',
  };
};
