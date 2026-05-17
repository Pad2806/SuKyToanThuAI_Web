import React from 'react';

export const CoverageWarningPanel = ({ report, onEdit, onContinue, loading }) => {
  const missing = report?.missing ?? [];
  if (missing.length === 0) return null;

  return (
    <div className="ai-coverage">
      <h3>Trang đang thiếu dữ liệu</h3>
      <p>
        AI sẽ không tự bịa thêm phần còn thiếu. Bạn có thể bổ sung nội dung hoặc tiếp tục
        tạo trang và bỏ qua các phần này.
      </p>
      <ul>
        {missing.map((item) => (
          <li key={item.key}>
            <strong>{item.label}</strong>
            <span>{item.reason}</span>
          </li>
        ))}
      </ul>
      <div className="ai-coverage__actions">
        <button type="button" className="ai-coverage__secondary" onClick={onEdit} disabled={loading}>
          Bổ sung nội dung
        </button>
        <button type="button" className="ai-coverage__primary" onClick={onContinue} disabled={loading}>
          {loading ? 'Đang tạo trang...' : 'Tiếp tục và bỏ qua phần thiếu'}
        </button>
      </div>
    </div>
  );
};

export default CoverageWarningPanel;
