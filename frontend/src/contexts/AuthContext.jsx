import { createContext, useContext, useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncWithBackend = async () => {
      if (!isLoaded) return;

      if (!isSignedIn || !clerkUser) {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }

      const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
      if (!email) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const bridge = await api.post("/auth/clerk-login", {
          clerk_user_id: clerkUser.id,
          email,
          name: clerkUser.fullName || clerkUser.firstName || "Learner",
        });
        localStorage.setItem("token", bridge.data.access_token);
        setUser({ ...bridge.data.user, is_admin: !!bridge.data.user?.is_admin });
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncWithBackend();
  }, [isLoaded, isSignedIn, clerkUser]);

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
