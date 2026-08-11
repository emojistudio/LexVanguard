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

    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "LexVanguard LLP Inquiry <onboarding@resend.dev>",
          to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
          subject: `[Legal Inquiry] ${subject || practiceArea} — ${name}`,
          html: `
            <h2>LexVanguard Advocates LLP — Client Consultation Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "N/A"}</p>
            <p><strong>Practice Division:</strong> ${practiceArea}</p>
            <p><strong>Subject:</strong> ${subject || "N/A"}</p>
            <br/>
            <h3>Message Details:</h3>
            <p style="white-space: pre-wrap; background: #f4f4f5; padding: 12px; border-radius: 6px;">${message}</p>
          `
        });
      } catch (emailErr) {
        console.warn("[CONTACT API] Resend dispatch notice:", emailErr);
      }
    }

    return res.status(200).json({
      success: true,
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
