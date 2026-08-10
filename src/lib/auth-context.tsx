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

        // Auto-provision initial Admin document if matching Admin UID McpIYTtunzfOZflXx3BVSRupK3G3 upon login
        if (user.uid === "McpIYTtunzfOZflXx3BVSRupK3G3") {
          try {
            const adminRef = doc(db, "users", user.uid);
            const snap = await getDoc(adminRef);
            if (!snap.exists()) {
              await setDoc(adminRef, {
                uid: user.uid,
                name: "Prince Micah",
                displayName: "Prince Micah",
                email: user.email || "prince@lexvanguard.xyz",
                officeId: "admin",
                roleLevel: 10,
                roleName: "Admin",
                title: "Managing Partner & Firm Administrator",
                practice: "Corporate & Tech Law, Mergers & Acquisitions",
                bio: "Managing Partner & Co-Owner directing firm strategy and legal operations.",
                phone: "+254 116 171 396",
                education: "LLB, Mount Kenya University",
                achievements: "Founding Partner & Head of Firm",
                profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prince%20Micah",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prince%20Micah",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prince%20Micah",
                photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prince%20Micah",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            }
          } catch (err) {
            console.warn("Admin initial document provision warning:", err);
          }
        }

        const userData = await fetchFirmUser(user.uid, user.email || undefined);
        if (userData) {
          setFirmUser(userData);
        } else {
          await signOut(auth);
          setFirebaseUser(null);
          setFirmUser(null);
        }

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

