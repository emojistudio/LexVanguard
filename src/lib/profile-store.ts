import { makeAvatarSvg } from "./avatar";
import { resolveProfileImage, DEFAULT_FALLBACK_AVATAR } from "./profile-images";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { getCanonicalKey } from "./users";
import { compressImage } from "./imgbb";

export interface AttorneyProfile {
  name: string;
  title: string;
  practice: string;
  bio: string;
  phone: string;
  email: string;
  education: string;
  achievements: string;
  image: string;
  profilePhoto?: string;
}

const DEFAULT_PROFILES: Record<string, AttorneyProfile> = {
  "Prince Micah": {
    name: "Prince Micah",
    title: "Managing Partner & Firm Administrator",
    practice: "Corporate & Tech Law, Mergers & Acquisitions",
    bio: "Managing Partner directing firm strategy, corporate legal operations, and technology.",
    phone: "+254 116 171 396",
    email: "prince@lexvanguard.xyz",
    education: "LLB, Mount Kenya University",
    achievements: "Founding Partner & Head of Firm",
    image: resolveProfileImage("Prince Micah")
  }
};

const STORAGE_KEY = "lexvanguard_attorney_profiles";

function findDefaultProfile(name: string): Partial<AttorneyProfile> {
  if (!name) return {};
  if (DEFAULT_PROFILES[name]) return DEFAULT_PROFILES[name];
  const normalized = name.toLowerCase();
  for (const key of Object.keys(DEFAULT_PROFILES)) {
    if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
      return DEFAULT_PROFILES[key];
    }
  }
  return {};
}

export function loadProfile(name: string, fallbackData?: Partial<AttorneyProfile>): AttorneyProfile {
  const base: Partial<AttorneyProfile> = findDefaultProfile(name);

  let storedObj: Partial<AttorneyProfile> = {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const all = JSON.parse(stored) as Record<string, AttorneyProfile>;
      if (all[name]) storedObj = all[name];
    }
  } catch {}

  const candidate = fallbackData?.profilePhoto || fallbackData?.image || (fallbackData as any)?.photoURL || storedObj.image || base.image;
  const finalImage = resolveProfileImage(name, candidate);

  return {
    name,
    title: fallbackData?.title || storedObj.title || base.title || "Counsel",
    practice: fallbackData?.practice || storedObj.practice || base.practice || "Legal Counsel & Advisory",
    bio: fallbackData?.bio || storedObj.bio || base.bio || "Dedicated advocate providing legal counsel and advocacy at LexVanguard Advocates LLP.",
    phone: fallbackData?.phone || storedObj.phone || base.phone || "+254 116 171 396",
    email: fallbackData?.email || storedObj.email || base.email || `${name.toLowerCase().replace(/\s+/g, '.')}@lexvanguard.xyz`,
    education: fallbackData?.education || storedObj.education || base.education || "LLB, Mount Kenya University",
    achievements: fallbackData?.achievements || storedObj.achievements || base.achievements || "Legal Advocate",
    image: finalImage,
    profilePhoto: finalImage
  };
}

export function syncProfileFromFirestore(data: Partial<AttorneyProfile> & { name: string, profilePhoto?: string }): AttorneyProfile {
  const existing = loadProfile(data.name, data);
  const cloudImage = data.profilePhoto || data.image || (data as any)?.photoURL;
  const resolved = resolveProfileImage(data.name, cloudImage);
  const updated: AttorneyProfile = {
    ...existing,
    ...data,
    image: resolved,
    profilePhoto: resolved
  };

  DEFAULT_PROFILES[data.name] = updated;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all = stored ? (JSON.parse(stored) as Record<string, AttorneyProfile>) : {};
    all[data.name] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lexvanguard_profile_updated", { detail: updated }));
  }

  return updated;
}

function cleanFirestorePayload<T extends Record<string, any>>(data: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const key of Object.keys(data)) {
    const val = data[key];
    cleaned[key] = val === undefined ? "" : val;
  }
  return cleaned;
}

