import { useCheckEmailMutation } from "@/store/apis/generalApi";
import { useState } from "react";
import Logo from "../common/Logo";
import { ArrowLeft, ArrowRight, Lock, Mail, User } from "lucide-react";
import { FormDataInterface } from "@/pages/Onboarding";

const SignupStep = ({
  onNext,
  onBack,
  formData,
  setFormData,
  onSignupMode,
  stepCount,
  currentStep,
}: {
  onNext: () => void;
  onBack: () => void;
  formData: FormDataInterface;
  setFormData: React.Dispatch<React.SetStateAction<FormDataInterface>>;
  onSignupMode: () => void;
  stepCount?: number;
  currentStep?: number;
}) => {
  const [fullName, setFullName] = useState(formData.fullName || "Alex Smith");
  const [email, setEmail] = useState(formData.email || "alexsmith@example.com");
  const [password, setPassword] = useState(
    formData.password || "password12345",
  );
  const [confirmPassword, setConfirmPassword] = useState(
    formData.confirmPassword || "password12345",
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkEmail, { data, isLoading: isChecking }] = useCheckEmailMutation();
  const [showPassword, setShowPassword] = useState(false);
  const nextStep = () => {
    setError("");
    if (!fullName || !email || !password || !confirmPassword) {
      // Handle validation error
      setError("All fields are required");
      return;
    }
    if (password.length < 9) {
      // Handle password mismatch
      setError("Password must be 9 characters long");
      return;
    }
    if (password !== confirmPassword) {
      // Handle password mismatch
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    if (formData.email === email) {
      setFormData((prev) => ({
        ...prev,
        fullName,
        email,
        password,
        confirmPassword,
      }));
      setIsLoading(false);
      onNext();
      return;
    }
    checkEmail(email)
      .unwrap()
      .then((res) => {
        // @ts-ignore
        if (res?.status !== 200) {
          setError(res?.msg || "Email check failed");
          setIsLoading(false);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          fullName,
          email,
          password,
          confirmPassword,
        }));
        setIsLoading(false);
        onNext();
      })
      .catch((err) => {
        console.error("Error checking email:", err);
        setError(err.data?.msg || "Error checking email");
        setIsLoading(false);
      });

    // setFormData((prev) => ({
    //   ...prev,
    //   fullName,
    //   email,
    //   password,
    //   confirmPassword,
    // }));
    // setIsLoading(false);
    // onNext();
  };
  return (
    <div className=" bg-gray-50 flex items-center justify-center section-padding">
      <div className="content-width-narrow w-full max-w-xl">
        <div className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="p-6 border-b flex items-center gap-4">
            <div className="rounded-md bg-purple-50 p-3">
              <span className="text-2xl text-purple-600">✦</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Create your account
              </h2>
              <p className="text-sm text-gray-600">
                Join a community of thoughtful letter writers
              </p>
            </div>
            <div className="ml-auto text-sm text-gray-500">
              Step {currentStep} of {stepCount}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              nextStep();
            }}
            className="p-6 space-y-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pl-10 pr-14 w-full"
                    />
                    <span
                      className="absolute bg-gray-200 p-1 rounded-md right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 cursor-pointer select-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field pl-10 w-full"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              {/* <button
                type="button"
                onClick={onBack}
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button> */}
              <button
                type="submit"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupStep;
