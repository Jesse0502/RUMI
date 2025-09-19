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
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Demo responses for offline mode
  const getDemoResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('designer') || lowerMessage.includes('design')) {
      return {
        reply: "I understand you're looking for a designer! Based on your description, I can help you find creative professionals. Let me show you some potential matches.",
        matches: [
          {
            id: 1,
            name: "Sarah Chen",
            age: 28,
            location: "Brooklyn, NY",
            reason: "Experienced UX/UI designer with a passion for user-centered design and collaboration. Has worked with startups and loves creative projects.",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e8?w=150&h=150&fit=crop&crop=face"
          },
          {
            id: 2,
            name: "Alex Rodriguez",
            age: 32,
            location: "San Francisco, CA",
            reason: "Senior graphic designer specializing in brand identity and digital marketing. Known for clean, modern designs and meeting tight deadlines.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
          }
        ]
      };
    } else if (lowerMessage.includes('developer') || lowerMessage.includes('engineer')) {
      return {
        reply: "Great! You're looking for a developer. I can help you find talented engineers. Here are some matches based on your criteria.",
        matches: [
          {
            id: 3,
            name: "Maya Patel",
            age: 26,
            location: "Austin, TX",
            reason: "Full-stack developer with React and Node.js expertise. Passionate about AI and building user-friendly applications.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
          }
        ]
      };
    } else {
      return {
        reply: "I'd love to help you find the right person! Could you tell me more about what kind of professional or collaborator you're looking for? For example, their role, location, or specific skills?",
        matches: []
      };
    }
  };

  // Connect WebSocket with retry logic
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectWebSocket = () => {
      try {
        const socket = new WebSocket("ws://localhost:8000/ws");
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("✅ Connected to WebSocket server");
          reconnectAttempts = 0; // Reset attempts on successful connection
        };

        socket.onmessage = (event) => {
          try {
            console.log("Received data:", event.data);
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
            setIsTyping(false);
          } catch (parseError) {
            console.error("Error parsing WebSocket message:", parseError);
            setIsTyping(false);
          }
        };

        socket.onclose = (event) => {
          console.log("❌ WebSocket closed:", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });

          // Attempt to reconnect if not manually closed and under retry limit
          if (reconnectAttempts < maxReconnectAttempts && event.code !== 1000) {
            reconnectAttempts++;
            console.log(`🔄 Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`);
            reconnectTimeout = setTimeout(connectWebSocket, 3000 * reconnectAttempts);
          } else if (reconnectAttempts >= maxReconnectAttempts) {
            console.error("❌ Max reconnection attempts reached. Please refresh the page.");
          }
        };

        socket.onerror = (event) => {
          console.error("⚠️ WebSocket error details:", {
            event: event,
            readyState: socket.readyState,
            url: socket.url,
            timestamp: new Date().toISOString()
          });

          // Switch to offline mode after connection attempts
          if (reconnectAttempts >= 2) {
            setIsOfflineMode(true);
            const offlineMessage = {
              id: Date.now(),
              text: "🔄 AI service unavailable. Running in demo mode with sample responses.",
              isUser: false,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, offlineMessage]);
          } else {
            const errorMessage = {
              id: Date.now(),
              text: "❌ Connection error. Trying to reconnect...",
              isUser: false,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
          }
          setIsTyping(false);
        };

      } catch (connectionError) {
        console.error("❌ Failed to create WebSocket connection:", connectionError);

        // Add user-friendly error message
        const errorMessage = {
          id: Date.now(),
          text: "❌ Unable to connect to AI service. Please make sure the server is running on port 8000.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounting");
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;

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

    // Check WebSocket connection or use offline mode
    if (isOfflineMode || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      // Use demo responses in offline mode
      setTimeout(() => {
        const demoResponse = getDemoResponse(userMessage.text);

        const aiMessage = {
          id: Date.now() + 1,
          text: demoResponse.reply,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        if (demoResponse.matches.length > 0) {
          setMatches(demoResponse.matches);
        }

        setIsTyping(false);
      }, 1500); // Simulate AI thinking time
      return;
    }

    try {
      // Send to WebSocket backend
      socketRef.current.send(userMessage.text);
    } catch (sendError) {
      console.error("❌ Error sending message:", sendError);
      const errorMessage = {
        id: Date.now() + 1,
        text: "❌ Failed to send message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
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
