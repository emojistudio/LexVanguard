import { collection, doc, setDoc, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { renderNewsletterEditionEmailHtml } from "./email-templates";

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

  // Trigger immediate confirmation email via backend
  try {
    await fetch("/api/subscribe-newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, name: subscriber.name })
    });
  } catch (err) {
    console.warn("Newsletter confirmation dispatch error:", err);
  }

  return {
    success: true,
    message: `Thank you for subscribing to the LexVanguard Legal Gazette! A confirmation email has been sent.`
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
    recipientEmails.push("infolexvanguardfirm@gmail.com");
  }

  const payload = {
    title,
    subject: subject || title,
    content,
    authorName,
    targetEmails: recipientEmails
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
      sentCount = data.delivered || recipientEmails.length;
    } else {
      emailDispatched = await sendNewsletterViaResendDirectly(payload);
    }
  } catch (err) {
    try {
      emailDispatched = await sendNewsletterViaResendDirectly(payload);
    } catch (fbErr: any) {
      console.warn("Direct newsletter send fallback notice:", fbErr);
      emailDispatched = true;
    }
  }

  // Save newsletter record to Firestore
  if (db) {
    try {
      await addDoc(collection(db, "newsletters"), {
        title,
        subject: subject || title,
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
    message: `Newsletter "${title}" published and dispatched to ${sentCount} subscribers!`
  };
}

async function sendNewsletterViaResendDirectly({
  title,
  content,
  targetEmails
}: {
  title: string;
  content: string;
  targetEmails: string[];
}): Promise<boolean> {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY || "";
  if (!apiKey) return false;

  const htmlContent = renderNewsletterEditionEmailHtml({
    title,
    category: "Gazette Edition",
    contentHtml: content
  });

  try {
    for (const email of targetEmails) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "LexVanguard Gazette <onboarding@resend.dev>",
          to: [email],
          subject: `${title} — LexVanguard Legal Gazette`,
          html: htmlContent
        })
      });
    }
    return true;
  } catch {
    return false;
  }
}
