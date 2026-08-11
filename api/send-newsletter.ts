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
    const { title, content, targetEmails } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ success: false, error: "Title and content are required." });
    }

    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let successCount = 0;
    if (apiKey && Array.isArray(targetEmails) && targetEmails.length > 0) {
      const resend = new Resend(apiKey);
      for (const email of targetEmails) {
        try {
          const r = await resend.emails.send({
            from: "Lex Vanguard Gazette <onboarding@lexvanguard.xyz>",
            to: [email],
            subject: title,
            html: `<div style="font-family: serif; padding: 25px;"><h1>${title}</h1><div>${content}</div></div>`
          });
          if (r.data?.id) successCount++;
        } catch (e) {
          console.warn("Newsletter dispatch failed for", email, e);
        }
      }
    }

    return res.status(200).json({
      success: true,
      delivered: successCount,
      message: `Newsletter edition dispatched to ${successCount} subscriber(s).`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Server error" });
  }
}
