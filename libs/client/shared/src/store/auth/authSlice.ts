import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@urgp/shared/entities';
import { RootState } from '../store';

type UserState = {
  user: User | null;
};

const guestUser = {
  id: 0,
  login: 'guest',
  fio: 'Гость',
  roles: ['guest'],
  tokenVersion: 0,
};

const initialUser = JSON.parse(localStorage.getItem('user')) || guestUser;

const initialState: UserState = {
  user: initialUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      localStorage.setItem('user', JSON.stringify(payload));
      state.user = payload;
    },
    clearUser: (state) => {
      localStorage.removeItem('user');
      state.user = guestUser;
    },
  },

  //   extraReducers: {},
});

export const { setUser, clearUser } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
