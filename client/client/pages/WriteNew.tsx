import LayoutNew from "@/components/common/LayoutNew";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Paperclip, Sparkles, Eye, EyeOff, Save } from "lucide-react";

export default function WriteNew() {
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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

  const characterLimit = 2000;
  const charactersUsed = content.length;
  const charactersLeft = characterLimit - charactersUsed;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + attachments.length > 3) {
      alert("Maximum 3 attachments allowed");
      return;
    }

    setAttachments((prev) => [...prev, ...files]);

    files.forEach((file) => {
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
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setAttachmentPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!content.trim() || isSending) return;

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        navigate("/feed");
      }, 2000);
    } catch (error) {
      alert("Error sending letter. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const saveDraft = () => {
    // Save to localStorage or API
    localStorage.setItem(
      "draft",
      JSON.stringify({
        content,
        anonymous,
        timestamp: new Date().toISOString(),
      }),
    );
    alert("Draft saved successfully!");
  };

  return (
    <LayoutNew>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rumi-purple-50 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-rumi-purple" />
          </div>
          <div>
            <h1 className="text-heading-2 text-gray-900 mb-2">
              Write a Letter
            </h1>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Share your thoughts, feelings, and experiences with someone who
              might need to hear them.
            </p>
          </div>
        </div>

        {/* Writing Ideas */}
        <div className="card-elevated p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Need inspiration? Try one of these:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ideas.map((idea, index) => (
              <button
                key={index}
                onClick={() =>
                  setContent(idea.replace(/^[✨🌅💭❓🎵📚]\s/, "") + " ")
                }
                className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-sm"
              >
                <span className="text-gray-700">{idea}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Writing Area */}
        <div className="card-elevated p-6 space-y-6">
          {/* Content Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Your Letter
            </label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Dear friend,&#10;&#10;I wanted to share something with you today..."
              className="input-field min-h-[300px] resize-none font-mono text-base leading-relaxed"
              maxLength={characterLimit}
            />
            <div className="flex justify-between items-center text-sm">
              <span
                className={`${charactersLeft < 50 ? "text-red-500" : "text-gray-500"}`}
              >
                {charactersUsed}/{characterLimit} characters
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Auto-save enabled</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Attachments (optional)
              </label>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={attachments.length >= 3}
                className="btn-ghost flex items-center gap-2 text-sm"
              >
                <Paperclip className="w-4 h-4" />
                Add File
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {attachments.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {attachments.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      {attachmentPreviews[index] ? (
                        <img
                          src={attachmentPreviews[index]}
                          alt={file.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Paperclip className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="w-4 h-4 text-rumi-purple border-gray-300 rounded focus:ring-rumi-purple"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Send anonymously
                  </span>
                  <p className="text-xs text-gray-500">
                    Your identity will be hidden from the recipient
                  </p>
                </div>
              </label>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                {anonymous ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {anonymous ? "Anonymous" : "Signed"}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={saveDraft}
              className="btn-secondary flex items-center gap-2 flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>

            <button
              onClick={handleSend}
              disabled={!content.trim() || isSending}
              className="btn-primary flex items-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Letter
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="card-elevated p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Writing Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Be Authentic</h4>
              <p className="text-sm text-gray-600">
                Share genuine thoughts and feelings. Authenticity creates the
                deepest connections.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Be Kind</h4>
              <p className="text-sm text-gray-600">
                Your words have power. Choose them thoughtfully and with
                compassion.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Be Specific</h4>
              <p className="text-sm text-gray-600">
                Concrete details and personal stories resonate more than
                abstract concepts.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Be Open</h4>
              <p className="text-sm text-gray-600">
                Vulnerability invites connection. Don't be afraid to share what
                matters to you.
              </p>
            </div>
          </div>
        </div>

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="animate-scale-in bg-white rounded-2xl shadow-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Letter Sent!
              </h2>
              <p className="text-gray-600">
                Your thoughtful words are on their way...
              </p>
            </div>
          </div>
        )}
      </div>
    </LayoutNew>
  );
}
