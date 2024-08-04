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
  loading: false,
  user: null, // for user object
  accessToken: null as string | null, // for storing the JWT
  refreshToken: null, // for storing the JWT
  error: null,
  success: false, // for monitoring the registration process.
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

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { loginByUserName } from "../services/loginByUserName/loginByUserName";
// import { LoginSchema } from "../types/loginSchema";

// const initialState: LoginSchema = {
//   username: "",
//   password: "",
//   isLoading: false,
// };

// export const loginSlice = createSlice({
//   name: "login",
//   initialState,
//   reducers: {
//     setUsername: (state, action: PayloadAction<string>) => {
//       state.username = action.payload;
//     },
//     setPassword: (state, action: PayloadAction<string>) => {
//       state.password = action.payload;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       .addCase(loginByUserName.pending, (state) => {
//         state.error = undefined;
//         state.isLoading = true;
//       })
//       .addCase(loginByUserName.fulfilled, (state, action) => {
//         state.isLoading = false;
//       })
//       .addCase(loginByUserName.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // Action creators are generated for each case reducer function
// export const { actions: loginActions } = loginSlice;
// export const { reducer: loginReducer } = loginSlice;
