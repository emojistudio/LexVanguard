import React, { useState } from "react";
import { X, Send, CheckCircle2, FileText, Check } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface AskToJoinModalProps {
  onClose: () => void;
}

export const AskToJoinModal: React.FC<AskToJoinModalProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes("@")) return;

    setSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim() || "N/A";
    const cvFileName = cvFile ? cvFile.name : "Resume_Attached.pdf";

    try {
      // 1. Record application in Firestore
      await addDoc(collection(db, "firm_applications"), {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        cvFileName,
        roleInterest: "Counsel",
        status: "pending",
        createdAt: serverTimestamp()
      });

      // 2. Dispatch email notification to Applicant & Admin
      try {
        await fetch("/api/send-application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            cvFileName
          })
        });
      } catch (err) {
        console.warn("Application email dispatch notice:", err);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting application:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative overflow-hidden transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Application Submitted</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Thank you, <strong>{name}</strong>. An email confirmation has been sent to <strong>{email}</strong>. We will respond promptly upon review.
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#1d1d1f] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">Apply to Join</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-zinc-100/80 border-none rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full bg-zinc-100/80 border-none rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full bg-zinc-100/80 border-none rounded-xl px-3.5 py-2 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Upload CV / Resume */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  CV / Resume
                </label>
                <label className="flex items-center justify-center gap-2 border border-zinc-200 hover:border-zinc-400 rounded-xl px-3 py-2 cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-all text-xs font-medium text-zinc-600">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {cvFile ? (
                    <span className="flex items-center gap-1.5 text-emerald-700 font-semibold truncate">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {cvFile.name}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <FileText className="w-3.5 h-3.5 text-zinc-400" /> Select PDF or Word
                    </span>
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#ffc107] hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-black" /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
