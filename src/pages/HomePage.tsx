import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ChevronDown, Info, Scale, Users, Globe, X, Phone, Mail, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsSection from "@/components/EventsSection";
import PracticeAreasSection from "@/components/PracticeAreasSection";
import SEOHead from "@/components/SEOHead";
import { ORGANIZATIONAL_SCHEMA, SITE_KEYWORDS } from "@/lib/seo-data";
import { loadProfile, handleProfileImageError } from "@/lib/profile-store";
import { FirestoreMember, subscribeFirestoreMembers } from "@/lib/users";
import { resolveProfileImage } from "@/lib/profile-images";

const PHILOSOPHY = [
  {
    icon: <Scale className="w-10 h-10 text-yellow-500 mx-auto" />,
    title: "A Vision for Lasting Change",
    short: "LexVanguard stands at the forefront of modern advocacy, driven by a relentless commitment to systemic change.",
    full: "LexVanguard stands at the forefront of modern advocacy, driven by a relentless commitment to systemic change. We don't just react to the legal landscape — we actively reshape it to ensure a more equitable future. By combining strategic foresight with a passion for justice, the firm serves as a powerful engine for progress, turning ambitious ideals into tangible societal shifts. Our ambition is to scale the heights of international legal education, standing shoulder to shoulder with the finest law firms and institutions globally."
  },
  {
    icon: <Users className="w-10 h-10 text-yellow-500 mx-auto" />,
    title: "Inclusivity & Teamwork",
    short: "LexVanguard operates on the belief that the pursuit of justice is not the exclusive domain of the privileged few.",
    full: "LexVanguard operates on the belief that the pursuit of justice is not the exclusive domain of the privileged few, but a calling that requires only spirit and tenacity. The doors of LexVanguard are open to all who possess the visceral urge to see justice persevere. The firm's pillars — co-working, professionalism, friendship, respect, and teamwork — elevate the group from a simple club to a professional entity. Every member is acknowledged and respected as intrinsically valuable to the whole."
  },
  {
    icon: <Globe className="w-10 h-10 text-yellow-500 mx-auto" />,
    title: "Open Doors, Open Solutions",
    short: "High-level advocacy should be available to everyone. LexVanguard is an accessible, always-on resource for the community.",
    full: "At the heart of our mission is the belief that high-level advocacy should be available to everyone, regardless of background or circumstance. LexVanguard prides itself on being an accessible, 'always-on' resource for the community. We bridge the gap between complex legal structures and the people who need them most, ensuring that our doors remain open and our experts remain ready to serve whenever change is needed — from legal research and litigation, to mooting, negotiation, and client advisory."
  }
];

