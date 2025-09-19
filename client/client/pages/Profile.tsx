import LayoutNew from "@/components/LayoutNew";
import { Settings as SettingsIcon, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

interface ProfileData {
  name: string;
  email: string;
  age: string;
  location: string;
  bio: string;
  skills: string[];
  groups: string[];
}
interface MetricPoint { date: string; impressions: number; clicks: number; spend: number }
interface Campaign { id: string; status: "running" | "paused"; timeseries: MetricPoint[] }

const PROFILE_KEY = "rumi_profile";
const CAMPAIGNS_KEY = "rumi_campaigns";

function loadProfile(): ProfileData {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (raw) return JSON.parse(raw) as ProfileData;
  return {
    name: "Alex Mangachinana",
    email: "alex@email.com",
    age: "28",
    location: "Melbourne, AU",
    bio:
      "I'm a graphic designer who finds magic in everyday moments. I love early morning walks, handwritten letters, and the way light filters through coffee shop windows. Always searching for authentic connections and meaningful conversations.",
    skills: ["Graphic Design", "Photography", "Social Media"],
    groups: ["Designers AU", "Melbourne Creatives"],
  };
}

function loadCampaigns(): Campaign[] {
  const raw = localStorage.getItem(CAMPAIGNS_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Campaign[];
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>(loadProfile());
  const campaigns = loadCampaigns();

  useEffect(() => {
    const onStorage = () => setProfile(loadProfile());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const stats = useMemo(() => {
    const running = campaigns.filter((c) => c.status === "running");
    const last = running.flatMap((c) => c.timeseries);
    const totalImpr = last.reduce((a, b) => a + b.impressions, 0);
    const totalClicks = last.reduce((a, b) => a + b.clicks, 0);
    return { running: running.length, impressions: totalImpr, clicks: totalClicks };
  }, [campaigns]);

  const initials = profile.name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <LayoutNew>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto py-8 px-4 lg:px-0">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Profile</h1>
              <p className="text-sm text-gray-500 mt-1">
                Your public profile and activity
              </p>
            </div>

            <Link
              to="/settings"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-indigo-700 transition"
            >
              <SettingsIcon className="w-4 h-4" />
              Settings
            </Link>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-rumi-purple to-rumi-purple-light" />
            <div className="px-6 pb-6">
              <div className="-mt-10 flex items-end gap-4">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg border-4 border-white flex items-center justify-center text-rumi-purple text-xl font-bold">
                  {initials}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                    <BadgeCheck className="w-5 h-5 text-rumi-purple" />
                    <span className="text-xs bg-rumi-purple text-white px-2 py-1 rounded-full font-medium">
                      Verified
                    </span>
                  </div>
                  <div className="text-gray-600 mt-1">{profile.location}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
              </div>

              {/* Skills Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Groups Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Communities</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.groups.map((group) => (
                    <span
                      key={group}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm font-medium border"
                    >
                      {group}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Activity Stats */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Activity</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Letters sent</span>
                    <span className="font-semibold text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Connections</span>
                    <span className="font-semibold text-gray-900">8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Events joined</span>
                    <span className="font-semibold text-gray-900">3</span>
                  </div>
                </div>
              </div>

              {/* Advertising Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Advertising</h4>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Running</div>
                    <div className="text-lg font-bold text-green-600">{stats.running}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Views</div>
                    <div className="text-lg font-bold text-blue-600">{stats.impressions}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Clicks</div>
                    <div className="text-lg font-bold text-purple-600">{stats.clicks}</div>
                  </div>
                </div>
                <Link
                  to="/settings"
                  className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Manage Ads
                </Link>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="text-sm font-medium text-gray-900">{profile.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutNew>
  );
}
