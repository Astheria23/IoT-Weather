import { createContext, useEffect, useMemo, useState } from "react";
import { attachToken, api } from "../services/api.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    attachToken(token);
  }, [token]);

  const login = (nextToken) => {
    if (!nextToken) return;
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Jangan langsung auto-logout di setiap 401.
        // Biarkan komponen yang manggil API menangani error ini,
        // supaya token tidak hilang tiba-tiba saat sedang debug / token masih valid.
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptorId);
    };
  }, []);

  const value = useMemo(
    () => ({ token, login, logout, isAuthenticated: Boolean(token) }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
