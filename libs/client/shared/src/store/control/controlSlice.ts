import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Case, ControlStage } from '@urgp/shared/entities';
import { RootState } from '../store';

type ControlState = {
  editStage: 'new' | ControlStage | null;
  editCase: 'new' | Case | null;
};

const initialState: ControlState = {
  editStage: null,
  editCase: null,
};

const controlSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    setEditStage: (
      state,
      { payload }: PayloadAction<'new' | ControlStage | null>,
    ) => {
      state.editStage = payload;
    },
    setEditCase: (state, { payload }: PayloadAction<'new' | Case | null>) => {
      state.editCase = payload;
    },
  },

  //   extraReducers: {},
});

export const { setEditCase, setEditStage } = controlSlice.actions;
export const selectEditCase = (state: RootState) => state.control.editCase;
export const selectEditStage = (state: RootState) => state.control.editStage;
export default controlSlice.reducer;
