// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { loginApi, registerApi, getMeApi } from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👉 load user khi mở app
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // 👉 nếu backend login đã trả role thì có thể bỏ getMe
        const res = await getMeApi();
        setUser(res.data);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ================= LOGIN =================
  const login = async (form) => {
    const res = await loginApi(form);

    const { access_token, refresh_token, user } = res.data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  // ================= REGISTER =================
  const register = async (form) => {
    return await registerApi(form);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 👉 custom hook
export const useAuth = () => useContext(AuthContext);