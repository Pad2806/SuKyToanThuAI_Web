import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { RouteCard } from '../components/shared/route-card.jsx';
import { SuspenseLoader } from '../components/shared/suspense-loader.jsx';
import { useAuth } from '../hooks/use-auth.js';
import { getAiPage } from '../lib/ai-pages-api.js';
import { getResearchTemplate } from '../components/research-templates/template-registry.js';

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

    const hasPendingImages = (p) => {
      if (!p || !p.eventData) return false;
      const ev = p.eventData;
      if (ev.imageStatus === 'pending') return true;
      if (ev.climaxScene?.backgroundImageStatus === 'pending') return true;
      if (ev.characters?.[0]?.portraitStatus === 'pending') return true;
      if ((ev.eras || []).some(e => e.imageStatus === 'pending')) return true;
      if ((ev.climaxScene?.phases || []).some(ph => ph.imageStatus === 'pending')) return true;
      return false;
    };

    let pollInterval = null;

    const stopPolling = () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    };

    const startPolling = () => {
      stopPolling();
      pollInterval = setInterval(() => {
        getAiPage(pageId)
          .then((data) => {
            if (!cancelled) {
              setPage(data);
              if (!hasPendingImages(data?.renderPayload)) {
                stopPolling();
              }
            }
          })
          .catch((err) => {
            console.error('[HYDRATION] Lỗi khi tải ảnh chạy nền:', err);
          });
      }, 3000);
    };

    setLoading(true);
    getAiPage(pageId)
      .then((data) => {
        if (!cancelled) {
          setPage(data);
          if (hasPendingImages(data?.renderPayload)) {
            console.log('[HYDRATION] Kích hoạt polling cập nhật ảnh nền...');
            startPolling();
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Không thể tải trang AI.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [pageId, user]);

  if (authLoading || loading) return <SuspenseLoader label="Đang tải trang AI" />;

  const payload = page?.renderPayload;
  if (error || !payload?.eventData) {
    return (
      <RouteCard eyebrow="AI Studio" title="Không thể mở trang">
        <p className="section-lead">{error || 'Trang này không tồn tại hoặc bạn không có quyền xem.'}</p>
        <Link className="ai-page__back" to="/khong-gian-ai">Quay lại Không Gian AI</Link>
      </RouteCard>
    );
  }

  /* ── Resolve template from event type ── */
  const templateKey = payload.eventData?.type || 'universal';
  const TemplateComponent = getResearchTemplate(templateKey);

  const omitted = payload.coverageReport?.omittedSections ?? [];
  return (
    <>
      {omitted.length > 0 && (
        <div className="ai-generated-banner">
          Trang này đã bỏ qua một số phần thiếu dữ liệu: {omitted.join(', ')}.
        </div>
      )}
      <TemplateComponent data={payload.eventData} />
    </>
  );
};

export default AiGeneratedEventPage;
