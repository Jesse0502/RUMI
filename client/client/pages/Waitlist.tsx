import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";

// Simple Navbar inside this file
function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="content-width flex items-center justify-between py-4">
        <Logo starColor="purple" textColor="gray" />
        <Link
          to="#waitlist"
          className="btn-primary px-4 py-2 rounded-md text-sm transition-transform hover:scale-105"
        >
          Join Waitlist
        </Link>
      </div>
    </nav>
  );
}

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/.netlify/functions/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log("Success:", data);
      alert("You’ve joined the waitlist 🎉");
    } else {
      console.error("Error:", data);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section */}
      <main className="mt-7 flex-1 flex items-center justify-center py-32">
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
              <Link
                to="#waitlist"
                className="btn-primary px-5 py-3 text-base transition-transform hover:scale-105"
              >
                Join Waitlist →
              </Link>
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
              >
                {/* <img src="images/sneak-peak.png" /> */}
              </img>
            </div>
          </section>
        </div>
      </main>

      {/* Waitlist Section */}
      <section
        id="waitlist"
        className="py-20 bg-white border-t border-gray-100"
      >
        <div className="content-width text-center max-w-xl mx-auto animate-fadeInUp">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Join the Waitlist
          </h2>
          <p className="text-gray-600 mb-6">
            Get early access when we launch. No spam, just the latest updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field flex-1 px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-rumi-purple focus:border-rumi-purple"
            />
            <button
              onSubmit={handleSubmit}
              type="submit"
              className="btn-primary px-6 py-3 rounded-md transition-transform hover:scale-105"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-50 py-8 text-center text-sm text-gray-500 border-t border-gray-200">
        {/* @ts-ignore */}
        <Logo starColor="gray" textColor="gray" className="mx-auto mb-2" />
        <p>© {new Date().getFullYear()} RUMI. All rights reserved.</p>
      </footer>
    </div>
  );
}
