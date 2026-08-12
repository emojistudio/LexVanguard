import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ChevronDown, Info, Scale, Users, Globe, X, Phone, Mail, MapPin, UserPlus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsSection from "@/components/EventsSection";
import SEOHead from "@/components/SEOHead";
import { ORGANIZATIONAL_SCHEMA, SITE_KEYWORDS } from "@/lib/seo-data";
import { handleProfileImageError } from "@/lib/profile-store";
import { FirestoreMember, subscribeFirestoreMembers, getMemberRank } from "@/lib/users";
import { resolveProfileImage } from "@/lib/profile-images";
import { AskToJoinModal } from "@/components/AskToJoinModal";

// Load hero images reliably across development and production build
const heroImageModules = import.meta.glob<string>(
  '../images/hero/*.{png,jpg,jpeg,webp,avif,svg,PNG,JPG,JPEG,WEBP,AVIF,SVG}',
  { eager: true, import: 'default' }
);

const DYNAMIC_SLIDE_IMAGES: string[] = Object.keys(heroImageModules)
  .sort()
  .map((path) => heroImageModules[path]);

const PUBLIC_HERO_IMAGES = [
  "/images/hero/hero1.jpeg",
  "/images/hero/hero2.jpeg",
  "/images/hero/hero3.jpeg",
  "/images/hero/hero4.jpeg",
  "/images/hero/hero5.jpeg",
  "/images/hero/hero6.jpeg",
];

const SLIDE_IMAGES = PUBLIC_HERO_IMAGES.length > 0 
  ? PUBLIC_HERO_IMAGES 
  : (DYNAMIC_SLIDE_IMAGES.length > 0 ? DYNAMIC_SLIDE_IMAGES : ["/logo.png"]);

