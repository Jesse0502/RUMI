// src/components/AuthGuard.tsx
import { useGetUserInfoQuery } from "@/store/apis/userApi";
import { logIn } from "@/store/userSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetUserInfoQuery();

  useEffect(() => {
    if (!token) {
      return;
    }
    if (error) {
      localStorage.removeItem("token");
      navigate("/get-started"); // back to login/signup
    }
  }, [error]);

  useEffect(() => {
    console.log("AuthProvider data:", data, error);
    if (data) {
      //   console.log("data:", data);
      dispatch(logIn({ token: data.token!, userInfo: data.userInfo }));
      navigate("/feed");
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rumi-purple border-t-transparent"></div>
      </div>
    );
  }
  //   setTimeout(() => {}, 300);
  return <>{children}</>;
};

export default AuthProvider;
