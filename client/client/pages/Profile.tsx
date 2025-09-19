import LayoutNew from "@/components/LayoutNew";
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
      <div className="min-h-screen">
        <div className="relative mb-6">
          <div className="h-32 w-full rounded-2xl bg-gradient-to-r from-rumi-purple to-rumi-purple-light" />
          <Link
            to="/settings"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg flex items-center gap-2 shadow"
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <div className="-mt-10 px-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center text-rumi-purple text-xl font-semibold">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <BadgeCheck className="w-4 h-4 text-rumi-purple" />
                <span className="text-xs bg-rumi-purple text-white px-2 py-0.5 rounded-full">Verified</span>
              </div>
              <div className="text-sm text-gray-600">{profile.location}</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-sm text-gray-700 whitespace-pre-line">{profile.bio}</p>
            </section>

            <section className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s} className="bg-rumi-purple text-white px-3 py-1 rounded-full text-sm">
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Groups</h3>
              <div className="flex flex-wrap gap-2">
                {profile.groups.map((g) => (
                  <span key={g} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {g}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white rounded-2xl p-4 border border-gray-200">
              <h4 className="font-semibold mb-3">Ad overview</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xs text-gray-500">Running</div>
                  <div className="text-lg font-semibold">{stats.running}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Impr</div>
                  <div className="text-lg font-semibold">{stats.impressions}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Clicks</div>
                  <div className="text-lg font-semibold">{stats.clicks}</div>
                </div>
              </div>
              <Link to="/settings" className="block mt-3 text-center bg-rumi-purple text-white py-2 rounded-lg font-medium">
                Manage ads
              </Link>
            </section>

            <section className="bg-white rounded-2xl p-4 border border-gray-200">
              <h4 className="font-semibold mb-2">Contact</h4>
              <div className="text-sm text-gray-700">{profile.email}</div>
            </section>
          </aside>
        </div>
      </div>
    </LayoutNew>
  );
}
