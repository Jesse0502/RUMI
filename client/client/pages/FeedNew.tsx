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
      <div className="relative w-full min-h-full bg-gray-50 flex flex-col items-center">
        {/* Header */}
        <header className="w-full border-b border-gray-200">
          <div className="max-w-2xl mx-auto py-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              RUMI AI Match
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Describe the person you're looking for — AI will suggest matches.
            </p>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-5 pb-28">
          <div className="space-y-4">
            {messages.length === 0 && !isTyping ? (
              <div className="text-center text-gray-500 py-12">
                Ask the AI to find someone for you. Example:{" "}
                <em>
                  "friendly product designer in Brooklyn, open to collaboration"
                </em>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`whitespace-pre-line px-4 py-2 rounded-lg max-w-[78%] text-sm leading-relaxed ${
                      msg.isUser
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {/* add a small info card to show to matches that the user found stored in the matches state */}
                </div>
              ))
            )}

            <div>
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="mt-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-start gap-4"
                >
                  <img
                    src={
                      match.image ??
                      "https://images.unsplash.com/photo-1559116315-702b0b4774ce?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZHVtbXl8ZW58MHx8MHx8fDA%3D"
                    }
                    alt={`${match.name} avatar`}
                    className="w-24 h-full rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        {match.name}
                      </h4>
                      <span className="text-sm text-gray-500">{match.age}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {match.location}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Why: {match.reason}
                    </p>
                    <button
                      // onClick={() => handleSelectMatch(match)}
                      className="mt-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
                    >
                      Go to Profile
                    </button>
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
        </main>

        {/* Input */}
        <div className="fixed bottom-20 flex justify-center px-4 w-full left-36">
          <div className="w-full max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="bg-white border border-gray-200 rounded-full shadow-sm px-4 py-3 flex items-center gap-3"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder='Describe who you need, e.g. "product designer, Brooklyn, collaborative"'
                className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                disabled={!message.trim() || isTyping}
                className={`ml-2 px-4 py-2 rounded-full text-sm font-medium ${
                  message.trim() && !isTyping
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </LayoutNew>
  );
}
