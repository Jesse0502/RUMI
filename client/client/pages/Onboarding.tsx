import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAnalysisStep, {
  AttributesData,
} from "@/components/Onboarding/ProfileAnalysisStep";
import LoginStep from "@/components/Onboarding/LoginStep";
import SignupStep from "@/components/Onboarding/SignupStep";
import UploadStep from "@/components/Onboarding/UploadStep";
import SuccessStep from "@/components/Onboarding/ConfirmDetailsStep";
import Logo from "@/components/common/Logo";
import ExtNavbar from "@/components/Navbar/ExtNavbar";

export interface FormDataInterface {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  resume: File | null;
  attributes: AttributesData;
}

type StepComponentProps = {
  onNext: () => void;
  onBack: () => void;
  onSignupMode?: () => void;
  formData?: FormDataInterface;
  setFormData?: React.Dispatch<React.SetStateAction<FormDataInterface>>;
  currentStep?: number;
  stepCount?: number;
};

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataInterface>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
    resume: null,
    attributes: {
      dob: "",
      location: {
        city: "",
        region: "",
        country: "",
        lat: 0,
        lon: 0,
      },
      additional_attributes: [],
      industries: [],
      interests: [],
      skills: [],
      personality: [],
      bio: "",
    },
  });

  const navigate = useNavigate();

  const steps: {
    component: React.ComponentType<StepComponentProps>;
    name: string;
    label: string;
  }[] = [
    // @ts-ignore
    { component: SignupStep, name: "signup", label: "Signup" },
    // @ts-ignore
    { component: UploadStep, name: "upload", label: "Photo" },
    {
      component: ProfileAnalysisStep,
      name: "profile-analysis",
      label: "Profile",
    },
    { component: SuccessStep, name: "success", label: "Confirm" },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log(formData);
      // navigate("/feed");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignupMode = () => {
    setCurrentStep(1);
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen self-center flex flex-col bg-gray-50">
      <ExtNavbar />

      {/* Stepper */}
      <div className="mt-20 w-full max-w-3xl mx-auto mb-10 px-4">
        <div className="relative">
          {/* progress bar */}
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-rumi-purple rounded-full transition-all"
              style={{
                width: `${(currentStep / Math.max(1, steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* step nodes */}
          <div className="absolute left-0 right-0 top-0 flex items-center justify-between -mt-5">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;

              return (
                <button
                  key={step.name}
                  onClick={() => {
                    if (index <= currentStep) setCurrentStep(index);
                  }}
                  title={step.label}
                  className="flex flex-col items-center focus:outline-none flex-1 min-w-0"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                      isCompleted
                        ? "bg-rumi-purple border-rumi-purple text-white"
                        : isActive
                          ? "bg-white border-rumi-purple text-rumi-purple shadow-lg scale-110"
                          : "bg-white border-gray-200 text-gray-400"
                    }`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs text-center truncate ${
                      isActive
                        ? "text-rumi-purple font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Step Content */}
      <div className="flex-1 flex mb-12 items-center justify-center">
        <CurrentStepComponent
          onNext={handleNext}
          currentStep={currentStep + 1}
          stepCount={steps.length}
          onBack={handleBack}
          onSignupMode={handleSignupMode}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
}
