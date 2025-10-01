// ...existing code...
import React from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import PWADownloadBtn from "@/components/common/PWADownloadBtn";
import ExtNavbar from "@/components/Navbar/ExtNavbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top navigation */}
      <ExtNavbar />
      {/* Hero */}
      <main className="py-20">
        <div className="content-width grid gap-12 lg:grid-cols-2 items-center">
          <section>
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
                to="/get-started"
                className="btn-primary px-5 py-3 text-base"
              >
                Try AI Match — free
              </Link>
              {/* <Link to="/feed" className="btn-secondary px-5 py-3 text-base">
                Explore members
              </Link> */}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                  🤖
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    AI matchmaking
                  </div>
                  <div className="text-xs">
                    Describe the person, get curated matches
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                  🫂
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    Real connections
                  </div>
                  <div className="text-xs">Message, meet, and collaborate</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
                  🔒
                </div>
                <div>
                  <div className="font-medium text-gray-900">Privacy-first</div>
                  <div className="text-xs">
                    Control what you share and who can reach you
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="bg-white card-elevated p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                AI suggested match
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Based on your description: "friendly product designer, Brooklyn,
                open to collaboration"
              </p>

              <div className="mt-4 grid grid-cols-3 gap-4 items-center">
                <img
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&h=800&fit=crop"
                  alt="Suggested person"
                  className="w-24 h-24 rounded-xl object-cover col-span-1"
                />
                <div className="col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-md font-semibold text-gray-900">
                        Alex Thompson
                      </div>
                      <div className="text-xs text-gray-500">
                        Product Designer · Brooklyn
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      Match 92%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Skilled in prototyping, empathy-driven research, enjoys slow
                    conversation and community workshops.
                  </p>

                  <div className="mt-4 flex gap-2">
                    <p
                      // to="/profile/3"
                      className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm"
                    >
                      View profile
                    </p>
                    <p className="px-4 py-2 rounded-md border border-gray-200 text-sm">
                      Message
                    </p>
                    <p className="px-4 py-2 rounded-md bg-white text-sm border border-gray-200">
                      Connect
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  A
                </div>
                <div>
                  <div className="text-sm font-medium">AI-first discovery</div>
                  <div className="text-xs text-gray-500">
                    Find people by qualities, not keywords
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center text-pink-600 font-bold">
                  L
                </div>
                <div>
                  <div className="text-sm font-medium">Local & remote</div>
                  <div className="text-xs text-gray-500">
                    Filter matches by location, availability, and intent
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Features */}
      <section className="py-16">
        <div className="content-width">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            How RUMI matchmaking works
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card-elevated p-6 rounded-xl border border-gray-100">
              <div className="text-xl font-semibold text-gray-900">
                Describe who you need
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Tell the AI about skills, traits, or vibe and it will prioritize
                the best matches.
              </p>
            </div>

            <div className="card-elevated p-6 rounded-xl border border-gray-100">
              <div className="text-xl font-semibold text-gray-900">
                Connect with confidence
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Message, Send Connection Request, or join group sessions to
                build real relationships.
              </p>
            </div>

            <div className="card-elevated p-6 rounded-xl border border-gray-100">
              <div className="text-xl font-semibold text-gray-900">
                Control your presence
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Choose what others see and how you'd like to be discovered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA + Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="content-width py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold">
                Ready to meet the right person?
              </h3>
              <p className="text-sm text-gray-500">
                Describe who you're looking for and let AI surface thoughtful
                matches.
              </p>
            </div>

            <div className="flex gap-3">
              <Link to="/get-started" className="btn-primary px-4 py-2">
                Try AI Match
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <Logo starColor="gray" textColor="gray" />
              {/* <span>© {new Date().getFullYear()} RUMI</span> */}
            </div>

            <div className="flex gap-4 mt-4 md:mt-0">
              <Link to="/terms" className="hover:underline">
                Terms & Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
// ...existing code...
