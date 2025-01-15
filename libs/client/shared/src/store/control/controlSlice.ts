import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  caseFormValuesDto,
  CaseFormValuesDto,
  ControlDispatch,
  ControlReminder,
  ControlStage,
  Case,
  emptyCase,
} from '@urgp/shared/entities';
import { RootState } from '../store';

type FormState = 'create' | 'edit' | 'close';
type ControlState = {
  editStage: 'new' | ControlStage | null;
  editDispatch: 'new' | ControlDispatch | null;
  editReminder: 'new' | ControlReminder | null;
  editCase: 'new' | Case | null;
  caseForm: {
    state: FormState;
    values: CaseFormValuesDto & { saved?: boolean };
  };
};

const initialState: ControlState = {
  editStage: null,
  editDispatch: null,
  editReminder: null,
  editCase: null,
  caseForm: {
    state: 'close',
    values: emptyCase,
  },
};

const controlSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    setCaseFormState: (state, { payload }: PayloadAction<FormState>) => {
      state.caseForm.state = payload;
    },
    setCaseFormValuesEmpty: (state) => {
      state.caseForm.values = emptyCase;
    },
    setCaseFormValuesFromCase: (state, { payload }: PayloadAction<Case>) => {
      state.caseForm.values = caseFormValuesDto.safeParse({
        id: payload?.id,
        class: payload?.class,
        typeId: payload?.payload?.type?.id,
        externalCases: payload?.payload?.externalCases,
        directionIds: payload?.payload?.directions?.map((d) => d?.id),
        problemIds: payload?.payload?.problems?.map((p) => p?.id),
        description: payload?.payload?.description,
        fio: payload?.payload?.fio,
        adress: payload?.payload?.adress,
        approverId: payload?.payload?.approver?.id,
      }).data;
    },
    setCaseFormValuesFromDto: (
      state,
      { payload }: PayloadAction<CaseFormValuesDto & { saved?: boolean }>,
    ) => {
      state.caseForm.values = payload; // caseFormValuesDto.safeParse(payload).data;
    },

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

export const {
  setCaseFormState,
  setCaseFormValuesEmpty,
  setCaseFormValuesFromCase,
  setCaseFormValuesFromDto,
} = controlSlice.actions;
export const selectCaseFormValues = (state: RootState) =>
  state.control.caseForm.values;
export const selectCaseFormState = (state: RootState) =>
  state.control.caseForm.state;

export const { setEditCase, setEditStage, setEditDispatch, setEditReminder } =
  controlSlice.actions;
export const selectEditCase = (state: RootState) => state.control.editCase;
export const selectEditStage = (state: RootState) => state.control.editStage;
export const selectEditDispatch = (state: RootState) =>
  state.control.editDispatch;
export const selectEditReminder = (state: RootState) =>
  state.control.editReminder;
export default controlSlice.reducer;
