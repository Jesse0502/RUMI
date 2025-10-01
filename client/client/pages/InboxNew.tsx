import LayoutNew from "@/components/common/LayoutNew";
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
import { notifyNewMessage, sendPushNotification } from "@/lib/notifications";
import { toast } from "sonner";

export default function InboxNew() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyAttachments, setReplyAttachments] = useState<File[]>([]);
  const replyFileInputRef = useRef<HTMLInputElement>(null);
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
  const nextIdRef = useRef(4); // Start from 4 since initial letters use IDs 1-3

  // Generate initial letters with conversation threads
  const initialLetters = [
    {
      id: 1,
      from: "Sarah Chen",
      avatar: "S",
      subject: "Re: Thoughts on creativity and inspiration",
      preview:
        "I loved reading about your creative process! It reminded me of something Maya Angelou once said about inspiration...",
      timestamp: new Date("2024-01-15T08:30:00"),
      isRead: false,
      isStarred: true,
      hasAttachment: false,
      category: "creative",
      mood: "inspired",
      replyCount: 3,
      conversation: [
        {
          id: "1-1",
          from: "You",
          avatar: "Y",
          content:
            "I've been thinking a lot about creativity lately. There's something magical about that moment when inspiration strikes - it's like the universe is whispering secrets directly into your soul. I find that my best ideas come when I'm not actively searching for them, but when I'm in a state of quiet receptivity.",
          timestamp: new Date("2024-01-13T10:00:00"),
          isFromMe: true,
        },
        {
          id: "1-2",
          from: "Sarah Chen",
          avatar: "S",
          content:
            "I loved reading about your creative process! It reminded me of something Maya Angelou once said about inspiration - that it comes like a whisper, and we must be still enough to hear it. Your words about quiet receptivity really resonated with me.\n\nI've noticed that my own creative breakthroughs happen in the most unexpected moments - while washing dishes, walking in nature, or just before falling asleep. There's something about letting go of the need to control the process that opens up new possibilities.",
          timestamp: new Date("2024-01-14T15:45:00"),
          isFromMe: false,
        },
        {
          id: "1-3",
          from: "You",
          avatar: "Y",
          content:
            "That Maya Angelou quote is perfect! It's exactly what I was trying to articulate. I love how you mentioned those in-between moments - the dishes, the walks, the drowsy edge of sleep. It's like creativity lives in the margins of our daily lives, waiting for us to notice.",
          timestamp: new Date("2024-01-14T18:20:00"),
          isFromMe: true,
        },
        {
          id: "1-4",
          from: "Sarah Chen",
          avatar: "S",
          content:
            "Yes! The margins - what a beautiful way to put it. I think that's why so many artists talk about the importance of boredom and daydreaming. We live in such a stimulated world that we rarely give ourselves permission to just... exist in those quiet spaces where creativity can bloom.",
          timestamp: new Date("2024-01-15T08:30:00"),
          isFromMe: false,
        },
      ],
    },
    {
      id: 2,
      from: "Alex Johnson",
      avatar: "A",
      subject:
        "🎯 Freelance Graphic Designer Available - Creative Solutions for Your Brand",
      preview:
        "Hi! I'm Alex, a passionate graphic designer with 5+ years of experience in brand identity, web design, and digital marketing...",
      timestamp: new Date("2024-01-16T14:20:00"),
      isRead: false,
      isStarred: false,
      hasAttachment: true,
      category: "business",
      mood: "professional",
      replyCount: 0,
      conversation: [
        {
          id: "2-1",
          from: "Alex Johnson",
          avatar: "A",
          content:
            "Hi! I'm Alex, a passionate graphic designer with 5+ years of experience in brand identity, web design, and digital marketing. I specialize in creating modern, clean designs that tell your story and connect with your audience.\n\n🎨 What I offer:\n• Logo design & brand identity\n• Website design & development\n• Social media graphics\n• Print design (brochures, business cards, etc.)\n• UI/UX design\n\n💼 Recent projects include work for tech startups, local businesses, and creative agencies. I pride myself on delivering high-quality work on time and within budget.\n\nI'd love to learn more about your project and how I can help bring your vision to life. My rates are competitive and I offer package deals for comprehensive branding projects.\n\nFeel free to check out my portfolio at alexjohnsondesign.com or reach out if you'd like to discuss your needs!\n\nBest regards,\nAlex Johnson\nFreelance Graphic Designer\nalex@alexjohnsondesign.com\n(555) 123-4567",
          timestamp: new Date("2024-01-16T14:20:00"),
          isFromMe: false,
        },
      ],
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
      replyCount: 0,
      conversation: [
        {
          id: "3-1",
          from: "Anonymous Writer",
          avatar: "?",
          content:
            "I don't usually reach out to strangers, but your letter about overcoming challenges gave me hope during a difficult time in my life.\n\nI've been struggling with some personal setbacks recently, and your words about finding strength in vulnerability really spoke to me. There's something powerful about sharing our stories - it reminds us that we're not alone in our struggles.\n\nYour perspective on how challenges can become catalysts for growth has given me a new way to look at my current situation. Instead of seeing my difficulties as roadblocks, I'm trying to view them as opportunities for transformation.\n\nThank you for having the courage to share your story. It means more than you know.\n\nWith gratitude,\nA fellow traveler on this journey",
          timestamp: new Date("2024-01-14T10:20:00"),
          isFromMe: false,
        },
      ],
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
  const generateMoreLetters = (count: number) => {
    const names = [
      "Alex Johnson",
      "Maria Garcia",
      "David Kim",
      "Sophie Brown",
      "James Wilson",
      "Elena Rodriguez",
      "Michael Zhang",
      "Isabella Chen",
    ];
    const subjects = [
      "Re: Your thoughts on remote work",
      "Coffee chat invitation",
      "Collaboration opportunity",
      "Thank you for your advice",
      "Weekend hiking plans",
      "Book recommendation",
      "Project update",
      "Networking event follow-up",
    ];

    return Array.from({ length: count }, (_, i) => {
      const id = nextIdRef.current + i;
      const name = names[id % names.length];
      const subject = subjects[id % subjects.length];
      return {
        id,
        from: name,
        avatar: name[0],
        subject: `${subject} #${id}`,
        preview: `This is a sample message preview for letter ${id}. It contains some interesting content that you might want to read...`,
        timestamp: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ),
        isRead: Math.random() > 0.3,
        isStarred: Math.random() > 0.8,
        hasAttachment: Math.random() > 0.7,
        category: ["personal", "work", "creative", "social"][
          Math.floor(Math.random() * 4)
        ],
        mood: ["friendly", "professional", "excited", "thoughtful"][
          Math.floor(Math.random() * 4)
        ],
        replyCount: Math.floor(Math.random() * 3),
      };
    });
  };

  // Load more letters
  const loadMoreLetters = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      const newLetters = generateMoreLetters(10);
      nextIdRef.current += 10; // Update next ID for future generations

      setAllLetters((prev) => [...prev, ...newLetters]);
      setPage((prev) => {
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
      { threshold: 0.1 },
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
    if (file.type === "application/pdf")
      return <FileText className="w-4 h-4" />;
    return <Paperclip className="w-4 h-4" />;
  };

  const openMessageModal = (letter: any) => {
    setSelectedMessage(letter);
    setIsMessageModalOpen(true);

    // Mark message as read if it wasn't already
    if (!letter.isRead) {
      setAllLetters((prev) =>
        prev.map((l) => (l.id === letter.id ? { ...l, isRead: true } : l)),
      );
    }
  };

  const closeMessageModal = () => {
    setSelectedMessage(null);
    setIsMessageModalOpen(false);
    setIsReplying(false);
    setReplyContent("");
    setReplyAttachments([]);
  };

  const toggleReply = () => {
    setIsReplying(!isReplying);
    if (isReplying) {
      setReplyContent("");
      setReplyAttachments([]);
    }
  };

  const sendReply = () => {
    if (!replyContent.trim()) return;

    const newReply = {
      id: `${selectedMessage.id}-${Date.now()}`,
      from: "You",
      avatar: "Y",
      content: replyContent,
      timestamp: new Date(),
      isFromMe: true,
    };

    // Update reply count and conversation for the message
    setAllLetters((prev) =>
      prev.map((l) =>
        l.id === selectedMessage.id
          ? {
              ...l,
              replyCount: l.replyCount + 1,
              conversation: l.conversation
                ? [...l.conversation, newReply]
                : [newReply],
              timestamp: new Date(), // Update timestamp to show as most recent
              isRead: true,
            }
          : l,
      ),
    );

    // Update selected message
    setSelectedMessage((prev) => ({
      ...prev,
      replyCount: prev.replyCount + 1,
      conversation: prev.conversation
        ? [...prev.conversation, newReply]
        : [newReply],
      timestamp: new Date(),
      isRead: true,
    }));

    // Reset reply state
    setIsReplying(false);
    setReplyContent("");
    setReplyAttachments([]);

    // Show toast notification
    toast.success(`Reply sent to ${selectedMessage.from}!`, {
      description: "Your message has been delivered",
      duration: 3000,
    });
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

    // Show success notification
    toast.success("Letter composed successfully!", {
      description:
        "AI will analyze your content and send to matching recipients",
      duration: 4000,
    });
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
              onClick={(e) => {
                // Don't open modal if clicking on checkboxes or action buttons
                if (
                  e.target instanceof HTMLInputElement ||
                  e.target instanceof HTMLButtonElement ||
                  (e.target as HTMLElement).closest("button") ||
                  (e.target as HTMLElement).closest('input[type="checkbox"]')
                ) {
                  return;
                }
                openMessageModal(letter);
              }}
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
                  <h3 className="text-xl font-semibold text-gray-900">
                    Compose Letter
                  </h3>
                  <button
                    onClick={() => setShowComposeModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  AI will analyze your letter and send it to people who match
                  your criteria
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
                      onChange={(e) =>
                        setLetterForm({ ...letterForm, title: e.target.value })
                      }
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
                      onChange={(e) =>
                        setLetterForm({
                          ...letterForm,
                          content: e.target.value,
                        })
                      }
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
                  <h4 className="font-medium text-gray-900">
                    Help AI Find the Right People
                  </h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Who are you looking for?
                      </label>
                      <input
                        type="text"
                        value={letterForm.targetAudience}
                        onChange={(e) =>
                          setLetterForm({
                            ...letterForm,
                            targetAudience: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setLetterForm({
                            ...letterForm,
                            skills: e.target.value,
                          })
                        }
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
                      onChange={(e) =>
                        setLetterForm({
                          ...letterForm,
                          lookingFor: e.target.value,
                        })
                      }
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

        {/* Message Detail Modal */}
        {isMessageModalOpen && selectedMessage && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeMessageModal();
              }
            }}
          >
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(selectedMessage.from)} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}
                    >
                      {selectedMessage.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedMessage.from}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>
                          {formatTimestamp(selectedMessage.timestamp)}
                        </span>
                        <span>•</span>
                        <span className="capitalize">
                          {selectedMessage.category}
                        </span>
                        <span>{getMoodEmoji(selectedMessage.mood)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeMessageModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Subject */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    {selectedMessage.isStarred && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">Starred</span>
                      </div>
                    )}
                    {selectedMessage.hasAttachment && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">Has attachment</span>
                      </div>
                    )}
                    {selectedMessage.replyCount > 0 && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">
                          {selectedMessage.replyCount}{" "}
                          {selectedMessage.replyCount === 1
                            ? "reply"
                            : "replies"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conversation Thread - Email Style */}
                <div className="space-y-4">
                  {(selectedMessage.conversation || []).length > 0 ? (
                    (selectedMessage.conversation || []).map(
                      (message: any, index: number) => (
                        <div
                          key={message.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          {/* Email Header */}
                          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-8 h-8 bg-gradient-to-br ${
                                    message.isFromMe
                                      ? "from-indigo-400 to-purple-500"
                                      : getAvatarColor(message.from)
                                  } rounded-full flex items-center justify-center text-white font-semibold text-xs`}
                                >
                                  {message.avatar}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                      {message.from}
                                    </span>
                                    {message.isFromMe && (
                                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {message.timestamp.toLocaleDateString()} at{" "}
                                    {message.timestamp.toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                      },
                                    )}
                                  </div>
                                </div>
                              </div>
                              {index === 0 && !message.isFromMe && (
                                <button className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors">
                                  Send Connection Request
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Email Content */}
                          <div className="p-6">
                            <div className="prose prose-sm max-w-none">
                              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap m-0">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">
                          This is the beginning of your conversation with{" "}
                          {selectedMessage.from}.
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                          {selectedMessage.preview}
                        </p>
                        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                          Send Connection Request
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Attachments (Demo) */}
                {selectedMessage.hasAttachment && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Attachments
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Image className="w-5 h-5 text-gray-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            sunset-photo.jpg
                          </div>
                          <div className="text-xs text-gray-500">2.3 MB</div>
                        </div>
                        <button className="text-sm text-indigo-600 hover:text-indigo-700">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inline Reply Compose - Email Style */}
                {isReplying && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Reply Header */}
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Reply className="w-4 h-4" />
                            <span className="font-medium">
                              Reply to {selectedMessage.from}
                            </span>
                          </div>
                          <button
                            onClick={toggleReply}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Reply Content */}
                      <div className="p-6 space-y-4">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write your reply..."
                          rows={8}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                        />

                        {/* Attachment Upload */}
                        <div>
                          <input
                            ref={replyFileInputRef}
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              setReplyAttachments((prev) => [
                                ...prev,
                                ...files,
                              ]);
                            }}
                            className="hidden"
                          />

                          {replyAttachments.length > 0 && (
                            <div className="space-y-2 mb-4">
                              <label className="text-sm font-medium text-gray-700">
                                Attachments:
                              </label>
                              {replyAttachments.map((file, index) => (
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
                                    onClick={() =>
                                      setReplyAttachments((prev) =>
                                        prev.filter((_, i) => i !== index),
                                      )
                                    }
                                    className="p-1 hover:bg-gray-200 rounded"
                                  >
                                    <X className="w-4 h-4 text-gray-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => replyFileInputRef.current?.click()}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Paperclip className="w-4 h-4" />
                              Attach Files
                            </button>

                            <div className="flex-1"></div>

                            <button
                              onClick={toggleReply}
                              className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={sendReply}
                              disabled={!replyContent.trim()}
                              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Send className="w-4 h-4" />
                              Send Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={toggleReply}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-colors ${
                      isReplying
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    <Reply className="w-4 h-4" />
                    {isReplying ? "Cancel Reply" : "Reply"}
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                    <Forward className="w-4 h-4" />
                    Forward
                  </button>
                  <button className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setAllLetters((prev) =>
                        prev.map((l) =>
                          l.id === selectedMessage.id
                            ? { ...l, isStarred: !l.isStarred }
                            : l,
                        ),
                      );
                      setSelectedMessage((prev) => ({
                        ...prev,
                        isStarred: !prev.isStarred,
                      }));
                    }}
                  >
                    <Star
                      className={`w-4 h-4 ${selectedMessage.isStarred ? "fill-current text-yellow-500" : ""}`}
                    />
                    {selectedMessage.isStarred ? "Unstar" : "Star"}
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
