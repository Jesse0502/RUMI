import LayoutNew from "@/components/common/LayoutNew";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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

interface Campaign {
  id: string;
  title: string;
  copy: string;
  audience: string;
  skills: string[];
  budget: number;
  status: "running" | "paused";
  createdAt: number;
  timeseries: MetricPoint[];
}

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

function saveProfile(p: ProfileData) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

function loadCampaigns(): Campaign[] {
  const raw = localStorage.getItem(CAMPAIGNS_KEY);
  if (raw) return JSON.parse(raw) as Campaign[];
  return [];
}

function saveCampaigns(c: Campaign[]) {
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(c));
}

function generateSeries(days = 14): MetricPoint[] {
  const now = new Date();
  const series: MetricPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const impressions = 200 + Math.floor(Math.random() * 400);
    const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03));
    const spend = parseFloat((clicks * (0.25 + Math.random() * 0.35)).toFixed(2));
    series.push({ date: d.toISOString().slice(5, 10), impressions, clicks, spend });
  }
  return series;
}

function aiGenerateCopy(name: string, skills: string[], audience: string) {
  const headline = `${name} — ${skills.slice(0, 2).join(" · ")}`;
  const copy = `Need ${skills.join(", ")} support? ${name} helps ${audience}
stand out with thoughtful, high-quality work. Available for projects & collaborations.`;
  return { headline, copy };
}

export default function Settings() {
  // profile state
  const [profile, setProfile] = useState<ProfileData>(loadProfile());
  const [skillInput, setSkillInput] = useState("");
  const [groupInput, setGroupInput] = useState("");

  // campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>(loadCampaigns());

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveCampaigns(campaigns);
  }, [campaigns]);

  // derived analytics
  const analytics = useMemo(() => {
    const points = campaigns.flatMap((c) => c.timeseries);
    const totals = points.reduce(
      (acc, p) => {
        acc.impressions += p.impressions;
        acc.clicks += p.clicks;
        acc.spend += p.spend;
        return acc;
      },
      { impressions: 0, clicks: 0, spend: 0 },
    );
    const ctr = totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0;
    // merge by date for chart
    const byDate = new Map<string, { date: string; impressions: number; clicks: number }>();
    for (const p of points) {
      const prev = byDate.get(p.date) || { date: p.date, impressions: 0, clicks: 0 };
      prev.impressions += p.impressions;
      prev.clicks += p.clicks;
      byDate.set(p.date, prev);
    }
    const chart = Array.from(byDate.values());
    return { totals, ctr, chart };
  }, [campaigns]);

  // new campaign form state
  const [audience, setAudience] = useState("small businesses, indie brands");
  const [budget, setBudget] = useState(200);
  const [{ headline, copy }, setAd] = useState(() =>
    aiGenerateCopy(profile.name, profile.skills, audience),
  );

  function startCampaign() {
    const id = `${Date.now()}`;
    const newCampaign: Campaign = {
      id,
      title: headline,
      copy,
      audience,
      skills: profile.skills,
      budget,
      status: "running",
      createdAt: Date.now(),
      timeseries: generateSeries(),
    };
    setCampaigns([newCampaign, ...campaigns]);
  }

  function removeCampaign(id: string) {
    setCampaigns(campaigns.filter((c) => c.id !== id));
  }

  function pauseResume(id: string) {
    setCampaigns(
      campaigns.map((c) => (c.id === id ? { ...c, status: c.status === "running" ? "paused" : "running" } : c)),
    );
  }

  return (
    <LayoutNew>
      <div className="min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Settings</h2>
          <Link to="/profile" className="text-rumi-purple">Back to profile</Link>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="advertise">Advertise</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-rumi-gray-light rounded-2xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <Input value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <Textarea rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex gap-2 mb-2">
                  <Input placeholder="Add a skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
                  <Button
                    className="bg-rumi-purple"
                    onClick={() => {
                      const s = skillInput.trim();
                      if (!s) return;
                      setProfile({ ...profile, skills: Array.from(new Set([...profile.skills, s])) });
                      setSkillInput("");
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((s) => (
                    <Badge key={s} className="bg-rumi-purple text-white">{s}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Groups</label>
                <div className="flex gap-2 mb-2">
                  <Input placeholder="Add a group" value={groupInput} onChange={(e) => setGroupInput(e.target.value)} />
                  <Button
                    className="bg-rumi-purple"
                    onClick={() => {
                      const g = groupInput.trim();
                      if (!g) return;
                      setProfile({ ...profile, groups: Array.from(new Set([...profile.groups, g])) });
                      setGroupInput("");
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.groups.map((g) => (
                    <Badge key={g} variant="secondary">{g}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advertise">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Advertise Yourself</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target audience</label>
                      <Input value={audience} onChange={(e) => setAudience(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                      <Input type="number" min={0} value={budget} onChange={(e) => setBudget(parseInt(e.target.value || "0", 10))} />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="bg-rumi-purple"
                        onClick={() => setAd(aiGenerateCopy(profile.name, profile.skills, audience))}
                      >
                        <Sparkles className="w-4 h-4 mr-1" /> Generate with AI
                      </Button>
                      <Button variant="secondary" onClick={startCampaign}>Start campaign</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <Input value={headline} onChange={(e) => setAd({ headline: e.target.value, copy })} />
                    <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Ad copy</label>
                    <Textarea rows={6} value={copy} onChange={(e) => setAd({ headline, copy: e.target.value })} />
                    <div className="bg-rumi-gray-light rounded-lg p-3 mt-2">
                      <div className="font-semibold">Preview</div>
                      <div className="text-sm text-gray-600 mt-1">{headline}</div>
                      <div className="text-sm mt-1">{copy}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile.skills.map((s) => (
                          <Badge key={s} className="bg-rumi-purple text-white">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <h4 className="font-semibold mb-3">Your campaigns</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {campaigns.length === 0 && (
                    <div className="text-sm text-gray-600">No campaigns yet.</div>
                  )}
                  {campaigns.map((c) => (
                    <div key={c.id} className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{c.title}</div>
                          <div className="text-xs text-gray-500">Audience: {c.audience}</div>
                          <div className="text-xs text-gray-500">Budget: ${c.budget}</div>
                        </div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded-full ${c.status === "running" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{c.status}</span>
                        </div>
                      </div>
                      <div className="text-sm mt-2 whitespace-pre-line">{c.copy}</div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {c.skills.map((s) => (
                          <Badge key={s} variant="secondary">{s}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        {/* @ts-ignore */}
                        <div className="text-xs text-gray-600">Impr: {c.timeseries.at(-1)?.impressions ?? 0} · Clicks: {c.timeseries.at(-1)?.clicks ?? 0}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => pauseResume(c.id)}>
                            {c.status === "running" ? "Pause" : "Resume"}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeCampaign(c.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">Impressions</div>
                  <div className="text-2xl font-semibold">{analytics.totals.impressions.toLocaleString()}</div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">Clicks</div>
                  <div className="text-2xl font-semibold">{analytics.totals.clicks.toLocaleString()}</div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-200 p-4">
                  <div className="text-sm text-gray-500">CTR</div>
                  <div className="text-2xl font-semibold">{analytics.ctr.toFixed(2)}%</div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-gray-200 p-4">
                <div className="text-sm font-medium mb-2">Engagement over time</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.chart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="impressions" stroke="#7c3aed" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="clicks" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutNew>
  );
}
