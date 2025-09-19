import { ArrowLeft, Info, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = [
    {
      id: 1,
      sender: "other",
      content: "So what do you think about that Sun Tzu guy?",
      timestamp: "12:34 am",
      name: "John",
    },
    {
      id: 2,
      sender: "me",
      content: "I think he's cool! His strategies are timeless.",
      timestamp: "12:35 am",
      name: "You",
    },
    {
      id: 3,
      sender: "me",
      content: "Smart guy with deep insights about conflict and strategy.",
      timestamp: "12:35 am",
      name: "You",
    },
    {
      id: 4,
      sender: "other",
      content:
        "Haha, actually it's my plumber's name! But yes, the ancient strategist was brilliant too 😄",
      timestamp: "12:36 am",
      name: "John",
    },
  ];

  const members = [
    {
      name: "John Jacobs",
      status: "online",
      avatar: "J",
      color: "from-orange-400 to-red-500",
    },
    {
      name: "Lina Chen",
      status: "online",
      avatar: "L",
      color: "from-pink-400 to-purple-500",
    },
    {
      name: "Marcus Rivera",
      status: "away",
      avatar: "M",
      color: "from-blue-400 to-indigo-500",
    },
    {
      name: "Sarah Wilson",
      status: "online",
      avatar: "S",
      color: "from-green-400 to-teal-500",
    },
    {
      name: "Ellie Thompson",
      status: "offline",
      avatar: "E",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setIsTyping(true);
    // Simulate sending
    setTimeout(() => {
      setMessage("");
      setIsTyping(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-400";
      case "away":
        return "bg-yellow-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-white/50 px-4 py-4 shadow-lg">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <Link
                to="/connections"
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    J
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    John Jacobs
                  </h1>
                  <p className="text-sm text-green-600 font-medium">Online</p>
                </div>
              </div>
            </div>
            <button className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 lg:grid lg:grid-cols-4 max-w-6xl mx-auto w-full">
          {/* Messages Area */}
          <div className="lg:col-span-3 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 p-4 lg:p-6 overflow-auto">
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${msg.sender === "me" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {msg.sender === "other" && (
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            J
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col">
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border border-white/50 ${
                            msg.sender === "me"
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
                              : "bg-white/90 text-gray-800 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm lg:text-base leading-relaxed">
                            {msg.content}
                          </p>
                        </div>

                        {(index === messages.length - 1 ||
                          messages[index + 1]?.sender !== msg.sender) && (
                          <p
                            className={`text-xs text-gray-500 mt-1 ${msg.sender === "me" ? "text-right" : "text-left"}`}
                          >
                            {msg.timestamp}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        J
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border border-white/50">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0 p-4 lg:p-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-4">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      className="w-full resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-400 text-lg leading-relaxed min-h-[50px] max-h-32"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    className={`px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 transform ${
                      message.trim() && !isTyping
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg active:scale-95"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {isTyping ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-center text-gray-500 text-sm mt-3">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>

          {/* Members Sidebar - Desktop */}
          <aside className="hidden lg:block lg:col-span-1 p-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 sticky top-6">
              <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>👥</span> Members ({members.length})
              </h4>

              <div className="space-y-4">
                {members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        {member.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-white`}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {member.name}
                      </div>
                      <div
                        className={`text-xs capitalize ${
                          member.status === "online"
                            ? "text-green-600"
                            : member.status === "away"
                              ? "text-yellow-600"
                              : "text-gray-500"
                        }`}
                      >
                        {member.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 hover:shadow-lg text-sm">
                  + Invite Friends
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
