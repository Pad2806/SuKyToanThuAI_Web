import { useState, useEffect } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Sidebar from "../components/sidebar/SideBar";
import styles from "./admin.module.scss";

import imgBHT from "../assets/images/hbt.png";
import imgDBP from "../assets/images/dbp.png";
import imgQThanh from "../assets/images/qthanh.png";

// Import các API đã export từ user.api.js
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi
} from "../../../api/user.api";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("events");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);

  // State cho quản lý Users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "student",
    is_active: true,
  });

  // Load danh sách users khi vào tab "users"
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsersApi();        // Gọi API
      setUsers(response.data || response);         // Phù hợp với cấu trúc response của axios
    } catch (error) {
      console.error("Lỗi khi lấy danh sách users:", error);
      alert("Không thể tải danh sách người dùng. Vui lòng kiểm tra kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mở form thêm mới
  const openAddUserForm = () => {
    setEditingUser(null);
    setFormData({
      fullname: "",
      email: "",
      password: "",
      role: "student",
      is_active: true,
    });
    setShowUserForm(true);
  };

  // Mở form sửa
  const openEditUserForm = (user) => {
    setEditingUser(user);
    setFormData({
      fullname: user.fullname || "",
      email: user.email || "",
      password: "",
      role: user.role || "student",
      is_active: user.is_active ?? true,
    });
    setShowUserForm(true);
  };

  // Lưu (Thêm hoặc Sửa)
  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Sửa user
        await updateUserApi(editingUser.id, {
          fullname: formData.fullname,
          role: formData.role,
          is_active: formData.is_active,
        });
        alert("Cập nhật người dùng thành công!");
      } else {
        // Thêm user mới
        await createUserApi({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname,
          role: formData.role,
        });
        alert("Thêm người dùng thành công!");
      }

      setShowUserForm(false);
      fetchUsers(); // Refresh danh sách
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Có lỗi xảy ra khi lưu người dùng");
    }
  };

  // Xóa user
  const handleDeleteUser = async (userId, fullname) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${fullname}"?`)) return;

    try {
      await deleteUserApi(userId);
      alert("Đã xóa người dùng thành công!");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Không thể xóa người dùng");
    }
  };
  const handleCheckboxChange = (e) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };
  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return (
          <div className={styles.fadeUp}>
            <h1 className={styles.title}>Quản lý người dùng</h1>
            <p className={styles.subtitle}>{users.length} tài khoản</p>

            <div className={styles.userToolbar}>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                className={styles.searchInput}
              />

              <button className={styles.btn_add} onClick={openAddUserForm}>
                + Thêm người dùng mới
              </button>
            </div>

            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={user.role === "admin" ? styles.adminTag : styles.userTag}>
                        {user.role === "admin" ? "Admin" : user.role === "student" ? "Học sinh" : "Giáo viên"}
                      </span>
                    </td>
                    <td style={{ color: user.is_active ? "#84c794" : "#ff6b6b" }}>
                      ● {user.is_active ? "Active" : "Inactive"}
                    </td>
                    <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : "N/A"}</td>
                    <td className={styles.actionCell}>
                      <button className={styles.btn_edit} onClick={() => openEditUserForm(user)}>
                        Sửa
                      </button>
                      <button
                        className={styles.btn_del}
                        onClick={() => handleDeleteUser(user.id, user.fullname)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal Thêm / Sửa User */}
            {showUserForm && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalBoxLarge}>
                  <h2>{editingUser ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}</h2>

                  <div className={styles.formGrid}>
                    <input
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      placeholder="Họ và tên"
                    />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      disabled={!!editingUser}
                    />

                    {/* Chỉ hiển thị khi thêm mới */}
                    {!editingUser && (
                      <div style={{ position: 'relative' }}>
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Mật khẩu"
                        />
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#9a8f7c' }}
                        >
                          {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </div>
                      </div>
                    )}

                    {/* Chỉ hiển thị khi SỬA user */}
                    {editingUser && (
                      <div style={{ position: 'relative' }}>
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Mật khẩu mới (để trống nếu không đổi)"
                        />
                        <div
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#9a8f7c' }}
                        >
                          {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </div>
                      </div>
                    )}

                    <select name="role" value={formData.role} onChange={handleInputChange}>
                      <option value="student">Học sinh (Student)</option>
                      <option value="teacher">Giáo viên (Teacher)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                    {/* Trạng thái hoạt động */}
                    <div className={styles.activeStatus}>
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="is_active">
                        Tài khoản đang hoạt động
                      </label>
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button className={styles.btn_add} onClick={handleSaveUser}>
                      {editingUser ? "Cập nhật" : "Tạo mới"}
                    </button>
                    <button
                      className={styles.btn_close}
                      onClick={() => setShowUserForm(false)}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // Các tab khác giữ nguyên...
      default:
        return <div>Chưa cập nhật nội dung</div>;
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
}