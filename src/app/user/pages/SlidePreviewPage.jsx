import { useState } from "react";
import "../../user/styles/BlackWhiteModel.css";
import "../../user/styles/VintageElegance.css";

import * as BW from "../components/slides/BlackWhiteModel";
import * as VE from "../components/slides/VintageElegance";

// ── Template registry ──
const TEMPLATES = {
  BlackWhiteModel: {
    label: "Black & White",
    desc: "Dark gothic/vintage",
    color: "#1a1a1a",
    accent: "#d4c5a0",
    map: {
      title: BW.TitleSlide,
      introduction: BW.IntroductionSlide,
      content: BW.ContentSlide,
      two_column: BW.TwoColumnSlide,
      timeline: BW.TimelineSlide,
      quote: BW.QuoteSlide,
      table: BW.TableSlide,
      data_results: BW.DataResultsSlide,
      summary: BW.SummarySlide,
      section_divider: BW.SectionDividerSlide,
      ending: BW.EndingSlide,
      image_sources: BW.ImageSourcesSlide,
    },
  },
  VintageElegance: {
    label: "Vintage Elegance",
    desc: "Warm parchment/antique",
    color: "#e8dcc4",
    accent: "#8b5e3c",
    map: {
      title: VE.TitleSlide,
      introduction: VE.IntroductionSlide,
      content: VE.ContentSlide,
      two_column: VE.TwoColumnSlide,
      timeline: VE.TimelineSlide,
      quote: VE.QuoteSlide,
      table: VE.TableSlide,
      data_results: VE.DataResultsSlide,
      summary: VE.SummarySlide,
      section_divider: VE.SectionDividerSlide,
      ending: VE.EndingSlide,
      image_sources: VE.ImageSourcesSlide,
    },
  },
};

// ── Mock data ──
const SAMPLE_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Trung_Sisters.jpg/800px-Trung_Sisters.jpg";

