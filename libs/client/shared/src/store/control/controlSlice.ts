import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  emptyCase,
  GET_DEFAULT_CONTROL_DUE_DATE,
  emptyStage,
  emptyDispatch,
  emptyReminder,
  User,
  CaseFull,
  CaseFormDto,
  OperationFormDto,
  OperationFull,
  ControlOptions,
  DialogFormState,
  ApproveFormState,
} from '@urgp/shared/entities';
import { RootState } from '../store';
import { formatISO } from 'date-fns';
import {
  clearUser,
  guestUser,
  initialUserState,
  setUser,
} from '../auth/authSlice';

const operationToForm = (payload: OperationFull) => {
  return {
    id: payload?.id,
    caseId: payload?.caseId,
    class: payload?.class,
    typeId: payload?.type?.id,
    doneDate: new Date(payload?.doneDate).toISOString(),
    dueDate: new Date(payload?.dueDate).toISOString(),
    title: payload?.title || '', // num
    notes: payload?.notes || '', // descrition
    extra: payload?.extra || '', // date_description

    approveToId: payload?.approveTo?.id,
    approveStatus: payload?.approveStatus,
    approveDate: new Date(payload?.approveDate).toISOString(),
    approveNotes: payload?.approveNotes,

    constolFromId: payload?.controlFrom?.id,
    controlToId: payload?.controlTo?.id,

    controller: ControlOptions.author,
  };
};

type ControlState = {
  caseForm: {
    state: DialogFormState;
    values: CaseFormDto & { saved?: boolean };
  };
  stageForm: {
    state: DialogFormState;
    values: OperationFormDto & { saved?: boolean };
  };
  dispatchForm: {
    state: DialogFormState;
    values: OperationFormDto & { saved?: boolean };
  };
  reminderForm: {
    state: DialogFormState;
    values: OperationFormDto & { saved?: boolean };
  };
  approveForm: {
    state: ApproveFormState;
    entityId: number;
  };
  user: User | null;
};

const initialState: ControlState = {
  caseForm: {
    state: DialogFormState.close,
    values: emptyCase,
  },
  stageForm: {
    state: DialogFormState.close,
    values: emptyStage,
  },
  dispatchForm: {
    state: DialogFormState.close,
    values: emptyDispatch,
  },
  reminderForm: {
    state: DialogFormState.close,
    values: emptyReminder,
  },
  approveForm: {
    state: ApproveFormState.close,
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
    setCaseFormValuesFromCase: (
      state,
      { payload }: PayloadAction<CaseFull>,
    ) => {
      state.caseForm.values = {
        id: payload?.id,
        class: payload?.class,
        typeId: payload?.type?.id,
        externalCases: payload?.externalCases.map((ec) => ({
          ...ec,
          date: new Date(ec.date).toISOString(),
        })),
        directionIds: payload?.directions?.map((d) => d?.id),
        title: payload?.title || '', // fio
        notes: payload?.notes || '', // descrition
        extra: payload?.extra || '', // adress
        approveToId: payload?.approveTo?.id,
        approveStatus: payload?.approveStatus,
        approveDate: new Date(payload?.approveDate).toISOString(),
        approveNotes: payload?.approveNotes,
        dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
      };
    },

    setCaseFormValuesFromDto: (
      state,
      { payload }: PayloadAction<CaseFormDto & { saved?: boolean }>,
    ) => {
      state.caseForm.values = payload;
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
      { payload }: PayloadAction<OperationFull>,
    ) => {
      state.stageForm.values = operationToForm(payload);
    },
    setStageFormValuesFromDto: (
      state,
      { payload }: PayloadAction<OperationFormDto & { saved?: boolean }>,
    ) => {
      state.stageForm.values = {
        ...payload,
        controlFromId: null,
      };
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
      { payload }: PayloadAction<OperationFull>,
    ) => {
      state.dispatchForm.values = {
        ...operationToForm(payload),
        extra: 'Без переноса срока',
        controller:
          payload.controlFrom.id === state.user.id
            ? ControlOptions.author
            : ControlOptions.executor,
      };
    },
    setDispatchFormValuesFromDto: (
      state,
      { payload }: PayloadAction<OperationFormDto & { saved?: boolean }>,
    ) => {
      state.dispatchForm.values = {
        ...payload,
        controlFromId:
          payload.controller === ControlOptions.author
            ? state.user.id
            : payload.controller === ControlOptions.executor
              ? payload.controlToId
              : payload.controlFromId,
      };
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
    setReminderFormType: (state, { payload }: PayloadAction<11 | 12>) => {
      state.reminderForm.values.typeId = payload;
    },
    setReminderFormValuesEmpty: (state) => {
      state.reminderForm.values = emptyReminder;
    },
    setReminderFormValuesFromReminder: (
      state,
      { payload }: PayloadAction<OperationFull>,
    ) => {
      state.reminderForm.values = {
        ...operationToForm(payload),
        doneDate: null,
      };
    },
    setReminderFormValuesFromDto: (
      state,
      { payload }: PayloadAction<OperationFormDto & { saved?: boolean }>,
    ) => {
      state.reminderForm.values = {
        ...payload,
      };
      //  {
      //   ...payload,
      //   controlFromId:
      //     payload?.observerId === 0 ? state.user.id : payload?.observerId,
      // };
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
