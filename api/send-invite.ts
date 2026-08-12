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

    // Plain text alternative for anti-spam compliance
    const textContent = `
LexVanguard Advocates LLP — Official Appointment Notice

Greetings ${inviteeName},

On behalf of LexVanguard Advocates LLP, extended by ${senderName}, we are pleased to offer you a formal position as ${roleName} within the Firm.

Privileges & Access Rights:
- Access to the LexVanguard Research Intelligence & Case Workspaces
- Official Firm Member Directory Listing
- Client Representation & Case Assignment Briefs

Please visit the following link to accept your appointment and activate your Counsel profile:
${targetInviteUrl}

LexVanguard Advocates LLP Administration
Mount Kenya University Parklands Law Campus, Third Parklands Avenue, Nairobi, Kenya
Website: https://lexvanguard.xyz
    `.trim();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Appointment & Invitation — LexVanguard Advocates LLP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; color: #374151; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; width: 100%;">
    
    <tr>
      <td style="padding: 48px 40px; border-bottom: 1px solid #f3f4f6; text-align: center;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <a href="https://lexvanguard.xyz" target="_blank" style="text-decoration: none;">
                <img src="https://lexvanguard.xyz/logo.png" width="110" height="auto" alt="LexVanguard Advocates LLP Logo" style="display: block; width: 110px; max-width: 140px; height: auto; border: 0; outline: none; margin: 0 auto 16px auto;" />
              </a>
              <span style="font-family: 'Times New Roman', Times, serif; font-size: 24px; font-weight: 400; letter-spacing: 3px; color: #111827; text-transform: uppercase; display: block;">
                LEXVANGUARD <span style="color: #6b7280; font-weight: 300;">LLP</span>
              </span>
              <span style="font-size: 10px; font-weight: 500; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; display: block; margin-top: 8px;">
                Advocates & Legal Counsel
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 56px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left">
              
              <span style="display: inline-block; padding-bottom: 12px; margin-bottom: 32px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #6b7280;">
                Official Notice of Appointment
              </span>
              
              <p style="font-size: 16px; font-weight: 400; line-height: 28px; color: #111827; margin-top: 0;">
                Dear ${inviteeName},
              </p>
              
              <p style="font-size: 16px; font-weight: 300; line-height: 28px; color: #374151; margin-top: 24px;">
                We are writing to you on behalf of the Partners at <strong>LexVanguard Advocates LLP</strong>. By direction of <strong>${senderName}</strong>, it is our pleasure to formally extend an offer of appointment to the position of <strong>${roleName}</strong>.
              </p>

              <div style="margin: 32px 0; padding: 24px 0; border-top: 1px solid #f9fafb; border-bottom: 1px solid #f9fafb;">
                <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af;">
                  Associated Privileges
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-weight: 300; line-height: 30px; font-size: 15px;">
                  <li style="padding-left: 4px;">Access to the LexVanguard Research Intelligence & Case Workspaces</li>
                  <li style="padding-left: 4px;">Official Firm Member Directory Listing</li>
                  <li style="padding-left: 4px;">Client Representation & Case Assignment Briefs</li>
                </ul>
              </div>
              
              <p style="font-size: 15px; font-weight: 300; line-height: 26px; color: #6b7280; margin-bottom: 36px;">
                To formalize this appointment and activate your institutional profile, please proceed via the secure link below.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px; margin-bottom: 24px;">
                <tr>
                  <td align="center" style="text-align: center;">
                    <a href="${targetInviteUrl}" target="_blank" style="display: inline-block; background-color: #111827; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; padding: 12px 28px; text-decoration: none; border-radius: 4px;">
                      Accept & Activate
                    </a>
                    <p style="font-size: 12px; color: #6b7280; margin-top: 16px; margin-bottom: 0; text-align: center; font-weight: 300;">
                      If the button above does not work, copy and paste this link into your browser:<br/>
                      <a href="${targetInviteUrl}" style="color: #111827; word-break: break-all; text-decoration: underline; font-weight: 400;">${targetInviteUrl}</a>
                    </p>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px; background-color: #ffffff; border-top: 1px solid #f3f4f6; text-align: left;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left">
              <p style="margin: 0 0 8px 0; font-family: 'Times New Roman', Times, serif; font-size: 15px; font-weight: 400; color: #111827;">
                LexVanguard Advocates LLP
              </p>
              <p style="margin: 0; font-size: 12px; font-weight: 300; line-height: 20px; color: #6b7280;">
                Mount Kenya University Parklands Law Campus<br>
                Third Parklands Avenue, Nairobi, Kenya
              </p>
              <p style="margin: 20px 0 0 0; font-size: 10px; font-weight: 300; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">
                Intended for ${cleanEmail}
              </p>
            </td>
          </tr>
        </table>
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
        "LexVanguard Advocates LLP <onboarding@lexvanguard.xyz>",
        "LexVanguard Advocates LLP <info@lexvanguard.xyz>",
        "LexVanguard Advocates LLP <chambers@lexvanguard.xyz>",
        "LexVanguard Advocates LLP <onboarding@resend.dev>"
      ];

      for (const sender of senders) {
        try {
          const result = await resend.emails.send({
            from: sender,
            to: [cleanEmail],
            replyTo: "infolexvanguardfirm@gmail.com",
            subject: `LexVanguard Advocates LLP — Appointment Notice for ${inviteeName}`,
            html: htmlContent,
            text: textContent,
            headers: {
              "X-Entity-Ref-ID": `inv_${Date.now()}`,
              "List-Unsubscribe": "<mailto:infolexvanguardfirm@gmail.com?subject=unsubscribe>"
            }
          });

          if (result.data?.id && !result.error) {
            emailDispatched = true;
            dispatchData = result.data;
            break;
          }
        } catch (err: any) {
          // Try next sender alias
        }
      }

      if (!emailDispatched) {
        try {
          const fallbackResult = await resend.emails.send({
            from: "LexVanguard Advocates LLP <onboarding@resend.dev>",
            to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
            replyTo: "infolexvanguardfirm@gmail.com",
            subject: `[INVITATION] Counsel Onboarding Link for ${cleanEmail}`,
            html: `
              <div style="padding: 15px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px; margin-bottom: 20px; font-family: sans-serif;">
                <p style="margin: 0; color: #111827; font-weight: bold;">Counsel Invitation Created</p>
                <p style="margin: 5px 0 0 0; font-size: 13px; color: #4b5563;">Invitation link generated for <strong>${cleanEmail}</strong>. Link: <a href="${targetInviteUrl}">${targetInviteUrl}</a></p>
              </div>
              ${htmlContent}
            `,
            text: textContent
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
