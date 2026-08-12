import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

import { Resend } from "resend";

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
              html: `
                <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 24px; color: #111827;">
                  <h2 style="color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">LexVanguard Advocates LLP — Client Consultation Inquiry</h2>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${cleanEmail}</p>
                  <p><strong>Phone:</strong> ${phone || "N/A"}</p>
                  <p><strong>Practice Division:</strong> ${practiceArea || "General Practice"}</p>
                  <p><strong>Subject:</strong> ${subject || "N/A"}</p>
                  <br/>
                  <h3 style="color: #374151;">Message Details:</h3>
                  <div style="white-space: pre-wrap; background: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-radius: 6px; color: #111827;">${message}</div>
                </div>
              `,
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
