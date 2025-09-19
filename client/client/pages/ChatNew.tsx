import {
  ArrowLeft,
  Info,
  Send,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function ChatNew() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: "john",
      senderName: "John Jacobs",
      content: "So what do you think about that Sun Tzu guy?",
      timestamp: new Date("2024-01-15T00:34:00"),
      isUser: false,
    },
    {
      id: 2,
      senderId: "me",
      senderName: "Me",
      content: "I think he's cool! His strategies are timeless.",
      timestamp: new Date("2024-01-15T00:35:00"),
      isUser: true,
    },
    {
      id: 3,
      senderId: "me",
      senderName: "Me",
      content: "Smart guy with deep insights about conflict and strategy.",
      timestamp: new Date("2024-01-15T00:35:30"),
      isUser: true,
    },
    {
      id: 4,
      senderId: "john",
      senderName: "John Jacobs",
      content:
        "Haha, actually it's my plumber's name! But yes, the ancient strategist was brilliant too 😄",
      timestamp: new Date("2024-01-15T00:36:00"),
      isUser: false,
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const participants = [
    {
      id: "john",
      name: "John Jacobs",
      avatar: "J",
      status: "online",
      color: "from-orange-400 to-red-500",
    },
    {
      id: "lina",
      name: "Lina Chen",
      avatar: "L",
      status: "online",
      color: "from-pink-400 to-purple-500",
    },
    {
      id: "marcus",
      name: "Marcus Rivera",
      avatar: "M",
      status: "away",
      color: "from-blue-400 to-indigo-500",
    },
    {
      id: "sarah",
      name: "Sarah Wilson",
      avatar: "S",
      status: "online",
      color: "from-green-400 to-teal-500",
    },
    {
      id: "ellie",
      name: "Ellie Thompson",
      avatar: "E",
      status: "offline",
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

    const newMessage = {
      id: messages.length + 1,
      senderId: "me",
      senderName: "Me",
      content: message,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return { text: "Online", color: "text-green-600" };
      case "away":
        return { text: "Away", color: "text-yellow-600" };
      case "offline":
        return { text: "Offline", color: "text-gray-500" };
      default:
        return { text: "Unknown", color: "text-gray-500" };
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              to="/connections"
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                  J
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  John Jacobs
                </h1>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="space-y-4">
              {messages.map((msg, index) => {
                const showAvatar =
                  index === 0 || messages[index - 1].senderId !== msg.senderId;
                const showTimestamp =
                  index === messages.length - 1 ||
                  messages[index + 1].senderId !== msg.senderId ||
                  messages[index + 1].timestamp.getTime() -
                    msg.timestamp.getTime() >
                    300000; // 5 minutes

                return (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[70%] ${msg.isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {msg.isUser ? "M" : "J"}
                          </div>
                        ) : (
                          <div className="w-8 h-8"></div>
                        )}
                      </div>

                      {/* Message */}
                      <div className="flex flex-col">
                        <div
                          className={`px-4 py-2 rounded-2xl shadow-sm ${
                            msg.isUser
                              ? "bg-rumi-purple text-white rounded-br-md"
                              : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {msg.content}
                          </p>
                        </div>

                        {showTimestamp && (
                          <p
                            className={`text-xs text-gray-500 mt-1 ${msg.isUser ? "text-right" : "text-left"}`}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[70%]">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      J
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
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
          <div className="p-4 lg:p-6 border-t border-gray-200">
            <div className="card-elevated p-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-400 text-base leading-relaxed min-h-[20px] max-h-32"
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="btn-primary w-10 h-10 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-3">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>

        {/* Sidebar - Participants */}
        <aside className="hidden lg:block w-80 border-l border-gray-200 bg-white">
          <div className="p-6">
            <div className="space-y-6">
              {/* Participants */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  👥 Participants ({participants.length})
                </h4>
                <div className="space-y-3">
                  {participants.map((participant) => {
                    const statusInfo = getStatusText(participant.status);
                    return (
                      <div
                        key={participant.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="relative">
                          <div
                            className={`w-10 h-10 bg-gradient-to-br ${participant.color} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}
                          >
                            {participant.avatar}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(participant.status)} rounded-full border-2 border-white`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">
                            {participant.name}
                          </div>
                          <div className={`text-xs ${statusInfo.color}`}>
                            {statusInfo.text}
                          </div>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-gray-200">
                <button className="w-full btn-primary">+ Invite Friends</button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
