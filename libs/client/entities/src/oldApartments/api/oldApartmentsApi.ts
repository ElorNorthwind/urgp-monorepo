import { rtkApi } from '@urgp/client/shared';
import {
  GetOldAppartmentsDto,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
} from '@urgp/shared/entities';

const oldApartmentsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOldAppartments: build.query<OldAppartment[], GetOldAppartmentsDto>({
      query: (query) => ({
        url: '/renovation/old-apartments',
        params: { ...query },
      }),
    }),
    getOldApartmentTimeline: build.query<OldApartmentTimeline[], number>({
      query: (query) => ({
        url: '/renovation/old-apartment-timeline/' + query.toString(),
        methor: 'GET',
      }),
    }),
    getOldApartmentDetails: build.query<OldApartmentDetails, number>({
      query: (query) => ({
        url: '/renovation/old-apartment-details/' + query.toString(),
        methor: 'GET',
      }),
    }),
  }),

  overrideExisting: false,
});

export const useOldAppartments = oldApartmentsApi.useGetOldAppartmentsQuery;
export const useOldApartmentTimeline =
  oldApartmentsApi.useGetOldApartmentTimelineQuery;
export const useOldApartmentDetails =
  oldApartmentsApi.useGetOldApartmentDetailsQuery;
