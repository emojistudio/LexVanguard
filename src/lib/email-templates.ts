/**
 * LexVanguard LLP — Responsive Light-Theme Full-Width Email Template Engine
 * Features:
 * - 100% Full Viewport Width (No fixed narrow 600px width containers)
 * - Pristine Light Theme (#ffffff / #f9fafb / #111827 typography)
 * - Header with Firm Logo branding
 * - Display name formatting (no raw email addresses mentioned in body or headers)
 */

export const FIRM_LOGO_URL = "https://lexvanguard.xyz/assets/logo.png";
export const FIRM_WEBSITE_URL = "https://lexvanguard.xyz";

/**
 * Base Full-Width Light Theme Layout Wrapper
 */
export function wrapInBaseEmailLayout(options: {
  preheaderText?: string;
  titleBadge: string;
  headline: string;
  bodyHtml: string;
  primaryAction?: { label: string; url: string };
  footerNotice?: string;
}): string {
  const { preheaderText, titleBadge, headline, bodyHtml, primaryAction, footerNotice } = options;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${headline} — LexVanguard LLP</title>
  <style>
    /* Reset styles for full width */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #f9fafb !important;
      color: #111827 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-spacing: 0 !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
      margin: 0 auto !important;
      width: 100% !important;
    }
    img {
      -ms-interpolation-mode: bicubic;
      max-width: 100%;
      height: auto;
    }
    a {
      color: #0071e3;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .responsive-padding {
        padding: 20px 16px !important;
      }
      .headline-text {
        font-size: 22px !important;
        line-height: 28px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; color: #111827; width: 100% !important;">
  ${preheaderText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${preheaderText}</div>` : ""}

  <!-- Full-Width Container -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f9fafb; margin: 0; padding: 0;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        
        <!-- Main Email Body Card (Full Viewport Width) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);">
          
          <!-- Header Bar with Firm Logo & Branding -->
          <tr>
            <td class="responsive-padding" style="padding: 32px 40px; background-color: #ffffff; border-bottom: 2px solid #111827;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    <a href="${FIRM_WEBSITE_URL}" target="_blank" style="text-decoration: none; display: inline-flex; align-items: center; gap: 12px;">
                      <!-- Logo Image with Fallback Badge -->
                      <img src="${FIRM_LOGO_URL}" alt="LexVanguard LLP Logo" width="42" height="42" style="display: block; width: 42px; height: 42px; border: 0; outline: none; border-radius: 6px;" onerror="this.style.display='none'" />
                      <div>
                        <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #111827; text-transform: uppercase; display: block; line-height: 1;">
                          LEXVANGUARD <span style="color: #d97706;">LLP</span>
                        </span>
                        <span style="font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: #6b7280; text-transform: uppercase; display: block; margin-top: 4px;">
                          ADVOCATES & LEGAL COUNSEL
                        </span>
                      </div>
                    </a>
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; background-color: #f3f4f6; color: #374151; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 20px; border: 1px solid #e5e7eb;">
                      ${titleBadge}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Area -->
          <tr>
            <td class="responsive-padding" style="padding: 40px; background-color: #ffffff;">
              <h1 class="headline-text" style="margin: 0 0 20px 0; font-family: Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 700; color: #111827; line-height: 34px; letter-spacing: -0.5px;">
                ${headline}
              </h1>

              <div style="font-size: 15px; line-height: 26px; color: #374151; margin-bottom: 28px;">
                ${bodyHtml}
              </div>

              ${
                primaryAction
                  ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px; margin-bottom: 24px;">
                  <tr>
                    <td align="left">
                      <a href="${primaryAction.url}" target="_blank" style="display: inline-block; background-color: #111827; color: #ffffff; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 16px 36px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                        ${primaryAction.label} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              `
                  : ""
              }
            </td>
          </tr>

          <!-- Sign-Off & Footer -->
          <tr>
            <td class="responsive-padding" style="padding: 32px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-size: 13px; line-height: 20px; color: #6b7280;">
                    <p style="margin: 0 0 6px 0; font-weight: 700; color: #111827; font-family: Georgia, serif; font-size: 14px;">
                      LexVanguard LLP Administration
                    </p>
                    <p style="margin: 0;">
                      The Parklands Chambers, Nairobi • Mount Kenya Law Campus & Virtual Directorate
                    </p>
                    ${
                      footerNotice
                        ? `<p style="margin: 12px 0 0 0; font-size: 11px; color: #9ca3af;">${footerNotice}</p>`
                        : ""
                    }
                  </td>
                  <td align="right" valign="bottom">
                    <a href="${FIRM_WEBSITE_URL}" target="_blank" style="font-size: 12px; font-weight: 700; color: #111827; text-decoration: none;">
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
}

