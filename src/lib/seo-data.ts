export interface MemberSEO {
  slug: string;
  name: string;
  title: string;
  isFoundingMember: boolean;
  roleName: string;
  officeId: string;
  practice: string;
  campus: string;
  organization: string;
  bio: string;
  achievements: string[];
  skills: string[];
  image: string;
  email: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
  };
}

export const SITE_KEYWORDS = [
  "Mooting",
  "Student law firms",
  "Law firms",
  "Mount Kenya University",
  "Mount Kenya University Parklands Law Campus",
  "MKUPLC",
  "Student organizations",
  "Youth in law",
  "LexVanguard Advocates LLP",
  "Prince Micah",
  "Kelvin Musya",
  "Donel Aganyo",
  "Linet Njeri",
  "Legal Research Kenya",
  "Supreme Court Mooting",
  "Kenyan Law Students Association",
  "African Moot Court Championship"
];

export const FOUNDING_MEMBERS: MemberSEO[] = [
  {
    slug: "prince-micah",
    name: "Prince Micah",
    title: "Founding Partner & Co-Owner (Managing Partner)",
    isFoundingMember: true,
    roleName: "Managing Partner",
    officeId: "admin",
    practice: "Corporate & Tech Law, Mergers & Acquisitions, Legal Tech Strategy",
    campus: "Mount Kenya University Parklands Law Campus (MKUPLC)",
    organization: "LexVanguard Advocates LLP & Youth in Law Initiative",
    bio: "Prince Micah is a Founding Partner, Managing Partner, and Co-Owner of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). A recognized champion in student law firm innovation, moot court advocacy, and youth in law initiatives across Kenya.",
    achievements: [
      "Co-Founder & Managing Partner of LexVanguard Advocates LLP",
      "Pioneer of Youth in Law student organization leadership at MKUPLC",
      "Moot Court National Finalist & Appellate Advocate",
      "Developer of LexAI Legal Research Engine for Kenyan jurisprudence"
    ],
    skills: ["Corporate Law", "Mooting Strategy", "Tech Law", "Mergers & Acquisitions", "Firm Governance"],
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    email: "prince@lexvanguard.xyz"
  },
  {
    slug: "kelvin-musya",
    name: "Kelvin Musya",
    title: "Founding Partner & Co-Owner (Senior Partner)",
    isFoundingMember: true,
    roleName: "Senior Partner",
    officeId: "admin",
    practice: "Appellate Advocacy, Supreme Court Litigation, Constitutional Law",
    campus: "Mount Kenya University Parklands Law Campus (MKUPLC)",
    organization: "LexVanguard Advocates LLP & MKUPLC Mooting Society",
    bio: "Kelvin Musya is a Founding Partner, Senior Partner, and Co-Owner of LexVanguard Advocates LLP. Renowned for constitutional legal briefs and appellate advocacy at Mount Kenya University Parklands Law Campus (MKUPLC), guiding law students to national mooting victories.",
    achievements: [
      "Co-Founder & Senior Partner of LexVanguard Advocates LLP",
      "Lead Counsel in MKUPLC Appellate Moot Court Competitions",
      "Constitutional Law & Supreme Court Litigation Researcher",
      "Senior Mentor for Youth in Law & Law Student Organizations"
    ],
    skills: ["Appellate Advocacy", "Constitutional Law", "Supreme Court Briefs", "Mooting Coaching", "Litigation"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    email: "kelvin@lexvanguard.xyz"
  },
  {
    slug: "donel-aganyo",
    name: "Donel Aganyo",
    title: "Founding Partner & Co-Owner (Head of IP & Tech Law)",
    isFoundingMember: true,
    roleName: "Head of IP",
    officeId: "admin",
    practice: "Intellectual Property, Patent Litigation, Digital Law & AI Policy",
    campus: "Mount Kenya University Parklands Law Campus (MKUPLC)",
    organization: "LexVanguard Advocates LLP & Student Law Firm Network",
    bio: "Donel Aganyo is a Founding Partner, Co-Owner, and Head of Intellectual Property at LexVanguard Advocates LLP. Spearheading tech innovation, patent litigation, and student IP advisories at Mount Kenya University Parklands Law Campus (MKUPLC).",
    achievements: [
      "Co-Founder & Head of Intellectual Property at LexVanguard",
      "Pioneer in Technology & Patent Litigation for Youth in Law",
      "Architect of LexVanguard Digital Case Management Infrastructure",
      "MKU Parklands Law Campus Student Organization Strategist"
    ],
    skills: ["Intellectual Property", "Patent Litigation", "Cyber Law", "Student Law Firm Management"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
    email: "donel@lexvanguard.xyz"
  },
  {
    slug: "linet-njeri",
    name: "Linet Njeri",
    title: "Senior Finance Secretary & Head of Accounts",
    isFoundingMember: false,
    roleName: "Finance Secretary",
    officeId: "finance",
    practice: "Legal Accounting, Trust Audits, Escrow Management & Financial Strategy",
    campus: "Mount Kenya University Parklands Law Campus (MKUPLC)",
    organization: "LexVanguard Advocates LLP Finance Office",
    bio: "Linet Njeri heads the Finance Office at LexVanguard Advocates LLP. Managing financial administration, client escrow accounts, and firm budgetary compliance for Mount Kenya University student legal projects.",
    achievements: [
      "Head of Finance & Accounts Office at LexVanguard Chambers",
      "Manager of Legal Audit Compliance & Client Billing Systems",
      "Financial Auditor for MKUPLC Student Organization Symposia"
    ],
    skills: ["Financial Strategy", "Escrow Accounting", "Legal Billing", "Compliance Auditing"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
    email: "linet@lexvanguard.xyz"
  }
];

export const ORGANIZATIONAL_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "LexVanguard Advocates LLP",
  "alternateName": ["LexVanguard Chambers", "MKUPLC Student Law Firm", "LexVanguard Youth in Law"],
  "url": "https://lexvanguard.xyz",
  "logo": "https://lexvanguard.xyz/brand-logo.svg",
  "image": "https://lexvanguard.xyz/og-preview.png",
  "description": "LexVanguard Advocates LLP is Kenya's premier student law firm, based at Mount Kenya University Parklands Law Campus (MKUPLC). Specializing in mooting, corporate law, appellate advocacy, tech law, and youth in law initiatives.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Parklands Campus, Parklands Road",
    "addressLocality": "Nairobi",
    "addressRegion": "Nairobi County",
    "postalCode": "00100",
    "addressCountry": "KE"
  },
  "parentOrganization": {
    "@type": "EducationalOrganization",
    "name": "Mount Kenya University Parklands Law Campus (MKUPLC)",
    "url": "https://mku.ac.ke"
  },
  "founder": [
    {
      "@type": "Person",
      "name": "Prince Micah",
      "jobTitle": "Founding Partner & Co-Owner (Managing Partner)",
      "url": "https://lexvanguard.xyz/attorneys/prince-micah"
    },
    {
      "@type": "Person",
      "name": "Kelvin Musya",
      "jobTitle": "Founding Partner & Co-Owner (Senior Partner)",
      "url": "https://lexvanguard.xyz/attorneys/kelvin-musya"
    },
    {
      "@type": "Person",
      "name": "Donel Aganyo",
      "jobTitle": "Founding Partner & Co-Owner (Head of IP)",
      "url": "https://lexvanguard.xyz/attorneys/donel-aganyo"
    }
  ],
  "knowsAbout": [
    "Mooting",
    "Student Law Firms",
    "Youth in Law",
    "Mount Kenya University Parklands Law Campus",
    "Appellate Advocacy",
    "Intellectual Property",
    "Corporate Law Kenya"
  ],
  "sameAs": [
    "https://www.lexvanguard.xyz",
    "https://lexvanguard.xyz",
    "https://facebook.com/LexVanguardLLP",
    "https://twitter.com/LexVanguardLLP",
    "https://linkedin.com/company/lexvanguard-advocates-llp"
  ]
};

export function getMemberSchema(member: MemberSEO) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": member.name,
    "jobTitle": member.title,
    "worksFor": {
      "@type": "LegalService",
      "name": "LexVanguard Advocates LLP",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": "Mount Kenya University Parklands Law Campus (MKUPLC)"
      }
    },
    "description": member.bio,
    "image": member.image,
    "email": member.email,
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Mount Kenya University Parklands Law Campus (MKUPLC)"
    },
    "knowsAbout": member.skills,
    "url": `https://lexvanguard.xyz/attorneys/${member.slug}`
  };
}

