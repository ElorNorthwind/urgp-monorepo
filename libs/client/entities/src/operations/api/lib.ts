import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { casesApi } from '../../cases';

export const RefetchCachedCase = async (
  dispatch: ThunkDispatch<any, any, UnknownAction>,
  caseId: number | undefined | null,
): Promise<void> => {
  if (caseId) {
    const changedCase = await dispatch(
      casesApi.endpoints.getPendingCaseById.initiate(caseId),
    );
    dispatch(
      casesApi.util.updateQueryData('getCases', undefined, (draft) => {
        if (!changedCase?.data) return draft;
        const index = draft.findIndex(
          (stage) => stage.id === changedCase?.data?.id,
        );
        return [
          ...draft.slice(0, index),
          { ...changedCase.data, action: undefined, pendingStage: undefined },
          ...draft.slice(index + 1),
        ];
      }),
    );
    dispatch(
      casesApi.util.updateQueryData('getPendingCases', undefined, (draft) => {
        if (!changedCase?.data) return draft;
        const index = draft.findIndex(
          (stage) => stage.id === changedCase?.data?.id,
        );
        return [
          ...draft.slice(0, index),
          { ...changedCase.data },
          ...draft.slice(index + 1),
        ];
      }),
    );
  }
};
