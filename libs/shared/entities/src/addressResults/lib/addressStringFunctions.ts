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
  street: string;
  // numbers: string;
  house: string;
  apartment: string;
};
type SplitApartment = {
  house: string;
  apartment: string;
};

export function splitAppartment(addressPart: string): SplitApartment {
  const regEx =
    /^(.*?(?:к.*?)?(?:к(?!в\.).*?)?)(?:,?\s)((?:кв\.кв|кв?(?:артир[аы])?|п(?:ом)?(?:ещ)?(?:ение)?)\.?(?:[,\s]|(?=\d))(?:[№N]\s)?[\dIVX][\d\-\\\/а-яА-Я,\. IVX]*)$/;
  const result = regEx.exec(addressPart);
  return {
    house: result?.[1] || addressPart,
    apartment: result?.[2] || '',
  };
}

export function splitAddress(address: string): SplitAdress {
  const regEx =
    /^(.*?\d+\-[йя].*?|.*?)(?:,?\s)((?:(?:д(?:ом)?|уч(?:ас)?(?:ток)|кор(?:п)?(?:ус)?|з(?:ем)?(?:ельный)?(?:\/у)?|вл?(?:ад)?(?:ен)?(?:ие)?|c(?:оор)?(?:ужение)?|стр(?:оен)?(?:ие)?|[№Nn]|$|)\.?(?:[,?\s]|(?=\d))).*?\d.*)?$/;
  const result = regEx.exec(address.replace(claerWhitespaceRegexp, ' '));
  const houseAndAppartment = splitAppartment(result?.[2] || '');
  return {
    original: address.replace(claerWhitespaceRegexp, ' '),
    street: clearStreet(result?.[1] || ''),
    // numbers: result?.[2] || '',
    ...houseAndAppartment,
  };
}
