import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import { SuspenseLoader } from './components/shared/suspense-loader.jsx';

const HomePage = lazy(() => import('./routes/home-page.jsx'));
const EraDetailPage = lazy(() => import('./routes/era-detail-page.jsx'));
const GradeFilterPage = lazy(() => import('./routes/grade-filter-page.jsx'));
const EventDetailPage = lazy(() => import('./routes/event-detail-page.jsx'));
const SearchPage = lazy(() => import('./routes/search-page.jsx'));

const FeaturedIndexPage = lazy(() => import('./routes/featured-index-page.jsx'));
const NotFoundPage = lazy(() => import('./routes/not-found-page.jsx'));

/* ── New: AI Studio flows ── */
const LoginPage = lazy(() => import('./routes/login-page.jsx'));
const AiHubPage = lazy(() => import('./routes/ai-hub-page.jsx'));
const StudioPage = lazy(() => import('./routes/studio-page.jsx'));
const CreatorPage = lazy(() => import('./routes/creator-page.jsx'));
const AiGeneratedEventPage = lazy(() => import('./routes/ai-generated-event-page.jsx'));

export const AppRoutes = () => (
  <Suspense fallback={<SuspenseLoader label="Đang tải trang" />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/thoi-ky/:eraSlug" element={<EraDetailPage />} />
      <Route path="/khoi-lop/:gradeSlug" element={<GradeFilterPage />} />
      <Route path="/su-kien/:eventSlug" element={<EventDetailPage />} />
      <Route path="/tim-kiem" element={<SearchPage />} />

      <Route path="/noi-bat" element={<FeaturedIndexPage />} />

      {/* Auth & AI Studio */}
      <Route path="/dang-nhap" element={<LoginPage />} />
      <Route path="/khong-gian-ai" element={<AiHubPage />} />
      <Route path="/khong-gian-ai/nghien-cuu" element={<StudioPage />} />
      <Route path="/khong-gian-ai/sang-tao" element={<CreatorPage />} />
      <Route path="/ai/trang/:pageId" element={<AiGeneratedEventPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
