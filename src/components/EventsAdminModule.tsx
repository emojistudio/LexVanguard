import React, { useState, useEffect } from "react";
import { 
  Calendar, Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle, 
  X, MapPin, Clock, Tag, Link as LinkIcon, RefreshCw, Upload, Sparkles 
} from "lucide-react";
import { 
  collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { type FirmEvent } from "../lib/events-store";

interface EventsAdminModuleProps {
  onClose: () => void;
}

export const EventsAdminModule: React.FC<EventsAdminModuleProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [events, setEvents] = useState<FirmEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Moot Court");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [registrationUrl, setRegistrationUrl] = useState("");

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
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        title: title.trim(),
        date: date.trim(),
        time: time.trim() || "10:00 AM EAT",
        location: location.trim() || "Mount Kenya University Parklands Law Campus",
        category,
        description: description.trim(),
        image: image.trim() || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80",
        registrationUrl: registrationUrl.trim() || "#",
        gallery: [],
        createdAt: serverTimestamp()
      });

      showFeedback(`Event "${title}" created successfully and published firm-wide!`);
      setTitle("");
      setDate("");
      setTime("");
      setLocation("");
      setDescription("");
      setImage("");
      setRegistrationUrl("");
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
      
      {/* Top Header */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-amber-400 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Firm Events & Announcements Directorate</h1>
            <p className="text-xs text-gray-500">Publish moot court competitions, legal symposia, workshops, and manage photo galleries</p>
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
            <Plus className="w-4 h-4 text-amber-600" /> Create Announcement / Event
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
        <div className={`mx-6 mt-4 p-4 rounded-xl border text-xs font-bold flex items-center justify-between ${
          feedback.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto max-w-[1200px] mx-auto w-full">
        
        {/* TAB 1: CREATE NEW EVENT */}
        {activeTab === "create" && (
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Institutional Event Dispatch
              </span>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mt-2">Publish New Event or Symposium</h2>
              <p className="text-xs text-gray-500 mt-1">Events published here automatically appear on the firm homepage, events calendar, and subscriber portal.</p>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 2026 Annual MKUPLC Appellate Moot Court Competition"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> Event Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. October 15, 2026"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" /> Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 09:00 AM - 04:00 PM EAT"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Location / Venue
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. MKUPLC Auditorium, Nairobi"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400" /> Event Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Moot Court">Moot Court Competition</option>
                    <option value="Symposium">Appellate Legal Symposium</option>
                    <option value="Lecture">Guest Public Lecture</option>
                    <option value="Workshop">Legal Research Workshop</option>
                    <option value="Assembly">LexVanguard General Assembly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Overview & Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full agenda, speaker list, mooting problem summary, or registration instructions..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-400" /> Banner / Poster Image URL
                  </label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... (or leave blank for legal theme)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-gray-400" /> Registration / RSVP Link
                  </label>
                  <input
                    type="url"
                    value={registrationUrl}
                    onChange={(e) => setRegistrationUrl(e.target.value)}
                    placeholder="https://forms.google.com/..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? "Publishing Event..." : <><Sparkles className="w-4 h-4 text-amber-300" /> Publish Event Firm-Wide</>}
                </button>
              </div>
            </form>
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

                      <p className="text-xs text-gray-600 line-clamp-2">{ev.description}</p>
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
