import { useState } from "react";
import LayoutNew from "@/components/LayoutNew";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Edit,
  Trash2,
  Star,
} from "lucide-react";

export default function PastLettersNew() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const letters = [
    {
      id: 1,
      title: "Letter about morning walks and finding peace",
      preview:
        "Dear friend, I wanted to share something beautiful that happened to me this morning during my walk...",
      recipient: "Anonymous",
      status: "delivered",
      date: new Date("2024-01-15"),
      readCount: 12,
      heartCount: 8,
      replyCount: 3,
      category: "personal",
      mood: "peaceful",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Thoughts on creativity and inspiration",
      preview:
        "I've been thinking about where creativity comes from and wanted to explore this idea with someone...",
      recipient: "Sarah Chen",
      status: "delivered",
      date: new Date("2024-01-12"),
      readCount: 8,
      heartCount: 15,
      replyCount: 5,
      category: "creative",
      mood: "inspired",
      isFavorite: false,
    },
    {
      id: 3,
      title: "A letter about overcoming challenges",
      preview:
        "Life has been throwing curveballs lately, but I've learned something important about resilience...",
      recipient: "John Jacobs",
      status: "read",
      date: new Date("2024-01-10"),
      readCount: 5,
      heartCount: 12,
      replyCount: 2,
      category: "growth",
      mood: "resilient",
      isFavorite: true,
    },
    {
      id: 4,
      title: "Random thoughts on coffee shops",
      preview:
        "Sitting in this little café, I'm observing the beautiful dance of human interaction around me...",
      recipient: "Anonymous",
      status: "draft",
      date: new Date("2024-01-08"),
      readCount: 0,
      heartCount: 0,
      replyCount: 0,
      category: "observation",
      mood: "contemplative",
      isFavorite: false,
    },
    {
      id: 5,
      title: "Letter about childhood memories",
      preview:
        "I was looking through old photos today and remembered this one summer when I was eight years old...",
      recipient: "Marcus Rivera",
      status: "delivered",
      date: new Date("2024-01-05"),
      readCount: 20,
      heartCount: 25,
      replyCount: 8,
      category: "memory",
      mood: "nostalgic",
      isFavorite: true,
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Letters" },
    { value: "delivered", label: "Delivered" },
    { value: "read", label: "Read" },
    { value: "draft", label: "Drafts" },
    { value: "favorites", label: "Favorites" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most-read", label: "Most Read" },
    { value: "most-hearts", label: "Most Hearts" },
  ];

  const filteredLetters = letters
    .filter((letter) => {
      if (selectedFilter === "favorites") return letter.isFavorite;
      if (selectedFilter === "all") return true;
      return letter.status === selectedFilter;
    })
    .filter(
      (letter) =>
        letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        letter.preview.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.date.getTime() - b.date.getTime();
        case "most-read":
          return b.readCount - a.readCount;
        case "most-hearts":
          return b.heartCount - a.heartCount;
        default: // newest
          return b.date.getTime() - a.date.getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "read":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "peaceful":
        return "😌";
      case "inspired":
        return "✨";
      case "resilient":
        return "💪";
      case "contemplative":
        return "🤔";
      case "nostalgic":
        return "🌅";
      default:
        return "💭";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-heading-2 text-gray-900 mb-2">Your Letters</h1>
            <p className="text-body text-gray-600">
              A collection of your thoughts, stories, and connections
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {filteredLetters.length}{" "}
              {filteredLetters.length === 1 ? "letter" : "letters"}
            </span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your letters..."
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field min-w-[140px]"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-rumi-purple mb-1">
              {letters.length}
            </div>
            <div className="text-sm text-gray-600">Total Letters</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {
                letters.filter(
                  (l) => l.status === "delivered" || l.status === "read",
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Sent Letters</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-rumi-orange mb-1">
              {letters.reduce((sum, l) => sum + l.readCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Reads</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-pink-600 mb-1">
              {letters.reduce((sum, l) => sum + l.heartCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Hearts Received</div>
          </div>
        </div>

        {/* Letters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLetters.map((letter) => (
            <div key={letter.id} className="card-interactive p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getMoodEmoji(letter.mood)}</span>
                  <div>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(letter.status)}`}
                    >
                      {letter.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {letter.isFavorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-rumi-purple transition-colors line-clamp-2">
                  {letter.title}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                  {letter.preview}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {formatDate(letter.date)}
                  </div>

                  <div className="text-sm text-gray-500">
                    To: <span className="font-medium">{letter.recipient}</span>
                  </div>
                </div>

                {letter.status !== "draft" && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {letter.readCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {letter.heartCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {letter.replyCount}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLetters.length === 0 && (
          <div className="text-center py-16">
            <div className="card-elevated p-12 max-w-md mx-auto">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery || selectedFilter !== "all"
                  ? "No letters found"
                  : "No letters yet"}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {searchQuery || selectedFilter !== "all"
                  ? "Try adjusting your search or filter settings"
                  : "Start writing your first letter to begin building your collection"}
              </p>
              {!searchQuery && selectedFilter === "all" && (
                <button className="btn-primary">Write Your First Letter</button>
              )}
            </div>
          </div>
        )}
      </div>
    </LayoutNew>
  );
}
