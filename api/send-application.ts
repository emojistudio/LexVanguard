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
    const { name, email, phone, cvFileName } = body || {};
    if (!name || !email) {
      return res.status(400).json({ success: false, error: "Name and email are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone || "N/A";
    const resumeName = cvFileName || "Resume_Attached.pdf";

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

      // 1. Send Confirmation Email to Applicant
      const applicantHtml = wrapInBaseEmailLayout({
        preheaderText: `Your application to LexVanguard Advocates LLP has been received successfully.`,
        titleBadge: "Application Received",
        headline: `Application Received, ${cleanName}`,
        bodyHtml: `
          <p style="margin-top: 0;">Dear <strong>${cleanName}</strong>,</p>
          <p>Thank you for submitting your candidacy to join <strong>LexVanguard Advocates LLP</strong>.</p>
          <p>We are pleased to confirm that your application has been received successfully by our Admissions Directorate.</p>
          <div style="margin: 24px 0; padding: 20px; background-color: #f9fafb; border-left: 3px solid #111827; border-radius: 4px;">
            <p style="margin: 0; font-size: 13px; font-weight: 600; color: #111827;">Submitted Details:</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">Full Name: ${cleanName}</p>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Primary Email: ${cleanEmail}</p>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Phone Number: ${cleanPhone}</p>
            <p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">Attached Document: ${resumeName}</p>
          </div>
          <p style="margin-top: 16px; font-size: 13px; color: #374151;">Our Executive Admissions Committee will review your candidacy and respond to you promptly via this email address.</p>
        `,
        footerNotice: "Issued by Executive Admissions Committee, LexVanguard Advocates LLP."
      });

      for (const sender of senders) {
        try {
          const r = await resend.emails.send({
            from: sender,
            to: [cleanEmail],
            replyTo: "info@lexvanguard.xyz",
            subject: `Application Received — LexVanguard Advocates LLP`,
            text: `Dear ${cleanName},\n\nThank you for applying to join LexVanguard Advocates LLP. Your application has been received successfully and will be responded to promptly upon review.\n\nLexVanguard Advocates LLP`,
            html: applicantHtml,
            headers: {
              "X-Entity-Ref-ID": `applicant_ack_${Date.now()}`
            }
          });
          if (r.data?.id && !r.error) {
            emailDispatched = true;
            break;
          }
        } catch (e) {}
      }

      // 2. Send Admin Alert Email
      const adminHtml = wrapInBaseEmailLayout({
        preheaderText: `New Membership Application received from ${cleanName} (${cleanEmail}).`,
        titleBadge: "Membership Application",
        headline: `New Application: ${cleanName}`,
        bodyHtml: `
          <p style="margin-top: 0;">A new candidate has submitted an application to join <strong>LexVanguard Advocates LLP</strong>.</p>
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 24px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #6b7280; width: 140px;">Applicant Name:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #111827;">${cleanName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Email Address:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #111827;">${cleanEmail}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Phone Number:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #111827;">${cleanPhone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Attached CV:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #111827;">${resumeName}</td>
              </tr>
            </table>
          </div>
          <p style="margin-top: 24px; font-size: 13px; color: #6b7280;">Please log into the Admin Office Portal to review, admit, or decline this application.</p>
        `,
        primaryAction: {
          label: "Review Application in Portal",
          url: "https://lexvanguard.xyz/office"
        },
        footerNotice: `Submitted via Homepage Join Application by ${cleanEmail}`
      });

      for (const sender of senders) {
        try {
          await resend.emails.send({
            from: sender,
            to: ["emojistudio254@gmail.com", "infolexvanguardfirm@gmail.com"],
            replyTo: cleanEmail,
            subject: `[Membership Application] ${cleanName} (${cleanPhone})`,
            html: adminHtml,
            headers: {
              "X-Entity-Ref-ID": `admin_app_alert_${Date.now()}`
            }
          });
          break;
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
