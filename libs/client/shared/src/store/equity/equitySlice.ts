import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisibilityState } from '@tanstack/react-table';
import { RootState } from '../store';

import { defaultEquityObjectsColumns } from '@urgp/client/entities';
import {
  CreateEquityOperationDto,
  DialogFormState,
  emptyEquityOperation,
  EquityOperation,
  getFormDataFromEquityOperation,
} from '@urgp/shared/entities';
import { lsKeys } from '../../config/localStorageKeys';

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

    setOperationFormObjectId: (state, { payload }: PayloadAction<number>) => {
      state.operationForm.values.objectId = payload;
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
  setOperationFormObjectId,
} = equitySlice.actions;
export const selectEquityOperationFormValues = (state: RootState) =>
  state.equity.operationForm.values;
export const selectEquityOperationFormState = (state: RootState) =>
  state.equity.operationForm.state;

export default equitySlice.reducer;
