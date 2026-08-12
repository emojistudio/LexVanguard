import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface TeamInvitation {
  id: string;
  email: string;
  name?: string;
  invitedBy: string;
  invitedByEmail: string;
  officeId: string;
  roleName: string;
  roleLevel: number;
  token: string;
  status: "pending" | "accepted";
  createdAt: string;
}

export async function sendTeamMemberInvite({
  email,
  name,
  invitedBy,
  invitedByEmail
}: {
  email: string;
  name?: string;
  invitedBy: string;
  invitedByEmail: string;
}): Promise<{ success: boolean; inviteUrl: string; message: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const token = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const origin = typeof window !== "undefined" ? window.location.origin : "https://lexvanguard.xyz";
  const baseUrl = origin.includes("localhost") || origin.includes("127.0.0.1") ? "https://lexvanguard.xyz" : origin;
  const inviteUrl = `${baseUrl}/register?email=${encodeURIComponent(cleanEmail)}&token=${token}`;

  const invitation: TeamInvitation = {
    id: token,
    email: cleanEmail,
    name: name?.trim() || "Legal Counsel",
    invitedBy,
    invitedByEmail,
    officeId: "counsel",
    roleName: "Counsel",
    roleLevel: 50,
    token,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  // 1. Save invitation record locally & to Firestore
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(`lex_invitation_${token}`, JSON.stringify(invitation));
      localStorage.setItem(`lex_invitation_email_${cleanEmail}`, JSON.stringify(invitation));
    }
  } catch {}

  try {
    if (db) {
      const invRef = doc(db, "invitations", token);
      await setDoc(invRef, invitation);

      const emailKey = cleanEmail.replace(/[^a-z0-9]/g, "_");
      await setDoc(doc(db, "invitations_by_email", emailKey), invitation);
    }
  } catch (err) {
    // Silent catch for Firestore permission restrictions
  }

  // 2. Dispatch email via /api/send-invite (Serverless Backend Route)
  const payload = {
    email: cleanEmail,
    name: name?.trim() || "Counsel",
    invitedBy: invitedBy || "Executive Leadership",
    invitedByEmail: invitedByEmail || "info@lexvanguard.xyz",
    inviteUrl
  };

  try {
    const apiRes = await fetch("/api/send-invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await apiRes.json().catch(() => ({}));
    if (apiRes.ok && data.success) {
      return {
        success: true,
        inviteUrl: data.inviteUrl || inviteUrl,
        message: data.message || `Invitation email successfully dispatched to ${cleanEmail}!`
      };
    }
  } catch (err: any) {
    console.warn("Invitation server dispatch notice:", err);
  }

  // 3. Fallback: Return generated link cleanly without client-side CORS errors
  return {
    success: true,
    inviteUrl,
    message: `Invitation generated for ${cleanEmail}! Activation URL is ready.`
  };
}

export async function verifyInvitation(token: string, email?: string): Promise<TeamInvitation | null> {
  if (!token && !email) return null;
  const cleanEmail = (email || "").toLowerCase().trim();

  // 1. Check Firestore invitations
  if (db) {
    try {
      if (token) {
        const invRef = doc(db, "invitations", token);
        const snap = await getDoc(invRef);
        if (snap.exists()) {
          const inv = snap.data() as TeamInvitation;
          if (inv.status !== "accepted") return inv;
        }
      }
      if (cleanEmail) {
        const emailKey = cleanEmail.replace(/[^a-z0-9]/g, "_");
        const invRef = doc(db, "invitations_by_email", emailKey);
        const snap = await getDoc(invRef);
        if (snap.exists()) {
          const inv = snap.data() as TeamInvitation;
          if (inv.status !== "accepted") return inv;
        }

        // 1b. Check Firestore firm_applications for admitted / accepted applicants
        const appsRef = collection(db, "firm_applications");
        const q = query(appsRef, where("email", "==", cleanEmail));
        const appSnaps = await getDocs(q);
        let acceptedApp: any = null;
        appSnaps.forEach((docSnap) => {
          const d = docSnap.data();
          if (d.status === "accepted" || d.status === "admitted" || d.status === "approved") {
            acceptedApp = { id: docSnap.id, ...d };
          }
        });

        if (acceptedApp) {
          return {
            id: acceptedApp.id,
            email: cleanEmail,
            name: acceptedApp.name || "Counsel",
            invitedBy: "Executive Admissions Directorate",
            invitedByEmail: "info@lexvanguard.xyz",
            officeId: "counsel",
            roleName: acceptedApp.roleInterest || "Counsel",
            roleLevel: 50,
            token: token || `app_${acceptedApp.id}`,
            status: "pending",
            createdAt: acceptedApp.createdAt || new Date().toISOString()
          };
        }
      }
    } catch (err) {
      console.warn("Firestore invitation lookup error:", err);
    }
  }

  // 2. Check LocalStorage fallback
  try {
    if (typeof localStorage !== "undefined") {
      if (token) {
        const local = localStorage.getItem(`lex_invitation_${token}`);
        if (local) {
          const inv = JSON.parse(local) as TeamInvitation;
          if (inv.status !== "accepted") return inv;
        }
      }
      if (cleanEmail) {
        const local = localStorage.getItem(`lex_invitation_email_${cleanEmail}`);
        if (local) {
          const inv = JSON.parse(local) as TeamInvitation;
          if (inv.status !== "accepted") return inv;
        }
      }
    }
  } catch {}

  return null;
}

export async function markInvitationAccepted(token: string, email?: string): Promise<void> {
  const cleanEmail = (email || "").toLowerCase().trim();
  if (typeof localStorage !== "undefined") {
    try {
      if (token) localStorage.removeItem(`lex_invitation_${token}`);
      if (cleanEmail) localStorage.removeItem(`lex_invitation_email_${cleanEmail}`);
    } catch {}
  }

  if (!db) return;
  try {
    if (token) {
      await deleteDoc(doc(db, "invitations", token)).catch(() => {});
    }
    if (cleanEmail) {
      const emailKey = cleanEmail.replace(/[^a-z0-9]/g, "_");
      await deleteDoc(doc(db, "invitations_by_email", emailKey)).catch(() => {});

      // Mark firm application status as registered
      const appsRef = collection(db, "firm_applications");
      const q = query(appsRef, where("email", "==", cleanEmail));
      const appSnaps = await getDocs(q);
      appSnaps.forEach(async (docSnap) => {
        await updateDoc(doc(db, "firm_applications", docSnap.id), { status: "registered" }).catch(() => {});
      });
    }
  } catch (err) {
    console.warn("Error purging invitation:", err);
  }
}
