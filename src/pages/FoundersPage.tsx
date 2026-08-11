import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Code, Compass, Users, Award, Shield, Cpu, BookOpen, Lightbulb } from "lucide-react";

export default function FoundersPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white text-black font-sans">
      <SEOHead
        title="Founders' Portfolio | LexVanguard Advocates LLP"
        description="Meet the three founders of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus: Prince Micah, Kelvin Musya, and Donel Aganyo. Innovation, Strategy, and Advocacy."
        url="https://lexvanguard.xyz/founders"
      />

      <Header />

      {/* Hero Banner */}
      <div className="bg-black pt-28 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 text-center border-b-4 border-yellow-500 w-full max-w-full overflow-x-hidden">
        <span className="text-[#ffc107] uppercase tracking-[0.3em] text-xs font-bold block mb-3 font-mono">
          Leadership & Legacy
        </span>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white uppercase tracking-wider font-serif">
          LexVanguard Founders' Portfolio
        </h1>
        <div className="h-1 w-16 bg-[#ffc107] mx-auto mt-6" />
        <p className="text-gray-300 max-w-2xl mx-auto mt-6 text-sm sm:text-base md:text-lg leading-relaxed font-light">
          Three law students united by a shared conviction: the future of law belongs to advocates who are strategic, technologically literate, articulate, and committed to leadership.
        </p>
      </div>

      {/* Executive Summary */}
      <div className="py-16 sm:py-20 bg-white border-b border-gray-100">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black uppercase tracking-wider font-serif">
            Founded in September 2025
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg max-w-4xl mx-auto">
            Established at <strong className="text-black">Mount Kenya University, Parklands Law Campus</strong>, LexVanguard Advocates LLP was conceived by three ambitious law scholars: <strong className="text-black">Prince Micah, Kelvin Musya, and Donel Aganyo</strong>.
          </p>
          <p className="text-gray-600 leading-relaxed text-xs sm:text-sm md:text-base max-w-4xl mx-auto">
            What began as a student-led initiative has developed into a unified platform built around advocacy, legal learning, professional development, collaboration, and the pursuit of excellence. Together, the founders represent three complementary pillars:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="p-6 bg-gray-50 border-t-2 border-black text-center space-y-2">
              <Code className="w-6 h-6 text-yellow-600 mx-auto" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-black">Technology & Innovation</h3>
              <p className="text-xs text-gray-600">Architecting the digital foundation and legal tech capabilities of tomorrow.</p>
            </div>
            <div className="p-6 bg-gray-50 border-t-2 border-black text-center space-y-2">
              <Compass className="w-6 h-6 text-yellow-600 mx-auto" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-black">Strategy & Organisation</h3>
              <p className="text-xs text-gray-600">Driving institutional discipline, execution, and structured firm growth.</p>
            </div>
            <div className="p-6 bg-gray-50 border-t-2 border-black text-center space-y-2">
              <Users className="w-6 h-6 text-yellow-600 mx-auto" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-black">Advocacy & Outreach</h3>
              <p className="text-xs text-gray-600">Empowering member development, public speaking, and community engagement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Profiles */}
      <div className="py-16 sm:py-24 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 space-y-24">
          
          {/* PRINCE MICAH */}
          <div className="bg-white p-8 sm:p-12 border-t-4 border-black shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 shrink-0">
                <img
                  src="/images/profiles/prince.jpeg"
                  alt="Prince Micah"
                  className="w-full h-80 object-cover border border-gray-200"
                />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <span className="text-xs font-mono text-yellow-600 uppercase tracking-widest block">Co-Founder</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif">Prince Micah</h2>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3">
                  Technology & Innovation Lead | Software Engineer & Web Developer
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Prince Micah is one of the founding minds behind LexVanguard LLP and a passionate law student with a strong background in software engineering, web development, technology, and digital innovation. As a law student, Prince brings an unusual but increasingly important perspective to the legal profession: the ability to understand both law and technology.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  He believes that modern lawyers must be capable of operating in a rapidly changing technological environment and understanding how emerging technologies are transforming legal practice, access to justice, business, communication, and society.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-black uppercase tracking-wide">Architect of the LexVanguard Digital Experience</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Prince personally designed and developed the LexVanguard website, transforming the firm's vision into a functional digital platform. From architecture and interface design to development and deployment, he has been responsible for building the technological foundation of the organisation's online presence.
              </p>

              <blockquote className="p-4 bg-yellow-50 border-l-4 border-yellow-500 text-sm font-semibold italic text-black">
                "The lawyer of tomorrow must understand the technology shaping tomorrow's world."
              </blockquote>

              <p className="text-sm text-gray-700 leading-relaxed">
                His combination of legal education and engineering experience positions him at the intersection of law and technology — a field that is becoming increasingly significant in areas such as legal technology, artificial intelligence, cybersecurity, digital evidence, data protection, intellectual property, and technology regulation.
              </p>

              <div className="pt-4">
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-3">Key Contributions to LexVanguard</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Digital strategy and technological innovation</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Website architecture, development and maintenance</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Legal technology exploration & AI integration</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Digital communications & platform security</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Advocacy, legal research and moot court participation</div>
                </div>
              </div>
            </div>
          </div>

          {/* KELVIN MUSYA */}
          <div className="bg-white p-8 sm:p-12 border-t-4 border-black shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 shrink-0">
                <img
                  src="/images/profiles/kelvin.jpeg"
                  alt="Kelvin Musya"
                  className="w-full h-80 object-cover border border-gray-200"
                />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <span className="text-xs font-mono text-yellow-600 uppercase tracking-widest block">Co-Founder</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif">Kelvin Musya</h2>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3">
                  Chief Strategist | Organising Director
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Kelvin Musya is a co-founder of LexVanguard LLP and serves as the organisation's Chief Strategist and Organising Director. He is widely regarded within the founding team as the architect of the unified-firm concept — the idea that talented law students can move beyond individual ambition and build something collectively meaningful.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Kelvin's greatest strength lies in strategy, organisation, coordination, and execution. Where ideas may begin as conversations, Kelvin is often the person who turns them into plans, and plans into action.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-black uppercase tracking-wide">The Strategic Force Behind the Firm</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Kelvin has played a significant role in driving the organisation's progress, coordinating activities, developing initiatives, encouraging participation, and keeping the founders aligned around the larger vision of LexVanguard. His leadership philosophy centres on the belief that a successful legal organisation requires discipline, structure, accountability, and a shared vision.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                He understands that leadership in law is not merely about speaking well in a courtroom — it is about building teams, creating opportunities, managing people, developing strategy, solving organizational problems, and maintaining professional standards.
              </p>

              <div className="pt-4">
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-3">Key Contributions to LexVanguard</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Strategic planning & institutional direction</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Organisational leadership & discipline</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Event and activity coordination</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Member engagement & team building</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Partnership development & advocacy</div>
                </div>
              </div>
            </div>
          </div>

          {/* DONEL AGANYO */}
          <div className="bg-white p-8 sm:p-12 border-t-4 border-black shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/3 shrink-0">
                <img
                  src="/images/profiles/don.jpeg"
                  alt="Donel Aganyo"
                  className="w-full h-80 object-cover border border-gray-200"
                />
              </div>
              <div className="w-full md:w-2/3 space-y-4">
                <span className="text-xs font-mono text-yellow-600 uppercase tracking-widest block">Co-Founder</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase font-serif">Donel Aganyo</h2>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-3">
                  Advocacy Partner | Member Outreach & Engagement Lead
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Donel Aganyo is a co-founder of LexVanguard LLP and serves as the organisation's designated Advocacy Partner, with a particular focus on advocacy, member coordination, outreach, and engagement. A passionate law student and advocate in training, Donel brings a strong commitment to legal advocacy, communication, collaboration, and community building.
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  His role is centred on ensuring that the organisation remains connected to its members and that its vision translates into meaningful participation and collective growth.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-lg font-bold text-black uppercase tracking-wide">The Advocacy & Outreach Voice</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Donel contributes to the development of LexVanguard by coordinating member outreach, encouraging participation, facilitating communication, and supporting the organisation's advocacy-oriented activities. For Donel, advocacy encompasses the ability to listen, communicate persuasively, represent others effectively, engage communities, and stand for justice.
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                His advocacy-oriented approach complements Kelvin's strategic leadership and Prince's technological innovation, creating a balanced founding team.
              </p>

              <div className="pt-4">
                <h4 className="text-xs font-extrabold text-black uppercase tracking-wider mb-3">Key Contributions to LexVanguard</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Advocacy coordination & mobilization</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Member outreach & engagement</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Moot court and advocacy activities</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Intellectual legal discussions</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 shrink-0" /> Professional development initiatives</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Founders' Philosophy & Legacy Banner */}
      <div className="bg-black py-16 sm:py-24 px-6 text-center border-t-4 border-yellow-500">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          <p className="text-[#ffc107] uppercase tracking-[0.3em] text-xs font-bold">The LexVanguard Founders' Philosophy</p>
          <blockquote className="text-xl sm:text-3xl font-serif font-extrabold text-white leading-relaxed">
            "Law is not merely a profession to be studied. It is a responsibility to be mastered, practised and used to shape society."
          </blockquote>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Young lawyers should not wait until graduation to begin developing leadership, advocacy, professional networks, technological competence, and a commitment to service. They should begin building those qualities while still students.
          </p>
          <div className="pt-4">
            <span className="text-[#ffc107] font-mono text-sm uppercase tracking-widest block font-bold">
              Think boldly. Advocate fearlessly. Build intelligently. Lead responsibly.
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
