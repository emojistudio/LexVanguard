import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { SITE_KEYWORDS } from "@/lib/seo-data";
import { Code, Compass, Users, ArrowRight } from "lucide-react";

const MILESTONES = [
  { year: "Founded", title: "LexVanguard Established", desc: "LexVanguard was founded at Mount Kenya University Parklands Law Campus (MKUPLC) by Prince Micah, Kelvin Musya, and Donel Aganyo to bridge the gap between academic theory and real-world legal practice." },
  { year: "Year 1", title: "First National Competition", desc: "Members attended their first national moot court competition, representing Mount Kenya University Parklands Law Campus with distinction and establishing the firm's competitive reputation on a national stage." },
  { year: "Growth", title: "Expanding Membership", desc: "The firm grew to encompass a diverse tapestry of perspectives, backgrounds, and intellectual approaches — welcoming all who possess the visceral urge to see justice persevere." },
  { year: "Today", title: "Recognized Excellence", desc: "Recognized as one of the most prestigious student-led law firms in Kenya, LexVanguard has amassed a collection of accolades that belie its relative youth." },
  { year: "Vision", title: "World-Class Pillar of Justice", desc: "The firm's trajectory is set toward international recognition — standing shoulder to shoulder with the finest law firms and institutions globally." }
];

export default function HistoryPage() {
  return (
    <div className="w-full bg-white text-black font-sans">
      <SEOHead
        title="Firm History & Founding Legacy | LexVanguard Advocates LLP"
        description="The founding history and legacy of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Founded in September 2025 by Prince Micah, Kelvin Musya, and Donel Aganyo."
        keywords={[
          "LexVanguard History",
          "LexVanguard Founders",
          "Prince Micah",
          "Kelvin Musya",
          "Donel Aganyo",
          "Mount Kenya University Parklands Law Campus",
          "MKUPLC History",
          "Student Law Firm Kenya",
          ...SITE_KEYWORDS
        ]}
        url="https://lexvanguard.xyz/history"
      />
      <Header />

      {/* Page Hero */}
      <div className="bg-black pt-32 sm:pt-40 pb-16 px-6 text-center border-b-4 border-yellow-500">
        <span className="text-[#ffc107] font-mono text-xs uppercase tracking-[0.3em] font-bold block mb-2">
          Origin & Evolution
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider font-serif">
          History & Founding Portfolio
        </h1>
        <div className="h-1 w-16 bg-yellow-500 mx-auto mt-4" />
        <p className="text-gray-300 max-w-2xl mx-auto mt-4 text-xs sm:text-base leading-relaxed">
          The founding journey, leadership pillars, and historical milestones of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus.
        </p>
      </div>

      {/* TOP SECTION: FOUNDERS AS PART OF HISTORY (HORIZONTAL FLEX ON WIDE SCREENS - 90% VIEWPORT) */}
      <div className="py-16 sm:py-20 bg-gray-50 border-b border-gray-200">
        <div className="w-[90vw] max-w-[90vw] mx-auto space-y-10 text-center">
          <div>
            <span className="text-yellow-600 uppercase tracking-[0.25em] text-xs font-bold font-mono block mb-1">
              Chapter I — September 2025
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black uppercase font-serif tracking-tight">
              The Founding Chapter
            </h2>
            <div className="h-1 w-12 bg-black mx-auto mt-3 mb-4" />
            <p className="text-gray-700 leading-relaxed text-xs sm:text-base max-w-4xl mx-auto">
              LexVanguard Advocates LLP was established at <strong className="text-black">Mount Kenya University Parklands Law Campus</strong> by three visionary law scholars: <strong className="text-black">Prince Micah, Kelvin Musya, and Donel Aganyo</strong>. They conceived LexVanguard as a disciplined platform for legal innovation, advocacy, and student leadership.
            </p>
          </div>

          {/* Horizontal Flex Container covering 90% viewport width on wide screens */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center w-full text-left">
            
            {/* PRINCE MICAH SUMMARY CARD */}
            <div className="flex-1 bg-white border-2 border-black p-6 sm:p-8 flex flex-col justify-between hover:border-yellow-500 transition-colors shadow-xs group">
              <div className="space-y-4">
                <img
                  src="/images/profiles/prince.jpeg"
                  alt="Prince Micah"
                  className="w-full h-60 object-cover border border-gray-200"
                />
                <div>
                  <span className="text-[10px] font-mono text-yellow-600 font-bold uppercase tracking-widest block">Co-Founder</span>
                  <h3 className="text-xl font-extrabold text-black uppercase font-serif group-hover:text-yellow-600 transition-colors">
                    Prince Micah
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                    Technology & Innovation Lead
                  </p>
                </div>
                <div className="bg-yellow-50 border-l-2 border-yellow-500 p-2.5 text-[11px] font-semibold text-black leading-snug">
                  Planned, architected, designed, and built this entire website (<strong>lexvanguard.xyz</strong>) from the ground up.
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Software engineer and legal tech architect positioning LexVanguard at the intersection of law, AI, data security, and emerging digital jurisprudence.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/founders/prince"
                  className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>View Full Profile</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* KELVIN MUSYA SUMMARY CARD */}
            <div className="flex-1 bg-white border-2 border-black p-6 sm:p-8 flex flex-col justify-between hover:border-yellow-500 transition-colors shadow-xs group">
              <div className="space-y-4">
                <img
                  src="/images/profiles/kelvin.jpeg"
                  alt="Kelvin Musya"
                  className="w-full h-60 object-cover border border-gray-200"
                />
                <div>
                  <span className="text-[10px] font-mono text-yellow-600 font-bold uppercase tracking-widest block">Co-Founder</span>
                  <h3 className="text-xl font-extrabold text-black uppercase font-serif group-hover:text-yellow-600 transition-colors">
                    Kelvin Musya
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                    Chief Strategist & Organising Director
                  </p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Architect of the unified-firm concept. Drives strategic planning, organizational governance, discipline, partnership outreach, and institutional growth.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/founders/kelvin"
                  className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>View Full Profile</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* DONEL AGANYO SUMMARY CARD */}
            <div className="flex-1 bg-white border-2 border-black p-6 sm:p-8 flex flex-col justify-between hover:border-yellow-500 transition-colors shadow-xs group">
              <div className="space-y-4">
                <img
                  src="/images/profiles/don.jpeg"
                  alt="Donel Aganyo"
                  className="w-full h-60 object-cover border border-gray-200"
                />
                <div>
                  <span className="text-[10px] font-mono text-yellow-600 font-bold uppercase tracking-widest block">Co-Founder</span>
                  <h3 className="text-xl font-extrabold text-black uppercase font-serif group-hover:text-yellow-600 transition-colors">
                    Donel Aganyo
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                    Advocacy Partner & Outreach Lead
                  </p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Voice of member engagement, moot court preparation, oral advocacy, legal writing forums, and youth-in-law community outreach.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/founders/donel"
                  className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>View Full Profile</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Narrative Story */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-16 text-center bg-white">
        <p className="text-yellow-600 uppercase tracking-[0.2em] text-xs font-bold mb-3">Our Story</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-6 uppercase tracking-wide font-serif">
          From Vision to Reality
        </h2>
        <div className="max-w-5xl mx-auto space-y-6 text-left">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            In the competitive landscape of legal education, where theory often meets the daunting threshold of practice, few organizations stand as beacons of excellence and opportunity. LexVanguard is one such institution. Recognized as one of the most prestigious student-led law firms at Mount Kenya University, its reputation extends across the country, marking it not merely as a university society, but as a formidable incubator for legal talent.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            The foundation of LexVanguard's success lies in its deeply ingrained culture of inclusivity. The firm operates on the belief that the pursuit of justice is not the exclusive domain of the privileged few, but a calling that requires spirit, discipline, and tenacity. By welcoming a diversity of perspectives and backgrounds, the firm ensures that every member contributes uniquely to the collective pursuit of justice.
          </p>
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="bg-black py-16 sm:py-20 px-6 text-white border-t-4 border-yellow-500">
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wider font-serif mb-3">
              Historical Milestones
            </h2>
            <div className="h-1 w-16 bg-yellow-500 mx-auto" />
          </div>
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-yellow-500/30 md:transform md:-translate-x-px" />
            <div className="space-y-10">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="md:w-1/2 md:text-right md:pr-12 pl-8 md:pl-0">
                    {i % 2 === 0 && (
                      <div>
                        <span className="text-yellow-500 font-extrabold text-xs uppercase tracking-widest block mb-1">{m.year}</span>
                        <h3 className="text-white font-extrabold text-base uppercase tracking-wide mb-2">{m.title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{m.desc}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute left-0 md:left-1/2 top-1 w-3.5 h-3.5 bg-yellow-500 rounded-full md:-translate-x-1/2 -translate-x-1/2 shadow-lg shadow-yellow-500/50 shrink-0" />
                  <div className="md:w-1/2 md:pl-12 pl-8">
                    {i % 2 !== 0 && (
                      <div>
                        <span className="text-yellow-500 font-extrabold text-xs uppercase tracking-widest block mb-1">{m.year}</span>
                        <h3 className="text-white font-extrabold text-base uppercase tracking-wide mb-2">{m.title}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{m.desc}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
