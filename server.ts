import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS headers for all routes and handle OPTIONS preflight
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "LexVanguard LLP Portal" });
  });

  // Dynamic XML Sitemap for Search Engines with Real-time Updates & Image Metadata
  app.get("/sitemap.xml", (req, res) => {
    const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.get("host") || "lexvanguard.xyz";
    const baseUrl = `${protocol}://${host}`;
    const nowISO = new Date().toISOString().split("T")[0];

    const pages: Array<{
      path: string;
      priority: string;
      changefreq: string;
      image?: { loc: string; title: string; caption?: string };
    }> = [
      // Core Firm Portal Pages
      {
        path: "",
        priority: "1.00",
        changefreq: "daily",
        image: {
          loc: `${baseUrl}/brand-logo.svg`,
          title: "LexVanguard Advocates LLP - Premier Law Firm Portal",
          caption: "Mount Kenya University Parklands Law Campus Premier Student Law Firm"
        }
      },
      { path: "/sitemap", priority: "0.80", changefreq: "daily" },
      { path: "/history", priority: "0.85", changefreq: "monthly" },
      { path: "/services", priority: "0.90", changefreq: "weekly" },
      { path: "/careers", priority: "0.75", changefreq: "monthly" },
      { path: "/contact", priority: "0.80", changefreq: "monthly" },
      { path: "/login", priority: "0.60", changefreq: "monthly" },
      { path: "/register", priority: "0.60", changefreq: "monthly" },
      { path: "/user/profile", priority: "0.70", changefreq: "daily" },
      { path: "/user/settings", priority: "0.50", changefreq: "monthly" },

      // Founding Partners & Executive Leadership Directory
      {
        path: "/attorneys",
        priority: "0.95",
        changefreq: "daily",
        image: {
          loc: `${baseUrl}/images/profiles/prince.jpeg`,
          title: "LexVanguard Advocates LLP Founding Partners & Leadership"
        }
      },

      // Prince Micah: Founding Partner & Managing Partner
      {
        path: "/attorneys/prince-micah",
        priority: "0.98",
        changefreq: "daily",
        image: {
          loc: `${baseUrl}/images/profiles/prince.jpeg`,
          title: "Prince Micah - Founding Partner & Managing Partner",
          caption: "Managing Partner, Corporate Law & Legal Tech Pioneer at LexVanguard Advocates LLP"
        }
      },
      { path: "/attorneys/prince-micah/bio", priority: "0.90", changefreq: "weekly" },
      { path: "/attorneys/prince-micah/practice-areas", priority: "0.90", changefreq: "weekly" },
      { path: "/attorneys/prince-micah/corporate-m-and-a", priority: "0.90", changefreq: "weekly" },
      { path: "/attorneys/prince-micah/legal-tech-strategy", priority: "0.95", changefreq: "weekly" },
      { path: "/attorneys/prince-micah/publications", priority: "0.88", changefreq: "weekly" },
      { path: "/attorneys/prince-micah/cases", priority: "0.88", changefreq: "weekly" },
      { path: "/attorneys/prince-micah/media-interviews", priority: "0.85", changefreq: "monthly" },
      { path: "/attorneys/prince-micah/contact", priority: "0.85", changefreq: "weekly" },

      // Kelvin Musya: Founding Partner & Senior Litigation Partner
      {
        path: "/attorneys/kelvin-musya",
        priority: "0.98",
        changefreq: "daily",
        image: {
          loc: `${baseUrl}/images/profiles/kelvin.jpeg`,
          title: "Kelvin Musya - Founding Partner & Senior Litigation Partner",
          caption: "Senior Litigation Partner, Supreme Court Briefs & Appellate Advocacy Lead"
        }
      },
      { path: "/attorneys/kelvin-musya/bio", priority: "0.90", changefreq: "weekly" },
      { path: "/attorneys/kelvin-musya/practice-areas", priority: "0.90", changefreq: "weekly" },
      { path: "/attorneys/kelvin-musya/appellate-advocacy", priority: "0.95", changefreq: "weekly" },
      { path: "/attorneys/kelvin-musya/constitutional-law", priority: "0.92", changefreq: "weekly" },
      { path: "/attorneys/kelvin-musya/supreme-court-briefs", priority: "0.92", changefreq: "weekly" },
      { path: "/attorneys/kelvin-musya/publications", priority: "0.88", changefreq: "weekly" },
      { path: "/attorneys/kelvin-musya/court-rulings", priority: "0.85", changefreq: "monthly" },
      { path: "/attorneys/kelvin-musya/contact", priority: "0.85", changefreq: "weekly" },

      // Donel Aganyo: Founding Partner & Head of Intellectual Property
      {
        path: "/attorneys/donel-aganyo",
        priority: "0.98",
        changefreq: "daily",
        image: {
          loc: `${baseUrl}/images/profiles/don.jpeg`,
          title: "Donel Aganyo - Founding Partner & Head of Intellectual Property",
          caption: "Head of IP & Tech Law, Patent Litigation & Cyber Policy Strategist"
        }
      },
      { path: "/attorneys/donel-aganyo/bio", priority: "0.90", changefreq: "weekly" },
      { path: "/attorneys/donel-aganyo/practice-areas", priority: "0.90", changefreq: "weekly" },
      { path: "/attorneys/donel-aganyo/intellectual-property", priority: "0.95", changefreq: "weekly" },
      { path: "/attorneys/donel-aganyo/patent-litigation", priority: "0.92", changefreq: "weekly" },
      { path: "/attorneys/donel-aganyo/cyber-law", priority: "0.92", changefreq: "weekly" },
      { path: "/attorneys/donel-aganyo/publications", priority: "0.88", changefreq: "weekly" },
      { path: "/attorneys/donel-aganyo/ip-registered-patents", priority: "0.85", changefreq: "monthly" },
      { path: "/attorneys/donel-aganyo/contact", priority: "0.85", changefreq: "weekly" },

      // Linet Njeri: Senior Finance Secretary
      {
        path: "/attorneys/linet-njeri",
        priority: "0.88",
        changefreq: "weekly",
        image: {
          loc: `${baseUrl}/images/profiles/linet.jpeg`,
          title: "Linet Njeri - Senior Finance Secretary",
          caption: "Head of Accounts & Financial Compliance at LexVanguard Advocates LLP"
        }
      },
      { path: "/attorneys/linet-njeri/bio", priority: "0.80", changefreq: "monthly" },
      { path: "/attorneys/linet-njeri/contact", priority: "0.75", changefreq: "monthly" },

      // AI Legal Research Tools & LexAI Technology Suite
      { path: "/research", priority: "0.98", changefreq: "daily" },
      { path: "/research/ai-assistant", priority: "0.99", changefreq: "daily" },
      { path: "/research/ai-case-analyzer", priority: "0.95", changefreq: "daily" },
      { path: "/research/ai-contract-reviewer", priority: "0.95", changefreq: "daily" },
      { path: "/research/ai-brief-generator", priority: "0.96", changefreq: "daily" },
      { path: "/research/ai-statute-search", priority: "0.94", changefreq: "daily" },
      { path: "/research/ai-precedent-finder", priority: "0.95", changefreq: "daily" },
      { path: "/research/ai-due-diligence", priority: "0.92", changefreq: "daily" },
      { path: "/research/ai-compliance-checker", priority: "0.92", changefreq: "daily" },
      { path: "/research/ai-jurisprudence", priority: "0.90", changefreq: "weekly" },
      { path: "/research/ai-citation-generator", priority: "0.90", changefreq: "weekly" },
      { path: "/research/ai-legal-translator", priority: "0.88", changefreq: "weekly" },
      { path: "/research/ai-due-diligence-checklist", priority: "0.88", changefreq: "weekly" },
      { path: "/research/ai-contract-clause-library", priority: "0.88", changefreq: "weekly" },
      { path: "/research/ai-judicial-analytics", priority: "0.90", changefreq: "weekly" },
      { path: "/research/moot-court-prep", priority: "0.93", changefreq: "weekly" },
      { path: "/research/law-library", priority: "0.92", changefreq: "daily" },

      // Legal Practice Services & Specialized Departments
      { path: "/services/corporate-m-and-a", priority: "0.88", changefreq: "weekly" },
      { path: "/services/constitutional-litigation", priority: "0.88", changefreq: "weekly" },
      { path: "/services/intellectual-property", priority: "0.88", changefreq: "weekly" },
      { path: "/services/tech-and-data-protection", priority: "0.88", changefreq: "weekly" },
      { path: "/services/commercial-dispute-resolution", priority: "0.85", changefreq: "weekly" },
      { path: "/services/banking-and-fintech-law", priority: "0.85", changefreq: "weekly" },
      { path: "/services/taxation-and-revenue-law", priority: "0.82", changefreq: "weekly" },
      { path: "/services/employment-and-labor-relations", priority: "0.82", changefreq: "weekly" },
      { path: "/services/environment-and-land-court", priority: "0.80", changefreq: "weekly" },
      { path: "/services/appellate-advocacy-mkuplc", priority: "0.90", changefreq: "weekly" },

      // Mount Kenya University Parklands Law Campus (MKUPLC) Chapters
      { path: "/mkuplc/mooting-society", priority: "0.88", changefreq: "weekly" },
      { path: "/mkuplc/human-rights-center", priority: "0.85", changefreq: "weekly" },
      { path: "/mkuplc/youth-in-law-council", priority: "0.88", changefreq: "weekly" },
      { path: "/mkuplc/legal-aid-chambers", priority: "0.85", changefreq: "weekly" },

      // Events, Moot Court Competitions & Campus Conferences
      { path: "/events", priority: "0.90", changefreq: "daily" },
      { path: "/events/national-moot-court-2026", priority: "0.92", changefreq: "daily" },
      { path: "/events/mkuplc-law-symposium", priority: "0.88", changefreq: "weekly" },
      { path: "/events/african-human-rights-moot", priority: "0.88", changefreq: "weekly" },
      { path: "/events/legal-tech-innovation-summit", priority: "0.90", changefreq: "weekly" },
      { path: "/events/youth-in-law-webinar", priority: "0.85", changefreq: "weekly" },
      { path: "/events/legal-aid-clinic-parklands", priority: "0.82", changefreq: "weekly" },

      // History, Heritage & Research Publications
      { path: "/history/founding-story", priority: "0.85", changefreq: "monthly" },
      { path: "/history/mkuplc-legacy", priority: "0.85", changefreq: "monthly" },
      { path: "/research/publications/kenyan-constitution-review-2026", priority: "0.85", changefreq: "monthly" },
      { path: "/research/publications/ai-in-african-jurisprudence", priority: "0.88", changefreq: "monthly" },
      { path: "/research/publications/ip-protection-for-tech-startups-nairobi", priority: "0.85", changefreq: "monthly" },
      { path: "/research/publications/moot-court-appellate-winning-tactics", priority: "0.88", changefreq: "monthly" }
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map((p) => {
    let item = `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${nowISO}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>`;
    if (p.image) {
      item += `
    <image:image>
      <image:loc>${p.image.loc}</image:loc>
      <image:title>${p.image.title}</image:title>`;
      if (p.image.caption) {
        item += `
      <image:caption>${p.image.caption}</image:caption>`;
      }
      item += `
    </image:image>`;
    }
    item += `
  </url>`;
    return item;
  })
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // Robots.txt endpoint
  app.get("/robots.txt", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host") || "lexvanguard.xyz"}`;
    const txt = `User-agent: *
Allow: /
Allow: /attorneys
Allow: /attorneys/*
Allow: /events
Allow: /history
Allow: /research
Allow: /services
Allow: /sitemap
Disallow: /office/

Sitemap: ${baseUrl}/sitemap.xml`;

    res.header("Content-Type", "text/plain");
    res.send(txt);
  });

  // Google Search Console HTML Verification File Endpoint
  app.get("/googlef3644fe7d8075345.html", (req, res) => {
    res.header("Content-Type", "text/html");
    res.send("google-site-verification: googlef3644fe7d8075345.html");
  });

  // Resend Email Endpoint for Team Member Invitations
  app.post("/api/send-invite", async (req, res) => {
    try {
      const { email, name, invitedBy, invitedByEmail, inviteUrl } = req.body;

      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ success: false, error: "A valid invitee email address is required." });
      }

      if (!inviteUrl || typeof inviteUrl !== "string") {
        return res.status(400).json({ success: false, error: "An activation URL is required." });
      }

      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ success: false, error: "RESEND_API_KEY environment variable is not configured on the server." });
      }

      const resend = new Resend(apiKey);

      const inviteeName = name?.trim() || "Counsel";
      const senderName = invitedBy || "Kelvin Musya";
      const senderEmail = invitedByEmail || "kelvin@lexvanguard.xyz";

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family:'Segoe UI', Arial, Helvetica, sans-serif; color:#222222;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f5f7; padding:40px 10px;">
  <tr>
    <td align="center">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px; background-color:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e6e6e6; box-shadow:0 12px 35px rgba(0,0,0,0.06);">
        
        <!-- HEADER -->
        <tr>
          <td style="background-color:#0A1F44; padding:45px 40px; color:#ffffff;">
            <div style="font-size:28px; font-weight:700; letter-spacing:0.8px; color:#ffffff; font-family:'Georgia', serif;">
              Lex <span style="color:#C9A55C;">Vanguard</span> Chambers
            </div>
            <div style="margin-top:10px; font-size:13px; color:#d9d9d9; letter-spacing:0.5px; text-transform:uppercase;">
              Excellence in Advocacy &bull; Integrity in Service &bull; Innovation in Practice
            </div>
          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="padding:45px 40px; line-height:1.8; font-size:15px; color:#333333;">
            <p style="margin:0 0 20px; font-size:17px; color:#0A1F44; font-weight:600;">
              Dear <strong>${inviteeName}</strong>,
            </p>

            <p style="margin:0 0 20px;">
              On behalf of <strong style="color:#0A1F44;">Lex Vanguard Chambers</strong>, we are pleased to extend this formal invitation for you to join the Firm as <strong>Counsel</strong>.
            </p>

            <p style="margin:0 0 20px;">
              This invitation has been issued by <strong>${senderName}</strong> (<a href="mailto:${senderEmail}" style="color:#0A1F44; text-decoration:none;">${senderEmail}</a>) following your nomination to become a member of our Chambers. We are confident that your admission will contribute to the continued pursuit of legal excellence, professional integrity, and innovation that define our practice.
            </p>

            <!-- INVITATION BOX -->
            <div style="margin:30px 0; padding:28px; background-color:#fafafa; border-left:4px solid #C9A55C; border-radius:4px;">
              <p style="margin:0 0 14px; font-weight:600; color:#0A1F44;">
                To complete your onboarding, activate your account using the secure button below. During registration you will:
              </p>

              <ul style="margin:0 0 25px; padding-left:20px; line-height:2; color:#444444;">
                <li>Verify your professional details</li>
                <li>Create a secure password</li>
                <li>Establish your Counsel Office</li>
                <li>Gain access to the Lex Vanguard Chambers platform</li>
              </ul>

              <div style="text-align:left; margin:25px 0 15px 0;">
                <a href="${inviteUrl}" target="_blank" style="background-color:#0A1F44; color:#ffffff; text-decoration:none; padding:15px 32px; border-radius:6px; font-weight:700; font-size:14px; display:inline-block; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(10,31,68,0.2);">
                  Activate Your Counsel Account
                </a>
              </div>

              <p style="margin:15px 0 0 0; font-size:12px; color:#777777; word-break:break-all;">
                If the button above does not work, copy and paste the invitation URL into your browser:<br>
                <a href="${inviteUrl}" style="color:#0A1F44;">${inviteUrl}</a>
              </p>
            </div>

            <p style="margin:0 0 20px;">
              Upon successful registration, you will receive immediate access to your dedicated digital workspace, including case management, secure collaboration tools, legal resources, internal communications, and firm-wide administrative services.
            </p>

            <div style="height:1px; background-color:#ececec; margin:30px 0;"></div>

            <p style="margin:0; font-size:12px; color:#777777; line-height:1.6;">
              For your security, this invitation is confidential and intended solely for the recipient named above. Please do not forward or share this email. If you believe you have received this invitation in error, kindly disregard it and notify the sender.
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:30px 40px; background-color:#fafafa; border-top:1px solid #ececec;">
            <div style="font-size:14px; line-height:1.7; color:#333333;">
              Kind regards,<br><br>
              <strong style="color:#0A1F44; font-size:15px;">Lex Vanguard Chambers Administration</strong>
            </div>

            <div style="margin-top:20px; font-size:12px; color:#888888; font-style:italic; letter-spacing:0.4px;">
              Excellence in Advocacy &bull; Integrity in Service &bull; Innovation in Practice
            </div>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

      let sendResult = await resend.emails.send({
        from: "Lex Vanguard Chambers <onboarding@lexshub.xyz>",
        to: [email.trim()],
        subject: "Official Invitation to Join Lex Vanguard Chambers as Counsel",
        html: htmlContent,
      });

      if (sendResult.error) {
        console.warn("Primary domain send notice:", sendResult.error.message);
        // Retry via Resend default sandbox sender
        sendResult = await resend.emails.send({
          from: "Lex Vanguard Chambers <onboarding@resend.dev>",
          to: [email.trim()],
          subject: "Official Invitation to Join Lex Vanguard Chambers as Counsel",
          html: htmlContent,
        });
      }

      if (sendResult.error) {
        console.warn("Resend email delivery notice:", sendResult.error.message);
        // Even if direct SMTP delivery fails (e.g. domain verification or recipient testing limits), return success with the activation URL
        return res.json({
          success: true,
          emailDispatched: false,
          inviteUrl,
          message: `Invitation generated! Note: ${sendResult.error.message}. You can copy the activation link below.`,
          data: sendResult.data
        });
      }

      return res.json({
        success: true,
        emailDispatched: true,
        inviteUrl,
        message: "Invitation email dispatched successfully via Resend",
        data: sendResult.data
      });
    } catch (err: any) {
      console.error("Resend API Exception:", err);
      return res.status(500).json({
        success: false,
        error: err?.message || "An unexpected server error occurred while sending the email."
      });
    }
  });

  // LexAI Legal Research API endpoint powered by Gemini with Google Search Grounding
  app.post("/api/lexai", async (req, res) => {
    try {
      const { query, matterTitle, caseContext } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Legal query parameter is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          answer: `LexAI Statutory & Case Law Research for "${query}":\n\n• Legal Framework: Laws of Kenya & Constitution of Kenya 2010.\n• Precedents: Relevant authority under the High Court, Court of Appeal, and Supreme Court of Kenya.\n• Note: Configure GEMINI_API_KEY in environment for live AI search-grounded legal research.`,
          sources: []
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const promptText = `You are LexAI, an elite legal research co-helper for LexVanguard Chambers.
${matterTitle ? `Case / Matter Context: ${matterTitle}` : ""}
${caseContext ? `Case Facts & Context: ${caseContext}` : ""}

Research Query: ${query}

Provide a comprehensive, authoritative legal research response. Include:
1. Core Legal Principles & Statutory Provisions (citing specific sections from Constitution of Kenya 2010, Civil Procedure Act, Companies Act, Data Protection Act, Evidence Act, or relevant legal codes).
2. Key Judicial Precedents & Ratio Decidendi (referencing High Court, Court of Appeal, or Supreme Court decisions).
3. Strategic Legal Analysis & Recommendations for Counsel.
4. Summary Arguments to present in court or advisory brief.

Use Google Search grounding to retrieve real-time authentic precedents, statutory citations, and court rulings. Format with clear headings and bullet points.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "No specific legal research result generated.";
      
      // Extract grounding source citations
      const sources: Array<{ title: string; uri: string }> = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(chunks)) {
        chunks.forEach((chunk: any) => {
          if (chunk?.web?.uri) {
            sources.push({
              title: chunk.web.title || chunk.web.uri,
              uri: chunk.web.uri
            });
          }
        });
      }

      return res.json({ answer: text, sources });
    } catch (error: any) {
      console.error("LexAI Error:", error);
      return res.status(500).json({ 
        error: "Failed to process legal research query",
        details: error.message 
      });
    }
  });

  // API Endpoint: Document Analysis & Case Material Review
  app.post("/api/research/analyze-document", async (req, res) => {
    try {
      const { documentTitle, documentContent, matterTitle } = req.body;
      if (!documentContent || typeof documentContent !== "string") {
        return res.status(400).json({ error: "Document content is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          analysis: `Document Analysis for "${documentTitle || 'Legal Material'}":\n\n1. Key Facts: Document contains legal arguments or evidence for ${matterTitle || 'active case'}.\n2. Applicable Statutes: Civil Procedure Act & Evidence Act Cap 80.\n3. Note: Attach GEMINI_API_KEY for complete AI legal breakdown.`
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const promptText = `You are a Senior Legal Analyst for LexVanguard Chambers.
Analyze the following case document/material for ${matterTitle ? `Matter: "${matterTitle}"` : "the firm's legal file"}.

Document Title: ${documentTitle || "Case Document"}
Document Content:
"""
${documentContent}
"""

Please provide a structured legal analysis report:
1. Executive Summary & Core Objective of the Document
2. Key Material Facts & Admissions
3. Statutory & Precedent Foundations
4. Potential Vulnerabilities & Opposing Counter-Arguments
5. Recommended Follow-Up Actions & Evidence Gathering`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
      });

      return res.json({ analysis: response.text || "Analysis completed." });
    } catch (error: any) {
      console.error("Document Analysis Error:", error);
      return res.status(500).json({ error: "Failed to analyze legal document", details: error.message });
    }
  });

  // API Endpoint: Draft Court Submissions & Briefs
  app.post("/api/research/draft-submission", async (req, res) => {
    try {
      const { submissionType, matterTitle, clientName, facts, researchNotes, courtForum } = req.body;
      if (!submissionType || !matterTitle) {
        return res.status(400).json({ error: "Submission type and matter title are required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          draft: `IN THE ${courtForum || "HIGH COURT OF KENYA"}\n\nMATTER: ${matterTitle}\nCLIENT: ${clientName || "Client"}\n\n[DRAFT ${submissionType.toUpperCase()}]\n\n1. Take notice that the Applicant intends to move this Honorable Court for orders under the Civil Procedure Rules.\n2. Ground 1: Based on established statutory authorities.\n\n(Configure GEMINI_API_KEY for full AI submission drafting)`
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      const promptText = `You are a Master Legal Drafter at LexVanguard Chambers.
Draft a complete, formal, highly detailed ${submissionType} for court filing or legal client advisory.

CASE DETAILS:
- Court / Forum: ${courtForum || "High Court of Kenya"}
- Matter Title: ${matterTitle}
- Client Name: ${clientName || "The Client / Applicant"}
- Background Facts: ${facts || "As set out in the pleadings and supporting affidavit."}
- Legal Research & Precedent Notes: ${researchNotes || "Standard statutory requirements under Kenyan law."}

DRAFTING INSTRUCTIONS:
- Use formal legal court language, standard numbering, statutory citations, and formal preamble (IN THE COURT OF...).
- Include specific legal grounds, statutory sections, and case citations (using Google Search grounding if needed for real citations).
- Provide a clear, comprehensive "PRAYER FOR RELIEF" or "LEGAL CONCLUSION" section.
- Formatted in clear Markdown suitable for copying directly into court filings or word processors.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: promptText,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      return res.json({ draft: response.text || "Submission draft created." });
    } catch (error: any) {
      console.error("Drafting Error:", error);
      return res.status(500).json({ error: "Failed to generate submission draft", details: error.message });
    }
  });

  // Serve static images directory directly
  const imagesPath = path.join(process.cwd(), "images");
  const publicImagesPath = path.join(process.cwd(), "public", "images");
  app.use("/images", express.static(imagesPath));
  app.use("/images", express.static(publicImagesPath));

  // Serve Vite in development mode or static dist in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LexVanguard server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
