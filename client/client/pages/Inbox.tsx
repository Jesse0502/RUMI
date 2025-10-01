import LayoutNew from "@/components/common/LayoutNew";
import { Heart, MessageCircle, User, Mail, Star, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Inbox() {
  const letters = [
    {
      id: 1,
      sender: "Anonymous",
      subject: "About your letter on morning walks",
      preview:
        "Your words about finding magic in everyday moments really resonated with me. I wanted to share my own experience with mindful mornings...",
      timestamp: "5m ago",
      isNew: true,
      emotion: "thoughtful",
      color: "from-emerald-400 to-teal-500",
    },
    {
      id: 2,
      sender: "A Fellow Creative",
      subject: "Connection request",
      preview:
        "I'm also a graphic designer and would love to exchange thoughts about creativity, inspiration, and the beautiful struggle of artistic expression...",
      timestamp: "1h ago",
      isNew: true,
      emotion: "excited",
      color: "from-purple-400 to-pink-500",
    },
    {
      id: 3,
      sender: "Thoughtful Reader",
      subject: "Response to your letter",
      preview:
        "Thank you for sharing such vulnerable and beautiful words. I wanted to tell you how your story about overcoming doubt touched my heart...",
      timestamp: "3h ago",
      isNew: false,
      emotion: "grateful",
      color: "from-orange-400 to-red-500",
    },
    {
      id: 4,
      sender: "Midnight Philosopher",
      subject: "Your thoughts on solitude",
      preview:
        "I read your letter about finding peace in solitude during late-night thoughts. As someone who also finds wisdom in quiet moments...",
      timestamp: "1d ago",
      isNew: false,
      emotion: "contemplative",
      color: "from-indigo-400 to-purple-500",
    },
  ];

  const [openReply, setOpenReply] = useState(false);
  const [currentRecipient, setCurrentRecipient] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [likedLetters, setLikedLetters] = useState<number[]>([]);
  const navigate = useNavigate();

  function openReplyDialog(sender: string) {
    setCurrentRecipient(sender);
    setReplyText("");
    setOpenReply(true);
  }

  function toggleLike(letterId: number) {
    setLikedLetters((prev) =>
      prev.includes(letterId)
        ? prev.filter((id) => id !== letterId)
        : [...prev, letterId],
    );
  }

  async function sendReply() {
    setOpenReply(false);
    await fetch("/api/send-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Message ✨",
        body: replyText.slice(0, 120),
        data: { type: "message" },
      }),
    });
    navigate("/chat");
  }

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case "thoughtful":
        return "🤔";
      case "excited":
        return "🎨";
      case "grateful":
        return "🙏";
      case "contemplative":
        return "🌙";
      default:
        return "💌";
    }
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
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3 lg:mb-4 flex items-center justify-center lg:justify-start gap-3">
              <Mail className="w-8 h-8 lg:w-12 lg:h-12 text-purple-500" />
              Your Inbox ✨
            </h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Messages and responses from people who connected with your letters
              and want to continue the conversation
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {letters.length}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                Total Messages
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                {letters.filter((l) => l.isNew).length}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                New Messages
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {likedLetters.length}
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                Liked Messages
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4 lg:p-6 text-center">
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                24h
              </div>
              <div className="text-xs lg:text-sm text-gray-600 mt-1">
                Avg Response
              </div>
            </div>
          </div>

          {/* Letters Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {letters.map((letter, index) => (
              <div
                key={letter.id}
                className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${
                  letter.isNew ? "ring-2 ring-purple-200 ring-opacity-50" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${letter.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {getEmotionEmoji(letter.emotion)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {letter.sender}
                        </span>
                        {letter.isNew && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {letter.timestamp}
                      </div>
                    </div>
                  </div>

                  {letter.isNew && (
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping"></div>
                  )}
                </div>

                {/* Subject */}
                <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-purple-600 transition-colors">
                  {letter.subject}
                </h3>

                {/* Preview */}
                <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                  {letter.preview}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => openReplyDialog(letter.sender)}
                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">Reply</span>
                    </button>

                    <button
                      onClick={() => toggleLike(letter.id)}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                        likedLetters.includes(letter.id)
                          ? "text-red-600 bg-red-50"
                          : "text-gray-500 hover:text-red-500 hover:bg-red-50"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${likedLetters.includes(letter.id) ? "fill-current" : ""}`}
                      />
                      <span className="font-medium">Like</span>
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-400 capitalize">
                      {letter.emotion}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {letters.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6 animate-bounce">📮</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Your inbox is empty
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  When people respond to your letters, you'll see them here.
                  Keep writing to build meaningful connections!
                </p>
                <a
                  href="/write"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Star className="w-4 h-4" />
                  Write Your First Letter
                </a>
              </div>
            </div>
          )}

          {/* Reply Dialog */}
          {openReply && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 lg:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-gray-900">
                    Reply to {currentRecipient} ✨
                  </h4>
                  <button
                    onClick={() => setOpenReply(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={6}
                    className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-white/90 backdrop-blur-sm"
                    placeholder="Write your heartfelt reply..."
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setOpenReply(false)}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendReply}
                    disabled={!replyText.trim()}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      replyText.trim()
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Send Reply ✨
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutNew>
  );
}
