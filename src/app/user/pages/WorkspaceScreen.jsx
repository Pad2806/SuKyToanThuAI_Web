import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartBar, FaBookOpen, FaMap, FaCloudUploadAlt, FaRocket } from "react-icons/fa";
import { mockOutline, mockOutlineBW } from "../../api/contentApi";
import { generateAssets } from "../../api/mediaApi";
import "../styles/WorkspaceScreen.css";

const OUTPUT_OPTIONS = [
  { icon: <FaChartBar />, label: "Bài Slide", desc: "PowerPoint / PDF", type: "slide" },
  { icon: <FaBookOpen />, label: "Truyện tranh", desc: "Manga / Webtoon", type: "comic" },
  { icon: <FaMap />, label: "Infographic", desc: "Timeline / Map", type: "slide" },
];

const FILE_TYPES = ["PDF", "DOCX", "TXT", "PPTX", "JPG"];

export default function WorkspaceScreen({ setLoading, setLoadingMsg, setProjectData }) {
  const [selectedOutput, setSelectedOutput] = useState(0);
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  async function handleCreate() {
    const text = textContent.trim();
    if (!text) {
      setError("Vui lòng nhập nội dung lịch sử trước khi tạo");
      return;
    }
    if (text.length < 20) {
      setError("Nội dung quá ngắn, vui lòng nhập ít nhất 20 ký tự");
      return;
    }

    setError(null);
    setIsCreating(true);
    setLoading(true);

    const outputType = OUTPUT_OPTIONS[selectedOutput].type;

    try {
      // ── Bước 1: Mock moderate + outline ─────────────────────────────
      // TODO: Thay bằng moderateContent() + createOutline() khi Content Service sẵn sàng
      setLoadingMsg("Đang kiểm duyệt nội dung...");
      await sleep(500);

      setLoadingMsg("Đang tạo outline từ nội dung...");
      await sleep(500);

      // Tạo mock event từ text user nhập
      const mockEvent = {
        id: `custom-${Date.now()}`,
        title: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
        desc: text.slice(0, 200),
        era: "",
      };

      const outline = mockOutline(mockEvent, outputType);
      const slides = outline.data.slides || [];

      // ── Bước 2: Gọi Media Service tìm ảnh ──────────────────────────
      setLoadingMsg("Đang tìm ảnh minh họa từ Wikimedia...");

      const slideInputs = slides
        .filter((s) => s.image_suggestion)
        .map((s) => ({
          slide_order: s.slide_order,
          image_suggestion: s.image_suggestion,
        }));

      const projectId = `custom-${Date.now()}`;
      let assets = [];

      try {
        setLoadingMsg("Đang lọc và chọn ảnh phù hợp nhất...");
        const mediaResult = await generateAssets(projectId, slideInputs);
        if (mediaResult.success) {
          assets = mediaResult.data.assets;
        }
      } catch (mediaError) {
        console.warn("Media Service lỗi, tiếp tục không có ảnh:", mediaError);
      }

      // ── Bước 3: Navigate sang AIScreen ──────────────────────────────
      setLoadingMsg("Sắp hoàn thành...");
      await sleep(300);

      const data = {
        projectId,
        event: mockEvent,
        outputType,
        outline: outline.data,
        slides,
        assets,
      };

      setProjectData(data);
      setLoading(false);
      setLoadingMsg("");

      setTimeout(() => navigate("/ai"), 50);
    } catch (err) {
      console.error("Lỗi tạo project:", err);
      setError(`Lỗi: ${err.message || "Không thể tạo project"}`);
      setLoading(false);
      setLoadingMsg("");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="workspace">
      <div className="workspace__container">
        <h1 className="workspace__title">Tạo từ nội dung của bạn</h1>
        <p className="workspace__sub">
          Tải lên tài liệu hoặc nhập văn bản — AI sẽ chuyển hóa thành sản phẩm
          học tập tuyệt vời
        </p>

        {/* Upload Zone */}
        <div className="upload-zone" onClick={handleUploadClick}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.docx,.txt,.pptx,.jpg,.jpeg,.png"
          />
          <div className="upload-zone__icon">
            <FaCloudUploadAlt style={{ color: "var(--gold)" }} />
          </div>
          <div className="upload-zone__title">Kéo thả file vào đây</div>
          <div className="upload-zone__sub">hoặc click để chọn file từ máy tính</div>
          <div className="upload-zone__types">
            {FILE_TYPES.map((t) => (
              <span key={t} className="type-tag">{t}</span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider">hoặc nhập văn bản</div>

        {/* Textarea */}
        <textarea
          className="text-area"
          placeholder="Dán nội dung lịch sử vào đây... VD: Khởi nghĩa Hai Bà Trưng năm 40 SCN do Trưng Trắc và Trưng Nhị lãnh đạo..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
        />

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
            borderRadius: 8,
            padding: "10px 16px",
            marginTop: 12,
            color: "#fca5a5",
            fontSize: "0.8rem",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Output Select */}
        <p className="output-select__label">Chọn định dạng đầu ra</p>
        <div className="output-select">
          {OUTPUT_OPTIONS.map((o, i) => (
            <div
              key={i}
              className={`output-option ${selectedOutput === i ? "output-option--selected" : ""}`}
              onClick={() => setSelectedOutput(i)}
            >
              <div className="output-option__icon">{o.icon}</div>
              <div className="output-option__label">{o.label}</div>
              <div className="output-option__desc">{o.desc}</div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          className="start-btn"
          onClick={handleCreate}
          disabled={isCreating}
        >
          <FaRocket style={{ marginRight: "8px" }} />
          {isCreating ? "Đang tạo..." : "Bắt đầu tạo với AI"}
        </button>
      </div>
    </div>
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
