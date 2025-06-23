import { rtkApi } from '@urgp/client/shared';
import { EquityClaim } from '@urgp/shared/entities';

export const equityClaimsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getClaimsByObjectId: build.query<EquityClaim[], number>({
      query: (objectId) => ({
        url: '/equity/by-object/' + objectId.toString() + '/claims',
        method: 'GET',
      }),
      providesTags: ['equity-claims'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetClaimsByObjectIdQuery: useEquityClaims } = equityClaimsApi;