const MOCK_SLIDES = [
  {
    name: "1. Title Slide",
    layout: "title",
    slide: {
      title: "Khởi Nghĩa Hai Bà Trưng",
      subtitle: "Cuộc khởi nghĩa đầu tiên giành độc lập dân tộc",
      content: "Năm 40 – 43 SCN",
      layout_type: "title",
    },
    imageUrl: SAMPLE_IMAGE,
  },
  {
    name: "2. Introduction",
    layout: "introduction",
    slide: {
      title: "Giới thiệu",
      content: "Hai Bà Trưng – Trưng Trắc và Trưng Nhị – là hai nữ anh hùng dân tộc đầu tiên trong lịch sử Việt Nam. Cuộc khởi nghĩa của hai bà đã đánh đuổi quân Đông Hán, giành lại độc lập cho đất nước sau hơn 200 năm Bắc thuộc. Đây là biểu tượng bất khuất của tinh thần yêu nước Việt Nam.",
      layout_type: "introduction",
    },
    imageUrl: SAMPLE_IMAGE,
  },
  {
    name: "3. Content (List)",
    layout: "content",
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
    name: "4. Two Column",
    layout: "two_column",
    slide: {
      title: "So sánh lực lượng",
      columns: [
        {
          heading: "Quân khởi nghĩa",
          text: "Lực lượng chủ yếu là nông dân, thợ thủ công và các lạc tướng địa phương. Tinh thần chiến đấu cao, am hiểu địa hình.",
        },
        {
          heading: "Quân Đông Hán",
          text: "Quân đội chính quy với trang bị tốt hơn. Tuy nhiên xa xứ, không quen địa hình và khí hậu.",
        },
      ],
      layout_type: "two_column",
    },
  },
  {
    name: "5. Timeline",
    layout: "timeline",
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
    name: "6. Quote",
    layout: "quote",
    slide: {
      title: "Lời thề sông Hát",
      quote_text: "Một xin rửa sạch nước thù, Hai xin đem lại nghiệp xưa họ Hùng, Ba kẻo oan ức lòng chồng, Bốn xin vẻn vẹn sở công lênh này.",
      quote_author: "Trưng Trắc",
      quote_context: "Lời thề khi phất cờ khởi nghĩa tại cửa sông Hát, mùa xuân năm 40 SCN.",
      layout_type: "quote",
    },
  },
  {
    name: "7. Table",
    layout: "table",
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
    name: "8. Data & Results",
    layout: "data_results",
    slide: {
      title: "Kết quả\nkhởi nghĩa",
      content: "Cuộc khởi nghĩa đã giải phóng toàn bộ vùng Giao Chỉ và Cửu Chân. Trưng Trắc xưng vương, lập triều đình độc lập trong gần 3 năm.",
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
    name: "9. Summary",
    layout: "summary",
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
    layout: "section_divider",
    slide: { title: "Phần II", subtitle: "Di sản và tưởng nhớ", layout_type: "section_divider" },
  },
  {
    name: "11. Ending",
    layout: "ending",
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
    layout: "image_sources",
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

export default function SlidePreviewPage() {
  const [activeTemplate, setActiveTemplate] = useState("BlackWhiteModel");
  const [selectedIdx, setSelectedIdx] = useState(null);

  const tpl = TEMPLATES[activeTemplate];
  const slidesToShow = selectedIdx !== null ? [MOCK_SLIDES[selectedIdx]] : MOCK_SLIDES;

  return (
    <div style={pageStyles.page}>
      {/* ── Header ── */}
      <div style={pageStyles.header}>
        <h1 style={pageStyles.h1}>Slide Template Preview</h1>
        <p style={pageStyles.subtitle}>
          So sánh {Object.keys(TEMPLATES).length} templates với cùng mock data
        </p>
      </div>

      {/* ── Template Switcher ── */}
      <div style={pageStyles.templateSwitcher}>
        <span style={pageStyles.switcherLabel}>Chọn Template:</span>
        <div style={pageStyles.templateBtns}>
          {Object.entries(TEMPLATES).map(([key, t]) => {
            const isActive = activeTemplate === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTemplate(key)}
                style={{
                  ...pageStyles.templateBtn,
                  ...(isActive ? pageStyles.templateBtnActive : {}),
                  borderColor: isActive ? t.accent : "rgba(150,140,120,0.25)",
                }}
              >
                <span
                  style={{
                    ...pageStyles.templateSwatch,
                    background: t.color,
                    border: `2px solid ${t.accent}`,
                  }}
                />
                <div style={pageStyles.templateBtnInfo}>
                  <span style={{
                    ...pageStyles.templateBtnName,
                    color: isActive ? "#f5f0e8" : "#b8b0a4",
                  }}>
                    {t.label}
                  </span>
                  <span style={pageStyles.templateBtnDesc}>{t.desc}</span>
                </div>
                {isActive && <span style={pageStyles.activeBadge}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Slide Navigation ── */}
      <div style={pageStyles.nav}>
        <button
          style={{ ...pageStyles.navBtn, ...(selectedIdx === null ? pageStyles.navBtnActive : {}) }}
          onClick={() => setSelectedIdx(null)}
        >
          Tất cả
        </button>
        {MOCK_SLIDES.map((s, i) => (
          <button
            key={i}
            style={{ ...pageStyles.navBtn, ...(selectedIdx === i ? pageStyles.navBtnActive : {}) }}
            onClick={() => setSelectedIdx(i)}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* ── Slide Grid ── */}
      <div style={pageStyles.grid}>
        {slidesToShow.map((item) => {
          const SlideComp = tpl.map[item.layout];
          if (!SlideComp) return null;
          return (
            <div key={`${activeTemplate}-${item.name}`} style={pageStyles.slideWrapper}>
              <span style={pageStyles.slideLabel}>{item.name}</span>
              <div style={pageStyles.slideFrame}>
                <SlideComp slide={item.slide} imageUrl={item.imageUrl} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Inline Styles ──
const pageStyles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    padding: "32px 24px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: { textAlign: "center", marginBottom: 24 },
  h1: {
    color: "#f5f0e8",
    fontSize: "1.8rem",
    fontFamily: "'Playfair Display', Georgia, serif",
    margin: "0 0 8px",
  },
  subtitle: { color: "#8a7d6a", fontSize: "0.85rem", margin: 0 },

  // Template Switcher
  templateSwitcher: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  switcherLabel: {
    color: "#8a7d6a",
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  templateBtns: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  templateBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 20px",
    borderRadius: 12,
    border: "1.5px solid rgba(150,140,120,0.25)",
    background: "rgba(255,255,255,0.03)",
    cursor: "pointer",
    transition: "all 0.25s ease",
    minWidth: 200,
    position: "relative",
  },
  templateBtnActive: {
    background: "rgba(255,255,255,0.08)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  templateSwatch: {
    width: 36,
    height: 36,
    borderRadius: 8,
    flexShrink: 0,
  },
  templateBtnInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    textAlign: "left",
  },
  templateBtnName: {
    fontSize: "0.8rem",
    fontWeight: 700,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  templateBtnDesc: { fontSize: "0.6rem", color: "#8a7d6a" },
  activeBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#4caf50",
    color: "#fff",
    fontSize: "0.55rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },

  // Slide nav
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

  // Slides
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
    maxWidth: 900,
    margin: "0 auto",
  },
  slideWrapper: { display: "flex", flexDirection: "column", gap: 8 },
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
};
