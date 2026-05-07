import { loginApi } from "@/api/auth.api";
import { registerApi } from "@/api/auth.api";

export const login = async (data) => {
  const res = await loginApi(data);

  const { access_token, refresh_token, user } = res.data;

  // 👉 lưu token
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);

  // 👉 lưu user (optional)
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const register = async (data) => {
  const res = await registerApi(data);
  return res.data;
};