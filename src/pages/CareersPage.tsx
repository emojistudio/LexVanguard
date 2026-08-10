import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { SITE_KEYWORDS } from "@/lib/seo-data";
import { 
  Briefcase, GraduationCap, Award, Send, CheckCircle2, 
  Sparkles, FileText, User, Mail, Phone, ChevronRight, X 
} from "lucide-react";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
}

const JOB_OPENINGS: JobOpening[] = [
  {
    id: "pupilage-2026",
    title: "Pupilage & Student Fellowship Program 2026/2027",
    department: "Litigation & Trial Advocacy",
    location: "Mount Kenya University Parklands Law Campus (MKUPLC)",
    type: "Full-Time Fellowship",
    experience: "Law Student / LLB Candidate",
    description: "Join LexVanguard Advocates LLP's flagship fellowship program. Fellow pupils undergo intensive rotation across Criminal Defense, Appellate Briefing, Alternative Dispute Resolution (ADR), and Legal Tech Research.",
    requirements: [
      "Enrolled in LLB Degree Program at Mount Kenya University or accredited institution",
      "Demonstrated commitment to moot court competition advocacy or legal research",
      "Strong analytical writing and statutory interpretation skills",
      "Ability to thrive in a collaborative, fast-paced co-working environment"
    ]
  },
  {
    id: "research-associate",
    title: "Legal Research & Precedent Associate",
    department: "eLegal & Research Intelligence Desk",
    location: "Nairobi / Remote Hybrid",
    type: "Part-Time / Project-Based",
    experience: "Intermediate to Advanced",
    description: "Synthesize Kenya Law judgments, summarize ratio decidendi, and train AI grounding models for high-authority court submissions and amicus curiae briefs.",
    requirements: [
      "Exceptional command of Laws of Kenya, Constitution 2010, and case law databases",
      "Prior experience in law journal editing or research assistant roles",
      "Familiarity with digital legal technology tools and eLegal corpus search"
    ]
  },
  {
    id: "moot-co-chair",
    title: "Moot Court & Symposia Student Coordinator",
    department: "Academic & External Affairs",
    location: "MKUPLC Campus",
    type: "Student Leadership",
    experience: "Current Undergraduate",
    description: "Coordinate national and international moot court championship delegations, organize symposia events, and liaise with guest justices and legal practitioners.",
    requirements: [
      "Active participant in collegiate moot court or debate competitions",
      "Strong organizational, public speaking, and event execution capabilities",
      "High academic standing and ethical leadership mindset"
    ]
  }
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("Year 3");
  const [statement, setStatement] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          position: selectedJob ? selectedJob.title : "General Fellowship Application",
          yearOfStudy,
          coverLetter: statement.trim()
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(data.message || "Application submitted successfully!");
        setTimeout(() => {
          setSelectedJob(null);
          setSuccessMessage(null);
          setFullName("");
          setEmail("");
          setPhone("");
          setStatement("");
        }, 2500);
      } else {
        setErrorMessage(data.error || "Failed to submit application.");
      }
    } catch (err: any) {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col font-sans">
      <SEOHead
        title="Careers & Fellowships | Join LexVanguard Advocates LLP"
        description="Pupilage, legal research fellowships, and student leadership opportunities at LexVanguard Advocates LLP, Mount Kenya University Parklands Law Campus (MKUPLC)."
        keywords={["LexVanguard Careers", "MKUPLC Fellowships", "Legal Internships Kenya", ...SITE_KEYWORDS]}
        url="https://lexvanguard.xyz/careers"
      />

      <Header />

      {/* Hero Banner */}
      <div className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 text-center border-b border-yellow-500/20 bg-gradient-to-b from-neutral-950 via-black to-neutral-950">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-400 text-xs font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Shaping the Future of Youth in Law
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
            Careers & Fellowships
          </h1>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-2" />
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-base leading-relaxed">
            LexVanguard is an incubator for elite legal talent. We provide structured mentorship, hands-on litigation training, and national moot court exposure.
          </p>
        </div>
      </div>

      {/* Core Values / Why Join */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <GraduationCap className="w-8 h-8 text-yellow-500" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Rigorous Mentorship</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Work alongside founding partners and senior practitioners on actual court pleadings, statutory research, and appellate briefs.
            </p>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <Award className="w-8 h-8 text-yellow-500" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Mooting Excellence</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Represent Mount Kenya University Parklands Law Campus in prestigious national and international moot court championships.
            </p>
          </div>
          <div className="bg-neutral-900/80 border border-neutral-800 p-6 rounded-2xl space-y-3">
            <Briefcase className="w-8 h-8 text-yellow-500" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Legal Tech Innovation</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Utilize LexAI and eLegal research tools to synthesize precedent and engineer modern legal strategies.
            </p>
          </div>
        </div>

        {/* Job Listings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold uppercase tracking-wide text-white">Active Openings & Fellowships</h2>
              <p className="text-xs text-gray-400 mt-1">Select a position to submit your fellowship application.</p>
            </div>
            <span className="text-xs font-mono font-bold text-yellow-500 uppercase tracking-widest">
              {JOB_OPENINGS.length} Positions Available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {JOB_OPENINGS.map((job) => (
              <div
                key={job.id}
                className="bg-neutral-900/60 border border-neutral-800 hover:border-yellow-500/50 rounded-2xl p-6 sm:p-8 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {job.department}
                    </span>
                    <span className="bg-neutral-800 text-gray-300 text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{job.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{job.description}</p>
                  
                  <div className="space-y-1.5 pt-2">
                    <p className="text-[11px] font-bold text-yellow-500 uppercase tracking-wider">Key Requirements:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-400">
                      {job.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-yellow-500 uppercase font-bold tracking-widest block">Fellowship Application</span>
                <h3 className="text-base font-bold text-white leading-tight">{selectedJob.title}</h3>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMessage ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="text-lg font-bold text-white">Application Dispatched</h4>
                <p className="text-xs text-gray-300 max-w-xs mx-auto">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
                {errorMessage && (
                  <div className="bg-rose-900/50 border border-rose-500 text-rose-200 p-3 rounded-xl text-xs">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Wambui"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        placeholder="jane@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Academic Year / Status</label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-yellow-500"
                  >
                    <option>Year 1 LLB</option>
                    <option>Year 2 LLB</option>
                    <option>Year 3 LLB</option>
                    <option>Year 4 LLB</option>
                    <option>KSL Advocate Trainee</option>
                    <option>Postgraduate / Associate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1">Statement of Purpose / Cover Letter</label>
                  <textarea
                    rows={4}
                    placeholder="Briefly state your legal interests, mooting background, and why you wish to join LexVanguard Advocates LLP..."
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-2"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
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
