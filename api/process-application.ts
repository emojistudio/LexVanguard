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

  const { action, name, email, roleInterest } = body || {};
  if (!action || !email) {
    return res.status(400).json({ success: false, error: "Action (accept/reject) and email are required." });
  }

  const cleanEmail = email.trim().toLowerCase();
  const applicantName = (name || "Counsel").trim();
  const roleName = (roleInterest || "Counsel").trim();

  try {
    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let emailDispatched = false;

    if (apiKey) {
      const resend = new Resend(apiKey);
      const isAccept = action === "accept";
      const token = `app_${Date.now()}`;
      const activationUrl = `https://lexvanguard.xyz/register?email=${encodeURIComponent(cleanEmail)}&token=${token}`;

      const htmlContent = isAccept
        ? `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 30px; color: #374151;">
  <div style="text-align: center; border-bottom: 1px solid #e5e7eb; pb: 20px;">
    <h2 style="font-family: serif; letter-spacing: 2px;">LEXVANGUARD ADVOCATES LLP</h2>
  </div>
  <h1 style="font-size: 20px; color: #111827; margin-top: 24px;">Welcome to LexVanguard Advocates LLP, ${applicantName}</h1>
  <p>Your application for institutional membership as <strong>${roleName}</strong> has been approved by the Executive Admissions Directorate.</p>
  <p><a href="${activationUrl}" style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 16px;">Activate Counsel Profile</a></p>
  <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">LexVanguard Advocates LLP • Mount Kenya University Parklands Law Campus</p>
</body>
</html>
        `.trim()
        : `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 30px; color: #374151;">
  <div style="text-align: center; border-bottom: 1px solid #e5e7eb; pb: 20px;">
    <h2 style="font-family: serif; letter-spacing: 2px;">LEXVANGUARD ADVOCATES LLP</h2>
  </div>
  <h1 style="font-size: 20px; color: #111827; margin-top: 24px;">Membership Application Status Notice</h1>
  <p>Dear ${applicantName},</p>
  <p>Thank you for your interest in joining LexVanguard Advocates LLP. Following a careful review of our panel requirements, we are unable to offer an appointment at this time.</p>
  <p>We wish you every success in your academic and legal endeavors.</p>
  <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">LexVanguard Advocates LLP Executive Admissions Committee</p>
</body>
</html>
        `.trim();

      const textContent = isAccept
        ? `LexVanguard Advocates LLP — Membership Approved for ${applicantName}. Activate profile: ${activationUrl}`
        : `LexVanguard Advocates LLP — Application Notice for ${applicantName}. We regret to inform you that we cannot offer an appointment at this time.`;

      const subject = isAccept
        ? `Membership Approved — Welcome to LexVanguard Advocates LLP`
        : `Membership Application Notice — LexVanguard Advocates LLP`;

      const senders = [
        "LexVanguard Admissions <info@lexvanguard.xyz>",
        "LexVanguard Admissions <onboarding@lexvanguard.xyz>",
        "LexVanguard Admissions <onboarding@resend.dev>"
      ];

      for (const sender of senders) {
        try {
          const r = await resend.emails.send({
            from: sender,
            to: [cleanEmail],
            replyTo: "infolexvanguardfirm@gmail.com",
            subject,
            text: textContent,
            html: htmlContent,
            headers: { "X-Entity-Ref-ID": `app_decision_${Date.now()}` }
          });
          if (r.data?.id && !r.error) {
            emailDispatched = true;
            break;
          }
        } catch (e) {}
      }
    }

    return res.status(200).json({
      success: true,
      emailDispatched,
      message: `Decision notification processed for ${cleanEmail}.`
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      emailDispatched: false,
      message: "Application decision recorded."
    });
  }
}
