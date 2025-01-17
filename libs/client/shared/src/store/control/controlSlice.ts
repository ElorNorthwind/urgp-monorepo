import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CaseFormValuesDto,
  ControlDispatch,
  ControlReminder,
  ControlStage,
  Case,
  emptyCase,
  GET_DEFAULT_CONTROL_DUE_DATE,
  ControlStageFormValuesDto,
  emptyStage,
} from '@urgp/shared/entities';
import { RootState } from '../store';

export type DialogFormState = 'create' | 'edit' | 'close';
type ControlState = {
  editStage: 'new' | ControlStage | null;
  editDispatch: 'new' | ControlDispatch | null;
  editReminder: 'new' | ControlReminder | null;
  caseForm: {
    state: DialogFormState;
    values: CaseFormValuesDto & { saved?: boolean };
  };
  stageForm: {
    state: DialogFormState;
    values: ControlStageFormValuesDto & { saved?: boolean };
  };
};

const initialState: ControlState = {
  editStage: null,
  editDispatch: null,
  editReminder: null,
  caseForm: {
    state: 'close',
    values: emptyCase,
  },
  stageForm: {
    state: 'close',
    values: emptyStage,
  },
};

const controlSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    setCaseFormState: (state, { payload }: PayloadAction<DialogFormState>) => {
      state.caseForm.state = payload;
    },
    setCaseFormValuesEmpty: (state) => {
      state.caseForm.values = emptyCase;
    },
    setCaseFormValuesFromCase: (state, { payload }: PayloadAction<Case>) => {
      state.caseForm.values = {
        id: payload?.id,
        class: payload?.class,
        typeId: payload?.payload?.type?.id,
        externalCases: payload?.payload?.externalCases.map((ec) => ({
          ...ec,
          date: new Date(ec.date).toISOString(),
        })),
        directionIds: payload?.payload?.directions?.map((d) => d?.id),
        problemIds: payload?.payload?.problems?.map((p) => p?.id),
        description: payload?.payload?.description,
        fio: payload?.payload?.fio,
        adress: payload?.payload?.adress,
        approverId: payload?.payload?.approver?.id,
        dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
      };
    },
    setCaseFormValuesFromDto: (
      state,
      { payload }: PayloadAction<CaseFormValuesDto & { saved?: boolean }>,
    ) => {
      state.caseForm.values = {
        ...payload,
        // dueDate: payload.dueDate,
      };
    },
    setStageFormState: (state, { payload }: PayloadAction<DialogFormState>) => {
      state.stageForm.state = payload;
    },
    setStageFormCaseId: (state, { payload }: PayloadAction<number>) => {
      state.stageForm.values.caseId = payload;
    },
    setStageFormValuesEmpty: (state) => {
      state.stageForm.values = emptyStage;
    },
    setStageFormValuesFromStage: (
      state,
      { payload }: PayloadAction<ControlStage>,
    ) => {
      state.stageForm.values = {
        id: payload?.id,
        caseId: payload?.caseId,
        class: payload?.class,
        typeId: payload?.payload?.type?.id,
        doneDate: payload?.payload?.doneDate,
        num: payload?.payload?.num,
        description: payload?.payload?.description,
        approverId: payload?.payload?.approver?.id,
      };
    },

    setStageFormValuesFromDto: (
      state,
      {
        payload,
      }: PayloadAction<ControlStageFormValuesDto & { saved?: boolean }>,
    ) => {
      state.stageForm.values = {
        ...payload,
        // dueDate: payload.dueDate,
      };
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

export const {
  setStageFormState,
  setStageFormCaseId,
  setStageFormValuesEmpty,
  setStageFormValuesFromStage,
  setStageFormValuesFromDto,
} = controlSlice.actions;
export const selectStageFormValues = (state: RootState) =>
  state.control.stageForm.values;
export const selectStageFormState = (state: RootState) =>
  state.control.stageForm.state;

export const { setEditStage, setEditDispatch, setEditReminder } =
  controlSlice.actions;
export const selectEditStage = (state: RootState) => state.control.editStage;
export const selectEditDispatch = (state: RootState) =>
  state.control.editDispatch;
export const selectEditReminder = (state: RootState) =>
  state.control.editReminder;
export default controlSlice.reducer;
