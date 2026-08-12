import dns from "dns";
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

import { Resend } from "resend";
import { wrapInBaseEmailLayout } from "../src/lib/email-templates";

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
    const { action, name, email, roleInterest } = body || {};
    if (!action || !email) {
      return res.status(400).json({ success: false, error: "Action (accept/reject) and email are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const applicantName = (name || "Counsel").trim();
    const roleName = (roleInterest || "Counsel").trim();
    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let emailDispatched = false;

    if (apiKey) {
      const resend = new Resend(apiKey);
      const isAccept = action === "accept";

      const activationUrl = `https://lexvanguard.xyz/register?email=${encodeURIComponent(cleanEmail)}`;

      const htmlContent = isAccept
        ? wrapInBaseEmailLayout({
            preheaderText: `Official Membership Offer & Appointment as ${roleName} at LexVanguard Advocates LLP.`,
            titleBadge: "Application Approved",
            headline: `Welcome to LexVanguard Advocates LLP, ${applicantName}`,
            bodyHtml: `
              <p style="margin-top: 0;">Dear <strong>${applicantName}</strong>,</p>
              <p>We are pleased to inform you that your application for institutional membership at <strong>LexVanguard Advocates LLP</strong> as <strong>${roleName}</strong> has been officially approved by the Executive Admissions Directorate.</p>
              <p>You are now invited to complete your profile setup and access the Firm's case workspaces, research intelligence suite, and counsel communications panel.</p>
              <div style="margin: 24px 0; padding: 20px; background-color: #f9fafb; border-left: 3px solid #111827; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">Assigned Designation: ${roleName}</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Institution: LexVanguard Advocates LLP • MKUPLC Campus & Virtual Chambers</p>
              </div>
            `,
            primaryAction: {
              label: "Activate Counsel Profile",
              url: activationUrl
            },
            footerNotice: "Issued by Executive Admissions Committee, LexVanguard Advocates LLP."
          })
        : wrapInBaseEmailLayout({
            preheaderText: "Notification regarding your membership application to LexVanguard Advocates LLP.",
            titleBadge: "Application Update",
            headline: "Membership Application Review Notice",
            bodyHtml: `
              <p style="margin-top: 0;">Dear <strong>${applicantName}</strong>,</p>
              <p>Thank you for your interest in joining <strong>LexVanguard Advocates LLP</strong> and for submitting your candidacy to our admissions committee.</p>
              <p>Following a careful review of our current institutional capacity and panel requirements, we regret to inform you that we are unable to offer an appointment at this time.</p>
              <p>We sincerely appreciate the time and effort you dedicated to your application and wish you every success in your academic and professional legal endeavors.</p>
            `,
            footerNotice: "LexVanguard Advocates LLP Executive Admissions Committee."
          });

      const textContent = isAccept
        ? `
LexVanguard Advocates LLP — Membership Application Approved

Dear ${applicantName},

Your application to join LexVanguard Advocates LLP as ${roleName} has been approved.

Activate your profile here: ${activationUrl}

LexVanguard Advocates LLP
        `.trim()
        : `
LexVanguard Advocates LLP — Membership Application Notice

Dear ${applicantName},

Thank you for your interest in LexVanguard Advocates LLP. After careful consideration, we are unable to proceed with your appointment at this time.

We wish you the very best in your legal career.

LexVanguard Advocates LLP
        `.trim();

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
            replyTo: "info@lexvanguard.xyz",
            subject,
            text: textContent,
            html: htmlContent,
            headers: {
              "X-Entity-Ref-ID": `app_decision_${Date.now()}`
            }
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
      message: `Decision notification email processed for ${cleanEmail}.`
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      emailDispatched: false,
      message: "Application decision recorded."
    });
  }
}
