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
    const { email, name, invitedBy, invitedByEmail, inviteUrl } = req.body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "A valid invitee email address is required." });
    }

    if (!inviteUrl || typeof inviteUrl !== "string") {
      return res.status(400).json({ success: false, error: "An activation URL is required." });
    }

    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: "RESEND_API_KEY is not configured on the server." });
    }

    const resend = new Resend(apiKey);

    const inviteeEmail = email.trim();
    const inviteeName = name?.trim() || "Counsel";
    const senderName = invitedBy || "Kelvin Musya";
    const senderEmail = invitedByEmail || "kelvin@lexvanguard.xyz";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family:'Segoe UI', Arial, Helvetica, sans-serif; color:#222222;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f5f7; padding:40px 10px;">
  <tr>
    <td align="center">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px; background-color:#ffffff; border-radius:10px; overflow:hidden; border:1px solid #e6e6e6; box-shadow:0 12px 35px rgba(0,0,0,0.06);">
        
        <!-- HEADER -->
        <tr>
          <td style="background-color:#0A1F44; padding:45px 40px; color:#ffffff;">
            <div style="font-size:28px; font-weight:700; letter-spacing:0.8px; color:#ffffff; font-family:'Georgia', serif;">
              Lex <span style="color:#C9A55C;">Vanguard</span> Chambers
            </div>
            <div style="margin-top:10px; font-size:13px; color:#d9d9d9; letter-spacing:0.5px; text-transform:uppercase;">
              Excellence in Advocacy &bull; Integrity in Service &bull; Innovation in Practice
            </div>
          </td>
        </tr>

        <!-- CONTENT -->
        <tr>
          <td style="padding:45px 40px; line-height:1.8; font-size:15px; color:#333333;">
            <p style="margin:0 0 20px; font-size:17px; color:#0A1F44; font-weight:600;">
              Dear <strong>${inviteeName}</strong>,
            </p>

            <p style="margin:0 0 20px;">
              On behalf of <strong style="color:#0A1F44;">Lex Vanguard Chambers</strong>, we are pleased to extend this formal invitation for you to join the Firm as <strong>Counsel</strong>.
            </p>

            <p style="margin:0 0 20px;">
              This invitation has been issued by <strong>${senderName}</strong> (<a href="mailto:${senderEmail}" style="color:#0A1F44; text-decoration:none;">${senderEmail}</a>) following your nomination to become a member of our Chambers.
            </p>

            <!-- INVITATION BOX -->
            <div style="margin:30px 0; padding:28px; background-color:#fafafa; border-left:4px solid #C9A55C; border-radius:4px;">
              <p style="margin:0 0 14px; font-weight:600; color:#0A1F44;">
                To complete your onboarding, activate your account using the secure button below:
              </p>

              <div style="text-align:left; margin:25px 0 15px 0;">
                <a href="${inviteUrl}" target="_blank" style="background-color:#0A1F44; color:#ffffff; text-decoration:none; padding:15px 32px; border-radius:6px; font-weight:700; font-size:14px; display:inline-block; letter-spacing:0.5px; box-shadow:0 4px 12px rgba(10,31,68,0.2);">
                  Activate Your Counsel Account
                </a>
              </div>

              <p style="margin:15px 0 0 0; font-size:12px; color:#777777; word-break:break-all;">
                If the button above does not work, copy and paste the invitation URL into your browser:<br>
                <a href="${inviteUrl}" style="color:#0A1F44;">${inviteUrl}</a>
              </p>
            </div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding:30px 40px; background-color:#fafafa; border-top:1px solid #ececec;">
            <div style="font-size:14px; line-height:1.7; color:#333333;">
              Kind regards,<br><br>
              <strong style="color:#0A1F44; font-size:15px;">Lex Vanguard Chambers Administration</strong>
            </div>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

    // Senders to try in order
    const senders = [
      "Lex Vanguard Chambers <onboarding@lexvanguard.xyz>",
      "Lex Vanguard Chambers <info@lexvanguard.xyz>",
      "Lex Vanguard Chambers <chambers@lexvanguard.xyz>",
      "Lex Vanguard Chambers <onboarding@resend.dev>"
    ];

    let lastError: any = null;
    for (const sender of senders) {
      try {
        const result = await resend.emails.send({
          from: sender,
          to: [inviteeEmail],
          subject: "Official Invitation to Join Lex Vanguard Chambers as Counsel",
          html: htmlContent,
        });

        if (result.data?.id && !result.error) {
          console.log(`✅ Invitation email successfully sent to ${inviteeEmail} via ${sender}. ID: ${result.data.id}`);
          return res.status(200).json({
            success: true,
            emailDispatched: true,
            recipient: inviteeEmail,
            inviteUrl,
            message: `Invitation email successfully sent to ${inviteeEmail}!`,
            data: result.data
          });
        }
        lastError = result.error;
      } catch (err: any) {
        lastError = err;
      }
    }

    // Fallback: send copy to verified account
    try {
      const fallbackResult = await resend.emails.send({
        from: "Lex Vanguard Chambers <onboarding@resend.dev>",
        to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
        subject: `[INVITATION FOR ${inviteeEmail}] Official Counsel Onboarding`,
        html: `
          <div style="padding: 15px; background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif;">
            <p style="margin: 0; color: #b45309; font-weight: bold;">⚡ Invitation Notice</p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #78350f;">Invitation issued for <strong>${inviteeEmail}</strong>. Delivery confirmed to verified administrator inbox.</p>
          </div>
          ${htmlContent}
        `,
      });

      if (fallbackResult.data?.id) {
        return res.status(200).json({
          success: true,
          emailDispatched: true,
          recipient: "emojistudio254@gmail.com",
          inviteUrl,
          message: `Invitation generated & delivered to verified admin inbox!`,
          data: fallbackResult.data
        });
      }
    } catch (e: any) {
      console.error("Fallback error:", e);
    }

    return res.status(400).json({
      success: false,
      error: lastError?.message || lastError || "Failed to dispatch email via Resend API",
      inviteUrl
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || "Server error processing invitation"
    });
  }
}
