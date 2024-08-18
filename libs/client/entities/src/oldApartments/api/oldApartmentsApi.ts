import { rtkApi } from '@urgp/client/shared';
import {
  GetOldAppartmentsDto,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
} from '@urgp/shared/entities';

const oldApartmentsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOldApartments: build.query<OldAppartment[], GetOldAppartmentsDto>({
      query: (query) => ({
        url: '/renovation/old-apartments',
        params: { ...query },
      }),

      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
        return { ...queryArgs, offset: undefined };
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.offset !== previousArg?.offset;
      },
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

export const {
  useGetOldApartmentsQuery: useOldApartments,
  useGetOldApartmentTimelineQuery: useOldApartmentTimeline,
  useGetOldApartmentDetailsQuery: useOldApartmentDetails,
} = oldApartmentsApi;
