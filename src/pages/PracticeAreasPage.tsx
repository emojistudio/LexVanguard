import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { motion, AnimatePresence } from "motion/react";
import { resolveProfileImage } from "@/lib/profile-images";
import { 
  ShieldAlert, Scale, Globe2, Landmark, BookOpenCheck, 
  CheckCircle2, ArrowRight, UserCheck, PhoneCall, FileText, 
  Award, Sparkles, ChevronRight, X, Clock, AlertCircle
} from "lucide-react";

interface PracticeAreaItem {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
  icon: React.ReactNode;
  heroImage: string;
  overview: string;
  competencies: string[];
  caseHighlights: { title: string; forum: string; outcome: string }[];
  leadAttorneys: { name: string; title: string; image: string }[];
}

const PRACTICE_AREAS: PracticeAreaItem[] = [
  {
    id: "criminal-litigation",
    title: "Criminal Litigation & Defense",
    badge: "Trial Advocacy & Constitutional Rights",
    icon: <ShieldAlert className="w-6 h-6 text-amber-500" />,
    heroImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=60",
    shortDesc: "Aggressive, strategic trial defense and constitutional safeguard enforcement across felonies, white-collar crimes, and criminal appeals.",
    overview: "LexVanguard's Criminal Litigation division provides unyielding defense representation for individuals and corporate entities facing criminal charges. Grounded in the constitutional guarantee of fair trial under Article 50, our litigators combine deep procedural mastery with meticulous evidentiary analysis to protect client liberty and reputation.",
    competencies: [
      "Bail & Bond Applications under High Court Guidelines",
      "White-Collar Crime & Financial Fraud Defense",
      "Constitutional Petitions for Injunctions against Illegal Arrests",
      "Appellate Review of Magistrate & High Court Convictions",
      "Cross-Examination of Expert Forensic & Ballistics Witnesses",
      "Plea Bargain Negotiation & Pre-Trial Diversions"
    ],
    caseHighlights: [
      {
        title: "Republic v. Corporate Executive (Milimani Law Courts)",
        forum: "High Court Anti-Corruption Division",
        outcome: "Acquittal on all counts following successful challenge of wiretap admissibility."
      },
      {
        title: "Constitutional Petition on Unlawful Detention",
        forum: "Constitutional & Human Rights Division",
        outcome: "Quashed criminal charges and awarded damages for fundamental rights breach."
      }
    ],
    leadAttorneys: [
      {
        name: "Prince Micah",
        title: "Managing Partner & Senior Litigator",
        image: resolveProfileImage("Prince Micah")
      },
      {
        name: "Kelvin Musya",
        title: "Senior Partner — Constitutional Advocacy",
        image: resolveProfileImage("Kelvin Musya")
      }
    ]
  },
  {
    id: "adr",
    title: "Alternative Dispute Resolution (ADR)",
    badge: "Arbitration & Mediation",
    icon: <Scale className="w-6 h-6 text-amber-500" />,
    heroImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Expeditious, confidential arbitration and commercial mediation resolving multi-million shilling disputes out of court.",
    overview: "As commercial transactions accelerate, court litigation can be costly and prolonged. Our ADR practice specializes in domestic and international arbitration, commercial mediation, and expert conciliation under the Chartered Institute of Arbitrators (CIArb) and NCIA frameworks.",
    competencies: [
      "Domestic & Cross-Border Commercial Arbitration",
      "Structured Mediation for Joint Ventures & Shareholder Disputes",
      "Construction & Infrastructure Project Dispute Adjudication",
      "Enforcement & Setting Aside of Arbitral Awards",
      "Conciliation in High-Value Contract Breach Cases",
      "Drafting Custom Multi-Tier Arbitration Clauses"
    ],
    caseHighlights: [
      {
        title: "East African Infrastructure Dispute",
        forum: "Nairobi Centre for International Arbitration (NCIA)",
        outcome: "Successfully negotiated KES 450M settlement in multi-tier mediation."
      },
      {
        title: "International Joint Venture Breach",
        forum: "CIArb Tribunal",
        outcome: "Secured binding arbitral award enforcing non-compete covenants."
      }
    ],
    leadAttorneys: [
      {
        name: "Donel Aganyo",
        title: "Founding Partner & CIArb Specialist",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  {
    id: "icj",
    title: "International Court of Justice (ICJ) & Public International Law",
    badge: "Sovereign & Diplomatic Jurisprudence",
    icon: <Globe2 className="w-6 h-6 text-amber-500" />,
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Representation and advisory in inter-state disputes, treaty interpretations, maritime boundaries, and international tribunal advocacy.",
    overview: "LexVanguard maintains an elite advisory and research division dedicated to Public International Law and state sovereign practice. We counsel sovereign states, diplomatic missions, international non-governmental bodies, and multinational enterprises on international treaties, border adjudications, and ICJ jurisprudence.",
    competencies: [
      "State Responsibility & Diplomatic Immunity Analysis",
      "International Maritime Boundary & Territorial Disputes",
      "Treaty Interpretation under Vienna Convention on Law of Treaties",
      "Human Rights Petitions before the African Court on Human & Peoples' Rights",
      "Compliance with International Environmental & Climate Accords",
      "Advisory on Sanctions, Trade Embargoes & Extradition Law"
    ],
    caseHighlights: [
      {
        title: "Advisory Opinion on Maritime Delimitation Jurisprudence",
        forum: "International Court of Justice (Peace Palace, The Hague)",
        outcome: "Comprehensive legal memorial published and cited in regional forum."
      },
      {
        title: "Regional Trade & Economic Customs Treaty Analysis",
        forum: "East African Court of Justice (EACJ)",
        outcome: "Upheld non-tariff barrier prohibition under EAC Treaty."
      }
    ],
    leadAttorneys: [
      {
        name: "Prince Micah",
        title: "Head of International Law & Public Jurisprudence",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  {
    id: "civil-litigation",
    title: "Civil & Commercial Litigation",
    badge: "Superior Courts & Appellate Practice",
    icon: <Landmark className="w-6 h-6 text-amber-500" />,
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "Comprehensive representation in contract claims, real estate disputes, tort liabilities, and appellate review in the Court of Appeal and Supreme Court.",
    overview: "Our Civil Litigation department represents corporate institutions, financial entities, real estate developers, and private individuals across all levels of the Kenyan judicial system. From interlocutory injunctions to landmark Supreme Court appeals, we engineer rigorous litigation strategies tailored to secure client objectives.",
    competencies: [
      "High-Value Breach of Contract & Commercial Recovery",
      "Real Estate, Land Use & Title Ownership Disputes",
      "Constitutional Petitions & Administrative Judicial Review",
      "Banking Litigation, Mortgages & Receiverships",
      "Employment & Labour Relations Court (ELRC) Representation",
      "Appellate Record Preparation & Oral Advocacy"
    ],
    caseHighlights: [
      {
        title: "Kariuki v. Attorney General & Minister for Lands",
        forum: "Supreme Court of Kenya",
        outcome: "Established precedent on indefeasibility of registered titles."
      },
      {
        title: "Commercial Injunction for Tech Consortium",
        forum: "High Court Commercial Division",
        outcome: "Obtained emergency inter partes order restraining asset liquidation."
      }
    ],
    leadAttorneys: [
      {
        name: "Kelvin Musya",
        title: "Head of Appellate & Civil Litigation",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  {
    id: "legal-research",
    title: "Legal Research & High-Authority Drafting",
    badge: "Precedential Analysis & Amicus Briefs",
    icon: <BookOpenCheck className="w-6 h-6 text-amber-500" />,
    heroImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    shortDesc: "In-depth statutory interpretation, legislative drafting, precedent synthesis, and amicus curiae briefs for complex matters.",
    overview: "Rigorous research is the engine of legal victory. LexVanguard's Research & Drafting Wing provides exhaustive legal opinions, statutory analysis, and high-authority pleadings for senior counsel, judicial commissions, policy institutes, and corporate legal departments.",
    competencies: [
      "Comparative Jurisprudence & Precedent Synthesis",
      "Drafting Amicus Curiae Briefs for Apex Court Matters",
      "Legislative Drafting & Regulatory Policy Opinions",
      "Complex Contract & Commercial Agreement Audits",
      "Formal Legal Opinions for Foreign Investors & Financial Institutions",
      "Pre-Trial Case Law Dossier Preparation"
    ],
    caseHighlights: [
      {
        title: "Amicus Curiae Submission on Digital Privacy Rights",
        forum: "High Court Constitutional Bench",
        outcome: "Research dossier adopted by three-judge bench in final judgment."
      },
      {
        title: "National Energy Legislative Audit",
        forum: "Ministry Advisory Board",
        outcome: "Formulated regulatory amendments for renewable energy tariffs."
      }
    ],
    leadAttorneys: [
      {
        name: "Donel Aganyo",
        title: "Head of Research & Legal Opinions",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
      }
    ]
  }
];

export default function PracticeAreasPage() {
  const [activeTab, setActiveTab] = useState<string>("criminal-litigation");
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultName, setConsultName] = useState("");
  const [consultEmail, setConsultEmail] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultNotes, setConsultNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const selectedArea = PRACTICE_AREAS.find(p => p.id === activeTab) || PRACTICE_AREAS[0];

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim() || !consultEmail.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowConsultModal(false);
        setConsultName("");
        setConsultEmail("");
        setConsultPhone("");
        setConsultNotes("");
      }, 2000);
    }, 800);
  };

  return (
    <div className="w-full bg-white text-black min-h-screen">
      <SEOHead
        title="Practice Areas — LexVanguard Advocates LLP"
        description="Comprehensive legal services in Criminal Litigation, Alternative Dispute Resolution (ADR), International Court of Justice (ICJ), Civil Litigation, and Legal Research."
      />

      <Header />

      {/* HERO BANNER */}
      <section className="bg-black text-white pt-32 sm:pt-40 pb-16 px-4 sm:px-6 border-b-4 border-amber-500 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Specialized Legal Practice Divisions
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            Our Practice Areas & Doctrine
          </h1>
          <div className="h-1 w-20 bg-amber-500 mx-auto mt-2" />
          <p className="text-neutral-400 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            Delivering elite trial advocacy, international advisory, and rigorous research across key legal disciplines in Kenya and East Africa.
          </p>
        </div>
      </section>

      {/* PRACTICE AREA NAVIGATION TABS */}
      <section className="bg-neutral-100 border-b border-neutral-200 sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none py-3">
          <div className="flex items-center gap-2 min-w-max">
            {PRACTICE_AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => setActiveTab(area.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === area.id
                    ? "bg-black text-white shadow-md border border-neutral-800"
                    : "bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-200"
                }`}
              >
                {area.icon}
                <span>{area.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTED PRACTICE AREA CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedArea.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {/* FEATURED BANNER */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-black text-white">
              <img
                src={selectedArea.heroImage}
                alt={selectedArea.title}
                className="w-full h-[260px] sm:h-[340px] object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 sm:p-10 flex flex-col justify-end">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-black/60 px-3 py-1 rounded-full w-fit mb-2 border border-amber-500/30">
                  {selectedArea.badge}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
                  {selectedArea.title}
                </h2>
                <p className="text-neutral-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
                  {selectedArea.shortDesc}
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setShowConsultModal(true)}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" /> Request Legal Evaluation
                  </button>
                </div>
              </div>
            </div>

            {/* OVERVIEW & COMPETENCIES GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* OVERVIEW */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 mb-2">Division Overview</h3>
                  <h4 className="text-xl sm:text-2xl font-bold text-black tracking-tight mb-4">Strategic Approach & Legal Doctrine</h4>
                  <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {selectedArea.overview}
                  </p>
                </div>

                {/* CASE HIGHLIGHTS */}
                <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" /> Representative Cases & Jurisprudence
                  </h4>
                  <div className="space-y-3">
                    {selectedArea.caseHighlights.map((caseItem, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-neutral-200 space-y-1">
                        <div className="text-xs font-bold text-black">{caseItem.title}</div>
                        <div className="text-[11px] font-mono text-neutral-500">{caseItem.forum}</div>
                        <div className="text-xs text-amber-700 font-semibold mt-1">Outcome: {caseItem.outcome}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COMPETENCIES & LEAD ATTORNEYS */}
              <div className="lg:col-span-5 space-y-6">
                {/* COMPETENCIES */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Competencies & Services
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedArea.competencies.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-800">
                        <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* LEAD ATTORNEYS */}
                <div className="bg-neutral-900 text-white rounded-2xl p-6 border border-neutral-800 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" /> Lead Counsel & Division Chairs
                  </h4>
                  <div className="space-y-3">
                    {selectedArea.leadAttorneys.map((attorney, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-neutral-800 p-3 rounded-xl border border-neutral-700">
                        <img
                          src={attorney.image}
                          alt={attorney.name}
                          className="w-10 h-10 rounded-lg object-cover border border-amber-500/40 shrink-0"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{attorney.name}</div>
                          <div className="text-[10px] text-neutral-400 mt-0.5">{attorney.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* CONSULTATION MODAL */}
      {showConsultModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-6 w-full max-w-md text-black space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-black" />
                <h3 className="font-bold text-black text-sm uppercase tracking-wider font-mono">
                  Case Evaluation Request
                </h3>
              </div>
              <button
                onClick={() => setShowConsultModal(false)}
                className="p-1 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-black text-sm">Consultation Request Received</h4>
                <p className="text-xs text-neutral-600">Our senior counsel will review your inquiry and contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-black block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adv. Jane Doe"
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@example.com"
                    value={consultEmail}
                    onChange={(e) => setConsultEmail(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +254 700 000000"
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="font-bold text-black block mb-1">Brief Overview of Case / Matter</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the nature of legal assistance required..."
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowConsultModal(false)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition cursor-pointer"
                  >
                    {submitting ? "Sending..." : "Submit Evaluation Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
