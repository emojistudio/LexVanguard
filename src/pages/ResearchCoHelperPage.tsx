import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { ResearchCoHelper } from "@/components/ResearchCoHelper";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { SITE_KEYWORDS } from "@/lib/seo-data";

export default function ResearchCoHelperPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col text-white font-sans">
      <SEOHead
        title="Desk Legal Research Engine | Kenyan Case Law & Statutory Search"
        description="Search-grounded legal research, statutory citation engine, and court document drafting for LexVanguard members."
        keywords={[
          "LexVanguard Desk AI",
          "Kenyan Law Research Engine",
          "MKUPLC Legal Research",
          ...SITE_KEYWORDS
        ]}
        url="https://lexvanguard.xyz/research"
      />
      <Header />
      <div className="flex-1 pt-28 pb-16 px-4 sm:px-6 max-w-[1400px] mx-auto w-full flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/office" className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-white hover:text-yellow-500 transition-colors bg-neutral-900 px-4 py-2 rounded-xs border border-white/10 cursor-pointer hover:border-yellow-500">
            <ArrowLeft className="w-3.5 h-3.5 text-yellow-500" /> Return to Office Suite
          </Link>
        </div>
        <div className="flex-1 bg-neutral-900 text-white rounded-xs overflow-hidden border border-white/10 shadow-2xl min-h-[750px] flex flex-col">
          <ResearchCoHelper />
        </div>
      </div>
    </div>
  );
}
