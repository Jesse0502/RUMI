import LayoutNew from "@/components/LayoutNew";
import {
  Heart,
  MessageCircle,
  User,
  Mail,
  Star,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Reply,
  Forward,
  Archive,
  Edit3,
  Upload,
  X,
  Paperclip,
  Send,
  FileText,
  Image,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function InboxNew() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [letterForm, setLetterForm] = useState({
    title: "",
    content: "",
    targetAudience: "",
    skills: "",
    lookingFor: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allLetters, setAllLetters] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(7); // Start from 7 since initial letters use IDs 1-6

  // Generate initial letters
  const initialLetters = [
    {
      id: 1,
      from: "Sarah Chen",
      avatar: "S",
      subject: "Thank you for your beautiful letter about morning walks",
      preview:
        "Your words about finding peace in the early hours really resonated with me. I wanted to share my own experience...",
      timestamp: new Date("2024-01-15T08:30:00"),
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      category: "personal",
      mood: "grateful",
      replyCount: 0,
    },
    {
      id: 2,
      from: "John Jacobs",
      avatar: "J",
      subject: "Re: Thoughts on creativity and inspiration",
      preview:
        "I loved reading about your creative process! It reminded me of something Maya Angelou once said about inspiration...",
      timestamp: new Date("2024-01-14T15:45:00"),
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      category: "creative",
      mood: "inspired",
      replyCount: 3,
    },
    {
      id: 3,
      from: "Anonymous Writer",
      avatar: "?",
      subject: "Your letter touched my heart",
      preview:
        "I don't usually reach out to strangers, but your letter about overcoming challenges gave me hope during a difficult time...",
      timestamp: new Date("2024-01-14T10:20:00"),
      isRead: true,
      isStarred: true,
      hasAttachment: false,
      category: "support",
      mood: "hopeful",
      replyCount: 1,
    },
    {
      id: 4,
      from: "Marcus Rivera",
      avatar: "M",
      subject: "Coffee shop observations - so relatable!",
      preview:
        "I was sitting in a café when I read your letter, and I couldn't help but smile at how perfectly you captured...",
      timestamp: new Date("2024-01-13T19:15:00"),
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      category: "observation",
      mood: "amused",
      replyCount: 0,
    },
    {
      id: 5,
      from: "Emma Thompson",
      avatar: "E",
      subject: "Childhood memories that shape us",
      preview:
        "Your story about that summer when you were eight brought back so many memories of my own childhood adventures...",
      timestamp: new Date("2024-01-12T14:30:00"),
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      category: "memory",
      mood: "nostalgic",
      replyCount: 2,
    },
    {
      id: 6,
      from: "David Park",
      avatar: "D",
      subject: "Letter exchange invitation",
      preview:
        "Hi! I came across your profile and really enjoyed your writing style. Would you be interested in becoming pen pals?",
      timestamp: new Date("2024-01-11T09:45:00"),
      isRead: false,
      isStarred: false,
      hasAttachment: false,
      category: "invitation",
      mood: "friendly",
      replyCount: 0,
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Mail" },
    { value: "unread", label: "Unread" },
    { value: "starred", label: "Starred" },
    { value: "replies", label: "Replies" },
    { value: "attachments", label: "Has Attachments" },
  ];

  // Initialize letters on first load
  useEffect(() => {
    if (allLetters.length === 0) {
      setAllLetters(initialLetters);
    }
  }, []);

  // Generate more letters for pagination
  const generateMoreLetters = (startId: number, count: number) => {
    const names = ["Alex Johnson", "Maria Garcia", "David Kim", "Sophie Brown", "James Wilson", "Elena Rodriguez", "Michael Zhang", "Isabella Chen"];
    const subjects = [
      "Re: Your thoughts on remote work",
      "Coffee chat invitation",
      "Collaboration opportunity",
      "Thank you for your advice",
      "Weekend hiking plans",
      "Book recommendation",
      "Project update",
      "Networking event follow-up"
    ];

    return Array.from({ length: count }, (_, i) => {
      const id = startId + i;
      const name = names[id % names.length];
      const subject = subjects[id % subjects.length];
      return {
        id,
        from: name,
        avatar: name[0],
        subject: `${subject} #${id}`,
        preview: `This is a sample message preview for letter ${id}. It contains some interesting content that you might want to read...`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        isRead: Math.random() > 0.3,
        isStarred: Math.random() > 0.8,
        hasAttachment: Math.random() > 0.7,
        category: ["personal", "work", "creative", "social"][Math.floor(Math.random() * 4)],
        mood: ["friendly", "professional", "excited", "thoughtful"][Math.floor(Math.random() * 4)],
        replyCount: Math.floor(Math.random() * 3),
      };
    });
  };

  // Load more letters
  const loadMoreLetters = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      setAllLetters(prev => {
        const newLetters = generateMoreLetters(prev.length + 1, 10);
        return [...prev, ...newLetters];
      });
      setPage(prev => {
        const newPage = prev + 1;
        // Stop loading after 5 pages
        if (newPage >= 5) {
          setHasMore(false);
        }
        return newPage;
      });
      setIsLoading(false);
    }, 1000);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreLetters();
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [hasMore, isLoading, page]);

  const filteredLetters = allLetters
    .filter((letter) => {
      if (selectedFilter === "unread") return !letter.isRead;
      if (selectedFilter === "starred") return letter.isStarred;
      if (selectedFilter === "replies") return letter.replyCount > 0;
      if (selectedFilter === "attachments") return letter.hasAttachment;
      return true;
    })
    .filter(
      (letter) =>
        letter.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        letter.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        letter.preview.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const unreadCount = allLetters.filter((l) => !l.isRead).length;
  const starredCount = allLetters.filter((l) => l.isStarred).length;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "grateful":
        return "🙏";
      case "inspired":
        return "✨";
      case "hopeful":
        return "🌟";
      case "amused":
        return "😊";
      case "nostalgic":
        return "🌅";
      case "friendly":
        return "👋";
      default:
        return "💭";
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "from-purple-400 to-pink-500",
      "from-blue-400 to-indigo-500",
      "from-green-400 to-teal-500",
      "from-yellow-400 to-orange-500",
      "from-red-400 to-pink-500",
      "from-indigo-400 to-purple-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const toggleSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === filteredLetters.length
        ? []
        : filteredLetters.map((letter) => letter.id),
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (file.type === "application/pdf") return <FileText className="w-4 h-4" />;
    return <Paperclip className="w-4 h-4" />;
  };

  const composeLetter = () => {
    // AI would analyze the content and files to find matching recipients
    console.log("Composing letter:", letterForm, uploadedFiles);

    // Reset form
    setLetterForm({
      title: "",
      content: "",
      targetAudience: "",
      skills: "",
      lookingFor: "",
    });
    setUploadedFiles([]);
    setShowComposeModal(false);

    // Demo notification
    alert("Letter composed! AI will analyze your content and send to matching recipients.");
  };

  return (
    <LayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Inbox</h1>
            <p className="text-sm text-gray-500 mt-1">
              Letters and messages from your connections
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              {filteredLetters.length}{" "}
              {filteredLetters.length === 1 ? "message" : "messages"}
            </div>

            <button
              onClick={() => setShowComposeModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:bg-indigo-700 transition"
            >
              <Edit3 className="w-4 h-4" />
              Compose Letter
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input-field min-w-[140px]"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button className="btn-secondary flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archive ({selectedItems.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {allLetters.length}
            </div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-rumi-orange mb-1">
              {unreadCount}
            </div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {starredCount}
            </div>
            <div className="text-sm text-gray-600">Starred</div>
          </div>

          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {allLetters.reduce((sum, l) => sum + l.replyCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Replies</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {filteredLetters.length > 0 && (
          <div className="card-elevated p-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredLetters.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-rumi-purple border-gray-300 rounded focus:ring-rumi-purple"
                />
                <span className="text-sm text-gray-600">
                  {selectedItems.length === filteredLetters.length
                    ? "Deselect all"
                    : "Select all"}
                </span>
              </label>

              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-gray-600">
                    {selectedItems.length} selected
                  </span>
                  <button className="btn-ghost text-sm">Mark as read</button>
                  <button className="btn-ghost text-sm">Star</button>
                  <button className="btn-ghost text-sm">Archive</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-3">
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className={`card-elevated p-6 group cursor-pointer transition-all ${
                !letter.isRead ? "bg-blue-50/50 border-blue-200" : ""
              } ${
                selectedItems.includes(letter.id)
                  ? "ring-2 ring-rumi-purple bg-rumi-purple-50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Selection Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(letter.id)}
                    onChange={() => toggleSelection(letter.id)}
                    className="w-4 h-4 text-rumi-purple border-gray-300 rounded focus:ring-rumi-purple"
                  />
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(letter.from)} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}
                  >
                    {letter.avatar}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`font-semibold text-gray-900 ${!letter.isRead ? "font-bold" : ""}`}
                      >
                        {letter.from}
                      </h3>
                      <span className="text-lg">
                        {getMoodEmoji(letter.mood)}
                      </span>
                      {letter.isStarred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {letter.hasAttachment && (
                        <div className="w-4 h-4 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs">📎</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(letter.timestamp)}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <h4
                    className={`text-gray-900 mb-2 line-clamp-1 ${!letter.isRead ? "font-semibold" : ""}`}
                  >
                    {letter.subject}
                  </h4>

                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {letter.preview}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {letter.replyCount > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MessageCircle className="w-4 h-4" />
                          {letter.replyCount}{" "}
                          {letter.replyCount === 1 ? "reply" : "replies"}
                        </div>
                      )}

                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {letter.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="btn-ghost text-sm flex items-center gap-1">
                        <Reply className="w-3 h-3" />
                        Reply
                      </button>
                      <button className="btn-ghost text-sm flex items-center gap-1">
                        <Forward className="w-3 h-3" />
                        Forward
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLetters.length === 0 && (
          <div className="text-center py-16">
            <div className="card-elevated p-12 max-w-md mx-auto">
              <div className="text-5xl mb-4">📬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {searchQuery || selectedFilter !== "all"
                  ? "No messages found"
                  : "Your inbox is empty"}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {searchQuery || selectedFilter !== "all"
                  ? "Try adjusting your search or filter settings"
                  : "When people send you letters, they'll appear here"}
              </p>
              {!searchQuery && selectedFilter === "all" && (
                <Link to="/write" className="btn-primary">
                  Write a Letter
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Compose Letter Modal */}
        {showComposeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Compose Letter</h3>
                  <button
                    onClick={() => setShowComposeModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  AI will analyze your letter and send it to people who match your criteria
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Letter Content */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Letter Title
                    </label>
                    <input
                      type="text"
                      value={letterForm.title}
                      onChange={(e) => setLetterForm({ ...letterForm, title: e.target.value })}
                      placeholder="e.g., Looking for a Co-founder for My Startup"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={letterForm.content}
                      onChange={(e) => setLetterForm({ ...letterForm, content: e.target.value })}
                      rows={8}
                      placeholder="Share your story, idea, or what you're looking for. Be detailed and authentic - this helps AI find the right people for you."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachments (Images, PDFs, Documents)
                  </label>
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex flex-col items-center gap-2"
                    >
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload files or drag and drop
                      </span>
                      <span className="text-xs text-gray-500">
                        Images, PDFs, documents up to 10MB each
                      </span>
                    </button>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            {getFileIcon(file)}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                            <button
                              onClick={() => removeFile(index)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Matching Criteria */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900">Help AI Find the Right People</h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who are you looking for?
                      </label>
                      <input
                        type="text"
                        value={letterForm.targetAudience}
                        onChange={(e) => setLetterForm({ ...letterForm, targetAudience: e.target.value })}
                        placeholder="e.g., entrepreneurs, developers, designers"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Required skills/expertise
                      </label>
                      <input
                        type="text"
                        value={letterForm.skills}
                        onChange={(e) => setLetterForm({ ...letterForm, skills: e.target.value })}
                        placeholder="e.g., React, UI/UX, marketing"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What are you offering/looking for?
                    </label>
                    <input
                      type="text"
                      value={letterForm.lookingFor}
                      onChange={(e) => setLetterForm({ ...letterForm, lookingFor: e.target.value })}
                      placeholder="e.g., co-founder position, collaboration, mentorship"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowComposeModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={composeLetter}
                    disabled={!letterForm.title || !letterForm.content}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send Letter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Infinite Scroll Trigger & Loading */}
        <div ref={bottomRef} className="py-4">
          {isLoading && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                Loading more messages...
              </div>
            </div>
          )}
          {!hasMore && allLetters.length > initialLetters.length && (
            <div className="text-center text-sm text-gray-500 py-4">
              You've reached the end of your messages
            </div>
          )}
        </div>
      </div>
    </LayoutNew>
  );
}
