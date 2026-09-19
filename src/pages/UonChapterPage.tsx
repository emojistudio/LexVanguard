import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { 
  Scale, Award, BookOpen, Users, MapPin, Mail, Phone, 
  CheckCircle2, ArrowRight, Shield, Globe, FileText, Send,
  ChevronRight, Sparkles, School, GraduationCap, Building2
} from "lucide-react";
import { UON_CHAPTER_SCHEMA, SITE_KEYWORDS } from "@/lib/seo-data";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const UON_GALLERY_IMAGES = [
  {
    url: "/images/chapters/uon/uon-1.jpeg",
    title: "UoN Chapter Delegation & Bilateral Session",
    desc: "LexVanguard student advocates at Parklands Campus School of Law"
  },
  {
    url: "/images/chapters/uon/uon-2.jpeg",
    title: "Appellate Advocacy & Moot Practice",
    desc: "Collaborative research and oral submissions briefing"
  },
  {
    url: "/images/chapters/uon/uon-3.jpeg",
    title: "Strategic Planning & Chapter Secretariat",
    desc: "Formalizing inter-chapter legal initiatives and mooting circuits"
  },
  {
    url: "/images/chapters/uon/uon-4.jpeg",
    title: "Legal Research & Precedents Review",
    desc: "Synthesizing regional jurisprudence and court memorials"
  },
  {
    url: "/images/chapters/uon/uon-5.jpeg",
    title: "Youth in Law Forum",
    desc: "Bridging collegiate legal education with practical trial skills"
  },
  {
    url: "/images/chapters/uon/uon-6.jpeg",
    title: "Inter-Chapter Symposium",
    desc: "Joint fellowship between MKUPLC and UoN student delegates"
  },
  {
    url: "/images/chapters/uon/uon-7.jpeg",
    title: "Parklands Campus Legal Network",
    desc: "Expanding collegiate legal scholarship across Kenya's top law schools"
  }
];

const CHAPTER_PILLARS = [
  {
    icon: <Scale className="w-8 h-8 text-yellow-500" />,
    title: "Mooting & Appellate Advocacy",
    desc: "Intensive training in appellate brief writing, oral submissions, and competitive representation in national, regional, and international moot court championships."
  },
  {
    icon: <BookOpen className="w-8 h-8 text-yellow-500" />,
    title: "Legal Research & Publications",
    desc: "Rigorous case law analysis, statutory interpretation, and synthesis of landmark jurisprudence for high-authority court briefs and student law journals."
  },
  {
    icon: <Shield className="w-8 h-8 text-yellow-500" />,
    title: "Strategic Litigation & Law Reform",
    desc: "Deep-dives into constitutional petitions, human rights law, public interest advocacy, and legal technology integration via eLegal tools."
  },
  {
    icon: <Globe className="w-8 h-8 text-yellow-500" />,
    title: "Inter-Chapter Bilateral Network",
    desc: "Direct operational synergy with the Founding Chapter at MKU Parklands Law Campus, co-hosting sparring rounds, symposiums, and joint publications."
  }
];

const LEADERSHIP_ROSTER = [
  {
    role: "Chapter President & Convener",
    name: "Student Secretariat Directorate",
    unit: "Executive Council — UoN Parklands Campus",
    bio: "Overseeing bilateral chapter alignment, institutional representation, and student firm administration."
  },
  {
    role: "Director of Appellate Advocacy & Mooting",
    name: "Mooting Board Directorate",
    unit: "Chambers & Moot Court Division",
    bio: "Supervising tournament delegations, memorial drafting clinics, and mock court trial simulations."
  },
  {
    role: "Director of Legal Research & Precedents",
    name: "Research Editorial Desk",
    unit: "eLegal & Jurisprudence Committee",
    bio: "Leading Kenya Law case summaries, ratio decidendi synthesis, and collaborative digital legal archives."
  },
  {
    role: "Director of Membership & Chapter Affairs",
    name: "Student Affairs Directorate",
    unit: "Admissions & Welfare Division",
    bio: "Coordinating student recruitment, peer mentorship, and inter-university fellowship events."
  }
];

