import { useState } from "react";
import "../../user/styles/BlackWhiteModel.css";

import {
  TitleSlide,
  IntroductionSlide,
  ContentSlide,
  TwoColumnSlide,
  TimelineSlide,
  QuoteSlide,
  TableSlide,
  DataResultsSlide,
  SummarySlide,
  SectionDividerSlide,
  EndingSlide,
  ImageSourcesSlide,
} from "../components/slides/BlackWhiteModel";

// ── Mock data giả lập content-service response ──
const SAMPLE_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Trung_Sisters.jpg/800px-Trung_Sisters.jpg";

const MOCK_SLIDES = [
  {
    name: "1. Title Slide",
    component: TitleSlide,
    slide: {
      title: "Khởi Nghĩa Hai Bà Trưng",
      subtitle: "Cuộc khởi nghĩa đầu tiên giành độc lập dân tộc",
      content: "Năm 40 – 43 SCN",
      layout_type: "title",
    },
    imageUrl: SAMPLE_IMAGE,
  },
  {
    name: "2. Introduction Slide",
    component: IntroductionSlide,
    slide: {
      title: "Giới thiệu",
      content:
        "Hai Bà Trưng – Trưng Trắc và Trưng Nhị – là hai nữ anh hùng dân tộc đầu tiên trong lịch sử Việt Nam. Cuộc khởi nghĩa của hai bà đã đánh đuổi quân Đông Hán, giành lại độc lập cho đất nước sau hơn 200 năm Bắc thuộc. Đây là biểu tượng bất khuất của tinh thần yêu nước Việt Nam.",
      layout_type: "introduction",
    },
    imageUrl: SAMPLE_IMAGE,
  },
  {
    name: "3. Content Slide (Numbered List)",
    component: ContentSlide,
    slide: {
      title: "Nguyên nhân\nkhởi nghĩa",
      content: "Nhiều yếu tố dẫn đến cuộc nổi dậy của Hai Bà Trưng:",
      bullets: [
        "Chính sách cai trị hà khắc của nhà Đông Hán, đặc biệt dưới thời Thái thú Tô Định.",
        "Tô Định giết chồng Trưng Trắc là Thi Sách – lạc tướng huyện Chu Diên.",
        "Nhân dân Giao Chỉ bị bóc lột nặng nề, mất ruộng đất và quyền tự chủ.",
      ],
      layout_type: "content",
    },
    imageUrl: SAMPLE_IMAGE,
  },
  {
    name: "4. Two Column Slide",
    component: TwoColumnSlide,
    slide: {
      title: "So sánh lực lượng",
      columns: [
        {
          heading: "Quân khởi nghĩa",
          text: "Lực lượng chủ yếu là nông dân, thợ thủ công và các lạc tướng địa phương. Tinh thần chiến đấu cao, am hiểu địa hình. Trang bị vũ khí thô sơ nhưng quyết tâm giành độc lập.",
        },
        {
          heading: "Quân Đông Hán",
          text: "Quân đội chính quy với trang bị tốt hơn. Tuy nhiên xa xứ, không quen địa hình và khí hậu. Tinh thần chiến đấu không cao do đang ở vùng đất xa lạ.",
        },
      ],
      layout_type: "two_column",
    },
  },
  {
    name: "5. Timeline Slide",
    component: TimelineSlide,
    slide: {
      title: "Diễn biến chính",
      events: [
        { year: "Mùa xuân 40", place: "Hát Môn", text: "Hai Bà Trưng phất cờ khởi nghĩa tại cửa sông Hát." },
        { year: "40 SCN", place: "Mê Linh", text: "Đánh chiếm thành Mê Linh, đuổi Tô Định chạy về nước." },
        { year: "40 – 42", place: "Toàn Giao Chỉ", text: "Trưng Trắc xưng vương, đóng đô ở Mê Linh, cai quản 65 thành." },
        { year: "42 – 43", place: "Lãng Bạc", text: "Mã Viện đem quân sang đàn áp, Hai Bà thua trận và hy sinh." },
      ],
      layout_type: "timeline",
    },
  },
  {
    name: "6. Quote Slide",
    component: QuoteSlide,
    slide: {
      title: "Lời thề sông Hát",
      quote_text: "Một xin rửa sạch nước thù, Hai xin đem lại nghiệp xưa họ Hùng, Ba kẻo oan ức lòng chồng, Bốn xin vẻn vẹn sở công lênh này.",
      quote_author: "Trưng Trắc",
      quote_context: "Lời thề khi phất cờ khởi nghĩa tại cửa sông Hát, mùa xuân năm 40 SCN.",
      layout_type: "quote",
    },
  },
  {
    name: "7. Table Slide",
    component: TableSlide,
    slide: {
      title: "Các tướng lĩnh tiêu biểu",
      table_headers: ["Tên", "Quê quán", "Vai trò"],
      table_rows: [
        ["Trưng Trắc", "Mê Linh", "Lãnh đạo tối cao, xưng vương"],
        ["Trưng Nhị", "Mê Linh", "Phó tướng, em gái Trưng Trắc"],
        ["Lê Chân", "An Biên (Hải Phòng)", "Nữ tướng, trấn giữ vùng biển"],
        ["Thánh Thiên", "Bắc Ninh", "Nữ tướng, đánh thành Luy Lâu"],
      ],
      footer_text: "Nguồn: Đại Việt sử ký toàn thư",
      layout_type: "table",
    },
  },
  {
    name: "8. Data & Results Slide",
    component: DataResultsSlide,
    slide: {
      title: "Kết quả\nkhởi nghĩa",
      content:
        "Cuộc khởi nghĩa đã giải phóng toàn bộ vùng Giao Chỉ và Cửu Chân. Trưng Trắc xưng vương, lập triều đình độc lập trong gần 3 năm. Đây là lần đầu tiên người Việt giành lại chủ quyền sau hơn 200 năm Bắc thuộc.",
      chart_data: [
        { label: "Thành giải phóng", value: "65", percent: 85 },
        { label: "Thời gian độc lập", value: "3 năm", percent: 40 },
        { label: "Nữ tướng", value: "30+", percent: 60 },
        { label: "Quận hưởng ứng", value: "6", percent: 75 },
      ],
      layout_type: "data_results",
    },
  },
  {
    name: "9. Summary Slide",
    component: SummarySlide,
    slide: {
      title: "Ý nghĩa lịch sử",
      subtitle: "Cuộc khởi nghĩa Hai Bà Trưng để lại nhiều bài học quý giá",
      bullets: [
        "Khẳng định tinh thần bất khuất, ý chí độc lập của dân tộc Việt Nam.",
        "Vai trò to lớn của phụ nữ Việt Nam trong sự nghiệp đấu tranh giải phóng.",
        "Truyền cảm hứng cho các cuộc khởi nghĩa sau này: Bà Triệu, Lý Bí, Mai Thúc Loan...",
      ],
      footer_text: "Hai Bà Trưng — biểu tượng bất diệt của lòng yêu nước",
      layout_type: "summary",
    },
  },
  {
    name: "10. Section Divider",
    component: SectionDividerSlide,
    slide: {
      title: "Phần II",
      subtitle: "Di sản và tưởng nhớ",
      layout_type: "section_divider",
    },
  },
  {
    name: "11. Ending Slide",
    component: EndingSlide,
    slide: {
      title: "Cảm ơn",
      subtitle: "Bài thuyết trình đến đây là kết thúc",
      content: "SuKyToanThu AI",
      layout_type: "ending",
    },
    imageUrl: SAMPLE_IMAGE,
  },
  {
    name: "12. Image Sources",
    component: ImageSourcesSlide,
    slide: {
      title: "Nguồn ảnh",
      sources: [
        { name: "Hai Bà Trưng — tranh vẽ", url: "Wikimedia Commons", thumb_url: SAMPLE_IMAGE },
        { name: "Đền thờ Hai Bà Trưng", url: "Wikimedia Commons", thumb_url: SAMPLE_IMAGE },
        { name: "Bản đồ Giao Chỉ thời Đông Hán", url: "Wikimedia Commons" },
      ],
      layout_type: "image_sources",
    },
  },
];

