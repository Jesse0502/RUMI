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

  // Run query only if token exists and not localhost
  const { data, error, isLoading } = useGetUserInfoQuery(undefined, {
    skip: !token || isLocalhost,
  });

  useEffect(() => {
    if (isLocalhost) return; // full access in localhost

    // ✅ If no token
    if (!token) {
      const allowedPaths = ["/waitlist"];
      if (!allowedPaths.includes(location.pathname)) {
        navigate("/waitlist", { replace: true });
      }
      return;
    }

    // ✅ If token but error
    if (error) {
      localStorage.removeItem("token");
      navigate("/waitlist", { replace: true });
      return;
    }

    // ✅ If valid token
    if (data) {
      dispatch(logIn({ token: data.token!, userInfo: data.userInfo }));
      if (location.pathname === "/" || location.pathname === "/get-started") {
        navigate("/feed", { replace: true });
      }
    }
  }, [token, error, data, location.pathname, isLocalhost, navigate, dispatch]);

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
