import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { SITE_KEYWORDS } from "@/lib/seo-data";
import RotatingPhoneDisplay from "@/components/RotatingPhoneDisplay";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Shield } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [practiceArea, setPracticeArea] = useState("General Inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          practiceArea,
          subject: subject.trim() || `Inquiry regarding ${practiceArea}`,
          message: message.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("Network connection issue. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white text-black min-h-screen flex flex-col font-sans">
      <SEOHead
        title="Contact Senior Counsel | LexVanguard Advocates LLP"
        description="Get in touch with LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Legal consultations, case evaluations, and firm inquiries."
        keywords={["Contact LexVanguard", "Legal Consultation Kenya", "Law Firm MKUPLC Contact", ...SITE_KEYWORDS]}
        url="https://lexvanguard.xyz/contact"
      />

      <Header />

      {/* Clean Minimal Hero */}
      <div className="pt-32 sm:pt-40 pb-12 px-6 text-center border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-[0.25em] block">
            Direct Inquiry
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-black font-serif">
            Contact Us
          </h1>
          <div className="h-1 w-12 bg-yellow-500 mx-auto" />
          <p className="text-gray-600 text-xs sm:text-base leading-relaxed max-w-xl mx-auto">
            Schedule a legal evaluation or reach out directly to LexVanguard Advocates LLP chambers.
          </p>
        </div>
      </div>

      {/* Main Lightweight Content Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Essential Contact Information */}
          <div className="md:col-span-5 space-y-8 text-left">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wider text-black font-serif border-b-2 border-black pb-2 mb-6">
                Chambers Details
              </h2>

              <div className="space-y-6 text-xs text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black block font-bold text-sm">Physical Campus</strong>
                    <p className="leading-relaxed">Mount Kenya University Parklands Law Campus (MKUPLC)</p>
                    <p className="text-gray-500">Parklands, Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black block font-bold text-sm">Direct Line & Hotline</strong>
                    <div className="mt-1">
                      <RotatingPhoneDisplay className="text-yellow-600 font-bold text-sm hover:underline" />
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">Mon – Fri (08:00 – 18:00 EAT)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black block font-bold text-sm">Email Chambers</strong>
                    <p className="leading-relaxed text-black font-mono text-xs">infolexvanguardfirm@gmail.com</p>
                    <p className="text-gray-500 text-[11px]">Official Firm Inbox</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-black block font-bold text-sm">Consultation Hours</strong>
                    <p className="leading-relaxed">Monday – Friday: 08:30 AM – 05:30 PM</p>
                    <p className="text-gray-500 text-[11px]">Saturday: By Appointment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidentiality Statement */}
            <div className="p-4 bg-gray-50 border-l-4 border-yellow-500 text-xs text-gray-600 space-y-1">
              <span className="font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-yellow-600" /> Advocate-Client Privilege
              </span>
              <p className="leading-relaxed">
                All communications submitted are confidential and protected under Section 134 of the Evidence Act (Cap 80, Laws of Kenya).
              </p>
            </div>
          </div>

          {/* Right Column: Clean Minimal Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white border border-gray-200 p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tight text-black font-serif border-b border-gray-200 pb-3">
                Send a Message
              </h2>

              {success ? (
                <div className="p-8 text-center space-y-4 bg-gray-50 border border-emerald-300">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-black uppercase font-serif">Message Sent</h3>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-md mx-auto">
                    Thank you. Your message has been received by LexVanguard Advocates LLP. We will respond promptly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2 bg-black text-white text-xs font-extrabold uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs text-left">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black font-bold uppercase tracking-wider mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Adv. Evans Ojiambo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-gray-300 p-3 text-black focus:outline-none focus:border-black text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-black font-bold uppercase tracking-wider mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. client@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-300 p-3 text-black focus:outline-none focus:border-black text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black font-bold uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +254 700 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-gray-300 p-3 text-black focus:outline-none focus:border-black text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-black font-bold uppercase tracking-wider mb-1">Subject Area</label>
                      <select
                        value={practiceArea}
                        onChange={(e) => setPracticeArea(e.target.value)}
                        className="w-full bg-white border border-gray-300 p-3 text-black font-medium focus:outline-none focus:border-black text-xs"
                      >
                        <option value="General Inquiry">General Firm Inquiry</option>
                        <option value="Criminal Litigation & Defense">Criminal Litigation & Defense</option>
                        <option value="Alternative Dispute Resolution (ADR)">Alternative Dispute Resolution (ADR)</option>
                        <option value="Civil & Commercial Litigation">Civil & Commercial Litigation</option>
                        <option value="Legal Research & High-Authority Drafting">Legal Research & Drafting</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-black font-bold uppercase tracking-wider mb-1">Message *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write your message or legal inquiry details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white border border-gray-300 p-3 text-black focus:outline-none focus:border-black text-xs leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-yellow-500 hover:bg-black hover:text-white text-black py-3 px-6 font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    {submitting ? "SENDING..." : "SEND"} <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
