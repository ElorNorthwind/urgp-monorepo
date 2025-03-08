import { FiasAddressPart } from '../types';

// Вычищаем часть адреса с городом Москвой и муниципальным делением
export const clearMunicipalAddressPart = (address: string): string => {
  const municipalPart =
    /((?:Гг Москва)?(?:,\s)?.*?(?:(?:[мМ]уницип|[Гг]ор).*?(?:[оО]кр|[оО]браз)|(?:[Мм]униц|[Гг]ор).*?рай|(?:[Сс]ель|[Гг]ор).*?пос).*?(?:,\s))/;
  return (address.replace(municipalPart, '') || '')?.trim();
};

export function clearStreet(street: string): string {
  const sanitizeStreetTypes =
    /(?<=\s|^)(ул(?:ица)?\.?|д(?:ер)?(?:евня)?\.?|пер(?:еулок)?\.?|п(?:р)?(?:оезд|\-д)?\.?(?! [№Nn])г(?:ор)?(?:од)?\.?|(?:дачный |рабочий )?п(?:ос)?(?:[её]л)?(?:ок)?\.?|с(?:ело?)?\.?|ш(?:оссе)?\.?|посел(?:ен)?(?:ие)?\.?|пл(?:ощадь)?\.?|бул(?:ьв)?(?:ар)?\.?|наб(?:ережная)?\.?|туп(?:ик)?\.?|пр?(?:осп)?(?:ект)?(?:-т)?\.?|аллея|хутор|линия|просек)(?=\s|$)/g;
  const result = (street.replace(sanitizeStreetTypes, '') || '')?.trim();
  return result.replace(/([,\.;]|\s(?=\s))/g, '');
}

const claerWhitespaceRegexp = /\s\s+/g;

type SplitAdress = {
  original: string;
  shortAddress: string;
  parts: FiasAddressPart;
  validationStr: string;
};
type SplitApartment = {
  house: string;
  apartment: string;
};

export function splitAppartment(addressPart: string): SplitApartment {
  const regEx =
    /^(.*?)(?:,?\s)((?:кв\.кв|кв(?:артир[аы])?|п(?:ом)?(?:ещ)?(?:ение)?)\.?(?:[,?\s]|(?=\d))(?:[№N]\s)?[\dIVX][\d\-\\\/а-яА-Я,\. IVX]*)$/;
  const result = regEx.exec(addressPart);
  return {
    house: result?.[1] || addressPart,
    apartment: result?.[2] || '',
  };
}

export function addressToParts(address: string): SplitAdress {
  const splitAddress =
    /^(.*?\d+\-[йя].*?|.*?)(?:,?\s)((?:(?:д(?:ом)?|уч(?:ас)?(?:ток)|кор(?:п)?(?:ус)?|з(?:ем)?(?:ельный)?(?:\/у)?|вл?(?:ад)?(?:ен)?(?:ие)?|c(?:оор)?(?:ужение)?|стр(?:оен)?(?:ие)?|[№Nn]|$|)\.?(?:[,?\s]|(?=\d))).*?\d.*)?$/;

  const findNums = /([\dIVX][\d\-\\\/а-яА-ЯIVX]*)/g;
  const addressParts = splitAddress.exec(
    address.replace(claerWhitespaceRegexp, ' '),
  );

  const shortStreetname = clearStreet(addressParts?.[1] || '') || '';
  const houseAndAppartment = splitAppartment(addressParts?.[2] || '');
  const numbers = (addressParts?.[2] || '').match(findNums) || [];
  const shortAddress =
    (/[Мм]осква/.test(shortStreetname)
      ? shortStreetname
      : 'Москва, ' + shortStreetname) +
    ' ' +
    numbers.join(' ');

  // TODO: Доп проверки на плохо написанные квартиры?
  const hasFlat =
    houseAndAppartment?.apartment && houseAndAppartment?.apartment !== ''
      ? true
      : false;

  const parts = {
    region: {
      name: 'Москва',
      type_name: 'город',
    },
    object_level_id: hasFlat ? 11 : 10,
    street: { name: shortStreetname }, // TODO: Дочищать адреса надо лучше! г Москва вот это вот все
    house: { number: houseAndAppartment?.house || '' },
    flat: hasFlat ? { number: houseAndAppartment?.apartment || '' } : undefined,
  };

  return {
    original: address.replace(claerWhitespaceRegexp, ' '),
    shortAddress,
    parts,
    validationStr: numbers.join('|').toLowerCase(),
  };
}
