import { doc, getDoc, collection, query, where, getDocs, onSnapshot, deleteDoc } from "firebase/firestore";
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
      
      const roleLevel = typeof data.roleLevel === "number" ? data.roleLevel : 50;
      const roleName = data.roleName || (typeof data.role === "string" ? data.role : data.role?.name) || "Counsel";
      const userEmail = data.email || email || `${officeId}@lexvanguard.xyz`;

      return {
        id: uid,
        name,
        email: userEmail,
        role: { level: Number(roleLevel), name: typeof roleName === "string" ? roleName : "Counsel" },
        officeId: officeId,
        title: data.title || roleName || "Counsel",
        practice: data.practice || "Legal Counsel & Advisory"
      };
    }
  } catch (err) {
    console.warn("User profile fetch from Firestore error:", err);
  }

  // Fallback for authenticated user if document does not exist yet
  if (uid) {
    const fallbackOffice = "counsel";
    const userName = email ? email.split("@")[0].replace(/[._]/g, " ") : "Firm Member";
    return {
      id: uid,
      name: userName,
      email: email || `counsel@lexvanguard.xyz`,
      role: { level: 50, name: "Counsel" },
      officeId: fallbackOffice,
      title: "Counsel",
      practice: "Legal Counsel & Advisory"
    };
  }

  return null;
}

/**
 * Cleanup job: Verifies documents in `/users` and `/userProfiles` collections.
 * Removes non-UID keys (legacy email/name keys) so that only valid authenticated 
 * user UIDs exist as document keys in Firestore.
 */
export async function cleanupOrphanUserDocs(): Promise<{ cleaned: number }> {
  if (!db) return { cleaned: 0 };
  let cleanedCount = 0;

  try {
    const usersSnap = await getDocs(collection(db, "users"));
    for (const docSnap of usersSnap.docs) {
      const docId = docSnap.id;
      // Valid Auth UIDs are typical Firebase UIDs without '@' or '_lexvanguard_edu' or legacy name strings
      const isLegacyOrOrphan = docId.includes("@") || docId.includes("_lexvanguard_edu") || docId.includes("donel_aganyo") || docId.includes("prince_micah") || docId.includes("kelvin_musya") || docId.includes("linet_njeri");
      
      if (isLegacyOrOrphan) {
        await deleteDoc(doc(db, "users", docId));
        cleanedCount++;
      }
    }

    const profilesSnap = await getDocs(collection(db, "userProfiles"));
    for (const docSnap of profilesSnap.docs) {
      const docId = docSnap.id;
      const isLegacyOrOrphan = docId.includes("@") || docId.includes("_lexvanguard_edu") || docId.includes("donel_aganyo") || docId.includes("prince_micah") || docId.includes("kelvin_musya") || docId.includes("linet_njeri");
      
      if (isLegacyOrOrphan) {
        await deleteDoc(doc(db, "userProfiles", docId));
        cleanedCount++;
      }
    }
  } catch (err) {
    console.warn("Cleanup job error:", err);
  }

  return { cleaned: cleanedCount };
}


