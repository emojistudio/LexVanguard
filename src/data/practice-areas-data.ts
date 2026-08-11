export interface DetailedPractice {
  id: string;
  title: string;
  shortOverview: string;
  services: string[];
  whoWeHelp: string[];
}

export interface PracticeGroup {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  practices: DetailedPractice[];
}

export const PRACTICE_GROUPS: PracticeGroup[] = [
  {
    id: "dispute-resolution",
    number: "01",
    title: "Dispute Resolution & Litigation",
    description: "Resolving disputes through strategic advocacy, negotiation, litigation, and alternative dispute resolution.",
    iconName: "Scale",
    practices: [
      {
        id: "civil-litigation",
        title: "Civil Litigation & Dispute Resolution",
        shortOverview: "Providing strategic representation in commercial and civil disputes before the High Court, Court of Appeal, and Supreme Court of Kenya. We focus on risk mitigation, tactical pleadings, and decisive courtroom representation.",
        services: [
          "Commercial breach of contract litigation",
          "Injunctions and urgent interim orders",
          "Appellate advocacy and brief writing",
          "Enforcement of local and foreign judgements",
          "Debt recovery and insolvency proceedings",
          "Pre-litigation risk assessments"
        ],
        whoWeHelp: [
          "Corporations & Enterprises",
          "Financial Institutions",
          "High-Net-Worth Individuals",
          "Government Entities"
        ]
      },
      {
        id: "criminal-law",
        title: "Criminal Law & Criminal Procedure",
        shortOverview: "Defending fundamental constitutional rights, procedural safeguards, and due process in high-stakes white-collar, regulatory, and general criminal defense proceedings.",
        services: [
          "White-collar crime defense & fraud investigations",
          "Bail and bond applications",
          "Representation in criminal trials & appeals",
          "Constitutional petitions regarding illegal detention",
          "Advisory on statutory compliance & anti-corruption",
          "Cross-border extradition litigation"
        ],
        whoWeHelp: [
          "Individual Clients",
          "Corporate Executives",
          "Public Officials",
          "Institutional Clients"
        ]
      },
      {
        id: "small-claims",
        title: "Small Claims Procedure",
        shortOverview: "Providing expedited legal resolution for commercial claims under KES 1,000,000 via the Small Claims Court, ensuring fast turnaround and cost-effective enforcement.",
        services: [
          "Drafting Statement of Claims and Responses",
          "Representation in Small Claims Court hearings",
          "Expedited debt recovery",
          "Negotiated settlement agreements",
          "Execution of court warrants"
        ],
        whoWeHelp: [
          "SMEs & Startups",
          "Individual Creditors",
          "Service Providers",
          "Sole Proprietors"
        ]
      },
      {
        id: "adr",
        title: "Alternative Dispute Resolution (ADR)",
        shortOverview: "Guiding clients through commercial arbitration, mediation, and conciliation to reach confidential, binding, and mutually beneficial settlements.",
        services: [
          "Domestic & International Arbitration under CIArb rules",
          "Court-Annexed & Private Mediation",
          "Drafting airtight ADR and arbitration clauses",
          "Enforcement and setting aside of arbitral awards",
          "Dispute Adjudication Board (DAB) representation"
        ],
        whoWeHelp: [
          "Construction & Infrastructure Firms",
          "Joint Venture Partners",
          "Multinational Corporations",
          "Commercial Parties"
        ]
      },
      {
        id: "tort-law",
        title: "Tort Law & Civil Wrongs",
        shortOverview: "Litigating complex claims arising from professional negligence, defamation, product liability, personal injury, and economic torts.",
        services: [
          "Defamation and reputational damage claims",
          "Medical, legal, and professional negligence",
          "Occupiers' liability & workplace accidents",
          "Economic torts and unlawful interference",
          "Product liability claims"
        ],
        whoWeHelp: [
          "Injured Individuals",
          "Businesses & Professionals",
          "Insurance Entities",
          "Media & Public Figures"
        ]
      },
      {
        id: "legal-research-advocacy",
        title: "Legal Research & Strategic Advocacy",
        shortOverview: "Delivering deep statutory analysis, comparative legal research, and appellate brief preparation grounded in comprehensive jurisprudence.",
        services: [
          "Statutory interpretation & legislative auditing",
          "Bench memo preparation for complex litigation",
          "Comparative constitutional jurisprudence research",
          "Expert legal opinions on novel points of law",
          "Policy briefs for legal reform"
        ],
        whoWeHelp: [
          "Senior Counsel & Legal Teams",
          "Think Tanks & Academic Institutions",
          "Law Firms needing specialized research",
          "Advocacy Organizations"
        ]
      }
    ]
  },
  {
    id: "corporate-commercial",
    number: "02",
    title: "Corporate, Commercial & Financial Law",
    description: "Strategic legal solutions for businesses, transactions, investments, contracts, and financial matters.",
    iconName: "Briefcase",
    practices: [
      {
        id: "commercial-corporate",
        title: "Commercial & Corporate Law",
        shortOverview: "Advising corporate entities from incorporation through entity structuring, joint ventures, corporate governance, mergers, and statutory compliance.",
        services: [
          "Company incorporation & share capital structuring",
          "Corporate governance auditing & board advisory",
          "Mergers & Acquisitions (M&A) due diligence",
          "Shareholders' Agreements & Articles customization",
          "Regulatory compliance with the Companies Act",
          "Company secretarial support"
        ],
        whoWeHelp: [
          "Established Corporations",
          "Growing Enterprises",
          "Board of Directors",
          "International Investors"
        ]
      },
      {
        id: "contract-law",
        title: "Law of Contract & Commercial Drafting",
        shortOverview: "Designing, negotiating, and reviewing airtight commercial agreements crafted to minimize legal exposure and enforce commercial intent.",
        services: [
          "Drafting complex commercial & supply contracts",
          "Service Level Agreements (SLAs) & NDAs",
          "Franchise, licensing, and distribution agreements",
          "Contractual risk audits & breach remedies advice",
          "International commercial terms (INCOTERMS)"
        ],
        whoWeHelp: [
          "Commercial Vendors",
          "Distributors & Suppliers",
          "Technology Enterprises",
          "Service Organizations"
        ]
      },
      {
        id: "banking-finance",
        title: "Banking & Finance Law",
        shortOverview: "Representing financial institutions, borrowers, and fintech innovators in debt financing, loan perfection, security documentation, and regulatory compliance.",
        services: [
          "Drafting loan agreements, charges, & debentures",
          "Perfection of land & asset securities",
          "Fintech regulatory licensing with CBK",
          "Project finance & syndicated lending advice",
          "Restructuring & insolvency workouts"
        ],
        whoWeHelp: [
          "Commercial Banks & Micro-financiers",
          "Fintech Companies",
          "Corporate Borrowers",
          "Private Equity Funds"
        ]
      },
      {
        id: "tax-law",
        title: "Tax Law & Revenue Planning",
        shortOverview: "Providing strategic tax advisory, transfer pricing review, corporate tax structuring, and dispute representation before the Tax Appeals Tribunal.",
        services: [
          "Tax dispute litigation before Tax Appeals Tribunal",
          "Corporate income tax & VAT advisory",
          "Cross-border tax structuring & treaty relief",
          "KRA tax audit defense & negotiations",
          "Stamp duty & capital gains tax optimizations"
        ],
        whoWeHelp: [
          "Multinational Corporations",
          "Local Businesses",
          "Investors & Property Developers",
          "Executive Taxpayers"
        ]
      },
      {
        id: "intellectual-property",
        title: "Intellectual Property Law",
        shortOverview: "Protecting, commercializing, and enforcing proprietary trademarks, patents, copyrights, industrial designs, and trade secrets in Kenya and regionally.",
        services: [
          "Trademark registration with KIPI and ARIPO",
          "Copyright protection & digital media rights",
          "IP licensing & technology transfer agreements",
          "IP infringement litigation & cease & desist orders",
          "Trade secret protection policies"
        ],
        whoWeHelp: [
          "Innovators & Tech Founders",
          "Creative Agencies & Artists",
          "Pharmaceutical & Manufacturing Brands",
          "Startups"
        ]
      },
      {
        id: "cyber-law-evidence",
        title: "Technology, Cyber Law & Digital Evidence",
        shortOverview: "Navigating data protection compliance under the Data Protection Act 2019, cybercrime defense, digital evidence authentication, and SaaS legal frameworks.",
        services: [
          "Data Protection Impact Assessments (DPIA)",
          "Data controller & processor registration with ODPC",
          "Cybercrime statutory compliance & defense",
          "Digital evidence admissibility under Evidence Act Sec 106B",
          "AI, Cloud, and Software-as-a-Service contracts"
        ],
        whoWeHelp: [
          "Tech Platforms & E-Commerce Firms",
          "Data-Driven Enterprises",
          "Fintech Developers",
          "Healthcare & Telemedicine Platforms"
        ]
      }
    ]
  },
  {
    id: "property-family",
    number: "03",
    title: "Property, Employment & Family Law",
    description: "Protecting rights and interests relating to property, employment, families, and personal legal affairs.",
    iconName: "Home",
    practices: [
      {
        id: "property-land",
        title: "Property & Land Law",
        shortOverview: "Advising on real estate conveyancing, land title verification, lease agreements, environment and land court litigation, and property development.",
        services: [
          "Title deed searches & due diligence at Ardhi House",
          "Drafting Agreement for Sale & Transfer documents",
          "Commercial & residential lease drafting",
          "Environment & Land Court (ELC) litigation",
          "Subdivisions, changes of user, & perfection of titles"
        ],
        whoWeHelp: [
          "Property Buyers & Sellers",
          "Real Estate Developers",
          "Landlords & Commercial Tenants",
          "Agricultural Land Owners"
        ]
      },
      {
        id: "employment-labour",
        title: "Employment & Labour Law",
        shortOverview: "Guiding employers and employees through employment contracts, statutory workplace compliance, unfair termination claims, and trade union disputes.",
        services: [
          "Drafting employment contracts & HR policy manuals",
          "Representation in Employment & Labour Relations Court (ELRC)",
          "Redundancy procedure advisory & execution",
          "Workplace sexual harassment & safety audits",
          "Trade union negotiations & collective bargaining"
        ],
        whoWeHelp: [
          "Corporate Employers",
          "Executive Employees",
          "Human Resource Directors",
          "Trade Associations"
        ]
      },
      {
        id: "family-children",
        title: "Family & Children Law",
        shortOverview: "Handling sensitive family legal matters including matrimonial property division, child custody, probate administration, and estate planning with confidentiality.",
        services: [
          "Wills drafting & estate planning advisory",
          "Petition for Grant of Probate & Letters of Administration",
          "Matrimonial property litigation & prenuptial agreements",
          "Child maintenance, custody, & guardianship petitions",
          "Adoption proceedings & legal guardianship"
        ],
        whoWeHelp: [
          "Families & Individuals",
          "Estate Executors & Trustees",
          "Guardians & Custodians",
          "High-Net-Worth Estate Planning Clients"
        ]
      },
      {
        id: "tort-law-personal",
        title: "Tort Law & Personal Wrongs",
        shortOverview: "Protecting personal dignity, physical integrity, bodily autonomy, and private property rights from unlawful harm or civil trespass.",
        services: [
          "Motor vehicle accident personal injury claims",
          "Medical malpractice litigation",
          "Nuisance & trespass to land actions",
          "Privacy violation & unlawful surveillance claims"
        ],
        whoWeHelp: [
          "Individual Claimants",
          "Property Owners",
          "Families",
          "Aggrieved Litigants"
        ]
      }
    ]
  },
  {
    id: "constitutional-public",
    number: "04",
    title: "Constitutional, Human Rights & Public Law",
    description: "Protecting fundamental rights, promoting accountability, and navigating constitutional and public law.",
    iconName: "ShieldCheck",
    practices: [
      {
        id: "constitutional-administrative",
        title: "Constitutional & Administrative Law",
        shortOverview: "Challenging unconstitutional legislation, executive excess, and administrative unfairness through judicial review and constitutional petitions.",
        services: [
          "Drafting Constitutional Petitions under Article 22 & 258",
          "Judicial Review orders (Certiorari, Prohibition, Mandamus)",
          "Challenging illegal administrative action under Fair Administrative Action Act",
          "Representation in the High Court Constitutional Bench",
          "Legislative validity challenges"
        ],
        whoWeHelp: [
          "Citizens & Public Interest Litigants",
          "Civil Society Organizations",
          "State Officers & Parastatals",
          "Public Sector Bodies"
        ]
      },
      {
        id: "human-rights",
        title: "Human Rights & Social Justice",
        shortOverview: "Advocating for civil liberties, socio-economic rights, equality, anti-discrimination, and public interest litigation across East Africa.",
        services: [
          "Public Interest Litigation (PIL)",
          "Amicus Curiae (Friend of Court) briefs",
          "Socio-economic rights enforcement (Article 43)",
          "Freedom of expression & assembly petitions",
          "Protection of vulnerable groups & minority rights"
        ],
        whoWeHelp: [
          "Human Rights Defenders",
          "Non-Governmental Organizations (NGOs)",
          "Community Based Organizations",
          "Public Advocates"
        ]
      },
      {
        id: "international-law",
        title: "International Law & Treaty Practice",
        shortOverview: "Advising on public international law, international human rights treaties, regional integration frameworks (EAC, AfCFTA), and diplomatic immunity.",
        services: [
          "East African Court of Justice (EACJ) litigation",
          "Treaty interpretation under Vienna Convention rules",
          "AfCFTA cross-border trade legal advisory",
          "International Court of Justice (ICJ) precedent analysis",
          "Diplomatic immunity & privileges advisory"
        ],
        whoWeHelp: [
          "Regional Enterprises",
          "Diplomatic Missions",
          "International Non-Profits",
          "Multinational Bodies"
        ]
      },
      {
        id: "legal-aid",
        title: "Legal Aid & Access to Justice",
        shortOverview: "Pioneering pro bono legal aid, community legal education, and structural interventions to ensure access to justice for underserved populations.",
        services: [
          "Pro bono criminal defense & bail assistance",
          "Legal literacy workshops & community legal clinics",
          "Legal Aid Act compliance & paralegal support",
          "Court user committee advocacy"
        ],
        whoWeHelp: [
          "Indigent Litigants",
          "Community Organizations",
          "Underrepresented Groups",
          "Legal Aid Bodies"
        ]
      },
      {
        id: "public-advocacy",
        title: "Legal Research & Public Advocacy",
        shortOverview: "Conducting rigorous legal research to inform legislative drafting, policy policy papers, and structural legal reforms in public governance.",
        services: [
          "Policy drafting & legislative memorandum analysis",
          "Public participation submissions on pending Bills",
          "Governance & anti-corruption policy reviews",
          "Comparative statutory research"
        ],
        whoWeHelp: [
          "Legislators & Policy Makers",
          "Public Interest Foundations",
          "Research Institutes",
          "Civic Coalitions"
        ]
      }
    ]
  },
  {
    id: "advisory-regulatory",
    number: "05",
    title: "Advisory, Regulatory & Emerging Law",
    description: "Forward-looking legal advice for regulatory, technological, environmental, and emerging legal challenges.",
    iconName: "Compass",
    practices: [
      {
        id: "legal-consultations",
        title: "Legal Consultations & Strategic Advisory",
        shortOverview: "Delivering proactive legal risk management, opinion writing, and strategic consultations tailored to dynamic operational environments.",
        services: [
          "Executive legal opinions & risk assessments",
          "Pre-transaction legal strategic planning",
          "Crisis management & legal reputation protection",
          "Ongoing corporate retainer services"
        ],
        whoWeHelp: [
          "C-Suite Executives",
          "Entrepreneurs & Founders",
          "Government Agencies",
          "Foreign Entities"
        ]
      },
      {
        id: "environmental-climate",
        title: "Environmental & Climate Change Law",
        shortOverview: "Guiding clients through NEMA compliance, Environmental Impact Assessments (EIA), carbon credit transactions, and climate litigation.",
        services: [
          "National Environment Management Authority (NEMA) licensing",
          "National Environment Tribunal (NET) appeals",
          "Carbon credit trading contracts & ESG compliance",
          "Natural resource extraction legal advisory",
          "Environmental audit & compliance reviews"
        ],
        whoWeHelp: [
          "Renewable Energy Developers",
          "Mining & Infrastructure Operators",
          "Environmental Non-Profits",
          "Agribusinesses"
        ]
      },
      {
        id: "cyber-law-emerging",
        title: "Technology, Cyber Law & Digital Evidence",
        shortOverview: "Pioneering legal governance frameworks for artificial intelligence, blockchain, cybersecurity, digital identity, and electronic commerce.",
        services: [
          "Artificial Intelligence (AI) ethics & compliance frameworks",
          "Crypto, Web3, & FinTech legal structuring",
          "Cross-border data transfer compliance",
          "Cybersecurity incident response protocols"
        ],
        whoWeHelp: [
          "AI & Tech Startups",
          "E-Commerce Platforms",
          "Digital Asset Exchanges",
          "Enterprise Software Companies"
        ]
      },
      {
        id: "ip-innovation",
        title: "Intellectual Property & Innovation Law",
        shortOverview: "Protecting technological innovations, proprietary algorithms, utility models, and research discoveries.",
        services: [
          "Patent drafting & filing through KIPI & PCT",
          "University & institutional IP policy development",
          "Technology transfer & commercialization advice",
          "Open-source software license auditing"
        ],
        whoWeHelp: [
          "Research Institutions",
          "Tech Hubs & Accelerators",
          "Inventors & Software Engineers",
          "Bio-tech Firms"
        ]
      },
      {
        id: "international-trade-law",
        title: "International Law & Cross-Border Regulatory",
        shortOverview: "Assisting international commercial actors with customs compliance, cross-border trade disputes, investment treaties, and foreign exchange regulations.",
        services: [
          "EAC Customs Management Act advisory",
          "Bilateral Investment Treaty (BIT) protections",
          "Sanctions & export control compliance",
          "Cross-border trade dispute resolution"
        ],
        whoWeHelp: [
          "Import/Export Companies",
          "Foreign Direct Investors",
          "Logistics & Shipping Lines",
          "International Traders"
        ]
      },
      {
        id: "tax-compliance",
        title: "Tax Law & Fiscal Compliance",
        shortOverview: "Providing forward-looking tax compliance frameworks, transfer pricing documentation, and international tax planning for modern businesses.",
        services: [
          "Transfer pricing policy formulation",
          "Cross-border withholding tax advisory",
          "Tax incentive & Special Economic Zone (SEZ) structuring",
          "Voluntary tax disclosure procedures"
        ],
        whoWeHelp: [
          "Multinational Corporations",
          "SEZ Enterprise Developers",
          "Financial Investors",
          "Cross-Border Traders"
        ]
      },
      {
        id: "regulatory-advisory",
        title: "Regulatory & Compliance Advisory",
        shortOverview: "Navigating complex statutory licensing, anti-money laundering (AML/CFT) frameworks, competition law audits, and sector-specific regulators.",
        services: [
          "Competition Authority of Kenya (CAK) merger approvals",
          "Anti-Money Laundering (AML/CFT) compliance policies",
          "Sectoral licensing (Communications Authority, CBK, IRA, EPRA)",
          "Regulatory compliance audits & risk matrices"
        ],
        whoWeHelp: [
          "Telecom & Media Companies",
          "Energy & Power Developers",
          "Insurance & Financial Firms",
          "Regulated Entities"
        ]
      }
    ]
  }
];
