import { Globe, X, MapPin, Phone, Mail, FileText } from "lucide-react";
import { Link } from "wouter";
import RotatingPhoneDisplay from "@/components/RotatingPhoneDisplay";

export default function Footer() {
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
            <a href="mailto:counsel@lexvanguard.xyz" title="Email Chambers" className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-[#C9A55C] hover:text-[#C9A55C] transition-colors">
              <Mail className="w-4 h-4" />
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
          <h4 className="text-white font-serif text-lg mb-6 uppercase tracking-wider">The Firm</h4>
          <ul className="space-y-2">
            {[
              { label: "Founding Members & Attorneys", href: "/attorneys" },
              { label: "Prince Micah Profile", href: "/attorneys/prince-micah" },
              { label: "Kelvin Musya Profile", href: "/attorneys/kelvin-musya" },
              { label: "Donel Aganyo Profile", href: "/attorneys/donel-aganyo" },
              { label: "Research & Precedent Desk", href: "/desk" },
              { label: "Firm History & MKUPLC Legacy", href: "/history" },
              { label: "Visual Sitemap & Index", href: "/sitemap" }
            ].map(item => (
              <li key={item.label}>
                <Link href={item.href} className="text-gray-400 text-sm hover:text-yellow-500 transition-colors block mb-2">{item.label}</Link>
              </li>
            ))}
          </ul>
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
              <span>counsel@lexvanguard.xyz</span>
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
