export const EDO_HTTP_OPTIONS = {
  baseURL: 'https://mosedo.mos.ru',
  headers: {
    accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'ru-RU,ru;q=0.9',
    'user-agent':
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
    'content-type': 'application/x-www-form-urlencoded',
  },
};
export const RSM_HTTP_OPTIONS = {
  baseURL: 'http://10.15.179.52:5222',
  maxBodyLength: Infinity,
  headers: {
    'user-agent':
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
  },
};
