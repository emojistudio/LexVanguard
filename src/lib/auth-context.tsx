import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { fetchFirmUser, FirmUser } from "./users";

interface AuthContextType {
  firebaseUser: User | null;
  firmUser: FirmUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  firmUser: null,
  loading: true,
  logout: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firmUser, setFirmUser] = useState<FirmUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubDoc: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (unsubDoc) {
        unsubDoc();
        unsubDoc = null;
      }

      if (user) {
        setFirebaseUser(user);

        const emailLower = (user.email || "").toLowerCase().trim();
        const isAdminUser = user.uid === "McpIYTtunzfOZflXx3BVSRupK3G3" || 
                            emailLower.includes("infolexvanguardfirm") || 
                            emailLower.includes("prince");

        // Auto-provision or enforce Admin status if matching Admin UID or Admin email
        if (isAdminUser) {
          try {
            const adminRef = doc(db, "users", user.uid);
            await setDoc(adminRef, {
              uid: user.uid,
              name: user.displayName || "Prince Micah",
              displayName: user.displayName || "Prince Micah",
              email: user.email || "infolexvanguardfirm@gmail.com",
              officeId: "admin",
              roleLevel: 10,
              roleName: "Admin",
              title: "Managing Partner & Firm Administrator",
              practice: "Corporate & Tech Law, Mergers & Acquisitions",
              bio: "Managing Partner & Co-Owner directing firm strategy and legal operations.",
              phone: "+254 116 171 396",
              profilePhoto: "/images/profiles/prince.jpeg",
              updatedAt: new Date().toISOString()
            }, { merge: true });
          } catch (err) {
            console.warn("Admin provision warning:", err);
          }
        }

        let userData = await fetchFirmUser(user.uid, user.email || undefined);

        // If no user document in /users/{uid} exists yet, provision initial document
        if (!userData) {
          try {
            const userRef = doc(db, "users", user.uid);
            const defaultOffice = isAdminUser ? "admin" : "counsel";
            const defaultTitle = isAdminUser ? "Managing Partner & Firm Administrator" : "Counsel";

            await setDoc(userRef, {
              uid: user.uid,
              name: user.displayName || (isAdminUser ? "Prince Micah" : "Firm Counsel"),
              email: user.email || "",
              officeId: defaultOffice,
              roleLevel: isAdminUser ? 10 : 50,
              roleName: isAdminUser ? "Admin" : "Counsel",
              title: defaultTitle,
              practice: isAdminUser ? "Corporate Law & Governance" : "Legal Counsel & Advisory",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }, { merge: true });

            userData = await fetchFirmUser(user.uid, user.email || undefined);
          } catch (e) {
            console.warn("Auto user provision error:", e);
          }
        }

        // Final fallback to guarantee firmUser is never null for an authenticated user
        if (!userData) {
          userData = {
            id: user.uid,
            name: user.displayName || (isAdminUser ? "Prince Micah" : "Firm Counsel"),
            email: user.email || "user@lexvanguard.xyz",
            role: isAdminUser ? { level: 10, name: "Admin" } : { level: 50, name: "Counsel" },
            officeId: isAdminUser ? "admin" : "counsel",
            title: isAdminUser ? "Managing Partner & Firm Administrator" : "Counsel",
            practice: isAdminUser ? "Corporate Law & Governance" : "Legal Counsel & Advisory"
          };
        }

        setFirmUser(userData);

        // Live subscription to user document in Firestore so officeId edits apply immediately
        try {
          const userRef = doc(db, "users", user.uid);
          unsubDoc = onSnapshot(userRef, async (snap) => {
            if (snap.exists()) {
              const updated = await fetchFirmUser(user.uid, user.email || undefined);
              if (updated) {
                setFirmUser(updated);
              }
            }
          }, (err) => {
            console.warn("Auth user doc snapshot listener:", err);
          });
        } catch (e) {
          console.warn("Could not set up real-time user doc listener:", e);
        }
      } else {
        setFirebaseUser(null);
        setFirmUser(null);
      }
      setLoading(false);
    });

    return () => {
      if (unsubDoc) unsubDoc();
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ firebaseUser, firmUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

