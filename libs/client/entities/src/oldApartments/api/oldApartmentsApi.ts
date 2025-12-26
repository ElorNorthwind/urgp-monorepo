import { rtkApi } from '@urgp/client/shared';
import {
  AddDefectDataDto,
  AddNotoficationsDataDto,
  ApartmentCapstone,
  ApartmentDefect,
  GetOldAppartmentsDto,
  NestedClassificatorInfo,
  OldApartmentDetails,
  OldApartmentTimeline,
  OldAppartment,
  ProblematicApartmentInfo,
} from '@urgp/shared/entities';

const oldApartmentsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOldApartments: build.query<OldAppartment[], void>({
      query: () => ({
        url: '/renovation/old-apartments',
      }),
      // // Only have one cache entry because the arg always maps to one string
      // serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
      //   return { ...queryArgs, offset: undefined };
      // },
      // // Always merge incoming data to the cache entry
      // merge: (currentCache, newItems) => {
      //   currentCache.push(...newItems);
      // },
      // // Refetch when the page arg changes
      // forceRefetch({ currentArg, previousArg }) {
      //   return currentArg?.offset !== previousArg?.offset;
      // },
    }),

    getSpecialApartments: build.query<OldAppartment[], void>({
      query: () => ({
        url: '/renovation/special-apartments',
      }),
    }),

    getOldApartmentCapstones: build.query<ApartmentCapstone[], number>({
      query: (query) => ({
        url: '/renovation/capstones/' + query.toString(),
        methor: 'GET',
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
    getApartmentStageClassificator: build.query<
      NestedClassificatorInfo[],
      void
    >({
      query: () => ({
        url: '/renovation/old-apartment/stage-classificator/',
        methor: 'GET',
      }),
    }),

    postDefects: build.mutation<void, AddDefectDataDto>({
      query: (dto) => ({
        url: '/renovation/old-apartment/defects',
        method: 'POST',
        body: dto,
      }),
    }),

    getDefects: build.query<ApartmentDefect[], number>({
      query: (query) => ({
        url: '/renovation/old-apartment/defects/' + query.toString(),
        methor: 'GET',
      }),
    }),

    postNotifications: build.mutation<void, Blob>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: '/rsm_monitoring_notifications/',
          method: 'POST',
          body: formData,
        };
      },
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
  useGetOldApartmentCapstonesQuery: useOldApartmentCapstones,
  useGetApartmentStageClassificatorQuery: useApartmentStageClassificator,
  useGetDefectsQuery: useApartmentDefects,
  usePostDefectsMutation: usePostApartmentDefects,
  usePostNotificationsMutation: usePostNotifications,
} = oldApartmentsApi;
