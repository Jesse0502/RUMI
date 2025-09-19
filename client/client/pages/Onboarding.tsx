import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Step components
const LoginStep = ({
  onNext,
  onSignupMode,
}: {
  onNext: () => void;
  onSignupMode: () => void;
}) => (
  <div className="min-h-screen bg-rumi-purple/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Enhanced Background decorations */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 right-8 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute top-32 right-12 text-white text-4xl animate-bounce">
        ✨
      </div>
      <div className="absolute bottom-20 -left-10 w-40 h-40 bg-white rounded-full opacity-5 animate-pulse animation-delay-2000"></div>
      <div className="absolute top-60 -right-12 w-48 h-48 bg-rumi-orange rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
      <div className="absolute bottom-32 right-1/4 w-24 h-24 bg-pink-300 rounded-full opacity-15 animate-pulse animation-delay-6000"></div>
    </div>

    <div className="w-full max-w-md mx-auto space-y-8 text-center relative z-10">
      {/* Logo */}
      <div className="space-y-4">
        <h1
          className="text-white text-7xl md:text-8xl font-normal tracking-wide"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          rumi
        </h1>

        {/* Tagline for desktop */}
        <div className="hidden md:block space-y-4 mt-8">
          <h2
            className="text-rumi-orange text-2xl font-bold"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Build close connections..
          </h2>
          <p
            className="text-rumi-orange text-lg leading-tight max-w-lg mx-auto"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Changing the way Gen-Z finds new connections through the lost art of
            letter writing..
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-6 mt-16">
        <button
          onClick={onSignupMode}
          className="w-full max-w-xs mx-auto block bg-gradient-to-r from-rumi-orange to-rumi-orange-light text-white py-4 px-6 rounded-3xl text-xl font-medium shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:from-rumi-orange-light hover:to-rumi-orange"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Signup ✨
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white opacity-50"></div>
          <span
            className="text-white text-lg"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            or continue with
          </span>
          <div className="flex-1 h-px bg-white opacity-50"></div>
        </div>

        <button
          onClick={onNext}
          className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 bg-white/95 backdrop-blur-sm text-gray-800 py-4 px-6 rounded-3xl text-xl font-medium shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/8f04f09d789e2a52b26c8e9f7a9614d726d0a67e?width=82"
            alt="Google"
            className="w-6 h-6"
          />
          Google
        </button>

        <p
          className="text-white text-center mt-8"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Already have an account?{" "}
          <span className="text-rumi-orange underline cursor-pointer">
            Sign in
          </span>
        </p>
      </div>
    </div>
  </div>
);