/**
 * 1. Team / Counsel Invitation Email Template
 */
export function renderInvitationEmailHtml(options: {
  recipientName?: string;
  role?: string;
  invitedBy?: string;
  inviteUrl: string;
}): string {
  const roleName = options.role || "Counsel";
  const inviter = options.invitedBy || "Executive Leadership";

  return wrapInBaseEmailLayout({
    preheaderText: `You have been officially invited to join LexVanguard LLP as ${roleName}.`,
    titleBadge: "Official Invitation",
    headline: `Appointment & Invitation to Join LexVanguard LLP`,
    bodyHtml: `
      <p>Greetings ${options.recipientName ? options.recipientName : "Counsel"},</p>
      <p>On behalf of <strong>LexVanguard LLP</strong>, extended by <strong>${inviter}</strong>, we are pleased to offer you a formal position as <strong>${roleName}</strong> within the Firm.</p>
      <p>LexVanguard LLP operates as a unified legal institution dedicated to advocacy, jurisprudence, legal scholarship, and client representation across East Africa and international jurisdictions.</p>
      <div style="background-color: #f9fafb; border-left: 3px solid #111827; padding: 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; font-weight: 700; color: #111827;">Privileges & Access Rights:</p>
        <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
          <li>Access to the LexVanguard Research Intelligence & Case Workspaces</li>
          <li>Official Firm Member Directory Listing</li>
          <li>Client Representation & Case Assignment Briefs</li>
        </ul>
      </div>
      <p>Please select the button below to accept your appointment and activate your Counsel profile.</p>
    `,
    primaryAction: {
      label: "Accept Counsel Appointment",
      url: options.inviteUrl
    },
    footerNotice: "This invitation token is restricted to authorized invitees. If you received this in error, please disregard."
  });
}

/**
 * 2. Newsletter Registration / Welcome Email Template
 */
export function renderNewsletterWelcomeEmailHtml(options: {
  email: string;
}): string {
  return wrapInBaseEmailLayout({
    preheaderText: "Welcome to the LexVanguard Gazette & Intelligence Review.",
    titleBadge: "Gazette Subscription",
    headline: "Welcome to the LexVanguard Legal Gazette",
    bodyHtml: `
      <p>Thank you for subscribing to the <strong>LexVanguard Legal Gazette & Intelligence Review</strong>.</p>
      <p>As a subscriber, you will receive our periodic publications featuring:</p>
      <ul style="padding-left: 20px; color: #374151; line-height: 28px;">
        <li><strong>Appellate & Constitutional Bench Rulings</strong> — Analysis of pivotal judgments from the Court of Appeal & Supreme Court of Kenya.</li>
        <li><strong>Commercial & Tech Venture Law</strong> — Insights into cross-border transactions, intellectual property, and venture finance.</li>
        <li><strong>Pro Bono & Statutory Commentary</strong> — Academic commentary on legislative amendments and public interest litigation.</li>
      </ul>
      <p style="margin-top: 20px;">Our research team ensures that every edition brings actionable legal intelligence directly to your inbox.</p>
    `,
    primaryAction: {
      label: "Explore Research Desk",
      url: `${FIRM_WEBSITE_URL}/office`
    },
    footerNotice: "You are receiving this because your email address was subscribed to the LexVanguard Gazette."
  });
}

/**
 * 3. Newsletter Broadcast Edition Email Template
 */
