import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, LogIn } from "lucide-react";
import ExtNavbar from "@/components/Navbar/ExtNavbar";
import { useLoginMutation } from "@/store/apis/generalApi";
import { useToaster } from "@/components/common/Toaster";
import { Eye, EyeOff } from "lucide-react";
import { logIn } from "@/store/userSlice";
import { useDispatch } from "react-redux";
export default function GetStartedPage() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToaster();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password });
      console.log(result);
      if (result.error === undefined) {
        console.log("Login successful:", result.data);
        showToast("Login successful!", "success");
        localStorage.setItem("token", result.data?.token || "");
        dispatch(logIn({ userInfo: result.data?.user }));
        navigate("/feed");
        // Handle successful login
      } else {
        // Handle login error
        showToast(
          result.error?.data?.detail || "Failed to log in. Please try again.",
          "error",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("An error occurred during login. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <ExtNavbar /> {/* 👈 now it shows on every get-started page */}
      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md bg-white shadow-lg rounded-lg p-8">
          {/* Back Button (only on signup-choice mode) */}

          <>
            <h1 className="text-3xl font-bold text-center text-rumi-purple mb-6">
              Login
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field w-full pr-10" // 👈 add padding for button
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-rumi-purple"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                {isLoading ? "Logging In..." : "Log In"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Don’t have an account?{" "}
              <button
                onClick={() => {
                  navigate("/onboarding");
                }}
                className="text-rumi-purple font-medium hover:underline"
              >
                Get started
              </button>
            </p>
          </>
        </div>
      </div>
    </div>
  );
}
