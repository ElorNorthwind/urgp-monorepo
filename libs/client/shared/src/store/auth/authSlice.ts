import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@urgp/shared/entities';
import { RootState } from '../store';

type UserState = {
  user: User | null;
};

const user = JSON.parse(localStorage.getItem('user')) as User;

const initialState: UserState = {
  user: user || null,
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
      state.user = null;
    },
  },

  //   extraReducers: {},
});

export const { setUser } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
