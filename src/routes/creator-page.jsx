import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AiPageHistory } from '../components/ai-studio/ai-page-history.jsx';
import { CoverageWarningPanel } from '../components/ai-studio/coverage-warning-panel.jsx';
import { AiPageBg } from '../components/shared/ai-page-bg';
import { useAuth } from '../hooks/use-auth.js';
import { confirmMissingSections, createCreatorPage, listAiPages } from '../lib/ai-pages-api.js';

const TEMPLATES = [
  { value: 'universal', label: 'Tổng hợp' },
  { value: 'battle', label: 'Trận chiến' },
  { value: 'dynasty', label: 'Triều đại' },
  { value: 'movement', label: 'Phong trào' },
  { value: 'culture', label: 'Văn hóa' },
];

export const CreatorPage = () => {
  const navigate = useNavigate();
  const { loading: authLoading, user } = useAuth();
  const [content, setContent] = useState('');
  const [template, setTemplate] = useState('universal');
  const [history, setHistory] = useState([]);
  const [pending, setPending] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) navigate('/dang-nhap', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    listAiPages('creator').then(setHistory).catch(() => setHistory([]));
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    setStatus('loading');
    setError('');
    setPending(null);
    try {
      const response = await createCreatorPage({ content, template });
      if (response.status === 'rejected') {
        setStatus('rejected');
        setError(response.moderation?.reason || 'Nội dung không đạt tiêu chuẩn an toàn.');
      } else if (response.status === 'needs_user_confirmation') {
        setStatus('needs_user_confirmation');
        setPending(response);
      } else {
        navigate(`/ai/trang/${response.id}`);
      }
    } catch (err) {
      setStatus('rejected');
      setError(err.message || 'Không thể tạo trang.');
    }
  };

  const handleContinueMissing = async () => {
    if (!pending?.id) return;
    setStatus('loading');
    try {
      const response = await confirmMissingSections(pending.id);
      navigate(`/ai/trang/${response.id}`);
    } catch (err) {
      setStatus('needs_user_confirmation');
      setError(err.message || 'Không thể tiếp tục tạo trang.');
    }
  };

  if (authLoading || !user) return null;

  return (
    <section className="creator-page">
      <AiPageBg image="/images/generated/hub_bg_ai.png" />
      <div className="creator-page__header">
        <Link className="ai-page__back" to="/khong-gian-ai">Không Gian AI</Link>
        <span className="creator-page__eyebrow">AI Studio / Sáng Tạo</span>
        <h1 className="creator-page__title">Tạo trang sự kiện từ nội dung của bạn</h1>
        <p className="creator-page__subtitle">
          Nội dung được kiểm duyệt trước khi dựng trang hoặc tạo ảnh. Nếu thiếu dữ liệu, bạn quyết định bổ sung hay bỏ qua.
        </p>
      </div>

      <form className="creator-form" onSubmit={handleSubmit}>
        <div className="creator-form__field">
          <label htmlFor="creator-content">Nội dung lịch sử</label>
          <textarea
            id="creator-content"
            className="creator-form__textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={8}
            required
            minLength={50}
            placeholder="Nhập sự kiện, nhân vật, bối cảnh, mốc thời gian và chi tiết bạn muốn trực quan hóa..."
          />
          <div className="creator-form__textarea-footer">
            <p className="creator-form__helper">AI không tự bịa dữ liệu còn thiếu.</p>
            <span className="creator-form__counter">{content.length} ký tự</span>
          </div>
        </div>

        <div className="creator-form__field">
          <label htmlFor="creator-template">Chọn template</label>
          <select id="creator-template" value={template} onChange={(event) => setTemplate(event.target.value)}>
            {TEMPLATES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>

        <button type="submit" className="creator-form__submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Đang xử lý...' : 'Kiểm duyệt & tạo trang'}
        </button>
      </form>

      {error && <div className="creator-status creator-status--rejected"><span>{error}</span></div>}
      {pending && (
        <CoverageWarningPanel
          report={pending.coverageReport}
          loading={status === 'loading'}
          onEdit={() => setPending(null)}
          onContinue={handleContinueMissing}
        />
      )}

      <AiPageHistory
        title="Lịch sử sáng tạo"
        pages={history}
        emptyText="Bạn chưa có trang sáng tạo nào."
      />
    </section>
  );
};

export default CreatorPage;
