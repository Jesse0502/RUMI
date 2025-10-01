// services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { get } from "http";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000", // your API
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    console.log("Preparing headers with token:", token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    console.log("Prepared headers:", headers);
    return headers;
  },
});
const baseQueryWithTokenRefresh: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions);

  // 🔥 Intercept header
  const refreshedToken =
    result.meta?.response?.headers.get("X-Refreshed-Token") ||
    result.meta.response.headers.get("Authorization") ||
    "";
  console.log(refreshedToken);
  if (refreshedToken) {
    localStorage.setItem("token", refreshedToken);
  }

  return result;
};

export const userApis = createApi({
  reducerPath: "userApis",
  baseQuery: baseQueryWithTokenRefresh,

  endpoints: (builder) => ({
    getUserInfo: builder.query<any, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
    }),
    updateUserInfo: builder.mutation<any, Partial<any>>({
      query: (data) => ({
        url: "/user/update",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetUserInfoQuery, useUpdateUserInfoMutation } = userApis;
