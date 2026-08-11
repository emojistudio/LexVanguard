import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Phone, Menu, X, Info } from "lucide-react";
import RotatingPhoneDisplay from "@/components/RotatingPhoneDisplay";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { firmUser, logout } = useAuth();
  const [, setLocation] = useLocation();

  const navLinks = [
    { label: "Our Firm", href: "/" },
    { label: "Attorneys", href: "/attorneys" },
    { label: "Practice Areas", href: "/services" },
    { label: "History", href: "/history" },
    { label: "News and Events", href: "/events" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
        
        {/* Brand Logo & Name (Desktop always visible, Mobile hidden when dropdown is open) */}
        <Link 
          href="/" 
          className={`items-center space-x-3 text-white group cursor-pointer ${mobileOpen ? 'hidden lg:flex' : 'flex'}`}
        >
          <div className="w-1.5 h-9 sm:h-10 bg-[#ffc107] group-hover:bg-yellow-400 transition-colors shrink-0" />
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-xl md:text-2xl tracking-wider uppercase font-serif text-white group-hover:text-[#ffc107] transition-colors leading-none">
              LEXVANGUARD
            </span>
            <span className="text-[9px] sm:text-xs text-gray-400 uppercase tracking-widest font-sans mt-0.5">
              Counsels at Law
            </span>
          </div>
        </Link>

        {/* Desktop Navigation & Contact Info (Visible on Desktop LG screens) */}
        <div className="hidden lg:flex flex-col items-end">
          <div className="flex items-center text-[#ffc107] text-xs sm:text-sm font-bold mb-2">
            <Phone className="w-3.5 h-3.5 mr-2 shrink-0 text-[#ffc107]" />
            <RotatingPhoneDisplay className="hover:text-white transition-colors tracking-wider text-[#ffc107]" />
            <Link
              href="/contact"
              className="ml-3 sm:ml-4 border border-white/60 hover:border-[#ffc107] w-5 h-5 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-colors"
              title="Contact Us"
            >
              <Info className="w-3 h-3 text-white hover:text-black" />
            </Link>
          </div>

          <nav className="flex items-center space-x-4 xl:space-x-6 text-xs sm:text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#ffc107] transition-colors whitespace-nowrap font-medium tracking-wide"
              >
                {link.label}
              </Link>
            ))}

            {firmUser ? (
              <div className="flex items-center gap-2 pl-3 border-l border-white/20">
                <Link
                  href={`/office/${firmUser.officeId}`}
                  className="text-[#ffc107] hover:text-white transition-colors font-bold uppercase tracking-wider text-xs whitespace-nowrap"
                >
                  My Office
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 transition-colors font-bold uppercase tracking-wider text-xs whitespace-nowrap bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-[#ffc107] hover:text-white transition-colors font-bold tracking-wide whitespace-nowrap"
              >
                Portal Login
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Compact Header Bar (Visible on Mobile / Tablet < LG) */}
        <div className="flex lg:hidden items-center justify-between w-full">
          {mobileOpen ? (
            /* Active Dropdown Header: Branding is hidden, phone number is aligned with navigation close button */
            <div className="flex items-center justify-between w-full py-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#ffc107]">
                Navigation Menu
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center text-[#ffc107] text-xs font-bold bg-white/10 border border-white/15 px-3 py-1.5 rounded-full">
                  <Phone className="w-3 h-3 mr-1.5 shrink-0 text-[#ffc107]" />
                  <RotatingPhoneDisplay className="tracking-wider text-[#ffc107] text-xs" />
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-[#ffc107] hover:text-white p-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer focus:outline-none"
                  aria-label="Close Navigation Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* Closed Mobile Bar: Logo on Left, Phone + Menu Trigger on Right */
            <div className="flex items-center justify-between w-full">
              <Link href="/" className="flex items-center space-x-2.5 text-white">
                <div className="w-1.5 h-8 bg-[#ffc107] shrink-0" />
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-wider uppercase font-serif text-white leading-none">
                    LEXVANGUARD
                  </span>
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-sans mt-0.5">
                    Counsels at Law
                  </span>
                </div>
              </Link>

              <div className="flex items-center space-x-2.5">
                <div className="flex items-center text-[#ffc107] text-xs font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                  <Phone className="w-3 h-3 mr-1.5 text-[#ffc107] shrink-0" />
                  <RotatingPhoneDisplay className="text-xs text-[#ffc107]" />
                </div>
                <button
                  onClick={() => setMobileOpen(true)}
                  className="text-white hover:text-[#ffc107] p-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer focus:outline-none"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Content */}
      {mobileOpen && (
        <div className="lg:hidden bg-black/98 border-t border-white/10 text-white w-full px-6 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-left text-sm font-bold uppercase tracking-wider py-3 border-b border-white/10 block text-zinc-200 hover:text-[#ffc107] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {firmUser ? (
              <>
                <Link
                  href={`/office/${firmUser.officeId}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-left text-sm font-bold uppercase tracking-wider text-[#ffc107] py-3 border-b border-white/10 block"
                >
                  My Office ({firmUser.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-left text-sm font-bold uppercase tracking-wider text-red-400 py-3 w-full cursor-pointer bg-transparent border-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-left text-sm font-bold uppercase tracking-wider text-[#ffc107] py-3 block hover:text-white transition-colors"
              >
                Portal Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
