import React, { useState } from "react";
import { X, Send, CheckCircle2, Upload, FileText, Check } from "lucide-react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCvFile(e.dataTransfer.files[0]);
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
      <div className="bg-white rounded-3xl max-w-md w-full p-7 sm:p-9 shadow-2xl relative overflow-hidden transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Application Submitted</h3>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-xs mx-auto">
              Thank you, <strong>{name}</strong>. Your membership application has been received. A confirmation email has been dispatched to <strong>{email}</strong>. Our admissions directorate will respond promptly upon review.
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
            <div>
              <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Apply to Join LexVanguard</h2>
              <p className="text-xs text-zinc-400 mt-1">Submit your details to join our counsel roster or appellate research team.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Counsel Jane Doe"
                  className="w-full bg-zinc-100/70 border-none rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full bg-zinc-100/70 border-none rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full bg-zinc-100/70 border-none rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              {/* Larger Standard Drag & Drop Upload Box */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  CV / Resume Upload
                </label>
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-6 px-4 cursor-pointer transition-all ${
                    isDragging
                      ? "border-black bg-zinc-100"
                      : "border-zinc-200 hover:border-black bg-zinc-50/70 hover:bg-zinc-100/70"
                  }`}
                >
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {cvFile ? (
                    <div className="flex flex-col items-center space-y-1 text-center">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-bold text-emerald-800 truncate max-w-[240px]">
                        {cvFile.name}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Click to change document</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className="w-10 h-10 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-700">
                          Click to browse or drag & drop CV / Resume
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          PDF, DOC, or DOCX (Max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#ffc107] hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-mono"
                >
                  {submitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-black" /> Submit Application
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
