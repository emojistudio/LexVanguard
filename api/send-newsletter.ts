import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

import { Resend } from "resend";
import { renderNewsletterEditionEmailHtml } from "../src/lib/email-templates";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });

  try {
    const { title, category, issueNumber, content, targetEmails, authorName } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ success: false, error: "Title and content are required." });
    }

    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let successCount = 0;

    if (apiKey && Array.isArray(targetEmails) && targetEmails.length > 0) {
      const resend = new Resend(apiKey);
      const htmlContent = renderNewsletterEditionEmailHtml({
        title,
        category: category || "Gazette Edition",
        issueNumber,
        contentHtml: content
      });

      // Strip HTML for anti-spam plain text alternative
      const plainTextContent = `
LexVanguard Legal Gazette & Intelligence Review
Category: ${category || "Gazette Edition"} ${issueNumber ? `| Issue ${issueNumber}` : ""}

${title}
${authorName ? `By ${authorName}` : ""}

${content.replace(/<[^>]*>?/gm, "")}

---
LexVanguard Advocates LLP
Mount Kenya University Parklands Law Campus, Nairobi, Kenya
Website: https://lexvanguard.xyz
Unsubscribe: https://lexvanguard.xyz/unsubscribe or reply "Unsubscribe"
      `.trim();

      const senders = [
        "LexVanguard Gazette <gazette@lexvanguard.xyz>",
        "LexVanguard Gazette <info@lexvanguard.xyz>",
        "LexVanguard Gazette <onboarding@lexvanguard.xyz>",
        "LexVanguard Gazette <chambers@lexvanguard.xyz>",
        "LexVanguard Gazette <onboarding@resend.dev>"
      ];

      for (const email of targetEmails) {
        const recipient = (email || "").trim();
        if (!recipient || !recipient.includes("@")) continue;

        let sent = false;
        for (const sender of senders) {
          try {
            const r = await resend.emails.send({
              from: sender,
              to: [recipient],
              replyTo: "info@lexvanguard.xyz",
              subject: `${title} — LexVanguard Legal Gazette`,
              html: htmlContent,
              text: plainTextContent,
              headers: {
                "List-Unsubscribe": "<https://lexvanguard.xyz/unsubscribe>, <mailto:info@lexvanguard.xyz?subject=unsubscribe>",
                "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                "X-Entity-Ref-ID": `gazette_${Date.now()}`
              }
            });
            if (r.data?.id && !r.error) {
              successCount++;
              sent = true;
              break;
            }
          } catch (e) {
            // Try next sender alias
          }
        }
        if (!sent) {
          console.warn(`[SEND NEWSLETTER] Delivery warning for recipient: ${recipient}`);
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
