import LayoutNew from "@/components/LayoutNew";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <LayoutNew>
      <div className="min-h-screen">
        <div className="p-0 space-y-6">
          {/* Profile Avatar and Name */}
          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold text-center">
              Alex
              <br />
              Mangachinana
            </h2>
            <span className="inline-block bg-rumi-purple text-white text-xs px-3 py-1 rounded-full mt-2">
              Verified
            </span>
          </div>

          {/* Form Section */}
          <div className="bg-rumi-gray-light rounded-2xl p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Alex Mangachinana"
                className="w-full p-3 bg-white rounded-lg border-0 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="alex@email.com"
                className="w-full p-3 bg-white rounded-lg border-0 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="text"
                defaultValue="28"
                className="w-full p-3 bg-white rounded-lg border-0 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                defaultValue="Melbourne, AU"
                className="w-full p-3 bg-white rounded-lg border-0 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                rows={4}
                defaultValue="I'm a graphic designer who finds magic in everyday moments. I love early morning walks, handwritten letters, and the way light filters through coffee shop windows. Always searching for authentic connections and meaningful conversations."
                className="w-full p-3 bg-white rounded-lg border-0 text-gray-600 resize-none"
              />
            </div>
          </div>

          {/* Interests & Hobbies */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🎯</span>
              </div>
              <h3 className="text-lg font-semibold">Interests & Hobbies</h3>
            </div>

            <div className="bg-rumi-gray-light rounded-lg p-3 mb-3">
              <input
                type="text"
                placeholder="Add an interest or hobby"
                className="w-full bg-transparent border-0 text-gray-600 placeholder-gray-400"
              />
            </div>

            <button className="w-full bg-rumi-purple text-white py-3 rounded-lg font-medium mb-4">
              Add
            </button>

            <div className="flex gap-2 flex-wrap">
              <span className="bg-rumi-purple text-white px-4 py-2 rounded-full text-sm">
                Music
              </span>
              <span className="bg-rumi-purple text-white px-4 py-2 rounded-full text-sm">
                Biking
              </span>
            </div>

            <p className="text-xs text-gray-600 mt-4">
              Add interests and hobbies that represent who you are. These help
              our AI understand your personality for better letter matching.
            </p>
          </div>

          {/* AI Matching Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-rumi-purple text-sm">🤖</span>
              </div>
              <h3 className="text-lg font-semibold">AI Matching Preferences</h3>
            </div>

            <p className="text-sm text-gray-600">
              Personal Preferences for AI Matching
            </p>

            <div className="bg-rumi-purple text-white p-4 rounded-lg space-y-3">
              <p className="text-sm">
                I'm drawn to thoughtful, introspective people who appreciate
                life's small details. I'd love to connect with fellow creatives,
                deep thinkers, or anyone who finds beauty in everyday moments.
              </p>
              <p className="text-sm">
                I'm particularly interested in letters about:
              </p>
              <p className="text-sm">Personal growth and self-discovery.</p>
              <p className="text-sm">
                Be as specific or general as you'd like. This helps our AI
                understand what letters and writers would resonate with you
                most.
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                <span className="text-rumi-purple text-xs">🔒</span>
              </div>
              <span className="text-sm font-medium">Privacy Note</span>
            </div>
            <p className="text-xs text-gray-600">
              These preferences are only used by our AI for matching purposes
              and are never shared with other users or included in your public
              profile.
            </p>
          </div>

          {/* Save Button */}
          <button className="w-full bg-rumi-purple text-white py-3 rounded-lg font-medium mt-6">
            Save Changes
          </button>
        </div>
      </div>
    </LayoutNew>
  );
}
