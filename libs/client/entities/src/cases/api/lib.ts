import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { casesApi } from '..';
import { CaseFull, ReadEntityDto, ViewStatus } from '@urgp/shared/entities';
import { RootState } from '@reduxjs/toolkit/query';

const getCaseQueryArgs = (
  getState?: () => RootState<any, any, 'api'>,
): Array<ReadEntityDto['visibility'] | undefined> => {
  if (!getState) return [undefined, 'visible', 'pending', 'all'];
  const queries = getState()[casesApi.reducerPath]?.queries;
  if (queries) {
    return Object.values(queries)
      .filter((query) => query?.endpointName === 'getCases')
      .map((q) => q?.originalArgs) as Array<
      ReadEntityDto['visibility'] | undefined
    >;
  }
  return [undefined];
};

export const insertCachedCase = async (
  newCase: CaseFull | undefined,
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  getState?: () => RootState<any, any, 'api'>,
): Promise<void> => {
  if (newCase) {
    const caseQueryArgs = getCaseQueryArgs(getState);
    caseQueryArgs.forEach((arg) => {
      dispatch(
        casesApi.util.updateQueryData('getCases', arg, (draft) => {
          draft?.unshift(newCase);
        }),
      );
    });
  }
};

export const updateCachedCase = async (
  newCase: CaseFull | undefined,
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  getState?: () => RootState<any, any, 'api'>,
): Promise<void> => {
  if (newCase) {
    const caseQueryArgs = getCaseQueryArgs(getState);
    caseQueryArgs.forEach((arg) => {
      dispatch(
        casesApi.util.updateQueryData('getCases', arg, (draft) => {
          const index = draft.findIndex((stage) => stage.id === newCase.id);
          return [...draft.slice(0, index), newCase, ...draft.slice(index + 1)];
        }),
      );
    });
  }
};

export const deleteCachedCase = async (
  newCase: CaseFull | undefined,
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  getState?: () => RootState<any, any, 'api'>,
): Promise<void> => {
  if (newCase) {
    const caseQueryArgs = getCaseQueryArgs(getState);
    caseQueryArgs.forEach((arg) => {
      dispatch(
        casesApi.util.updateQueryData('getCases', arg, (draft) => {
          return draft.filter((stage) => stage.id !== newCase.id);
        }),
      );
    });
  }
};

export const refetchCachedCase = async (
  caseId: number | undefined | null,
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  getState?: () => RootState<any, any, 'api'>,
): Promise<void> => {
  if (caseId) {
    const newCase = (
      await dispatch(casesApi.endpoints.getCaseById.initiate(caseId))
    )?.data;
    const caseQueryArgs = getCaseQueryArgs(getState);
    caseQueryArgs.forEach((arg) => {
      dispatch(
        casesApi.util.updateQueryData('getCases', arg, (draft) => {
          if (!newCase) return draft;
          const index = draft.findIndex((stage) => stage.id === newCase?.id);
          return [...draft.slice(0, index), newCase, ...draft.slice(index + 1)];
        }),
      );
    });
  }
};

export const markCachedCase = (
  dto: { mode: 'seen' | 'done'; case: number[] },
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  getState?: () => RootState<any, any, 'api'>,
) => {
  const caseQueryArgs = getCaseQueryArgs(getState);

  caseQueryArgs.forEach((arg) => {
    dispatch(
      casesApi.util.updateQueryData('getCases', arg, (draft) =>
        draft.map((cCase) => {
          if (dto.case.includes(cCase.id))
            return {
              ...cCase,
              viewStatus:
                cCase.viewStatus === 'unwatched' || dto.mode === 'done'
                  ? 'unwatched'
                  : ViewStatus.unchanged,
            } as CaseFull;
          return cCase as CaseFull;
        }),
      ),
    );
  });
};
