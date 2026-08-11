import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface FounderDetail {
  slug: string;
  name: string;
  role: string;
  subtitle: string;
  image: string;
  summary: string;
  fullBio: string[];
  keyMilestones: string[];
  philosophy: string;
  contributions: string[];
  quote: string;
}

const FOUNDERS_DATA: Record<string, FounderDetail> = {
  prince: {
    slug: "prince",
    name: "Prince Micah",
    role: "Co-Founder | Technology & Innovation Lead",
    subtitle: "Software Engineer & Web Developer | Digital Architect of lexvanguard.xyz",
    image: "/images/profiles/prince.jpeg",
    summary: "Law scholar and software engineer who led the technological architecture and digital web development of the LexVanguard platform (lexvanguard.xyz).",
    fullBio: [
      "Prince Micah is a co-founder of LexVanguard Advocates LLP and a visionary law scholar with an extensive background in software engineering, full-stack web development, and artificial intelligence integration.",
      "Recognizing the critical role of technology in modern legal practice, Prince led the technical planning, architecture, and digital engineering of the LexVanguard online platform (lexvanguard.xyz), establishing the firm's digital infrastructure, public portal, and legal AI research integration.",
      "As a law student at Mount Kenya University Parklands Law Campus, Prince brings an interdisciplinary perspective: bridging the traditional boundaries of legal jurisprudence with modern software technology, digital security, and AI-assisted legal research.",
      "Prince envisions a future where advocates do not merely adapt to technological change, but actively lead it—mastering legal technology, digital evidence, data protection, cybersecurity regulations, and automated research systems.",
      "Within LexVanguard, he directs all digital initiatives, oversees platform security, leads technology workshops, and mentors members on leveraging modern digital tools for legal research and litigation preparation."
    ],
    keyMilestones: [
      "Led the technical development and digital architecture of lexvanguard.xyz",
      "Integrated AI-driven legal research tools and automated document analysis",
      "Established digital security and secure data communication protocols for the firm",
      "Pioneered legal tech workshops for law students at MKU Parklands Law Campus"
    ],
    philosophy: "Legal technology is not a replacement for legal reasoning; it is a force multiplier that allows advocates to analyze, research, and communicate with unprecedented depth and velocity.",
    contributions: [
      "Directed the technological architecture and web development of lexvanguard.xyz",
      "Designed & integrated the eLegal AI research engine and Research Desk",
      "Leads digital infrastructure, cybersecurity, and technological innovation",
      "Coordinates legal technology workshops and digital litigation workflows",
      "Active participant in appellate legal research and moot court advocacy"
    ],
    quote: "The lawyer of tomorrow must master the technology shaping tomorrow's world."
  },
  kelvin: {
    slug: "kelvin",
    name: "Kelvin Musya",
    role: "Co-Founder | Chief Strategist & Organising Director",
    subtitle: "Architect of the Unified Firm Concept | Strategic Execution & Institutional Governance",
    image: "/images/profiles/kelvin.jpeg",
    summary: "Strategic leader and operational anchor who developed the unified-firm organizational framework, turning the vision of LexVanguard into a disciplined institution.",
    fullBio: [
      "Kelvin Musya is a co-founder of LexVanguard Advocates LLP, serving as Chief Strategist and Organising Director. He is widely recognized as the architect of the unified-firm institutional framework.",
      "Kelvin's leadership is defined by strategic planning, organizational governance, discipline, and systematic execution. He excels at taking complex organizational goals and translating them into structured, operational reality.",
      "In September 2025, Kelvin joined forces with Prince Micah and Donel Aganyo to establish LexVanguard, focusing on building an institution structured around co-working, mutual accountability, professional standards, and long-term legal excellence.",
      "He has been instrumental in organizing firm symposia, managing partner structures, driving business development, establishing external partnerships, and maintaining firm discipline.",
      "Kelvin firmly believes that true leadership in law requires building sustainable systems that empower every member to achieve their highest academic and professional potential."
    ],
    keyMilestones: [
      "Conceptualized the unified-firm institutional governance framework",
      "Established partner hierarchy and organizational accountability structures",
      "Coordinated major inter-university legal symposia and firm activities",
      "Forged strategic alliances and professional mentorship networks"
    ],
    philosophy: "Institutions survive on discipline and governance. Strategy converts ambitious vision into structured reality, ensuring every member has a clear path to growth.",
    contributions: [
      "Conceptualized and structured the unified-firm institutional model",
      "Directs overall strategic planning, organizational governance, and execution",
      "Coordinates major firm events, symposia, and inter-university engagements",
      "Fosters member accountability, mentorship, and professional growth",
      "Leads business development and strategic partnerships"
    ],
    quote: "Strategy converts vision into institution; discipline converts ambition into impact."
  },
  donel: {
    slug: "donel",
    name: "Donel Aganyo",
    role: "Co-Founder | Advocacy Partner & Outreach Lead",
    subtitle: "Oral Advocacy Specialist | Member Engagement & Community Building",
    image: "/images/profiles/don.jpeg",
    summary: "Dedicated advocate in training leading member outreach, public speaking, moot court preparation, and student community engagement.",
    fullBio: [
      "Donel Aganyo is a co-founder of LexVanguard Advocates LLP, serving as Advocacy Partner and Member Outreach & Engagement Lead.",
      "A passionate legal scholar and orator, Donel focuses on legal advocacy, public speaking, student community building, and moot court preparation.",
      "Donel played a crucial role in bringing early members into LexVanguard, fostering an inclusive environment where every student feels supported and encouraged to participate in competitive advocacy.",
      "He leads oral advocacy drills, legal debate sessions, and advocacy workshops that prepare members to represent Mount Kenya University Parklands Law Campus in national and regional moot court championships.",
      "Donel's advocacy-first philosophy complements Kelvin's strategic leadership and Prince's technological innovation, completing a balanced, well-rounded founding leadership team."
    ],
    keyMilestones: [
      "Pioneered internal oral advocacy training and moot court preparation sessions",
      "Spearheaded student outreach, growing LexVanguard's active member base",
      "Led community engagement initiatives and pro bono advocacy forums",
      "Mentored junior law students in legal drafting, rhetoric, and argument composition"
    ],
    philosophy: "Advocacy is the soul of the legal profession. It is not merely about arguing to win, but about speaking with truth, logic, and conviction to uphold justice.",
    contributions: [
      "Coordinates member outreach, integration, and community engagement",
      "Leads oral advocacy drills, moot court preparation, and debate forums",
      "Facilitates intellectual legal dispatches and advocacy workshops",
      "Promotes youth-in-law initiatives and pro bono advocacy outreach",
      "Mentors junior counsel in legal writing and public speaking"
    ],
    quote: "Advocacy is the art of giving voice to justice and purpose to legal knowledge."
  }
};