export interface FirestoreMember {
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

export const DEFAULT_ATTORNEY_LIST: FirestoreMember[] = [
  { uid: "n6NKoyAIuVSXYEaIbRVN9drINNy1", name: "Prince Micah", title: "Founding Partner & Co-Owner", practice: "Corporate & Tech Law, Mergers & Acquisitions", email: "prince@lexvanguard.xyz", image: resolveProfileImage("Prince Micah"), profilePhoto: resolveProfileImage("Prince Micah") },
  { uid: "SSbNEJrVyhM6b8LbWYsyunPGk6l2", name: "Kelvin Musya", title: "Founding Partner & Co-Owner", practice: "Appellate Advocacy, Supreme Court Litigation", email: "kelvin@lexvanguard.xyz", image: resolveProfileImage("Kelvin Musya"), profilePhoto: resolveProfileImage("Kelvin Musya") },
  { uid: "donel_aganyo_uid", name: "Donel Aganyo", title: "Founding Partner & Co-Owner", practice: "Intellectual Property, Patent Litigation", email: "donel@lexvanguard.xyz", image: resolveProfileImage("Donel Aganyo"), profilePhoto: resolveProfileImage("Donel Aganyo") },
  { uid: "linet_njeri_uid", name: "Linet Njeri", title: "Finance Manager", practice: "Commercial Litigation, Dispute Resolution", email: "linet@lexvanguard.xyz", image: resolveProfileImage("Linet Njeri"), profilePhoto: resolveProfileImage("Linet Njeri") },
  { uid: "sharon_mwariri_uid", name: "Sharon Mwariri", title: "Lead Legal Researcher", practice: "Policy Analysis, Legislative Drafting", email: "sharon@lexvanguard.xyz", image: resolveProfileImage("Sharon Mwariri"), profilePhoto: resolveProfileImage("Sharon Mwariri") },
  { uid: "kimathi_winner_uid", name: "Kimathi Winner", title: "Associate", practice: "Pro Bono Initiative, Civil Rights", email: "kimathi@lexvanguard.xyz", image: resolveProfileImage("Kimathi Winner"), profilePhoto: resolveProfileImage("Kimathi Winner") }
];

export function getMemberRank(m: FirestoreMember): number {
  const title = (m.title || "").toLowerCase();
  const office = (m.officeId || "").toLowerCase();
  const name = (m.name || "").toLowerCase();

  if (name.includes("prince micah") || office === "prince") return 100;
  if (name.includes("kelvin musya") || office === "kelvin") return 98;
  if (name.includes("donel aganyo") || office === "donel") return 96;
  if (title.includes("founding") && title.includes("partner")) return 95;
  if (title.includes("partner")) return 80;
  if (title.includes("finance") || title.includes("commercial") || office === "linet") return 70;
  if (title.includes("research") || title.includes("scholar") || office === "sharon") return 60;
  if (title.includes("counsel") || office === "counsel") return 50;
  if (title.includes("associate") || office === "kimathi") return 40;
  if (title.includes("member")) return 30;
  return 20;
}

export function getOfficeBadge(m: FirestoreMember): string {
  const rank = getMemberRank(m);
  const name = (m.name || "").toLowerCase();

  if (name.includes("prince micah") || rank === 100) return "Founding Partner & Co-Owner • Head of Firm";
  if (name.includes("kelvin musya") || rank === 98) return "Founding Partner & Co-Owner • Head of Firm";
  if (name.includes("donel aganyo") || rank === 96) return "Founding Partner & Co-Owner • Head of Firm";
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

  if (n.includes("donel") || e.includes("donel") || u.includes("donel")) return "donel_aganyo";
  if (n.includes("prince") || e.includes("prince") || u.includes("prince")) return "prince_micah";
  if (n.includes("kelvin") || e.includes("kelvin") || u.includes("kelvin")) return "kelvin_musya";
  if (n.includes("linet") || e.includes("linet") || u.includes("linet")) return "linet_njeri";
  if (n.includes("sharon") || e.includes("sharon") || u.includes("sharon")) return "sharon_mwariri";
  if (n.includes("kimathi") || e.includes("kimathi") || u.includes("kimathi")) return "kimathi_winner";
  if (n.includes("sherifa") || e.includes("sherifa") || u.includes("sherifa")) return "sherifa_abdilatif";

  const clean = n.replace(/[^a-z0-9]/g, "");
  return u || clean || e;
}

export function subscribeFirestoreMembers(callback: (members: FirestoreMember[]) => void) {
  // Trigger background auto-sync of local profiles and auto-cleanup of legacy non-UID user docs
  try {
    syncLocalProfilesToFirestore();
    cleanupOrphanUserDocs();
  } catch {}

  try {
    const combinedMap = new Map<string, FirestoreMember>();

    const emitMerged = () => {
      const list = Array.from(combinedMap.values());
      const seenKeys = new Set(list.map(m => getCanonicalKey(m.name, m.email, m.uid)));

      // Ensure default attorneys are included if not yet present
      DEFAULT_ATTORNEY_LIST.forEach((def) => {
        const key = getCanonicalKey(def.name, def.email, def.uid);
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          list.push(def);
        }
      });

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

    const unsubUserProfiles = onSnapshot(collection(db, "userProfiles"), processSnapshot, (err) => {
      console.warn("Firestore userProfiles listener warning:", err);
    });

    return () => {
      unsubUsers();
      unsubUserProfiles();
    };
  } catch (e) {
    console.warn("Error setting up Firestore listener, using local default attorney list:", e);
    callback(sortMembersByHierarchy(DEFAULT_ATTORNEY_LIST));
    return () => {};
  }
}

export const ATTORNEY_NAMES = [
  "Prince Micah",
  "Kelvin Musya",
  "Donel Aganyo",
  "Linet Njeri",
  "Sharon Mwariri",
  "Kimathi Winner"
];

export const ATTORNEY_UID_MAP: Record<string, string> = {
  "Prince Micah": "n6NKoyAIuVSXYEaIbRVN9drINNy1",
  "Kelvin Musya": "SSbNEJrVyhM6b8LbWYsyunPGk6l2"
};

export const TASKS = [
  { id: 1, title: 'Draft Appellate Brief', status: 'In Progress', priority: 'High', assignee: 'Sharon Mwariri', due: 'Apr 2, 2026', description: 'Prepare the full appellate brief for submission to the Court of Appeal. Include all supporting case law and statutory references.' },
  { id: 2, title: 'M&A Due Diligence Review', status: 'Pending', priority: 'Medium', assignee: 'Prince Micah', due: 'Apr 8, 2026', description: 'Conduct a comprehensive due diligence review for the TechCorp acquisition target. Cover financials, IP, and regulatory compliance.' },
  { id: 3, title: 'Client Intake Form - IP Litigation', status: 'Completed', priority: 'High', assignee: 'Donel Aganyo', due: 'Mar 25, 2026', description: 'Complete the client intake process for the intellectual property litigation matter. All documentation verified and filed.' }
];