export function saveProfile(profile: AttorneyProfile): void {
  // Ensure profilePhoto is in sync with image
  const profileToSave = {
    ...profile,
    profilePhoto: profile.profilePhoto || profile.image
  };

  // Update memory cache
  DEFAULT_PROFILES[profile.name] = { ...DEFAULT_PROFILES[profile.name], ...profileToSave };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const all = stored ? (JSON.parse(stored) as Record<string, AttorneyProfile>) : {};
    all[profile.name] = profileToSave;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {}

  // Broadcast custom event for immediate UI updates across components
  try {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("lexvanguard_profile_updated", { detail: profileToSave }));
    }
  } catch {}

  // Sync to Firestore asynchronously with light payload guarantee
  (async () => {
    try {
      const activeUid = auth?.currentUser?.uid;
      if (db && activeUid) {
        let finalImage = profileToSave.image || profileToSave.profilePhoto || "";

        // If image is a large Base64 string (>100KB), compress it first so Firestore setDoc never fails
        if (finalImage && finalImage.startsWith("data:image/") && finalImage.length > 100000) {
          try {
            finalImage = await compressImage(finalImage, 800, 800, 0.75);
          } catch {}
        }

        const userPayload = cleanFirestorePayload({
          uid: activeUid,
          name: profileToSave.name || "",
          displayName: profileToSave.name || "",
          title: profileToSave.title || "Counsel",
          practice: profileToSave.practice || "Legal Advisory",
          bio: profileToSave.bio || "",
          phone: profileToSave.phone || "",
          email: profileToSave.email || "",
          education: profileToSave.education || "",
          achievements: profileToSave.achievements || "",
          profilePhoto: finalImage || "",
          image: finalImage || "",
          photoURL: finalImage || "",
          avatar: finalImage || "",
          updatedAt: new Date().toISOString()
        });

        // Write user profile data strictly to "users/{activeUid}"
        await setDoc(doc(db, "users", activeUid), userPayload, { merge: true });
      }
    } catch (err) {
      console.warn("Could not sync profile to Firestore:", err);
    }
  })();
}

export async function syncLocalProfilesToFirestore(): Promise<void> {
  if (!db) return;
  const activeUid = auth?.currentUser?.uid;
  if (!activeUid) return;

  try {
    const allProfiles = getAllProfiles();
    const currentName = auth.currentUser.displayName || auth.currentUser.email?.split("@")[0] || "";
    const prof = allProfiles[currentName];
    if (!prof) return;

    let finalImage = prof.image || prof.profilePhoto || "";

    if (finalImage && finalImage.startsWith("data:image/") && finalImage.length > 100000) {
      try {
        finalImage = await compressImage(finalImage, 800, 800, 0.75);
      } catch {}
    }

    const userPayload = cleanFirestorePayload({
      uid: activeUid,
      name: prof.name || "",
      displayName: prof.name || "",
      title: prof.title || "Counsel",
      practice: prof.practice || "Legal Advisory",
      bio: prof.bio || "",
      phone: prof.phone || "",
      email: prof.email || "",
      education: prof.education || "",
      achievements: prof.achievements || "",
      profilePhoto: finalImage || "",
      image: finalImage || "",
      photoURL: finalImage || "",
      avatar: finalImage || "",
      updatedAt: new Date().toISOString()
    });

    await setDoc(doc(db, "users", activeUid), userPayload, { merge: true });
  } catch (err) {
    console.warn("Auto-sync local profiles to Firestore failed:", err);
  }
}

// Auto-run local profiles sync to Firestore on load
if (typeof window !== "undefined") {
  setTimeout(() => {
    syncLocalProfilesToFirestore();
  }, 1000);
}

export function getAllProfiles(): Record<string, AttorneyProfile> {
  const defaults = { ...DEFAULT_PROFILES };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const all = JSON.parse(stored) as Record<string, AttorneyProfile>;
      for (const name of Object.keys(all)) {
        defaults[name] = { ...defaults[name], ...all[name] };
      }
    }
  } catch {}
  return defaults;
}

export function handleProfileImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, name?: string): void {
  const imgEl = e.target as HTMLImageElement;
  const currentSrc = imgEl.src || "";

  // Try fixing ibb.co viewer links to direct i.ibb.co URL
  if (currentSrc && currentSrc.includes("ibb.co/") && !currentSrc.includes("i.ibb.co/")) {
    const parts = currentSrc.split("ibb.co/")[1]?.split("/");
    const code = parts?.[0];
    if (code) {
      imgEl.src = `https://i.ibb.co/${code}/image.jpg`;
      return;
    }
  }

  const resolved = resolveProfileImage(name);
  
  if (currentSrc !== resolved && !imgEl.dataset.failedOnce) {
    imgEl.dataset.failedOnce = "true";
    imgEl.src = resolved;
  } else {
    // Ultimate fallback to default.png
    imgEl.src = "/default.png";
  }
}


