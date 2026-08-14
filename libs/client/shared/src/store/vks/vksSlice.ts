import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisibilityState } from '@tanstack/react-table';
import { RootState } from '../store';

import { lsKeys } from '../../config/localStorageKeys';
import { defaultVksCasesColumns } from '@urgp/client/entities';
import {
  DialogFormState,
  emptyVksSurveyHousingForm,
  UpdateDgiVksSurveyHousingForm,
} from '@urgp/shared/entities';

type VksState = {
  casesTableColumns: VisibilityState;
  surveyForm: {
    state: DialogFormState;
    values: UpdateDgiVksSurveyHousingForm & { saved?: boolean };
  };
};

const initialVksCasesTableColumns =
  JSON.parse(localStorage.getItem(lsKeys.VKS_CASES_TABLE_KEY)) ||
  defaultVksCasesColumns;

const initialState: VksState = {
  casesTableColumns: initialVksCasesTableColumns,
  surveyForm: {
    state: DialogFormState.close,
    values: emptyVksSurveyHousingForm,
  },
};

const vksSlice = createSlice({
  name: 'vks',
  initialState,
  reducers: {
    // =============================== TABLE STATE - CASES ================================
    setVksCasesTableColumns: (
      state,
      { payload }: PayloadAction<VisibilityState>,
    ) => {
      localStorage.setItem(lsKeys.VKS_CASES_TABLE_KEY, JSON.stringify(payload));
      state.casesTableColumns = payload;
    },
    clearVksCasesTableColumns: (state) => {
      localStorage.removeItem(lsKeys.VKS_CASES_TABLE_KEY);
      state.casesTableColumns = defaultVksCasesColumns;
    },
    // ================================= SURVEY FORM =================================
    setSurveyFormState: (
      state,
      { payload }: PayloadAction<DialogFormState>,
    ) => {
      state.surveyForm.state = payload;
    },
    setSurveyFormValuesEmpty: (state) => {
      state.surveyForm.values = { ...emptyVksSurveyHousingForm };
    },
    setSurveyFormValuesFromDto: (
      state,
      {
        payload,
      }: PayloadAction<UpdateDgiVksSurveyHousingForm & { saved?: boolean }>,
    ) => {
      state.surveyForm.values = { ...payload };
    },
    setSurveyFormCaseId: (state, { payload }: PayloadAction<number>) => {
      state.surveyForm.values.id = payload;
    },
  },
});

// ================================ TABLE STATE - Cases ================================
export const { setVksCasesTableColumns, clearVksCasesTableColumns } =
  vksSlice.actions;
export const selectVksCasesTableColumns = (state: RootState) =>
  state.vks.casesTableColumns;

// =========================== SURVEY FORM STATE ==============================
export const {
  setSurveyFormState,
  setSurveyFormValuesEmpty,
  setSurveyFormValuesFromDto,
  setSurveyFormCaseId,
} = vksSlice.actions;
export const selectVksSurveyFormValues = (state: RootState) =>
  state.vks.surveyForm.values;
export const selectVksSurveyFormState = (state: RootState) =>
  state.vks.surveyForm.state;

export default vksSlice.reducer;
