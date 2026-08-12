import { useState } from "react";
import { useLocation } from "wouter";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchFirmUser } from "@/lib/users";
import { signOut } from "firebase/auth";
import Header from "@/components/Header";
import logoImg from "../images/logo/logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const credential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await fetchFirmUser(credential.user.uid, email);

      if (userData) {
        setEmail("");
        setPassword("");
        setLocation(`/office/${userData.officeId}`);
      } else {
        await signOut(auth);
        setError("Access denied. Your account is not authorized for a firm office.");
      }
    } catch (err: unknown) {
      const firebaseErr = err as { code?: string };
      if (
        firebaseErr.code === "auth/invalid-credential" ||
        firebaseErr.code === "auth/wrong-password" ||
        firebaseErr.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password. Please check your credentials.");
      } else if (firebaseErr.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-black">
        <Header />
      </div>
      <div className="flex-1 flex items-center justify-center py-20 px-4 pt-36">
        <div className="bg-white p-8 md:p-10 w-full max-w-md border-t-4 border-[#0A1F44] shadow-xl rounded-b-xl">
          
          {/* Logo Card Header */}
          <div className="bg-[#FAF8F5] border border-amber-200/60 p-6 rounded-2xl mb-6 flex flex-col items-center text-center shadow-xs">
            <div className="w-36 h-36 md:w-44 md:h-44 mb-2 flex items-center justify-center">
              <img src={logoImg} alt="LexVanguard Advocates LLP Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <h1 className="text-base font-serif font-extrabold text-[#0A1F44] uppercase tracking-[0.2em] leading-tight">
              LEXVANGUARD
            </h1>
            <span className="text-[10px] font-bold text-[#0A1F44]/80 uppercase tracking-[0.25em] mt-0.5">
              ADVOCATES LLP
            </span>
          </div>

          <h2 className="text-xl font-serif text-slate-900 text-center mb-2 font-bold">Chambers Portal Login</h2>
          <p className="text-gray-600 text-center mb-6 text-xs">
            Authenticate with your firm credentials to access the LexVanguard Advocates system.
          </p>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 text-sm" role="alert">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full px-3 py-2 text-gray-900 border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black rounded-lg"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#ffc107] hover:bg-yellow-400 text-black px-6 py-3.5 font-extrabold text-xs uppercase tracking-widest transition-colors mt-4 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-md font-mono"
            >
              {loading ? "Loading Office..." : "LOGIN"}
            </button>
          </div>

          <div className="mt-8 text-center space-y-2">
            <div>
              <a href="/" className="text-slate-500 font-semibold text-xs uppercase tracking-widest hover:underline">
                « Return to Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
