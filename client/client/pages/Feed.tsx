// ...existing code...
import LayoutNew from "@/components/LayoutNew";
import { useState, useEffect, useRef } from "react";

export default function Feed() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: number; text: string; isUser: boolean; timestamp: Date }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const dummyResponses = [
    "I can help find someone with those qualities — tell me more about location, vibe, or skills.",
    "Noted. I found a few matches who seem aligned. Want to see a sample profile?",
    "Great — narrowing by availability now. Do you prefer remote, local, or either?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // simulate AI
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 800));

    const ai = {
      id: Date.now() + 1,
      text: dummyResponses[Math.floor(Math.random() * dummyResponses.length)],
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, ai]);
    setIsTyping(false);
  };

  return (
    <LayoutNew>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
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

        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {messages.length === 0 && !isTyping ? (
              <div className="text-center text-gray-500 py-12">
                Ask the AI to find someone for you. Example: "friendly product
                designer in Brooklyn, open to collaboration"
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-[78%] text-sm leading-relaxed ${
                      msg.isUser
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}

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

        {/* centered prompt field */}
        <div className="w-full fixed bottom-6 left-0 flex justify-center px-4">
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
