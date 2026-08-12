/**
 * LexVanguard LLP — Responsive Minimalist Email Template Engine
 * Features:
 * - Minimalist Invitation Email Structure (no border box containers or grey wrappers)
 * - PNG Logo embedding (https://lexvanguard.xyz/logo.png) for 100% email client compatibility
 * - Centered, compact buttons with fallback direct text links
 */

export const FIRM_LOGO_URL = "https://lexvanguard.xyz/logo.png";
export const FIRM_WEBSITE_URL = "https://lexvanguard.xyz";

/**
 * Base Minimalist Layout Wrapper (adopting exact Invitation Email styling)
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
  <title>${headline} — LexVanguard Advocates LLP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; color: #374151; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; width: 100% !important;">
  ${preheaderText ? `<div style="display: none; max-height: 0px; overflow: hidden;">${preheaderText}</div>` : ""}

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; width: 100%;">
    
    <!-- Minimalist Header with PNG Logo -->
    <tr>
      <td style="padding: 48px 40px; border-bottom: 1px solid #f3f4f6; text-align: center;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <a href="${FIRM_WEBSITE_URL}" target="_blank" style="text-decoration: none;">
                <img src="${FIRM_LOGO_URL}" width="48" height="48" alt="LexVanguard Advocates LLP Logo" style="display: block; width: 48px; height: 48px; border: 0; outline: none; border-radius: 4px; margin: 0 auto 12px auto;" />
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

    <!-- Main Content Area -->
    <tr>
      <td style="padding: 56px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left">
              
              <span style="display: inline-block; padding-bottom: 12px; margin-bottom: 32px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #6b7280;">
                ${titleBadge}
              </span>
              
              <h1 style="font-size: 22px; font-weight: 600; line-height: 32px; color: #111827; margin-top: 0; margin-bottom: 24px; font-family: 'Times New Roman', Times, serif;">
                ${headline}
              </h1>

              <div style="font-size: 15px; font-weight: 300; line-height: 28px; color: #374151; margin-bottom: 32px;">
                ${bodyHtml}
              </div>

              ${
                primaryAction
                  ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 36px; margin-bottom: 24px;">
                  <tr>
                    <td align="center" style="text-align: center;">
                      <a href="${primaryAction.url}" target="_blank" style="display: inline-block; background-color: #111827; color: #ffffff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; padding: 12px 28px; text-decoration: none; border-radius: 4px;">
                        ${primaryAction.label}
                      </a>
                      <p style="font-size: 12px; color: #6b7280; margin-top: 16px; margin-bottom: 0; text-align: center; font-weight: 300;">
                        If the button above does not work, copy and paste this link into your browser:<br/>
                        <a href="${primaryAction.url}" style="color: #111827; word-break: break-all; text-decoration: underline; font-weight: 400;">${primaryAction.url}</a>
                      </p>
                    </td>
                  </tr>
                </table>
              `
                  : ""
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Minimalist Footer -->
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
              ${
                footerNotice
                  ? `<p style="margin: 20px 0 0 0; font-size: 11px; font-weight: 300; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">${footerNotice}</p>`
                  : ""
              }
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
    preheaderText: `Official appointment offer as ${roleName} at LexVanguard Advocates LLP.`,
    titleBadge: "Official Notice of Appointment",
    headline: `Appointment & Invitation to Join LexVanguard Advocates LLP`,
    bodyHtml: `
      <p style="margin-top: 0;">Dear ${options.recipientName ? options.recipientName : "Counsel"},</p>
      <p>We are writing to you on behalf of the Partners at <strong>LexVanguard Advocates LLP</strong>. By direction of <strong>${inviter}</strong>, it is our pleasure to formally extend an offer of appointment to the position of <strong>${roleName}</strong>.</p>
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
      <p>To formalize this appointment and activate your institutional profile, please select the link below.</p>
    `,
    primaryAction: {
      label: "Accept & Activate",
      url: options.inviteUrl
    },
    footerNotice: "Official invitation issued by LexVanguard Advocates LLP Administration."
  });
}

/**
 * 2. Newsletter Registration / Welcome Email Template
 */
export function renderNewsletterWelcomeEmailHtml(options: {
  email: string;
  name?: string;
}): string {
  return wrapInBaseEmailLayout({
    preheaderText: "Welcome to the LexVanguard Legal Gazette & Intelligence Review.",
    titleBadge: "Gazette Subscription Confirmed",
    headline: "Welcome to the LexVanguard Legal Gazette",
    bodyHtml: `
      <p style="margin-top: 0;">Dear ${options.name || "Legal Scholar"},</p>
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
    footerNotice: `Subscribed email: ${options.email}`
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
      ${options.issueNumber ? `<div style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">ISSUE ${options.issueNumber} • ${options.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>` : ""}
      <div style="font-size: 15px; line-height: 26px; color: #374151;">
        ${options.contentHtml}
      </div>
    `,
    primaryAction: {
      label: "Read Publication Online",
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
    preheaderText: "Your LexVanguard Advocates LLP Counsel account is now active.",
    titleBadge: "Account Activated",
    headline: `Welcome to LexVanguard Advocates LLP, ${options.name}`,
    bodyHtml: `
      <p style="margin-top: 0;">Your institutional user account has been successfully configured and activated with role: <strong>${options.role || "Counsel"}</strong>.</p>
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
    preheaderText: `Official notification regarding your role update to ${options.newRole} at LexVanguard Advocates LLP.`,
    titleBadge: isPromotion ? "Role Advancement" : "Role Adjustment",
    headline: `Notice of Official Role Change: ${options.newRole}`,
    bodyHtml: `
      <p style="margin-top: 0;">Dear ${options.name},</p>
      <p>This is an official administrative notice that your designation within <strong>LexVanguard Advocates LLP</strong> has been updated.</p>
      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 24px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #6b7280; width: 140px;">Prior Role:</td>
            <td style="padding: 6px 0; font-weight: 600; color: #111827;">${options.oldRole}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #6b7280;">New Role:</td>
            <td style="padding: 6px 0; font-weight: 700; color: #111827;">${options.newRole}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Authorized By:</td>
            <td style="padding: 6px 0; color: #374151;">${options.updatedBy || "Managing Partners"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: 600; color: #6b7280;">Effective Date:</td>
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
    footerNotice: `Official dispatch from ${options.senderTitle || "LexVanguard Advocates LLP Executive Directorate"}.`
  });
}
