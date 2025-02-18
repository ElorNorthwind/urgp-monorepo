import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VisibilityState } from '@tanstack/react-table';
import {
  ApproveFormDto,
  ApproveFormState,
  CaseFormDto,
  CaseFull,
  ControlOptions,
  DialogFormState,
  emptyApproveData,
  emptyIncident,
  emptyDispatch,
  emptyReminder,
  emptyStage,
  EscalateFormState,
  GET_DEFAULT_CONTROL_DUE_DATE,
  OperationFormDto,
  OperationFull,
  User,
  emptyProblem,
  CaseClasses,
} from '@urgp/shared/entities';
import { RootState } from '../store';

import {
  defaultIncidentColumns,
  defaultPendingColumns,
  defaultProblemColumns,
} from '@urgp/client/entities';
import { lsKeys } from '../../config/localStorageKeys';
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
    authorId: payload?.author?.id || null,

    approveToId: payload?.approveTo?.id || null,
    approveStatus: payload?.approveStatus || 'project',
    approveDate: new Date(payload?.approveDate).toISOString(),
    approveNotes: payload?.approveNotes || '',

    constolFromId: payload?.controlFrom?.id || null,
    controlToId: payload?.controlTo?.id || null,

    controller: ControlOptions.author,
  };
};

// const initialUser =
//   JSON.parse(localStorage.getItem(lsKeys.USER_KEY)) || guestUser;

// export const initialUserState: UserState = {
//   user: initialUser,
// };

type ControlState = {
  caseForm: {
    state: DialogFormState;
    values: CaseFormDto & { saved?: boolean };
  };
  problemForm: {
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
    values: ApproveFormDto;
  };
  escalateForm: {
    state: EscalateFormState;
    caseId: number;
  };
  tableColumns: {
    incident: VisibilityState;
    pending: VisibilityState;
    problem: VisibilityState;
  };
  user: User | null;
};

const initialIncidentTableColumns =
  JSON.parse(localStorage.getItem(lsKeys.INCIDENT_TABLE_KEY)) ||
  defaultIncidentColumns;

const initialPendingTableColumns =
  JSON.parse(localStorage.getItem(lsKeys.PENDING_TABLE_KEY)) ||
  defaultPendingColumns;

const initialProblemTableColumns =
  JSON.parse(localStorage.getItem(lsKeys.PROBLEM_TABLE_KEY)) ||
  defaultProblemColumns;

