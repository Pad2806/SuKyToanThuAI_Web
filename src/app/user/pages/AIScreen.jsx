import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AI_REPLIES } from "../data/constants";
import { regenerateImage, generateAndDownloadPptx } from "../../api/mediaApi";
import SlidePreview from "../components/SlidePreview";
import "../styles/AIScreen.css";

// ─── AIScreen ───
export default function AIScreen({ projectData }) {
  const navigate = useNavigate();

  // Dữ liệu từ LibraryScreen/WorkspaceScreen
  const slides = projectData?.slides || [];
  const [assets, setAssets] = useState(projectData?.assets || []);
  const eventTitle = projectData?.event?.title || projectData?.outline?.title || "Dự án mới";
  const totalSlides = slides.length;
  const template = projectData?.template || "Classic";

  // UI state
  const [activeTab, setActiveTab] = useState("all"); // "all" hoặc slide_order number
  const [selectedSlide, setSelectedSlide] = useState(null); // slide đang xem chi tiết
  const [regeneratingSlide, setRegeneratingSlide] = useState(null);

  // Refs cho scroll-to-slide
  const slideRefs = useRef({});
  const canvasRef = useRef(null);

  // Chat state
  const initialMessages = [
    {
      role: "ai",
      content: (
        <>
          <p>
            Xin chào! Mình đã tạo xong{" "}
            <strong>{totalSlides} slide</strong> cho{" "}
            <strong>{eventTitle}</strong>. 📜
          </p>
          {assets.length > 0 && (
            <p>
              Đã tìm được ảnh cho{" "}
              <strong>{assets.filter((a) => a.source !== "fallback").length}/{totalSlides}</strong>{" "}
              slide từ Wikimedia Commons.
            </p>
          )}
          <p>Bấm vào slide để xem chi tiết, hoặc bấm "Đổi ảnh" để thay ảnh khác.</p>
        </>
      ),
      opts: null,
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputVal, setInputVal] = useState("");
  const [replyIdx, setReplyIdx] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = useCallback(
    (text) => {
      setMessages((prev) => [...prev, { role: "user", text }]);
      setTimeout(() => {
        if (replyIdx < AI_REPLIES.length) {
          const r = AI_REPLIES[replyIdx];
          setMessages((prev) => [...prev, { role: "ai", text: r.text, opts: r.opts }]);
          setReplyIdx((i) => i + 1);
        }
      }, 600);
    },
    [replyIdx]
  );

  const handleSend = () => {
    const val = inputVal.trim();
    if (!val) return;
    sendMsg(val);
    setInputVal("");
  };

  // ── Tab click → cuộn tới slide ────────────────────────────────────
  function handleTabClick(slideOrder) {
    setActiveTab(slideOrder);
    setSelectedSlide(null); // Đóng detail panel nếu đang mở

    if (slideOrder === "all") {
      canvasRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = slideRefs.current[slideOrder];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // ── Click vào slide → mở chi tiết ────────────────────────────────
  function handleSlideClick(slide) {
    setSelectedSlide(selectedSlide?.slide_order === slide.slide_order ? null : slide);
    setActiveTab(slide.slide_order);
  }

  // ── Regenerate Image ──────────────────────────────────────────────
  const handleRegenerate = useCallback(
    async (slide, currentAsset) => {
      setRegeneratingSlide(slide.slide_order);

      setMessages((prev) => [
        ...prev,
        { role: "user", text: `Đổi ảnh cho slide ${slide.slide_order}: ${slide.title || slide.image_suggestion}` },
      ]);

      try {
        const result = await regenerateImage({
          slide_order: slide.slide_order,
          image_suggestion: slide.image_suggestion,
          reason: "User muốn đổi ảnh khác",
          exclude_urls: currentAsset?.image_url ? [currentAsset.image_url] : [],
        });

        if (result.success) {
          const newAsset = result.data.asset;

          setAssets((prev) => {
            const updated = prev.filter((a) => a.slide_order !== slide.slide_order);
            updated.push(newAsset);
            return updated.sort((a, b) => a.slide_order - b.slide_order);
          });

          const isFallback = result.data.is_fallback;
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              text: `✅ Đã đổi ảnh cho slide ${slide.slide_order} thành công! Ảnh mới được AI tạo ra.`,
              opts: null,
            },
          ]);
        }
      } catch (error) {
        console.error("Regenerate failed:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: `❌ Lỗi khi đổi ảnh: ${error.message || "Không thể kết nối server"}`,
            opts: null,
          },
        ]);
      } finally {
        setRegeneratingSlide(null);
      }
    },
    []
  );

  function getAssetForSlide(slideOrder) {
    return assets.find((a) => a.slide_order === slideOrder) || null;
  }

  // ── Fallback: không có projectData ─────────────────────────────────
  if (!projectData || slides.length === 0) {
    return (
      <div className="ai-screen" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--text-dim)" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: 12 }}>📭 Chưa có dữ liệu slide</p>
          <p style={{ fontSize: "0.8rem", marginBottom: 20 }}>
            Hãy chọn sự kiện từ Thư viện hoặc nhập nội dung từ Sáng tạo để bắt đầu.
          </p>
          <button
            className="btn-icon btn-icon--primary"
            onClick={() => navigate("/library")}
            style={{ padding: "10px 24px", fontSize: "0.85rem" }}
          >
            📚 Đi tới Thư viện
          </button>
        </div>
      </div>
    );
  }

  const detailAsset = selectedSlide ? getAssetForSlide(selectedSlide.slide_order) : null;

  return (
    <div className="ai-screen">
      {/* ── Topbar ── */}
      <div className="ai-topbar">
        <div className="ai-topbar__left">
          <button className="ai-topbar__back" onClick={() => navigate("/library")}>
            ← Quay lại
          </button>
          <div className="ai-topbar__project">
            <span className="ai-topbar__dot" />
            {eventTitle} – {projectData.outputType === "comic" ? "Truyện tranh" : "Slide"} {totalSlides} trang
          </div>
        </div>
        <div className="ai-topbar__right">
          <button className="btn-icon">🔗 Chia sẻ</button>
          <button
            className="btn-icon btn-icon--primary"
            onClick={async () => {
              try {
                await generateAndDownloadPptx(eventTitle, slides);
                window.open("https://www.canva.com/", "_blank");
              } catch (e) {
                console.error("Download PPTX failed:", e);
                alert("Lỗi tạo file PPTX.");
              }
            }}
          >
            ✏️ Chỉnh sửa
          </button>
        </div>
      </div>

      {/* ── Split Layout ── */}
      <div className="ai-split">
        {/* Chat Panel */}
        <div className="chat-panel">
          <div className="chat-panel__header">💬 AI Trợ lý</div>

          <div className="chat-panel__messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "msg--user" : ""}`}>
                <div className={`msg__avatar msg__avatar--${m.role}`}>
                  {m.role === "ai" ? "AI" : "Bạn"}
                </div>
                <div className={`msg__bubble msg__bubble--${m.role}`}>
                  {m.content || <p>{m.text}</p>}
                  {m.opts && (
                    <div className="chat-options">
                      {m.opts.map((o, j) => (
                        <button key={j} className="chat-option" onClick={() => sendMsg(o)}>
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-panel__input-area">
            <input
              className="chat-input"
              type="text"
              placeholder="Nhập yêu cầu của bạn..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="chat-send" onClick={handleSend}>➤</button>
          </div>
        </div>

        {/* Canvas Panel */}
        <div className="canvas-panel">
          {/* Toolbar với tabs có thể bấm */}
          <div className="canvas-toolbar">
            <button
              className={`canvas-tab ${activeTab === "all" ? "canvas-tab--active" : ""}`}
              onClick={() => handleTabClick("all")}
            >
              Xem trước
            </button>
            <div className="canvas-tab-divider" />
            {slides.map((s) => (
              <button
                key={s.slide_order}
                className={`canvas-tab ${activeTab === s.slide_order ? "canvas-tab--active" : ""}`}
                onClick={() => handleTabClick(s.slide_order)}
              >
                Slide {s.slide_order}
              </button>
            ))}
            <div className="canvas-zoom">
              <button className="canvas-zoom__btn">−</button>
              <span>100%</span>
              <button className="canvas-zoom__btn">+</button>
            </div>
          </div>

          {/* Canvas content */}
          <div className="canvas-content" ref={canvasRef}>
            {slides.map((slide) => (
              <div
                key={slide.slide_order}
                ref={(el) => (slideRefs.current[slide.slide_order] = el)}
              >
                <SlidePreview
                  slide={slide}
                  asset={getAssetForSlide(slide.slide_order)}
                  slideIndex={slide.slide_order}
                  totalSlides={totalSlides}
                  template={template}
                  onRegenerate={handleRegenerate}
                  isRegenerating={regeneratingSlide === slide.slide_order}
                  onClick={() => handleSlideClick(slide)}
                  isSelected={selectedSlide?.slide_order === slide.slide_order}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail Panel (bấm slide để mở) ── */}
        {selectedSlide && (
          <div className="detail-panel">
            <div className="detail-panel__header">
              <span>📋 Chi tiết Slide {selectedSlide.slide_order}</span>
              <button
                className="detail-panel__close"
                onClick={() => setSelectedSlide(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-panel__body">
              {/* Ảnh lớn */}
              {detailAsset && detailAsset.image_url && (
                <div className="detail-panel__image">
                  <img
                    src={detailAsset.image_url}
                    alt={selectedSlide.title}
                    style={{
                      width: "100%",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <div className="detail-panel__license">
                    📷 {detailAsset.license || "Wikimedia Commons"}
                  </div>
                </div>
              )}

              {/* Thông tin slide */}
              <div className="detail-panel__field">
                <label>Tiêu đề</label>
                <div>{selectedSlide.title || "—"}</div>
              </div>

              <div className="detail-panel__field">
                <label>Nội dung</label>
                <div>{selectedSlide.content || selectedSlide.image_suggestion || "—"}</div>
              </div>

              <div className="detail-panel__field">
                <label>Gợi ý ảnh</label>
                <div>{selectedSlide.image_suggestion || "—"}</div>
              </div>

              {selectedSlide.layout_type && (
                <div className="detail-panel__field">
                  <label>Layout</label>
                  <div>{selectedSlide.layout_type}</div>
                </div>
              )}

              {/* Keywords đã dùng */}
              {detailAsset?.keywords_used?.length > 0 && (
                <div className="detail-panel__field">
                  <label>Keywords tìm ảnh</label>
                  <div className="detail-panel__tags">
                    {detailAsset.keywords_used.map((kw, i) => (
                      <span key={i} className="detail-panel__tag">{kw}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nút đổi ảnh */}
              <button
                className="detail-panel__regen-btn"
                onClick={() => handleRegenerate(selectedSlide, detailAsset)}
                disabled={regeneratingSlide === selectedSlide.slide_order}
              >
                {regeneratingSlide === selectedSlide.slide_order
                  ? "⏳ Đang tìm ảnh mới..."
                  : "🔄 Đổi ảnh khác"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
