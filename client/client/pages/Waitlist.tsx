import React, { useState } from "react";
import Logo from "../components/common/Logo";

// Simple Navbar inside this file
function LandingNavbar({ onOpen }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="content-width flex items-center justify-between py-4 px-4 md:px-8">
        <Logo starColor="text-rumi-purple" textColor="text-rumi-purple" />
        <button
          onClick={onOpen}
          className="btn-primary px-4 py-2 rounded-md text-sm transition-transform hover:scale-105"
        >
          Join Waitlist
        </button>
      </div>
    </nav>
  );
}

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "🎉 You’ve joined the waitlist!" });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: "❌ Something went wrong. Try again!",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "⚠️ Network error. Please try again!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Navbar */}
      <LandingNavbar onOpen={() => setIsOpen(true)} />

      {/* Hero Section */}
      <main className="mt-[12vh] flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="content-width grid gap-12 lg:grid-cols-2 items-center">
          <section className="animate-fadeInUp text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">
              Describe who you need. Let AI find them.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              RUMI is a networking platform that uses AI to connect you with
              people who match the qualities, skills, or vibe you're looking
              for. Tell the system what matters — experience, interests, or
              personality — and get personalized suggestions from the community,
              nearby or remote.
            </p>

            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="btn-primary px-5 py-3 text-base transition-transform hover:scale-105"
              >
                Join Waitlist →
              </button>
            </div>
          </section>

          {/* Placeholder Image/Illustration */}
          <section className="animate-fadeInUp delay-200">
            <div className="bg-white card-elevated p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Coming Soon ✨
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Be among the first to experience AI-powered professional
                networking.
              </p>
              <div className="relative mt-10 flex items-center justify-center">
                <img
                  src="/images/sneak-peak.png"
                  alt="RUMI preview"
                  className="w-full h-auto rounded-xl object-cover filter blur-sm"
                />
                <span className="absolute text-white text-xl font-semibold bg-black/40 px-4 py-2 rounded-lg">
                  Coming Soon
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-50 py-8 px-4 sm:px-6 text-center text-sm text-gray-500 border-t border-gray-200">
        <Logo starColor="gray" textColor="gray" />
        <p className="mt-2">
          © {new Date().getFullYear()} RUMI. All rights reserved.
        </p>
      </footer>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal box */}
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fadeInUp">
            <h2 className="text-xl font-semibold text-gray-900">
              Join the Waitlist
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to know when RUMI launches.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className={`btn-primary w-full py-2 rounded-md flex items-center justify-center ${loading && "opacity-70 cursor-not-allowed"}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Submitting...
                  </span>
                ) : (
                  "Join Now"
                )}
              </button>
            </form>

            {/* Success/Error message */}
            {message && (
              <div
                className={`mt-3 text-sm px-3 py-2 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
