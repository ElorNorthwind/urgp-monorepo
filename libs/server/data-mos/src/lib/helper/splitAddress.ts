import { clearStreet } from './clearStreet';

type SplitAdress = {
  street: string;
  numbers: string;
};

export function splitAddress(adress: string): SplitAdress {
  const regEx =
    /^(?:пос.*?, )?(.*?)(?:(?:,?\s)(?:д(?:ом)?\.?[,\s]|уч(?:ас)?(?:ток)\.?[,\s]|кор(?:п)?(?:ус)?\.?[,\s]|з(?:ем)?(?:ельный)?(?:\/у)?\.?[,\s]|вл?(?:ад)?(?:ен)?(?:ие)?\.?[,\s]|c(?:оор)?(?:ужение)?\.?[,\s]|стр(?:оен)?(?:ие)?\.?[,\s]|[№Nn]|$)|(?:,?\s)(?=\d))(.*)$/;
  const result = regEx.exec(adress);
  return {
    street: clearStreet(result?.[1] || ''),
    numbers: result?.[2] || '',
  };
}
