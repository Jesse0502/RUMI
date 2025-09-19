import {
  ChevronDown,
  MoreHorizontal,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Edit3,
  Share2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import LayoutNew from "@/components/LayoutNew";

export default function PastLetters() {
  const [sortBy, setSortBy] = useState("Most Recent");
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  const letters = [
    {
      id: 1,
      status: "ANALYZING",
      statusColor: "from-yellow-400 to-orange-500",
      timestamp: "7 mins ago",
      content:
        "Today I realized that sometimes the best conversations happen with strangers who understand your vibe without knowing your name. There's something magical about connecting without the weight of identity...",
      views: 0,
      likes: 0,
      replies: 0,
      connections: 0,
      delivered: 0,
      mood: "thoughtful",
      anonymous: true,
    },
    {
      id: 2,
      status: "DELIVERED",
      statusColor: "from-blue-400 to-indigo-500",
      timestamp: "2 hours ago",
      content:
        "I've been thinking about how words can bridge the space between strangers, how a simple letter might find its way to exactly the right person at exactly the right moment. What would you like to share with the world?",
      views: 24,
      likes: 18,
      replies: 12,
      connections: 8,
      delivered: 35,
      mood: "hopeful",
      anonymous: false,
    },
    {
      id: 3,
      status: "POPULAR",
      statusColor: "from-pink-400 to-purple-500",
      timestamp: "1 day ago",
      content:
        "Sometimes I wonder if we've lost the art of slow communication. In a world of instant messages, there's something beautiful about taking time to craft words that matter, to let thoughts breathe...",
      views: 89,
      likes: 67,
      replies: 34,
      connections: 23,
      delivered: 127,
      mood: "nostalgic",
      anonymous: false,
    },
    {
      id: 4,
      status: "DRAFT",
      statusColor: "from-gray-400 to-gray-500",
      timestamp: "3 days ago",
      content:
        "The morning light filtered through my window today, and I couldn't help but think about how each sunrise brings new possibilities. Sometimes the smallest moments hold the biggest truths...",
      views: 0,
      likes: 0,
      replies: 0,
      connections: 0,
      delivered: 0,
      mood: "peaceful",
      anonymous: true,
    },
  ];

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "thoughtful":
        return "🤔";
      case "hopeful":
        return "🌟";
      case "nostalgic":
        return "🌅";
      case "peaceful":
        return "🌸";
      default:
        return "💭";
    }
  };

  const getStatusBadge = (status: string, color: string) => {
    const statusConfig = {
      ANALYZING: {
        bg: "from-yellow-100 to-orange-100",
        text: "text-orange-700",
        icon: "🔍",
      },
      DELIVERED: {
        bg: "from-blue-100 to-indigo-100",
        text: "text-blue-700",
        icon: "📤",
      },
      POPULAR: {
        bg: "from-pink-100 to-purple-100",
        text: "text-purple-700",
        icon: "🔥",
      },
      DRAFT: {
        bg: "from-gray-100 to-gray-200",
        text: "text-gray-700",
        icon: "✏️",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;

    return (
      <span
        className={`inline-flex items-center gap-1 bg-gradient-to-r ${config.bg} ${config.text} text-xs font-bold px-3 py-1.5 rounded-full`}
      >
        <span>{config.icon}</span>
        {status}
      </span>
    );
  };

  return (
    <LayoutNew>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-8 space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3 lg:mb-4 flex items-center justify-center lg:justify-start gap-3">
                <Edit3 className="w-8 h-8 lg:w-12 lg:h-12 text-purple-500" />
                Your Letters ✨
              </h1>
              <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Track your letter journey and see how your words connect with
                others around the world
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-1.5">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 text-sm"
                onClick={() =>
                  setSortBy(
                    sortBy === "Most Recent" ? "Most Popular" : "Most Recent",
                  )
                }
              >
                <TrendingUp className="w-4 h-4" />
                {sortBy}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {letters.length}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                Total Letters
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                {letters.reduce((sum, l) => sum + l.views, 0)}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                Total Views
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {letters.reduce((sum, l) => sum + l.likes, 0)}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                Total Likes
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                {letters.reduce((sum, l) => sum + l.connections, 0)}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                Connections
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center lg:col-span-1 col-span-2">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                {Math.round(
                  letters.reduce((sum, l) => sum + l.delivered, 0) /
                    letters.filter((l) => l.delivered > 0).length,
                ) || 0}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                Avg Reach
              </div>
            </div>
          </div>

          {/* Letters Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {letters.map((letter, index) => (
              <div
                key={letter.id}
                className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer ${
                  selectedLetter === letter.id ? "ring-2 ring-purple-300" : ""
                }`}
                onClick={() =>
                  setSelectedLetter(
                    selectedLetter === letter.id ? null : letter.id,
                  )
                }
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${letter.statusColor} rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {getMoodEmoji(letter.mood)}
                    </div>
                    <div>
                      {getStatusBadge(letter.status, letter.statusColor)}
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {letter.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {letter.anonymous && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Anonymous
                      </span>
                    )}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-800 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                    {letter.content}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="font-bold text-sm">{letter.views}</span>
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                      <Heart className="w-4 h-4" />
                      <span className="font-bold text-sm">{letter.likes}</span>
                    </div>
                    <div className="text-xs text-gray-500">Likes</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-bold text-sm">
                        {letter.replies}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Replies</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="font-bold text-sm">
                        {letter.connections}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Connects</div>
                  </div>
                </div>

                {/* Actions & Delivery Info */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span>📧</span>
                    <span>Delivered to</span>
                    <span className="font-bold text-purple-600">
                      {letter.delivered} people
                    </span>
                  </div>

                  {letter.status === "DRAFT" ? (
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105">
                      Continue Writing
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium hover:bg-purple-50 px-3 py-2 rounded-lg transition-all duration-300">
                      <Share2 className="w-3 h-3" />
                      Share
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {letters.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6 animate-bounce">✍️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No letters yet
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Start your journey by writing your first letter. Share your
                  thoughts and connect with like-minded people.
                </p>
                <a
                  href="/write"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  Write Your First Letter
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutNew>
  );
}
