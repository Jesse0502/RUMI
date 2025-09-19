import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Logo from "@/components/Logo";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Professional Login Step
const LoginStep = ({
  onNext,
  onSignupMode,
}: {
  onNext: () => void;
  onSignupMode: () => void;
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center section-padding">
    <div className="content-width-narrow">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Logo starColor="text-rumi-purple" textColor="text-rumi-purple" />
          <h2 className="text-heading-3 my-3 text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-body text-gray-600">
            Connect through meaningful letters and authentic conversations
          </p>
        </div>

        {/* Login Card */}
        <div className="card-elevated p-8 space-y-6">
          <div className="space-y-4">
            <button
              onClick={onSignupMode}
              className="w-full btn-primary text-center py-4 text-lg"
            >
              Create Account
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            <button
              onClick={onNext}
              className="w-full btn-secondary flex items-center justify-center gap-3 py-4 text-lg"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/8f04f09d789e2a52b26c8e9f7a9614d726d0a67e?width=82"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  </div>
);

// Professional Signup Step
const SignupStep = ({
  onNext,
  onBack,
  formData,
  setFormData,
}: {
  onNext: () => void;
  onBack: () => void;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center section-padding">
    <div className="content-width-narrow">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <h1 className="text-4xl font-display font-bold text-rumi-purple">
              rumi
            </h1>
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-heading-3 text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-body text-gray-600">
            Join a community of thoughtful letter writers
          </p>
        </div>

        {/* Signup Card */}
        <div className="card-elevated p-8 space-y-6">
          <div className="space-y-4 ">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  className="input-field pl-10 sm:w-96"
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
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={onNext}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Professional Upload Step
const UploadStep = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center section-padding">
    <div className="content-width-narrow">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <h1 className="text-4xl font-display font-bold text-rumi-purple">
              rumi
            </h1>
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-heading-3 text-gray-900 mb-2">
            Add a profile photo
          </h2>
          <p className="text-body text-gray-600">
            Help others connect with you through a friendly profile picture
          </p>
        </div>

        {/* Upload Card */}
        <div className="card-elevated p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-rumi-purple transition-colors group cursor-pointer">
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-rumi-purple mx-auto mb-2 transition-colors" />
                <p className="text-sm text-gray-500 group-hover:text-rumi-purple transition-colors">
                  Click to upload
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Recommended: Square image, at least 400x400px
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG or GIF up to 10MB
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="btn-secondary flex-1 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={onNext}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Professional Success Step
const SuccessStep = ({ onNext }: { onNext: () => void }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center section-padding">
    <div className="content-width-narrow">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <h1 className="text-4xl font-display font-bold text-rumi-purple">
              rumi
            </h1>
            <span className="text-2xl">✨</span>
          </div>
        </div>

        {/* Success Card */}
        <div className="card-elevated p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <div className="space-y-3">
            <h2 className="text-heading-3 text-gray-900">Welcome to Rumi!</h2>
            <p className="text-body text-gray-600">
              Your account has been created successfully. You're ready to start
              writing letters and making meaningful connections.
            </p>
          </div>

          <div className="bg-rumi-purple-50 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-semibold text-rumi-purple mb-2">Next steps:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rumi-purple rounded-full"></span>
                Complete your profile
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rumi-purple rounded-full"></span>
                Write your first letter
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-rumi-purple rounded-full"></span>
                Discover interesting conversations
              </li>
            </ul>
          </div>

          <button onClick={onNext} className="w-full btn-primary py-4 text-lg">
            Start Writing →
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function OnboardingNew() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const steps = [
    { component: LoginStep, name: "login" },
    { component: SignupStep, name: "signup" },
    { component: UploadStep, name: "upload" },
    { component: SuccessStep, name: "success" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and go to main app
      navigate("/past-letters");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignupMode = () => {
    setCurrentStep(1); // Go to signup step
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <CurrentStepComponent
      onNext={handleNext}
      onBack={handleBack}
      onSignupMode={handleSignupMode}
      formData={formData}
      setFormData={setFormData}
    />
  );
}
