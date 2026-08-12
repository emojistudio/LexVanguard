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
  // Primary Entity Keywords
  "LexVanguard",
  "LexVanguard Advocates LLP",
  "LexVanguard Chambers",
  "LexVanguard Advocates",
  "lexvanguard.xyz",
  
  // Key Founders & Executive Leadership
  "Prince Micah",
  "Prince Micah Law",
  "Prince Micah MKU",
  "Prince Micah Founder",
  "Prince Micah LexVanguard",
  "Prince Micah Managing Partner",
  "Kelvin Musya",
  "Kelvin Musya Law",
  "Kelvin Musya MKU",
  "Kelvin Musya Founder",
  "Kelvin Musya LexVanguard",
  "Kelvin Musya Senior Partner",
  "Donel Aganyo",
  "Donel Aganyo Law",
  "Donel Aganyo MKU",
  "Donel Aganyo Founder",
  "Donel Aganyo LexVanguard",
  "Linet Njeri",
  
  // Institution & Location Terms
  "Mount Kenya University",
  "Mount Kenya University Parklands Law Campus",
  "MKUPLC",
  "MKU",
  "MKU Law School",
  "Mount Kenya University Law Students",
  "Parklands Law Campus Nairobi",
  "Kenya Law Schools",
  
  // Student Organizations & Student Law Firms
  "Student Law Firms",
  "Student Led Law Firms",
  "Student Organizations",
  "Student Led Groups",
  "Student Led Initiatives",
  "Youth in Law",
  "Youth in Law Initiative",
  "Student Advocacy Groups",
  "Law Student Association Kenya",
  "Kenyan Student Legal Organizations",
  "Global Student Law Firms",
  "African Student Legal Network",
  
  // Practice & Competitions
  "Mooting",
  "Moot Court",
  "Moot Court Kenya",
  "Mooting Champions",
  "Appellate Advocacy",
  "Supreme Court Mooting",
  "All Africa Moot Court Championship",
  "International Law Mooting",
  "Legal Research Kenya",
  "Corporate Law Kenya",
  "Intellectual Property Kenya",
  "Legal Tech Strategy",
  "Law Firms",
  "Law Firms Kenya",
  "Kenyan Jurisprudence"
];

export const FOUNDING_MEMBERS: MemberSEO[] = [
  {
    slug: "prince-micah",
    name: "Prince Micah",
    title: "Co-Founder & Managing Partner (Co-Owner)",
    isFoundingMember: true,
    roleName: "Managing Partner",
    officeId: "admin",
    practice: "Corporate & Commercial Law, Mergers & Acquisitions, Legal Tech Strategy & System Infrastructure",
    campus: "Mount Kenya University Parklands Law Campus (MKUPLC)",
    organization: "LexVanguard Advocates LLP & Youth in Law Initiative",
    bio: "Prince Micah is a Co-Founder, Managing Partner, and Co-Owner of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Architect and developer of the global LexVanguard digital platform (lexvanguard.xyz), Prince Micah is a celebrated visionary in student law firm innovation, appellate moot court advocacy, and youth legal empowerment across Africa.",
    achievements: [
      "Co-Founder & Managing Partner of LexVanguard Advocates LLP",
      "Architect and Developer of lexvanguard.xyz legal platform & LexAI Research Engine",
      "Pioneer of Youth in Law student organization leadership at MKUPLC",
      "Moot Court National Finalist & Senior Appellate Advocate",
      "Strategist for Student Law Firm Institutional Governance"
    ],
    skills: ["Corporate Law", "Mooting Strategy", "Legal Tech Infrastructure", "Mergers & Acquisitions", "Firm Governance", "Systemic Advocacy"],
    image: "https://www.lexvanguard.xyz/images/profiles/prince.jpeg",
    email: "prince@lexvanguard.xyz"
  },
  {
    slug: "kelvin-musya",
    name: "Kelvin Musya",
    title: "Co-Founder & Chief Strategist (Co-Owner)",
    isFoundingMember: true,
    roleName: "Senior Partner",
    officeId: "admin",
    practice: "Appellate Advocacy, Supreme Court Litigation, Constitutional Law & Institutional Strategy",
    campus: "Mount Kenya University Parklands Law Campus (MKUPLC)",
    organization: "LexVanguard Advocates LLP & MKUPLC Mooting Society",
    bio: "Kelvin Musya is a Co-Founder, Chief Strategist, and Co-Owner of LexVanguard Advocates LLP. Renowned for constitutional legal briefs, appellate oral advocacy, and strategic leadership at Mount Kenya University Parklands Law Campus (MKUPLC), Kelvin guides emerging advocates to national moot court triumphs and institutional impact.",
    achievements: [
      "Co-Founder & Chief Strategist of LexVanguard Advocates LLP",
      "Lead Counsel in MKUPLC Appellate Moot Court Competitions",
      "Constitutional Law & Supreme Court Litigation Researcher",
      "Senior Mentor for Youth in Law & Law Student Organizations across Kenya"
    ],
    skills: ["Appellate Advocacy", "Constitutional Law", "Supreme Court Briefs", "Mooting Coaching", "Strategic Planning", "Litigation"],
    image: "https://www.lexvanguard.xyz/images/profiles/kelvin.jpeg",
    email: "kelvin@lexvanguard.xyz"
  },
  {
    slug: "donel-aganyo",
    name: "Donel Aganyo",
    title: "Co-Founder & Head of Intellectual Property (Co-Owner)",
    isFoundingMember: true,
    roleName: "Head of IP",
    officeId: "admin",
    practice: "Intellectual Property, Patent Litigation, Advocacy Training & Community Outreach",
    campus: "Mount Kenya University Parklands Law Campus (MKUPLC)",
    organization: "LexVanguard Advocates LLP & Student Law Firm Network",
    bio: "Donel Aganyo is a Co-Founder, Co-Owner, and Head of Intellectual Property at LexVanguard Advocates LLP. Leading advocacy training, IP enforcement, and student community outreach at Mount Kenya University Parklands Law Campus (MKUPLC), Donel ensures law students master real-world courtroom delivery.",
    achievements: [
      "Co-Founder & Head of Intellectual Property at LexVanguard",
      "Director of Advocacy Training & Mooting Excellence Workshops",
      "Pioneer in Technology & Patent Litigation for Youth in Law",
      "MKU Parklands Law Campus Student Organization Strategist"
    ],
    skills: ["Intellectual Property", "Patent Litigation", "Advocacy Training", "Public Speaking", "Student Law Firm Management"],
    image: "https://www.lexvanguard.xyz/images/profiles/don.jpeg",
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
    image: "https://www.lexvanguard.xyz/images/profiles/linet.jpeg",
    email: "linet@lexvanguard.xyz"
  }
];

