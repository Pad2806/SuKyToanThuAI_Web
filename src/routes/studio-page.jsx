import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AiPageHistory } from '../components/ai-studio/ai-page-history.jsx';
import { NoDataResult } from '../components/studio/no-data-result.jsx';
import { AiPageBg } from '../components/shared/ai-page-bg';
import { useAuth } from '../hooks/use-auth.js';
import { createResearchPage, listAiPages } from '../lib/ai-pages-api.js';

const TEMPLATES = [
  { value: 'universal', label: 'Tổng hợp' },
  { value: 'battle', label: 'Trận chiến' },
  { value: 'dynasty', label: 'Triều đại' },
  { value: 'synthesis', label: 'Phân tích' },
];

export const StudioPage = () => {
  const navigate = useNavigate();
  const { loading: authLoading, user } = useAuth();
  const [query, setQuery] = useState('');
  const [template, setTemplate] = useState('universal');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [noData, setNoData] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/dang-nhap', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    listAiPages('research').then(setHistory).catch(() => setHistory([]));
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setNoData('');
    console.log('[Studio] Submitting research:', { query, template });
    try {
      const response = await createResearchPage({ query, template });
      console.log('[Studio] API response:', JSON.stringify(response, null, 2));
      const imageSummary = response.renderPayload?.imageGenerationSummary || response.imageGenerationSummary;
      if (imageSummary) {
        console.table(imageSummary.map((item) => ({
          slot: item.slot,
          status: item.status,
          provider: item.provider,
          model: item.model,
          url: item.url,
          error: item.error,
        })));
      }
      if (response.status === 'no_data') {
        console.warn('[Studio] No data found:', response);
        setNoData(response.detail || 'Không tìm thấy dữ liệu phù hợp.');
      } else {
        console.log('[Studio] Navigating to page:', response.id);
        navigate(`/ai/trang/${response.id}`);
      }
    } catch (err) {
      console.error('[Studio] API error:', err);
      console.error('[Studio] Error response:', err.response?.data || err.message);
      setError(err.message || 'Không thể tạo trang nghiên cứu.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <section className="studio-page">
      <AiPageBg image="/images/generated/hub_bg_ai.png" />
      <div className="studio-page__header">
        <Link className="ai-page__back" to="/khong-gian-ai">Không Gian AI</Link>
        <span className="studio-page__eyebrow">AI Studio / Nghiên Cứu</span>
        <h1 className="studio-page__title">Tạo trang sự kiện từ dữ liệu hệ thống</h1>
        <p className="studio-page__subtitle">
          AI chỉ đọc kho dữ liệu chuẩn để dựng một trang event cá nhân. Dữ liệu hệ thống không bị thay đổi.
        </p>
      </div>

      <form className="studio-form" onSubmit={handleSubmit}>
        <div className="studio-form__input-group">
          <textarea
            className="studio-form__textarea"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={5}
            required
            placeholder="VD: Tạo trang event so sánh Bạch Đằng 938 và Bạch Đằng 1288..."
          />
        </div>
        <div className="studio-form__controls">
          {/* <label className="studio-form__template-select">
            <span>Template hiển thị</span>
            <select value={template} onChange={(event) => setTemplate(event.target.value)}>
              {TEMPLATES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label> */}
          <button type="submit" className="studio-form__submit" disabled={loading || !query.trim()}>
            {loading ? 'Đang tạo trang...' : 'Tìm kiếm & tạo trang'}
          </button>
        </div>
      </form>

      {error && <div className="studio-result studio-result--error"><p>{error}</p></div>}
      {noData && <NoDataResult message={noData} onSuggestionClick={(text) => { setQuery(text); setNoData(''); }} />}

      <AiPageHistory
        title="Lịch sử nghiên cứu"
        pages={history}
        emptyText="Bạn chưa có trang nghiên cứu nào."
      />
    </section>
  );
};

export default StudioPage;
