import { FiasAddressPart } from '../types';
import {
  deletePatterns,
  findPatterns,
  replacePatterns,
} from './helperFunctions';
import {
  extraWhitespaceAndCommasPattern,
  streetTypeReplacements,
  moscowCityPattern,
  municipalPartPattern,
  streetNumberPaddingPattern,
  streetTypePattern,
  splitHouseAndFlatPattern,
  houseTypeReplacements,
  splitAddressPatternn,
  numericPartPattern,
  mainWordPattern,
  extraWhitespacePattern,
} from './patterns';

type SplitAdress = {
  original: string;
  shortAddress: string;
  parts: FiasAddressPart;
  validationStr: string;
  mainWord: string;
};

type HouseAndFlatPart = {
  house: { number: string };
  flat?: { number: string };
};

type StreetPart = {
  name: string;
  type_name?: string;
};

// Вычищаем часть адреса с городом Москвой и муниципальным делением
export const clearMunicipalAddressPart = (address: string): string => {
  const result = deletePatterns(address, [
    moscowCityPattern,
    municipalPartPattern,
    streetNumberPaddingPattern,
    extraWhitespacePattern,
  ]).trim();
  return result;
};

export function clearStreet(street: string): StreetPart {
  const streetNameWithType = deletePatterns(street, [
    moscowCityPattern,
    municipalPartPattern,
    streetNumberPaddingPattern,
    extraWhitespacePattern,
  ]).trim();

  const streetType = findPatterns(streetNameWithType, streetTypeReplacements);

  const streetName = deletePatterns(streetNameWithType, [
    streetTypePattern,
  ]).trim();

  const isCity = /([Гг](?:ор)?(?:од)?\.?)/i.test(streetType || '');

  return {
    name: streetName,
    type_name: streetType && !isCity ? streetType : undefined,
  };
}

export function clearHouseAndFlat(addressHalf: string): HouseAndFlatPart {
  const result = splitHouseAndFlatPattern.exec(addressHalf);
  // TODO: Доп проверки на плохо написанные квартиры?
  const hasFlat = result?.[2] && result?.[2] !== '' ? true : false;

  const houseNum = deletePatterns(
    replacePatterns(
      result?.[1] || addressHalf || '',
      houseTypeReplacements,
      ' ',
      ' ',
    ),
    [extraWhitespaceAndCommasPattern], // Ok here? It's a final result
  ).trim();

  return {
    house: { number: houseNum },
    flat: hasFlat
      ? {
          number: deletePatterns(result?.[2] || '', [
            extraWhitespacePattern,
          ]).trim(),
        }
      : undefined,
  };
}

export function addressToParts(address: string): SplitAdress {
  const clearedAddress = deletePatterns(address, [extraWhitespacePattern]);
  const addressHalfs = splitAddressPatternn.exec(clearedAddress);

  const streetPart = clearStreet(addressHalfs?.[1] || '');
  const mainWord = streetPart.name.match(mainWordPattern)?.[1] || '';

  const houseAndFlatParts = clearHouseAndFlat(addressHalfs?.[2] || '');
  const hasFlat = houseAndFlatParts?.flat ? true : false;

  const numbers =
    (
      houseAndFlatParts?.house?.number +
        ' квартира ' +
        houseAndFlatParts?.flat?.number || ''
    ).match(numericPartPattern) || [];

  const shortAddress =
    (/[Мм]осква/.test(streetPart?.name)
      ? streetPart?.name || ''
      : 'Москва, ' + streetPart?.name) +
    ' ' +
    numbers.join(' ');

  // console.log(
  //   `\n-------------\nOriginal: ${address} \nFirstSplit: ${addressHalfs?.[1]} | ${addressHalfs?.[2]} \nFlat: ${houseAndFlatParts?.flat?.number} \nStreet: ${streetPart?.name} \nStreetType: ${streetPart?.type_name} \nNums: ${numbers.join('|')} \nWord: ${mainWord}\n`,
  // );

  const parts = {
    region: {
      name: 'Москва',
      type_name: 'город',
    },
    object_level_id: hasFlat ? 11 : 10,
    street: streetPart,
    ...houseAndFlatParts,
  };

  return {
    original: address.replace(extraWhitespaceAndCommasPattern, ' '), // Ok here? It's a final result
    shortAddress,
    parts,
    validationStr: numbers.join('|').toLowerCase(),
    mainWord,
  };
}
