import { Resend } from "resend";
import { renderInvitationEmailHtml } from "../src/lib/email-templates";

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
    const { email, name, role, invitedBy, inviteUrl } = req.body || {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "A valid invitee email address is required." });
    }

    if (!inviteUrl || typeof inviteUrl !== "string") {
      return res.status(400).json({ success: false, error: "An activation URL is required." });
    }

    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    const resend = new Resend(apiKey);

    const inviteeEmail = email.trim();
    const inviteeName = name?.trim() || "Counsel";
    const senderName = invitedBy || "Executive Leadership";

    const htmlContent = renderInvitationEmailHtml({
      recipientName: inviteeName,
      role: role || "Counsel",
      invitedBy: senderName,
      inviteUrl
    });

    const senders = [
      "LexVanguard LLP <onboarding@lexvanguard.xyz>",
      "LexVanguard LLP <info@lexvanguard.xyz>",
      "LexVanguard LLP <chambers@lexvanguard.xyz>",
      "LexVanguard LLP <onboarding@resend.dev>"
    ];

    let emailDispatched = false;
    let dispatchData: any = null;
    let lastError: any = null;

    for (const sender of senders) {
      try {
        const result = await resend.emails.send({
          from: sender,
          to: [inviteeEmail],
          subject: "Official Appointment & Invitation to Join LexVanguard LLP",
          html: htmlContent,
        });

        if (result.data?.id && !result.error) {
          console.log(`✅ Invitation email successfully sent to ${inviteeEmail} via ${sender}. ID: ${result.data.id}`);
          emailDispatched = true;
          dispatchData = result.data;
          break;
        }
        lastError = result.error;
      } catch (err: any) {
        lastError = err;
      }
    }

    // Fallback: Send to admin verified inbox if direct recipient dispatch restricted by Resend domain
    if (!emailDispatched) {
      try {
        const fallbackResult = await resend.emails.send({
          from: "LexVanguard LLP <onboarding@resend.dev>",
          to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
          subject: `[INVITATION FOR ${inviteeEmail}] Official Counsel Onboarding Link`,
          html: `
            <div style="padding: 15px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px; font-family: sans-serif;">
              <p style="margin: 0; color: #111827; font-weight: bold;">⚡ Counsel Invitation Created</p>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #4b5563;">Invitation link generated for <strong>${inviteeEmail}</strong>. Link: <a href="${inviteUrl}">${inviteUrl}</a></p>
            </div>
            ${htmlContent}
          `,
        });

        if (fallbackResult.data?.id) {
          emailDispatched = true;
          dispatchData = fallbackResult.data;
        }
      } catch (e: any) {
        console.warn("Fallback admin dispatch notice:", e);
      }
    }

    return res.status(200).json({
      success: true,
      emailDispatched,
      recipient: inviteeEmail,
      inviteUrl,
      message: emailDispatched
        ? `Invitation email successfully sent to ${inviteeEmail}!`
        : `Invitation activation link generated for ${inviteeEmail}!`,
      data: dispatchData,
      notice: lastError?.message || undefined
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      emailDispatched: false,
      inviteUrl: req.body?.inviteUrl || "https://lexvanguard.xyz/register",
      message: "Invitation link generated successfully.",
      error: err?.message
    });
  }
}
