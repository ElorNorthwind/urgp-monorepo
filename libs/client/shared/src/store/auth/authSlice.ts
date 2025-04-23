import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@urgp/shared/entities';
import { RootState } from '../store';
import { lsKeys } from '../../config/localStorageKeys';

type UserState = {
  user: (User | null) & { realUser?: User };
  poseAsUser: User | null;
};

export const guestUser = {
  id: 0,
  login: 'guest',
  fio: 'Гость',
  roles: ['guest'],
  controlData: {
    roles: [],
    approveTo: [],
    controlTo: [],
    priority: 0,
    // approvers: { cases: [], problems: [], operations: [] },
  },
  tokenVersion: 0,
};

const initialUser =
  JSON.parse(localStorage.getItem(lsKeys.USER_KEY)) || guestUser;

const initialPoseUser =
  JSON.parse(localStorage.getItem(lsKeys.POSE_USER_KEY)) || null;

export const initialUserState: UserState = {
  user: initialUser,
  poseAsUser: initialPoseUser, // { ...initialUser, id: 60, fio: 'Позер' }, // initialPoseUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialUserState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      localStorage.setItem(lsKeys.USER_KEY, JSON.stringify(payload));
      state.user = payload;
    },
    clearUser: (state) => {
      localStorage.removeItem(lsKeys.USER_KEY);
      state.user = guestUser;
    },
    setPoseUser: (state, { payload }: PayloadAction<User>) => {
      localStorage.setItem(lsKeys.POSE_USER_KEY, JSON.stringify(payload));
      state.user = payload;
    },
    clearPoseUser: (state) => {
      localStorage.removeItem(lsKeys.POSE_USER_KEY);
      state.user = guestUser;
    },
  },

  //   extraReducers: {},
});

export const { setUser, clearUser, setPoseUser, clearPoseUser } =
  authSlice.actions;
export const selectCurrentUser = (state: RootState) =>
  state.auth?.poseAsUser
    ? { ...state.auth.poseAsUser, realUser: state.auth.user }
    : state.auth.user;
export const selectUserApproveTo = (state: RootState) =>
  state.auth?.poseAsUser
    ? { ...state.auth.poseAsUser?.controlData?.approveTo }
    : state.auth.user.controlData?.approveTo;
export default authSlice.reducer;
