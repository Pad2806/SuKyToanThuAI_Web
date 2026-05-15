import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api-client.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => api.readAuth());
  const [loading, setLoading] = useState(Boolean(auth?.accessToken));

  const persist = useCallback((nextAuth) => {
    setAuth(nextAuth);
    api.writeAuth(nextAuth);
  }, []);

  const loadMe = useCallback(async () => {
    if (!api.readAuth()?.accessToken) {
      setLoading(false);
      return;
    }
    try {
      const user = await api.get('/auth/me');
      persist({ ...api.readAuth(), user });
    } catch {
      persist(null);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  useEffect(() => {
    loadMe();
    const onUnauthorized = () => persist(null);
    window.addEventListener('sukyai:unauthorized', onUnauthorized);
    return () => window.removeEventListener('sukyai:unauthorized', onUnauthorized);
  }, [loadMe, persist]);

  const login = useCallback(async ({ email, password }) => {
    const tokens = await api.post('/auth/login', { email, password });
    persist({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, user: null });
    const user = await api.get('/auth/me');
    persist({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, user });
    return user;
  }, [persist]);

  const register = useCallback(async ({ email, password, displayName }) => {
    const tokens = await api.post('/auth/register', {
      email,
      password,
      display_name: displayName,
    });
    persist({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, user: null });
    const user = await api.get('/auth/me');
    persist({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token, user });
    return user;
  }, [persist]);

  const logout = useCallback(async () => {
    const refreshToken = api.readAuth()?.refreshToken;
    if (refreshToken) {
      await api.post('/auth/logout', { refresh_token: refreshToken }).catch(() => null);
    }
    persist(null);
  }, [persist]);

  const value = useMemo(() => ({
    user: auth?.user ?? null,
    accessToken: auth?.accessToken ?? null,
    loading,
    login,
    register,
    logout,
  }), [auth, loading, login, logout, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

