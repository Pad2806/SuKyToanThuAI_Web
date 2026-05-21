import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { EventStoryPage } from '../components/story-system/event-story-page.jsx';
import { RouteCard } from '../components/shared/route-card.jsx';
import { EventSkeleton } from '../components/story-system/event-skeleton.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { getAiPage } from '../lib/ai-pages-api.js';

export const AiGeneratedEventPage = () => {
  const { pageId = '' } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading, user } = useAuth();
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate('/dang-nhap', { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user || !pageId) return;
    let cancelled = false;
    setLoading(true);
    getAiPage(pageId)
      .then((data) => { if (!cancelled) setPage(data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Không thể tải trang AI.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [pageId, user]);

  if (authLoading || loading) return <EventSkeleton />;

  const payload = page?.renderPayload;
  if (error || !payload?.eventData) {
    return (
      <RouteCard eyebrow="AI Studio" title="Không thể mở trang">
        <p className="section-lead">{error || 'Trang này không tồn tại hoặc bạn không có quyền xem.'}</p>
        <Link className="ai-page__back" to="/khong-gian-ai">Quay lại Không Gian AI</Link>
      </RouteCard>
    );
  }

  const omitted = payload.coverageReport?.omittedSections ?? [];
  return (
    <>
      {omitted.length > 0 && (
        <div className="ai-generated-banner">
          Trang này đã bỏ qua một số phần thiếu dữ liệu: {omitted.join(', ')}.
        </div>
      )}
      <EventStoryPage data={payload.eventData} />
    </>
  );
};

export default AiGeneratedEventPage;
