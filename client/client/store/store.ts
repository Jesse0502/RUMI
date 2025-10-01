import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./userSlice.ts";
import { userApis } from "./apis/userApi.ts";
import { generalApis } from "./apis/generalApi.ts";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    [userApis.reducerPath]: userApis.reducer,
    [generalApis.reducerPath]: generalApis.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApis.middleware, generalApis.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
