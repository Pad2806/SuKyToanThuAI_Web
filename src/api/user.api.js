import { api } from "./axios";

//
// ================= USER PROFILE =================
//

// 👉 cập nhật thông tin cá nhân
export const updateProfileApi = (data) => {
  return api.put("/users/me", data);
};

export const changePasswordApi = (data) => {
  return api.put("/auth/change-password", data);
};
//
// ================= ADMIN USER =================
//

// 👉 lấy danh sách user (có filter)
export const getUsersApi = (params) => {
  return api.get("/admin/users", { params });
};

// 👉 lấy chi tiết user
export const getUserByIdApi = (id) => {
  return api.get(`/admin/users/${id}`);
};

// 👉 tạo user (admin)
export const createUserApi = (data) => {
  return api.post("/admin/users", data);
};

// 👉 cập nhật user (admin)
export const updateUserApi = (id, data) => {
  return api.put(`/admin/users/${id}`, data);
};

// 👉 xoá user
export const deleteUserApi = (id) => {
  return api.delete(`/admin/users/${id}`);
};