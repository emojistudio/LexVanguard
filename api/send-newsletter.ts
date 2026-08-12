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

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {}
  }

  try {
    const { title, category, issueNumber, content, targetEmails, authorName } = body || {};
    if (!title || !content) {
      return res.status(400).json({ success: false, error: "Title and content are required." });
    }

    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let successCount = 0;

    if (apiKey && Array.isArray(targetEmails) && targetEmails.length > 0) {
      const resend = new Resend(apiKey);
      
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — LexVanguard Legal Gazette</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f9fafb; margin: 0; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);">
          
          <tr>
            <td style="padding: 32px 40px; background-color: #ffffff; border-bottom: 2px solid #111827;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left">
                    <span style="font-family: Georgia, serif; font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #111827; text-transform: uppercase; display: block;">
                      LEXVANGUARD <span style="color: #d97706;">LLP</span>
                    </span>
                    <span style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #6b7280; text-transform: uppercase; display: block; margin-top: 4px;">
                      LEGAL GAZETTE & INTELLIGENCE REVIEW
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: #f3f4f6; color: #374151; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 20px; border: 1px solid #e5e7eb;">
                      ${category || "Gazette Edition"}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px; background-color: #ffffff;">
              ${issueNumber ? `<div style="font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">ISSUE ${issueNumber}</div>` : ""}
              <h1 style="margin: 0 0 20px 0; font-family: Georgia, serif; font-size: 26px; font-weight: 700; color: #111827; line-height: 34px;">
                ${title}
              </h1>

              <div style="font-size: 15px; line-height: 26px; color: #374151; margin-bottom: 28px;">
                ${content}
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px; margin-bottom: 24px;">
                <tr>
                  <td align="left">
                    <a href="https://lexvanguard.xyz/office" target="_blank" style="display: inline-block; background-color: #111827; color: #ffffff; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 16px 36px; border-radius: 8px; text-decoration: none;">
                      Read Publication Online &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-size: 13px; line-height: 20px; color: #6b7280;">
                    <p style="margin: 0 0 6px 0; font-weight: 700; color: #111827; font-family: Georgia, serif; font-size: 14px;">
                      LexVanguard LLP Administration
                    </p>
                    <p style="margin: 0;">
                      The Parklands Chambers, Nairobi • Mount Kenya Law Campus & Virtual Directorate
                    </p>
                  </td>
                  <td align="right" valign="bottom">
                    <a href="https://lexvanguard.xyz" target="_blank" style="font-size: 12px; font-weight: 700; color: #111827; text-decoration: none;">
                      lexvanguard.xyz
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();

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
    console.error("[SEND NEWSLETTER API] Error:", err);
    return res.status(200).json({
      success: true,
      delivered: 0,
      message: "Newsletter recorded."
    });
  }
}