export const ORGANIZATIONAL_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LegalService",
      "@id": "https://www.lexvanguard.xyz/#organization",
      "name": "LexVanguard Advocates LLP",
      "alternateName": [
        "LexVanguard",
        "LexVanguard Chambers",
        "MKUPLC Student Law Firm",
        "LexVanguard Youth in Law",
        "Mount Kenya University Student Law Firm"
      ],
      "url": "https://www.lexvanguard.xyz",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.lexvanguard.xyz/#logo",
        "url": "https://www.lexvanguard.xyz/logo.png",
        "contentUrl": "https://www.lexvanguard.xyz/logo.png",
        "caption": "LexVanguard Advocates LLP Official Seal and Crest",
        "width": "512",
        "height": "512"
      },
      "image": [
        {
          "@type": "ImageObject",
          "url": "https://www.lexvanguard.xyz/images/profiles/prince.jpeg",
          "caption": "Prince Micah - Co-Founder & Managing Partner at LexVanguard Advocates LLP, MKUPLC",
          "creditText": "LexVanguard Advocates LLP",
          "copyrightNotice": "© LexVanguard Advocates LLP"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.lexvanguard.xyz/images/profiles/kelvin.jpeg",
          "caption": "Kelvin Musya - Co-Founder & Chief Strategist at LexVanguard Advocates LLP, MKUPLC",
          "creditText": "LexVanguard Advocates LLP",
          "copyrightNotice": "© LexVanguard Advocates LLP"
        },
        {
          "@type": "ImageObject",
          "url": "https://www.lexvanguard.xyz/images/profiles/don.jpeg",
          "caption": "Donel Aganyo - Co-Founder & Head of IP at LexVanguard Advocates LLP, MKUPLC",
          "creditText": "LexVanguard Advocates LLP",
          "copyrightNotice": "© LexVanguard Advocates LLP"
        }
      ],
      "description": "LexVanguard Advocates LLP is Africa's premier student-led law firm and moot court powerhouse based at Mount Kenya University Parklands Law Campus (MKUPLC). Founded by Prince Micah, Kelvin Musya, and Donel Aganyo. Championing mooting excellence, legal research, youth in law, and systemic advocacy globally.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Mount Kenya University Parklands Law Campus, Parklands Road",
        "addressLocality": "Nairobi",
        "addressRegion": "Nairobi County",
        "postalCode": "00100",
        "addressCountry": "KE"
      },
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": "Mount Kenya University Parklands Law Campus (MKUPLC)",
        "alternateName": ["MKUPLC", "Mount Kenya University Law School"],
        "url": "https://mku.ac.ke"
      },
      "founder": [
        {
          "@type": "Person",
          "@id": "https://www.lexvanguard.xyz/attorneys/prince-micah#person",
          "name": "Prince Micah",
          "alternateName": ["Prince Micah MKU", "Prince Micah LexVanguard"],
          "jobTitle": "Co-Founder & Managing Partner (Co-Owner)",
          "url": "https://www.lexvanguard.xyz/attorneys/prince-micah",
          "image": {
            "@type": "ImageObject",
            "url": "https://www.lexvanguard.xyz/images/profiles/prince.jpeg",
            "caption": "Prince Micah - Co-Founder & Managing Partner of LexVanguard Advocates LLP"
          },
          "worksFor": { "@id": "https://www.lexvanguard.xyz/#organization" },
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "Mount Kenya University Parklands Law Campus (MKUPLC)"
          }
        },
        {
          "@type": "Person",
          "@id": "https://www.lexvanguard.xyz/attorneys/kelvin-musya#person",
          "name": "Kelvin Musya",
          "alternateName": ["Kelvin Musya MKU", "Kelvin Musya LexVanguard"],
          "jobTitle": "Co-Founder & Chief Strategist (Co-Owner)",
          "url": "https://www.lexvanguard.xyz/attorneys/kelvin-musya",
          "image": {
            "@type": "ImageObject",
            "url": "https://www.lexvanguard.xyz/images/profiles/kelvin.jpeg",
            "caption": "Kelvin Musya - Co-Founder & Chief Strategist of LexVanguard Advocates LLP"
          },
          "worksFor": { "@id": "https://www.lexvanguard.xyz/#organization" },
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "Mount Kenya University Parklands Law Campus (MKUPLC)"
          }
        },
        {
          "@type": "Person",
          "@id": "https://www.lexvanguard.xyz/attorneys/donel-aganyo#person",
          "name": "Donel Aganyo",
          "alternateName": ["Donel Aganyo MKU", "Donel Aganyo LexVanguard"],
          "jobTitle": "Co-Founder & Head of Intellectual Property (Co-Owner)",
          "url": "https://www.lexvanguard.xyz/attorneys/donel-aganyo",
          "image": {
            "@type": "ImageObject",
            "url": "https://www.lexvanguard.xyz/images/profiles/don.jpeg",
            "caption": "Donel Aganyo - Co-Founder & Head of IP at LexVanguard Advocates LLP"
          },
          "worksFor": { "@id": "https://www.lexvanguard.xyz/#organization" },
          "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "Mount Kenya University Parklands Law Campus (MKUPLC)"
          }
        }
      ],
      "knowsAbout": [
        "Mooting",
        "Moot Court Competitions",
        "Student Law Firms",
        "Youth in Law",
        "Mount Kenya University Parklands Law Campus",
        "MKUPLC",
        "Appellate Advocacy",
        "Intellectual Property",
        "Corporate Law Kenya",
        "Legal Tech Infrastructure"
      ],
      "sameAs": [
        "https://www.lexvanguard.xyz",
        "https://facebook.com/LexVanguardLLP",
        "https://twitter.com/LexVanguardLLP",
        "https://linkedin.com/company/lexvanguard-advocates-llp"
      ]
    }
  ]
};

