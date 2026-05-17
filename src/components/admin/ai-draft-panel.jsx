import React from 'react';

const IconAi = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconCheck = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconWand = () => (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8L19 13"/><path d="M15 9h.01"/><path d="M17.8 6.2L19 5"/><path d="M11 6.2L9.7 5"/><path d="M11 11.8l-1.3 1.2"/><path d="M3 21l9-9"/>
  </svg>
);

export const AiDraftPanel = ({ disabled = false, draft, sourceCount = 0, onDraft, onAccept }) => {
  const payload = draft?.payload;
  const coverage = payload?.coverageReport;

  return (
    <section className="admin-card">
      <div className="admin-card__header">
        <div className="admin-card__icon"><IconAi /></div>
        <h2>Soạn thảo bằng AI</h2>
      </div>
      {disabled && <p className="admin-note">Sự kiện không còn ở trạng thái chỉnh sửa.</p>}
      <div className="admin-actions">
        <button className="admin-btn admin-btn--primary" disabled={disabled || sourceCount === 0} onClick={onDraft} type="button">
          <IconWand />
          Tạo draft từ nguồn
        </button>
        <button className="admin-btn" disabled={disabled || !payload} onClick={onAccept} type="button">
          <IconCheck />
          Nhận draft
        </button>
      </div>
      {sourceCount === 0 && <p className="admin-warning">Cần import ít nhất một nguồn chính thống trước khi draft.</p>}
      {draft?.detail && <p className="admin-warning">{draft.detail}</p>}
      {payload && (
        <div className="admin-draft-summary">
          <strong>{payload.title}</strong>
          <span>{payload.eventData?.story?.beats?.length ?? 0} cảnh</span>
          <span>{payload.citations?.length ?? 0} trích dẫn</span>
          {coverage?.missing?.length
            ? <span style={{ color: '#ffb1a8' }}>Thiếu: {coverage.missing.join(', ')}</span>
            : <span style={{ color: '#7dd3a0' }}>Độ phủ đạt yêu cầu</span>}
        </div>
      )}
      {payload?.eventData?.story?.beats?.length > 0 && (
        <div className="admin-draft-detail">
          <h3>Các cảnh cần kiểm duyệt</h3>
          {payload.eventData.story.beats.map((beat) => (
            <article key={beat.type}>
              <strong>{beat.title}</strong>
              <p>{beat.blocks?.[0]?.body || beat.blocks?.[0]?.quote || 'Chưa có nội dung.'}</p>
            </article>
          ))}
        </div>
      )}
      {payload?.citations?.length > 0 && (
        <ul className="admin-source-list">
          {payload.citations.slice(0, 8).map((item, index) => (
            <li key={`${item.chunkId || item.sourceId || index}`}>{item.title || item.sourceId || 'Nguồn'} · {item.chunkId || 'không có đoạn trích'}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AiDraftPanel;
