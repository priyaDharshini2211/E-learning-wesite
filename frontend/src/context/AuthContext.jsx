import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, login as loginRequest } from "../api/authApi";
import { getTokens, setTokens } from "../api/client";

const AuthContext = createContext(null);

export const ROLE_HOME = {
  admin: "/admin",
  bde: "/bde",
  lead: "/lead",
  trainer: "/trainer",
  student: "/student",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = getTokens();
    if (!tokens?.access) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then((me) => setUser(me))
      .catch(() => setTokens(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const data = await loginRequest(username, password);
    setTokens({ access: data.access, refresh: data.refresh });
    const me = await fetchMe();
    setUser(me);
    return me;
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
