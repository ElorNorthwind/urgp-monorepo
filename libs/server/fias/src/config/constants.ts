import https from 'https';

export const FIAS_HTTP_OPTIONS = {
  defaults: {
    httpsAgent: new https.Agent({
      keepAlive: true,
      maxSockets: 100,
    }),
  },
  httpsAgent: new https.Agent({
    keepAlive: true,
    maxSockets: 100,
  }),

  baseURL: 'https://fias-public-service.nalog.ru/api/spas/v2.0',
  headers: {
    'Content-Type': 'Application/json',
  },
};
