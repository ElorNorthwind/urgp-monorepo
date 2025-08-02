import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisibilityState } from '@tanstack/react-table';
import { RootState } from '../store';

import { lsKeys } from '../../config/localStorageKeys';
import { defaultVksCasesColumns } from '@urgp/client/entities';

type VksState = {
  casesTableColumns: VisibilityState;
};

const initialVksCasesTableColumns =
  JSON.parse(localStorage.getItem(lsKeys.VKS_CASES_TABLE_KEY)) ||
  defaultVksCasesColumns;

const initialState: VksState = {
  casesTableColumns: initialVksCasesTableColumns,
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
  },
});

// ================================ TABLE STATE - Cases ================================
export const { setVksCasesTableColumns, clearVksCasesTableColumns } =
  vksSlice.actions;
export const selectVksCasesTableColumns = (state: RootState) =>
  state.equity.objectTableColumns;

export default vksSlice.reducer;
