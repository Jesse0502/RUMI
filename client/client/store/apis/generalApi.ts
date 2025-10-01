// services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const generalApis = createApi({
  reducerPath: "generalApis",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  endpoints: (builder) => ({
    extractSkills: builder.mutation<{ skills: string[] }, File>({
      query: (resumeFile) => {
        const formData = new FormData();
        formData.append("resume", resumeFile);

        return {
          url: "/gen/extract-skills",
          method: "POST",
          body: formData,
        };
      },
    }),
    checkEmail: builder.mutation<{ email: string; msg: string }, string>({
      query: (email) => ({
        url: "/gen/check-email",
        method: "POST",
        body: { email },
      }),
    }),
    submitOnboarding: builder.mutation<
      { success: boolean; userId: string },
      {
        fullName: string;
        email: string;
        password: string;
        attributes: any;
        resume?: File;
        profilePhoto?: File;
      }
    >({
      query: ({
        fullName,
        email,
        password,
        attributes,
        resume,
        profilePhoto,
      }) => {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("attributes", JSON.stringify(attributes));

        if (resume) formData.append("resume", resume);
        if (profilePhoto) formData.append("photo", profilePhoto);

        return {
          url: "/gen/create-user",
          method: "POST",
          body: formData,
        };
      },
    }),
    login: builder.mutation<
      { user: any; status: number },
      { email: string; password: string }
    >({
      query: ({ email, password }) => ({
        url: "/gen/login",
        method: "POST",
        body: { email, password },
      }),
    }),
  }),
});

export const {
  useExtractSkillsMutation,
  useSubmitOnboardingMutation,
  useCheckEmailMutation,
  useLoginMutation,
} = generalApis;
