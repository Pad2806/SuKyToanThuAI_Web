import React from 'react';

const IconShield = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconCheck = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconSend = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export const QualityGatePanel = ({ eventStatus = 'draft', report, onCheck, onPublish, onSubmitReview }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const score = report?.score ?? 0;
  const passed = report?.passed ?? false;
  const canSubmitReview = passed && eventStatus === 'draft';
  const canPublish = passed && eventStatus === 'review';

  const handlePublish = () => {
    onPublish();
    setConfirmOpen(false);
  };

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__icon"><IconShield /></div>
        <h2>Cổng kiểm duyệt</h2>
      </div>

      {report && (
        <div className="quality-meter">
          <div className="quality-meter__bar">
            <div
              className={`quality-meter__fill ${passed ? 'quality-meter__fill--pass' : 'quality-meter__fill--fail'}`}
              style={{ width: `${Math.min(score, 100)}%` }}
            />
          </div>
          <span className="quality-meter__score" style={{ color: passed ? '#7dd3a0' : '#ffb1a8' }}>
            {score}<span style={{ fontSize: '13px', opacity: 0.6 }}>/100</span>
          </span>
        </div>
      )}

      {report && (
        <p className={passed ? 'admin-note' : 'admin-warning'}>
          {passed ? 'Đạt yêu cầu xuất bản.' : 'Chưa đạt yêu cầu xuất bản.'}
        </p>
      )}

      {!report?.passed && report && (
        <p className="admin-note">Chức năng công bố chỉ mở khi cổng kiểm duyệt đủ điều kiện.</p>
      )}
      {passed && eventStatus === 'draft' && (
        <p className="admin-note">Đã đạt chất lượng. Gửi duyệt để khóa nội dung trước khi công bố.</p>
      )}
      {passed && eventStatus === 'review' && (
        <p className="admin-note">Sự kiện đang chờ duyệt và có thể công bố.</p>
      )}

      {(report?.blockingIssues || []).length > 0 && (
        <ul className="admin-source-list">
          {report.blockingIssues.map((item) => (
            <li key={item.key}><strong>{item.label}</strong>: {item.reason}</li>
          ))}
        </ul>
      )}

      <div className="admin-actions">
        <button className="admin-btn" onClick={onCheck} type="button">
          <IconCheck />
          Kiểm tra chất lượng
        </button>
        <button
          className="admin-btn"
          disabled={!canSubmitReview || !onSubmitReview}
          onClick={onSubmitReview}
          type="button"
        >
          <IconSend />
          Gửi duyệt
        </button>
        <button
          className="admin-btn admin-btn--primary"
          disabled={!canPublish}
          onClick={() => setConfirmOpen(true)}
          type="button"
        >
          <IconSend />
          Công bố sự kiện
        </button>
      </div>

      {confirmOpen && (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="publish-modal-title">
          <div className="admin-modal">
            <h3 className="admin-modal__title" id="publish-modal-title">Xác nhận công bố sự kiện</h3>
            <p className="admin-modal__body">
              Bạn sắp công bố sự kiện này lên trang chính thức. Hãy chắc chắn rằng nội dung, nguồn chính thống và hình ảnh đã được kiểm duyệt đầy đủ.
            </p>
            <div className="admin-modal__actions">
              <button className="admin-btn" onClick={() => setConfirmOpen(false)} type="button">
                Hủy
              </button>
              <button className="admin-btn admin-btn--primary" onClick={handlePublish} type="button">
                <IconSend />
                Xác nhận công bố
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QualityGatePanel;
