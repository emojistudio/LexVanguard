import { useState, useEffect } from "react";
import { X, Send, Loader2, Mail, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { sendNewsletterBroadcast, getNewsletterSubscribers } from "@/lib/newsletter-store";

interface NewsletterAdminModalProps {
  onClose: () => void;
}

export function NewsletterAdminModal({ onClose }: NewsletterAdminModalProps) {
  const { firmUser } = useAuth();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [subscriberCount, setSubscriberCount] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNewsletterSubscribers().then((subs) => {
      setSubscriberCount(subs.length);
    });
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in the title and newsletter content.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const authorName = firmUser?.name || "LexVanguard Editorial Board";
      const result = await sendNewsletterBroadcast({
        title: title.trim(),
        subject: subject.trim() || title.trim(),
        content: content.trim(),
        authorName
      });

      setSuccess(result.message);
      setTitle("");
      setSubject("");
      setContent("");
    } catch (err: any) {
      setError(err?.message || "Failed to publish newsletter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#141414] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-black border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold uppercase tracking-wider text-white">LexVanguard Gazette Newsletter Dispatcher</h3>
              <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span>Active Subscribers: <strong className="text-amber-400">{subscriberCount}</strong></span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {success && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Publication Success!</strong>
                <p>{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 p-4 rounded-2xl text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">Dispatch Warning</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4 text-xs">
            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1">
                Newsletter Article Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Q3 Legal Reforms & Mooting Gazette"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1">
                Email Subject Line
              </label>
              <input
                type="text"
                placeholder="e.g. Official Gazette: Key Jurisprudential Updates from LexVanguard"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold uppercase tracking-wider mb-1">
                Body Article Content (Plain Text / HTML) *
              </label>
              <textarea
                rows={8}
                required
                placeholder="Write your newsletter dispatch body content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 font-normal leading-relaxed"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting via Resend...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post & Broadcast Newsletter</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
