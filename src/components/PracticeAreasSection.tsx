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
        return <Scale className="w-6 h-6 text-yellow-500" />;
      case "Briefcase":
        return <Briefcase className="w-6 h-6 text-yellow-500" />;
      case "Home":
        return <HomeIcon className="w-6 h-6 text-yellow-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-6 h-6 text-yellow-500" />;
      case "Compass":
        return <Compass className="w-6 h-6 text-yellow-500" />;
      default:
        return <Scale className="w-6 h-6 text-yellow-500" />;
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
    <section className="py-12 sm:py-20 bg-white w-full max-w-full overflow-x-hidden font-sans border-t border-gray-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">
        
        {/* Section Heading matching Home style */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-black uppercase tracking-wider">
            Practice Areas
          </h2>
          <div className="h-1 w-12 sm:w-16 bg-yellow-500 mx-auto mb-6" />
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg max-w-4xl mx-auto">
            LexVanguard Advocates LLP provides strategic legal counsel, courtroom advocacy, commercial dispute resolution, and scholarly legal research across five core divisions.
          </p>
        </div>

        {/* 5 CATEGORY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {PRACTICE_GROUPS.map((group) => {
            const isExpanded = expandedCategoryId === group.id;
            return (
              <div
                key={group.id}
                onClick={() => handleCategoryClick(group.id)}
                className={`bg-white border-t-4 ${
                  isExpanded ? "border-yellow-500 shadow-xl ring-2 ring-yellow-500/30" : "border-black hover:border-yellow-500 shadow-sm hover:shadow-md"
                } p-6 transition-all duration-300 flex flex-col justify-between rounded-sm cursor-pointer group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                    <span className="font-mono text-xs font-bold text-gray-400">{group.number}</span>
                    <div className="p-1.5 bg-yellow-500/10 rounded-sm">
                      {getCategoryIcon(group.iconName)}
                    </div>
                  </div>

                  <h3 className="uppercase text-base font-extrabold text-black tracking-wide group-hover:text-yellow-600 transition-colors mb-2 leading-snug">
                    {group.title}
                  </h3>

                  <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider block mb-3">
                    {group.practices.length} Specializations
                  </span>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
                    {group.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-black font-extrabold uppercase text-[11px] tracking-widest group-hover:text-yellow-600 transition-colors border-b-2 border-black group-hover:border-yellow-500 pb-0.5">
                    {isExpanded ? "Hide Details ▲" : "Explore Category »"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* EXPANSION PANEL */}
        <AnimatePresence mode="wait">
          {expandedCategoryId && (
            <motion.div
              key={expandedCategoryId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden bg-gray-50 border-2 border-yellow-500 rounded-sm p-6 sm:p-8 mt-8 shadow-md"
            >
              {(() => {
                const currentGroup = PRACTICE_GROUPS.find((g) => g.id === expandedCategoryId);
                if (!currentGroup) return null;

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-yellow-600">
                          {currentGroup.number}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-extrabold text-black uppercase tracking-wide">
                          {currentGroup.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => setExpandedCategoryId(null)}
                        className="text-gray-500 hover:text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        ✕ Close Panel
                      </button>
                    </div>

                    <p className="text-gray-700 text-xs sm:text-sm max-w-4xl leading-relaxed">
                      {currentGroup.description} Select an individual practice area below to view specialized legal services and client coverage:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                      {currentGroup.practices.map((practice) => (
                        <div
                          key={practice.id}
                          onClick={() => handleOpenPracticeDetail(practice, currentGroup.id)}
                          className="bg-white hover:bg-yellow-50/50 border border-gray-200 hover:border-yellow-500 p-5 rounded-sm transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-sm"
                        >
                          <div className="space-y-2">
                            <h5 className="text-sm font-bold text-black uppercase tracking-wide group-hover:text-yellow-600 transition-colors">
                              {practice.title}
                            </h5>
                            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                              {practice.shortOverview}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 flex items-center justify-between text-[11px] text-yellow-600 font-extrabold uppercase tracking-wider border-t border-gray-100">
                            <span>View Services</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

        {/* PRACTICE DETAIL MODAL */}
        <AnimatePresence>
          {activePractice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="bg-white border-2 border-yellow-500 max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-sm p-6 sm:p-8 shadow-2xl text-black space-y-6 relative"
              >
                <button
                  onClick={() => setActivePractice(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black p-1 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="space-y-1 border-b border-gray-200 pb-4">
                  <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">
                    Practice Area Specialization
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-black uppercase tracking-wide">
                    {activePractice.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Overview
                  </h4>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {activePractice.shortOverview}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Core Legal Services
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activePractice.services.map((service, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-800">
                        <CheckCircle2 className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Who We Represent & Advise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activePractice.whoWeHelp.map((client, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 text-gray-800 text-xs rounded-xs font-bold uppercase tracking-wider"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{client}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    onClick={() => setActivePractice(null)}
                    className="text-gray-600 hover:text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    ← Return to Categories
                  </button>

                  <button
                    onClick={() => {
                      const title = activePractice.title;
                      setActivePractice(null);
                      handleRequestConsultation(title);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold text-xs uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <PhoneCall className="w-4 h-4 text-black" /> Request Consultation →
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CONSULTATION REQUEST MODAL */}
        {showConsultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white border-2 border-yellow-500 max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-2xl relative text-black space-y-4">
              <button
                onClick={() => setShowConsultModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-extrabold text-black uppercase tracking-wide">
                Request Case Evaluation
              </h3>
              {consultationSubject && (
                <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider">
                  Subject: {consultationSubject}
                </p>
              )}
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Connect directly with our senior managing partners and counsel team for confidential legal guidance.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Thank you. Your inquiry regarding "${consultationSubject || "General Legal Matter"}" has been transmitted to LexVanguard Chambers.`);
                  setShowConsultModal(false);
                }}
                className="space-y-4 pt-2"
              >
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Adv. Jane Doe"
                    className="w-full bg-gray-50 border border-gray-300 focus:border-black px-3.5 py-2.5 text-xs text-black rounded-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Email / Phone</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. client@domain.com or +254..."
                    className="w-full bg-gray-50 border border-gray-300 focus:border-black px-3.5 py-2.5 text-xs text-black rounded-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1">Brief Description of Matter</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide a concise summary of your legal inquiry..."
                    className="w-full bg-gray-50 border border-gray-300 focus:border-black px-3.5 py-2.5 text-xs text-black rounded-xs focus:outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowConsultModal(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-sm cursor-pointer"
                  >
                    Submit Evaluation Request →
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
