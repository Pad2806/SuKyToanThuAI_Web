import styles from "./SideBar.module.scss";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBookOpen,
  LuKey,
  LuSettings,
  LuList,
  LuLogOut
} from "react-icons/lu";

// 👉 auth context
import { useAuth } from "../../../../context/AuthContext";

export default function Sidebar({ activeTab, setActiveTab }) {
  const { logout } = useAuth(); // 👈 dùng logout

  const menuData = [
    {
      title: "TỔNG QUAN",
      items: [
        { key: "dashboard", label: "Dashboard", icon: <LuLayoutDashboard /> },
      ],
    },
    {
      title: "QUẢN LÝ",
      items: [
        { key: "users", label: "Người dùng", icon: <LuUsers /> },
        { key: "events", label: "Sự kiện lịch sử", icon: <LuBookOpen /> },
        { key: "categories", label: "Danh mục", icon: <LuList /> },
      ],
    },
    {
      title: "HỆ THỐNG",
      items: [
        { key: "api", label: "API Keys", icon: <LuKey /> },
        { key: "settings", label: "Cài đặt", icon: <LuSettings /> },
      ],
    },
  ];

  return (
    <div className={styles.sidebar}>
      {/* LOGO */}
      <div className={styles.logo}>
        Sử<span>Ký</span> AI
      </div>

      {/* MENU */}
      <div className={styles.menu}>
        {menuData.map((section, idx) => (
          <div key={idx} className={styles.section}>
            <div className={styles.label}>{section.title}</div>

            {section.items.map((item) => (
              <div
                key={item.key}
                className={`${styles.item} ${
                  activeTab === item.key ? styles.active : ""
                }`}
                onClick={() => setActiveTab(item.key)}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.text}>{item.label}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 👇 LOGOUT (luôn ở dưới cùng) */}
      <div className={styles.bottom}>
        <div
          className={`${styles.item} ${styles.logout}`}
          onClick={() => {
            if (window.confirm("Bạn có chắc muốn đăng xuất?")) {
              logout();
            }
          }}
        >
          <span className={styles.icon}>
            <LuLogOut />
          </span>
          <span className={styles.text}>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
}