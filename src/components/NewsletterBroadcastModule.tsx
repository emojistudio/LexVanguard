import React, { useState, useEffect } from "react";
import { 
  Mail, Send, Users, CheckCircle2, AlertCircle, X, Eye, Sparkles, Loader2, UserPlus, Trash2 
} from "lucide-react";
import { sendNewsletterBroadcast, getNewsletterSubscribers, type NewsletterSubscriber } from "../lib/newsletter-store";
import { useAuth } from "../lib/auth-context";
import logoImg from "../images/logo/logo.png";

interface NewsletterBroadcastModuleProps {
  onClose: () => void;
}

export const NewsletterBroadcastModule: React.FC<NewsletterBroadcastModuleProps> = ({ onClose }) => {
  const { firmUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"compose" | "subscribers">("compose");

  // Compose State
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Read Full Edition on Portal");
  const [ctaUrl, setCtaUrl] = useState("https://lexvanguard.xyz");

  // Subscribers State
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [newSubEmail, setNewSubEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    getNewsletterSubscribers().then((subs) => setSubscribers(subs));
  }, []);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const authorName = firmUser?.name || "LexVanguard Editorial Board";
      const res = await sendNewsletterBroadcast({
        title: title.trim(),
        subject: subject.trim() || title.trim(),
        content: content.trim(),
        authorName
      });

      showFeedback(res.message);
      setTitle("");
      setSubject("");
      setContent("");
    } catch (err: any) {
      showFeedback(err?.message || "Failed to broadcast newsletter.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f5f5f7] text-[#1d1d1f] flex flex-col w-screen h-screen overflow-hidden font-sans">
      
      {/* Top Header Navigation */}
      <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1d1d1f] text-amber-400 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">LexVanguard Gazette Newsletter & Broadcast Directorate</h1>
            <p className="text-xs text-gray-500">Minimalist transactional email publishing suite connected directly to primary subscriber inboxes</p>
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
            <Send className="w-4 h-4 text-amber-600" /> Compose & Dispatch Gazette
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

      {/* Main Content View */}
      <main className="flex-1 p-6 overflow-y-auto max-w-[1400px] mx-auto w-full">
        
        {/* TAB 1: COMPOSE & DISPATCH */}
        {activeTab === "compose" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Form Controls */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
              <div className="border-b border-gray-100 pb-3">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Resend Primary Inbox Pipeline
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2 font-serif">Compose Gazette Dispatch</h2>
                <p className="text-xs text-gray-500 mt-0.5">Delivered using LexVanguard's minimalist email letterhead engine.</p>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Gazette Edition Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q3 Legal Reforms & Mooting Gazette"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Subject Line</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Official Gazette: Key Jurisprudential Updates from LexVanguard"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Dispatch Body Content *</label>
                  <textarea
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write the full lead story, analysis, or announcements for this gazette edition..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-black leading-relaxed resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Broadcasting to {subscribers.length} Subscribers...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>Broadcast Gazette Edition ({subscribers.length} Subscribers)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Live Email Letterhead Preview */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" /> Live Letterhead Preview
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400">Minimalist PNG Email Engine</span>
                </div>

                {/* Email Canvas Box */}
                <div className="bg-[#ffffff] border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6 text-[#111827] font-sans">
                  {/* Branding Header */}
                  <div className="text-center border-b border-gray-200 pb-4">
                    <img src={logoImg} alt="LexVanguard" className="h-16 mx-auto object-contain mb-2" />
                    <h2 className="text-lg font-serif font-bold text-gray-900 tracking-tight">LEXVANGUARD ADVOCATES LLP</h2>
                    <p className="text-[10px] font-mono text-amber-600 uppercase tracking-widest font-semibold mt-0.5">Official Firm Gazette • Issue Dispatch</p>
                  </div>

                  {/* Body Content Preview */}
                  <div className="space-y-3">
                    <h1 className="text-xl font-serif font-bold text-gray-900 leading-tight">
                      {title.trim() || "Gazette Edition Title"}
                    </h1>
                    <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {content.trim() || "Your newsletter story body and legal updates will render cleanly here in primary subscriber inboxes."}
                    </p>
                  </div>

                  {/* Centered CTA Button */}
                  <div className="pt-4 text-center border-t border-gray-100">
                    <a href={ctaUrl} target="_blank" rel="noreferrer" className="inline-block bg-[#111827] text-white text-xs font-bold px-6 py-2.5 rounded-lg uppercase tracking-wider shadow-xs">
                      {ctaLabel}
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center text-[11px] text-gray-400 italic pt-4">
                Anti-Spam deliverability headers (List-Unsubscribe, X-Entity-Ref-ID) are automatically enforced.
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
