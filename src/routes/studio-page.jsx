import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { AiPageBg } from '../components/shared/ai-page-bg';
import { api } from '../lib/api-client.js';
import { useAuth } from '../hooks/use-auth.js';

const TEMPLATES = [
  { value: 'universal', label: 'Tổng hợp' },
  { value: 'battle', label: 'Trận chiến' },
  { value: 'dynasty', label: 'Triều đại' },
  { value: 'synthesis', label: 'Phân tích' },
];

export const StudioPage = () => {
  const navigate = useNavigate();
  const { loading: authLoading, user } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) navigate('/dang-nhap', { replace: true });
  }, [authLoading, user, navigate]);

  const [query, setQuery] = useState('');
  const [template, setTemplate] = useState('universal');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('suky_studio_history') || '[]'); } catch { return []; }
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await api.post('/ai/research', { query, template });
      const apiResult = {
        id: response.id,
        query,
        template: response.template,
        timestamp: new Date().toISOString(),
        found: response.sources.length > 0,
        sourceSlugs: response.sources,
        summary: response.content,
      };
      setResult(apiResult);
      const newHistory = [apiResult, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('suky_studio_history', JSON.stringify(newHistory));
    } catch (err) {
      setError(err.message || 'Không thể tạo kết quả nghiên cứu.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <section className="studio-page">
      <AiPageBg image="/images/generated/hub_bg_ai.png" />
      <div className="studio-page__header">
        <Link className="ai-page__back" to="/khong-gian-ai">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Không Gian AI
        </Link>
        <span className="studio-page__eyebrow">AI Studio / Nghiên Cứu</span>
        <h1 className="studio-page__title">Không Gian Nghiên Cứu</h1>
        <p className="studio-page__subtitle">
          Đặt câu hỏi hoặc yêu cầu — hệ thống sẽ tìm kiếm trong cơ sở dữ liệu và tạo trang phù hợp.
        </p>
      </div>

      <form className="studio-form" onSubmit={handleSubmit}>
        <div className="studio-form__input-group">
          <textarea
            id="studio-query"
            className="studio-form__textarea"
            placeholder="VD: Tóm tắt trận Bạch Đằng 1288 và so sánh với trận Bạch Đằng 938..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={5}
            required
          />
        </div>
        
        <div className="studio-form__suggestions">
          <span className="studio-form__suggestion" onClick={() => setQuery('Tóm tắt trận Bạch Đằng 1288')}>Tóm tắt trận Bạch Đằng 1288</span>
          <span className="studio-form__suggestion" onClick={() => setQuery('So sánh nhà Lý và nhà Trần')}>So sánh nhà Lý và nhà Trần</span>
          <span className="studio-form__suggestion" onClick={() => setQuery('Vai trò của văn hóa Đông Sơn')}>Vai trò của văn hóa Đông Sơn</span>
        </div>

        <div className="studio-form__controls">
          <div className="studio-form__template-select">
            <label>Template hiển thị</label>
            <div className="custom-select" ref={dropdownRef}>
              <div 
                className={`custom-select__trigger ${isDropdownOpen ? 'open' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span>{TEMPLATES.find(t => t.value === template)?.label}</span>
                <span className="custom-select__arrow">▼</span>
              </div>
              {isDropdownOpen && (
                <div className="custom-select__options">
                  {TEMPLATES.map((t) => (
                    <div 
                      key={t.value} 
                      className={`custom-select__option ${template === t.value ? 'selected' : ''}`}
                      onClick={() => {
                        setTemplate(t.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {t.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="studio-form__submit" disabled={loading || !query.trim()}>
            {loading ? (
              <>
                <span className="studio-form__spinner"></span>
                Đang tìm kiếm...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Tìm kiếm & Tạo trang
              </>
            )}
          </button>
        </div>
      </form>

      {error && <div className="studio-result studio-result--error"><p>{error}</p></div>}

      {result && (
        <div className="studio-result studio-result--success">
          <div className="studio-result__header">
            <h3>Kết quả</h3>
            <span className="studio-result__template">Template: {TEMPLATES.find(t => t.value === result.template)?.label}</span>
          </div>
          <div className="studio-result__sources">
            <span>Nguồn dữ liệu:</span>
            {result.sourceSlugs.length > 0 ? (
              result.sourceSlugs.map((slug) => (
                <a key={slug} href={`/su-kien/${slug}`} className="studio-result__source-tag">{slug}</a>
              ))
            ) : (
              <span className="studio-result__source-tag">Không có nguồn phù hợp</span>
            )}
          </div>
          <div className="studio-result__body">
            <p>{result.summary}</p>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="studio-history">
          <h3 className="studio-history__title">Lịch sử tìm kiếm</h3>
          <div className="studio-history__list">
            {history.map((item) => (
              <div key={item.id} className="studio-history__item">
                <span className="studio-history__query">{item.query}</span>
                <span className="studio-history__meta">
                  {TEMPLATES.find(t => t.value === item.template)?.label} · {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default StudioPage;
