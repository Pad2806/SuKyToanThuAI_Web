import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { AiPageBg } from '../components/shared/ai-page-bg';
import { api } from '../lib/api-client.js';
import { useAuth } from '../hooks/use-auth.js';

const TEMPLATES = ['universal:Tổng hợp', 'battle:Trận chiến', 'dynasty:Triều đại', 'movement:Phong trào', 'culture:Văn hóa']
  .map((item) => {
    const [value, label] = item.split(':');
    return { value, label };
  });

const STEPS = ['checking', 'approved', 'generating', 'done'];
const MODERATION_STATES = { checking: 'Đang kiểm duyệt nội dung...', approved: 'Nội dung đạt tiêu chuẩn. Đang xử lý...', generating: 'AI đang phân tích và tạo hình ảnh...', done: 'Hoàn tất!' };

export const CreatorPage = () => {
  const navigate = useNavigate();
  const { loading: authLoading, user } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) navigate('/dang-nhap', { replace: true });
  }, [authLoading, user, navigate]);

  const [content, setContent] = useState('');
  const [template, setTemplate] = useState('universal');
  const [status, setStatus] = useState('idle');
  const [rejectReason, setRejectReason] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('suky_creator_history') || '[]'); } catch { return []; }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setRejectReason('');
    setResult(null);

    setStatus('checking');

    if (content.trim().length < 50) {
      setStatus('rejected');
      setRejectReason('Nội dung quá ngắn. Vui lòng viết ít nhất 50 ký tự mô tả sự kiện lịch sử.');
      return;
    }

    setStatus('approved');
    setStatus('generating');

    try {
      const response = await api.post('/ai/create', { content, template });
      const apiResult = {
        id: response.id,
        title: response.title,
        rawInput: content,
        template: response.template,
        moderationStatus: 'approved',
        timestamp: new Date().toISOString(),
        resultJson: {
          templateType: response.template,
          beats: [{ type: 'hook', title: response.title, blocks: [{ type: 'text', body: response.content }] }],
        },
      };
      setResult(apiResult);
      const newHistory = [apiResult, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('suky_creator_history', JSON.stringify(newHistory));
      setStatus('done');
    } catch (err) {
      setStatus('rejected');
      setRejectReason(err.message || 'Không thể tạo nội dung.');
    }
  };
  if (authLoading || !user) return null;
  return (
    <section className="creator-page">
      <AiPageBg image="/images/generated/hub_bg_ai.png" />
      <div className="creator-page__header">
        <Link className="ai-page__back" to="/khong-gian-ai">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Không Gian AI
        </Link>
        <span className="creator-page__eyebrow">AI Studio / Sáng Tạo</span>
        <h1 className="creator-page__title">Sáng Tạo Nội Dung</h1>
        <p className="creator-page__subtitle">
          Viết nội dung lịch sử — hệ thống sẽ kiểm duyệt, phân tích, tạo hình ảnh AI và render với template bạn chọn.
        </p>
      </div>
      <form className="creator-form" onSubmit={handleSubmit}>
        <div className="creator-form__field">
          <label htmlFor="creator-content">Nội dung lịch sử</label>
          <textarea
            id="creator-content"
            className="creator-form__textarea"
            placeholder="Viết về một sự kiện, nhân vật, hoặc giai đoạn lịch sử mà bạn muốn trực quan hóa. Tối thiểu 50 ký tự..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            minLength={50}
          />
          <div className="creator-form__textarea-footer">
            <p className="creator-form__helper">Gợi ý: mô tả sự kiện, nhân vật, bối cảnh, thời gian và phong cách minh họa mong muốn.</p>
            <span className="creator-form__counter">{content.length} ký tự</span>
          </div>
        </div>
        <div className="creator-form__field">
          <label htmlFor="creator-template">Chọn template</label>
          <div className="creator-form__template-grid">
            {TEMPLATES.map((t) => (
              <button type="button" key={t.value}
                className={`creator-form__template-btn ${template === t.value ? 'creator-form__template-btn--active' : ''}`}
                onClick={() => setTemplate(t.value)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="creator-form__submit" disabled={status !== 'idle' && status !== 'done' && status !== 'rejected'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          Gửi & Tạo trang
        </button>
      </form>
      {status !== 'idle' && (
        <div className={`creator-status creator-status--${status}`}>
          {status === 'rejected' ? (
            <div className="creator-status__rejected">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              <span>Nội dung bị từ chối: {rejectReason}</span>
            </div>
          ) : (
            <div className="creator-status__pipeline">
              {STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`creator-status__step ${
                    status === step ? 'creator-status__step--active' :
                    STEPS.indexOf(status) > i ? 'creator-status__step--done' : ''
                  }`}
                >
                  <span className="creator-status__dot"></span>
                  <span className="creator-status__label">{MODERATION_STATES[step]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {result && status === 'done' && (
        <div className="creator-result">
          <h3 className="creator-result__title">Kết quả</h3>
          <div className="creator-result__preview">
            {result.resultJson.beats.map((beat, i) => (
              <div key={i} className="creator-result__beat">
                <h4>{beat.title}</h4>
                {beat.blocks.map((block, j) => (
                  <div key={j} className="creator-result__block">
                    {block.type === 'text' && <p>{block.body}</p>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="creator-history">
          <h3 className="creator-history__title">Lịch sử sáng tạo</h3>
          <div className="creator-history__list">
            {history.map((item) => (
              <div key={item.id} className="creator-history__item">
                <span className={`creator-history__status creator-history__status--${item.moderationStatus}`}>
                  {item.moderationStatus === 'approved' ? 'Đã duyệt' : 'Bị từ chối'}
                </span>
                <span className="creator-history__title-text">{item.title}</span>
                <span className="creator-history__meta">
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

export default CreatorPage;