const SLIDE_IMAGES = [
  "https://i.ibb.co/3Yf3BzVB/Whats-App-Image-2026-08-11-at-14-37-59.jpg",
  "https://i.ibb.co/k2tP1823/Whats-App-Image-2026-08-11-at-14-37-58.jpg",
  "https://i.ibb.co/m524x61g/Whats-App-Image-2026-08-11-at-14-37-57-1.jpg",
  "https://i.ibb.co/C3vgF6X4/Whats-App-Image-2026-08-11-at-14-37-57.jpg",
  "https://i.ibb.co/ccjKrf8Q/Whats-App-Image-2026-08-11-at-14-37-56.jpg"
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [members, setMembers] = useState<FirestoreMember[]>([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  useEffect(() => {
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

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-black text-white font-sans">
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
      <div className="relative min-h-screen w-full max-w-full flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-black">
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
            transform: scale(1.05);
          }
          .slide.active {
            opacity: 1;
            transform: scale(1);
          }
          .slide-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.85) 100%);
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
        <main className="flex-grow flex items-center justify-center relative z-10 w-full px-4 pointer-events-none min-h-[60vh]">
          {/* Central text removed as background images provide visual focus */}
        </main>

        {/* Bottom Controls Area */}
        <footer className="absolute bottom-0 left-0 w-full p-6 md:px-12 flex justify-between items-end z-20">
          {/* Left info button */}
          <button
            onClick={() => setInfoModalOpen(true)}
            className="border border-[#ffc107] text-[#ffc107] w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-[#ffc107] hover:text-black transition-all focus:outline-none"
            title="Firm Details"
            aria-label="Firm Details"
          >
            <Info className="w-5 h-5 italic" />
          </button>

          {/* Center Explore Button */}
          <div
            onClick={() => {
              document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center cursor-pointer group pb-2"
          >
            <ChevronDown className="w-4 h-4 text-[#ffc107] mb-2 group-hover:translate-y-1 transition-transform" />
            <span className="text-white text-xs font-bold tracking-widest uppercase group-hover:text-[#ffc107] transition-colors">
              Explore
            </span>
          </div>

          {/* Right Pagination / Slider Controls */}
          <div className="flex items-center space-x-4 text-[#ffc107] font-bold text-sm">
            <button
              onClick={prev}
              className="hover:text-white transition-colors focus:outline-none p-2 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
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
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>

      {/* Info Modal */}
      {infoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-neutral-900 border border-[#ffc107]/40 max-w-lg w-full p-6 sm:p-8 rounded-lg shadow-2xl relative text-white">
            <button
              onClick={() => setInfoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 bg-[#ffc107] h-8" />
              <div>
                <h3 className="text-xl font-extrabold tracking-wider text-white">LEXVANGUARD ADVOCATES LLP</h3>
                <p className="text-xs text-[#ffc107] uppercase tracking-widest font-semibold">Counsels at Law</p>
              </div>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
              LexVanguard is Mount Kenya University Parklands Law Campus's premier student-led law firm and moot court powerhouse, established to cultivate elite legal talent, systemic advocacy, and scholarly legal research.
            </p>
            <div className="space-y-3 text-xs sm:text-sm border-t border-white/10 pt-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-[#ffc107]" />
                <span>+254 116 171 396</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-[#ffc107]" />
                <span>lexvanguardadvocatesllp@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-[#ffc107]" />
                <span>MKU Parklands Law Campus, Nairobi, Kenya</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setInfoModalOpen(false)}
                className="bg-[#ffc107] text-black px-5 py-2 text-xs font-extrabold uppercase tracking-widest hover:bg-yellow-400 transition-colors rounded-sm cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Intro Section */}
      <div id="intro-section" className="py-12 sm:py-20 bg-white w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-black uppercase tracking-wider">Welcome to LexVanguard</h2>
          <div className="h-1 w-12 sm:w-16 bg-yellow-500 mx-auto mb-6 sm:mb-8" />
          <p className="text-gray-700 leading-relaxed sm:leading-loose text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-5xl mx-auto">
            Recognized as one of the most prestigious student-led law firms at Mount Kenya University, LexVanguard's reputation extends across the country. We are not merely a university society — we are a formidable incubator for legal talent, providing hands-on experience that bridges the gap between academic theory and real-world legal practice.
          </p>
          <p className="text-gray-600 leading-relaxed sm:leading-loose text-xs sm:text-base mb-8 sm:mb-10 max-w-5xl mx-auto">
            In an environment where students often feel underprepared for the rigors of legal practice, LexVanguard offers a structured, professional space where emerging legal minds are equipped with the skills, networks, and confidence to succeed. Our members engage in rigorous legal research, litigation training, moot court advocacy, legal writing, and client advisory — developing the full spectrum of skills demanded by the modern legal profession.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10">
            {[
              { value: "50+", label: "Members" },
              { value: "10+", label: "Competitions" },
              { value: "5+", label: "Practice Areas" },
              { value: "1", label: "University" }
            ].map((stat, i) => (
              <div key={i} className="border-t-2 sm:border-t-4 border-yellow-500 pt-3 sm:pt-4">
                <span className="block text-2xl sm:text-4xl font-extrabold text-black mb-1">{stat.value}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Areas */}
      <PracticeAreasSection />

      {/* Core Philosophy */}
      <div className="bg-gray-50 py-12 sm:py-20 w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-black uppercase tracking-wider">Our Core Philosophy</h2>
            <div className="h-1 w-12 sm:w-16 bg-yellow-500 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {PHILOSOPHY.map((box, i) => (
              <div key={i} className="bg-white border-t-4 border-black p-6 sm:p-10 text-center hover:shadow-lg transition-all duration-300 text-gray-800 flex flex-col rounded-sm">
                {box.icon}
                <h3 className="uppercase text-base sm:text-lg font-extrabold mt-4 sm:mt-5 mb-3 sm:mb-4 text-black tracking-wide">{box.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-5 leading-relaxed flex-1">
                  {expanded === i ? box.full : box.short}
                </p>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="text-black font-bold uppercase text-[11px] sm:text-xs tracking-widest hover:text-yellow-500 transition-colors bg-transparent border-b-2 border-black hover:border-yellow-500 pb-1 cursor-pointer self-center">
                  {expanded === i ? 'Show Less «' : 'Learn More »'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attorneys / Members Teaser */}
      <div className="py-12 sm:py-20 bg-white w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-2/3 pr-0 md:pr-8 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2 uppercase tracking-wider">Our Members</h2>
            <div className="h-1 w-10 bg-yellow-500 mb-4 sm:mb-6 mx-auto md:mx-0" />
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
              Our team comprises distinguished legal professionals, leading academics, and national moot court champions dedicated to providing strategic, result-oriented representation. Every member is acknowledged and respected as intrinsically valuable to the whole.
            </p>
            <Link href="/attorneys" className="bg-yellow-500 text-black px-6 py-2.5 sm:px-8 sm:py-3 font-extrabold text-xs sm:text-sm uppercase tracking-widest hover:bg-yellow-600 transition-colors inline-block shadow-sm">
              SEE ALL MEMBERS
            </Link>
          </div>
          <div className="w-full md:w-1/3">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-xs sm:max-w-none mx-auto">
              {members.slice(0, 4).map((p, i) => (
                <div key={i} className="relative group overflow-hidden border-2 border-yellow-500 shadow-sm rounded-xs">
                  <img
                    src={resolveProfileImage(p.name, p.profilePhoto || p.image)}
                    alt={p.name}
                    onError={(e) => handleProfileImageError(e, p.name)}
                    className="w-full h-28 sm:h-32 md:h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-1.5 sm:p-2 text-white">
                    <p className="font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-yellow-500 truncate">{p.name}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-300 truncate">{p.title || "Counsel"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <EventsSection />

      {/* Vision Banner */}
      <div className="bg-black border-t-4 border-yellow-500 py-16 px-6 text-center">
        <div className="w-full max-w-5xl mx-auto px-4">
          <p className="text-yellow-500 uppercase tracking-[0.3em] text-xs font-bold mb-4">Our Vision</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">
            To become a world-class pillar of justice
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8">
            This is not merely a slogan but a guiding star for every initiative LexVanguard undertakes. The ambition is to scale the heights of international legal education, standing shoulder to shoulder with the finest law firms and institutions globally — while remaining intrinsically tied to the mission of ensuring equal access to justice.
          </p>
          <Link href="/history" className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black px-8 py-3 font-extrabold text-xs uppercase tracking-widest transition-colors inline-block">
            Our Story
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
