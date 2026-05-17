import React from 'react';
import { Link } from 'react-router';
import { EventStudioWizard } from '../components/admin/event-studio-wizard.jsx';
import { useAuth } from '../hooks/use-auth.js';

/* ─── Admin-specific layout (NOT using RouteCard) ─── */

const IconLock = () => (
  <svg aria-hidden="true" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)', opacity: 0.5 }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const IconLoader = () => (
  <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="admin-gate-spinner" style={{ color: 'var(--gold)', opacity: 0.6 }}>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const AdminGate = ({ icon, title, titleColor, body, action }) => (
  <div className="admin-gate">
    <div className="admin-gate__card">
      <div className="admin-gate__icon">{icon}</div>
      <h1 className="admin-gate__title" style={titleColor ? { color: titleColor } : {}}>
        {title}
      </h1>
      <p className="admin-gate__body">{body}</p>
      {action}
    </div>
  </div>
);

export const AdminPage = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <AdminGate
        icon={<IconLoader />}
        title="Đang xác thực…"
        body="Hệ thống đang kiểm tra quyền truy cập của bạn."
      />
    );
  }

  if (!user) {
    return (
      <AdminGate
        icon={<IconLock />}
        title="Cần đăng nhập quản trị"
        body="Vui lòng đăng nhập bằng tài khoản có quyền quản trị để truy cập Xưởng sự kiện."
        action={
          <Link className="admin-btn admin-btn--primary admin-gate__cta" to="/dang-nhap">
            Đăng nhập
          </Link>
        }
      />
    );
  }

  if (user.role !== 'admin') {
    return (
      <AdminGate
        icon={<IconLock />}
        title="Không có quyền truy cập"
        titleColor="#ffb1a8"
        body="Tài khoản hiện tại không được phép truy cập khu vực quản trị nội dung chính thống."
      />
    );
  }

  return (
    <div className="admin-page">
      {/* ─── Admin Topbar ─── */}
      <header className="admin-topbar">
        <div className="admin-topbar__left">
          <Link className="admin-topbar__back" to="/">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Trang chủ
          </Link>
          <span className="admin-topbar__divider" aria-hidden="true" />
          <span className="admin-topbar__label">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            Xưởng sự kiện
          </span>
        </div>
        <div className="admin-topbar__right">
          <span className="admin-topbar__user">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {user.email || 'Quản trị viên'}
          </span>
        </div>
      </header>

      {/* ─── Admin Workspace ─── */}
      <main className="admin-workspace" id="admin-main">
        <EventStudioWizard />
      </main>
    </div>
  );
};

export default AdminPage;