const SignupStep = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="min-h-screen bg-rumi-purple/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-8 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-32 right-12 text-white text-4xl animate-bounce">
          ✨
        </div>
        <div className="absolute top-60 -right-12 w-48 h-48 bg-rumi-orange rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Background overlay */}
      <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20"></div>

      <div className="w-full max-w-md mx-auto space-y-6 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-white text-6xl md:text-7xl font-normal tracking-wide"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            rumi
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label
              className="block text-white text-lg mb-2"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="your name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className="w-full p-4 bg-white/90 backdrop-blur-sm rounded-xl border-0 text-gray-800 placeholder-gray-500 text-lg shadow-lg focus:ring-2 focus:ring-rumi-orange focus:outline-none transition-all"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>

          <div>
            <label
              className="block text-white text-lg mb-2"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-4 bg-white/90 backdrop-blur-sm rounded-xl border-0 text-gray-800 placeholder-gray-500 text-lg shadow-lg focus:ring-2 focus:ring-rumi-orange focus:outline-none transition-all"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>

          <div>
            <label
              className="block text-white text-lg mb-2"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="enter a strong password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full p-4 bg-white/90 backdrop-blur-sm rounded-xl border-0 text-gray-800 placeholder-gray-500 text-lg shadow-lg focus:ring-2 focus:ring-rumi-orange focus:outline-none transition-all"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>

          <div>
            <label
              className="block text-white text-lg mb-2"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="confirm your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full p-4 bg-white/90 backdrop-blur-sm rounded-xl border-0 text-gray-800 placeholder-gray-500 text-lg shadow-lg focus:ring-2 focus:ring-rumi-orange focus:outline-none transition-all"
              style={{ fontFamily: "Roboto, sans-serif" }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={onBack}
            className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 py-3 px-6 rounded-2xl text-xl font-medium shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-rumi-orange to-rumi-orange-light text-white py-3 px-6 rounded-2xl text-xl font-medium shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadStep = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => (
  <div className="min-h-screen bg-rumi-purple/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Enhanced Background decorations */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-20 right-8 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse"></div>
      <div className="absolute top-32 right-12 text-white text-4xl animate-bounce">
        ✨
      </div>
      <div className="absolute top-60 -right-12 w-48 h-48 bg-rumi-orange rounded-full opacity-20 animate-pulse animation-delay-4000"></div>
    </div>

    {/* Background overlay */}
    <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20"></div>

    <div className="w-full max-w-md mx-auto space-y-8 relative z-10 text-center">
      {/* Logo */}
      <div className="mb-8">
        <h1
          className="text-white text-6xl md:text-7xl font-normal tracking-wide"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          rumi
        </h1>
      </div>

      {/* Upload Area */}
      <div className="space-y-8">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 space-y-4 border border-white/30 shadow-xl">
          <div className="w-32 h-32 mx-auto bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/40">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a1f0e2ff09f09f20a694ebe71c0d0c722fea140a?width=342"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <button className="bg-rumi-orange text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/b6f4c0436efee74fefdd9be5ffd700308e0a5b7a?width=56"
              alt="Upload"
              className="w-6 h-6"
            />
          </button>
        </div>

        <h2
          className="text-white text-2xl font-bold"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Upload
        </h2>

        {/* Desktop additional content */}
        <div className="hidden md:block space-y-4">
          <p
            className="text-white text-lg"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Add a profile picture to help others connect with you better. This
            will be visible to other users when you send letters.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex-1 bg-white/90 backdrop-blur-sm text-gray-800 py-3 px-6 rounded-2xl text-xl font-medium shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-gradient-to-r from-rumi-orange to-rumi-orange-light text-white py-3 px-6 rounded-2xl text-xl font-medium shadow-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Next →
        </button>
      </div>
    </div>
  </div>
);

const VerifyStep = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => (
  <div className="min-h-screen bg-rumi-purple/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Background decorations */}
    <div className="absolute top-24 right-8 w-8 h-8 bg-white rounded-full opacity-20"></div>
    <div className="absolute top-32 right-12 text-white text-2xl">✨</div>
    <div className="absolute top-60 -right-12 w-24 h-24 bg-rumi-orange rounded-full opacity-40"></div>

    {/* Background overlay */}
    <div className="absolute inset-4 bg-gray-300 bg-opacity-20 rounded-3xl shadow-lg"></div>

    <div className="w-full max-w-md mx-auto space-y-8 relative z-10 text-center">
      {/* Logo */}
      <div className="mb-8">
        <h1
          className="text-white text-6xl md:text-7xl font-normal tracking-wide"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          rumi
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h2
            className="text-white text-2xl font-bold"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Upload one :-
          </h2>
          <ul
            className="text-white text-lg space-y-2"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            <li>• Drivers License</li>
            <li>• Student ID</li>
          </ul>
        </div>

        <div className="bg-white bg-opacity-20 rounded-2xl p-8 space-y-4">
          <div className="w-24 h-24 mx-auto bg-gray-300 rounded-lg flex items-center justify-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/2f0a92be111ff1810736a629b2bf042308a97982?width=200"
              alt="Upload Document"
              className="w-16 h-16"
            />
          </div>

          <h3
            className="text-white text-xl font-bold"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Verify Your Age
          </h3>

          {/* Desktop additional content */}
          <div className="hidden md:block space-y-4">
            <p
              className="text-white text-sm"
              style={{ fontFamily: "Roboto, sans-serif" }}
            >
              Age verification helps us create a safer community for all users.
              We use secure encryption to protect your documents.
            </p>
          </div>
        </div>

        <p
          className="text-white text-sm font-bold"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          *This will not be stored and will be deleted after verification is
          complete
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="flex-1 bg-white bg-opacity-80 text-gray-800 py-3 rounded-2xl text-xl font-normal shadow-lg transform hover:scale-105 transition-all"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-white bg-opacity-80 text-gray-800 py-3 rounded-2xl text-xl font-normal shadow-lg transform hover:scale-105 transition-all"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Next →
        </button>
      </div>
    </div>
  </div>
);

const SuccessStep = ({ onNext }: { onNext: () => void }) => (
  <div className="min-h-screen bg-rumi-purple/95 backdrop-blur-sm flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    {/* Background decorations */}
    <div className="absolute top-24 right-8 w-8 h-8 bg-white rounded-full opacity-20"></div>
    <div className="absolute top-32 right-12 text-white text-2xl">✨</div>
    <div className="absolute top-60 -right-12 w-24 h-24 bg-rumi-orange rounded-full opacity-40"></div>

    {/* Background overlay */}
    <div className="absolute inset-4 bg-gray-300 bg-opacity-20 rounded-3xl shadow-lg"></div>

    <div className="w-full max-w-md mx-auto space-y-8 relative z-10 text-center">
      {/* Logo */}
      <div className="mb-8">
        <h1
          className="text-white text-6xl md:text-7xl font-normal tracking-wide"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          rumi
        </h1>
      </div>

      {/* Success Content */}
      <div className="space-y-8">
        <div className="w-32 h-32 mx-auto">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/7a9f59f11dc10514ba3be19eac41393a57697f7d?width=296"
            alt="Checkmark"
            className="w-full h-full"
          />
        </div>

        <h2
          className="text-white text-3xl font-bold"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Success
        </h2>

        {/* Desktop additional content */}
        <div className="hidden md:block space-y-4">
          <p
            className="text-white text-lg"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Welcome to RUMI! Your account has been created successfully. You're
            now ready to start writing letters and making meaningful
            connections.
          </p>
          <p
            className="text-rumi-orange text-lg font-semibold"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Start your journey of authentic letter writing today!
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => window.history.back()}
          className="flex-1 bg-white bg-opacity-80 text-gray-800 py-3 rounded-2xl text-xl font-normal shadow-lg transform hover:scale-105 transition-all"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-white bg-opacity-80 text-gray-800 py-3 rounded-2xl text-xl font-normal shadow-lg transform hover:scale-105 transition-all"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Get Started →
        </button>
      </div>
    </div>
  </div>
);

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    { component: LoginStep, name: "login" },
    { component: SignupStep, name: "signup" },
    { component: UploadStep, name: "upload" },
    { component: VerifyStep, name: "verify" },
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
    />
  );
}
