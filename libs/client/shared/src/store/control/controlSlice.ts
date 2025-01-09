import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Case,
  ControlDispatch,
  ControlReminder,
  ControlStage,
} from '@urgp/shared/entities';
import { RootState } from '../store';

type ControlState = {
  editStage: 'new' | ControlStage | null;
  editDispatch: 'new' | ControlDispatch | null;
  editReminder: 'new' | ControlReminder | null;
  editCase: 'new' | Case | null;
};

const initialState: ControlState = {
  editStage: null,
  editDispatch: null,
  editReminder: null,
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

    setEditDispatch: (
      state,
      { payload }: PayloadAction<'new' | ControlDispatch | null>,
    ) => {
      state.editDispatch = payload;
    },
    setEditReminder: (
      state,
      { payload }: PayloadAction<'new' | ControlReminder | null>,
    ) => {
      state.editReminder = payload;
    },
    setEditCase: (state, { payload }: PayloadAction<'new' | Case | null>) => {
      state.editCase = payload;
    },
    //   extraReducers: {},
  },
});

export const { setEditCase, setEditStage, setEditDispatch, setEditReminder } =
  controlSlice.actions;
export const selectEditCase = (state: RootState) => state.control.editCase;
export const selectEditStage = (state: RootState) => state.control.editStage;
export const selectEditDispatch = (state: RootState) =>
  state.control.editDispatch;
export const selectEditReminder = (state: RootState) =>
  state.control.editReminder;
export default controlSlice.reducer;
