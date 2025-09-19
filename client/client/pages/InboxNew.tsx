import LayoutNew from "@/components/LayoutNew";
import {
  Heart,
  MessageCircle,
  User,
  Mail,
  Star,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Forward,
  Archive,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function InboxNew() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const letters = [
    {
      id: 1,
      from: "Sarah Chen",
      avatar: "S",
      subject: "Thank you for your beautiful letter about morning walks",
      preview:
        "Your words about finding peace in the early hours really resonated with me. I wanted to share my own experience...",
      timestamp: new Date("2024-01-15T08:30:00"),
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      category: "personal",
      mood: "grateful",
      replyCount: 0,
    },
    {
      id: 2,
      from: "John Jacobs",
      avatar: "J",
      subject: "Re: Thoughts on creativity and inspiration",
      preview:
        "I loved reading about your creative process! It reminded me of something Maya Angelou once said about inspiration...",
      timestamp: new Date("2024-01-14T15:45:00"),
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      category: "creative",
      mood: "inspired",
      replyCount: 3,
    },
    {
      id: 3,
      from: "Anonymous Writer",
      avatar: "?",
      subject: "Your letter touched my heart",
      preview:
        "I don't usually reach out to strangers, but your letter about overcoming challenges gave me hope during a difficult time...",
      timestamp: new Date("2024-01-14T10:20:00"),
      isRead: true,
      isStarred: true,
      hasAttachment: false,
      category: "support",
      mood: "hopeful",
      replyCount: 1,
    },
    {
      id: 4,
      from: "Marcus Rivera",
      avatar: "M",
      subject: "Coffee shop observations - so relatable!",
      preview:
        "I was sitting in a café when I read your letter, and I couldn't help but smile at how perfectly you captured...",
      timestamp: new Date("2024-01-13T19:15:00"),
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      category: "observation",
      mood: "amused",
      replyCount: 0,
    },
    {
      id: 5,
      from: "Emma Thompson",
      avatar: "E",
      subject: "Childhood memories that shape us",
      preview:
        "Your story about that summer when you were eight brought back so many memories of my own childhood adventures...",
      timestamp: new Date("2024-01-12T14:30:00"),
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      category: "memory",
      mood: "nostalgic",
      replyCount: 2,
    },
    {
      id: 6,
      from: "David Park",
      avatar: "D",
      subject: "Letter exchange invitation",
      preview:
        "Hi! I came across your profile and really enjoyed your writing style. Would you be interested in becoming pen pals?",
      timestamp: new Date("2024-01-11T09:45:00"),
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      category: "invitation",
      mood: "friendly",
      replyCount: 0,
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Mail" },
    { value: "unread", label: "Unread" },
    { value: "starred", label: "Starred" },
    { value: "replies", label: "Replies" },
    { value: "attachments", label: "Has Attachments" },
  ];

  const filteredLetters = letters
    .filter((letter) => {
      if (selectedFilter === "unread") return !letter.isRead;
      if (selectedFilter === "starred") return letter.isStarred;
      if (selectedFilter === "replies") return letter.replyCount > 0;
      if (selectedFilter === "attachments") return letter.hasAttachment;
      return true;
    })
    .filter(
      (letter) =>
        letter.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        letter.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        letter.preview.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const unreadCount = letters.filter((l) => !l.isRead).length;
  const starredCount = letters.filter((l) => l.isStarred).length;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "grateful":
        return "🙏";
      case "inspired":
        return "✨";
      case "hopeful":
        return "🌟";
      case "amused":
        return "😊";
      case "nostalgic":
        return "🌅";
      case "friendly":
        return "👋";
      default:
        return "💭";
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-purple-400 to-pink-500",
      "from-blue-400 to-indigo-500",
      "from-green-400 to-teal-500",
      "from-yellow-400 to-orange-500",
      "from-red-400 to-pink-500",
      "from-indigo-400 to-purple-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const toggleSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === filteredLetters.length
        ? []
        : filteredLetters.map((letter) => letter.id),
    );
  };

  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-heading-2 text-gray-900 mb-2">Inbox</h1>
            <p className="text-body text-gray-600">
              Letters and messages from your connections
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              {filteredLetters.length}{" "}
              {filteredLetters.length === 1 ? "message" : "messages"}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input-field min-w-[140px]"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button className="btn-secondary flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archive ({selectedItems.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {letters.length}
            </div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-rumi-orange mb-1">
              {unreadCount}
            </div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {starredCount}
            </div>
            <div className="text-sm text-gray-600">Starred</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {letters.reduce((sum, l) => sum + l.replyCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Replies</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {filteredLetters.length > 0 && (
          <div className="card-elevated p-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredLetters.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-rumi-purple border-gray-300 rounded focus:ring-rumi-purple"
                />
                <span className="text-sm text-gray-600">
                  {selectedItems.length === filteredLetters.length
                    ? "Deselect all"
                    : "Select all"}
                </span>
              </label>

              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-600">
                    {selectedItems.length} selected
                  </span>
                  <button className="btn-ghost text-sm">Mark as read</button>
                  <button className="btn-ghost text-sm">Star</button>
                  <button className="btn-ghost text-sm">Archive</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-3">
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className={`card-elevated p-6 group cursor-pointer transition-all ${
                !letter.isRead ? "bg-blue-50/50 border-blue-200" : ""
              } ${
                selectedItems.includes(letter.id)
                  ? "ring-2 ring-rumi-purple bg-rumi-purple-50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Selection Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(letter.id)}
                    onChange={() => toggleSelection(letter.id)}
                    className="w-4 h-4 text-rumi-purple border-gray-300 rounded focus:ring-rumi-purple"
                  />
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(letter.from)} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}
                  >
                    {letter.avatar}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`font-semibold text-gray-900 ${!letter.isRead ? "font-bold" : ""}`}
                      >
                        {letter.from}
                      </h3>
                      <span className="text-lg">
                        {getMoodEmoji(letter.mood)}
                      </span>
                      {letter.isStarred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {letter.hasAttachment && (
                        <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs">📎</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(letter.timestamp)}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <h4
                    className={`text-gray-900 mb-2 line-clamp-1 ${!letter.isRead ? "font-semibold" : ""}`}
                  >
                    {letter.subject}
                  </h4>

                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {letter.preview}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {letter.replyCount > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          {letter.replyCount}{" "}
                          {letter.replyCount === 1 ? "reply" : "replies"}
                        </div>
                      )}

                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {letter.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn-ghost text-sm flex items-center gap-1">
                        <Reply className="w-3 h-3" />
                        Reply
                      </button>
                      <button className="btn-ghost text-sm flex items-center gap-1">
                        <Forward className="w-3 h-3" />
                        Forward
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLetters.length === 0 && (
          <div className="text-center py-16">
            <div className="card-elevated p-12 max-w-md mx-auto">
              <div className="text-5xl mb-4">📬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery || selectedFilter !== "all"
                  ? "No messages found"
                  : "Your inbox is empty"}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {searchQuery || selectedFilter !== "all"
                  ? "Try adjusting your search or filter settings"
                  : "When people send you letters, they'll appear here"}
              </p>
              {!searchQuery && selectedFilter === "all" && (
                <Link to="/write" className="btn-primary">
                  Write a Letter
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutNew>
  );
}
