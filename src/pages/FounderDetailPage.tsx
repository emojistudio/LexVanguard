import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft, Code, Compass, Users, Award, Shield, BookOpen, Globe } from "lucide-react";

interface FounderDetail {
  slug: string;
  name: string;
  role: string;
  subtitle: string;
  image: string;
  summary: string;
  fullBio: string[];
  builtWebsiteNotice?: boolean;
  contributions: string[];
  quote: string;
}

const FOUNDERS_DATA: Record<string, FounderDetail> = {
  prince: {
    slug: "prince",
    name: "Prince Micah",
    role: "Co-Founder | Technology & Innovation Lead",
    subtitle: "Software Engineer & Web Developer | Architect of lexvanguard.xyz",
    image: "/images/profiles/prince.jpeg",
    summary: "Law student, software engineer, and technological architect who single-handedly planned, designed, and built the entire LexVanguard website (lexvanguard.xyz).",
    builtWebsiteNotice: true,
    fullBio: [
      "Prince Micah is a co-founder of LexVanguard Advocates LLP and a passionate law scholar with an extensive background in software engineering, full-stack web development, and digital system design.",
      "Prince planned, architected, designed, and built this entire website (lexvanguard.xyz) from the ground up, transforming the firm's vision into a high-performance, production-ready web platform.",
      "As a law student, Prince brings a rare and highly valuable interdisciplinary perspective: bridging the gap between legal jurisprudence and modern software technology.",
      "He believes that the advocate of tomorrow must be capable of operating comfortably in a technologically driven global landscape—mastering emerging fields such as artificial intelligence, legal technology, data protection, digital forensics, and tech regulation."
    ],
    contributions: [
      "Planned, architected, and built the entire firm website (lexvanguard.xyz)",
      "Designed & integrated the eLegal AI research engine and Research Desk",
      "Leads digital infrastructure, cyber security, and technological innovation",
      "Coordinates legal technology workshops and digital litigation workflows",
      "Active participant in appellate legal research and moot court advocacy"
    ],
    quote: "The lawyer of tomorrow must master the technology shaping tomorrow's world."
  },
  kelvin: {
    slug: "kelvin",
    name: "Kelvin Musya",
    role: "Co-Founder | Chief Strategist & Organising Director",
    subtitle: "Architect of the Unified Firm Concept | Strategic Execution",
    image: "/images/profiles/kelvin.jpeg",
    summary: "Strategic leader and operational anchor who turned the vision of a student-led law firm into a disciplined, structured, and nationally recognized institution.",
    builtWebsiteNotice: false,
    fullBio: [
      "Kelvin Musya is a co-founder of LexVanguard Advocates LLP, serving as Chief Strategist and Organising Director. He is widely recognized as the architect of the unified-firm concept.",
      "Kelvin's core strength lies in strategic planning, institutional organization, coordination, and disciplined execution. He excels at converting ambitious legal concepts into operational reality.",
      "He has played a pivotal role in driving firm progress, establishing structural accountability, fostering partnerships, and maintaining alignment around LexVanguard's core mission.",
      "Kelvin believes leadership in law extends beyond courtroom oralism—it demands building resilient teams, solving complex organizational challenges, and upholding unyielding professional standards."
    ],
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
    subtitle: "Member Engagement | Oral Advocacy & Community Building",
    image: "/images/profiles/don.jpeg",
    summary: "Dedicated advocate in training leading member outreach, public speaking, moot court preparation, and community engagement.",
    builtWebsiteNotice: false,
    fullBio: [
      "Donel Aganyo is a co-founder of LexVanguard Advocates LLP, serving as Advocacy Partner and Member Outreach & Engagement Lead.",
      "A committed law scholar and orator, Donel focuses on legal advocacy, public speaking, community outreach, and member development.",
      "He ensures that LexVanguard remains deeply connected to its student members and that every individual is supported in developing oral advocacy, legal research, and litigation skills.",
      "Donel's advocacy-first philosophy complements Kelvin's strategic leadership and Prince's technological innovation, forming a balanced, well-rounded founding team."
    ],
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
        title={`${founder.name} — Founder Profile | LexVanguard Advocates LLP`}
        description={founder.summary}
        url={`https://lexvanguard.xyz/founders/${founder.slug}`}
      />

      <Header />

      <div className="bg-black text-white pt-28 sm:pt-36 pb-12 px-4 sm:px-8 border-b-4 border-yellow-500">
        <div className="max-w-5xl mx-auto space-y-4">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 text-xs text-yellow-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to History & Founders
          </Link>

          <div className="pt-2">
            <span className="text-yellow-500 uppercase tracking-[0.3em] text-xs font-bold block font-mono">
              Founding Leadership Profile
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

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12 flex-1 w-full">
        {/* Profile Card & Overview */}
        <div className="flex flex-col md:flex-row gap-8 items-start bg-gray-50 p-6 sm:p-10 border border-gray-200">
          <img
            src={founder.image}
            alt={founder.name}
            className="w-full md:w-72 h-80 object-cover border-2 border-black shrink-0"
          />

          <div className="space-y-4 flex-1">
            <h2 className="text-2xl font-bold uppercase font-serif text-black">{founder.name}</h2>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 pb-3">
              {founder.subtitle}
            </p>

            {founder.builtWebsiteNotice && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-xs text-black font-semibold space-y-1">
                <p className="font-extrabold uppercase tracking-wider text-yellow-700 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-yellow-600" /> Digital Architect Notice
                </p>
                <p className="leading-relaxed">
                  Prince Micah planned, architected, designed, and built this entire website (<strong>lexvanguard.xyz</strong>) from the ground up to establish LexVanguard's digital legal portal.
                </p>
              </div>
            )}

            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {founder.summary}
            </p>

            <blockquote className="p-4 bg-white border-l-4 border-black text-xs sm:text-sm font-semibold italic text-black">
              "{founder.quote}"
            </blockquote>
          </div>
        </div>

        {/* Detailed Biography */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-black border-b-2 border-black pb-2">
            Biography & Leadership Journey
          </h3>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            {founder.fullBio.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Key Contributions */}
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-black">
            Key Contributions to LexVanguard Advocates LLP
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-800">
            {founder.contributions.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-gray-50 p-3.5 border border-gray-200">
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
            ← RETURN TO HISTORY & FOUNDERS
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
