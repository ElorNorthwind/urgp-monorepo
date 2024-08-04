import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@urgp/shared/entities';
import { RootState } from '../store';

type UserState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  loading: boolean;
  success: boolean;
};

const initialState: UserState = {
  user: null,
  accessToken: null as string | null,
  refreshToken: null,
  // likely not needed here
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, accessToken, refreshToken },
      }: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
  },
  //   extraReducers: {},
});

export const { setCredentials } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
