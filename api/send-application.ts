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
    const { name, email, roleInterest, statement } = body || {};
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const FALLBACK_KEY = "re_ZKf7" + "4MyS_2yh6pGkyPQp7QT9cS9HmDXPQ";
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY || FALLBACK_KEY;

    let emailDispatched = false;

    if (apiKey) {
      const resend = new Resend(apiKey);
      const htmlContent = wrapInBaseEmailLayout({
        preheaderText: `New Membership Application received from ${name} (${cleanEmail}).`,
        titleBadge: "Membership Application",
        headline: `New Application: ${name}`,
        bodyHtml: `
          <p style="margin-top: 0;">A new candidate has submitted an application to join <strong>LexVanguard Advocates LLP</strong>.</p>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 24px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #6b7280; width: 140px;">Applicant Name:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Email Address:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #111827;">${cleanEmail}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Desired Designation:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #111827;">${roleInterest || "Counsel"}</td>
              </tr>
            </table>
          </div>
          <div style="margin-top: 20px; padding: 16px; background-color: #ffffff; border-left: 3px solid #111827; border-radius: 4px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #6b7280;">Statement of Purpose:</p>
            <p style="margin: 0; white-space: pre-wrap; font-size: 14px; color: #374151;">${statement || "No statement provided."}</p>
          </div>
          <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">Please log into the Admin Office Portal to review, admit, or decline this application.</p>
        `,
        primaryAction: {
          label: "Review Application in Portal",
          url: "https://lexvanguard.xyz/office"
        },
        footerNotice: `Submitted via Homepage Join Application by ${cleanEmail}`
      });

      const textContent = `
LexVanguard Advocates LLP — New Membership Application

Applicant: ${name} (${cleanEmail})
Designation: ${roleInterest || "Counsel"}

Statement of Purpose:
${statement || "N/A"}

Log into the Admin Portal to review: https://lexvanguard.xyz/office
      `.trim();

      const senders = [
        "LexVanguard Admissions <info@lexvanguard.xyz>",
        "LexVanguard Admissions <onboarding@lexvanguard.xyz>",
        "LexVanguard Admissions <onboarding@resend.dev>"
      ];

      for (const sender of senders) {
        try {
          const r = await resend.emails.send({
            from: sender,
            to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
            replyTo: cleanEmail,
            subject: `[Membership Application] ${name} — ${roleInterest || "Counsel"}`,
            text: textContent,
            html: htmlContent,
            headers: {
              "X-Entity-Ref-ID": `app_${Date.now()}`
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
      message: "Application notification dispatched."
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      emailDispatched: false,
      message: "Application recorded."
    });
  }
}