export function getMemberSchema(member: MemberSEO) {
  const imageUrl = member.image.startsWith("http") ? member.image : `https://www.lexvanguard.xyz${member.image}`;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `https://www.lexvanguard.xyz/attorneys/${member.slug}#person`,
    "name": member.name,
    "jobTitle": member.title,
    "worksFor": {
      "@type": "LegalService",
      "name": "LexVanguard Advocates LLP",
      "url": "https://www.lexvanguard.xyz",
      "parentOrganization": {
        "@type": "EducationalOrganization",
        "name": "Mount Kenya University Parklands Law Campus (MKUPLC)",
        "url": "https://mku.ac.ke"
      }
    },
    "description": member.bio,
    "image": {
      "@type": "ImageObject",
      "url": imageUrl,
      "contentUrl": imageUrl,
      "caption": `${member.name} - ${member.title} at LexVanguard Advocates LLP, MKUPLC`,
      "creditText": "LexVanguard Advocates LLP",
      "copyrightNotice": "© LexVanguard Advocates LLP"
    },
    "email": member.email,
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Mount Kenya University Parklands Law Campus (MKUPLC)"
    },
    "knowsAbout": member.skills,
    "url": `https://www.lexvanguard.xyz/attorneys/${member.slug}`
  };
}

export const SITEMAP_PAGES = [
  {
    path: "/",
    title: "LexVanguard Advocates LLP | Premier Student Law Firm & Mooting Powerhouse",
    description: "Official portal of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Founded by Prince Micah, Kelvin Musya, and Donel Aganyo. Global leaders in student law firm practice, moot court championships, and youth in law initiatives.",
    category: "Main",
    changefreq: "daily",
    priority: "1.0",
    thumbnail: "https://www.lexvanguard.xyz/images/profiles/prince.jpeg"
  },
  {
    path: "/attorneys",
    title: "Our Counsel & Founding Partners - Prince Micah, Kelvin Musya, Donel Aganyo | LexVanguard",
    description: "Discover the founding partners Prince Micah, Kelvin Musya, Donel Aganyo, and elite legal scholars of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC).",
    category: "Team Directory",
    changefreq: "weekly",
    priority: "0.95",
    thumbnail: "https://www.lexvanguard.xyz/images/profiles/prince.jpeg"
  },
  {
    path: "/attorneys/prince-micah",
    title: "Prince Micah - Co-Founder & Managing Partner | LexVanguard Advocates LLP",
    description: "Profile of Prince Micah, Co-Founder and Managing Partner of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Architect of the LexVanguard platform, moot court advocate, and corporate legal tech leader.",
    category: "Founding Member Profile",
    changefreq: "weekly",
    priority: "0.98",
    thumbnail: "https://www.lexvanguard.xyz/images/profiles/prince.jpeg"
  },
  {
    path: "/attorneys/kelvin-musya",
    title: "Kelvin Musya - Co-Founder & Chief Strategist | LexVanguard Advocates LLP",
    description: "Profile of Kelvin Musya, Co-Founder and Chief Strategist of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC). Lead appellate counsel and mentor in Supreme Court mooting.",
    category: "Founding Member Profile",
    changefreq: "weekly",
    priority: "0.98",
    thumbnail: "https://www.lexvanguard.xyz/images/profiles/kelvin.jpeg"
  },
  {
    path: "/attorneys/donel-aganyo",
    title: "Donel Aganyo - Co-Founder & Head of IP | LexVanguard Advocates LLP",
    description: "Profile of Donel Aganyo, Co-Founder and Head of Intellectual Property at LexVanguard Advocates LLP, Mount Kenya University Parklands Law Campus (MKUPLC). Specialist in IP litigation and advocacy training.",
    category: "Founding Member Profile",
    changefreq: "weekly",
    priority: "0.98",
    thumbnail: "https://www.lexvanguard.xyz/images/profiles/don.jpeg"
  },
  {
    path: "/history",
    title: "Firm History & Legacy - Mount Kenya University Parklands Law Campus",
    description: "Explore the historic founding journey of LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus (MKUPLC), established by Prince Micah, Kelvin Musya, and Donel Aganyo.",
    category: "About & History",
    changefreq: "monthly",
    priority: "0.90",
    thumbnail: "https://www.lexvanguard.xyz/images/profiles/prince.jpeg"
  },
  {
    path: "/events",
    title: "Moot Court Symposia & Conferences | LexVanguard Advocates LLP",
    description: "National moot court competitions, legal research workshops, and youth in law conferences hosted by LexVanguard Advocates LLP at Mount Kenya University Parklands Law Campus.",
    category: "Events",
    changefreq: "daily",
    priority: "0.90",
    thumbnail: "https://www.lexvanguard.xyz/logo.png"
  },
  {
    path: "/research",
    title: "LexAI Legal Research Co-Helper - Search Grounded Kenya Law Portal",
    description: "Search-grounded legal research portal powered by Gemini for Kenyan statutes, Constitution 2010, High Court & Supreme Court rulings developed by LexVanguard Advocates LLP.",
    category: "Tools & Portals",
    changefreq: "weekly",
    priority: "0.95",
    thumbnail: "https://www.lexvanguard.xyz/logo.png"
  },
  {
    path: "/practice-areas",
    title: "Practice Areas & Legal Specializations | LexVanguard Advocates LLP",
    description: "Appellate advocacy, corporate law, intellectual property, constitutional petitions, and tech law practice areas at LexVanguard Advocates LLP.",
    category: "Services",
    changefreq: "monthly",
    priority: "0.85",
    thumbnail: "https://www.lexvanguard.xyz/logo.png"
  }
];