export default function FounderDetailPage() {
  const [match, params] = useRoute<{ slug: string }>("/founders/:slug");
  const slug = params?.slug?.toLowerCase() || "prince";
  const founder = FOUNDERS_DATA[slug] || FOUNDERS_DATA.prince;

  return (
    <div className="w-full bg-white text-black min-h-screen flex flex-col font-sans">
      <SEOHead
        title={`${founder.name} — Detailed Founder Biography | LexVanguard Advocates LLP`}
        description={founder.summary}
        url={`https://lexvanguard.xyz/founders/${founder.slug}`}
      />

      <Header />

      {/* Hero Header */}
      <div className="bg-black text-white pt-28 sm:pt-36 pb-12 px-4 sm:px-8 border-b-4 border-yellow-500">
        <div className="w-[90vw] max-w-[90vw] mx-auto space-y-4">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-xs text-yellow-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to History & Founders Overview
          </Link>

          <div className="pt-2">
            <span className="text-yellow-500 uppercase tracking-[0.3em] text-xs font-bold block font-mono">
              Complete Leadership Biography
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-wide font-serif text-white mt-1">
              {founder.name}
            </h1>
            <p className="text-yellow-500 font-mono text-xs sm:text-sm uppercase font-bold tracking-wider mt-2">
              {founder.role}
            </p>
          </div>
        </div>
      </div>

      <main className="w-[90vw] max-w-[90vw] mx-auto px-2 sm:px-6 py-12 sm:py-16 space-y-12 flex-1 text-left">
        {/* Profile Card & Overview (No heavy borders, Square Image) */}
        <div className="flex flex-col md:flex-row gap-8 items-start bg-gray-50/60 p-6 sm:p-10">
          <img
            src={founder.image}
            alt={founder.name}
            className="w-full md:w-72 h-72 aspect-square object-cover shrink-0"
          />

          <div className="space-y-4 flex-1">
            <h2 className="text-2xl font-bold uppercase font-serif text-black">{founder.name}</h2>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-3">
              {founder.subtitle}
            </p>

            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {founder.summary}
            </p>

            <blockquote className="p-4 bg-white border-l-4 border-black text-xs sm:text-sm font-semibold italic text-black">
              "{founder.quote}"
            </blockquote>
          </div>
        </div>

        {/* Detailed Biography Story */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-black border-b-2 border-black pb-2 font-serif">
            The Full Story & Legal Journey
          </h3>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            {founder.fullBio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Leadership Philosophy */}
        <div className="p-6 bg-black text-white space-y-2 border-l-4 border-yellow-500">
          <h4 className="text-xs font-mono font-bold text-yellow-500 uppercase tracking-widest">
            Leadership Philosophy
          </h4>
          <p className="text-sm sm:text-base italic leading-relaxed text-gray-200">
            "{founder.philosophy}"
          </p>
        </div>

        {/* Key Milestones */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-black border-b border-gray-200 pb-2 font-serif">
            Key Institutional Milestones
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-800">
            {founder.keyMilestones.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-gray-50 p-3.5 border border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contributions */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-black font-serif">
            Contributions to LexVanguard Advocates LLP
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-800">
            {founder.contributions.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-gray-50 p-3.5 border border-gray-100">
                <div className="w-2 h-2 bg-yellow-500 shrink-0 mt-1.5" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation back */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <Link
            href="/history"
            className="bg-black text-white hover:bg-yellow-500 hover:text-black px-8 py-3.5 font-extrabold text-xs uppercase tracking-widest transition-colors inline-block"
          >
            ← RETURN TO HISTORY & FOUNDERS OVERVIEW
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
