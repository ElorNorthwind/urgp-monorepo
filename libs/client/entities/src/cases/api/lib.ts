import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { CaseEndpointProps, casesApi } from '..';
import {
  CaseActions,
  CaseFull,
  ReadEntityDto,
  ViewStatus,
} from '@urgp/shared/entities';
import { RootState } from '@reduxjs/toolkit/query';

const getCaseQueryArgs = (
  getState?: () => RootState<any, any, 'api'>,
): Array<CaseEndpointProps | undefined> => {
  if (!getState) return [undefined];
  const queries = getState()[casesApi.reducerPath]?.queries;

  if (queries) {
    return Object.values(queries)
      .filter((query) => query?.endpointName === 'getCases')
      .map((q) => q?.originalArgs) as Array<CaseEndpointProps>;
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
      if (arg?.class !== newCase.class) return;
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
      if (arg?.class !== newCase.class) return;
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
  caseId: number | undefined,
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  getState?: () => RootState<any, any, 'api'>,
): Promise<void> => {
  if (caseId) {
    const caseQueryArgs = getCaseQueryArgs(getState);
    caseQueryArgs.forEach((arg) => {
      dispatch(
        casesApi.util.updateQueryData('getCases', arg, (draft) => {
          return draft.filter((stage) => stage.id !== caseId);
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
      await dispatch(
        casesApi.endpoints.getCaseById.initiate(caseId, { forceRefetch: true }),
      )
    )?.data;
    const caseQueryArgs = getCaseQueryArgs(getState);
    caseQueryArgs.forEach((arg) => {
      if (!newCase?.class || arg?.class !== newCase.class) return;
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

export const refetchCachedCaseByOperationId = async (
  operationId: number | undefined | null,
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  getState?: () => RootState<any, any, 'api'>,
): Promise<void> => {
  if (operationId) {
    const newCase = (
      await dispatch(
        casesApi.endpoints.getCaseByOperationId.initiate(operationId, {
          forceRefetch: true,
        }),
      )
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
  dto: { mode: 'seen' | 'done' | 'watched'; case: number[] },
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
                dto.mode === 'watched'
                  ? ViewStatus.unchanged
                  : cCase.viewStatus === ViewStatus.unwatched ||
                      dto.mode === 'done'
                    ? ViewStatus.unwatched
                    : ViewStatus.unchanged,
              actions:
                dto.mode === 'done'
                  ? cCase.actions.filter(
                      (ac) =>
                        ![
                          CaseActions.reminderDone,
                          CaseActions.reminderOverdue,
                        ].includes(ac as any),
                    )
                  : cCase.actions,
            } as CaseFull;
          return cCase as CaseFull;
        }),
      ),
    );
  });
};
