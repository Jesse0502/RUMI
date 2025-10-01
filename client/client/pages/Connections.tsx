import LayoutNew from "@/components/common/LayoutNew";
import { MessageCircle, Users, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Connections() {
  const [activeTab, setActiveTab] = useState("chats");

  const connections = [
    {
      id: 1,
      name: "John Jacobs",
      lastMessage: "it's my plumber's name",
      timestamp: "2m ago",
      avatar: "J",
      color: "from-orange-400 to-red-500",
      unread: true,
      isOnline: true,
    },
    {
      id: 2,
      name: "Sarah Chen",
      lastMessage: "Thank you for the beautiful letter about morning walks...",
      timestamp: "1h ago",
      avatar: "S",
      color: "from-pink-400 to-purple-500",
      unread: false,
      isOnline: true,
    },
    {
      id: 3,
      name: "Marcus Williams",
      lastMessage:
        "I completely agree with your thoughts on authentic connections",
      timestamp: "3h ago",
      avatar: "M",
      color: "from-blue-400 to-indigo-500",
      unread: false,
      isOnline: false,
    },
  ];

  const communities = [
    {
      id: 1,
      name: "Creative Writers",
      lastMessage: "New prompt: Write about childhood memories...",
      timestamp: "5m ago",
      avatar: "✍️",
      members: 127,
      unread: true,
      color: "from-emerald-400 to-teal-500",
    },
    {
      id: 2,
      name: "Morning Walkers",
      lastMessage: "Beautiful sunrise photos from today's walk",
      timestamp: "1h ago",
      avatar: "🌅",
      members: 89,
      unread: false,
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: 3,
      name: "Coffee Lovers",
      lastMessage: "Found an amazing new café downtown!",
      timestamp: "3h ago",
      avatar: "☕",
      members: 203,
      unread: false,
      color: "from-amber-400 to-yellow-500",
    },
  ];

  return (
    <LayoutNew>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-8 space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3 lg:mb-4">
              Your Connections ✨
            </h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Connect with like-minded people through meaningful conversations
              and shared experiences
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex justify-center lg:justify-start">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-1.5 inline-flex">
              <button
                onClick={() => setActiveTab("chats")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform ${
                  activeTab === "chats"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-purple-600 hover:bg-white/50"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Single Chats</span>
                <span className="sm:hidden">Chats</span>
              </button>
              <button
                onClick={() => setActiveTab("communities")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform ${
                  activeTab === "communities"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-purple-600 hover:bg-white/50"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Communities</span>
                <span className="sm:hidden">Groups</span>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {activeTab === "chats"
              ? connections.map((connection, index) => (
                  <Link
                    key={connection.id}
                    to="/chat"
                    className="group block bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${connection.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {connection.avatar}
                        </div>
                        {connection.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                        )}
                        {connection.unread && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Heart className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900 truncate text-lg group-hover:text-purple-600 transition-colors">
                            {connection.name}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 bg-gray-100 px-2 py-1 rounded-full">
                            {connection.timestamp}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                          {connection.lastMessage}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${connection.isOnline ? "bg-green-400" : "bg-gray-400"}`}
                            ></div>
                            <span className="text-xs text-gray-500">
                              {connection.isOnline ? "Online" : "Offline"}
                            </span>
                          </div>
                          <MessageCircle className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              : communities.map((community, index) => (
                  <Link
                    key={community.id}
                    to="/chat"
                    className="group block bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${community.color} rounded-full flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {community.avatar}
                        </div>
                        {community.unread && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 truncate text-lg group-hover:text-purple-600 transition-colors">
                              {community.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              <Users className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {community.members} members
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0 bg-gray-100 px-2 py-1 rounded-full">
                            {community.timestamp}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                          {community.lastMessage}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-500">
                              Active community
                            </span>
                          </div>
                          <Users className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>

          {/* Empty State */}
          {((activeTab === "chats" && connections.length === 0) ||
            (activeTab === "communities" && communities.length === 0)) && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6 animate-bounce">
                  {activeTab === "chats" ? "💌" : "👥"}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {activeTab === "chats"
                    ? "No connections yet"
                    : "No communities yet"}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {activeTab === "chats"
                    ? "Write your first letter to start connecting with others who share your thoughts and interests"
                    : "Join communities to connect with like-minded people and engage in meaningful conversations"}
                </p>
                <Link
                  to="/write"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Writing
                </Link>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {connections.length + communities.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Total Connections
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                {connections.filter((c) => c.isOnline).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Online Now</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {connections.filter((c) => c.unread).length +
                  communities.filter((c) => c.unread).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Unread Messages</div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                {communities.reduce((sum, c) => sum + c.members, 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Community Members
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutNew>
  );
}
