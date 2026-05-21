import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AiPageBg } from '../components/shared/ai-page-bg';
import { useAuth } from '../hooks/use-auth.js';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, user } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/khong-gian-ai', { replace: true });
  }, [navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register({
          email: form.email,
          password: form.password,
          displayName: form.email.split('@')[0],
        });
      } else {
        await login(form);
      }
      navigate('/khong-gian-ai');
    } catch (err) {
      setError(err.message || 'Không thể xác thực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <AiPageBg image="/images/generated/login_bg_ai.png" />
      <div className="login-page__container">
        
        <div className="login-page__hero">
          <Link className="ai-page__back" to="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Trang chủ
          </Link>
          <span className="login-page__eyebrow">SỬ KÝ AI</span>
          <h1 className="login-page__title">Bước vào kho sử liệu Việt Nam</h1>
          <p className="login-page__subtitle">
            Đăng nhập để tiếp tục nghiên cứu, tạo nội dung và khám phá lịch sử bằng AI.
          </p>
        </div>

        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form__field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="text"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>
            <div className="login-form__field">
              <label htmlFor="login-password">Mật khẩu</label>
              <input
                id="login-password"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
                autoComplete="current-password"
              />
            </div>

            {error && <p className="login-form__error">{error}</p>}

            <button type="submit" className="login-form__submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : mode === 'register' ? 'Đăng ký' : 'Đăng nhập'}
            </button>
          </form>

          <p className="login-card__footer">
            {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            <a
              href={mode === 'login' ? '#dang-ky' : '#dang-nhap'}
              onClick={(event) => {
                event.preventDefault();
                setError('');
                setMode(mode === 'login' ? 'register' : 'login');
              }}
            >
              {mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
