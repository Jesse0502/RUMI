import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";

// Simple Navbar inside this file
function LandingNavbar({ onOpen }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="content-width flex items-center justify-between py-4">
        <Logo starColor="purple" textColor="gray" />
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("You’ve joined the waitlist 🎉");
        setIsOpen(false);
        setEmail("");
      } else {
        alert("Something went wrong. Try again!");
      }
    } catch (err) {
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Navbar */}
      <LandingNavbar onOpen={() => setIsOpen(true)} />

      {/* Hero Section */}
      <main className="my-[10vh] flex-1 flex items-center justify-center py-32">
        <div className="content-width grid gap-12 lg:grid-cols-2 items-center">
          <section className="animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 leading-tight">
              Describe who you need. Let AI find them.
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              RUMI is a networking platform that uses AI to connect you with
              people who match the qualities, skills, or vibe you're looking
              for. Tell the system what matters — experience, interests, or
              personality — and get personalized suggestions from the community,
              nearby or remote.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
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
            <div className="bg-white h-[52vh] card-elevated p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Coming Soon ✨
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Be among the first to experience AI-powered professional
                networking.
              </p>
              <img
                src="images/sneak-peak.png"
                className="mt-6 h-inherit rounded-lg bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center text-purple-600 font-semibold"
                alt="Sneak peek"
              />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-50 py-8 text-center text-sm text-gray-500 border-t border-gray-200">
        <Logo starColor="gray" textColor="gray" />
        <p>© {new Date().getFullYear()} RUMI. All rights reserved.</p>
      </footer>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
                className="btn-primary w-full py-2 rounded-md"
              >
                Join Now
              </button>
            </form>

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
