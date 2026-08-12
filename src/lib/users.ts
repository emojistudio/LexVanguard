import { doc, getDoc, collection, query, where, getDocs, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { syncProfileFromFirestore, syncLocalProfilesToFirestore } from "./profile-store";
import { resolveProfileImage } from "./profile-images";

export const ROLES = {
  CLIENT: { level: 0, name: 'Client' },
  MEMBER: { level: 1, name: 'Member' },
  RESEARCHER: { level: 2, name: 'Researcher' },
  ASSOCIATE: { level: 3, name: 'Associate' },
  MANAGER: { level: 5, name: 'Manager' },
  ADMIN: { level: 10, name: 'Admin' },
  COUNSEL: { level: 50, name: 'Counsel' },
  MANAGING_PARTNER: { level: 100, name: 'Managing Partner' }
} as const;

export type RoleKey = keyof typeof ROLES;
export type Role = { level: number; name: string };

export interface FirmUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  officeId: string;
  title: string;
  practice: string;
}

export const AUTHORIZED_USERS: Record<string, FirmUser> = {
  'n6NKoyAIuVSXYEaIbRVN9drINNy1': {
    id: 'n6NKoyAIuVSXYEaIbRVN9drINNy1',
    name: 'Prince Micah',
    email: 'prince@lexvanguard.xyz',
    role: ROLES.MANAGING_PARTNER,
    officeId: 'admin',
    title: 'Founding Partner & Co-Owner (Managing Partner)',
    practice: 'Corporate & Tech Law, Mergers & Acquisitions'
  },
  'SSbNEJrVyhM6b8LbWYsyunPGk6l2': {
    id: 'SSbNEJrVyhM6b8LbWYsyunPGk6l2',
    name: 'Kelvin Musya',
    email: 'kelvin@lexvanguard.xyz',
    role: ROLES.MANAGING_PARTNER,
    officeId: 'admin',
    title: 'Founding Partner & Co-Owner (Senior Partner)',
    practice: 'Appellate Advocacy, Supreme Court Litigation'
  },
  'donel_aganyo_uid': {
    id: 'donel_aganyo_uid',
    name: 'Donel Aganyo',
    email: 'donel@lexvanguard.xyz',
    role: ROLES.MANAGING_PARTNER,
    officeId: 'admin',
    title: 'Founding Partner & Co-Owner (Head of IP)',
    practice: 'Intellectual Property, Patent Litigation'
  }
};

export async function fetchFirmUser(uid: string, email?: string): Promise<FirmUser | null> {
  if (!uid) return null;

  try {
    // Strictly fetch document by Auth UID from /users/{uid}
    const userDocRef = doc(db, "users", uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const name = data.name || data.displayName || "Firm Member";
      
      // Read officeId directly from the Firestore document users/{uid}
      const rawOffice = data.officeId ?? data.office ?? data.office_id ?? data.officeID ?? "counsel";
      const officeId = rawOffice.toString().toLowerCase().trim() || "counsel";
      
      let role: Role = ROLES.COUNSEL;
      if (officeId === "admin") role = ROLES.ADMIN;
      else if (officeId === "finance") role = { level: 5, name: "Finance Manager" };
      else if (officeId === "managing_partner" || officeId === "partner") role = ROLES.MANAGING_PARTNER;
      else if (officeId === "associate") role = ROLES.ASSOCIATE;
      else if (officeId === "researcher") role = ROLES.RESEARCHER;
      else if (typeof data.roleLevel === "number") role = { level: Number(data.roleLevel), name: data.roleName || "Counsel" };

      const userEmail = data.email || email || `${officeId}@lexvanguard.xyz`;

      return {
        id: uid,
        name,
        email: userEmail,
        role: role,
        officeId: officeId,
        title: data.title || role.name || "Counsel",
        practice: data.practice || "Legal Counsel & Advisory"
      };
    }
  } catch (err) {
    console.warn("User profile fetch from Firestore error:", err);
  }

  // Strictly no fallback: if no document exists in /users/{uid}, return null
  return null;
}

