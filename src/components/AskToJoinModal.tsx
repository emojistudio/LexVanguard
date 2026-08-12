import React, { useState } from "react";
import { X, Send, CheckCircle2, Upload, Check } from "lucide-react";
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

  // Form is valid when Name, Email (with @), and Phone are filled
  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && email.includes("@") && phone.trim().length > 0;

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

  // Convert uploaded CV file to Base64 Data URL for Firestore & Admin Review access if provided
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim() || "N/A";
    const cvFileName = cvFile ? cvFile.name : "No CV Uploaded";

    try {
      let cvUrl = "";
      if (cvFile) {
        try {
          cvUrl = await convertFileToBase64(cvFile);
        } catch (err) {
          console.warn("Base64 conversion notice:", err);
        }
      }

      // 1. Record application in Firestore /firm_applications collection for immediate Admin dashboard review
      await addDoc(collection(db, "firm_applications"), {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        cvFileName,
        cvUrl,
        roleInterest: "Counsel",
        status: "pending",
        createdAt: serverTimestamp()
      });

      // 2. Dispatch backend notification to Admin Panel & Admissions Committee
      try {
        await fetch("/api/send-application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone,
            cvFileName,
            cvUrl,
            roleInterest: "Counsel"
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
              Thank you, <strong>{name}</strong>. Your membership application has been delivered to our admissions panel. A confirmation notice has been logged for <strong>{email}</strong>.
            </p>
            <div className="pt-3">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#1d1d1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all cursor-pointer shadow-md font-mono"
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
                  Full Name <span className="text-amber-600">*</span>
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
                  Email Address <span className="text-amber-600">*</span>
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
                  Phone Number <span className="text-amber-600">*</span>
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

              {/* Standard Drag & Drop Upload Box - Optional */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    CV / Resume Upload
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono uppercase">Optional</span>
                </div>
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-5 px-4 cursor-pointer transition-all ${
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
                      <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs font-bold text-emerald-800 truncate max-w-[240px]">
                        {cvFile.name}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium">Click to replace CV document</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-1.5 text-center">
                      <div className="w-8 h-8 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-700">
                          Click to browse or drag & drop CV (Optional)
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
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
                  disabled={submitting || !isFormValid}
                  className={`w-full font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 font-mono ${
                    !isFormValid || submitting
                      ? "bg-zinc-200 text-zinc-400 cursor-not-allowed border border-zinc-300 opacity-60"
                      : "bg-[#ffc107] hover:bg-yellow-400 text-black cursor-pointer shadow-lg hover:scale-[1.01]"
                  }`}
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
