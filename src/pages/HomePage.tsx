import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, ChevronDown, Scale, Users, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsSection from "@/components/EventsSection";
import SEOHead from "@/components/SEOHead";
import { ORGANIZATIONAL_SCHEMA, SITE_KEYWORDS } from "@/lib/seo-data";
import { loadProfile, handleProfileImageError } from "@/lib/profile-store";
import { subscribeFirestoreMembers } from "@/lib/users";
import { makeAvatarSvg } from "@/lib/avatar";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=60",
    fallback: "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=1000&q=60",
    lines: ["MERGING A", "MODERN MINDSET", "WITH THE PRACTICES WE", "VALUE"],
    gold: [true, true, false, false]
  },
  {
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=60",
    fallback: "https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&w=1000&q=60",
    lines: ["PIONEERING", "LEGAL RESEARCH", "AND ELITE APPELLATE", "ADVOCACY"],
    gold: [true, true, false, false]
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=60",
    fallback: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=60",
    lines: ["ENTERPRISE-GRADE", "LEGAL COUNSEL", "FOR TOMORROW'S", "CHALLENGES"],
    gold: [true, true, false, false]
  }
];

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

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [profiles, setProfiles] = useState(() => ({
    prince: loadProfile("Prince Micah"),
    kelvin: loadProfile("Kelvin Musya"),
    donel: loadProfile("Donel Aganyo"),
    linet: loadProfile("Linet Njeri")
  }));

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setProfiles({
        prince: loadProfile("Prince Micah"),
        kelvin: loadProfile("Kelvin Musya"),
        donel: loadProfile("Donel Aganyo"),
        linet: loadProfile("Linet Njeri")
      });
    };

    const unsubscribe = subscribeFirestoreMembers(() => {
      handleUpdate();
    });

    window.addEventListener("lexvanguard_profile_updated", handleUpdate);
    return () => {
      unsubscribe();
      window.removeEventListener("lexvanguard_profile_updated", handleUpdate);
    };
  }, []);

  const prev = () => setSlide(s => s === 0 ? SLIDES.length - 1 : s - 1);
  const next = () => setSlide(s => (s + 1) % SLIDES.length);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-black">
      <SEOHead
        title="Premier Student Law Firm & Mooting Powerhouse"
        description="Official homepage of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Founded by Prince Micah, Kelvin Musya, and Donel Aganyo. Championing youth in law, moot court excellence, and legal research."
        keywords={SITE_KEYWORDS}
        url="https://lexvanguard.xyz/"
        jsonLd={ORGANIZATIONAL_SCHEMA}
      />
      <Header />

      {/* Hero Slider */}
      <div className="relative h-[60vh] sm:h-[85vh] md:h-screen w-full max-w-full flex items-center overflow-hidden">
        {SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src={s.image}
              onError={(e) => { (e.target as HTMLImageElement).src = s.fallback; }}
              alt={`Slide ${i + 1}`}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/90" />
            <div className="relative z-10 w-full h-full px-4 sm:px-10 lg:px-16 pt-24 sm:pt-32 pb-16 sm:pb-24 flex items-center justify-end">
              <div className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] border-l-[3px] sm:border-l-[4px] md:border-l-[6px] border-yellow-500 pl-3 sm:pl-6 md:pl-8 lg:pr-20">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] md:leading-[1.1] tracking-tight">
                  {s.lines.map((line, j) => (
                    <span key={j} className={`block ${s.gold[j] ? 'text-yellow-500' : 'text-white'}`}>{line}</span>
                  ))}
                </h1>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 sm:bottom-10 left-0 w-full px-4 sm:px-6 md:px-10 z-20 flex justify-between items-end">
          <button className="border-2 border-yellow-500 text-white w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-colors shrink-0">
            <span className="font-bold text-lg sm:text-xl italic">i</span>
          </button>
          <button className="absolute left-1/2 transform -translate-x-1/2 bottom-0 flex items-center bg-black/50 border border-white/10 hover:border-white/30 px-4 py-2 sm:px-6 sm:py-3 text-white font-bold text-xs sm:text-sm tracking-widest transition-all rounded-xs shrink-0"
            onClick={() => { document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 mr-2 sm:mr-3" /> EXPLORE
          </button>
          <div className="hidden md:flex items-center text-white space-x-6 text-sm font-bold tracking-widest">
            <button onClick={prev} className="cursor-pointer hover:text-yellow-500 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">{String(slide + 1).padStart(2, '0')}</span>
              <span className="text-gray-400">/</span>
              <span className="text-white">{String(SLIDES.length).padStart(2, '0')}</span>
            </div>
            <button onClick={next} className="cursor-pointer hover:text-yellow-500 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

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

      {/* What We Do */}
      <div className="py-12 sm:py-20 bg-black text-white w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white uppercase tracking-wider">What We Do</h2>
            <div className="h-1 w-12 sm:w-16 bg-yellow-500 mx-auto mb-4 sm:mb-6" />
            <p className="text-gray-400 max-w-3xl mx-auto text-xs sm:text-base leading-relaxed">
              LexVanguard moves beyond the textbook to provide hands-on experience across our core pillars of legal excellence.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: "Research", desc: "Navigate complex statutes, case law, and legal instruments with AI grounding and eLegal integration.", mobileShow: true },
              { title: "Mootcourts", desc: "Hone trial advocacy, oral argument, and court procedures through competitive simulated hearings.", mobileShow: true },
              { title: "ICJ & Public Law", desc: "Analyze international court precedents, treaty obligations, and public international law frameworks.", mobileShow: true },
              { title: "ADR", desc: "Master commercial arbitration, mediation, and dispute settlement strategy for complex disputes.", mobileShow: true },
              { title: "Legal Writing & Drafting", desc: "Craft airtight contracts, persuasive appellate briefs, and authoritative legal opinions.", mobileShow: false },
              { title: "Client Advisory & Corporate Strategy", desc: "Develop advisory protocols and strategic risk management solutions for corporate entities.", mobileShow: false }
            ].map((item, i) => (
              <div
                key={i}
                className={`border border-white/10 p-5 sm:p-8 hover:border-yellow-500 hover:bg-white/5 transition-all duration-300 rounded-sm ${
                  !item.mobileShow ? 'hidden md:block' : 'block'
                }`}
              >
                <div className="w-6 sm:w-8 h-1 bg-yellow-500 mb-3 sm:mb-5" />
                <h3 className="font-extrabold text-white uppercase tracking-wider text-xs sm:text-sm mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
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
              {[profiles.prince, profiles.kelvin, profiles.donel, profiles.linet].map((p, i) => (
                <div key={i} className="relative group overflow-hidden border-2 border-yellow-500 shadow-sm rounded-xs">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(e) => handleProfileImageError(e, p.name)}
                    className="w-full h-28 sm:h-32 md:h-36 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-1.5 sm:p-2 text-white">
                    <p className="font-extrabold text-[10px] sm:text-xs uppercase tracking-wider text-yellow-500 truncate">{p.name}</p>
                    <p className="text-[9px] sm:text-[10px] text-gray-300 truncate">{p.title}</p>
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
