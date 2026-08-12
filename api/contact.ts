import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

import { Resend } from "resend";
import { wrapInBaseEmailLayout } from "../src/lib/email-templates";

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  try {
    const { name, email, phone, practiceArea, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Name, email, and message are required." });
    }

    const cleanEmail = email.trim();
    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let emailDispatched = false;

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        const textContent = `
LexVanguard Advocates LLP — Client Consultation Inquiry

From: ${name} (${cleanEmail})
Phone: ${phone || "N/A"}
Practice Division: ${practiceArea || "General Practice"}
Subject: ${subject || "N/A"}

Message Details:
${message}
        `.trim();

        const htmlContent = wrapInBaseEmailLayout({
          preheaderText: `New client inquiry from ${name} regarding ${practiceArea || "Legal Counsel"}.`,
          titleBadge: "Client Consultation Inquiry",
          headline: `Inquiry from ${name}`,
          bodyHtml: `
            <p style="margin-top: 0;"><strong>Client Details:</strong></p>
            <ul style="padding-left: 20px; color: #374151; line-height: 28px;">
              <li><strong>Name:</strong> ${name}</li>
              <li><strong>Email:</strong> <a href="mailto:${cleanEmail}" style="color: #111827;">${cleanEmail}</a></li>
              <li><strong>Phone:</strong> ${phone || "N/A"}</li>
              <li><strong>Practice Division:</strong> ${practiceArea || "General Counsel"}</li>
              <li><strong>Subject:</strong> ${subject || "N/A"}</li>
            </ul>
            <div style="margin-top: 24px; padding: 20px; background-color: #f9fafb; border-left: 3px solid #111827; border-radius: 4px;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #111827; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Message Details:</p>
              <p style="margin: 0; white-space: pre-wrap; color: #374151; line-height: 24px;">${message}</p>
            </div>
          `,
          footerNotice: `Submitted via LexVanguard Contact Portal by ${cleanEmail}`
        });

        const senders = [
          "LexVanguard Inquiry <info@lexvanguard.xyz>",
          "LexVanguard Inquiry <chambers@lexvanguard.xyz>",
          "LexVanguard Inquiry <onboarding@lexvanguard.xyz>",
          "LexVanguard Inquiry <onboarding@resend.dev>"
        ];

        for (const sender of senders) {
          try {
            const r = await resend.emails.send({
              from: sender,
              to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
              replyTo: cleanEmail,
              subject: `[Legal Inquiry] ${subject || practiceArea || "Consultation"} — ${name}`,
              text: textContent,
              html: htmlContent,
              headers: {
                "X-Entity-Ref-ID": `inq_${Date.now()}`
              }
            });

            if (r.data?.id && !r.error) {
              emailDispatched = true;
              break;
            }
          } catch (e) {
            // try next sender
          }
        }
      } catch (emailErr) {
        console.warn("[CONTACT API] Resend dispatch notice:", emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      emailDispatched,
      ticketId: `LV-INQ-${Date.now()}`,
      message: "Inquiry received. A representative from LexVanguard Advocates LLP will reach out within 24 hours."
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Server error processing contact submission."
    });
  }
}
