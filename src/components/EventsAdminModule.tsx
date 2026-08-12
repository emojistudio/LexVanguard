import React, { useState, useEffect } from "react";
import { 
  Calendar, Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle, 
  X, MapPin, Clock, Tag, Link as LinkIcon, RefreshCw, Upload, Sparkles,
  Heading1, Heading2, Type, FileText, Quote, Minus, MousePointerClick, AlertTriangle, 
  GripVertical, Copy, Eye, Paperclip, ChevronUp, ChevronDown, User, Share2
} from "lucide-react";
import { 
  collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { type FirmEvent } from "../lib/events-store";

interface EventsAdminModuleProps {
  onClose: () => void;
}

export type EventBlockType = 
  | "paragraph" 
  | "heading1" 
  | "heading2" 
  | "image" 
  | "file" 
  | "callout" 
  | "quote" 
  | "button" 
  | "divider";

export interface EventEditorBlock {
  id: string;
  type: EventBlockType;
  content: string;
  caption?: string;
  url?: string;
  fileData?: string;
}

const BLOCK_MENU_ITEMS: { type: EventBlockType; label: string; description: string; icon: React.ReactNode; shortcut: string }[] = [
  { type: "paragraph", label: "Agenda & Details Text", description: "Body narrative for event overview", icon: <Type className="w-4 h-4 text-blue-600" />, shortcut: "/p" },
  { type: "heading1", label: "Section Headline", description: "Large agenda or session title", icon: <Heading1 className="w-4 h-4 text-purple-600" />, shortcut: "/h1" },
  { type: "heading2", label: "Sub-session Title", description: "Medium session subheading", icon: <Heading2 className="w-4 h-4 text-indigo-600" />, shortcut: "/h2" },
  { type: "image", label: "Event Poster / Photo", description: "Upload or link speaker photo or poster", icon: <ImageIcon className="w-4 h-4 text-emerald-600" />, shortcut: "/img" },
  { type: "file", label: "Program PDF Attachment", description: "Attach moot problem, schedule, or PDF", icon: <FileText className="w-4 h-4 text-amber-600" />, shortcut: "/file" },
  { type: "callout", label: "Important Venue Notice", description: "Highlighted dress code or arrival note", icon: <AlertTriangle className="w-4 h-4 text-rose-600" />, shortcut: "/box" },
  { type: "quote", label: "Keynote / Speaker Quote", description: "Quotation from keynote guest speaker", icon: <Quote className="w-4 h-4 text-teal-600" />, shortcut: "/quote" },
  { type: "button", label: "RSVP & Register Button", description: "Custom registration or Google Form button", icon: <MousePointerClick className="w-4 h-4 text-amber-500" />, shortcut: "/btn" },
  { type: "divider", label: "Horizontal Line", description: "Section divider break", icon: <Minus className="w-4 h-4 text-gray-500" />, shortcut: "/hr" }
];

export const EventsAdminModule: React.FC<EventsAdminModuleProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [events, setEvents] = useState<FirmEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Event Metadata
  const [title, setTitle] = useState("2026 MKUPLC Supreme Court Moot Championship");
  const [date, setDate] = useState("October 15, 2026");
  const [time, setTime] = useState("09:00 AM - 04:30 PM EAT");
  const [location, setLocation] = useState("MKUPLC Main Auditorium, Nairobi");
  const [category, setCategory] = useState("Moot Court");
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80");
  const [registrationUrl, setRegistrationUrl] = useState("https://forms.google.com");

  // Editor Blocks State
  const [blocks, setBlocks] = useState<EventEditorBlock[]>([
    {
      id: "eb1",
      type: "heading1",
      content: "Championship Overview & Moot Problem"
    },
    {
      id: "eb2",
      type: "paragraph",
      content: "LexVanguard Advocates LLP invites all advocate trainees, student law firms, and mooters to the flagship 2026 Moot Court Championship. Teams will submit briefs on Constitutional Law & Digital Privacy."
    },
    {
      id: "eb3",
      type: "callout",
      content: "Arrival & Registration: All bench counsel must report by 08:30 AM in formal court robes/attire."
    },
    {
      id: "eb4",
      type: "button",
      content: "Submit Moot Court Registration Form",
      url: "https://forms.google.com"
    }
  ]);

  // Slash Menu State
  const [showSlashMenu, setShowSlashMenu] = useState<string | null>(null);
  const [slashFilter, setSlashFilter] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Gallery Upload State
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [galleryImageUrl, setGalleryImageUrl] = useState("");

  // Subscribe to Events Collection
  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: FirmEvent[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as FirmEvent);
      });
      setEvents(list);
    }, (err) => {
      console.warn("Events listener notice:", err);
    });
    return () => unsub();
  }, []);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  // Block Manipulation Functions
  const addBlock = (type: EventBlockType, targetIndex?: number) => {
    const newBlock: EventEditorBlock = {
      id: `eblock_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      content: type === "button" ? "Register / RSVP Now" : type === "divider" ? "" : type === "callout" ? "Notice for Attendees" : "",
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

  const updateBlock = (id: string, updates: Partial<EventEditorBlock>) => {
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
    const copy: EventEditorBlock = {
      ...item,
      id: `eblock_${Date.now()}_copy`
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

  // File / Image Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, blockId: string, isImage: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (blockId === "hero") {
        setHeroImage(dataUrl);
      } else {
        updateBlock(blockId, {
          content: isImage ? dataUrl : file.name,
          fileData: dataUrl,
          caption: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Compile Blocks to HTML String for Event Description
  const compileBlocksToHtml = (): string => {
    return blocks.map((b) => {
      switch (b.type) {
        case "heading1":
          return `<h2 style="font-family: Georgia, serif; font-size: 20px; font-weight: 700; color: #111827; margin: 20px 0 10px 0;">${b.content}</h2>`;
        case "heading2":
          return `<h3 style="font-family: Georgia, serif; font-size: 16px; font-weight: 600; color: #1f2937; margin: 16px 0 8px 0;">${b.content}</h3>`;
        case "paragraph":
          return `<p style="font-size: 14px; line-height: 1.7; color: #374151; margin: 0 0 14px 0;">${b.content.replace(/\n/g, "<br/>")}</p>`;
        case "image":
          return `<div style="margin: 18px 0; text-align: center;">
            <img src="${b.fileData || b.content || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80'}" alt="${b.caption || 'Event Media'}" style="max-width: 100%; height: auto; border-radius: 12px; display: block; margin: 0 auto;" />
            ${b.caption ? `<p style="font-size: 11px; color: #6b7280; margin-top: 6px; font-style: italic;">${b.caption}</p>` : ''}
          </div>`;
        case "file":
          return `<div style="margin: 16px 0; padding: 14px 18px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <span style="font-weight: 700; color: #0f172a; font-size: 13px; display: block;">📄 ${b.content || 'Attached Program PDF'}</span>
              <span style="font-size: 11px; color: #64748b;">${b.caption || 'Event Document'}</span>
            </div>
            ${b.url ? `<a href="${b.url}" target="_blank" style="background-color: #0f172a; color: #ffffff; font-size: 11px; font-weight: bold; text-decoration: none; padding: 6px 14px; border-radius: 6px;">Download PDF</a>` : ''}
          </div>`;
        case "callout":
          return `<div style="margin: 18px 0; padding: 14px 18px; background-color: #fffbeb; border-left: 4px solid #d97706; border-radius: 8px; font-size: 13px; color: #92400e; line-height: 1.6;">
            <strong style="display: block; margin-bottom: 4px;">⚖️ Venue Briefing:</strong>
            ${b.content}
          </div>`;
        case "quote":
          return `<blockquote style="margin: 18px 0; padding-left: 16px; border-left: 3px solid #111827; font-style: italic; color: #4b5563; font-family: Georgia, serif; font-size: 14px; line-height: 1.6;">
            "${b.content}"
          </blockquote>`;
        case "button":
          return `<div style="margin: 20px 0; text-align: center;">
            <a href="${b.url || 'https://lexvanguard.xyz'}" target="_blank" style="background-color: #111827; color: #ffffff; padding: 12px 24px; font-size: 13px; font-weight: 700; text-decoration: none; border-radius: 10px; display: inline-block;">${b.content || 'Register Now'}</a>
          </div>`;
        case "divider":
          return `<hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />`;
        default:
          return "";
      }
    }).join("\n");
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    setLoading(true);
    try {
      const compiledHtml = compileBlocksToHtml();

      await addDoc(collection(db, "events"), {
        title: title.trim(),
        date: date.trim(),
        time: time.trim() || "09:00 AM EAT",
        location: location.trim() || "Mount Kenya University Parklands Law Campus",
        category,
        description: compiledHtml,
        image: heroImage.trim() || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80",
        registrationUrl: registrationUrl.trim() || "#",
        gallery: [],
        createdAt: serverTimestamp()
      });

      showFeedback(`Event "${title}" created successfully and published firm-wide!`);
      setActiveTab("manage");
    } catch (err) {
      showFeedback("Failed to publish event to Firestore.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete event "${eventTitle}"?`)) return;

    try {
      await deleteDoc(doc(db, "events", id));
      showFeedback(`Deleted event "${eventTitle}".`);
    } catch (e) {
      showFeedback("Failed to delete event.", "error");
    }
  };

  const handleAddGalleryImage = async (eventId: string) => {
    if (!galleryImageUrl.trim()) return;

    try {
      const ev = events.find(e => e.id === eventId);
      const existingGallery = ev?.gallery || [];
      const updatedGallery = [...existingGallery, galleryImageUrl.trim()];

      await updateDoc(doc(db, "events", eventId), {
        gallery: updatedGallery
      });

      showFeedback("Added photo to event gallery!");
      setGalleryImageUrl("");
    } catch (err) {
      showFeedback("Failed to update gallery.", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f7] text-[#1d1d1f] flex flex-col w-screen h-screen overflow-hidden font-sans">
      
      {/* Top Header Navigation */}
      <header className="w-full px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center font-bold shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 tracking-tight">LexVanguard Institutional Event & Symposium Studio</h1>
            <p className="text-xs text-gray-500">Notion-style block agenda builder with "/" slash commands, live poster compiler & gallery management</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "create" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Plus className="w-4 h-4 text-amber-600" /> Event Studio Builder
          </button>

          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "manage" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar className="w-4 h-4 text-gray-700" /> Published Events ({events.length})
          </button>
        </div>

        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Feedback Toast */}
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
        
        {/* TAB 1: EVENT STUDIO BUILDER */}
        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Notion-Style Block Agenda Builder (7 Columns) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Notion Event Agenda Builder
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">Type <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded border border-gray-300 font-bold">/</span> for menu</span>
                </div>

                {/* Event Metadata Input Form */}
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Event / Symposium Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 2026 Annual MKUPLC Moot Championship"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black font-serif"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> Event Date *
                      </label>
                      <input
                        type="text"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="e.g. October 15, 2026"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> Time Schedule
                      </label>
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="e.g. 09:00 AM - 04:30 PM EAT"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> Venue Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. MKUPLC Main Auditorium, Nairobi"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400" /> Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="Moot Court">Moot Court Competition</option>
                        <option value="Symposium">Appellate Legal Symposium</option>
                        <option value="Lecture">Guest Public Lecture</option>
                        <option value="Workshop">Legal Research Workshop</option>
                        <option value="Assembly">LexVanguard General Assembly</option>
                      </select>
                    </div>
                  </div>

                  {/* Poster Image / Banner Picker */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-gray-400" /> Hero Poster Image URL
                      </label>
                      <input
                        type="text"
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <LinkIcon className="w-3.5 h-3.5 text-gray-400" /> Registration / RSVP URL
                      </label>
                      <input
                        type="text"
                        value={registrationUrl}
                        onChange={(e) => setRegistrationUrl(e.target.value)}
                        placeholder="https://forms.google.com/..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* EDITOR BLOCK CANVAS */}
              <div className="space-y-4 min-h-[400px]">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b pb-2">
                  <span>Event Program Agenda ({blocks.length} Blocks)</span>
                  <span className="text-[10px] font-normal text-gray-400">Drag <GripVertical className="w-3 h-3 inline" /> to reorder</span>
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
                            <Heading1 className="w-3 h-3" /> Section Headline
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
                            <Type className="w-3 h-3" /> Agenda & Details Text
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
                            placeholder="Write event overview or schedule description or type '/' for menu..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y"
                          />
                        </div>
                      )}

                      {/* TYPE 4: IMAGE */}
                      {block.type === "image" && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                            <ImageIcon className="w-3 h-3" /> Speaker Photo / Poster Asset
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
                                Choose photo file to upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e, block.id, true)}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[10px] text-gray-400 block mt-1">or enter photo URL below</span>
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
                            placeholder="Image caption / speaker title (optional)"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 italic"
                          />
                        </div>
                      )}

                      {/* TYPE 5: FILE ATTACHMENT */}
                      {block.type === "file" && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Program PDF Attachment
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2">
                            <div className="flex items-center gap-3">
                              <Paperclip className="w-5 h-5 text-amber-600" />
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={block.content}
                                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                  placeholder="Document Title (e.g. 2026 Moot Problem PDF)"
                                  className="w-full font-bold text-xs text-gray-900 border-b border-gray-200 focus:outline-none pb-0.5"
                                />
                                <input
                                  type="text"
                                  value={block.url || ""}
                                  onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                                  placeholder="Download link URL (e.g. https://lexvanguard.xyz/docs/moot_problem.pdf)"
                                  className="w-full text-xs text-blue-600 focus:outline-none pt-1"
                                />
                              </div>
                            </div>
                            
                            <label className="text-[10px] font-bold text-amber-700 hover:underline cursor-pointer inline-flex items-center gap-1">
                              <Upload className="w-3 h-3" /> Upload local program file
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
                            <AlertTriangle className="w-3 h-3" /> Important Venue Notice
                          </div>
                          <textarea
                            rows={2}
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="Highlighted dress code, arrival time, or security note..."
                            className="w-full bg-amber-50/70 border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-amber-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      )}

                      {/* TYPE 7: QUOTE */}
                      {block.type === "quote" && (
                        <div>
                          <div className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Quote className="w-3 h-3" /> Keynote / Guest Quote
                          </div>
                          <textarea
                            rows={2}
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="Verbatim quote from guest speaker or patron..."
                            className="w-full bg-white border-l-4 border-gray-900 border-y border-r border-gray-200 rounded-r-xl px-3.5 py-2 text-xs italic text-gray-800 font-serif focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      )}

                      {/* TYPE 8: CTA BUTTON */}
                      {block.type === "button" && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3" /> RSVP / Registration Button
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                              placeholder="Button Label (e.g. Submit Registration)"
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
                  <button
                    type="button"
                    onClick={() => addBlock("paragraph")}
                    className="px-3 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-4 h-4 text-amber-500" /> Add Agenda Text
                  </button>

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

              {/* ACTION BUTTON */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleCreateEvent}
                  disabled={loading}
                  className="w-full bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs uppercase tracking-widest py-4 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Publishing Event..." : <><Sparkles className="w-4 h-4 text-amber-300" /> Publish Event Firm-Wide</>}
                </button>
              </div>

            </div>

            {/* Right Column: Live Event Listing & Poster Preview (5 Columns) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" /> Live Event Listing Preview
                </h3>
                <span className="text-[10px] font-mono text-gray-400">Institutional Event Card</span>
              </div>

              {/* Live Preview Card */}
              <div className="bg-[#ffffff] border border-gray-200 rounded-2xl overflow-hidden shadow-sm space-y-4 text-[#111827] max-h-[700px] overflow-y-auto">
                
                {/* Poster Banner Image */}
                <div className="h-44 w-full bg-gray-100 relative overflow-hidden">
                  <img
                    src={heroImage || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80"}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="bg-yellow-500 text-black text-[9px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full w-fit mb-1">
                      {category}
                    </span>
                    <h2 className="text-base font-serif font-bold leading-tight">{title || "Event Title"}</h2>
                  </div>
                </div>

                <div className="p-5 space-y-4 text-xs">
                  {/* Event Details Pills */}
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px] font-medium text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{time}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 border-t border-gray-200 pt-2 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                  </div>

                  {/* Compiled Agenda HTML Preview */}
                  <div 
                    className="prose prose-sm max-w-none text-xs text-gray-800 leading-relaxed border-t border-gray-100 pt-3"
                    dangerouslySetInnerHTML={{ __html: compileBlocksToHtml() }}
                  />

                  {/* Registration CTA Button */}
                  {registrationUrl && (
                    <div className="pt-2 text-center">
                      <a
                        href={registrationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block w-full bg-slate-900 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider text-center shadow-xs"
                      >
                        Register / RSVP for Event
                      </a>
                    </div>
                  )}
                </div>

              </div>

              <div className="text-center text-[10px] text-gray-400 italic">
                Published events sync automatically to the firm homepage and public events directory.
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MANAGE PUBLISHED EVENTS */}
        {activeTab === "manage" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900">Published Firm Events ({events.length})</h2>
              <span className="text-xs font-semibold text-gray-500">Manage event details, photo galleries, or archive completed sessions.</span>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-2">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-base font-bold text-gray-800">No Published Events</h3>
                <p className="text-xs text-gray-500">Create an event above to populate the institutional calendar.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((ev) => (
                  <div key={ev.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="h-40 w-full rounded-xl overflow-hidden bg-gray-100 relative">
                        <img src={ev.image || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md">
                          {ev.category || "Moot Court"}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">{ev.title}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-1 font-medium">
                          <span>📅 {ev.date}</span> • <span>📍 {ev.location}</span>
                        </p>
                      </div>

                      <div 
                        className="text-xs text-gray-600 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: ev.description }}
                      />
                    </div>

                    {/* Gallery photos */}
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-gray-400" /> Photo Album ({ev.gallery?.length || 0} photos)
                        </span>
                        <button
                          onClick={() => setSelectedEventId(selectedEventId === ev.id ? null : ev.id)}
                          className="text-[11px] font-bold text-amber-600 hover:underline cursor-pointer"
                        >
                          {selectedEventId === ev.id ? "Hide Uploader" : "+ Add Photo"}
                        </button>
                      </div>

                      {selectedEventId === ev.id && (
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200">
                          <input
                            type="url"
                            value={galleryImageUrl}
                            onChange={(e) => setGalleryImageUrl(e.target.value)}
                            placeholder="Image URL (https://...)"
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddGalleryImage(ev.id)}
                            className="px-3 py-1 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
};