export const SITEMAP_PAGES = [
  {
    path: "/",
    title: "LexVanguard Advocates LLP - Premier Student Law Firm & Mooting Hub",
    description: "Official homepage of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Excellence in mooting, youth in law, and student legal practice.",
    category: "Main",
    changefreq: "daily",
    priority: "1.0",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/attorneys",
    title: "Our Attorneys & Members - Founding Partners & Counsel Directory",
    description: "Meet the founding members Prince Micah, Kelvin Musya, Donel Aganyo, and counsel members of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus.",
    category: "Team Directory",
    changefreq: "weekly",
    priority: "0.9",
    thumbnail: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/attorneys/prince-micah",
    title: "Prince Micah - Founding Partner & Co-Owner | LexVanguard",
    description: "Profile of Prince Micah, Founding Partner & Managing Partner at LexVanguard Advocates LLP, MKUPLC. Champion of corporate law, mooting, and youth in law initiatives.",
    category: "Founding Member Profile",
    changefreq: "weekly",
    priority: "0.95",
    thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/attorneys/kelvin-musya",
    title: "Kelvin Musya - Founding Partner & Co-Owner | LexVanguard",
    description: "Profile of Kelvin Musya, Founding Partner & Senior Litigation Partner at LexVanguard Advocates LLP, MKUPLC. Leader in appellate advocacy and Supreme Court mooting.",
    category: "Founding Member Profile",
    changefreq: "weekly",
    priority: "0.95",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/attorneys/donel-aganyo",
    title: "Donel Aganyo - Founding Partner & Co-Owner | LexVanguard",
    description: "Profile of Donel Aganyo, Founding Partner & Head of IP at LexVanguard Advocates LLP, MKUPLC. Specialist in intellectual property, patent litigation, and legal tech.",
    category: "Founding Member Profile",
    changefreq: "weekly",
    priority: "0.95",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/events",
    title: "Events & Symposia - Moot Court Competitions & Conferences",
    description: "Explore upcoming moot court championships, legal symposia, and youth in law workshops hosted by LexVanguard Advocates LLP and Mount Kenya University Parklands Law Campus.",
    category: "Events",
    changefreq: "daily",
    priority: "0.85",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/research",
    title: "LexAI Legal Research Co-Helper - Kenyan Law Engine",
    description: "LexAI search-grounded legal research portal powered by Gemini for Kenyan statutes, Constitution of Kenya 2010, High Court & Supreme Court precedents.",
    category: "Tools & Portals",
    changefreq: "weekly",
    priority: "0.9",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/history",
    title: "Firm History & Legacy - Mount Kenya University Parklands Law Campus",
    description: "The founding journey of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC) and the rise of student law firm excellence in Kenya.",
    category: "About & History",
    changefreq: "monthly",
    priority: "0.8",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/services",
    title: "Practice Areas - Corporate Law, Appellate Advocacy & IP",
    description: "Comprehensive list of practice areas at LexVanguard Advocates LLP including appellate advocacy, corporate law, intellectual property, and moot court training.",
    category: "Services",
    changefreq: "monthly",
    priority: "0.8",
    thumbnail: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/sitemap",
    title: "Comprehensive Sitemap & Search Engine Index Directory",
    description: "Complete indexed visual sitemap and navigation directory of all pages, member profiles, research portals, and event archives for LexVanguard Advocates LLP.",
    category: "SEO & Indexing",
    changefreq: "daily",
    priority: "0.7",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/login",
    title: "Counsel Portal Login - LexVanguard Chambers",
    description: "Secure login portal for authenticated LexVanguard Advocates LLP counsel members and administrative officers.",
    category: "Portal",
    changefreq: "monthly",
    priority: "0.5",
    thumbnail: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600"
  },
  {
    path: "/register",
    title: "Counsel Activation & Member Onboarding",
    description: "Invitation-based counsel activation and onboarding portal for new members of LexVanguard Advocates LLP.",
    category: "Portal",
    changefreq: "monthly",
    priority: "0.5",
    thumbnail: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600"
  }
];
