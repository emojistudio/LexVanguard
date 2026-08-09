import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { ResearchCoHelper } from "@/components/ResearchCoHelper";
import Header from "@/components/Header";

export default function ResearchCoHelperPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-slate-100">
      <Header />
      <div className="flex-1 pt-24 pb-8 px-4 sm:px-6 max-w-7xl mx-auto w-full flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/office" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-colors bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Counsel Office
          </Link>
        </div>
        <div className="flex-1 bg-white text-slate-800 rounded-2xl overflow-hidden shadow-2xl min-h-[700px] flex flex-col">
          <ResearchCoHelper />
        </div>
      </div>
    </div>
  );
}
