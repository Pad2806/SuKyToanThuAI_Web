import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Ending / Thank You Slide
 * Props: slide.title, slide.subtitle, slide.content, imageUrl
 */
export default function EndingSlide({ slide, imageUrl }) {
  const hasImage = !!imageUrl;

  return (
    <div className="ve ve-ending" style={!hasImage ? { justifyContent: "center" } : undefined}>
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      {hasImage && (
        <div className="ve-ending__images">
          <div className="ve-img-ornate" style={{ width: 110, height: 130 }}>
            <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          </div>
        </div>
      )}

      <div className="ve-ending__right" style={!hasImage ? { alignItems: "center", textAlign: "center", padding: "30px 60px" } : undefined}>
        <h1 className="ve-heading ve-heading--xl">
          {slide.title || "Cảm ơn"}
        </h1>
        {slide.subtitle && (
          <p className="ve-body" style={{ marginTop: 6, fontSize: "0.65rem" }}>{slide.subtitle}</p>
        )}
        {slide.content && (
          <div className="ve-title__presenter" style={{ marginTop: 14 }}>
            <div className="ve-flourish-sm" />
            <span>{slide.content}</span>
            <div className="ve-flourish-sm" />
          </div>
        )}
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