const initialState: ControlState = {
  caseForm: {
    state: DialogFormState.close,
    values: emptyIncident,
  },
  problemForm: {
    state: DialogFormState.close,
    values: emptyProblem,
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
    values: emptyApproveData,
  },
  escalateForm: {
    state: EscalateFormState.close,
    caseId: 0,
  },
  tableColumns: {
    incident: initialIncidentTableColumns,
    pending: initialPendingTableColumns,
    problem: initialProblemTableColumns,
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
      state.caseForm.values = { ...emptyIncident, authorId: state.user?.id };
    },
    setCaseFormValuesFromCase: (
      state,
      { payload }: PayloadAction<CaseFull>,
    ) => {
      state.caseForm.values = {
        id: payload?.id,
        authorId: payload?.author?.id,
        class: payload?.class,
        typeId: payload?.type?.id,
        externalCases: payload?.externalCases.map((ec) => ({
          ...ec,
          date: new Date(ec.date).toISOString(),
        })),
        directionIds: payload?.directions?.map((d) => d?.id) || [],
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
      state.caseForm.values = { ...payload, authorId: state.user?.id };
    },
    // =============================== PROBLEM ===============================
    setProblemFormState: (
      state,
      { payload }: PayloadAction<DialogFormState>,
    ) => {
      state.problemForm.state = payload;
    },
    setProblemFormValuesEmpty: (state) => {
      state.problemForm.values = { ...emptyProblem, authorId: state.user?.id };
    },
    setProblemFormValuesFromProblem: (
      state,
      { payload }: PayloadAction<CaseFull>,
    ) => {
      state.problemForm.values = {
        id: payload?.id,
        authorId: payload?.author?.id,
        class: payload?.class || CaseClasses.problem,
        typeId: payload?.type?.id || 5,
        externalCases: payload?.externalCases.map((ec) => ({
          ...ec,
          date: new Date(ec.date).toISOString(),
        })),
        directionIds: payload?.directions?.map((d) => d?.id) || [],
        title: payload?.title || '', // short_title
        notes: payload?.notes || '', // descrition
        extra: payload?.extra || '', // extra_title
        approveToId: payload?.approveTo?.id,
        approveStatus: payload?.approveStatus,
        approveDate: new Date(payload?.approveDate).toISOString(),
        approveNotes: payload?.approveNotes,
        dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
      };
    },

    setProblemFormValuesFromDto: (
      state,
      { payload }: PayloadAction<CaseFormDto & { saved?: boolean }>,
    ) => {
      state.problemForm.values = { ...payload, authorId: state.user?.id };
    },
    // ================================= STAGE =================================
    setStageFormState: (state, { payload }: PayloadAction<DialogFormState>) => {
      state.stageForm.state = payload;
    },
    setStageFormCaseId: (state, { payload }: PayloadAction<number>) => {
      state.stageForm.values.caseId = payload;
    },
    setStageFormValuesEmpty: (state) => {
      state.stageForm.values = { ...emptyStage, authorId: state.user?.id };
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
      state.dispatchForm.values = {
        ...emptyDispatch,
        authorId: state.user?.id,
      };
    },
    setDispatchFormValuesFromDispatch: (
      state,
      { payload }: PayloadAction<OperationFull>,
    ) => {
      state.dispatchForm.values = {
        ...operationToForm(payload),
        extra: 'Без переноса срока',
        controller:
          payload?.controlFrom?.id === state?.user?.id
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
        authorId: state?.user?.id,
        controlFromId:
          payload?.controller === ControlOptions.author
            ? state?.user?.id
            : payload?.controller === ControlOptions.executor
              ? payload?.controlToId
              : payload?.controlFromId,
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
      state.reminderForm.values = {
        ...emptyReminder,
        authorId: state.user?.id,
      };
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
        authorId: state?.user?.id,
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
    setApproveFormValuesEmpty: (state) => {
      state.approveForm.values = emptyApproveData;
    },
    setApproveFormValuesFromEntity: (
      state,
      { payload }: PayloadAction<OperationFull | CaseFull>,
    ) => {
      state.approveForm.values = {
        id: payload.id || 0,
        approveToId: payload?.approveTo?.id || 0,
        approveNotes: payload?.approveNotes || '',
        dueDate:
          ('dueDate' in payload && payload?.dueDate) ||
          GET_DEFAULT_CONTROL_DUE_DATE(),
      };
    },
    setApproveFormValuesFromDto: (
      state,
      { payload }: PayloadAction<ApproveFormDto>,
    ) => {
      state.approveForm.values = payload;
    },

    // ================================= ESCALATE =================================
    setEscalateFormState: (
      state,
      { payload }: PayloadAction<EscalateFormState>,
    ) => {
      state.escalateForm.state = payload;
    },
    setEscalateFormCaseId: (state, { payload }: PayloadAction<number>) => {
      state.escalateForm.caseId = payload;
    },
    // =============================== TABLE STATE ================================
    setIncidentTableColumns: (
      state,
      { payload }: PayloadAction<VisibilityState>,
    ) => {
      localStorage.setItem(lsKeys.INCIDENT_TABLE_KEY, JSON.stringify(payload));
      state.tableColumns.incident = payload;
    },
    setPendingTableColumns: (
      state,
      { payload }: PayloadAction<VisibilityState>,
    ) => {
      localStorage.setItem(lsKeys.PENDING_TABLE_KEY, JSON.stringify(payload));
      state.tableColumns.pending = payload;
    },
    setProblemTableColumns: (
      state,
      { payload }: PayloadAction<VisibilityState>,
    ) => {
      localStorage.setItem(lsKeys.PROBLEM_TABLE_KEY, JSON.stringify(payload));
      state.tableColumns.problem = payload;
    },
    clearIncidentTableColumns: (state) => {
      localStorage.removeItem(lsKeys.INCIDENT_TABLE_KEY);
      state.tableColumns.incident = defaultIncidentColumns;
    },
    clearPendingTableColumns: (state) => {
      localStorage.removeItem(lsKeys.PENDING_TABLE_KEY);
      state.tableColumns.pending = defaultPendingColumns;
    },
    clearProblemTableColumns: (state) => {
      localStorage.removeItem(lsKeys.PROBLEM_TABLE_KEY);
      state.tableColumns.problem = defaultProblemColumns;
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

// ================================= PROBLEM =================================
export const {
  setProblemFormState,
  setProblemFormValuesEmpty,
  setProblemFormValuesFromProblem,
  setProblemFormValuesFromDto,
} = controlSlice.actions;

export const selectProblemFormValues = (state: RootState) =>
  state.control.problemForm.values;
export const selectProblemFormState = (state: RootState) =>
  state.control.problemForm.state;
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
export const {
  setApproveFormState,
  setApproveFormValuesEmpty,
  setApproveFormValuesFromEntity,
  setApproveFormValuesFromDto,
} = controlSlice.actions;
export const selectApproveFormValues = (state: RootState) =>
  state.control.approveForm.values;
export const selectApproveFormState = (state: RootState) =>
  state.control.approveForm.state;

// ================================= ESCALATE =================================
export const { setEscalateFormState, setEscalateFormCaseId } =
  controlSlice.actions;
export const selectEscalateFormState = (state: RootState) =>
  state.control.escalateForm.state;
export const selectEscalateFormCaseId = (state: RootState) =>
  state.control.escalateForm.caseId;

// ================================ TABLE STATE ================================
export const {
  setIncidentTableColumns,
  setPendingTableColumns,
  setProblemTableColumns,
  clearIncidentTableColumns,
  clearPendingTableColumns,
  clearProblemTableColumns,
} = controlSlice.actions;
export const selectIncidentTableColumns = (state: RootState) =>
  state.control.tableColumns.incident;
export const selectPendingTableColumns = (state: RootState) =>
  state.control.tableColumns.pending;
export const selectProblemTableColumns = (state: RootState) =>
  state.control.tableColumns.problem;

export default controlSlice.reducer;
