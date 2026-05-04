import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLandmark, FaSearch, FaChartBar, FaBookOpen } from "react-icons/fa";
import { EVENTS } from "../data/constants";
import { mockOutline, mockOutlineBW } from "../../api/contentApi";
import { generateAssets } from "../../api/mediaApi";
import "../styles/LibraryScreen.css";

const CHIPS = ["Tất cả", "Lịch sử Việt Nam", "Lịch sử Thế giới", "Cổ đại", "Cận đại", "Thế chiến"];

const LOADING_STEPS = [
  "Đang phân tích sự kiện lịch sử...",
  "Đang tạo outline slide...",
  "Đang tìm ảnh minh họa từ Wikimedia...",
  "Đang lọc và chọn ảnh phù hợp nhất...",
  "Sắp hoàn thành, đợi tí nhé!",
];

// ─── EventCard ───
function EventCard({ ev, onCreateSlide, onCreateComic, isCreating }) {
  return (
    <div className="event-card">
      <div className="event-card__thumb" style={{ background: ev.bg }}>
        {ev.img ? (
          <img src={ev.img} alt={ev.title} className="event-card__thumb-inner" style={{ objectFit: "cover" }} />
        ) : (
          <div className="event-card__thumb-inner">{ev.emoji}</div>
        )}
        <div className="event-card__era">{ev.era}</div>
      </div>

      <div className="event-card__body">
        <h3 className="event-card__title">{ev.title}</h3>
        <p className="event-card__desc">{ev.desc}</p>

        <div className="event-card__actions">
          <button
            className="btn-sm btn-sm--gold"
            onClick={() => onCreateSlide(ev)}
            disabled={isCreating}
          >
            <FaChartBar style={{ marginRight: "6px" }} />
            {isCreating ? "Đang tạo..." : "Tạo Slide"}
          </button>
          <button
            className="btn-sm btn-sm--red"
            onClick={() => onCreateComic(ev)}
            disabled={isCreating}
          >
            <FaBookOpen style={{ marginRight: "6px" }} />
            {isCreating ? "Đang tạo..." : "Tạo Truyện tranh"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LibraryScreen ───
export default function LibraryScreen({ setLoading, setLoadingMsg, setProjectData }) {
  const [activeChip, setActiveChip] = useState("Tất cả");
  const [creatingEventId, setCreatingEventId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Luồng tạo slide/comic:
   * 1. Mock outline (Content Service chưa sẵn sàng)
   * 2. Gọi Media Service /generate-assets → lấy ảnh thật
   * 3. Navigate sang /ai với dữ liệu
   */
  async function handleCreate(event, outputType) {
    setCreatingEventId(event.id);
    setError(null);
    setLoading(true);

    try {
      // ── Bước 1: Tạo outline (mock) ──────────────────────────────────
      // TODO: Thay bằng createOutline() khi Content Service sẵn sàng
      setLoadingMsg(LOADING_STEPS[0]);
      await sleep(500); // Giả lập delay

      setLoadingMsg(LOADING_STEPS[1]);
      // Dùng BlackWhiteModel template cho event "Khởi nghĩa Hai Bà Trưng"
      const outline = event.id === 1
        ? mockOutlineBW(event, outputType)
        : mockOutline(event, outputType);
      const slides = outline.data.slides || [];
      const template = outline.data.template || "Classic";

      if (!slides.length) {
        throw new Error("Outline không có slide nào");
      }

      // ── Bước 2: Lấy ảnh ─────────────────────────────────────────────
      setLoadingMsg(LOADING_STEPS[2]);

      const projectId = `temp-${event.id}-${Date.now()}`;
      let assets = [];

      // Chuẩn bị input cho Media Service — chỉ gửi slides có image_suggestion
      const slideInputs = slides
        .filter((s) => s.image_suggestion)
        .map((s) => ({
          slide_order: s.slide_order,
          image_suggestion: s.image_suggestion,
        }));

      try {
        setLoadingMsg(LOADING_STEPS[3]);
        const mediaResult = await generateAssets(projectId, slideInputs);

        if (mediaResult.success && mediaResult.data.assets?.length > 0) {
          assets = mediaResult.data.assets;
        }
      } catch (mediaError) {
        console.warn("Media Service lỗi, dùng ảnh fallback:", mediaError);
      }

      // Fallback: nếu Media Service không trả ảnh, dùng mock assets từ outline
      if (assets.length === 0 && outline.data.assets?.length > 0) {
        assets = outline.data.assets;
      }

      // ── Bước 3: Gom dữ liệu và navigate ────────────────────────────
      setLoadingMsg(LOADING_STEPS[4]);
      await sleep(300);

      const data = {
        projectId,
        event,
        outputType,
        template,
        outline: outline.data,
        slides,
        assets,
      };

      setProjectData(data);

      // Tắt loading trước khi navigate để tránh overlay che trang AI
      setLoading(false);
      setLoadingMsg("");

      // Dùng setTimeout để đảm bảo state đã cập nhật trước khi navigate
      setTimeout(() => navigate("/ai"), 50);
    } catch (err) {
      console.error("Lỗi tạo project:", err);
      setError(`Lỗi: ${err.message || "Không thể tạo project"}`);
      setLoading(false);
      setLoadingMsg("");
    } finally {
      setCreatingEventId(null);
    }
  }

  return (
    <div className="library">
      {/* Header */}
      <div className="library__header">
        <h1 className="page-title">
          <FaLandmark style={{ marginRight: "10px", color: "var(--gold)", verticalAlign: "middle" }} />
          Thư viện Lịch sử
        </h1>
        <p className="page-subtitle">
          Khám phá kho tư liệu lịch sử được biên soạn cẩn thận — sẵn sàng để
          biến thành Slide hoặc Truyện tranh
        </p>

        <div className="search-filter-bar">
          <div className="search-input-wrapper" style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input
              className="search-input"
              type="text"
              placeholder="Tìm kiếm sự kiện lịch sử..."
              style={{ paddingLeft: "40px", width: "100%" }}
            />
          </div>
          <div className="filter-chips">
            {CHIPS.map((c) => (
              <button
                key={c}
                className={`chip ${activeChip === c ? "chip--active" : ""}`}
                onClick={() => setActiveChip(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          background: "rgba(220,38,38,0.1)",
          border: "1px solid rgba(220,38,38,0.3)",
          borderRadius: 8,
          padding: "12px 20px",
          margin: "0 40px 20px",
          color: "#fca5a5",
          fontSize: "0.85rem",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Events Grid */}
      <div className="events-grid">
        {EVENTS.map((ev) => (
          <EventCard
            key={ev.id}
            ev={ev}
            onCreateSlide={(event) => handleCreate(event, "slide")}
            onCreateComic={(event) => handleCreate(event, "comic")}
            isCreating={creatingEventId === ev.id}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Helpers ───
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
