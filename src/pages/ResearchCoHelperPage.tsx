import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { ResearchCoHelper } from "@/components/ResearchCoHelper";
import Header from "@/components/Header";
import SEOHead from "@/components/SEOHead";
import { SITE_KEYWORDS } from "@/lib/seo-data";

export default function ResearchCoHelperPage() {
  return (
    <div className="min-h-screen w-screen bg-white flex flex-col text-neutral-900 font-sans m-0 p-0 overflow-x-hidden">
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
      <main className="flex-1 w-full pt-20 bg-white flex flex-col">
        <ResearchCoHelper />
      </main>
    </div>
  );
}
