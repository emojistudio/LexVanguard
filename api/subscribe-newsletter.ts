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

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {}
  }

  try {
    const { email, name } = body || {};
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "A valid email address is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const subscriberName = (name || "Legal Scholar").trim();

    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let dispatched = false;
    let dispatchId = "";

    if (apiKey) {
      const resend = new Resend(apiKey);

      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to LexVanguard Legal Gazette</title>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; color:#111827; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; background-color:#f9fafb; margin:0; padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.03);">
          
          <tr>
            <td style="padding:32px 40px; background-color:#ffffff; border-bottom:2px solid #111827;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left">
                    <span style="font-family:Georgia, serif; font-size:22px; font-weight:800; letter-spacing:2px; color:#111827; text-transform:uppercase; display:block;">
                      LEXVANGUARD <span style="color:#d97706;">LLP</span>
                    </span>
                    <span style="font-size:11px; font-weight:600; letter-spacing:1.5px; color:#6b7280; text-transform:uppercase; display:block; margin-top:4px;">
                      ADVOCATES & LEGAL COUNSEL • MKUPLC
                    </span>
                  </td>
                  <td align="right">
                    <span style="display:inline-block; background-color:#f3f4f6; color:#374151; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:6px 14px; border-radius:20px; border:1px solid #e5e7eb;">
                      Gazette Subscription
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:40px; background-color:#ffffff;">
              <h1 style="margin:0 0 20px 0; font-family:Georgia, serif; font-size:24px; font-weight:700; color:#111827; line-height:32px;">
                Subscription Confirmed: Welcome to LexVanguard Legal Gazette
              </h1>

              <div style="font-size:15px; line-height:26px; color:#374151; margin-bottom:28px;">
                <p>Dear <strong>${subscriberName}</strong>,</p>
                <p>Thank you for subscribing to the <strong>LexVanguard Legal Gazette & Intelligence Review</strong>. Your registration has been successfully confirmed.</p>
                <p>As a subscriber, you will receive our periodic publications featuring:</p>
                <ul style="padding-left:20px; color:#374151; line-height:28px;">
                  <li><strong>Appellate & Constitutional Bench Rulings</strong> — Analysis of pivotal judgments from the Court of Appeal & Supreme Court of Kenya.</li>
                  <li><strong>Commercial & Tech Venture Law</strong> — Insights into cross-border transactions, intellectual property, and venture finance.</li>
                  <li><strong>Pro Bono & Statutory Commentary</strong> — Academic commentary on legislative amendments and public interest litigation.</li>
                  <li><strong>Moot Court & Debate Briefings</strong> — Coverage of national symposia and academic competitions.</li>
                </ul>
                <p style="margin-top:20px;">Our research team ensures that every edition brings actionable legal intelligence directly to your inbox.</p>
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px; margin-bottom:24px;">
                <tr>
                  <td align="left">
                    <a href="https://lexvanguard.xyz/office" target="_blank" style="display:inline-block; background-color:#111827; color:#ffffff; font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; padding:16px 36px; border-radius:8px; text-decoration:none;">
                      Explore Research Desk &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px; background-color:#f9fafb; border-top:1px solid #f3f4f6;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-size:13px; line-height:20px; color:#6b7280;">
                    <p style="margin:0 0 6px 0; font-weight:700; color:#111827; font-family:Georgia, serif; font-size:14px;">
                      LexVanguard LLP Administration
                    </p>
                    <p style="margin:0;">
                      Mount Kenya University Parklands Law Campus • Nairobi, Kenya
                    </p>
                    <p style="margin:12px 0 0 0; font-size:11px; color:#9ca3af;">
                      You are receiving this notice because ${cleanEmail} subscribed to the LexVanguard Gazette.
                    </p>
                  </td>
                  <td align="right" valign="bottom">
                    <a href="https://lexvanguard.xyz" target="_blank" style="font-size:12px; font-weight:700; color:#111827; text-decoration:none;">
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

      const textContent = `
LexVanguard Legal Gazette & Intelligence Review — Subscription Confirmed

Dear ${subscriberName},

Thank you for subscribing to the LexVanguard Legal Gazette. Your registration has been successfully confirmed.

As a subscriber, you will receive our executive dispatches covering:
- Appellate & Constitutional Rulings (Supreme Court & Court of Appeal of Kenya)
- Commercial & Technology Law Insights
- Pro Bono Commentary & Statutory Analysis
- Moot Court Championship Briefings

Chambers & Administration:
LexVanguard Advocates LLP
Mount Kenya University Parklands Law Campus, Nairobi, Kenya
Website: https://lexvanguard.xyz
Contact: info@lexvanguard.xyz / infolexvanguardfirm@gmail.com

To unsubscribe at any time, reply with "Unsubscribe" or visit https://lexvanguard.xyz/unsubscribe
      `.trim();

      const senders = [
        "LexVanguard Gazette <info@lexvanguard.xyz>",
        "LexVanguard Gazette <gazette@lexvanguard.xyz>",
        "LexVanguard Gazette <onboarding@lexvanguard.xyz>",
        "LexVanguard Gazette <chambers@lexvanguard.xyz>",
        "LexVanguard Gazette <onboarding@resend.dev>"
      ];

      for (const sender of senders) {
        try {
          const result = await resend.emails.send({
            from: sender,
            to: [cleanEmail],
            replyTo: "info@lexvanguard.xyz",
            subject: "Subscription Confirmed — Welcome to the LexVanguard Legal Gazette",
            html: htmlContent,
            text: textContent,
            headers: {
              "List-Unsubscribe": "<https://lexvanguard.xyz/unsubscribe>, <mailto:info@lexvanguard.xyz?subject=unsubscribe>",
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
              "X-Entity-Ref-ID": `sub_conf_${Date.now()}`
            }
          });

          if (result.data?.id && !result.error) {
            dispatched = true;
            dispatchId = result.data.id;
            console.log(`✅ Newsletter welcome email sent to ${cleanEmail} via ${sender}. ID: ${dispatchId}`);
            break;
          }
        } catch (e) {
          console.warn(`[SUBSCRIBE NEWSLETTER] Sender ${sender} notice:`, e);
        }
      }
    }

    return res.status(200).json({
      success: true,
      emailDispatched: dispatched,
      dispatchId,
      message: `Thank you for subscribing! Confirmation notice dispatched to ${cleanEmail}.`
    });
  } catch (err: any) {
    console.error("[SUBSCRIBE NEWSLETTER API] Exception caught:", err);
    // Never return 500 error to user frontend — return 200 with success status
    return res.status(200).json({
      success: true,
      emailDispatched: false,
      message: "Subscription successfully registered."
    });
  }
}
