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
  DispatchFormValuesDto,
  ReminderFormValuesDto,
  emptyDispatch,
  emptyReminder,
  User,
} from '@urgp/shared/entities';
import { RootState } from '../store';
import { formatISO } from 'date-fns';
import {
  clearUser,
  guestUser,
  initialUserState,
  setUser,
} from '../auth/authSlice';

export type DialogFormState = 'create' | 'edit' | 'close';
export type ApproveFormState = 'operation' | 'case' | 'close';

type ControlState = {
  caseForm: {
    state: DialogFormState;
    values: CaseFormValuesDto & { saved?: boolean };
  };
  stageForm: {
    state: DialogFormState;
    values: ControlStageFormValuesDto & { saved?: boolean };
  };
  dispatchForm: {
    state: DialogFormState;
    values: DispatchFormValuesDto & { saved?: boolean };
  };
  reminderForm: {
    state: DialogFormState;
    values: ReminderFormValuesDto & { saved?: boolean };
  };
  approveForm: {
    state: ApproveFormState;
    entityId: number;
  };
  user: User | null;
};

const initialState: ControlState = {
  caseForm: {
    state: 'close',
    values: emptyCase,
  },
  stageForm: {
    state: 'close',
    values: emptyStage,
  },
  dispatchForm: {
    state: 'close',
    values: emptyDispatch,
  },
  reminderForm: {
    state: 'close',
    values: emptyReminder,
  },
  approveForm: {
    state: 'close',
    entityId: 0,
  },
  user: initialUserState.user,
};

const controlSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    // ================================= CASE =================================
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
    // ================================= STAGE =================================
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
        num: payload?.payload?.num || '',
        description: payload?.payload?.description || '',
        approverId: payload?.payload?.approver?.id,
      };
    },

    setStageFormValuesFromDto: (
      state,
      {
        payload,
      }: PayloadAction<ControlStageFormValuesDto & { saved?: boolean }>,
    ) => {
      state.stageForm.values = payload;
    },

    // ================================= DISPATCH =================================
    setDispatchFormState: (
      state,
      { payload }: PayloadAction<DialogFormState>,
    ) => {
      state.dispatchForm.state = payload;
    },
    setDispatchFormCaseId: (state, { payload }: PayloadAction<number>) => {
      state.dispatchForm.values.caseId = payload;
    },
    setDispatchFormValuesEmpty: (state) => {
      state.dispatchForm.values = emptyDispatch;
    },
    setDispatchFormValuesFromDispatch: (
      state,
      { payload }: PayloadAction<ControlDispatch>,
    ) => {
      state.dispatchForm.values = {
        id: payload?.id,
        caseId: payload?.caseId,
        class: payload?.class,
        typeId: payload?.payload?.type?.id,
        description: payload?.payload?.description,
        dateDescription: 'Без переноса срока', // payload?.payload?.dateDescription,
        dueDate: formatISO(payload?.payload?.dueDate), // new Date(ec.date).toISOString()
        executorId: payload?.payload?.executor?.id,
        controller:
          payload?.payload?.controller?.id === state.user.id
            ? 'author'
            : 'executor',
      };
    },
    setDispatchFormValuesFromDto: (
      state,
      { payload }: PayloadAction<DispatchFormValuesDto & { saved?: boolean }>,
    ) => {
      state.dispatchForm.values = payload;
    },

    // ================================= REMINDER =================================
    setReminderFormState: (
      state,
      { payload }: PayloadAction<DialogFormState>,
    ) => {
      state.reminderForm.state = payload;
    },
    setReminderFormCaseId: (state, { payload }: PayloadAction<number>) => {
      state.reminderForm.values.caseId = payload;
    },
    setReminderFormDueDate: (state, { payload }: PayloadAction<string>) => {
      state.reminderForm.values.dueDate = payload;
    },
    setReminderFormValuesEmpty: (state) => {
      state.reminderForm.values = emptyReminder;
    },
    setReminderFormValuesFromReminder: (
      state,
      { payload }: PayloadAction<ControlReminder>,
    ) => {
      state.reminderForm.values = {
        id: payload?.id,
        caseId: payload?.caseId,
        class: payload?.class,
        typeId: payload?.payload?.type?.id,
        observerId: payload?.payload?.observer?.id || state.user.id,
        description: payload?.payload?.description,
        dueDate: payload?.payload?.dueDate || null, // new Date(ec.date).toISOString()
        doneDate: null, // Потому что редактируя напоминалку - мы возвращаем ее в незакрытое состояние
      };
    },
    setReminderFormValuesFromDto: (
      state,
      { payload }: PayloadAction<ReminderFormValuesDto & { saved?: boolean }>,
    ) => {
      state.reminderForm.values = {
        ...payload,
        observerId:
          payload?.observerId === 0 ? state.user.id : payload?.observerId,
      };
    },

    // ================================= APPROVE =================================
    setApproveFormState: (
      state,
      { payload }: PayloadAction<ApproveFormState>,
    ) => {
      state.approveForm.state = payload;
    },
    setApproveFormEntityId: (state, { payload }: PayloadAction<number>) => {
      state.approveForm.entityId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(clearUser, (state) => {
      state.user = guestUser;
    });
  },
});

// ================================= CASE =================================
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

// ================================= STAGE =================================
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

// ================================= DISPATCH =================================
export const {
  setDispatchFormState,
  setDispatchFormCaseId,
  setDispatchFormValuesEmpty,
  setDispatchFormValuesFromDispatch,
  setDispatchFormValuesFromDto,
} = controlSlice.actions;
export const selectDispatchFormValues = (state: RootState) =>
  state.control.dispatchForm.values;
export const selectDispatchFormState = (state: RootState) =>
  state.control.dispatchForm.state;

// ================================= REMINDER =================================
export const {
  setReminderFormState,
  setReminderFormCaseId,
  setReminderFormDueDate,
  setReminderFormValuesEmpty,
  setReminderFormValuesFromReminder,
  setReminderFormValuesFromDto,
} = controlSlice.actions;
export const selectReminderFormValues = (state: RootState) =>
  state.control.reminderForm.values;
export const selectReminderFormState = (state: RootState) =>
  state.control.reminderForm.state;

// ================================= APPROVE =================================
export const { setApproveFormState, setApproveFormEntityId } =
  controlSlice.actions;
export const selectApproveFormEntityId = (state: RootState) =>
  state.control.approveForm.entityId;
export const selectApproveFormState = (state: RootState) =>
  state.control.approveForm.state;

export default controlSlice.reducer;
