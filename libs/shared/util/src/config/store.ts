import { configureStore } from '@reduxjs/toolkit';
import { rtkApi } from '../api/rtkApi';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  reducer: { [rtkApi.reducerPath]: rtkApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;