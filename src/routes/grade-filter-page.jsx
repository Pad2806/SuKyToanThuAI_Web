import React, { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { EventListSection } from '../components/filters/event-list-section.jsx';
import { FilterSortBar } from '../components/filters/filter-sort-bar.jsx';
import { RouteCard } from '../components/shared/route-card.jsx';
import { getAllEvents, getAllTopics } from '../lib/event-queries.js';
import { applyListingState, parseListingState } from '../lib/listing-state.js';

const gradeConfig = {
  th: { label: 'Tiểu học', subtitle: 'Câu chuyện gần gũi qua nhân vật và hình ảnh, giúp các em tiểu học yêu lịch sử từ những bước đầu tiên.', image: '/images/generated/hung-vuong.png' },
  thcs: { label: 'THCS', subtitle: 'Đi sâu vào bối cảnh và diễn biến, rèn tư duy phân tích lịch sử cho học sinh trung học cơ sở.', image: '/images/generated/hai-ba-trung.png' },
  thpt: { label: 'THPT', subtitle: 'Phân tích nguyên nhân, hệ quả và bài học từ các sự kiện, phù hợp với chương trình THPT.', image: '/images/generated/bach-dang.png' },
  '5': { label: 'Lớp 5', subtitle: 'Khởi đầu hành trình khám phá những câu chuyện và nhân vật lịch sử rực rỡ nhất của dân tộc.', image: '/images/generated/hung-vuong-ceremony.png' },
  '6': { label: 'Lớp 6', subtitle: 'Từ cội nguồn dân tộc đến thế kỷ X: Thời kỳ dựng nước và giữ nước oai hùng.', image: '/images/generated/hai-ba-trung.png' },
  '7': { label: 'Lớp 7', subtitle: 'Lịch sử trung đại Việt Nam thế kỷ X – XVI: Xây dựng nền văn minh Đại Việt rực rỡ.', image: '/images/generated/ly-tran.png' },
  '8': { label: 'Lớp 8', subtitle: 'Biến động thế kỷ XVI – XIX: Trịnh Nguyễn phân tranh và phong trào Tây Sơn oanh liệt.', image: '/images/generated/trinh-nguyen.png' },
  '9': { label: 'Lớp 9', subtitle: 'Cách mạng giải phóng dân tộc: Những mốc son chói lọi trong thế kỷ XX.', image: '/images/generated/hien-dai.png' },
  '10': { label: 'Lớp 10', subtitle: 'Tổng quan tiến trình lịch sử: Nhìn lại hành trình từ nguyên thủy đến cổ đại.', image: '/images/generated/co-loa.png' },
  '11': { label: 'Lớp 11', subtitle: 'Việt Nam giữa biển lớn: Từ thế kỷ XIX đến hết chiến tranh thế giới thứ nhất.', image: '/images/generated/nguyen.png' },
  '12': { label: 'Lớp 12', subtitle: 'Lịch sử hiện đại và hội nhập: Bước chuyển mình vĩ đại của dân tộc.', image: '/images/generated/hero-banner.png' },
};

export const GradeFilterPage = () => {
  const { gradeSlug = 'thcs' } = useParams();
  const [searchParams] = useSearchParams();
  const grade = gradeSlug.toUpperCase();
  const config = gradeConfig[gradeSlug] || { label: grade, subtitle: '', image: null };
  const state = { ...parseListingState(searchParams), grade };
  const events = useMemo(() => applyListingState(getAllEvents(), state), [grade, state.sort, state.topic, state.type]);

  return (
    <RouteCard
      eyebrow="Khối lớp"
      title={config.label}
      coverImage={config.image}
      subtitle={config.subtitle}
    >
      <FilterSortBar topics={getAllTopics()} />
      <EventListSection events={events} variant="grid" />
    </RouteCard>
  );
};

export default GradeFilterPage;
