import { rtkApi } from '@urgp/client/shared';
import { GetOldAppartmentsDto, OldAppartment } from '@urgp/shared/entities';

const oldApartmentsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOldAppartments: build.query<OldAppartment[], GetOldAppartmentsDto>({
      query: (query) => ({
        url: '/renovation/old-apartments',
        params: { ...query },
      }),
    }),
  }),
  overrideExisting: false,
});

export const useOldAppartments = oldApartmentsApi.useGetOldAppartmentsQuery;
