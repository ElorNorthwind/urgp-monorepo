import { DataMosAdress } from '../../config/types';
import { clearStreet } from './clearStreet';
import { splitAddress } from './splitAddress';

export const calculateStreetFromDataMos = (object: DataMosAdress): string => {
  const { P4, P6, P7, P90, P91, SIMPLE_ADDRESS } = object?.Cells;
  const addressParts = [P4, P6, P7, P90, P91].filter(
    (item) => !['', ' ', null, undefined].includes(item),
  );
  return addressParts?.length > 0
    ? clearStreet(addressParts.join(' '))
    : splitAddress(SIMPLE_ADDRESS).street;
};
