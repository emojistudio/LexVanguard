import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { SITE_KEYWORDS } from "@/lib/seo-data";
import { ArrowRight } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="w-full bg-white text-black font-sans leading-relaxed">
      <SEOHead
        title="History of LexVanguard LLP — From an Idea to a Growing Legal Community"
        description="The complete history and journey of LexVanguard LLP from September 2025 at Mount Kenya University Parklands Law Campus (MKUPLC). Built by founders Prince Micah, Kelvin Musya, Donel Aganyo, and a dedicated community of members."
        keywords={[
          "LexVanguard History",
          "History of LexVanguard LLP",
          "LexVanguard Founders",
          "Prince Micah",
          "Kelvin Musya",
          "Donel Aganyo",
          "Mount Kenya University Parklands Law Campus",
          "MKUPLC History",
          "Student Law Firm Kenya",
          ...SITE_KEYWORDS
        ]}
        url="https://lexvanguard.xyz/history"
      />
      <Header />

      {/* Hero Header */}
      <div className="bg-black pt-32 sm:pt-40 pb-16 px-6 text-center border-b-4 border-yellow-500 text-white">
        <span className="text-yellow-500 font-mono text-xs uppercase tracking-[0.3em] font-bold block mb-2">
          Origin & Institutional Evolution
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-wider font-serif w-[90vw] max-w-[90vw] mx-auto leading-tight">
          The History of LexVanguard LLP
        </h1>
        <div className="h-1 w-16 bg-yellow-500 mx-auto mt-4 mb-4" />
        <p className="text-gray-300 w-[90vw] max-w-[90vw] mx-auto text-xs sm:text-base leading-relaxed">
          From an Idea to a Growing Legal Community — September 2025 to the Future.
        </p>
      </div>

      {/* TOP SECTION: FOUNDERS INTRODUCTIONS (HORIZONTAL FLEX ON WIDE SCREENS - 90% VIEWPORT WIDTH) */}
      <div id="founders-section" className="py-16 sm:py-20 bg-gray-50 border-b border-gray-200">
        <div className="w-[90vw] max-w-[90vw] mx-auto space-y-10 text-center">
          <div>
            <span className="text-yellow-600 uppercase tracking-[0.25em] text-xs font-bold font-mono block mb-1">
              Founding Leadership Introductions
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black uppercase font-serif tracking-tight">
              The Initial Architects
            </h2>
            <div className="h-1 w-12 bg-black mx-auto mt-3 mb-4" />
            <p className="text-gray-700 leading-relaxed text-xs sm:text-base w-full mx-auto">
              The establishment of LexVanguard was spearheaded in <strong className="text-black">September 2025</strong> by three law scholars who brought complementary strengths to a common vision. The founders started the idea — the community made it real. Select a founder below to read their full dedicated story.
            </p>
          </div>

          {/* Horizontal Flex Container covering 90% viewport width on wide screens */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center w-full text-left">
            
            {/* PRINCE MICAH SUMMARY CARD */}
            <div className="flex-1 bg-white border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:border-yellow-500 transition-colors shadow-xs group">
              <div className="space-y-4">
                <img
                  src="/images/profiles/prince.jpeg"
                  alt="Prince Micah"
                  className="w-full aspect-square object-cover"
                />
                <div>
                  <span className="text-[10px] font-mono text-yellow-600 font-bold uppercase tracking-widest block">Co-Founder</span>
                  <h3 className="text-xl font-extrabold text-black uppercase font-serif group-hover:text-yellow-600 transition-colors">
                    Prince Micah
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                    Technology & Innovation Lead
                  </p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Law scholar and software engineer who led the digital architecture and web development of the LexVanguard platform (lexvanguard.xyz), driving legal tech, digital security, and AI research tools.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/founders/prince"
                  className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Read Prince's Full Story</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* KELVIN MUSYA SUMMARY CARD */}
            <div className="flex-1 bg-white border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:border-yellow-500 transition-colors shadow-xs group">
              <div className="space-y-4">
                <img
                  src="/images/profiles/kelvin.jpeg"
                  alt="Kelvin Musya"
                  className="w-full aspect-square object-cover"
                />
                <div>
                  <span className="text-[10px] font-mono text-yellow-600 font-bold uppercase tracking-widest block">Co-Founder</span>
                  <h3 className="text-xl font-extrabold text-black uppercase font-serif group-hover:text-yellow-600 transition-colors">
                    Kelvin Musya
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                    Chief Strategist & Organising Director
                  </p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Architect of the unified-firm concept. Strategic force behind institutional structure, discipline, partner governance, and execution.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/founders/kelvin"
                  className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Read Kelvin's Full Story</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* DONEL AGANYO SUMMARY CARD */}
            <div className="flex-1 bg-white border border-gray-200 p-6 sm:p-8 flex flex-col justify-between hover:border-yellow-500 transition-colors shadow-xs group">
              <div className="space-y-4">
                <img
                  src="/images/profiles/don.jpeg"
                  alt="Donel Aganyo"
                  className="w-full aspect-square object-cover"
                />
                <div>
                  <span className="text-[10px] font-mono text-yellow-600 font-bold uppercase tracking-widest block">Co-Founder</span>
                  <h3 className="text-xl font-extrabold text-black uppercase font-serif group-hover:text-yellow-600 transition-colors">
                    Donel Aganyo
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                    Advocacy Partner & Outreach Lead
                  </p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Voice of member engagement, oral advocacy drills, moot court preparation, legal debates, and youth-in-law community outreach.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/founders/donel"
                  className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Read Donel's Full Story</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* NARRATIVE SECTION I: FROM AN IDEA TO A GROWING COMMUNITY (90% VIEWPORT WIDTH) */}
      <div className="w-[90vw] max-w-[90vw] mx-auto py-16 space-y-12 text-left">
        <div className="space-y-4">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-widest block">
            Chapter I — September 2025
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-black uppercase font-serif tracking-tight">
            From an Idea to a Growing Legal Community
          </h2>
          <div className="h-1 w-12 bg-yellow-500" />
          
          <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
            <strong className="text-black font-bold">LexVanguard LLP</strong> was founded in <strong className="text-black font-bold">September 2025</strong> at <strong className="text-black font-bold">Mount Kenya University, Parklands Law Campus</strong>, with a simple but ambitious idea: to create a unified community of law students committed to <strong className="text-black">excellence in advocacy, legal scholarship, leadership, professional development, collaboration and service</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            What began as an idea among a small group of ambitious young law students has grown into a collective movement sustained by something far greater than its founding team—the <strong className="text-black font-bold">community of members, friends, supporters and contributors who believed in the idea from its earliest days</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            LexVanguard's history is therefore not the story of three individuals alone. It is the story of a <strong className="text-black">community that chose to believe in an idea and build it together</strong>.
          </p>
        </div>

        {/* NARRATIVE SECTION II: THE BEGINNING */}
        <div className="space-y-4 pt-8 border-t border-gray-200">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-widest block">
            Chapter II — The Catalyst
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif tracking-tight">
            The Beginning — September 2025
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            The story of LexVanguard began in September 2025, during a period when the founders and other students were increasingly recognising the need for a stronger sense of unity among aspiring legal professionals.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Law school is inherently competitive. Students are expected to develop individually, compete academically, participate in advocacy, build professional networks and prepare for demanding careers. Yet the founders believed that there was another possibility:
          </p>

          <blockquote className="p-5 bg-black text-white border-l-4 border-yellow-500 my-6 font-serif text-base sm:text-lg italic">
            "Students could compete with excellence while still building one another."
          </blockquote>

          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            The idea behind LexVanguard was consequently not to create another ordinary student club, but to establish a platform where law students could <strong className="text-black">learn together, compete together, organise together and grow together</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            The founding vision was built around the belief that the best legal professionals are not produced solely through lectures and examinations. They are developed through <strong className="text-black">experience, advocacy, teamwork, research, debate, leadership, mentorship, exposure and community</strong>.
          </p>
        </div>

        {/* NARRATIVE SECTION III: THE FOUNDING VISION */}
        <div className="space-y-4 pt-8 border-t border-gray-200">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-tight">
            Chapter III — The Collective Ideology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif tracking-tight">
            The Founding Vision
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            The establishment of LexVanguard was spearheaded by <strong className="text-black">Prince Micah, Kelvin Musya and Donel Aganyo</strong>, three law students who brought different strengths to a common vision.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Prince contributed a strong technological and innovative perspective (leading digital architecture and web engineering), Kelvin provided strategic and organisational leadership, while Donel brought advocacy, outreach and member engagement.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            However, the founders never represented the entirety of the LexVanguard idea. They were its <strong className="text-black">initial architects</strong>, but the organisation's identity was shaped by everyone who subsequently joined, contributed, participated, encouraged, financed, challenged and supported it.
          </p>

          <div className="p-6 bg-yellow-50 border-2 border-yellow-500 my-6 text-center">
            <p className="text-base sm:text-xl font-extrabold font-serif text-black uppercase tracking-wider">
              "The founders started the idea. The community made it real."
            </p>
          </div>
        </div>

        {/* NARRATIVE SECTION IV: THE FIRST MEMBERS */}
        <div className="space-y-4 pt-8 border-t border-gray-200">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-widest block">
            Chapter IV — Foundational Support
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif tracking-tight">
            The First Members — The People Who Believed Early
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            From the earliest days, LexVanguard attracted a growing circle of students who saw value in the vision. These early members were not merely names on a membership list — they became part of the organisation's <strong className="text-black">foundational community</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            They attended activities, contributed ideas, participated in discussions, supported initiatives and helped create the atmosphere that would eventually define LexVanguard.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-gray-800">
            <div className="bg-gray-50 p-3.5 border border-gray-200">Some contributed their time and skills.</div>
            <div className="bg-gray-50 p-3.5 border border-gray-200">Others contributed financially and logistically.</div>
            <div className="bg-gray-50 p-3.5 border border-gray-200">Many assisted in publicity, research and advocacy.</div>
            <div className="bg-gray-50 p-3.5 border border-gray-200">Many simply showed up when their presence was needed.</div>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base pt-2">
            Organisations do not become institutions because of their names or constitutions alone. They become institutions when <strong className="text-black">people repeatedly choose to invest themselves in the vision</strong>.
          </p>
        </div>

        {/* NARRATIVE SECTION V: A COMMUNITY BUILT ON CONTRIBUTION */}
        <div className="space-y-4 pt-8 border-t border-gray-200">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-widest block">
            Chapter V — Collective Investment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif tracking-tight">
            A Community Built on Contribution & Ownership
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            One of the defining features of LexVanguard's development has been the willingness of its members to contribute to the organisation's growth. The organisation's activities have benefited from member contributions, financial support, shared resources, participation and voluntary efforts.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Every contribution, regardless of size, has formed part of the larger story. These contributions may appear different individually, but collectively they represent one core truth:
          </p>
          <div className="p-6 bg-black text-white text-center font-serif text-2xl font-extrabold uppercase tracking-widest border-l-4 border-yellow-500 my-4">
            OWNERSHIP.
          </div>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            LexVanguard belongs to the people who have invested themselves in its journey.
          </p>
        </div>

        {/* NARRATIVE SECTION VI: GROWTH OF THE COMMUNITY & ADVOCACY */}
        <div className="space-y-4 pt-8 border-t border-gray-200">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-widest block">
            Chapter VI — Legal Excellence & Advocacy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif tracking-tight">
            The Growth of the Community & The Spirit of Advocacy
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            As the organisation developed, the original concept expanded. LexVanguard became centered around a broader understanding of legal education—engaging with moot court, legal research, public speaking, debates, legal technology, and academic collaboration.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Through participation in moot court competitions, members have developed:
          </p>
          <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs font-bold uppercase">
            {["Research", "Reasoning", "Persuasion", "Presentation", "Teamwork", "Preparation", "Resilience"].map((pillar, i) => (
              <span key={i} className="bg-black text-white px-3 py-1.5 border border-yellow-500">
                {pillar}
              </span>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base pt-3">
            For LexVanguard, advocacy is not simply about winning competitions. It is about <strong className="text-black">building lawyers capable of thinking critically, speaking confidently and defending their positions with knowledge, logic and integrity</strong>.
          </p>
        </div>

        {/* NARRATIVE SECTION VII: A FOUNDING FAMILY & POWER OF COLLECTIVE OWNERSHIP */}
        <div className="space-y-4 pt-8 border-t border-gray-200">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-widest block">
            Chapter VII — The LexVanguard Family
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif tracking-tight">
            The People Behind the Progress & A Founding Family
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Over time, LexVanguard evolved into a community that students belong to. The founders, members, supporters and contributors collectively formed what can appropriately be described as the <strong className="text-black font-bold">LexVanguard family</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            While LexVanguard is fundamentally a community effort, the contribution of its founders remains an important part of its history. Prince Micah, Kelvin Musya, and Donel Aganyo provided the initial leadership and vision around which the organisation developed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 text-xs font-semibold">
            <div className="p-4 bg-gray-50 border-t-2 border-yellow-500">
              <strong className="block text-black text-sm uppercase mb-1">The Founders</strong>
              Provided direction.
            </div>
            <div className="p-4 bg-gray-50 border-t-2 border-black">
              <strong className="block text-black text-sm uppercase mb-1">The Members</strong>
              Provided momentum.
            </div>
            <div className="p-4 bg-black text-white border-t-2 border-yellow-500">
              <strong className="block text-yellow-500 text-sm uppercase mb-1">Together</strong>
              They created movement.
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            One of the most important lessons in LexVanguard's history is that meaningful institutions cannot be sustained by leadership alone. <strong className="text-black">Leadership can initiate. But community sustains.</strong>
          </p>
        </div>

        {/* NARRATIVE SECTION VIII: AN AMBITIOUS FUTURE & CONTINUING JOURNEY */}
        <div className="space-y-4 pt-8 border-t border-gray-200">
          <span className="text-yellow-600 font-mono text-xs font-bold uppercase tracking-widest block">
            Chapter VIII — Tomorrow's Advocates
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif tracking-tight">
            A Young Organisation With an Ambitious Future
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Technology is changing legal practice. Artificial intelligence is reshaping research and professional workflows. Digital evidence, cybersecurity, and data protection are creating new legal frontiers. The modern advocate must be a <strong className="text-black">researcher, communicator, strategist, technologist, negotiator, problem-solver and lifelong learner</strong>. LexVanguard seeks to cultivate precisely these qualities.
          </p>
        </div>

        {/* LEGACY SUMMARY BOX */}
        <div className="bg-black text-white p-8 sm:p-10 border-t-4 border-yellow-500 space-y-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase font-serif text-white tracking-wider">
            The LexVanguard Legacy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-2">
            <div className="space-y-2 border-l-2 border-yellow-500 pl-4">
              <span className="text-yellow-500 font-mono text-xs uppercase font-bold">Stage 1</span>
              <h3 className="text-base font-bold text-white uppercase font-serif">An Idea</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Three young law students envisioned a stronger, more unified platform for aspiring legal professionals.
              </p>
            </div>
            <div className="space-y-2 border-l-2 border-white pl-4">
              <span className="text-gray-400 font-mono text-xs uppercase font-bold">Stage 2</span>
              <h3 className="text-base font-bold text-white uppercase font-serif">A Community</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Students believed in that vision, contributed their resources, and transformed the idea into a living organisation.
              </p>
            </div>
            <div className="space-y-2 border-l-2 border-yellow-500 pl-4">
              <span className="text-yellow-500 font-mono text-xs uppercase font-bold">Stage 3</span>
              <h3 className="text-base font-bold text-white uppercase font-serif">A Movement</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                A collective expression of a generation preparing themselves to enter—and shape—the legal profession.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800 text-xs sm:text-sm text-gray-300 space-y-2">
            <p className="font-bold text-white uppercase tracking-widest">
              LexVanguard LLP — Mount Kenya University Parklands Law Campus
            </p>
            <p className="text-yellow-500 font-mono font-bold tracking-wider uppercase">
              United by Law. Driven by Excellence. Preparing the Advocates of Tomorrow.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
