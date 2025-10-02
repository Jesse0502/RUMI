// src/components/AuthGuard.tsx
import { useGetUserInfoQuery } from "@/store/apis/userApi";
import { logIn } from "@/store/userSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const isLocalhost = window.location.hostname === "localhost";

  // ⚡ Only run query if token exists and not on localhost
  const { data, error, isLoading } = useGetUserInfoQuery(undefined, {
    skip: !token || isLocalhost,
  });

  // Handle invalid token
  useEffect(() => {
    if (!token && !isLocalhost) {
      // allow only homepage, onboarding, and waitlist
      if (
        location.pathname !== "/" &&
        location.pathname !== "/onboarding" &&
        location.pathname !== "/waitlist"
      ) {
        navigate("/waitlist");
      }
      return;
    }

    if (error && !isLocalhost) {
      localStorage.removeItem("token");
      navigate("/get-started");
    }
  }, [error, token, isLocalhost, location.pathname]);

  // Handle valid token
  useEffect(() => {
    if (data && !isLocalhost) {
      dispatch(logIn({ token: data.token!, userInfo: data.userInfo }));
      if (location.pathname === "/" || location.pathname === "/get-started") {
        navigate("/feed");
      }
    }
  }, [data, isLocalhost, location.pathname]);

  if (isLoading && !isLocalhost) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rumi-purple border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