export function renderNewsletterEditionEmailHtml(options: {
  title: string;
  category?: string;
  issueNumber?: string;
  date?: string;
  contentHtml: string;
}): string {
  return wrapInBaseEmailLayout({
    preheaderText: `${options.title} — LexVanguard Legal Gazette`,
    titleBadge: options.category || "Gazette Edition",
    headline: options.title,
    bodyHtml: `
      ${options.issueNumber ? `<div style="font-size: 12px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">ISSUE ${options.issueNumber} • ${options.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>` : ""}
      <div style="font-size: 15px; line-height: 26px; color: #374151;">
        ${options.contentHtml}
      </div>
    `,
    primaryAction: {
      label: "Read Full Publication Online",
      url: `${FIRM_WEBSITE_URL}/office`
    }
  });
}

/**
 * 4. Account Creation & Activation Email Template
 */
export function renderAccountWelcomeEmailHtml(options: {
  name: string;
  role?: string;
  loginUrl?: string;
}): string {
  return wrapInBaseEmailLayout({
    preheaderText: "Your LexVanguard LLP Counsel account is now active.",
    titleBadge: "Account Confirmation",
    headline: `Welcome to LexVanguard LLP, ${options.name}`,
    bodyHtml: `
      <p>Your institutional user account has been successfully configured and activated with role: <strong>${options.role || "Counsel"}</strong>.</p>
      <p>You can now sign in to your dashboard to manage client matters, access the Research AI suite, view team rosters, and review upcoming firm symposiums.</p>
    `,
    primaryAction: {
      label: "Access Counsel Portal",
      url: options.loginUrl || `${FIRM_WEBSITE_URL}/office`
    }
  });
}

/**
 * 5. User Promotion & Demotion / Role Change Notification Email Template
 */
export function renderRoleChangeEmailHtml(options: {
  name: string;
  oldRole: string;
  newRole: string;
  updatedBy?: string;
  effectiveDate?: string;
}): string {
  const isPromotion = options.newRole.toLowerCase().includes("admin") || options.newRole.toLowerCase().includes("senior") || options.newRole.toLowerCase().includes("partner") || options.newRole.toLowerCase().includes("finance");
  
  return wrapInBaseEmailLayout({
    preheaderText: `Official notification regarding your role update to ${options.newRole} at LexVanguard LLP.`,
    titleBadge: isPromotion ? "Role Advancement" : "Role Adjustment",
    headline: `Notice of Official Role Change: ${options.newRole}`,
    bodyHtml: `
      <p>Dear ${options.name},</p>
      <p>This is an official administrative notice that your designation within <strong>LexVanguard LLP</strong> has been updated.</p>
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; font-weight: 700; color: #6b7280; width: 140px;">Prior Role:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #111827;">${options.oldRole}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 700; color: #6b7280;">New Role:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #0071e3;">${options.newRole}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 700; color: #6b7280;">Authorized By:</td>
            <td style="padding: 6px 0; color: #374151;">${options.updatedBy || "Managing Partners"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 700; color: #6b7280;">Effective Date:</td>
            <td style="padding: 6px 0; color: #374151;">${options.effectiveDate || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
          </tr>
        </table>
      </div>
      <p>Your platform permissions, directory listing, and administrative privileges have been updated accordingly.</p>
    `,
    primaryAction: {
      label: "View Portal Dashboard",
      url: `${FIRM_WEBSITE_URL}/office`
    }
  });
}

/**
 * 6. Admin System Broadcast Email Template
 */
export function renderAdminBroadcastEmailHtml(options: {
  subject: string;
  messageHtml: string;
  priority?: "Normal" | "Urgent" | "High";
  senderTitle?: string;
}): string {
  return wrapInBaseEmailLayout({
    preheaderText: `${options.subject} — LexVanguard Official Announcement`,
    titleBadge: options.priority ? `Broadcast [${options.priority}]` : "Firm Advisory",
    headline: options.subject,
    bodyHtml: `
      <div style="font-size: 15px; line-height: 26px; color: #374151;">
        ${options.messageHtml}
      </div>
    `,
    primaryAction: {
      label: "Open Member Portal",
      url: `${FIRM_WEBSITE_URL}/office`
    },
    footerNotice: `Official dispatch from ${options.senderTitle || "LexVanguard LLP Executive Directorate"}.`
  });
}
