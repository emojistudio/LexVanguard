import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { PRACTICE_GROUPS, DetailedPractice } from "@/data/practice-areas-data";
import { ChevronRight, X, CheckCircle2 } from "lucide-react";

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

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(categoryId);
    }
  };

  const handleOpenPracticeDetail = (practice: DetailedPractice) => {
    setActivePractice(practice);
    setConsultationSubject(practice.title);
  };

  return (
    <section className="py-12 sm:py-20 bg-white w-full max-w-full overflow-x-hidden font-sans border-t border-gray-100 text-black">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">
        
        {/* Section Heading Minimal */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-[0.25em] block mb-1">
            Specialized Practice Divisions
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-black uppercase tracking-wider font-serif">
            Practice Areas
          </h2>
          <div className="h-1 w-12 bg-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 leading-relaxed text-xs sm:text-base max-w-3xl mx-auto">
            LexVanguard Advocates LLP provides strategic legal counsel, courtroom advocacy, and commercial dispute resolution across five legal divisions.
          </p>
        </div>

        {/* 5 CATEGORY GRID - CLEAN & MINIMALIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {PRACTICE_GROUPS.map((group) => {
            const isExpanded = expandedCategoryId === group.id;
            return (
              <div
                key={group.id}
                onClick={() => handleCategoryClick(group.id)}
                className={`bg-white border-t-2 ${
                  isExpanded ? "border-yellow-500 bg-gray-50/80" : "border-black hover:border-yellow-500"
                } p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-xs`}
              >
                <div className="space-y-3">
                  <span className="font-mono text-xs font-bold text-yellow-600 block">{group.number}</span>

                  <h3 className="uppercase text-sm font-extrabold text-black tracking-wide group-hover:text-yellow-600 transition-colors leading-snug font-serif">
                    {group.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {group.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-black group-hover:text-yellow-600 transition-colors uppercase tracking-wider">
                  <span>{isExpanded ? "Hide" : "Explore"}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden bg-gray-50 border-t-2 border-yellow-500 p-6 sm:p-8 mt-6 shadow-xs"
            >
              {(() => {
                const currentGroup = PRACTICE_GROUPS.find((g) => g.id === expandedCategoryId);
                if (!currentGroup) return null;

                return (
                  <div className="space-y-6 text-left">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-yellow-600">
                          {currentGroup.number}
                        </span>
                        <h4 className="text-lg sm:text-xl font-bold text-black uppercase font-serif tracking-wide">
                          {currentGroup.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => setExpandedCategoryId(null)}
                        className="text-gray-500 hover:text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentGroup.practices.map((practice) => (
                        <div
                          key={practice.id}
                          onClick={() => handleOpenPracticeDetail(practice)}
                          className="bg-white border border-gray-200 hover:border-black p-4 transition-all duration-150 cursor-pointer group flex flex-col justify-between shadow-xs"
                        >
                          <div className="space-y-1.5">
                            <h5 className="text-xs font-bold text-black uppercase tracking-wider group-hover:text-yellow-600 transition-colors">
                              {practice.title}
                            </h5>
                            <p className="text-gray-600 text-[11px] line-clamp-2 leading-relaxed">
                              {practice.shortOverview}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 flex items-center justify-between text-[10px] text-black font-bold uppercase tracking-wider border-t border-gray-100">
                            <span>Details</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-yellow-600" />
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

        {/* PRACTICE DETAIL MODAL - CLEAN & LIGHTWEIGHT */}
        <AnimatePresence>
          {activePractice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="bg-white border-t-4 border-yellow-500 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-black space-y-6 relative text-left"
              >
                <button
                  onClick={() => setActivePractice(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1 border-b border-gray-200 pb-3">
                  <span className="text-[10px] font-mono font-bold text-yellow-600 uppercase tracking-widest">
                    Practice Specialization
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-black uppercase font-serif tracking-wide">
                    {activePractice.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                    {activePractice.shortOverview}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-black uppercase tracking-wider border-b border-gray-100 pb-1">
                    Services Offered
                  </h4>
                  <div className="space-y-1.5">
                    {activePractice.services.map((service, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setActivePractice(null)}
                    className="text-gray-500 hover:text-black text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      const title = activePractice.title;
                      setActivePractice(null);
                      setConsultationSubject(title);
                      setShowConsultModal(true);
                    }}
                    className="px-6 py-2.5 bg-yellow-500 hover:bg-black hover:text-white text-black font-extrabold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Request Evaluation →
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CONSULTATION REQUEST MODAL */}
        {showConsultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white border-t-4 border-yellow-500 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-black space-y-4 text-left">
              <button
                onClick={() => setShowConsultModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-black uppercase font-serif tracking-wide">
                Case Evaluation Request
              </h3>
              {consultationSubject && (
                <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider">
                  Subject: {consultationSubject}
                </p>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Thank you. Your inquiry regarding "${consultationSubject || "Legal Matter"}" has been transmitted to LexVanguard Chambers.`);
                  setShowConsultModal(false);
                }}
                className="space-y-3 pt-2 text-xs"
              >
                <div>
                  <label className="block font-bold text-black uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Adv. Jane Doe"
                    className="w-full bg-white border border-gray-300 focus:border-black p-2.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black uppercase tracking-wider mb-1">Email or Phone</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. client@domain.com or +254..."
                    className="w-full bg-white border border-gray-300 focus:border-black p-2.5 text-xs text-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-black uppercase tracking-wider mb-1">Case Summary</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly describe your legal inquiry..."
                    className="w-full bg-white border border-gray-300 focus:border-black p-2.5 text-xs text-black focus:outline-none leading-relaxed"
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
                    className="px-6 py-2.5 bg-yellow-500 hover:bg-black hover:text-white text-black font-extrabold text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    SEND
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