// ── Styles cho trang preview ──
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    padding: "32px 24px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: 32,
  },
  h1: {
    color: "#f5f0e8",
    fontSize: "1.8rem",
    fontFamily: "'Playfair Display', Georgia, serif",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#8a7d6a",
    fontSize: "0.85rem",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
    maxWidth: 900,
    margin: "0 auto",
  },
  slideWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  slideLabel: {
    color: "#d4c5a0",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
  },
  slideFrame: {
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid rgba(212, 197, 160, 0.2)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    position: "relative",
  },
  nav: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 24,
  },
  navBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    border: "1px solid rgba(212,197,160,0.3)",
    background: "rgba(255,255,255,0.04)",
    color: "#d4c5a0",
    fontSize: "0.65rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  navBtnActive: {
    background: "rgba(212,197,160,0.15)",
    borderColor: "#d4c5a0",
    color: "#f5f0e8",
  },
};

export default function SlidePreviewPage() {
  const [selectedIdx, setSelectedIdx] = useState(null); // null = show all

  const slidesToShow = selectedIdx !== null ? [MOCK_SLIDES[selectedIdx]] : MOCK_SLIDES;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.h1}>BlackWhiteModel — Slide Preview</h1>
        <p style={styles.subtitle}>
          {MOCK_SLIDES.length} slide templates với mock data lịch sử Việt Nam
        </p>
      </div>

      {/* Navigation */}
      <div style={styles.nav}>
        <button
          style={{ ...styles.navBtn, ...(selectedIdx === null ? styles.navBtnActive : {}) }}
          onClick={() => setSelectedIdx(null)}
        >
          Tất cả
        </button>
        {MOCK_SLIDES.map((s, i) => (
          <button
            key={i}
            style={{ ...styles.navBtn, ...(selectedIdx === i ? styles.navBtnActive : {}) }}
            onClick={() => setSelectedIdx(i)}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Slide grid */}
      <div style={styles.grid}>
        {slidesToShow.map((item, i) => {
          const SlideComp = item.component;
          return (
            <div key={item.name} style={styles.slideWrapper}>
              <span style={styles.slideLabel}>{item.name}</span>
              <div style={styles.slideFrame}>
                <SlideComp slide={item.slide} imageUrl={item.imageUrl} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
