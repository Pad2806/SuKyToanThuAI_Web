import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { AiPageBg } from '../components/shared/ai-page-bg';
import { useAuth } from '../hooks/use-auth.js';

const features = [
  {
    id: 'studio',
    title: 'Không Gian Nghiên Cứu',
    subtitle: 'Khám phá dữ liệu lịch sử có sẵn trong hệ thống',
    description: 'Tra cứu, tóm tắt hoặc tổng hợp dữ liệu lịch sử từ cơ sở dữ liệu đã được kiểm duyệt. Hệ thống sẽ giữ nguyên tính chính xác của nguồn tài liệu.',
    to: '/khong-gian-ai/nghien-cuu',
    image: '/images/generated/card_research_ai.png',
    cta: 'Khám phá dữ liệu lịch sử',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        <line x1="11" y1="8" x2="11" y2="14"></line>
        <line x1="8" y1="11" x2="14" y2="11"></line>
      </svg>
    ),
    tags: ['RAG', 'Dữ liệu kiểm chứng', 'Read-only'],
  },
  {
    id: 'creator',
    title: 'Sáng Tạo Nội Dung',
    subtitle: 'Viết và trực quan hóa câu chuyện lịch sử của riêng bạn',
    description: 'Nhập nội dung lịch sử tự do — hệ thống sẽ tự động phân tích, tạo minh họa và dàn trang dưới dạng câu chuyện cinematic.',
    to: '/khong-gian-ai/sang-tao',
    image: '/images/generated/card_creator_ai.png',
    cta: 'Tạo câu chuyện lịch sử',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    tags: ['AI Generate', 'Kiểm duyệt', 'Template'],
  },
];

export const AiHubPage = () => {
  const navigate = useNavigate();
  const { loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/dang-nhap', { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) return null;
  const displayName = user.display_name ?? user.displayName ?? user.email;

  return (
    <section className="ai-hub">
      <AiPageBg image="/images/generated/hub_bg_ai.png" />
      <div className="ai-hub__header">
        <Link className="ai-page__back" to="/">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Trang chủ
        </Link>
        <span className="ai-hub__eyebrow">AI Studio</span>
        <h1 className="ai-hub__title">Không Gian AI</h1>
        <p className="ai-hub__subtitle">
          Chào <strong>{displayName}</strong> — Chọn một chế độ để bắt đầu khám phá hoặc sáng tạo lịch sử.
        </p>
      </div>

      <div className="ai-hub__grid">
        {features.map((feat) => (
          <Link key={feat.id} to={feat.to} className={`ai-hub__card ai-hub__card--${feat.id}`}>
            <div className="ai-hub__card-bg">
              <img src={feat.image} alt="" />
              <div className="ai-hub__card-bg-overlay" />
            </div>
            <div className="ai-hub__card-content">
              <div className="ai-hub__card-icon">{feat.icon}</div>
              <h2 className="ai-hub__card-title">{feat.title}</h2>
              <p className="ai-hub__card-subtitle">{feat.subtitle}</p>
              <p className="ai-hub__card-desc">{feat.description}</p>
              <div className="ai-hub__card-tags">
                {feat.tags.map((tag) => (
                  <span key={tag} className="ai-hub__tag">{tag}</span>
                ))}
              </div>
              <span className="ai-hub__card-cta">
                {feat.cta}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="ai-hub__microcopy-wrapper">
        <p className="ai-hub__microcopy">Mỗi kết quả nên được kiểm chứng với nguồn sử liệu gốc.</p>
      </div>
    </section>
  );
};

export default AiHubPage;
