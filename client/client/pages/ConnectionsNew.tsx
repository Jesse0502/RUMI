import LayoutNew from "@/components/LayoutNew";
import { MessageCircle, Users, Plus, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ConnectionsNew() {
  const [activeTab, setActiveTab] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPendingRequests, setShowPendingRequests] = useState(false);

  const pendingRequests = [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "A",
      message: "I'd love to connect and discuss design projects together!",
      timestamp: new Date("2024-01-16T14:20:00"),
      fromMessage: "🎯 Freelance Graphic Designer Available - Creative Solutions for Your Brand",
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar: "S",
      message: "Your thoughts on creativity really resonated with me. Would love to continue our conversation!",
      timestamp: new Date("2024-01-15T08:30:00"),
      fromMessage: "Re: Thoughts on creativity and inspiration",
    },
  ];

  const connections = [
    {
      id: 1,
      name: "John Jacobs",
      lastMessage: "Thanks for the thoughtful letter about morning walks.",
      timestamp: "2m ago",
      avatar: "J",
      unread: true,
      isOnline: true,
    },
    {
      id: 2,
      name: "Sarah Chen",
      lastMessage:
        "I completely agree with your thoughts on authentic connections.",
      timestamp: "1h ago",
      avatar: "S",
      unread: false,
      isOnline: true,
    },
    {
      id: 3,
      name: "Marcus Williams",
      lastMessage: "Your perspective on mindfulness really resonated with me.",
      timestamp: "3h ago",
      avatar: "M",
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
    },
    {
      id: 2,
      name: "Morning Walkers",
      lastMessage: "Beautiful sunrise photos from today's walk",
      timestamp: "1h ago",
      avatar: "🌅",
      members: 89,
      unread: false,
    },
    {
      id: 3,
      name: "Coffee Lovers",
      lastMessage: "Found an amazing new café downtown!",
      timestamp: "3h ago",
      avatar: "☕",
      members: 203,
      unread: false,
    },
  ];

  const filteredConnections = connections.filter((conn) =>
    conn.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCommunities = communities.filter((comm) =>
    comm.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-heading-2 text-gray-900 mb-2">Connections</h1>
            <p className="text-body text-gray-600">
              Connect with like-minded people through meaningful conversations
            </p>
          </div>

          <button className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            New Connection
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex gap-2">
            {/* Tab Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("chats")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "chats"
                    ? "bg-white text-rumi-purple shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Chats</span>
              </button>
              <button
                onClick={() => setActiveTab("communities")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "communities"
                    ? "bg-white text-rumi-purple shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Groups</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeTab === "chats"
            ? filteredConnections.map((connection) => (
                <Link
                  key={connection.id}
                  to="/chat"
                  className="card-interactive p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-rumi-purple rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                        {connection.avatar}
                      </div>
                      {connection.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                      {connection.unread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rumi-orange rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-rumi-purple transition-colors">
                          {connection.name}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                          {connection.timestamp}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                        {connection.lastMessage}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              connection.isOnline
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span className="text-xs text-gray-500">
                            {connection.isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                        <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-rumi-purple transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            : filteredCommunities.map((community) => (
                <Link
                  key={community.id}
                  to="/chat"
                  className="card-interactive p-6 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl shadow-sm">
                        {community.avatar}
                      </div>
                      {community.unread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rumi-orange rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-rumi-purple transition-colors">
                            {community.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {community.members} members
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                          {community.timestamp}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                        {community.lastMessage}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-500">
                            Active community
                          </span>
                        </div>
                        <Users className="w-4 h-4 text-gray-400 group-hover:text-rumi-purple transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {/* Empty State */}
        {((activeTab === "chats" && filteredConnections.length === 0) ||
          (activeTab === "communities" &&
            filteredCommunities.length === 0)) && (
          <div className="text-center py-16">
            <div className="card-elevated p-12 max-w-md mx-auto">
              <div className="text-5xl mb-4">
                {activeTab === "chats" ? "💬" : "👥"}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery
                  ? "No results found"
                  : activeTab === "chats"
                    ? "No connections yet"
                    : "No communities yet"}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : activeTab === "chats"
                    ? "Write your first letter to start connecting with others"
                    : "Join communities to connect with like-minded people"}
              </p>
              {!searchQuery && (
                <Link
                  to="/write"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Start Writing
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-elevated p-6 text-center">
            <div className="text-2xl font-bold text-rumi-purple mb-1">
              {connections.length + communities.length}
            </div>
            <div className="text-sm text-gray-600">Total Connections</div>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {connections.filter((c) => c.isOnline).length}
            </div>
            <div className="text-sm text-gray-600">Online Now</div>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="text-2xl font-bold text-rumi-orange mb-1">
              {connections.filter((c) => c.unread).length +
                communities.filter((c) => c.unread).length}
            </div>
            <div className="text-sm text-gray-600">Unread Messages</div>
          </div>

          <div className="card-elevated p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {communities.reduce((sum, c) => sum + c.members, 0)}
            </div>
            <div className="text-sm text-gray-600">Community Members</div>
          </div>
        </div>
      </div>
    </LayoutNew>
  );
}
