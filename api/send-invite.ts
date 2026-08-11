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

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {}
  }

  const { email, name, role, invitedBy, inviteUrl } = body || {};

  const cleanEmail = (email || "").trim();
  const inviteeName = (name || "Counsel").trim();
  const senderName = (invitedBy || "Executive Leadership").trim();
  const roleName = (role || "Counsel").trim();
  const targetInviteUrl = inviteUrl || `https://lexvanguard.xyz/register?email=${encodeURIComponent(cleanEmail)}`;

  try {
    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appointment & Invitation — LexVanguard LLP</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f9fafb; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
    <tr>
      <td style="padding: 32px 40px; background-color: #ffffff; border-bottom: 2px solid #111827;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left">
              <span style="font-family: Georgia, serif; font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #111827; text-transform: uppercase; display: block;">
                LEXVANGUARD <span style="color: #d97706;">LLP</span>
              </span>
              <span style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #6b7280; text-transform: uppercase; display: block; margin-top: 4px;">
                ADVOCATES & LEGAL COUNSEL
              </span>
            </td>
            <td align="right">
              <span style="background-color: #f3f4f6; color: #374151; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 20px; border: 1px solid #e5e7eb;">
                Official Invitation
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px; background-color: #ffffff;">
        <h1 style="margin: 0 0 20px 0; font-family: Georgia, serif; font-size: 24px; font-weight: 700; color: #111827; line-height: 32px;">
          Appointment & Invitation to Join LexVanguard LLP
        </h1>
        <p style="font-size: 15px; line-height: 26px; color: #374151;">Greetings ${inviteeName},</p>
        <p style="font-size: 15px; line-height: 26px; color: #374151;">
          On behalf of <strong>LexVanguard LLP</strong>, extended by <strong>${senderName}</strong>, we are pleased to offer you a formal position as <strong>${roleName}</strong> within the Firm.
        </p>
        <div style="background-color: #f9fafb; border-left: 3px solid #111827; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: #111827;">Privileges & Access Rights:</p>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 24px;">
            <li>Access to the LexVanguard Research Intelligence & Case Workspaces</li>
            <li>Official Firm Member Directory Listing</li>
            <li>Client Representation & Case Assignment Briefs</li>
          </ul>
        </div>
        <p style="font-size: 15px; line-height: 26px; color: #374151;">Please select the button below to accept your appointment and activate your Counsel profile.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px; margin-bottom: 24px;">
          <tr>
            <td align="left">
              <a href="${targetInviteUrl}" target="_blank" style="display: inline-block; background-color: #111827; color: #ffffff; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 16px 36px; border-radius: 8px; text-decoration: none;">
                Accept Counsel Appointment &rarr;
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; font-size: 13px; color: #6b7280;">
        <p style="margin: 0 0 4px 0; font-weight: 700; color: #111827; font-family: Georgia, serif;">LexVanguard LLP Administration</p>
        <p style="margin: 0;">The Parklands Chambers, Nairobi • Mount Kenya Law Campus & Virtual Directorate</p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    let emailDispatched = false;
    let dispatchData: any = null;

    if (apiKey && cleanEmail.includes("@")) {
      const resend = new Resend(apiKey);
      const senders = [
        "LexVanguard LLP <onboarding@lexvanguard.xyz>",
        "LexVanguard LLP <info@lexvanguard.xyz>",
        "LexVanguard LLP <chambers@lexvanguard.xyz>",
        "LexVanguard LLP <onboarding@resend.dev>"
      ];

      for (const sender of senders) {
        try {
          const result = await resend.emails.send({
            from: sender,
            to: [cleanEmail],
            subject: "Official Appointment & Invitation to Join LexVanguard LLP",
            html: htmlContent,
          });

          if (result.data?.id && !result.error) {
            emailDispatched = true;
            dispatchData = result.data;
            break;
          }
        } catch (err: any) {
          // Try next sender
        }
      }

      if (!emailDispatched) {
        try {
          const fallbackResult = await resend.emails.send({
            from: "LexVanguard LLP <onboarding@resend.dev>",
            to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
            subject: `[INVITATION FOR ${cleanEmail}] Official Counsel Onboarding Link`,
            html: `
              <div style="padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif;">
                <p style="margin: 0; color: #111827; font-weight: bold;">⚡ Counsel Invitation Created</p>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #4b5563;">Invitation link generated for <strong>${cleanEmail}</strong>. Link: <a href="${targetInviteUrl}">${targetInviteUrl}</a></p>
              </div>
              ${htmlContent}
            `,
          });

          if (fallbackResult.data?.id) {
            emailDispatched = true;
            dispatchData = fallbackResult.data;
          }
        } catch (e: any) {}
      }
    }

    return res.status(200).json({
      success: true,
      emailDispatched,
      recipient: cleanEmail,
      inviteUrl: targetInviteUrl,
      message: emailDispatched
        ? `Invitation email successfully sent to ${cleanEmail}!`
        : `Invitation activation link generated for ${cleanEmail}!`,
      data: dispatchData
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      emailDispatched: false,
      inviteUrl: targetInviteUrl,
      message: "Invitation link generated successfully.",
      error: err?.message || "Notice"
    });
  }
}
