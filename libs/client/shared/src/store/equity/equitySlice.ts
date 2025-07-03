import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisibilityState } from '@tanstack/react-table';
import { RootState } from '../store';

import {
  defaultEquityObjectsColumns,
  defaultIncidentColumns,
} from '@urgp/client/entities';
import { lsKeys } from '../../config/localStorageKeys';
import {
  CreateEquityOperationDto,
  DialogFormState,
  emptyEquityOperation,
  EquityOperation,
  getFormDataFromEquityOperation,
} from '@urgp/shared/entities';

type EquityState = {
  objectTableColumns: VisibilityState;
  operationForm: {
    state: DialogFormState;
    values: CreateEquityOperationDto & { saved?: boolean };
  };
};

const initialEquityObjectsTableColumns =
  JSON.parse(localStorage.getItem(lsKeys.EQUITY_OBJECTS_TABLE_KEY)) ||
  defaultEquityObjectsColumns;

const initialState: EquityState = {
  objectTableColumns: initialEquityObjectsTableColumns,
  operationForm: { state: DialogFormState.close, values: emptyEquityOperation },
};

const equitySlice = createSlice({
  name: 'equity',
  initialState,
  reducers: {
    // =============================== TABLE STATE ================================
    setEquityObjectTableColumns: (
      state,
      { payload }: PayloadAction<VisibilityState>,
    ) => {
      localStorage.setItem(
        lsKeys.EQUITY_OBJECTS_TABLE_KEY,
        JSON.stringify(payload),
      );
      state.objectTableColumns = payload;
    },
    clearEquityObjectTableColumns: (state) => {
      localStorage.removeItem(lsKeys.EQUITY_OBJECTS_TABLE_KEY);
      state.objectTableColumns = defaultEquityObjectsColumns;
    },

    // ================================= OPERATION =================================
    setOperationFormState: (
      state,
      { payload }: PayloadAction<DialogFormState>,
    ) => {
      state.operationForm.state = payload;
    },
    setOperationFormValuesEmpty: (state) => {
      state.operationForm.values = { ...emptyEquityOperation };
    },
    setOperationFormValuesFromOperation: (
      state,
      { payload }: PayloadAction<EquityOperation>,
    ) => {
      state.operationForm.values = getFormDataFromEquityOperation(payload);
    },

    setOperationFormValuesFromDto: (
      state,
      {
        payload,
      }: PayloadAction<CreateEquityOperationDto & { saved?: boolean }>,
    ) => {
      state.operationForm.values = { ...payload };
    },
  },
});

// ================================ TABLE STATE ================================
export const { setEquityObjectTableColumns, clearEquityObjectTableColumns } =
  equitySlice.actions;
export const selectEquityObjectTableColumns = (state: RootState) =>
  state.equity.objectTableColumns;

// =========================== OPERATION FORM STATE ==============================
export const {
  setOperationFormState,
  setOperationFormValuesEmpty,
  setOperationFormValuesFromDto,
  setOperationFormValuesFromOperation,
} = equitySlice.actions;
export const selectOperationFormValues = (state: RootState) =>
  state.equity.operationForm.values;
export const selectOperationFormState = (state: RootState) =>
  state.equity.operationForm.state;

export default equitySlice.reducer;
