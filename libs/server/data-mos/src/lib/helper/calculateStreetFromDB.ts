import { AdressRegistryRowSlim } from '../../config/types';
import { clearStreet } from './clearStreet';
import { splitAddress } from './splitAddress';

export const calculateStreetFromDB = (
  object: AdressRegistryRowSlim,
): string => {
  const { p4, p6, p7, p90, p91, simple_address } = object;
  const addressParts = [p4, p6, p7, p90, p91].filter(
    (item) => !['', ' ', null, undefined].includes(item),
  );
  return addressParts?.length > 0
    ? clearStreet(addressParts.join(' '))
    : splitAddress(simple_address).street;
};
