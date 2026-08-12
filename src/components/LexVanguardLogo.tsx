import React from "react";
import logoImg from "../images/logo/logo.png";

interface LexVanguardLogoProps {
  variant?: "light" | "dark" | "cream";
  size?: "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
}

export const LexVanguardLogo: React.FC<LexVanguardLogoProps> = ({
  variant = "light",
  size = "md",
  className = "",
  showSubtitle = true
}) => {
  const isLight = variant === "light";
  const textColor = isLight ? "text-white" : "text-[#0A1F44]";
  const subtitleColor = isLight ? "text-stone-300" : "text-[#0A1F44]/80";

  const iconSizes = {
    sm: "w-20 h-20",
    md: "w-32 h-32 md:w-40 md:h-40",
    lg: "w-48 h-48 md:w-64 md:h-64"
  };

  const titleSizes = {
    sm: "text-lg tracking-wider",
    md: "text-2xl md:text-3xl tracking-[0.18em]",
    lg: "text-4xl md:text-5xl tracking-[0.2em]"
  };

  const subtitleSizes = {
    sm: "text-[9px] tracking-[0.25em]",
    md: "text-[11px] md:text-[12px] tracking-[0.3em]",
    lg: "text-[13px] md:text-[14px] tracking-[0.35em]"
  };

  return (
    <div className={`flex flex-col items-center text-center font-sans ${className}`}>
      {/* OFFICIAL BRAND LOGO PNG */}
      <div className={`relative flex items-center justify-center mb-2 transition-transform hover:scale-105 ${iconSizes[size]}`}>
        <img 
          src={logoImg} 
          alt="LexVanguard Advocates LLP Logo" 
          className={`w-full h-full object-contain ${isLight ? "brightness-0 invert" : ""}`}
        />
      </div>

      {/* BRAND NAME */}
      <h1 className={`font-serif font-extrabold uppercase leading-none ${textColor} ${titleSizes[size]}`}>
        LexVanguard
      </h1>

      {/* SUBTITLE */}
      {showSubtitle && (
        <span className={`font-semibold uppercase mt-1.5 ${subtitleColor} ${subtitleSizes[size]}`}>
          Advocates LLP
        </span>
      )}
    </div>
  );
};
