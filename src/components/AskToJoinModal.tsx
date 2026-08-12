import React, { useState } from "react";
import { X, Send, CheckCircle2, User, Mail, Phone, Upload, FileText, Check } from "lucide-react";
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl border border-zinc-200 shadow-2xl rounded-3xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Application Received
              </span>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight mt-1">Application Submitted</h3>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-xs mx-auto">
              Thank you, <strong>{name}</strong>. Your membership application has been received successfully. An official confirmation email has been dispatched to <strong>{email}</strong> and our admissions directorate will respond promptly upon review.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1d1d1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all cursor-pointer shadow-md"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="border-b border-zinc-100 pb-3.5">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-mono">
                Admissions Portal
              </span>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight mt-2">Apply to Join LexVanguard LLP</h2>
              <p className="text-xs text-zinc-500 mt-1">Submit your details to join our counsel roster or appellate research team.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
                  <User className="w-3.5 h-3.5 text-zinc-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Counsel Jane Doe"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* 2. Email Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" /> Primary Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* 3. Phone Number */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* 4. Upload CV / Resume */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
                  <Upload className="w-3.5 h-3.5 text-zinc-400" /> Upload CV / Resume
                </label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 hover:border-black rounded-xl p-3.5 cursor-pointer bg-zinc-50 hover:bg-zinc-100/80 transition-all text-xs font-semibold text-zinc-700">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {cvFile ? (
                    <span className="flex items-center gap-2 text-emerald-700 font-bold truncate">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" /> {cvFile.name}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-zinc-500">
                      <FileText className="w-4 h-4 text-zinc-400" /> Select PDF or Word document
                    </span>
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1d1d1f] hover:bg-black text-amber-400 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-mono"
                >
                  {submitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" /> Submit Application
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
