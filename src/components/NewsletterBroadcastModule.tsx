import React, { useState, useEffect, useRef } from "react";
import { 
  Mail, Send, Users, CheckCircle2, AlertCircle, X, Eye, Sparkles, Loader2, 
  Trash2, ChevronUp, ChevronDown, Plus, Paperclip, Upload, Heading1, Heading2, 
  Type, Image as ImageIcon, FileText, Quote, Minus, MousePointerClick, AlertTriangle, 
  GripVertical, Copy, Link as LinkIcon, Sparkle
} from "lucide-react";
import { sendNewsletterBroadcast, getNewsletterSubscribers, type NewsletterSubscriber } from "../lib/newsletter-store";
import { useAuth } from "../lib/auth-context";
import logoImg from "../images/logo/logo.png";

interface NewsletterBroadcastModuleProps {
  onClose: () => void;
}

export type BlockType = 
  | "paragraph" 
  | "heading1" 
  | "heading2" 
  | "image" 
  | "file" 
  | "callout" 
  | "quote" 
  | "button" 
  | "divider";

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string; // Text content, or image URL, or file name
  caption?: string; // Subtitle, file size, or image caption
  url?: string; // Target URL for buttons or attachments
  fileData?: string; // Base64 data URL for images or files
}

const BLOCK_MENU_ITEMS: { type: BlockType; label: string; description: string; icon: React.ReactNode; shortcut: string }[] = [
  { type: "paragraph", label: "Text Paragraph", description: "Standard Gazette body text paragraph", icon: <Type className="w-4 h-4 text-blue-600" />, shortcut: "/p" },
  { type: "heading1", label: "Headline 1", description: "Large Gazette section title", icon: <Heading1 className="w-4 h-4 text-purple-600" />, shortcut: "/h1" },
  { type: "heading2", label: "Subheading 2", description: "Medium section subtitle", icon: <Heading2 className="w-4 h-4 text-indigo-600" />, shortcut: "/h2" },
  { type: "image", label: "Image & Media", description: "Upload or link an image photo asset", icon: <ImageIcon className="w-4 h-4 text-emerald-600" />, shortcut: "/img" },
  { type: "file", label: "Document Attachment", description: "Attach PDF brief or download link", icon: <FileText className="w-4 h-4 text-amber-600" />, shortcut: "/file" },
  { type: "callout", label: "Legal Brief Callout", description: "Highlighted legal notice alert box", icon: <AlertTriangle className="w-4 h-4 text-rose-600" />, shortcut: "/box" },
  { type: "quote", label: "Citation Quote", description: "Styled quotation for legal precedent", icon: <Quote className="w-4 h-4 text-teal-600" />, shortcut: "/quote" },
  { type: "button", label: "CTA Button", description: "Interactive call-to-action button link", icon: <MousePointerClick className="w-4 h-4 text-amber-500" />, shortcut: "/btn" },
  { type: "divider", label: "Horizontal Line", description: "Minimalist section separator line", icon: <Minus className="w-4 h-4 text-gray-500" />, shortcut: "/hr" }
];

