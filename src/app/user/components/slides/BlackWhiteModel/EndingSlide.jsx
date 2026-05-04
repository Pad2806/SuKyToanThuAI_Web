import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Ending / Thank You Slide
 * Image collage left + big text right
 * No image → centered layout
 * Props: slide.title, slide.subtitle, slide.content, imageUrl
 */
export default function EndingSlide({ slide, imageUrl }) {
  const hasImage = !!imageUrl;

  return (
    <div className="bw bw-ending" style={!hasImage ? { justifyContent: "center" } : undefined}>
      <div className="bw-grid-bg" />
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      {/* Left — image collage (only if available) */}
      {hasImage && (
        <div className="bw-ending__images">
          <div className="bw-img-circle" style={{ width: 100, height: 100 }}>
            <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          </div>
          <div className="bw-img-arch" style={{ width: 110, height: 130 }}>
            <img src={imageUrl} alt="" onError={e => { e.target.parentElement.style.display = "none"; }} />
          </div>
        </div>
      )}

      {/* Right — big title */}
      <div className="bw-ending__right" style={!hasImage ? { alignItems: "center", textAlign: "center", padding: "30px 60px" } : undefined}>
        <h1 className="bw-heading bw-heading--xl bw-heading--cream">
          {slide.title || "Cảm ơn"}
        </h1>
        {slide.subtitle && (
          <p className="bw-body bw-body--light" style={{ marginTop: 6, fontSize: "0.65rem" }}>
            {slide.subtitle}
          </p>
        )}
        {slide.content && (
          <div className="bw-title__presenter" style={{ marginTop: 14 }}>
            <div className="bw-title__presenter-diamond" />
            <span>{slide.content}</span>
            <div className="bw-title__presenter-diamond" />
          </div>
        )}
      </div>

      <div className="bw-ornament-border bw-ornament-border--bottom">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>
      <div className="bw-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
