import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Briefcase,
  Home as HomeIcon,
  ShieldCheck,
  Compass,
  ChevronRight,
  ArrowRight,
  X,
  CheckCircle2,
  PhoneCall,
  UserCheck
} from "lucide-react";
import { PRACTICE_GROUPS, PracticeGroup, DetailedPractice } from "@/data/practice-areas-data";

interface PracticeAreasSectionProps {
  initialCategoryId?: string;
  initialPracticeId?: string;
}

export default function PracticeAreasSection({ initialCategoryId, initialPracticeId }: PracticeAreasSectionProps) {
  const [, setLocation] = useLocation();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(initialCategoryId || null);
  const [activePractice, setActivePractice] = useState<DetailedPractice | null>(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultationSubject, setConsultationSubject] = useState("");

  // Sync initial props or route params
  useEffect(() => {
    if (initialCategoryId) {
      setExpandedCategoryId(initialCategoryId);
    }
    if (initialCategoryId && initialPracticeId) {
      const group = PRACTICE_GROUPS.find((g) => g.id === initialCategoryId);
      if (group) {
        const practice = group.practices.find((p) => p.id === initialPracticeId);
        if (practice) {
          setActivePractice(practice);
        }
      }
    }
  }, [initialCategoryId, initialPracticeId]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Scale":
        return <Scale className="w-5 h-5 text-[#9A7B2C]" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-[#9A7B2C]" />;
      case "Home":
        return <HomeIcon className="w-5 h-5 text-[#9A7B2C]" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 text-[#9A7B2C]" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-[#9A7B2C]" />;
      default:
        return <Scale className="w-5 h-5 text-[#9A7B2C]" />;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
    }
  };

  const handleOpenPracticeDetail = (practice: DetailedPractice, categoryId: string) => {
    setActivePractice(practice);
    setConsultationSubject(practice.title);
  };

  const handleRequestConsultation = (subject?: string) => {
    if (subject) setConsultationSubject(subject);
    setShowConsultModal(true);
  };

  return (
    <section className="w-full bg-[#FAF9F6] text-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-12 relative overflow-hidden font-sans border-t border-b border-neutral-200/80">
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* 2. SECTION HERO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 pb-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#9A7B2C] uppercase block">
              PRACTICE AREAS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 font-serif tracking-tight leading-tight">
              Legal expertise for complex matters.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal pt-2">
              LexVanguard provides strategic legal advice, courtroom representation, commercial dispute resolution, and advocacy across core legal disciplines.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => handleRequestConsultation("General Practice Consultation")}
              className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#0A192F] hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-sm transition-all duration-300 shadow-md cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#9A7B2C]"
            >
              <span>Discuss Your Matter</span>
              <ArrowRight className="w-4 h-4 text-[#9A7B2C] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* 3. PRIMARY INTERFACE — 5 CATEGORY GRID */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
            {PRACTICE_GROUPS.map((group) => {
              const isExpanded = expandedCategoryId === group.id;
              return (
                <div
                  key={group.id}
                  className={`relative flex flex-col justify-between p-6 rounded-xs transition-all duration-300 border cursor-pointer group ${
                    isExpanded
                      ? "bg-white border-[#9A7B2C] shadow-xl shadow-slate-200/80 ring-1 ring-[#9A7B2C]/40"
                      : "bg-white hover:bg-[#FFFDF9] border-neutral-200 hover:border-[#9A7B2C]/70 shadow-xs hover:shadow-md"
                  }`}
                  onClick={() => handleCategoryClick(group.id)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                  aria-controls={`panel-${group.id}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCategoryClick(group.id);
                    }
                  }}
                >
                  <div className="space-y-4">
                    {/* Header bar: Number & Icon */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <span className="font-mono text-xs font-bold text-[#9A7B2C] tracking-wider">
                        {group.number}
                      </span>
                      <div className="p-2 rounded-xs bg-amber-500/10 group-hover:bg-amber-500/20 transition-colors">
                        {getCategoryIcon(group.iconName)}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-slate-900 font-serif leading-snug group-hover:text-[#9A7B2C] transition-colors">
                      {group.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 font-sans">
                      {group.description}
                    </p>
                  </div>

                  {/* Footer Info & Action */}
                  <div className="pt-6 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono text-[11px] font-medium">
                      {group.practices.length} practice areas
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#9A7B2C] font-bold tracking-wider uppercase text-[11px] group-hover:translate-x-1 transition-transform">
                      {isExpanded ? "Collapse ▲" : "Explore →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. INTERACTIVE EXPANSION PANELS */}
          <AnimatePresence mode="wait">
            {expandedCategoryId && (
              <motion.div
                key={expandedCategoryId}
                id={`panel-${expandedCategoryId}`}
                role="region"
                aria-label="Practice Areas Detail"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden bg-[#F4F1EA] border border-[#9A7B2C]/30 rounded-xs p-6 sm:p-8 mt-4 shadow-lg"
              >
                {(() => {
                  const currentGroup = PRACTICE_GROUPS.find((g) => g.id === expandedCategoryId);
                  if (!currentGroup) return null;

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-neutral-300/80 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-[#9A7B2C]">
                            {currentGroup.number}
                          </span>
                          <h4 className="text-xl sm:text-2xl font-semibold text-slate-900 font-serif">
                            {currentGroup.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => setExpandedCategoryId(null)}
                          className="text-slate-500 hover:text-slate-900 p-1 transition-colors text-xs font-mono"
                          title="Close Panel"
                        >
                          [Close Panel ✕]
                        </button>
                      </div>

                      <p className="text-slate-700 text-sm max-w-4xl leading-relaxed">
                        {currentGroup.description} Select an individual practice area below to view specialized legal services and client coverage:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                        {currentGroup.practices.map((practice) => (
                          <div
                            key={practice.id}
                            onClick={() => handleOpenPracticeDetail(practice, currentGroup.id)}
                            tabIndex={0}
                            role="button"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleOpenPracticeDetail(practice, currentGroup.id);
                              }
                            }}
                            className="bg-white hover:bg-slate-50 border border-neutral-200/90 hover:border-[#9A7B2C]/60 p-5 rounded-xs transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md"
                          >
                            <div className="space-y-2">
                              <h5 className="text-sm font-semibold text-slate-900 group-hover:text-[#9A7B2C] transition-colors leading-snug font-serif">
                                {practice.title}
                              </h5>
                              <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                                {practice.shortOverview}
                              </p>
                            </div>

                            <div className="pt-4 mt-3 flex items-center justify-between text-[11px] text-[#9A7B2C] font-semibold border-t border-neutral-100">
                              <span>View Services & Coverage</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. PRACTICE AREA DETAIL MODAL */}
        <AnimatePresence>
          {activePractice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-neutral-200 max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-xs p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6 relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActivePractice(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-2 transition-colors focus:outline-none"
                  aria-label="Close practice detail"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="space-y-2 border-b border-neutral-200 pb-4">
                  <span className="text-[11px] font-mono font-bold text-[#9A7B2C] uppercase tracking-widest">
                    PRACTICE AREA DETAIL
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-serif">
                    {activePractice.title}
                  </h3>
                </div>

                {/* Overview */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    OVERVIEW
                  </h4>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {activePractice.shortOverview}
                  </p>
                </div>

                {/* Services */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    CORE LEGAL SERVICES
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activePractice.services.map((service, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-[#9A7B2C] shrink-0 mt-0.5" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Who We Help */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    WHO WE HELP
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activePractice.whoWeHelp.map((client, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-xs font-medium"
                      >
                        <UserCheck className="w-3 h-3 text-[#9A7B2C]" />
                        <span>{client}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => setActivePractice(null)}
                    className="text-slate-500 hover:text-slate-800 text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    ← Return to Categories
                  </button>

                  <button
                    onClick={() => {
                      const title = activePractice.title;
                      setActivePractice(null);
                      handleRequestConsultation(title);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <PhoneCall className="w-4 h-4 text-[#9A7B2C]" /> Discuss Your Matter →
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 14. FINAL SECTION CTA */}
        <div className="bg-white border border-neutral-200 p-8 sm:p-12 rounded-xs text-center max-w-4xl mx-auto space-y-6 shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-serif">
            Have a legal matter that requires attention?
          </h3>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Tell us about your matter. We'll help you understand your options and determine the appropriate next step.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleRequestConsultation("Firm Legal Evaluation")}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0A192F] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-sm transition-all shadow-md cursor-pointer"
            >
              Discuss Your Matter →
            </button>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 border border-neutral-300 hover:border-slate-800 text-slate-800 hover:text-black font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-sm transition-all cursor-pointer bg-slate-50 hover:bg-slate-100"
            >
              Contact the Firm
            </Link>
          </div>
        </div>
      </div>

      {/* CONSULTATION REQUEST MODAL */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white border border-neutral-200 max-w-lg w-full p-6 sm:p-8 rounded-xs shadow-2xl relative text-slate-900 space-y-4">
            <button
              onClick={() => setShowConsultModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-slate-900 font-serif">
              Request Legal Evaluation
            </h3>
            {consultationSubject && (
              <p className="text-xs text-[#9A7B2C] font-mono uppercase tracking-wider">
                Area: {consultationSubject}
              </p>
            )}
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Connect directly with our senior managing partners and counsel team for confidential preliminary guidance.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Thank you. Your consultation request regarding "${consultationSubject || "General Legal Matter"}" has been transmitted to LexVanguard Chambers.`);
                setShowConsultModal(false);
              }}
              className="space-y-4 pt-2"
            >
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-slate-50 border border-neutral-200 focus:border-[#9A7B2C] px-3.5 py-2.5 text-xs text-slate-900 rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Email / Phone</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. client@domain.com or +254..."
                  className="w-full bg-slate-50 border border-neutral-200 focus:border-[#9A7B2C] px-3.5 py-2.5 text-xs text-slate-900 rounded-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Brief Description of Matter</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide a concise summary of your legal inquiry..."
                  className="w-full bg-slate-50 border border-neutral-200 focus:border-[#9A7B2C] px-3.5 py-2.5 text-xs text-slate-900 rounded-xs focus:outline-none"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConsultModal(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0A192F] text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 rounded-xs"
                >
                  Submit Inquiry →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
