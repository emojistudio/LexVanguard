import { useState } from "react";
import { Globe, MapPin, Phone, Mail, FileText, Instagram, Send, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import RotatingPhoneDisplay from "@/components/RotatingPhoneDisplay";
import { subscribeNewsletter } from "@/lib/newsletter-store";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    try {
      setSubLoading(true);
      const res = await subscribeNewsletter(newsletterEmail.trim());
      setSubStatus(res.message);
      setNewsletterEmail("");
    } catch (err: any) {
      setSubStatus(err?.message || "Failed to subscribe.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer className="bg-[#111111] text-gray-400 py-12 sm:py-16 px-4 sm:px-6 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="col-span-1 text-left">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-10 shrink-0">
              <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M50 5 L90 20 C90 70 70 100 50 115 C30 100 10 70 10 20 Z" stroke="#FFFFFF" strokeWidth="6" fill="none" />
                <path d="M50 30 L50 85 M40 85 L60 85" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
                <path d="M28 42 L72 42" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
                <path d="M28 42 L20 62 L36 62 Z" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                <path d="M72 42 L64 62 L80 62 Z" stroke="#FFFFFF" strokeWidth="4" fill="none" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-serif font-extrabold text-white uppercase tracking-[0.18em] leading-none">
                LexVanguard
              </h3>
              <span className="text-[10px] font-semibold text-[#C9A55C] uppercase tracking-[0.25em] block mt-1">
                Advocates LLP
              </span>
            </div>
          </div>
          <p className="text-sm font-light leading-relaxed text-gray-400 mb-6">
            Premier student law firm at Mount Kenya University Parklands Law Campus (MKUPLC). Excellence in moot court championships, youth in law advocacy, and legal innovation.
          </p>
          <div className="flex space-x-3">
            <a href="https://lexvanguard.xyz" target="_blank" rel="noopener noreferrer" title="Official Website" className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#C9A55C] hover:text-[#C9A55C] transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="mailto:infolexvanguardfirm@gmail.com" title="Email Chambers" className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#C9A55C] hover:text-[#C9A55C] transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/lex_vanguard.firm?igsh=MTh4dXlrdzEzN3lvbw==" target="_blank" rel="noopener noreferrer" title="Follow on Instagram" className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#C9A55C] hover:text-[#C9A55C] transition-colors">
              <Instagram className="w-4 h-4 text-pink-400" />
            </a>
            <a href="https://www.tiktok.com/@lexvanguard.firm?_r=1&_t=ZS-98m2GhC2Ith" target="_blank" rel="noopener noreferrer" title="Follow on TikTok" className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#C9A55C] hover:text-[#C9A55C] transition-colors">
              <svg className="w-4 h-4 text-cyan-400 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68a6.34 6.34 0 0 0 10.86 4.49A6.27 6.27 0 0 0 15.86 16v-7.3a8.88 8.88 0 0 0 4.73 1.38v-3.4a5.45 5.45 0 0 1-1-.02z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-serif text-lg mb-6 uppercase tracking-wider">Practice Areas</h4>
          <ul className="space-y-2">
            {[
              { label: "Corporate & Technology Law", href: "/services" },
              { label: "Intellectual Property & Patents", href: "/services" },
              { label: "Appellate Advocacy & Mooting", href: "/events" },
              { label: "Youth in Law Initiative", href: "/history" }
            ].map((item, idx) => (
              <li key={idx}>
                <Link href={item.href} className="text-gray-400 text-sm hover:text-yellow-500 transition-colors block mb-2">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-serif text-lg mb-6 uppercase tracking-wider">The Gazette Newsletter</h4>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Subscribe to receiving LexVanguard legal dispatches, symposia announcements, and appellate jurisprudence directly in your inbox.
          </p>
          {subStatus ? (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>{subStatus}</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A55C]"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#C9A55C] hover:bg-yellow-500 text-black text-xs font-bold rounded-lg transition flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        <div>
          <h4 className="text-white font-serif text-lg mb-6 uppercase tracking-wider">Chambers Contact</h4>
          <ul className="space-y-4 text-sm font-light">
            <li className="flex items-start">
              <MapPin className="w-4 h-4 text-yellow-500 mr-3 mt-1 shrink-0" />
              <span>Mount Kenya University Parklands Law Campus (MKUPLC)<br />Parklands Road, Nairobi, Kenya</span>
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 text-yellow-500 mr-3 shrink-0" />
              <RotatingPhoneDisplay className="text-yellow-500 font-medium hover:underline" />
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 text-yellow-500 mr-3 shrink-0" />
              <span className="text-xs text-yellow-400 font-mono">infolexvanguardfirm@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full px-2 sm:px-6 lg:px-10 mt-16 pt-8 border-t border-gray-800 text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2026 LexVanguard Advocates LLP. All rights reserved. Mount Kenya University Parklands Law Campus (MKUPLC).</p>
        <div className="flex space-x-6 mt-4 md:mt-0 uppercase tracking-widest font-semibold">
          <Link href="/sitemap" className="text-yellow-500 hover:text-white transition-colors flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> Visual Sitemap
          </Link>
          <a href="/sitemap.xml" target="_blank" className="hover:text-gray-300 transition-colors">XML Sitemap</a>
          <a href="/robots.txt" target="_blank" className="hover:text-gray-300 transition-colors">Robots.txt</a>
        </div>
      </div>
    </footer>
  );
}
