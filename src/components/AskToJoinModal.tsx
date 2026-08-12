import React, { useState } from "react";
import { X, Send, CheckCircle2, User, Mail, Briefcase, FileText } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface AskToJoinModalProps {
  onClose: () => void;
}

export const AskToJoinModal: React.FC<AskToJoinModalProps> = ({ onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roleInterest, setRoleInterest] = useState("Counsel");
  const [statement, setStatement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes("@")) return;

    setSubmitting(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Save application to Firestore
      await addDoc(collection(db, "firm_applications"), {
        name: name.trim(),
        email: cleanEmail,
        roleInterest,
        statement: statement.trim() || "Application to join LexVanguard Advocates LLP.",
        status: "pending",
        createdAt: serverTimestamp()
      });

      // 2. Dispatch email notification to admin via API endpoint
      try {
        await fetch("/api/send-application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: cleanEmail,
            roleInterest,
            statement: statement.trim()
          })
        });
      } catch (err) {
        console.warn("Application email dispatch notice:", err);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting application to Firestore:", err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative overflow-hidden animate-fade-in">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Application Received</h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
              Thank you, <strong>{name}</strong>. Your membership application has been submitted to the Executive Admissions Directorate of <strong>LexVanguard Advocates LLP</strong>. You will receive an official response via <strong>{email}</strong> upon review.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1d1d1f] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-4">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Institutional Membership
              </span>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mt-2">Apply to Join LexVanguard LLP</h2>
              <p className="text-xs text-gray-500 mt-1">Submit your candidacy to join our legal incubator, appellate research team, or counsel panel.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Counsel Jane Doe"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> Primary Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Preferred Designation
                  </label>
                  <select
                    value={roleInterest}
                    onChange={(e) => setRoleInterest(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Counsel">Counsel / Advocate</option>
                    <option value="Senior Counsel">Senior Counsel</option>
                    <option value="Research Fellow">Appellate Research Fellow</option>
                    <option value="Mooting Scholar">Mooting Scholar</option>
                    <option value="Legal Assistant">Legal Assistant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" /> Qualifications & Statement of Purpose
                </label>
                <textarea
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Briefly state your legal background, university affiliation (e.g., MKUPLC), and areas of interest..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1d1d1f] hover:bg-black text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit Application
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
