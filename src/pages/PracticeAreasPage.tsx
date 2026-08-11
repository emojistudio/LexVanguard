import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import PracticeAreasSection from "@/components/PracticeAreasSection";
import { useRoute } from "wouter";

export default function PracticeAreasPage() {
  const [matchServices, paramsServices] = useRoute<{ category?: string }>("/services/:category");
  const [matchPractice, paramsPractice] = useRoute<{ category?: string }>("/practice-areas/:category");

  const initialCategoryId = (matchServices && paramsServices?.category) || (matchPractice && paramsPractice?.category) || undefined;

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-slate-900 font-sans flex flex-col justify-between">
      <SEOHead
        title="Practice Areas — Legal Expertise for Complex Matters"
        description="Comprehensive legal representation and advisory across Dispute Resolution & Litigation, Corporate & Financial Law, Property & Family, Constitutional & Public Law, and Regulatory & Emerging Law."
        url="https://lexvanguard.xyz/practice-areas"
      />

      {/* Header */}
      <Header />

      {/* Top Padding Spacer for Fixed Header */}
      <div className="pt-24 sm:pt-28" />

      {/* Main Practice Areas Content Component */}
      <main className="flex-grow w-full">
        <PracticeAreasSection initialCategoryId={initialCategoryId} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