export default function UonChapterPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("Year 2");
  const [studentRegNo, setStudentRegNo] = useState("");
  const [primaryInterest, setPrimaryInterest] = useState("Moot Court & Appellate Advocacy");
  const [motivation, setMotivation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-advance gallery slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % UON_GALLERY_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const isFormValid = fullName.trim().length > 0 && 
                      email.trim().length > 0 && 
                      email.includes("@") && 
                      phone.trim().length > 0;

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      await addDoc(collection(db, "firm_applications"), {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        institution: "University of Nairobi (UoN) Parklands Campus",
        chapter: "University of Nairobi Chapter",
        yearOfStudy,
        studentRegNo: studentRegNo.trim() || "N/A",
        primaryInterest,
        statement: motivation.trim() || "Applied via UoN Chapter Portal",
        appliedRole: `UoN Chapter Fellowship — ${primaryInterest}`,
        cvFileName: "Online Chapter Application",
        cvUrl: "",
        status: "pending",
        source: "uon.lexvanguard.xyz",
        appliedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      setSuccessMessage("Your membership application for the UoN Chapter has been submitted successfully. The Chapter Admissions Committee will review your details and contact you via email.");
      setFullName("");
      setEmail("");
      setPhone("");
      setStudentRegNo("");
      setMotivation("");
    } catch (err: any) {
      console.error("Error submitting UoN application:", err);
      setErrorMessage(err?.message || "An error occurred while submitting your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0d14] text-slate-100 font-sans flex flex-col justify-between selection:bg-yellow-500 selection:text-black">
      <SEOHead
        title="University of Nairobi (UoN) Chapter | LexVanguard Advocates LLP"
        description="Official portal of the LexVanguard Advocates LLP University of Nairobi (UoN) Chapter at Parklands Campus. Leadership roster, objectives, inter-chapter MOU, active student roster, and membership application."
        url="https://uon.lexvanguard.xyz"
        canonical="https://www.lexvanguard.xyz/chapters/uon"
        keywords={[
          ...SITE_KEYWORDS,
          "University of Nairobi",
          "UoN Law",
          "Parklands Campus Law School",
          "UoN Moot Court",
          "UoN LexVanguard Chapter"
        ]}
        jsonLd={UON_CHAPTER_SCHEMA}
      />

      <Header />

      <main className="flex-grow pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0e131f] via-[#0a0d14] to-[#07090e] py-16 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(234,179,8,0.15),rgba(255,255,255,0))]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              
              {/* Left Column: Heading & Description */}
              <div className="w-full lg:w-7/12 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                  <School className="w-4 h-4 text-yellow-400" />
                  <span>Parklands Campus • School of Law</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
                  University of Nairobi <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-amber-500">
                    Chapter Portal
                  </span>
                </h1>

                <p className="text-slate-300 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Welcome to the official digital hub of the <strong className="font-semibold text-white">LexVanguard Advocates LLP</strong> University of Nairobi (UoN) Chapter. Fostering appellate trial advocacy, jurisprudence research, mooting championships, and inter-collegiate legal camaraderie at Parklands.
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <a
                    href="#apply"
                    className="px-7 py-3.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold tracking-wide transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2 text-sm uppercase"
                  >
                    <span>Apply for Membership</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="#mou"
                    className="px-7 py-3.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold tracking-wide transition-all text-sm uppercase"
                  >
                    Chapter Framework & MOU
                  </a>
                </div>

                {/* Quick Stats Badges */}
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80">
                  <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                    <div className="text-2xl font-bold text-yellow-400 font-serif">Parklands</div>
                    <div className="text-xs text-slate-400">Campus Secretariat</div>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                    <div className="text-2xl font-bold text-white font-serif">Bilateral</div>
                    <div className="text-xs text-slate-400">MKUPLC Partnership</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                    <div className="text-2xl font-bold text-yellow-400 font-serif">All LLB</div>
                    <div className="text-xs text-slate-400">Years 1 - 4 Eligible</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Interactive Gallery */}
              <div className="w-full lg:w-5/12">
                <div className="relative rounded-2xl overflow-hidden border border-yellow-500/20 shadow-2xl bg-slate-900 aspect-[4/3]">
                  {UON_GALLERY_IMAGES.map((img, idx) => (
                    <div
                      key={img.url}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                        <div className="text-xs font-semibold tracking-wider text-yellow-400 uppercase mb-1">
                          Photo {idx + 1} of {UON_GALLERY_IMAGES.length}
                        </div>
                        <h4 className="text-white font-serif font-bold text-lg leading-snug">
                          {img.title}
                        </h4>
                        <p className="text-slate-300 text-xs mt-1">
                          {img.desc}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Slide Indicators */}
                  <div className="absolute top-4 right-4 flex gap-1.5 z-20">
                    {UON_GALLERY_IMAGES.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setActiveSlide(dotIdx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          dotIdx === activeSlide ? "bg-yellow-400 w-6" : "bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Chapter Mission & Strategic Pillars */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-semibold tracking-widest text-yellow-500 uppercase mb-3">
              Strategic Focus Areas
            </h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Pillars of the UoN Chapter
            </h3>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              The UoN Chapter operates under the charter of LexVanguard Advocates LLP, replicating the standard of excellence that propelled our founders into high-stakes litigation, moot championships, and digital legal tech innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHAPTER_PILLARS.map((pillar, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-800 hover:border-yellow-500/40 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/5 group"
              >
                <div className="p-3 bg-slate-800/80 rounded-lg w-fit mb-5 group-hover:bg-yellow-500/10 transition-colors">
                  {pillar.icon}
                </div>
                <h4 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {pillar.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bilateral Partnership MOU Section */}
        <section id="mou" className="py-16 bg-[#0c101a] border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-slate-900 via-[#101524] to-slate-900 border border-yellow-500/20 rounded-2xl p-8 sm:p-12 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Inter-Chapter Bilateral Framework</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Memorandum of Understanding & Synergy
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    The University of Nairobi (UoN) Chapter operates under an active inter-chapter collaboration agreement with the <span className="text-yellow-400 font-semibold">Mount Kenya University Parklands Law Campus (MKUPLC)</span> Founding Chapter. 
                  </p>
                  <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span><strong>Joint Moot Sparring:</strong> Reciprocal oral simulations and bench questioning for national moot court competitions.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span><strong>Unified eLegal Intelligence:</strong> Shared access to digital jurisprudence indices, ratio decidendi archives, and precedent banks.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                      <span><strong>Co-Hosted Legal Symposia:</strong> Joint colloquiums with guest judges, senior advocates, and legal scholars.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-xl text-center min-w-[280px] w-full lg:w-auto shadow-inner">
                  <Building2 className="w-12 h-12 text-yellow-400 mx-auto mb-3 opacity-90" />
                  <div className="text-xs uppercase tracking-widest text-slate-400 font-medium">Chapter Domain Portal</div>
                  <div className="text-xl font-bold font-serif text-white mt-1">uon.lexvanguard.xyz</div>
                  <div className="text-xs text-yellow-500 mt-1 font-mono">Status: Active & Integrated</div>
                  <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 text-left space-y-1">
                    <div><strong>Headquarters:</strong> Parklands Campus</div>
                    <div><strong>Affiliation:</strong> LexVanguard Advocates LLP</div>
                    <div><strong>Liaison:</strong> chapters@lexvanguard.xyz</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Leadership & Committee Roster */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-semibold tracking-widest text-yellow-500 uppercase mb-3">
              Governance & Structure
            </h2>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Chapter Leadership & Committees
            </h3>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Guided by merit, rigorous legal scholarship, and ethical advocacy, our UoN Chapter leadership coordinates academic affairs, tournaments, and student mentorship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_ROSTER.map((lead, idx) => (
              <div 
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-yellow-500/30 transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-1">
                    {lead.unit}
                  </div>
                  <h4 className="text-lg font-serif font-bold text-white mb-2">
                    {lead.role}
                  </h4>
                  <div className="text-sm font-medium text-slate-300 mb-3">
                    {lead.name}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {lead.bio}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                  <GraduationCap className="w-3.5 h-3.5 text-yellow-500" />
                  <span>UoN School of Law</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Membership Application Form */}
        <section id="apply" className="py-16 sm:py-24 bg-gradient-to-b from-[#0a0d14] via-[#0d121c] to-[#0a0d14] border-t border-slate-800/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admissions 2026/2027</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Join the UoN Chapter Fellowship
              </h3>
              <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
                Applications are open for all passionate University of Nairobi law students. Whether your ambition is appellate mooting, legal research, or corporate advisory, LexVanguard provides the platform to elevate your career.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative">
              {successMessage ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
                  <h4 className="text-2xl font-serif font-bold text-white">Application Received</h4>
                  <p className="text-slate-300 max-w-lg mx-auto text-sm leading-relaxed">
                    {successMessage}
                  </p>
                  <button
                    onClick={() => setSuccessMessage(null)}
                    className="mt-6 px-6 py-2.5 rounded-lg bg-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Full Name <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Email Address <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. janedoe@students.uonbi.ac.ke"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Phone Number (WhatsApp) <span className="text-yellow-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +254 712 345 678"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Student Reg. / Admission No.
                      </label>
                      <input
                        type="text"
                        value={studentRegNo}
                        onChange={(e) => setStudentRegNo(e.target.value)}
                        placeholder="e.g. G34/12345/2023"
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Year of Study
                      </label>
                      <select
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                      >
                        <option value="Year 1">Year 1 (LLB First Year)</option>
                        <option value="Year 2">Year 2 (LLB Second Year)</option>
                        <option value="Year 3">Year 3 (LLB Third Year)</option>
                        <option value="Year 4">Year 4 (LLB Finalist)</option>
                        <option value="Postgraduate">Postgraduate / LLM</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                        Primary Division of Interest
                      </label>
                      <select
                        value={primaryInterest}
                        onChange={(e) => setPrimaryInterest(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                      >
                        <option value="Moot Court & Appellate Advocacy">Moot Court & Appellate Advocacy</option>
                        <option value="Legal Research & Precedents Synthesis">Legal Research & Precedents Synthesis</option>
                        <option value="Strategic Litigation & Constitutional Law">Strategic Litigation & Constitutional Law</option>
                        <option value="Corporate, Tech & Intellectual Property">Corporate, Tech & Intellectual Property</option>
                        <option value="Editorial & Journal Publications">Editorial & Journal Publications</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Brief Statement of Motivation
                    </label>
                    <textarea
                      rows={4}
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      placeholder="Why do you want to join the LexVanguard UoN Chapter? Highlight your mooting, research, or leadership interests..."
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 text-sm transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                      Submitting routes your profile directly to the Chapter Admissions Board.
                    </p>
                    <button
                      type="submit"
                      disabled={!isFormValid || submitting}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
