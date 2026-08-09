import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
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

