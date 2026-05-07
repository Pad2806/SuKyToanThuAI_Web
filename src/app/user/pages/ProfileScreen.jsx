import { useState, useEffect } from "react";
import "../styles/ProfileScreen.css";

import { getMeApi } from "../../../api/auth.api";
import {
  updateProfileApi,
  changePasswordApi,
} from "../../../api/user.api";
const RECENT_ACTIVITY = [
  { icon: "📊", type: "slide", title: "Khởi nghĩa Hai Bà Trưng", time: "2 giờ trước" },
  { icon: "📖", type: "comic", title: "Chiến thắng Điện Biên Phủ", time: "Hôm qua" },
  { icon: "📊", type: "slide", title: "Đế chế Mông Cổ – Thành Cát Tư Hãn", time: "1 tuần trước" },
  { icon: "📖", type: "comic", title: "Đại phá quân Thanh", time: "2 tuần trước" },
];
// ================= PASSWORD STRENGTH =================
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Yếu", "Trung bình", "Mạnh", "Rất mạnh"];
const STRENGTH_KEYS = ["", "weak", "weak", "medium", "strong"];

export default function ProfileScreen() {
  // ================= STATE =================
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthYear: "",
    gender: "",
    school: "",
    grade: "",
    bio: "",
    createdAt: null,
  });
  function formatJoinDate(dateStr) {
    if (!dateStr) return "Chưa rõ";

    const date = new Date(dateStr);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `Tham gia tháng ${month}, ${year}`;
  }
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [pwSaved, setPwSaved] = useState(false);

  const strength = getStrength(pwForm.next);

  // ================= LOAD USER =================
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getMeApi();
        const u = res.data;
        console.log("CALL API");
        console.log("DATA:", res.data);
        const parts = (u.fullname || "").split(" ");

        setForm({
          firstName: parts.slice(-1).join("") || "",
          lastName: parts.slice(0, -1).join(" ") || "",
          email: u.email || "",
          phone: u.phone || "",
          birthYear: u.birthYear || "",
          gender: u.gender || "male",
          school: u.school || "",
          grade: u.grade || "",
          bio: u.bio || "",
          createdAt: u.created_at || null,
        });
      } catch (err) {
        console.log("Load user lỗi:", err);
      }
    }

    loadUser();
  }, []);

  // ================= HANDLE CHANGE =================
  function handleChange(e) {
    setSaved(false);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // ================= SAVE PROFILE =================
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfileApi({
        fullname: `${form.lastName} ${form.firstName}`,
        phone: form.phone,
        birthYear: form.birthYear,
        gender: form.gender,
        school: form.school,
        grade: form.grade,
        bio: form.bio,
      });

      setSaved(true);
    } catch (err) {
      alert("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  }

  // ================= CHANGE PASSWORD =================
  async function handlePwSave(e) {
    e.preventDefault();

    if (pwForm.next !== pwForm.confirm) {
      return alert("Mật khẩu không khớp!");
    }

    if (strength < 2) {
      return alert("Mật khẩu quá yếu!");
    }

    try {
      await changePasswordApi({
        current_password: pwForm.current,
        new_password: pwForm.next,
      });

      setPwSaved(true);
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      alert(err.response?.data?.detail || "Đổi mật khẩu thất bại");
    }
  }

  // ================= AVATAR =================
  const initials = `${form.firstName?.[0] ?? ""}${form.lastName?.[0] ?? ""}`.toUpperCase();

  // ================= UI =================
  return (
    <div className="profile">
      {/* HERO */}
      <div className="profile__hero">
        <div className="profile__avatar-wrap">
          <div className="profile__avatar">
            {initials}
            <div className="profile__avatar-overlay">📷</div>
          </div>
        </div>

        <div className="profile__hero-info">
          <div className="profile__hero-role">Thành viên</div>

          <h1 className="profile__hero-name">
            {form.firstName} {form.lastName}
          </h1>

          <div className="profile__hero-meta">
            <span>{form.email}</span>
            <span>{form.school || "Chưa cập nhật trường"}</span>
            <span>{formatJoinDate(form.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="profile__body">
        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* ===== PROFILE FORM ===== */}
          <div className="profile__card">
            <div className="profile__card-header">
              <div>
                <div className="profile__card-title">Thông tin cá nhân</div>
                <div className="profile__card-subtitle">
                  Cập nhật họ tên, liên lạc và thông tin học tập
                </div>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="profile__form">

                <div className="profile__form-row">
                  <div className="profile__field">
                    <label className="profile__label">Họ</label>
                    <input className="profile__input" name="lastName" value={form.lastName} onChange={handleChange} />
                  </div>

                  <div className="profile__field">
                    <label className="profile__label">Tên</label>
                    <input className="profile__input" name="firstName" value={form.firstName} onChange={handleChange} />
                  </div>
                </div>

                <div className="profile__form-row">
                  <div className="profile__field">
                    <label className="profile__label">Email</label>
                    <div className="profile__input-wrap">
                      <span className="profile__input-icon">✉️</span>
                      <input className="profile__input" value={form.email} disabled />
                    </div>
                  </div>

                  <div className="profile__field">
                    <label className="profile__label">Số điện thoại</label>
                    <div className="profile__input-wrap">
                      <span className="profile__input-icon">📱</span>
                      <input className="profile__input" name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="profile__form-row">
                  <div className="profile__field">
                    <label className="profile__label">Năm sinh</label>
                    <input className="profile__input" name="birthYear" value={form.birthYear} onChange={handleChange} />
                  </div>

                  <div className="profile__field">
                    <label className="profile__label">Giới tính</label>
                    <select className="profile__select" name="gender" value={form.gender} onChange={handleChange}>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </select>
                  </div>
                </div>

                <div className="profile__field">
                  <label className="profile__label">Trường</label>
                  <div className="profile__input-wrap">
                    <span className="profile__input-icon">🏫</span>
                    <input className="profile__input" name="school" value={form.school} onChange={handleChange} />
                  </div>
                </div>
                <div className="profile__field">
                  <label className="profile__label">Lớp / Khối</label>
                  <select
                    className="profile__select"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                  >
                    {["6", "7", "8", "9", "10", "11", "12", "Đại học", "Khác"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="profile__field profile__field--full">
                <label className="profile__label">Giới thiệu bản thân</label>
                <textarea className="profile__textarea" name="bio" value={form.bio} onChange={handleChange} />
              </div>
              <div className="profile__form-footer">
                <span className={`profile__save-hint ${saved ? "profile__save-hint--success" : ""}`}>
                  {saved ? "✓ Đã lưu thành công!" : "Thay đổi chưa được lưu"}
                </span>

                <button type="submit" className="profile__btn-save" disabled={saving}>
                  {saving ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>

          {/* ===== PASSWORD ===== */}
          <div className="profile__card">
            <div className="profile__card-header">
              <div>
                <div className="profile__card-title">Bảo mật & Mật khẩu</div>
                <div className="profile__card-subtitle">Cập nhật mật khẩu để bảo vệ tài khoản</div>
              </div>
            </div>

            <form onSubmit={handlePwSave}>
              <div className="profile__password-form">
                <div className="profile__field">
                  <label className="profile__label">Mật khẩu hiện tại</label>
                  <input className="profile__input" type="password" placeholder="••••••••"
                    value={pwForm.current}
                    onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  />
                </div>
                <div className="profile__field">
                  <label className="profile__label">Mật khẩu mới</label>
                  <input className="profile__input" type="password" placeholder="••••••••"
                    value={pwForm.next}
                    onChange={(e) => setPwForm({ ...pwForm, next: e.target.value })}
                  />
                </div>
                <div className="profile__field">
                  <label className="profile__label">Xác nhận mật khẩu mới</label>
                  <input className="profile__input" type="password" placeholder="••••••••"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  />

                  <div>Độ mạnh: {STRENGTH_LABELS[strength]}</div>

                  <button className="profile__btn-save">🔒 Đổi mật khẩu</button>

                  {pwSaved && <div style={{ color: "green" }}>✔ Thành công</div>}
                </div>
              </div>
            </form>
          </div>
          {/* Card: Vùng nguy hiểm
          <div className="profile__card">
            <div className="profile__card-header">
              <div>
                <div className="profile__card-title" style={{ color: "#D4846B" }}>Vùng nguy hiểm</div>
                <div className="profile__card-subtitle">Các thao tác không thể hoàn tác</div>
              </div>
            </div>
            <div className="profile__danger-zone">
              <button className="profile__btn-danger">
                🗑 Xoá tất cả dự án của tôi
              </button>
              <button className="profile__btn-danger">
                ❌ Xoá tài khoản vĩnh viễn
              </button>
            </div>
          </div> */}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Stats */}
          <div className="profile__card">
            <div className="profile__card-header">
              <div className="profile__card-title">Thống kê</div>
            </div>
            <div className="profile__stats-grid">
              {[
                { num: "12", label: "Slide đã tạo" },
                { num: "3", label: "Truyện tranh" },
                { num: "8", label: "Tuần học" },
                { num: "47", label: "Giờ học" },
              ].map((s) => (
                <div key={s.label} className="profile__stat">
                  <div className="profile__stat-num">{s.num}</div>
                  <div className="profile__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="profile__card">
            <div className="profile__card-header">
              <div className="profile__card-title">Hoạt động gần đây</div>
            </div>
            <div className="profile__activity">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="profile__activity-item">
                  <div className={`profile__activity-icon profile__activity-icon--${a.type}`}>
                    {a.icon}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <div className="profile__activity-title">{a.title}</div>
                    <div className="profile__activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Membership
          <div className="profile__card">
            <div className="profile__card-header">
              <div className="profile__card-title">Gói hiện tại</div>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(201,168,76,0.12)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>⭐</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>Miễn phí</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>5 Slide / tháng · 2 Truyện tranh</div>
                </div>
              </div>
              <button style={{
                width: "100%", padding: "11px 0", borderRadius: 7,
                background: "linear-gradient(135deg, var(--gold), #A07830)",
                color: "var(--dark)", border: "none",
                fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                letterSpacing: "0.02em", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                🚀 Nâng cấp lên Pro
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}