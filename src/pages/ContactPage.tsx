import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { SITE_KEYWORDS } from "@/lib/seo-data";
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, 
  Sparkles, Building2, Shield, Scale, ArrowRight 
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [practiceArea, setPracticeArea] = useState("Criminal Litigation & Defense");
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
        setError(data.error || "Failed to dispatch inquiry. Please try again.");
      }
    } catch (err) {
      setError("Network connection issue. Please check your internet connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col font-sans">
      <SEOHead
        title="Contact Us & Legal Evaluation | LexVanguard Advocates LLP"
        description="Get in touch with senior partners at LexVanguard Advocates LLP, Mount Kenya University Parklands Law Campus (MKUPLC). Legal consultations, case evaluations, and firm inquiries."
        keywords={["Contact LexVanguard", "Legal Consultation Kenya", "Law Firm MKUPLC Contact", ...SITE_KEYWORDS]}
        url="https://lexvanguard.xyz/contact"
      />

      <Header />

      {/* Hero Banner */}
      <div className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 text-center border-b border-yellow-500/20 bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
        <div className="max-w-4xl mx-auto space-y-4">
       
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Contact Senior Counsel
          </h1>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-2" />
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            Reach out to our partners, schedule a formal case evaluation, or submit inquiries to LexVanguard Advocates LLP.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Office Info & Direct Contacts */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-wider text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-yellow-500" /> Chambers Headquarters
              </h2>

              <div className="space-y-5 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Physical Campus Location</strong>
                    <p className="leading-relaxed">Mount Kenya University Parklands Law Campus (MKUPLC)</p>
                    <p className="text-gray-400">Parklands, Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Direct Line & Hotline</strong>
                    <p className="leading-relaxed">+254 700 000 000 / +254 722 000 000</p>
                    <p className="text-gray-400">Available Mon – Fri (08:00 – 18:00 EAT)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Official Chambers Email</strong>
                    <p className="leading-relaxed text-yellow-400 font-mono">counsel@lexvanguard.xyz</p>
                    <p className="text-gray-400">Secure automated inbox backed by Resend</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-0.5">Consultation Hours</strong>
                    <p className="leading-relaxed">Monday – Friday: 08:30 AM – 05:30 PM</p>
                    <p className="text-gray-400">Saturday: By Appointment Only</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidentiality Guarantee */}
            <div className="bg-gradient-to-br from-neutral-900 to-black border border-yellow-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Shield className="w-4 h-4" /> Advocate-Client Privilege Guaranteed
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                All communications and attachments submitted through this portal are strictly confidential and protected under Section 134 of the Evidence Act (Cap 80, Laws of Kenya).
              </p>
            </div>
          </div>

          {/* Right Column: Contact & Case Evaluation Form */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Send Us a Message</h2>
                <p className="text-xs text-gray-400 mt-1">Fill in your case details and senior counsel will contact you promptly.</p>
              </div>

              {success ? (
                <div className="bg-neutral-950 border border-emerald-500/40 p-8 rounded-2xl text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                    Thank you for contacting LexVanguard Advocates LLP. Your inquiry has been routed to our managing counsel. A representative will contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-yellow-400 transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {error && (
                    <div className="bg-rose-950/80 border border-rose-500 text-rose-200 p-3.5 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Adv. Evans Ojiambo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. client@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +254 700 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-bold mb-1">Practice Division / Subject Area</label>
                      <select
                        value={practiceArea}
                        onChange={(e) => setPracticeArea(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white font-semibold focus:outline-none focus:border-yellow-500"
                      >
                        <option value="Criminal Litigation & Defense">Criminal Litigation & Defense</option>
                        <option value="Alternative Dispute Resolution (ADR)">Alternative Dispute Resolution (ADR)</option>
                        <option value="International Court of Justice (ICJ)">International Court of Justice (ICJ)</option>
                        <option value="Civil & Commercial Litigation">Civil & Commercial Litigation</option>
                        <option value="Legal Research & High-Authority Drafting">Legal Research & Drafting</option>
                        <option value="General Inquiry">General Firm Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Subject Headline</label>
                    <input
                      type="text"
                      placeholder="e.g. Consultation request for commercial contract dispute"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Message Details & Case Summary *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Provide a summary of your legal matter or inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black p-3.5 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? "Transmitting Message..." : "Dispatch Inquiry to Counsel"} <Send className="w-4 h-4" />
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
