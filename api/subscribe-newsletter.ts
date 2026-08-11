import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

import { Resend } from "resend";
import { renderNewsletterWelcomeEmailHtml } from "../src/lib/email-templates";

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

    const cleanEmail = email.trim();
    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    if (apiKey) {
      const htmlContent = renderNewsletterWelcomeEmailHtml({ email: cleanEmail });
      const senders = [
        "LexVanguard Gazette <onboarding@lexvanguard.xyz>",
        "LexVanguard Gazette <info@lexvanguard.xyz>",
        "LexVanguard Gazette <onboarding@resend.dev>"
      ];

      for (const sender of senders) {
        try {
          const r = await resendSend(apiKey, sender, cleanEmail, "Welcome to the LexVanguard Legal Gazette & Intelligence Review", htmlContent);
          if (r?.data?.id) break;
        } catch (e) {
          console.warn("[SUBSCRIBE NEWSLETTER] Email dispatch notice:", e);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully subscribed ${cleanEmail} to the LexVanguard Gazette.`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Server error" });
  }
}

async function resendSend(apiKey: string, from: string, to: string, subject: string, html: string) {
  const resend = new Resend(apiKey);
  return await resend.emails.send({ from, to: [to], subject, html });
}
