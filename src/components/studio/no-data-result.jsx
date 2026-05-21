import React from 'react';
import { FaSearch, FaHistory } from 'react-icons/fa';
import './no-data-result.css';

const SUGGESTIONS = [
  'Cuộc kháng chiến chống Mỹ cứu nước',
  'Tóm tắt lịch sử Lớp 12',
  'Tóm tắt lịch sử từ thế kỷ 18 đến nay',
];

export const NoDataResult = ({ message, onSuggestionClick }) => {
  return (
    <div className="no-data-result">
      <div className="no-data-result__icon">
        <FaSearch />
      </div>
      <h3 className="no-data-result__title">Không tìm thấy dữ liệu</h3>
      <p className="no-data-result__message">{message}</p>

      <div className="no-data-result__suggestions">
        <p className="no-data-result__suggestions-label">
          <FaHistory /> Thử tìm kiếm:
        </p>
        <div className="no-data-result__suggestions-list">
          {SUGGESTIONS.map((text, i) => (
            <button
              key={i}
              className="no-data-result__suggestion"
              onClick={() => onSuggestionClick?.(text)}
              type="button"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoDataResult;
