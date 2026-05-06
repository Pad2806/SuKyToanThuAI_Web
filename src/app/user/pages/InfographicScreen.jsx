import { useRef, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import InfographicRenderer from "../components/infographic/InfographicRenderer";
import { MOCK_INFOGRAPHIC_DATA } from "../data/mockInfographic";
import { generateInfographicImages } from "../../api/mediaApi";
import { exportInfographicPDF } from "../utils/exportPdf";
import "../styles/Infographic.css";

export default function InfographicScreen({ projectData }) {
  const navigate = useNavigate();
  const rendererRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");

  // Dùng data từ Gemini nếu có, fallback sang mock
  const isAIGenerated = !!projectData?.infographicData;
  const [data, setData] = useState(
    projectData?.infographicData || MOCK_INFOGRAPHIC_DATA
  );
  const title = data.title || "Infographic";

  // ── Tự động fetch ảnh khi có image_suggestion nhưng chưa có image_url ──
  useEffect(() => {
    const headerBlock = data.blocks.find(b => b.block_type === "header");
    const outtroBlock = data.blocks.find(b => b.block_type === "outtro");

    const needsHeaderImage = headerBlock?.image_suggestion && !headerBlock?.image_url;
    const needsOuttroImage = outtroBlock?.image_suggestion && !outtroBlock?.image_url;

    if (!needsHeaderImage && !needsOuttroImage) return;

    let cancelled = false;

    async function fetchImages() {
      setLoadingImages(true);
      try {
        const result = await generateInfographicImages(
          data.title,
          headerBlock?.image_suggestion || null,
          outtroBlock?.image_suggestion || null,
        );

        if (cancelled) return;

        if (result.success && result.data.images.length > 0) {
          // Clone blocks và gán image_url
          const updatedBlocks = data.blocks.map(block => {
            if (block.block_type === "header") {
              const match = result.data.images.find(img => img.role === "header");
              if (match && match.source !== "fallback") {
                return { ...block, image_url: match.image_url };
              }
            } else if (block.block_type === "outtro") {
              // Backend trả role="intro" cho ảnh thứ 2
              const match = result.data.images.find(img => img.role === "intro");
              if (match && match.source !== "fallback") {
                return { ...block, image_url: match.image_url };
              }
            }
            return block;
          });
          setData(prev => ({ ...prev, blocks: updatedBlocks }));
        }
      } catch (err) {
        console.warn("Infographic images fetch lỗi:", err);
      } finally {
        if (!cancelled) setLoadingImages(false);
      }
    }

    fetchImages();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExportPNG = useCallback(async () => {
    if (!rendererRef.current || exporting) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(rendererRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export PNG failed:", err);
      alert("Lỗi khi xuất ảnh PNG.");
    } finally {
      setExporting(false);
    }
  }, [title, exporting]);

  const handleExportPDF = useCallback(async () => {
    if (!rendererRef.current || exporting) return;
    setExporting(true);
    try {
      await exportInfographicPDF(rendererRef.current, title);
    } catch (err) {
      console.error("Export PDF failed:", err);
      alert("Lỗi khi xuất file PDF.");
    } finally {
      setExporting(false);
    }
  }, [title, exporting]);

  return (
    <div className="infographic-screen">
      {/* Topbar */}
      <div className="infographic-screen__topbar">
        <button className="infographic-screen__back" onClick={() => navigate("/workspace")}>
          ← Quay lại
        </button>
        <div className="infographic-screen__title-group">
          <span className="infographic-screen__title">{title}</span>
          {isAIGenerated ? (
            <span className="infographic-screen__badge infographic-screen__badge--ai">🤖 AI Generated</span>
          ) : (
            <span className="infographic-screen__badge infographic-screen__badge--mock">📋 Mock Data</span>
          )}
          {loadingImages && (
            <span className="infographic-screen__badge infographic-screen__badge--loading">🖼️ Đang tải ảnh...</span>
          )}
        </div>
        <div className="infographic-screen__template-picker">
          {[
            { id: "template1", label: "Classic" },
            { id: "template2", label: "Museum" },
            { id: "template3", label: "Royal" },
          ].map(tpl => (
            <button
              key={tpl.id}
              className={`infographic-screen__tpl-btn ${selectedTemplate === tpl.id ? "infographic-screen__tpl-btn--active" : ""}`}
              onClick={() => setSelectedTemplate(tpl.id)}
            >
              {tpl.label}
            </button>
          ))}
        </div>
        <div className="infographic-screen__export-group">
          <button
            className="infographic-screen__export infographic-screen__export--outline"
            onClick={handleExportPDF}
            disabled={exporting || loadingImages}
          >
            {exporting ? "⏳ Đang xuất..." : "📄 Tải PDF"}
          </button>
          <button
            className="infographic-screen__export"
            onClick={handleExportPNG}
            disabled={exporting || loadingImages}
          >
            {exporting ? "⏳ Đang xuất..." : "📥 Tải PNG"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="infographic-screen__content">
        <InfographicRenderer blocks={data.blocks} rendererRef={rendererRef} template={selectedTemplate} />
      </div>
    </div>
  );
}

