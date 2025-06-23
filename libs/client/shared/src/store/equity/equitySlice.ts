import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisibilityState } from '@tanstack/react-table';
import { RootState } from '../store';

import {
  defaultEquityObjectsColumns,
  defaultIncidentColumns,
} from '@urgp/client/entities';
import { lsKeys } from '../../config/localStorageKeys';

type EquityState = {
  objectTableColumns: VisibilityState;
};

const initialEquityObjectsTableColumns =
  JSON.parse(localStorage.getItem(lsKeys.EQUITY_OBJECTS_TABLE_KEY)) ||
  defaultEquityObjectsColumns;

const initialState: EquityState = {
  objectTableColumns: initialEquityObjectsTableColumns,
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
  },
});

// ================================ TABLE STATE ================================
export const { setEquityObjectTableColumns, clearEquityObjectTableColumns } =
  equitySlice.actions;
export const selectEquityObjectTableColumns = (state: RootState) =>
  state.equity.objectTableColumns;

export default equitySlice.reducer;
