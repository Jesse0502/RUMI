import LayoutNew from "@/components/common/LayoutNew";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Write() {
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [showIdeas, setShowIdeas] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ideas = [
    "✨ Write about a small moment that changed your day",
    "🌅 Describe a place that calms you and why",
    "💭 Share a childhood memory that shaped you",
    "❓ Ask a question you'd love answered by a stranger",
    "🎵 What song perfectly captures how you feel today?",
    "📚 Share a lesson you learned the hard way",
  ];

  const characterLimit = 280;
  const charactersUsed = content.length;
  const charactersLeft = characterLimit - charactersUsed;

  const getCounterColor = () => {
    if (charactersLeft > 50) return "text-green-500";
    if (charactersLeft > 20) return "text-orange-500";
    return "text-red-500";
  };

  const getProgressWidth = () => {
    return Math.min((charactersUsed / characterLimit) * 100, 100);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (content.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [content]);

  async function handleAttach(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachmentPreviews((prev) => [
            ...prev,
            e.target?.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      }
      setAttachments((prev) => [...prev, file]);
    }
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function sendLetter() {
    if (!content.trim()) return;

    setIsSending(true);

    // Simulate sending delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      await fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Letter Sent! 💌",
          body: content.slice(0, 120),
          data: { type: "letter" },
        }),
      });

      // Show celebration effect
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      // Reset form
      setContent("");
      setAttachments([]);
      setAttachmentPreviews([]);
      setAnonymous(false);
      setIsSending(false);

      // Navigate after celebration
      setTimeout(() => navigate("/past-letters"), 2000);
    } catch (err) {
      console.error(err);
      setIsSending(false);
    }
  }

  function addIdea(text: string) {
    setContent((c) => (c ? c + "\n\n" + text : text));
    setShowIdeas(false);
  }

  return (
    <LayoutNew>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 opacity-20 animate-pulse"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 p-4 lg:p-8 max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent mb-3 lg:mb-4 animate-pulse">
              Share Your Story ✨
            </h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-md mx-auto leading-relaxed px-2">
              Write something beautiful and let our AI find someone who will
              truly appreciate it
            </p>
          </div>

          {/* Main Writing Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02]">
            {/* User Avatar & Header */}
            <div className="p-4 sm:p-6 pb-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
                  {anonymous ? "?" : "Y"}
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-gray-900 font-semibold text-sm sm:text-base">
                    {anonymous ? "Anonymous Writer" : "You"}
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Writing to the world...
                  </div>
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <div className="p-6 pt-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full resize-none border-none outline-none text-xl placeholder-gray-400 bg-transparent min-h-[120px] leading-relaxed"
                  placeholder="What's on your mind today? Share something meaningful..."
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  maxLength={characterLimit}
                />

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="absolute bottom-2 right-2 flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                )}
              </div>

              {/* Image Previews */}
              {attachmentPreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {attachmentPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-32 object-cover rounded-2xl border border-gray-200 shadow-md group-hover:shadow-lg transition-all duration-300"
                      />
                      <button
                        onClick={() => removeAttachment(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-lg hover:scale-110 transform duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Character Counter & Progress */}
              {content.length > 0 && (
                <div className="mt-4 flex justify-end items-center gap-3">
                  <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        charactersLeft > 50
                          ? "bg-green-500"
                          : charactersLeft > 20
                            ? "bg-orange-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${getProgressWidth()}%` }}
                    ></div>
                  </div>
                  <span className={`text-sm font-medium ${getCounterColor()}`}>
                    {charactersLeft}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  {/* Attach Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 sm:gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 sm:px-3 py-1 sm:py-2 rounded-full transition-all duration-200 lg:hover:scale-105 text-sm"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium">
                      Photo
                    </span>
                  </button>

                  {/* Anonymous Toggle */}
                  <label className="flex items-center gap-1 sm:gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-9 h-5 sm:w-11 sm:h-6 rounded-full transition-all duration-300 ${
                          anonymous ? "bg-purple-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow transform transition-all duration-300 ${
                            anonymous
                              ? "translate-x-4 sm:translate-x-5"
                              : "translate-x-0.5"
                          } translate-y-0.5`}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                      Anonymous
                    </span>
                  </label>

                  {/* Inspiration Button */}
                  <button
                    onClick={() => setShowIdeas(!showIdeas)}
                    className="flex items-center gap-1 sm:gap-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50 px-2 sm:px-3 py-1 sm:py-2 rounded-full transition-all duration-200 lg:hover:scale-105 text-sm"
                  >
                    <span className="text-base sm:text-lg">💡</span>
                    <span className="text-xs sm:text-sm font-medium">
                      Inspire
                    </span>
                  </button>
                </div>

                {/* Send Button */}
                <button
                  onClick={sendLetter}
                  disabled={!content.trim() || isSending}
                  className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-white transition-all duration-300 transform text-sm sm:text-base ${
                    content.trim() && !isSending
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 lg:hover:scale-105 hover:shadow-lg active:scale-95"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isSending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Sending...</span>
                      <span className="sm:hidden">Send...</span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Send Letter ✨</span>
                      <span className="sm:hidden">Send ✨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Writing Prompts */}
          {showIdeas && (
            <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>💭</span> Writing Prompts
              </h3>
              <div className="grid gap-3">
                {ideas.map((idea, index) => (
                  <button
                    key={index}
                    onClick={() => addIdea(idea)}
                    className="text-left p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group hover:scale-[1.02] hover:shadow-md border border-purple-100"
                  >
                    <span className="text-gray-700 group-hover:text-purple-700 transition-colors">
                      {idea}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAttach}
            className="hidden"
          />
        </div>
      </div>
    </LayoutNew>
  );
}
