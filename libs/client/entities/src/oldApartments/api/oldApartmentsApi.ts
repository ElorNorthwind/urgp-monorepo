import { rtkApi } from '@urgp/client/shared';
import {
  GetOldAppartmentsDto,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
  ProblematicApartmentInfo,
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

    getSpecialApartments: build.query<OldAppartment[], void>({
      query: () => ({
        url: '/renovation/special-apartments',
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
    getProblematicApartments: build.query<ProblematicApartmentInfo[], number>({
      query: (query) => ({
        url: '/renovation/problematic-apartments/' + query.toString(),
        methor: 'GET',
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetOldApartmentsQuery: useOldApartments,
  useGetSpecialApartmentsQuery: useSpecialApartments,
  useGetOldApartmentTimelineQuery: useOldApartmentTimeline,
  useGetOldApartmentDetailsQuery: useOldApartmentDetails,
  useGetProblematicApartmentsQuery: useProblematicApartments,
} = oldApartmentsApi;
