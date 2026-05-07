import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Nav.css";

// 👉 dùng AuthContext
import { useAuth } from "../../../context/AuthContext";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 👉 xử lý tên
  const initials = user?.fullname
    ? user.fullname
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AI";

  const links = [
    { path: "/", label: "Trang chủ" },
    { path: "/library", label: "Thư viện Lịch sử" },
    { path: "/workspace", label: "Sáng tạo" },
  ];

  function go(path) {
    setOpen(false);
    navigate(path);
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      {/* LOGO */}
      <div className="nav__logo" onClick={() => navigate("/")}>
        Sử<span>Ký</span> AI
      </div>

      {/* MENU */}
      <div className="nav__links">
        {links.map((l) => (
          <button
            key={l.path}
            className={`nav__btn ${
              location.pathname === l.path ? "nav__btn--active" : ""
            }`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </button>
        ))}

        {/* 👉 ADMIN BUTTON */}
        {user?.role === "admin" && (
          <button
            className={`nav__btn nav__btn--admin ${
              location.pathname === "/admin" ? "nav__btn--active" : ""
            }`}
            onClick={() => navigate("/admin")}
          >
            ⚙ Admin
          </button>
        )}
      </div>

      {/* USER */}
      <div className="nav__user" ref={dropRef}>
        <div className="nav__avatar" onClick={() => setOpen((v) => !v)}>
          {initials}
        </div>

        {open && (
          <div className="nav__dropdown">
            <div className="nav__dropdown-header">
              <div className="nav__dropdown-avatar">{initials}</div>
              <div>
                <div className="nav__dropdown-name">
                  {user?.fullname || "Người dùng"}
                </div>
                <div className="nav__dropdown-email">
                  {user?.email || ""}
                </div>
              </div>
            </div>

            <div className="nav__dropdown-items">
              <button
                className="nav__dropdown-item"
                onClick={() => go("/profile")}
              >
                <span className="nav__dropdown-item__icon">👤</span>
                Thông tin người dùng
              </button>

              <div className="nav__dropdown-divider" />

              <button
                className="nav__dropdown-item nav__dropdown-item--danger"
                onClick={handleLogout}
              >
                <span className="nav__dropdown-item__icon">🚪</span>
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}