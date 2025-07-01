import { rtkApi } from '@urgp/client/shared';
import {
  EquityOperation,
  NestedClassificatorInfo,
} from '@urgp/shared/entities';

export const equityOperationsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOperationsByObjectId: build.query<EquityOperation[], number>({
      query: (objectId) => ({
        url: '/equity/by-object/' + objectId.toString() + '/operations',
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        'equity-operations',
        { type: 'equity-operations', objectId: arg },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetOperationsByObjectIdQuery: useEquityOperations } =
  equityOperationsApi;
