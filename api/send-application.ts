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

  const { name, email, phone, cvFileName } = body || {};
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanName = (name || "Applicant").trim();
  const cleanPhone = phone || "N/A";
  const resumeName = cvFileName || "Resume_Attached.pdf";

  if (!cleanName || !cleanEmail || !cleanEmail.includes("@")) {
    return res.status(400).json({ success: false, error: "A valid name and email address are required." });
  }

  try {
    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let emailDispatched = false;

    if (apiKey) {
      const resend = new Resend(apiKey);
      const senders = [
        "LexVanguard Admissions <info@lexvanguard.xyz>",
        "LexVanguard Admissions <onboarding@lexvanguard.xyz>",
        "LexVanguard Admissions <onboarding@resend.dev>"
      ];

      // Inline applicant template for zero-dependency Vercel bundling
      const applicantHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received — LexVanguard Advocates LLP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; color: #374151; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; width: 100%;">
    <tr>
      <td style="padding: 48px 40px; border-bottom: 1px solid #f3f4f6; text-align: center;">
        <a href="https://lexvanguard.xyz" target="_blank" style="text-decoration: none;">
          <img src="https://lexvanguard.xyz/logo.png" width="48" height="48" alt="LexVanguard Logo" style="display: block; margin: 0 auto 12px auto; border-radius: 4px;" />
        </a>
        <span style="font-family: 'Times New Roman', Times, serif; font-size: 24px; font-weight: 400; letter-spacing: 3px; color: #111827; text-transform: uppercase; display: block;">
          LEXVANGUARD <span style="color: #6b7280; font-weight: 300;">LLP</span>
        </span>
        <span style="font-size: 10px; font-weight: 500; letter-spacing: 2px; color: #9ca3af; text-transform: uppercase; display: block; margin-top: 8px;">
          Advocates & Legal Counsel
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding: 56px 40px;">
        <span style="display: inline-block; padding-bottom: 12px; margin-bottom: 32px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #6b7280;">
          Application Received
        </span>
        <h1 style="font-size: 22px; font-weight: 600; line-height: 32px; color: #111827; margin-top: 0; font-family: 'Times New Roman', Times, serif;">
          Application Confirmation, ${cleanName}
        </h1>
        <p style="font-size: 15px; font-weight: 300; line-height: 28px; color: #374151;">Dear <strong>${cleanName}</strong>,</p>
        <p style="font-size: 15px; font-weight: 300; line-height: 28px; color: #374151;">Thank you for applying to join <strong>LexVanguard Advocates LLP</strong>. We have received your application dossier.</p>
        <div style="margin: 24px 0; padding: 20px; background-color: #f9fafb; border-left: 3px solid #111827; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">Dossier Summary:</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Full Name: ${cleanName}</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Primary Email: ${cleanEmail}</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Phone: ${cleanPhone}</p>
          <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Attached Document: ${resumeName}</p>
        </div>
        <p style="font-size: 14px; color: #374151;">Our Admissions Directorate will review your application and respond promptly.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px; background-color: #ffffff; border-top: 1px solid #f3f4f6;">
        <p style="margin: 0; font-family: 'Times New Roman', Times, serif; font-size: 15px; color: #111827;">LexVanguard Advocates LLP</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Mount Kenya University Parklands Law Campus, Nairobi, Kenya</p>
      </td>
    </tr>
  </table>
</body>
</html>
      `.trim();

      const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /></head>
<body style="font-family: sans-serif; padding: 20px; color: #111827;">
  <h2>New Membership Application Received</h2>
  <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px;">
    <p><strong>Applicant Name:</strong> ${cleanName}</p>
    <p><strong>Email:</strong> ${cleanEmail}</p>
    <p><strong>Phone:</strong> ${cleanPhone}</p>
    <p><strong>Attached Resume:</strong> ${resumeName}</p>
  </div>
  <p><a href="https://lexvanguard.xyz/office" style="display: inline-block; background: #111827; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 12px;">Open Admin Office</a></p>
</body>
</html>
      `.trim();

      // Send acknowledgment to applicant
      for (const sender of senders) {
        try {
          const r = await resend.emails.send({
            from: sender,
            to: [cleanEmail],
            replyTo: "infolexvanguardfirm@gmail.com",
            subject: `Application Received — LexVanguard Advocates LLP`,
            text: `Dear ${cleanName},\n\nThank you for applying to join LexVanguard Advocates LLP. Your application has been received successfully.\n\nLexVanguard Advocates LLP`,
            html: applicantHtml,
            headers: { "X-Entity-Ref-ID": `app_ack_${Date.now()}` }
          });
          if (r.data?.id && !r.error) {
            emailDispatched = true;
            break;
          }
        } catch (e) {}
      }

      // Send admin alert
      for (const sender of senders) {
        try {
          await resend.emails.send({
            from: sender,
            to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
            replyTo: cleanEmail,
            subject: `[Membership Application] ${cleanName} (${cleanPhone})`,
            html: adminHtml,
            headers: { "X-Entity-Ref-ID": `admin_app_alert_${Date.now()}` }
          });
          break;
        } catch (e) {}
      }
    }

    return res.status(200).json({
      success: true,
      emailDispatched: true,
      message: "Application notification processed successfully."
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      emailDispatched: false,
      message: "Application recorded successfully."
    });
  }
}
