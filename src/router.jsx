import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';
import { SuspenseLoader } from './components/shared/suspense-loader.jsx';

const HomePage = lazy(() => import('./routes/home-page.jsx'));
const EraDetailPage = lazy(() => import('./routes/era-detail-page.jsx'));
const GradeFilterPage = lazy(() => import('./routes/grade-filter-page.jsx'));
const EventDetailPage = lazy(() => import('./routes/event-detail-page.jsx'));
const SearchPage = lazy(() => import('./routes/search-page.jsx'));
const TopicIndexPage = lazy(() => import('./routes/topic-index-page.jsx'));
const TopicDetailPage = lazy(() => import('./routes/topic-detail-page.jsx'));
const FeaturedIndexPage = lazy(() => import('./routes/featured-index-page.jsx'));
const AdminPage = lazy(() => import('./routes/admin-page.jsx'));
const NotFoundPage = lazy(() => import('./routes/not-found-page.jsx'));

export const AppRoutes = () => (
  <Suspense fallback={<SuspenseLoader label="Đang tải trang" />}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/thoi-ky/:eraSlug" element={<EraDetailPage />} />
      <Route path="/khoi-lop/:gradeSlug" element={<GradeFilterPage />} />
      <Route path="/su-kien/:eventSlug" element={<EventDetailPage />} />
      <Route path="/tim-kiem" element={<SearchPage />} />
      <Route path="/chu-de" element={<TopicIndexPage />} />
      <Route path="/chu-de/:topicSlug" element={<TopicDetailPage />} />
      <Route path="/noi-bat" element={<FeaturedIndexPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
