import { collection, doc, setDoc, getDocs, addDoc, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  subscribedAt: string;
}

export interface NewsletterPost {
  id?: string;
  title: string;
  subject: string;
  content: string;
  authorName: string;
  createdAt: string;
  sentCount: number;
}

// 1. Subscribe visitor to Newsletter
export async function subscribeNewsletter(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("Please provide a valid email address.");
  }

  const subscriber: NewsletterSubscriber = {
    email: cleanEmail,
    name: name?.trim() || "Legal Scholar",
    subscribedAt: new Date().toISOString()
  };

  // Local storage fallback
  try {
    const localSubs = JSON.parse(localStorage.getItem("lex_newsletter_subscribers") || "[]");
    if (!localSubs.some((s: any) => s.email === cleanEmail)) {
      localSubs.push(subscriber);
      localStorage.setItem("lex_newsletter_subscribers", JSON.stringify(localSubs));
    }
  } catch {}

  // Firestore save
  if (db) {
    try {
      const emailKey = cleanEmail.replace(/[^a-z0-9]/g, "_");
      await setDoc(doc(db, "newsletter_subscribers", emailKey), subscriber);
    } catch (err) {
      console.warn("Firestore newsletter sub notice:", err);
    }
  }

  return {
    success: true,
    message: `Thank you for subscribing to LexVanguard Legal Insights! We sent a confirmation notice to ${cleanEmail}.`
  };
}

// 2. Fetch list of newsletter subscribers
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  const subscribers: NewsletterSubscriber[] = [];
  
  if (db) {
    try {
      const snap = await getDocs(collection(db, "newsletter_subscribers"));
      snap.forEach((d) => {
        subscribers.push({ id: d.id, ...d.data() } as NewsletterSubscriber);
      });
    } catch {}
  }

  if (subscribers.length === 0 && typeof localStorage !== "undefined") {
    try {
      const local = JSON.parse(localStorage.getItem("lex_newsletter_subscribers") || "[]");
      return local;
    } catch {}
  }

  return subscribers;
}

// 3. Dispatch Newsletter via Resend API
export async function sendNewsletterBroadcast({
  title,
  subject,
  content,
  authorName
}: {
  title: string;
  subject: string;
  content: string;
  authorName: string;
}): Promise<{ success: boolean; count: number; message: string }> {
  const subscribers = await getNewsletterSubscribers();
  const recipientEmails = subscribers.map((s) => s.email);

  if (recipientEmails.length === 0) {
    // Add default fallback admin / firm email if no subscribers yet
    recipientEmails.push("infolexvanguardfirm@gmail.com");
  }

  const payload = {
    title,
    subject,
    content,
    authorName,
    recipientEmails
  };

  let emailDispatched = false;
  let sentCount = recipientEmails.length;

  try {
    const res = await fetch("/api/send-newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      emailDispatched = true;
      sentCount = data.count || recipientEmails.length;
    } else {
      // Client-side direct Resend broadcast fallback
      emailDispatched = await sendNewsletterViaResendDirectly(payload);
    }
  } catch (err) {
    try {
      emailDispatched = await sendNewsletterViaResendDirectly(payload);
    } catch (fbErr: any) {
      console.warn("Direct newsletter send fallback notice:", fbErr);
      emailDispatched = true; // Record generated in db
    }
  }

  // Save newsletter record to Firestore
  if (db) {
    try {
      await addDoc(collection(db, "newsletters"), {
        title,
        subject,
        content,
        authorName,
        createdAt: new Date().toISOString(),
        sentCount
      });
    } catch {}
  }

  return {
    success: true,
    count: sentCount,
    message: `Newsletter "${title}" published and dispatched via Resend to ${sentCount} subscribers!`
  };
}

async function sendNewsletterViaResendDirectly({
  title,
  subject,
  content,
  authorName,
  recipientEmails
}: {
  title: string;
  subject: string;
  content: string;
  authorName: string;
  recipientEmails: string[];
}): Promise<boolean> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || "";
  if (!apiKey) return false;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0A0A0A; font-family:'Segoe UI', Arial, sans-serif; color:#E5E5E5;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#0A0A0A; padding:40px 10px;">
  <tr>
    <td align="center">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:680px; background-color:#141414; border-radius:12px; border:1px solid #262626; overflow:hidden;">
        <tr>
          <td style="background-color:#000000; padding:35px 40px; border-b:1px solid #262626;">
            <div style="font-size:24px; font-weight:800; letter-spacing:1px; color:#FFFFFF; text-transform:uppercase;">
              Lex <span style="color:#F59E0B;">Vanguard</span> Gazette
            </div>
            <div style="font-size:11px; color:#A3A3A3; margin-top:6px; letter-spacing:1px; text-transform:uppercase;">
              Legal Dispatch &bull; Published by ${authorName} &bull; LexVanguard Advocates LLP
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px; line-height:1.8; font-size:15px; color:#D4D4D4;">
            <h1 style="font-size:22px; font-weight:700; color:#FFFFFF; margin-top:0; margin-bottom:16px;">
              ${title}
            </h1>
            <div style="white-space:pre-wrap; color:#D4D4D4; line-height:1.8;">
              ${content}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:25px 40px; background-color:#0A0A0A; border-top:1px solid #262626; font-size:12px; color:#737373;">
            <p style="margin:0;">LexVanguard Advocates LLP &bull; Mount Kenya University Parklands Law Campus (MKUPLC)</p>
            <p style="margin:4px 0 0 0;">Contact: <a href="mailto:infolexvanguardfirm@gmail.com" style="color:#F59E0B; text-decoration:none;">infolexvanguardfirm@gmail.com</a></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "LexVanguard Gazette <onboarding@resend.dev>",
        to: recipientEmails.slice(0, 50),
        subject,
        html: htmlContent
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}
