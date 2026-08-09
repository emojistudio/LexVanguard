import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITEMAP_PAGES, FOUNDING_MEMBERS, SITE_KEYWORDS } from "@/lib/seo-data";
import { Link } from "wouter";
import { Globe, MapPin, Users, Award, FileText, Search, ExternalLink, Star, Layers } from "lucide-react";

export default function SitemapPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "LexVanguard Advocates LLP - Search Engine Index Directory",
    "description": "Comprehensive index and visual sitemap of LexVanguard Advocates LLP, Mount Kenya University Parklands Law Campus (MKUPLC).",
    "itemListElement": SITEMAP_PAGES.map((page, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": page.title,
      "url": `https://lexvanguard.xyz${page.path}`,
      "description": page.description
    }))
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans flex flex-col selection:bg-yellow-500 selection:text-black">
      <SEOHead
        title="Comprehensive Visual Sitemap & Search Index Directory"
        description="Explore the complete site map, indexed URLs, member directories, and research portals for LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC)."
        keywords={SITE_KEYWORDS}
        url="https://lexvanguard.xyz/sitemap"
        jsonLd={jsonLdSchema}
      />

      <Header />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 px-3.5 py-1.5 rounded-full text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Globe className="w-3.5 h-3.5" />
            <span>Search Engine Index & Sitemap Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight mb-4">
            LexVanguard Advocates LLP <span className="text-yellow-500">Sitemap</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Index directory for Mount Kenya University Parklands Law Campus (MKUPLC) premier student law firm, moot court advocacy hub, and youth in law initiatives.
          </p>
        </div>

        {/* Founding Members Highlight Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />
              <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
                Founding Members Index Highlight
              </h2>
            </div>
            <span className="text-xs text-yellow-500 font-semibold tracking-widest uppercase">
              MKUPLC Co-Owners
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FOUNDING_MEMBERS.filter((m) => m.isFoundingMember).map((member) => (
              <div
                key={member.slug}
                className="bg-gray-900/80 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-yellow-500 transition-all shadow-xl"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.title}`}
                    title={`${member.name} - ${member.title}`}
                    loading="lazy"
                    decoding="async"
                    className="w-16 h-16 rounded-xl object-cover border-2 border-yellow-500/40 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
                      Founding Partner
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-yellow-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-gray-400">{member.title}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-3">
                  {member.bio}
                </p>

                <Link
                  href={`/attorneys/${member.slug}`}
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-yellow-500 hover:text-white transition-colors mt-auto"
                >
                  View Full SEO Profile <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Indexed Pages Directory with Thumbnails and Descriptions */}
        <section className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <Layers className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-serif font-bold text-white uppercase tracking-wider">
              Complete Page Index Directory
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SITEMAP_PAGES.map((page) => (
              <div
                key={page.path}
                className="bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all flex flex-col group shadow-lg"
              >
                <div className="relative h-40 overflow-hidden bg-gray-950">
                  <img
                    src={page.thumbnail}
                    alt={page.title}
                    title={page.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-yellow-500/40 text-yellow-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {page.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-yellow-400 transition-colors mb-2 line-clamp-2">
                      {page.title}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-4">
                      {page.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-mono text-yellow-500">{page.path || "/"}</span>
                    <Link
                      href={page.path}
                      className="text-white hover:text-yellow-400 font-bold uppercase tracking-wider flex items-center gap-1"
                    >
                      Visit Route <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Keywords Cloud & Context Highlights */}
        <section className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-serif font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Search className="w-5 h-5 text-yellow-500" />
            <span>Search Engine Indexing Keywords & Terms</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {SITE_KEYWORDS.map((kw, idx) => (
              <span
                key={idx}
                className="bg-white/5 hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/30 text-gray-300 hover:text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-default"
              >
                #{kw}
              </span>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
