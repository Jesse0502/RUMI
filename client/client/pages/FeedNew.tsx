import LayoutNew from "@/components/LayoutNew";
import { useState, useEffect, useRef } from "react";
import { Sparkles, Upload, MapPin, User } from "lucide-react";

export default function AIMatch() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: number; text: string; isUser: boolean; timestamp: Date }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [matches, setMatches] = useState<any[]>([]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Connect WebSocket once
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      console.log(event.data);
      const data = JSON.parse(event.data);
      if (data.matches) {
        setMatches(data.matches);
        console.log("Received matches:", data.matches);
      }
      if (!data.reply) {
        setIsTyping(false);
        return;
      }
      console.log("Received AI reply:", data.reply);
      // Add AI text reply
      const aiMessage = {
        id: Date.now(),
        text: data.reply,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // If matches exist → render them as one combined message
      // if (data.matches && data.matches.length > 0) {
      //   const matchText = data.matches
      //     .map(
      //       (m: any) =>
      //         `⭐ ${m.name} (${m.age}, ${m.location})\nWhy: ${m.reason}`,
      //     )
      //     .join("\n\n");

      //   setMessages((prev) => [
      //     ...prev,
      //     {
      //       id: Date.now() + 1,
      //       text: `Here are some potential matches:\n\n${matchText}`,
      //       isUser: false,
      //       timestamp: new Date(),
      //     },
      //   ]);
      // }

      setIsTyping(false);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim() || !socketRef.current) return;

    const userMessage = {
      id: Date.now(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Show user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Send to WebSocket backend
    socketRef.current.send(userMessage.text);
  };

  return (
    <LayoutNew>
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto py-8 px-4 lg:px-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-indigo-600" />
                AI Match
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Describe the person you're looking for — AI will suggest perfect matches
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                ✨ AI-Powered
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 min-h-[500px] relative">
            <div className="space-y-4">
              {messages.length === 0 && !isTyping ? (
                <div className="text-center text-gray-500 py-12">
                  <div className="mb-4 text-4xl">🤖</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Ready to find your perfect match?</h3>
                  <p className="text-sm">
                    Describe the person you're looking for. Try:{" "}
                    <em className="text-indigo-600">
                      "creative photographer in San Francisco who loves coffee"
                    </em>
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`whitespace-pre-line px-4 py-3 rounded-xl max-w-[75%] text-sm leading-relaxed ${
                        msg.isUser
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-50 border border-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}

              <div className="space-y-4">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          match.image ??
                          "https://images.unsplash.com/photo-1559116315-702b0b4774ce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHVtbXl8ZW58MHx8MHx8fDA%3D"
                        }
                        alt={`${match.name} avatar`}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-indigo-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {match.name}
                          </h4>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{match.age}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          {match.location}
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          <span className="font-medium text-indigo-600">Match reason:</span> {match.reason}
                        </p>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
                            <User className="w-4 h-4 inline mr-1" />
                            View Profile
                          </button>
                          <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm">
                  <div className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                    <span className="ml-2 text-xs text-gray-500">
                      AI is typing…
                    </span>
                  </div>
                </div>
              </div>
            )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Enhanced Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Describe your ideal match: "creative photographer, 25-35, San Francisco, loves coffee and hiking"'
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className={`px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                    message.trim() && !isTyping
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {isTyping ? "Finding..." : "Find Match"}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>💡 Try: profession, age range, location, interests, personality traits</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutNew>
  );
}
