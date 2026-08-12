import { useRoute, Link } from "wouter";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FOUNDING_MEMBERS, getMemberSchema } from "@/lib/seo-data";
import { Award, Briefcase, GraduationCap, Mail, ShieldCheck, Star, ArrowLeft, ExternalLink, CheckCircle } from "lucide-react";

export default function MemberProfilePage() {
  const [, params] = useRoute<{ slug: string }>("/attorneys/:slug");
  const slug = params?.slug ? params.slug.toLowerCase() : "";

  const member = FOUNDING_MEMBERS.find((m) => m.slug === slug) || FOUNDING_MEMBERS[0];

  const jsonLdSchema = getMemberSchema(member);

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans flex flex-col selection:bg-yellow-500 selection:text-black">
      <SEOHead
        title={`${member.name} - ${member.title}`}
        description={`${member.name} is ${member.title} at LexVanguard Advocates LLP, Mount Kenya University Parklands Law Campus (MKUPLC). Specializing in ${member.practice}.`}
        keywords={[
          member.name,
          member.title,
          "Mount Kenya University Parklands Law Campus",
          "MKUPLC",
          "Mooting",
          "Student law firms",
          "Youth in law",
          "LexVanguard Advocates LLP",
          ...member.skills
        ]}
        image={member.image}
        url={`https://lexvanguard.xyz/attorneys/${member.slug}`}
        type="profile"
        jsonLd={jsonLdSchema}
      />

      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <Link
            href="/attorneys"
            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-yellow-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Attorneys Directory
          </Link>
        </div>

        {/* Member Hero Card */}
        <div className="bg-gradient-to-br from-gray-900/90 via-black to-gray-950 border border-yellow-500/30 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start relative z-10">
            {/* Member Thumbnail Image */}
            <div className="relative shrink-0 w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-yellow-500/50 shadow-xl group" itemScope itemType="http://schema.org/Person">
              <img
                src={member.image}
                alt={`${member.name} - ${member.title} at LexVanguard Advocates LLP, Mount Kenya University Parklands Law Campus (MKUPLC)`}
                title={`${member.name} | LexVanguard Advocates LLP`}
                itemProp="image"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {member.isFoundingMember && (
                <div className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> Founding Partner
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full inline-block mb-3 border border-yellow-500/20">
                  {member.campus}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight">
                  {member.name}
                </h1>
                <p className="text-lg sm:text-xl text-yellow-400 font-semibold mt-1">
                  {member.title}
                </p>
              </div>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                {member.bio}
              </p>

              {/* Info Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <Briefcase className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Primary Practice</p>
                    <p className="text-sm font-bold text-white truncate">{member.practice}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Law Campus affiliation</p>
                    <p className="text-sm font-bold text-white truncate">MKU Parklands Law Campus</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm tracking-wider uppercase transition-colors shadow-lg"
                >
                  <Mail className="w-4 h-4 mr-2" /> Direct Chambers Contact
                </a>
                <Link
                  href="/events"
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wider uppercase transition-colors border border-white/20"
                >
                  Moot Court Symposia
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Grid Breakdown: Key Highlights & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Key Achievements */}
          <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
                Key Highlights & MKUPLC Legacy
              </h2>
            </div>
            <ul className="space-y-4">
              {member.achievements.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm text-gray-300">
                  <CheckCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Competencies & Keywords */}
          <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldCheck className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-serif font-bold text-white uppercase tracking-wider">
                Core Specialization & Competencies
              </h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {member.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-xs font-semibold px-3.5 py-1.5 rounded-lg"
                >
                  {skill}
                </span>
              ))}
              <span className="bg-white/5 text-gray-300 border border-white/10 text-xs font-semibold px-3.5 py-1.5 rounded-lg">
                Mooting
              </span>
              <span className="bg-white/5 text-gray-300 border border-white/10 text-xs font-semibold px-3.5 py-1.5 rounded-lg">
                Student Law Firm
              </span>
              <span className="bg-white/5 text-gray-300 border border-white/10 text-xs font-semibold px-3.5 py-1.5 rounded-lg">
                Youth in Law
              </span>
              <span className="bg-white/5 text-gray-300 border border-white/10 text-xs font-semibold px-3.5 py-1.5 rounded-lg">
                MKUPLC Student Organization
              </span>
            </div>
          </div>
        </div>

        {/* Founding Partners Fast Switcher */}
        <div className="border-t border-white/10 pt-10">
          <h3 className="text-center text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">
            LexVanguard Advocates LLP Founding Partners & Leadership
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FOUNDING_MEMBERS.map((m) => (
              <Link
                key={m.slug}
                href={`/attorneys/${m.slug}`}
                className={`p-4 rounded-xl border transition-all flex items-center space-x-3 ${
                  m.slug === member.slug
                    ? "bg-yellow-500/20 border-yellow-500 text-white"
                    : "bg-gray-900/40 border-white/10 hover:border-yellow-500/50 text-gray-300 hover:text-white"
                }`}
              >
                <img
                  src={m.image}
                  alt={`${m.name} - ${m.roleName} at LexVanguard Advocates LLP, Mount Kenya University Parklands Law Campus (MKUPLC)`}
                  title={`${m.name} | LexVanguard Advocates LLP`}
                  itemProp="image"
                  loading="lazy"
                  className="w-12 h-12 rounded-lg object-cover border border-yellow-500/30"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{m.name}</p>
                  <p className="text-[11px] text-yellow-500 truncate">{m.roleName}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
