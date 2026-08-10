import React from "react";
import { Scale, Shield } from "lucide-react";

interface BrandedLoaderProps {
  message?: string;
  subtext?: string;
  fullScreen?: boolean;
}

export const BrandedLoader: React.FC<BrandedLoaderProps> = ({
  message = "LEXVANGUARD",
  subtext = "Securing Legal Intelligence & Firm Systems...",
  fullScreen = true,
}) => {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-50 flex flex-col" : "w-full py-16 flex flex-col"
      } items-center justify-center bg-[#070708] text-white select-none overflow-hidden`}
    >
      {/* Background Subtle Radial Glow */}
      <div className="absolute w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Monogram Box */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Pulsing Shield & Balance Scale Monogram */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-2xl border-2 border-amber-500/30 animate-ping opacity-20" />
          <div className="absolute inset-0 rounded-2xl border border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-transparent shadow-[0_0_30px_rgba(245,158,11,0.15)] flex items-center justify-center backdrop-blur-md">
            <Scale className="w-10 h-10 sm:w-12 sm:h-12 text-amber-400 stroke-[1.5] animate-pulse" />
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-[0.3em] font-mono text-white text-center mb-2">
          {message}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-medium tracking-widest text-amber-400/80 uppercase text-center mb-6 max-w-sm">
          {subtext}
        </p>

        {/* Corporate Animated Progress Bar */}
        <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 w-1/3 rounded-full animate-[shimmer_1.5s_infinite_linear] shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        </div>
      </div>
    </div>
  );
};
