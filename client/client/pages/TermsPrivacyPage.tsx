// TermsPrivacySimple.tsx
import Logo from "@/components/common/Logo";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TermsPrivacySimple() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <p className="text-sm text-gray-500">
            Effective Date: <span className="font-medium">Jan 1, 2025</span>
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab("terms")}
              className={`py-3 px-4 border-b-2 -mb-px transition ${
                activeTab === "terms"
                  ? "border-purple-600 text-purple-700 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`py-3 px-4 border-b-2 -mb-px transition ${
                activeTab === "privacy"
                  ? "border-purple-600 text-purple-700 font-semibold"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Privacy Policy
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {activeTab === "terms" ? <Terms /> : <Privacy />}
      </main>
    </div>
  );
}

function Terms() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Terms of Service
      </h1>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>You must be 18 or older to use Rumi.</li>
        <li>Be respectful — no harmful or illegal content.</li>
        <li>
          You own the content you share, but Rumi can display it in-app to
          enable matching.
        </li>
        <li>We may suspend accounts that misuse the platform.</li>
        <li>
          AI suggestions are assistive only — compatibility not guaranteed.
        </li>
        <li>You can delete your account anytime.</li>
      </ul>
      <p className="mt-4">
        Questions? Contact{" "}
        <a href="mailto:support@rumi.app" className="text-purple-700">
          support@rumi.app
        </a>
        .
      </p>
    </div>
  );
}

function Privacy() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>
          We collect profile info, messages, skills, and optional resume data.
        </li>
        <li>We use this info to improve matches and notify you of activity.</li>
        <li>
          We never sell your data — only share with trusted service providers.
        </li>
        <li>You can access or delete your data anytime.</li>
        <li>We take reasonable steps to protect your data.</li>
        <li>Rumi is not for users under 18 years old.</li>
      </ul>
      <p className="mt-4">
        Privacy questions? Contact{" "}
        <a href="mailto:privacy@rumi.app" className="text-purple-700">
          privacy@rumi.app
        </a>
        .
      </p>
    </div>
  );
}
