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

type SplitAdress = {
  street: string;
  numbers: string;
};

export function splitAddress(adress: string): SplitAdress {
  const regEx =
    /^(.*?\d+\-[йя].*?|.*?)(?:,?\s)((?:(?:д(?:ом)?|уч(?:ас)?(?:ток)|кор(?:п)?(?:ус)?|з(?:ем)?(?:ельный)?(?:\/у)?|вл?(?:ад)?(?:ен)?(?:ие)?|c(?:оор)?(?:ужение)?|стр(?:оен)?(?:ие)?|[№Nn]|$|)\.?(?:[,\s]|(?=\d))).*?\d.*)?$/;
  const result = regEx.exec(adress);
  return {
    street: clearStreet(result?.[1] || ''),
    numbers: result?.[2] || '',
  };
}
