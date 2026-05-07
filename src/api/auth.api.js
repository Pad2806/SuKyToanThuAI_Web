import axios from "axios";
import { api } from "./axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 👉 DÙNG axios thường (KHÔNG interceptor) để tránh loop refresh
export const refreshTokenApi = (refresh_token) => {
  return axios.post(`${BASE_URL}/auth/refresh`, {
    refresh_token,
  });
};

// 👉 REGISTER
export const registerApi = (data) => {
  return api.post("/auth/register", data);
};

// 👉 LOGIN
export const loginApi = (data) => {
  return api.post("/auth/login", data);
};

// 👉 GET PROFILE
export const getMeApi = () => {
  return api.get("/auth/me");
};