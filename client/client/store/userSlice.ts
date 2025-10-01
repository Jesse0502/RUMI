import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface UserInfoInterface {
  _id: string;
  fullName: string;
  email: string;
  photo_url: string | null;
  resume_url: string | null;
  created_at: number;
  attributes: {
    dob: string;
    location: {
      city: string;
      region: string;
      country: string;
      lat: number;
      lon: number;
    };
    industries: string[];
    interests: string[];
    skills: string[];
    personality: string[];
    additional_attributes: string[];
  };
}

export interface UserState {
  isLoggedIn: boolean;
  token: null | string;
  userInfo?: UserInfoInterface | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  token: "",
  userInfo: {
    _id: "",
    fullName: "",
    email: "",
    photo_url: null,
    resume_url: null,
    created_at: 0,
    attributes: {
      dob: "",
      location: {
        city: "",
        region: "",
        country: "",
        lat: 0,
        lon: 0,
      },
      industries: [],
      interests: [],
      skills: [],
      personality: [],
      additional_attributes: [],
    },
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload.userInfo || null;
      console.log("User logged in, state updated:", state, action.payload);
    },

    logOut: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});
// Action creators are generated for each case reducer function
export const { logIn, logOut } = userSlice.actions;

export default userSlice.reducer;
