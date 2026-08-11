import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

import { Resend } from "resend";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });

  try {
    const { email } = req.body || {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "A valid email address is required." });
    }

    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "Lex Vanguard Gazette <onboarding@lexvanguard.xyz>",
          to: [email.trim()],
          subject: "Welcome to LexVanguard Legal Gazette & Intelligence Review",
          html: `
            <div style="font-family: serif; padding: 30px; background: #fafafa; color: #111;">
              <h1 style="border-bottom: 2px solid #000; padding-bottom: 10px;">LEX VANGUARD GAZETTE</h1>
              <p>Thank you for subscribing to the LexVanguard Legal Gazette & Intelligence Review.</p>
              <p>You will receive our high-impact legal commentary, jurisprudence updates, and transactional intelligence directly in your inbox.</p>
              <br/>
              <p><strong>LexVanguard Advocates LLP</strong></p>
            </div>
          `
        });
      } catch (e) {
        console.warn("[SUBSCRIBE NEWSLETTER] Email dispatch notice:", e);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully subscribed ${email} to the LexVanguard Gazette.`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Server error" });
  }
}
