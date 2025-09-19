import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to onboarding flow as the main landing page
    navigate("/onboarding", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-2">rumi</h1>
        <div className="text-2xl">✨</div>
        <p className="text-sm opacity-75 mt-4">Loading...</p>
      </div>
    </div>
  );
}
