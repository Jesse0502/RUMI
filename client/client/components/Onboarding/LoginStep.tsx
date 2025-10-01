import Logo from "../common/Logo";

const LoginStep = ({
  onNext,
  onBack,
  setFormData,
  onSignupMode,
}: {
  onNext: () => void;
  onBack: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
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
export default LoginStep;
