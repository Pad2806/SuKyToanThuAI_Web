import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import SocialLogin from "../../components/login/SocialLogin";
import styles from "./auth.module.scss";

// 👉 auth context
import { useAuth } from "../../../../context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // ================= FORM STATE =================
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "user",
  });

  // ================= HANDLE LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await login(loginForm);

      // 👉 backend trả user nằm trong res.user
      const role = res?.role || res?.user?.role;

      if (!role) {
        throw new Error("Không xác định được role");
      }

      // 👉 redirect theo role
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Đăng nhập thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      await register(registerForm);

      alert("Đăng ký thành công");
      setActiveTab("login");

      // reset form
      setRegisterForm({
        fullname: "",
        email: "",
        password: "",
        role: "user",
      });
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.detail ||
          err.message ||
          "Đăng ký thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authImagePanel}>
        <div className={styles.imageOverlay}>
          <h2>Hành Trình Gìn Giữ Lịch Sử</h2>
          <p>
            Cùng nhau khám phá và làm sống lại những trang sử hào hùng
            của dân tộc Việt Nam.
          </p>
        </div>
      </div>

      <div className={styles.authFormPanel}>
        <div className={styles.authBox}>
          <div className={styles.logo}>
            Sử<span>Ký</span> AI
          </div>

          {/* TAB */}
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tabBtn} ${
                activeTab === "login" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("login")}
            >
              Đăng nhập
            </button>
            <button
              className={`${styles.tabBtn} ${
                activeTab === "register" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("register")}
            >
              Đăng ký
            </button>
          </div>

          <div className={styles.formContent}>
            {/* ================= LOGIN ================= */}
            {activeTab === "login" ? (
              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Nhập email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Mật khẩu</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() =>
                        setShowLoginPassword(!showLoginPassword)
                      }
                    >
                      {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </form>
            ) : (
              /* ================= REGISTER ================= */
              <form className={styles.form} onSubmit={handleRegister}>
                <div className={styles.inputGroup}>
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    value={registerForm.fullname}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        fullname: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Mật khẩu</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={
                        showRegisterPassword ? "text" : "password"
                      }
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeBtn}
                      onClick={() =>
                        setShowRegisterPassword(
                          !showRegisterPassword
                        )
                      }
                    >
                      {showRegisterPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
                </button>
              </form>
            )}

            <div className={styles.divider}>
              <span>Hoặc</span>
            </div>

            <SocialLogin />
          </div>

          <p className={styles.footerText}>
            Bằng việc tiếp tục, bạn đồng ý với Điều khoản dịch vụ của
            SửKý AI.
          </p>
        </div>
      </div>
    </div>
  );
}