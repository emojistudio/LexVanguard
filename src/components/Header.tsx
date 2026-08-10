import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Phone, Search, Menu, X } from "lucide-react";
import RotatingPhoneDisplay from "@/components/RotatingPhoneDisplay";
import { LexVanguardLogo } from "@/components/LexVanguardLogo";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { firmUser, logout } = useAuth();
  const [, setLocation] = useLocation();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Attorneys", href: "/attorneys" },
    { label: "Events & Symposia", href: "/events" },
    { label: "Practice Areas", href: "/services" },
    { label: "History", href: "/history" },
    { label: "Research Desk", href: "/desk" },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#C9A55C]/20 text-white shadow-xl transition-all duration-300">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 transition-transform group-hover:scale-105">
            <img 
              src="/brand-logo.svg" 
              alt="LexVanguard Emblem" 
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-xl font-serif font-extrabold text-white leading-none tracking-[0.14em] uppercase truncate">
              LEXVANGUARD
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] text-[#C9A55C] uppercase mt-0.5 truncate">
              ADVOCATES LLP
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center text-xs text-gray-300 mr-2">
            <Phone className="text-[#C9A55C] mr-2 w-3.5 h-3.5 shrink-0" />
            <RotatingPhoneDisplay className="text-[#C9A55C] font-semibold text-xs sm:text-sm tracking-wider" />
          </div>

          <nav className="hidden lg:flex space-x-3 xl:space-x-5 items-center">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            ))}

            {firmUser ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-gray-800 shrink-0">
                <Link href={`/office/${firmUser.officeId}`}
                  className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-[#C9A55C] hover:text-yellow-400 bg-neutral-900 border border-[#C9A55C]/40 px-2.5 py-1 rounded-lg transition-all shadow-sm whitespace-nowrap">
                  My Office
                </Link>
                <button onClick={handleLogout}
                  className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login"
                className="text-[11px] xl:text-xs font-bold uppercase tracking-wider text-black bg-[#C9A55C] hover:bg-yellow-400 px-3 py-1 rounded-lg transition-all shadow-sm whitespace-nowrap">
                Portal Login
              </Link>
            )}
          </nav>

          <button className="lg:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-black/95 border-b border-gray-800 text-white w-full">
          <div className="flex flex-col px-6 py-4 space-y-3">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-left text-xs font-bold uppercase tracking-wider py-2 border-b border-white/10 block">
                {link.label}
              </Link>
            ))}
            {firmUser ? (
              <>
                <Link href={`/office/${firmUser.officeId}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-left text-xs font-bold uppercase tracking-wider text-[#C9A55C] py-2 border-b border-white/10 block">
                  My Office ({firmUser.name})
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="text-left text-xs font-bold uppercase tracking-wider text-red-400 py-2 border-b border-white/10 w-full">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-left text-xs font-bold uppercase tracking-wider text-[#C9A55C] py-2 border-b border-white/10 block">
                Portal Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