const PHILOSOPHY = [
  {
    icon: <Scale className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-500 mx-auto" aria-hidden="true" />,
    title: "A Vision for Lasting Change",
    short: "LexVanguard stands at the forefront of modern advocacy, driven by a relentless commitment to systemic change.",
    full: "LexVanguard stands at the forefront of modern advocacy, driven by a relentless commitment to systemic change. We don't just react to the legal landscape — we actively reshape it to ensure a more equitable future. By combining strategic foresight with a passion for justice, the firm serves as a powerful engine for progress, turning ambitious ideals into tangible societal shifts. Our ambition is to scale the heights of international legal education, standing shoulder to shoulder with the finest law firms and institutions globally."
  },
  {
    icon: <Users className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-500 mx-auto" aria-hidden="true" />,
    title: "Inclusivity & Teamwork",
    short: "LexVanguard operates on the belief that the pursuit of justice is not the exclusive domain of the privileged few.",
    full: "LexVanguard operates on the belief that the pursuit of justice is not the exclusive domain of the privileged few, but a calling that requires only spirit and tenacity. The doors of LexVanguard are open to all who possess the visceral urge to see justice persevere. The firm's pillars — co-working, professionalism, friendship, respect, and teamwork — elevate the group from a simple club to a professional entity. Every member is acknowledged and respected as intrinsically valuable to the whole."
  },
  {
    icon: <Globe className="w-10 h-10 lg:w-12 lg:h-12 text-yellow-500 mx-auto" aria-hidden="true" />,
    title: "Open Doors, Open Solutions",
    short: "High-level advocacy should be available to everyone. LexVanguard is an accessible, always-on resource for the community.",
    full: "At the heart of our mission is the belief that high-level advocacy should be available to everyone, regardless of background or circumstance. LexVanguard prides itself on being an accessible, 'always-on' resource for the community. We bridge the gap between complex legal structures and the people who need them most, ensuring that our doors remain open and our experts remain ready to serve whenever change is needed — from legal research and litigation, to mooting, negotiation, and client advisory."
  }
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [askToJoinOpen, setAskToJoinOpen] = useState(false);
  const [showFAB, setShowFAB] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowFAB(true);
      } else {
        setShowFAB(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preload slide images in browser cache to eliminate lag/flicker during slide transitions
  useEffect(() => {
    SLIDE_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (SLIDE_IMAGES.length <= 1) return;
    const timer = setInterval(() => setSlide(s => (s + 1) % SLIDE_IMAGES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeFirestoreMembers((updated) => {
      setMembers(updated);
    });
    return () => unsubscribe();
  }, []);

  const prev = () => setSlide(s => s === 0 ? SLIDE_IMAGES.length - 1 : s - 1);
  const next = () => setSlide(s => (s + 1) % SLIDE_IMAGES.length);

  // Dynamic top 4 superior profiles sorted by roleLevel / rank from highest down
  const teaserMembers = [...members]
    .sort((a: any, b: any) => {
      const levelA = typeof a.roleLevel === "number" ? a.roleLevel : getMemberRank(a);
      const levelB = typeof b.roleLevel === "number" ? b.roleLevel : getMemberRank(b);
      return levelB - levelA;
    })
    .slice(0, 4);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-black text-white font-sans selection:bg-yellow-500 selection:text-black">
      <SEOHead
        title="Premier Student Law Firm & Mooting Powerhouse"
        description="Official homepage of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Founded by Prince Micah, Kelvin Musya, and Donel Aganyo. Championing youth in law, moot court excellence, and legal research."
        keywords={SITE_KEYWORDS}
        url="https://lexvanguard.xyz/"
        jsonLd={ORGANIZATIONAL_SCHEMA}
      />

      {/* Top Fixed Header */}
      <Header />

      {/* Hero Container with Slideshow */}
      <section aria-label="Hero Slideshow" className="relative h-[55vh] md:h-[80vh] min-h-[55vh] md:min-h-[80vh] w-full max-w-full flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-black">
        <style>{`
          .slideshow-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
            overflow: hidden;
          }
          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out, transform 1.5s ease-in-out;
            background-size: cover;
            background-position: center;
            transform: scale(1.02) translateZ(0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            will-change: opacity, transform;
            image-rendering: -webkit-optimize-contrast;
          }
          .slide.active {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
          .slide-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(5,5,5,0.25) 0%, rgba(5,5,5,0.75) 100%);
          }
        `}</style>

        {/* Slideshow Background */}
        <div className="slideshow-container">
          {SLIDE_IMAGES.map((src, i) => (
            <div key={i} className={`slide ${i === slide ? 'active' : ''}`} style={{ backgroundImage: `url('${src}')` }}>
              <div className="slide-overlay" />
            </div>
          ))}
        </div>

        {/* Main Content Area / Hero Spacer */}
        <main className="flex-grow flex items-center justify-center relative z-10 w-full px-4 pointer-events-none min-h-[25vh] md:min-h-[45vh]">
        </main>

        {/* Bottom Controls Area */}
        <footer className="absolute bottom-0 left-0 w-full p-6 md:px-12 flex justify-between items-end z-20">
          {/* Left info button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInfoModalOpen(true)}
              className="border border-[#ffc107] text-[#ffc107] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#ffc107] hover:text-black transition-all focus:outline-none"
              title="LexVanguard Advocates LLP Contact Desk"
              aria-label="Firm Contact Desk"
            >
              <Info className="w-5 h-5 italic" />
            </button>
          </div>

          {/* Center Explore Button */}
          <div
            onClick={() => {
              document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center cursor-pointer group pb-2"
            role="button"
            tabIndex={0}
            aria-label="Scroll to introduction section"
          >
            <ChevronDown className="w-4 h-4 text-[#ffc107] mb-2 group-hover:translate-y-1 transition-transform" />
            <span className="text-white text-xs lg:text-sm font-bold tracking-widest uppercase group-hover:text-[#ffc107] transition-colors font-mono">
              Explore
            </span>
          </div>

          {/* Right Pagination / Slider Controls */}
          <div className="flex items-center space-x-4 text-[#ffc107] font-bold text-sm lg:text-base">
            <button
              onClick={prev}
              className="hover:text-white transition-colors focus:outline-none p-2 cursor-pointer"
              aria-label="Previous Slide"
              title="Previous Hero Image"
            >
              <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            <div className="flex items-center font-mono">
              <span>{String(slide + 1).padStart(2, '0')}</span>
              <span className="mx-2 text-white">/</span>
              <span className="text-white">{String(SLIDE_IMAGES.length).padStart(2, '0')}</span>
            </div>
            <button
              onClick={next}
              className="hover:text-white transition-colors focus:outline-none p-2 cursor-pointer"
              aria-label="Next Slide"
              title="Next Hero Image"
            >
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>
        </footer>
      </section>

      {/* Info Modal (Light Theme & Minimalist Contact Desk) */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white/95 backdrop-blur-2xl border border-zinc-200/80 max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative text-zinc-900 overflow-hidden">
            <button
              onClick={() => setInfoModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 transition-colors p-2 rounded-full hover:bg-zinc-100 cursor-pointer"
              aria-label="Close Firm Information Modal"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="border-b border-zinc-100 pb-3 mb-4">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-mono">
                Firm Contact Desk
              </span>
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 font-serif mt-2">LEXVANGUARD ADVOCATES LLP</h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">MKUPLC Law Campus • Nairobi, Kenya</p>
            </div>

            <p className="text-zinc-600 text-xs leading-relaxed mb-4">
              Mount Kenya University Parklands Law Campus premier law firm, cultivating elite legal advocacy, moot court excellence, and appellate research.
            </p>

            <div className="space-y-3 text-xs border-t border-zinc-100 pt-4 font-mono">
              <div className="flex items-start gap-2.5 text-zinc-800">
                <Phone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a href="tel:+254116171396" className="font-bold hover:text-amber-600 transition-colors flex items-center justify-between gap-2">
                    <span>+254 116 171 396</span>
                    <span className="text-[10px] font-medium text-zinc-400 font-sans">Prince Micah</span>
                  </a>
                  <a href="tel:+254708948809" className="font-bold hover:text-amber-600 transition-colors flex items-center justify-between gap-2">
                    <span>+254 708 948 809</span>
                    <span className="text-[10px] font-medium text-zinc-400 font-sans">Kelvin Musya</span>
                  </a>
                  <a href="tel:+254707865597" className="font-bold hover:text-amber-600 transition-colors flex items-center justify-between gap-2">
                    <span>+254 707 865 597</span>
                    <span className="text-[10px] font-medium text-zinc-400 font-sans">Donel Aganyo</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-800 pt-1">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href="mailto:info@lexvanguard.xyz" className="font-bold hover:text-amber-600 transition-colors truncate">info@lexvanguard.xyz</a>
              </div>

              <div className="flex items-center gap-2.5 text-zinc-800 pt-1">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-zinc-600 text-[11px] leading-tight font-sans">Mount Kenya University Parklands Law Campus, Nairobi, Kenya</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setInfoModalOpen(false)}
                className="w-full bg-[#1d1d1f] text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all rounded-xl cursor-pointer shadow-sm font-mono"
              >
                Close Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Philosophy & Overview Section */}
      <section className="py-12 sm:py-20 lg:py-28 bg-white text-black w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-7xl xl:max-w-[92vw] mx-auto px-4 sm:px-10 lg:px-16 text-center">
          <span className="text-yellow-600 uppercase tracking-[0.25em] text-xs lg:text-sm font-bold font-mono block mb-2">
            Institutional Excellence
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-3 uppercase tracking-wider font-serif">
            Welcome to LexVanguard Advocates LLP
          </h2>
          <div className="h-1 w-12 sm:w-16 lg:w-24 bg-yellow-500 mx-auto mb-6 sm:mb-8 lg:mb-12" />
          
          <div className="space-y-6 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto text-gray-700 leading-relaxed sm:leading-loose text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-normal">
            <p>
              Recognized as the premier student-led law firm at <strong className="text-black">Mount Kenya University Parklands Law Campus (MKUPLC)</strong>, LexVanguard's institutional authority extends across Kenya and the wider legal education realm. We are not merely a university society — we are a formidable legal incubator and appellate mooting powerhouse, bridging the critical divide between classroom jurisprudence and real-world advocate practice.
            </p>
            <p className="text-gray-600 text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              Established in <strong className="text-black font-semibold">September 2025</strong> at Mount Kenya University Parklands Law Campus (MKUPLC), LexVanguard provides an elite, structured environment where emerging legal minds master oral advocacy, statutory interpretation, legal technology, AI-assisted legal research, and corporate advisory. Our members engage in rigorous litigation drills, moot court championships, and pro bono community dispatches — developing the exact competencies demanded by top-tier law firms and international judicial institutions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 mt-10 sm:mt-12 lg:mt-16 max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto">
            {[
              { value: "50+", label: "Active Student Counsel", desc: "Dedicated advocates at MKUPLC" },
              { value: "10+", label: "Moot Court Symposia", desc: "National & regional championships" },
              { value: "5+", label: "Core Practice Areas", desc: "Appellate, Corporate, IP & Tech" },
              { value: "1", label: "Unified Law Campus", desc: "Parklands Law Campus, Nairobi" }
            ].map((stat, i) => (
              <div key={i} className="border-t-2 sm:border-t-4 border-yellow-500 pt-3 sm:pt-6">
                <span className="block text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-black mb-1">{stat.value}</span>
                <span className="text-[10px] sm:text-xs lg:text-sm text-black uppercase tracking-widest font-bold block">{stat.label}</span>
                <span className="hidden lg:block text-xs text-gray-500 mt-1 font-medium">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attorneys / Members Teaser */}
      <section className="py-12 sm:py-20 lg:py-28 bg-white w-full max-w-full overflow-x-hidden border-t border-gray-100 text-black" itemScope itemType="http://schema.org/Organization">
        <div className="w-full max-w-7xl xl:max-w-[92vw] mx-auto px-4 sm:px-10 lg:px-16 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <span className="text-yellow-600 uppercase tracking-[0.25em] text-xs lg:text-sm font-bold font-mono block mb-2">
              Chambers & Leadership Directory
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-2 uppercase tracking-wider font-serif">
              Our Members & Counsel
            </h2>
            <div className="h-1 w-10 sm:w-16 lg:w-24 bg-yellow-500 mb-4 sm:mb-6 lg:mb-8 mx-auto lg:mx-0" />
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 lg:mb-10 font-normal">
              LexVanguard is powered by a cadre of distinguished law scholars, legal researchers, and national moot court champions at Mount Kenya University Parklands Law Campus. Structured into specialized practice divisions, executive leadership offices, and peer-accountable research desks, our members maintain an exceptionally disciplined framework for constitutional advocacy, mooting mastery, and professional legal excellence.
            </p>
            <Link
              href="/attorneys"
              title="View LexVanguard Members Directory"
              className="bg-yellow-500 text-black px-6 py-2.5 sm:px-8 sm:py-3.5 lg:px-10 lg:py-4 font-extrabold text-xs sm:text-sm lg:text-base uppercase tracking-widest hover:bg-yellow-600 transition-colors inline-block shadow-sm"
            >
              EXPLORE FULL MEMBERS DIRECTORY
            </Link>
          </div>
          <div className="w-full lg:w-2/5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto">
              {teaserMembers.length > 0 ? (
                teaserMembers.map((p, i) => (
                  <div key={p.uid || i} className="relative group overflow-hidden border-2 border-yellow-500 shadow-sm rounded-xs" itemScope itemType="http://schema.org/Person">
                    <img
                      src={resolveProfileImage(p.name, p.profilePhoto || p.image)}
                      alt={`${p.name} - ${p.title || 'Counsel'} at LexVanguard Advocates LLP, Mount Kenya University Parklands Law Campus (MKUPLC)`}
                      title={`${p.name} | LexVanguard Advocates LLP Member & Counsel`}
                      itemProp="image"
                      loading="lazy"
                      onError={(e) => handleProfileImageError(e, p.name)}
                      className="w-full h-28 sm:h-36 md:h-44 lg:h-52 xl:h-60 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-2 sm:p-3 text-white">
                      <p className="font-extrabold text-[10px] sm:text-xs lg:text-sm uppercase tracking-wider text-yellow-500 truncate" itemProp="name">{p.name}</p>
                      <p className="text-[9px] sm:text-[10px] lg:text-xs text-gray-300 truncate" itemProp="jobTitle">{p.title || p.role || "Counsel"}</p>
                    </div>
                  </div>
                ))
              ) : (
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="relative group overflow-hidden border-2 border-yellow-500/40 bg-neutral-900 shadow-sm rounded-xs flex flex-col justify-end p-3 h-28 sm:h-36 md:h-44 lg:h-52 xl:h-60">
                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-xs mb-auto">
                      LV
                    </div>
                    <div>
                      <p className="font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-yellow-500">Chambers Counsel</p>
                      <p className="text-[9px] text-gray-400">Admitted Member</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* History Teaser (Text-Only Founder & History Cards - No Founder Images) */}
      <section className="py-12 sm:py-20 lg:py-28 bg-black text-white w-full max-w-full overflow-x-hidden border-t-4 border-[#ffc107]">
        <div className="w-[90vw] max-w-7xl xl:max-w-[92vw] mx-auto text-center">
          <span className="text-[#ffc107] uppercase tracking-[0.3em] text-xs lg:text-sm font-bold font-mono block mb-2">
            Origin Story & Institutional Vision
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 text-white uppercase tracking-wider font-serif">
            The History of LexVanguard
          </h2>
          <div className="h-1 w-10 sm:w-16 lg:w-24 bg-[#ffc107] mx-auto mb-6 sm:mb-10 lg:mb-12" />

          {/* Expository Overview Paragraphs for Wide Screens */}
          <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-5xl lg:max-w-6xl mx-auto mb-8 sm:mb-12 font-normal">
            Founded in <strong className="text-yellow-400 font-semibold">September 2025</strong> at Mount Kenya University Parklands Law Campus (MKUPLC), LexVanguard Advocates LLP was established to transform legal education through student-led co-working, peer accountability, and elite moot court preparation. What began as an ambitious idea among law scholars has evolved into a nationally acknowledged student law institution.
          </p>

          {/* Expanded Institutional History Milestone Cards (No Founder Profiles) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12 text-left w-full">
            {[
              {
                badge: "Phase I • September 2025",
                title: "Institutional Genesis",
                desc: "Established at Mount Kenya University Parklands Law Campus (MKUPLC), LexVanguard Advocates LLP was created to bridge academic legal studies with live courtroom practice, rigorous peer accountability, and appellate research."
              },
              {
                badge: "Phase II • Appellate Mastery",
                title: "Moot Court Powerhouse",
                desc: "LexVanguard pioneered structured legal drafting masterclasses, oral advocacy drills, and constitutional law symposia—empowering student counsels to compete and lead in elite national moot court championships."
              },
              {
                badge: "Phase III • Digital Tech",
                title: "Next-Gen Legal Technology",
                desc: "Deploying custom AI legal research tools, eLegal statutory indexes, automated case management, and open-access legal publications to modernize student legal education across East Africa and globally."
              }
            ].map((card, i) => (
              <div
                key={i}
                className="bg-neutral-900/90 border border-neutral-800 hover:border-[#ffc107] p-6 sm:p-8 lg:p-10 flex flex-col justify-between rounded-sm transition-all group"
              >
                <div className="space-y-3 lg:space-y-4">
                  <span className="text-[10px] lg:text-xs font-mono text-yellow-500 font-bold uppercase tracking-widest block">
                    {card.badge}
                  </span>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white uppercase font-serif group-hover:text-[#ffc107] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Link
              href="/history"
              title="Explore complete history of LexVanguard Advocates LLP"
              className="border-2 border-[#ffc107] text-[#ffc107] hover:bg-[#ffc107] hover:text-black px-8 py-3.5 sm:px-10 sm:py-4 lg:px-12 lg:py-4.5 font-extrabold text-xs sm:text-sm lg:text-base uppercase tracking-widest transition-colors inline-block"
            >
              EXPLORE OUR COMPLETE HISTORY & ORIGIN
            </Link>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="bg-gray-50 py-12 sm:py-20 lg:py-28 w-full max-w-full overflow-x-hidden text-black">
        <div className="w-full max-w-7xl xl:max-w-[92vw] mx-auto px-4 sm:px-10 lg:px-16">
          <div className="text-center mb-10 sm:mb-16 lg:mb-20">
            <span className="text-yellow-600 uppercase tracking-[0.25em] text-xs lg:text-sm font-bold font-mono block mb-2">
              Foundational Values & Ethics
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 text-black uppercase tracking-wider font-serif">
              Our Core Philosophy
            </h2>
            <div className="h-1 w-12 sm:w-16 lg:w-24 bg-yellow-500 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {PHILOSOPHY.map((box, i) => (
              <div key={i} className="bg-white border-t-4 border-black p-6 sm:p-10 lg:p-12 text-center hover:shadow-xl transition-all duration-300 text-gray-800 flex flex-col rounded-sm">
                {box.icon}
                <h3 className="uppercase text-base sm:text-lg lg:text-xl xl:text-2xl font-extrabold mt-4 sm:mt-5 mb-3 sm:mb-4 text-black tracking-wide font-serif">{box.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-4 sm:mb-6 leading-relaxed flex-1 font-normal">
                  {expanded === i ? box.full : box.short}
                </p>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="text-black font-bold uppercase text-[11px] sm:text-xs lg:text-sm tracking-widest hover:text-yellow-500 transition-colors bg-transparent border-b-2 border-black hover:border-yellow-500 pb-1 cursor-pointer self-center"
                >
                  {expanded === i ? 'Show Less «' : 'Learn More »'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white w-full max-w-full overflow-x-hidden text-black">
        <div className="w-full max-w-7xl xl:max-w-[92vw] mx-auto px-4 sm:px-10 lg:px-16 text-center">
          <span className="text-yellow-600 uppercase tracking-[0.25em] text-xs lg:text-sm font-bold font-mono block mb-2">
            Legal Expertise & Advisory
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 text-black uppercase tracking-wider font-serif">
            Practice Areas
          </h2>
          <div className="h-1 w-12 sm:w-16 lg:w-24 bg-[#ffc107] mx-auto mb-10 sm:mb-14 lg:mb-20" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16 lg:mb-20 text-left">
            {[
              { title: "Appellate & Dispute Resolution", desc: "Supreme Court litigation, appellate briefs, constitutional petitions, and oral advocacy championships." },
              { title: "Corporate & Commercial Law", desc: "Transaction advisory, company compliance, merger due diligence, and fintech regulatory governance." },
              { title: "Property & Conveyancing", desc: "Real estate conveyancing, asset management, land ownership advisory, and commercial lease drafting." },
              { title: "Constitutional & Administrative Law", desc: "Judicial review applications, fundamental human rights litigation, and public policy advocacy." },
              { title: "IP & Emerging Technology Law", desc: "Trademark registration, digital privacy compliance, AI governance, and software IP protection." }
            ].map((area, i) => (
              <div key={i} className="space-y-2 lg:space-y-3">
                <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-extrabold text-black uppercase tracking-wide font-serif">{area.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed font-normal">{area.desc}</p>
              </div>
            ))}
          </div>

          <div>
            <Link
              href="/practice-areas"
              title="Explore all legal practice areas at LexVanguard Advocates LLP"
              className="bg-[#ffc107] text-black px-8 py-3.5 sm:px-10 sm:py-4 lg:px-12 lg:py-4.5 font-extrabold text-xs sm:text-sm lg:text-base uppercase tracking-widest hover:bg-yellow-400 transition-colors inline-block shadow-xs"
            >
              EXPLORE ALL PRACTICE AREAS
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <EventsSection />

      {/* Vision Banner */}
      <section className="bg-black border-t-4 border-yellow-500 py-16 sm:py-24 lg:py-32 px-6 text-center">
        <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4">
          <p className="text-yellow-500 uppercase tracking-[0.3em] text-xs lg:text-sm font-bold mb-4 font-mono">Our Vision for Global Excellence</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-6 font-serif">
            To Become a World-Class Pillar of Legal Education & Justice
          </h2>
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl xl:text-2xl leading-relaxed mb-8 sm:mb-12 font-normal">
            This is not merely a slogan, but the guiding beacon for every legal dispatch, moot court competition, and scholarly publication produced by LexVanguard Advocates LLP. We aim to scale the heights of international legal education — standing shoulder to shoulder with top-tier law firms and university law faculties across Africa and globally — while remaining fiercely dedicated to equal access to justice.
          </p>
          <Link
            href="/history"
            title="Read the full story of LexVanguard Advocates LLP"
            className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-3.5 sm:px-10 sm:py-4 lg:px-12 lg:py-4.5 font-extrabold text-xs sm:text-sm lg:text-base uppercase tracking-widest transition-colors inline-block"
          >
            OUR FULL INSTITUTIONAL STORY
          </Link>
        </div>
      </section>

      {askToJoinOpen && <AskToJoinModal onClose={() => setAskToJoinOpen(false)} />}

      {/* Animated Floating Action Button (FAB) for "APPLY TO JOIN" */}
      <button
        onClick={() => setAskToJoinOpen(true)}
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 bg-[#ffc107] hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2.5 px-5 py-3.5 rounded-full shadow-2xl border border-yellow-300/60 cursor-pointer transition-all duration-500 font-mono transform hover:scale-105 ${
          showFAB ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-90 pointer-events-none'
        }`}
        title="Apply to Join LexVanguard Advocates LLP"
      >
        <UserPlus className="w-4 h-4 text-black stroke-[2.5]" />
        <span>APPLY TO JOIN</span>
      </button>

      <Footer />
    </div>
  );
}
