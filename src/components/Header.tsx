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
    <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between backdrop-blur-md bg-black/90 border-b border-white/10 shadow-2xl transition-all duration-300">
      {/* Brand Logo & Name */}
      <Link href="/" className="flex items-center space-x-3 text-white group cursor-pointer">
        <div className="w-1.5 h-10 bg-[#ffc107] group-hover:bg-yellow-400 transition-colors" />
        <div className="flex flex-col">
          <span className="font-extrabold text-lg sm:text-xl md:text-2xl tracking-wider uppercase font-serif text-white group-hover:text-[#ffc107] transition-colors leading-none">
            LEX VANGUARD
          </span>
          <span className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest font-sans mt-0.5">
            Counsels at Law
          </span>
        </div>
      </Link>

      {/* Right Side: Contact & Navigation */}
      <div className="flex flex-col items-end w-full md:w-auto">
        {/* Contact Info (Top Right) */}
        <div className="flex items-center text-[#ffc107] text-xs sm:text-sm font-bold mb-3 md:mb-4">
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

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-xs sm:text-sm font-semibold">
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

        {/* Mobile Menu Button (Visible only on small screens) */}
        <button
          className="lg:hidden text-white focus:outline-none p-1 absolute top-4 right-4 md:relative md:top-auto md:right-auto"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-6 h-6 text-[#ffc107]" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-black/95 border-b border-[#ffc107]/20 text-white w-full mt-4 p-4 rounded-b-lg">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-left text-xs font-bold uppercase tracking-wider py-2 border-b border-white/10 block hover:text-[#ffc107]"
              >
                {link.label}
              </Link>
            ))}
            {firmUser ? (
              <>
                <Link
                  href={`/office/${firmUser.officeId}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-left text-xs font-bold uppercase tracking-wider text-[#ffc107] py-2 border-b border-white/10 block"
                >
                  My Office ({firmUser.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-left text-xs font-bold uppercase tracking-wider text-red-400 py-2 border-b border-white/10 w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-left text-xs font-bold uppercase tracking-wider text-[#ffc107] py-2 border-b border-white/10 block"
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

