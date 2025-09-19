import LayoutNew from "@/components/LayoutNew";
import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Image } from "lucide-react";

export default function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([
    {
      id: 1,
      title: "Sunrise Walk & Share",
      date: "2025-09-20",
      time: "6:30 AM",
      topic: "Morning Walks",
      attendees: 12,
      maxAttendees: 25,
      description:
        "Join us for a peaceful morning walk as the sun rises. We'll share stories, practice mindfulness, and connect with nature and each other.",
      location: "Central Park, NYC",
      host: "Sarah Chen",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop",
      tags: ["Mindfulness", "Nature", "Community"],
      price: "Free",
    },
    {
      id: 2,
      title: "Letter Writing Workshop",
      date: "2025-09-25",
      time: "7:00 PM",
      topic: "Creative Writing",
      attendees: 34,
      maxAttendees: 50,
      description:
        "Discover the art of meaningful letter writing. Learn techniques to express yourself authentically and connect deeply with others through written words.",
      location: "Community Center Downtown",
      host: "Marcus Rivera",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=800&fit=crop",
      tags: ["Writing", "Creativity", "Expression"],
      price: "$15",
    },
    {
      id: 3,
      title: "Mindful Coffee Connections",
      date: "2025-09-22",
      time: "9:00 AM",
      topic: "Social Connection",
      attendees: 8,
      maxAttendees: 15,
      description:
        "Start your weekend with meaningful conversations over great coffee. We'll practice deep listening and authentic sharing in a cozy environment.",
      location: "Brew & Bloom Café",
      host: "Alex Thompson",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=800&fit=crop",
      tags: ["Coffee", "Conversation", "Connection"],
      price: "$8",
    },
    {
      id: 4,
      title: "Digital Detox Picnic",
      date: "2025-09-28",
      time: "12:00 PM",
      topic: "Wellness",
      attendees: 18,
      maxAttendees: 30,
      description:
        "Unplug from technology and reconnect with yourself and others. Enjoy games, storytelling, and real human connection in a beautiful outdoor setting.",
      location: "Riverside Park",
      host: "Luna Martinez",
      image:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop",
      tags: ["Digital Detox", "Outdoor", "Games"],
      price: "Free",
    },
  ]);

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: "",
    topic: "",
    description: "",
    autoInvite: false,
  });

  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const suggestedInvitees = ["Lina", "Marcus", "Sarah", "John"];
  const [selectedInvitees, setSelectedInvitees] = useState<string[]>([]);

  function toggleInvitee(name: string) {
    setSelectedInvitees((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setEventImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setEventImage(null);
    setImagePreview("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  function createEvent() {
    const id = Math.floor(Math.random() * 1000000);
    const newEvent = {
      ...form,
      id,
      attendees: 0,
      maxAttendees: 20,
      time: "6:00 PM",
      location: "TBD",
      host: "You",
      image:
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&h=800&fit=crop",
      tags: [form.topic || "Community"],
      price: "Free",
    };
    setEvents((prev) => [newEvent, ...prev]);

    if (form.autoInvite) {
      fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Event Invite",
          body: `You're invited to ${form.title}`,
          data: { type: "event" },
        }),
      });
    }

    setForm({
      title: "",
      date: "",
      topic: "",
      description: "",
      autoInvite: false,
    });
    setSelectedInvitees([]);
    setShowCreateModal(false);
    alert("Event created (demo)");
  }

  function joinEvent(eventId: number) {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, attendees: Math.min(e.maxAttendees, e.attendees + 1) }
          : e,
      ),
    );
    alert("Joined event (demo)");
  }

  function openGroupChat(eventTitle: string) {
    navigate("/chat", { state: { eventTitle } });
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const filters = ["All", "This Week", "Free", "Paid", "Online", "In Person"];

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (activeFilter === "Free" && e.price !== "Free") return false;
      if (activeFilter === "Paid" && e.price === "Free") return false;
      if (
        query &&
        !`${e.title} ${e.description} ${e.tags.join(" ")} ${e.host}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [events, activeFilter, query]);

  return (
    <LayoutNew>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto py-8 px-4 lg:px-0">
          {/* Header (matches new feed / pastLetters style) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Events</h1>
              <p className="text-sm text-gray-500 mt-1">
                Find local gatherings, workshops, and small group experiences.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events, hosts, tags..."
                  className="w-64 pl-10 pr-3 py-2 rounded-full border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-indigo-700 transition"
              >
                + Create
              </button>
            </div>
          </div>

          {/* Filters Row like feed/pastLetters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-full border ${
                  activeFilter === f
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="grid gap-6">
            {/* Feed style: simple stacked cards (like feed/pastLetters) */}
            {filtered.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-48 h-40 md:h-auto flex-shrink-0 relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute left-3 top-3 bg-white/90 px-2 py-1 rounded-md text-xs font-semibold text-indigo-600">
                      {formatDate(event.date)}
                    </div>
                    <div className="absolute right-3 top-3 px-2 py-1 rounded-md text-xs font-semibold border bg-white/90">
                      {event.price}
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {event.title}
                        </h3>
                        <div className="text-sm text-gray-500 mt-1 truncate">
                          {event.description}
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {event.time}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {event.location}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            Hosted by {event.host}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {event.tags.map((t: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          {event.attendees} going
                        </div>
                        <div className="text-xs text-gray-400">
                          {event.maxAttendees - event.attendees} spots left
                        </div>

                        <div className="flex flex-col w-36 mt-2">
                          <button
                            onClick={() => joinEvent(event.id)}
                            className="w-full bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700 transition"
                          >
                            Join
                          </button>
                          <button
                            onClick={() => openGroupChat(event.title)}
                            className="w-full mt-2 bg-white border border-gray-200 text-sm py-2 rounded-md hover:bg-gray-50 transition"
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No events found. Try adjusting your search or filters.
              </div>
            )}
          </div>
        </div>

        {/* Create Event Modal (keeps form but styled like feed/pastLetters) */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Create Event</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 text-lg"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="Event title"
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, date: e.target.value }))
                    }
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <input
                    value={form.topic}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, topic: e.target.value }))
                    }
                    placeholder="Topic / Category"
                    className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={4}
                  placeholder="Describe the event..."
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                />

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.autoInvite}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, autoInvite: e.target.checked }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    Auto-invite suggested members
                  </span>
                </label>

                {!form.autoInvite && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Invite specific people
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {suggestedInvitees.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleInvitee(s)}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            selectedInvitees.includes(s)
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-gray-700 border-gray-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2 rounded-xl border bg-white text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createEvent}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutNew>
  );
}