export async function updateUserOfficeRole(targetUid: string, newOfficeId: string): Promise<boolean> {
  if (!db || !targetUid) return false;
  try {
    const userRef = doc(db, "users", targetUid);
    let roleName = "Counsel";
    let roleLevel = 50;

    if (newOfficeId === "admin") { roleName = "Admin"; roleLevel = 10; }
    else if (newOfficeId === "finance") { roleName = "Finance Manager"; roleLevel = 5; }
    else if (newOfficeId === "managing_partner") { roleName = "Managing Partner"; roleLevel = 100; }

    await updateDoc(userRef, {
      officeId: newOfficeId,
      roleName: roleName,
      roleLevel: roleLevel,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error("Error updating user office role:", err);
    return false;
  }
}

/**
 * Cleanup job: Verifies documents in `/users` and purges legacy `/userProfiles`.
 * Removes non-UID keys (legacy email/name keys) so that only valid authenticated 
 * user UIDs exist as document keys in Firestore under `/users/{uid}`.
 */
export async function cleanupOrphanUserDocs(): Promise<{ cleaned: number }> {
  if (!db) return { cleaned: 0 };
  let cleanedCount = 0;

  try {
    // 1. Scan /users collection and delete any documents whose ID is a name or invalid UID
    const usersSnap = await getDocs(collection(db, "users"));
    for (const docSnap of usersSnap.docs) {
      const docId = docSnap.id;
      const isLegacyOrNameKey = 
        !docId ||
        docId.includes(" ") ||
        docId.includes("@") ||
        docId.includes("_lexvanguard_edu") ||
        docId === "Prince Micah" ||
        docId === "Kelvin Musya" ||
        docId === "Donel Aganyo" ||
        docId === "Linet Njeri" ||
        docId === "Sharon Mwariri" ||
        docId === "Kimathi Winner" ||
        docId === "prince_micah" ||
        docId === "kelvin_musya" ||
        docId === "donel_aganyo" ||
        docId === "linet_njeri";

      if (isLegacyOrNameKey) {
        await deleteDoc(doc(db, "users", docId));
        cleanedCount++;
      }
    }

    // 2. Purge legacy /userProfiles collection entirely so user data is strictly single-sourced in /users/{uid}
    const profilesSnap = await getDocs(collection(db, "userProfiles"));
    for (const docSnap of profilesSnap.docs) {
      await deleteDoc(doc(db, "userProfiles", docSnap.id));
      cleanedCount++;
    }
  } catch (err) {
    console.warn("Cleanup job error:", err);
  }

  return { cleaned: cleanedCount };
}


export interface FirestoreMember {
  rank: string;
  role: string;
  uid: string;
  name: string;
  title?: string;
  practice?: string;
  email?: string;
  officeId?: string;
  image?: string;
  profilePhoto?: string;
  bio?: string;
  phone?: string;
  education?: string;
  achievements?: string;
}

export const DEFAULT_ATTORNEY_LIST: FirestoreMember[] = [];

export function getMemberRank(m: FirestoreMember): number {
  const title = (m.title || "").toLowerCase();
  const office = (m.officeId || "").toLowerCase();
  const name = (m.name || "").toLowerCase();

  if (name.includes("prince micah") || office === "admin" || office === "prince") return 100;
  if (title.includes("founding") && title.includes("partner")) return 95;
  if (title.includes("partner")) return 80;
  if (title.includes("finance") || title.includes("commercial")) return 70;
  if (title.includes("research") || title.includes("scholar")) return 60;
  if (title.includes("counsel") || office === "counsel") return 50;
  if (title.includes("associate")) return 40;
  if (title.includes("member")) return 30;
  return 20;
}

export function getOfficeBadge(m: FirestoreMember): string {
  const rank = getMemberRank(m);
  const name = (m.name || "").toLowerCase();

  if (name.includes("prince micah") || rank === 100) return "Managing Partner & Firm Administrator";
  if (rank >= 80) return "Partnership Office";
  if (rank >= 70) return "Commercial & Finance Office";
  if (rank >= 60) return "Research & Policy Office";
  if (rank >= 50) return "Chambers Counsel";
  if (rank >= 40) return "Associate Office";
  return "Firm Member";
}

export function sortMembersByHierarchy(members: FirestoreMember[]): FirestoreMember[] {
  return [...members].sort((a, b) => getMemberRank(b) - getMemberRank(a));
}

export function getCanonicalKey(name: string, email?: string, uid?: string): string {
  const n = (name || "").toLowerCase().trim();
  const e = (email || "").toLowerCase().trim();
  const u = (uid || "").toLowerCase().trim();
  const clean = n.replace(/[^a-z0-9]/g, "");
  return u || clean || e;
}

export function subscribeFirestoreMembers(callback: (members: FirestoreMember[]) => void) {
  try {
    const combinedMap = new Map<string, FirestoreMember>();

    const emitMerged = () => {
      const list = Array.from(combinedMap.values());
      callback(sortMembersByHierarchy(list));
    };

    const processSnapshot = (snapshot: any) => {
      snapshot.forEach((docSnap: any) => {
        const data = docSnap.data();
        const name = data.name || data.displayName || "Firm Member";
        const uid = data.uid || docSnap.id;
        const email = data.email || "";
        const image = data.profilePhoto || data.image || data.photoURL || data.photoUrl || data.avatar || data.picture;

        if (name && uid) {
          const key = getCanonicalKey(name, email, uid);

          // Sync profile info into profile-store
          syncProfileFromFirestore({
            name,
            title: data.title || data.roleName,
            practice: data.practice,
            bio: data.bio,
            phone: data.phone,
            email: data.email,
            education: data.education,
            achievements: data.achievements,
            image: image,
            profilePhoto: image
          });

          const existing = combinedMap.get(key);
          combinedMap.set(key, {
            uid: uid.toString().trim(),
            name,
            rank: data.rank || existing?.rank || "0",
            role: data.role || data.roleName || existing?.role || "Counsel",
            title: data.title || data.roleName || existing?.title || "Counsel",
            practice: data.practice || existing?.practice || "Legal Counsel & Advisory",
            email: data.email || existing?.email,
            officeId: data.officeId || existing?.officeId,
            image: image || existing?.image,
            profilePhoto: image || existing?.profilePhoto || existing?.image,
            bio: data.bio || existing?.bio,
            phone: data.phone || existing?.phone,
            education: data.education || existing?.education,
            achievements: data.achievements || existing?.achievements
          });
        }
      });
      emitMerged();
    };

    const unsubUsers = onSnapshot(collection(db, "users"), processSnapshot, (err) => {
      console.warn("Firestore users listener warning:", err);
    });

    return () => {
      unsubUsers();
    };
  } catch (e) {
    console.warn("Error setting up Firestore listener:", e);
    callback([]);
    return () => {};
  }
}

export const ATTORNEY_NAMES: string[] = [];
export const ATTORNEY_UID_MAP: Record<string, string> = {};

export const TASKS = [
  { id: 1, title: 'Draft Appellate Brief', status: 'In Progress', priority: 'High', assignee: 'Sharon Mwariri', due: 'Apr 2, 2026', description: 'Prepare the full appellate brief for submission to the Court of Appeal. Include all supporting case law and statutory references.' },
  { id: 2, title: 'M&A Due Diligence Review', status: 'Pending', priority: 'Medium', assignee: 'Prince Micah', due: 'Apr 8, 2026', description: 'Conduct a comprehensive due diligence review for the TechCorp acquisition target. Cover financials, IP, and regulatory compliance.' },
  { id: 3, title: 'Client Intake Form - IP Litigation', status: 'Completed', priority: 'High', assignee: 'Donel Aganyo', due: 'Mar 25, 2026', description: 'Complete the client intake process for the intellectual property litigation matter. All documentation verified and filed.' }
];
