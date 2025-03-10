import { Logger } from '@nestjs/common';
import https from 'https';
import { timer } from 'rxjs';

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

const RETRYABLE_STATUS_CODES = [503, 504, 429]; // Example: Server errors & rate limits

export const shouldRetry = (error: any, count: number) => {
  if (
    error.response &&
    RETRYABLE_STATUS_CODES.includes(error.response.status)
  ) {
    return timer(count * 1000);
  }
  throw error;
};