export const NewsletterBroadcastModule: React.FC<NewsletterBroadcastModuleProps> = ({ onClose }) => {
  const { firmUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"compose" | "subscribers">("compose");

  // Newsletter Metadata
  const [title, setTitle] = useState("LexVanguard Gazette — Special Briefing");
  const [subject, setSubject] = useState("LexVanguard Gazette: Key Jurisprudential Updates & Briefings");
  const [ctaLabel, setCtaLabel] = useState("Access Full LexVanguard Portal");
  const [ctaUrl, setCtaUrl] = useState("https://lexvanguard.xyz");

  // Editor Blocks State
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    {
      id: "b1",
      type: "heading1",
      content: "Constitutional & Appellate Practice Briefing"
    },
    {
      id: "b2",
      type: "paragraph",
      content: "Welcome to this edition of the LexVanguard Legal Gazette. Our senior advocates present an executive review of recent legal developments, statutory amendments, and upcoming mooting championships."
    },
    {
      id: "b3",
      type: "callout",
      content: "Important Notice: All LexVanguard chambers offices will convene for the Q3 Statutory Review next Friday."
    },
    {
      id: "b4",
      type: "button",
      content: "Read Full Appellate Brief",
      url: "https://lexvanguard.xyz/research"
    }
  ]);

  // Slash Command Menu State
  const [showSlashMenu, setShowSlashMenu] = useState<string | null>(null); // Block ID where slash menu is active
  const [slashFilter, setSlashFilter] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Subscribers State
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    getNewsletterSubscribers().then((subs) => setSubscribers(subs));
  }, []);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Block Manipulation Functions
  const addBlock = (type: BlockType, targetIndex?: number) => {
    const newBlock: EditorBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      content: type === "button" ? "Explore Research Desk" : type === "divider" ? "" : type === "callout" ? "Legal Notice / Important Note" : "",
      url: type === "button" || type === "file" ? "https://lexvanguard.xyz" : undefined
    };

    if (targetIndex !== undefined) {
      const nextBlocks = [...blocks];
      nextBlocks.splice(targetIndex + 1, 0, newBlock);
      setBlocks(nextBlocks);
    } else {
      setBlocks((prev) => [...prev, newBlock]);
    }
    setShowSlashMenu(null);
    setSlashFilter("");
  };

  const updateBlock = (id: string, updates: Partial<EditorBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const nextBlocks = [...blocks];
    const [moved] = nextBlocks.splice(index, 1);
    nextBlocks.splice(targetIndex, 0, moved);
    setBlocks(nextBlocks);
  };

  const duplicateBlock = (index: number) => {
    const item = blocks[index];
    const copy: EditorBlock = {
      ...item,
      id: `block_${Date.now()}_copy`
    };
    const nextBlocks = [...blocks];
    nextBlocks.splice(index + 1, 0, copy);
    setBlocks(nextBlocks);
  };

  // Drag and Drop Handling
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const nextBlocks = [...blocks];
    const [draggedItem] = nextBlocks.splice(draggedIndex, 1);
    nextBlocks.splice(index, 0, draggedItem);
    setBlocks(nextBlocks);
    setDraggedIndex(index);
  };

  // Media / File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, blockId: string, isImage: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      updateBlock(blockId, {
        content: isImage ? dataUrl : file.name,
        fileData: dataUrl,
        caption: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
      });
    };
    reader.readAsDataURL(file);
  };

  // Compile Editor Blocks to HTML
  const compileBlocksToHtml = (): string => {
    return blocks.map((b) => {
      switch (b.type) {
        case "heading1":
          return `<h2 style="font-family: 'Times New Roman', Georgia, serif; font-size: 22px; font-weight: 700; color: #111827; margin: 24px 0 12px 0; border-bottom: 1px solid #f3f4f6; pb-2;">${b.content}</h2>`;
        case "heading2":
          return `<h3 style="font-family: 'Times New Roman', Georgia, serif; font-size: 18px; font-weight: 600; color: #1f2937; margin: 20px 0 8px 0;">${b.content}</h3>`;
        case "paragraph":
          return `<p style="font-size: 14px; line-height: 1.7; color: #374151; margin: 0 0 16px 0;">${b.content.replace(/\n/g, "<br/>")}</p>`;
        case "image":
          return `<div style="margin: 20px 0; text-align: center;">
            <img src="${b.fileData || b.content || 'https://lexvanguard.xyz/logo.png'}" alt="${b.caption || 'Gazette Image'}" style="max-width: 100%; height: auto; border-radius: 8px; display: block; margin: 0 auto; shadow: 0 4px 6px rgba(0,0,0,0.05);" />
            ${b.caption ? `<p style="font-size: 11px; color: #6b7280; margin-top: 6px; font-style: italic;">${b.caption}</p>` : ''}
          </div>`;
        case "file":
          return `<div style="margin: 18px 0; padding: 14px 18px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-weight: 700; color: #0f172a; font-size: 13px; display: block;">📄 ${b.content || 'Attached Legal Document'}</span>
              <span style="font-size: 11px; color: #64748b;">${b.caption || 'Document File'}</span>
            </div>
            ${b.url ? `<a href="${b.url}" target="_blank" style="background-color: #0f172a; color: #ffffff; font-size: 11px; font-weight: bold; text-decoration: none; padding: 6px 14px; border-radius: 6px;">Download Document</a>` : ''}
          </div>`;
        case "callout":
          return `<div style="margin: 20px 0; padding: 16px 20px; background-color: #fffbeb; border-left: 4px solid #d97706; border-radius: 6px; font-size: 13px; color: #92400e; line-height: 1.6;">
            <strong style="display: block; margin-bottom: 4px; font-size: 11px; uppercase; tracking: 1px;">⚖️ Chambers Briefing:</strong>
            ${b.content}
          </div>`;
        case "quote":
          return `<blockquote style="margin: 20px 0; padding-left: 18px; border-left: 3px solid #111827; font-style: italic; color: #4b5563; font-family: 'Times New Roman', Georgia, serif; font-size: 15px; line-height: 1.6;">
            "${b.content}"
          </blockquote>`;
        case "button":
          return `<div style="margin: 24px 0; text-align: center;">
            <a href="${b.url || 'https://lexvanguard.xyz'}" target="_blank" style="background-color: #111827; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; tracking: 1px;">${b.content || 'Click Here'}</a>
          </div>`;
        case "divider":
          return `<hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />`;
        default:
          return "";
      }
    }).join("\n");
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || blocks.length === 0) return;

    setLoading(true);
    try {
      const authorName = firmUser?.name || "LexVanguard Editorial Board";
      const compiledHtml = compileBlocksToHtml();

      const res = await sendNewsletterBroadcast({
        title: title.trim(),
        subject: subject.trim() || title.trim(),
        content: compiledHtml,
        authorName
      });

      showFeedback(res.message);
    } catch (err: any) {
      showFeedback(err?.message || "Failed to broadcast newsletter.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f7] text-[#1d1d1f] flex flex-col w-screen h-screen overflow-hidden font-sans">
      
      {/* Top Header Navigation */}
      <header className="w-full px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1d1d1f] text-amber-400 flex items-center justify-center font-bold shadow-xs">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 tracking-tight">LexVanguard Gazette Interactive Newsletter Studio</h1>
            <p className="text-xs text-gray-500">Notion-style block editor with "/" slash commands, rich media embeds & live letterhead compiler</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab("compose")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "compose" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Send className="w-4 h-4 text-amber-600" /> Block Gazette Studio
          </button>

          <button
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "subscribers" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4 text-gray-700" /> Subscribers Directory ({subscribers.length})
          </button>
        </div>

        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Feedback Notification */}
      {feedback && (
        <div className={`mx-6 mt-3 p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between shadow-xs ${
          feedback.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Main Content View */}
      <main className="flex-1 p-6 overflow-y-auto max-w-[1550px] mx-auto w-full">
        
        {/* TAB 1: COMPOSE & DISPATCH */}
        {activeTab === "compose" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Notion-style Block Editor (7 Columns) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Notion Block-Based Editor
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">Type <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded border border-gray-300 font-bold">/</span> for element menu</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Gazette Edition Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. LexVanguard Gazette — Issue #42"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Subscriber Inbox Subject Line</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Official Gazette: Key Jurisprudential Updates"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
              </div>

              {/* EDITOR BLOCK CANVAS */}
              <div className="space-y-4 min-h-[400px]">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b pb-2">
                  <span>Gazette Email Canvas ({blocks.length} Blocks)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-normal text-gray-400">Drag <GripVertical className="w-3 h-3 inline" /> to reorder</span>
                  </div>
                </div>

                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    className="group relative bg-gray-50 hover:bg-amber-50/30 border border-gray-200 hover:border-amber-300/80 rounded-2xl p-4 transition-all"
                  >
                    {/* Block Control Handle */}
                    <div className="absolute left-2 top-3 opacity-30 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-grab">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* Block Action Tools Toolbar */}
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-xs z-10">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === blocks.length - 1}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateBlock(index)}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500 cursor-pointer"
                        title="Duplicate Block"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBlock(block.id)}
                        className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer"
                        title="Delete Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* BLOCK CONTENT RENDERER */}
                    <div className="pl-6 pr-20 space-y-2">
                      
                      {/* TYPE 1: HEADING 1 */}
                      {block.type === "heading1" && (
                        <div>
                          <div className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Heading1 className="w-3 h-3" /> Headline 1
                          </div>
                          <input
                            type="text"
                            value={block.content}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.startsWith("/")) {
                                setShowSlashMenu(block.id);
                                setSlashFilter(val);
                              } else {
                                setShowSlashMenu(null);
                                updateBlock(block.id, { content: val });
                              }
                            }}
                            placeholder="Type Heading 1 or type '/' for menu..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-base font-serif font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                      )}

                      {/* TYPE 2: HEADING 2 */}
                      {block.type === "heading2" && (
                        <div>
                          <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Heading2 className="w-3 h-3" /> Subheading 2
                          </div>
                          <input
                            type="text"
                            value={block.content}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.startsWith("/")) {
                                setShowSlashMenu(block.id);
                                setSlashFilter(val);
                              } else {
                                setShowSlashMenu(null);
                                updateBlock(block.id, { content: val });
                              }
                            }}
                            placeholder="Type Subheading 2 or type '/' for menu..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-serif font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      {/* TYPE 3: PARAGRAPH */}
                      {block.type === "paragraph" && (
                        <div>
                          <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Type className="w-3 h-3" /> Body Paragraph
                          </div>
                          <textarea
                            rows={3}
                            value={block.content}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.startsWith("/")) {
                                setShowSlashMenu(block.id);
                                setSlashFilter(val);
                              } else {
                                setShowSlashMenu(null);
                                updateBlock(block.id, { content: val });
                              }
                            }}
                            placeholder="Write your gazette story text here or type '/' for menu..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y"
                          />
                        </div>
                      )}

                      {/* TYPE 4: IMAGE */}
                      {block.type === "image" && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Image & Media Asset
                          </div>
                          
                          {block.fileData || block.content ? (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white p-2 text-center">
                              <img
                                src={block.fileData || block.content}
                                alt="Uploaded"
                                className="max-h-48 mx-auto object-contain rounded-lg shadow-2xs"
                              />
                              <button
                                type="button"
                                onClick={() => updateBlock(block.id, { content: "", fileData: "", caption: "" })}
                                className="mt-2 text-[11px] font-bold text-rose-600 hover:underline"
                              >
                                Replace / Remove Image
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 hover:border-emerald-500 bg-white p-5 rounded-xl text-center transition-colors">
                              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                              <label className="text-xs font-bold text-emerald-700 cursor-pointer hover:underline block">
                                Choose image file to upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, block.id, true)}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[10px] text-gray-400 block mt-1">or enter image URL below</span>
                              <input
                                type="text"
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                placeholder="https://..."
                                className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800"
                              />
                            </div>
                          )}

                          <input
                            type="text"
                            value={block.caption || ""}
                            onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                            placeholder="Image caption / alt text (optional)"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 italic"
                          />
                        </div>
                      )}

                      {/* TYPE 5: FILE ATTACHMENT */}
                      {block.type === "file" && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Document File Attachment
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center gap-3">
                              <Paperclip className="w-5 h-5 text-amber-600" />
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={block.content}
                                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                  placeholder="Document Title (e.g. Supreme Court Ruling PDF)"
                                  className="w-full font-bold text-xs text-gray-900 border-b border-gray-200 focus:outline-none pb-0.5"
                                />
                                <input
                                  type="text"
                                  value={block.url || ""}
                                  onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                                  placeholder="Download link URL (e.g. https://lexvanguard.xyz/docs/ruling.pdf)"
                                  className="w-full text-xs text-blue-600 focus:outline-none pt-1"
                                />
                              </div>
                            </div>
                            
                            <label className="text-[10px] font-bold text-amber-700 hover:underline cursor-pointer inline-flex items-center gap-1">
                              <Upload className="w-3 h-3" /> Upload local document file
                              <input
                                type="file"
                                onChange={(e) => handleFileUpload(e, block.id, false)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {/* TYPE 6: CALLOUT BOX */}
                      {block.type === "callout" && (
                        <div>
                          <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Legal Brief Callout Box
                          </div>
                          <textarea
                            rows={2}
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="Highlighted legal notice / chambers alert..."
                            className="w-full bg-amber-50/70 border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-amber-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      )}

                      {/* TYPE 7: QUOTE */}
                      {block.type === "quote" && (
                        <div>
                          <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Quote className="w-3 h-3" /> Legal Precedent Quote
                          </div>
                          <textarea
                            rows={2}
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="Insert verbatim quotation or judicial extract..."
                            className="w-full bg-white border-l-4 border-gray-900 border-y border-r border-gray-200 rounded-r-xl px-3.5 py-2 text-xs italic text-gray-800 font-serif focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      )}

                      {/* TYPE 8: CTA BUTTON */}
                      {block.type === "button" && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3" /> Call-To-Action Button
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                              placeholder="Button Label (e.g. View Case Summary)"
                              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={block.url || ""}
                              onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                              placeholder="Button URL (https://...)"
                              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-blue-600 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* TYPE 9: DIVIDER */}
                      {block.type === "divider" && (
                        <div className="py-2 text-center">
                          <hr className="border-t border-gray-300 my-1" />
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Section Separator Line</span>
                        </div>
                      )}

                    </div>

                    {/* SLASH COMMAND POPOVER MENU */}
                    {showSlashMenu === block.id && (
                      <div className="absolute left-6 top-14 z-50 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 space-y-1 animate-in fade-in zoom-in-95">
                        <div className="px-3 py-1.5 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 flex justify-between">
                          <span>Insert Element</span>
                          <button onClick={() => setShowSlashMenu(null)} className="hover:text-gray-900"><X className="w-3 h-3" /></button>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-1">
                          {BLOCK_MENU_ITEMS
                            .filter(item => slashFilter === "/" || item.label.toLowerCase().includes(slashFilter.toLowerCase().replace("/", "")) || item.shortcut.includes(slashFilter.toLowerCase()))
                            .map((item) => (
                              <button
                                key={item.type}
                                type="button"
                                onClick={() => {
                                  updateBlock(block.id, { type: item.type, content: "" });
                                  setShowSlashMenu(null);
                                  setSlashFilter("");
                                }}
                                className="w-full text-left p-2 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3 cursor-pointer group/item"
                              >
                                <div className="p-1.5 rounded-lg bg-gray-50 group-hover/item:bg-white border border-gray-200">
                                  {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-gray-900 flex justify-between items-center">
                                    <span>{item.label}</span>
                                    <span className="text-[10px] font-mono text-gray-400">{item.shortcut}</span>
                                  </div>
                                  <p className="text-[10px] text-gray-500 truncate">{item.description}</p>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                  </div>
                ))}

                {/* ADD BLOCK BUTTON BAR */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => addBlock("paragraph")}
                      className="px-3 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-4 h-4 text-amber-500" /> Add Text Paragraph
                    </button>
                  </div>

                  {BLOCK_MENU_ITEMS.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => addBlock(item.type)}
                      className="px-2.5 py-1.5 bg-white border border-gray-200 hover:border-gray-900 rounded-xl text-[11px] font-medium text-gray-700 hover:text-gray-900 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

              </div>

              {/* DISPATCH ACTION BUTTON */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleBroadcast}
                  disabled={loading}
                  className="w-full bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs uppercase tracking-widest py-4 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Broadcasting to {subscribers.length} Subscribers...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-300" />
                      <span>Publish & Broadcast Gazette ({subscribers.length} Subscribers)</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Column: Live Email Letterhead Preview (5 Columns) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" /> Live Subscriber Inbox Preview
                </h3>
                <span className="text-[10px] font-mono text-gray-400">Resend Primary HTML Engine</span>
              </div>

              {/* Email Letterhead Canvas Box */}
              <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-5 text-[#111827] font-sans max-h-[700px] overflow-y-auto">
                
                {/* Branding Header */}
                <div className="text-center border-b border-gray-200 pb-4">
                  <img src={logoImg} alt="LexVanguard Advocates LLP" className="h-14 mx-auto object-contain mb-2" />
                  <h2 className="text-base font-serif font-bold text-gray-900 tracking-wider">LEXVANGUARD ADVOCATES LLP</h2>
                  <p className="text-[9px] font-mono text-amber-600 uppercase tracking-widest font-semibold mt-0.5">
                    Official Gazette Edition • Primary Dispatch
                  </p>
                </div>

                {/* Body Content Title */}
                <h1 className="text-lg font-serif font-extrabold text-gray-900 leading-snug border-b pb-2">
                  {title || "Gazette Title"}
                </h1>

                {/* Compiled HTML Preview */}
                <div 
                  className="prose prose-sm max-w-none text-xs text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: compileBlocksToHtml() }}
                />

                {/* Footer Brand Seal */}
                <div className="pt-6 text-center border-t border-gray-100 text-[10px] text-gray-400 space-y-1">
                  <p className="font-semibold text-gray-600">LexVanguard Advocates LLP • Legal Counsel & Mooting Directorate</p>
                  <p>Mount Kenya University Parklands Law Campus (MKUPLC), Nairobi, Kenya</p>
                </div>

              </div>

              <div className="text-center text-[10px] text-gray-400 italic">
                Renders natively across Gmail, Apple Mail, Outlook, and mobile client inboxes.
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SUBSCRIBERS DIRECTORY */}
        {activeTab === "subscribers" && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div>
                <h2 className="text-base font-bold text-gray-900">Active Newsletter Subscribers ({subscribers.length})</h2>
                <p className="text-xs text-gray-500">Every subscriber receives instant, primary-inbox gazette editions upon dispatch.</p>
              </div>

              <div className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                Resend Domain Verified
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 font-bold uppercase tracking-wider">
                    <th className="p-4">Subscriber Email</th>
                    <th className="p-4">Subscription Date</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscribers.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4 font-mono font-semibold text-gray-900">{sub.email}</td>
                      <td className="p-4 text-gray-500 font-mono">
                        {typeof sub.subscribedAt === "string" 
                          ? sub.subscribedAt 
                          : sub.subscribedAt 
                          ? new Date((sub.subscribedAt as any)?.seconds ? (sub.subscribedAt as any).seconds * 1000 : Date.now()).toLocaleDateString() 
                          : "Active"}
                      </td>
                      <td className="p-4 text-right">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Subscribed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
