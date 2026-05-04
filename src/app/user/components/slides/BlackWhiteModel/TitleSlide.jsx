import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Title/Cover Slide
 * Props: slide.title, slide.subtitle, slide.content (era/period)
 * Optional: imageUrl (main hero image)
 */
export default function TitleSlide({ slide, imageUrl }) {
  const hasImage = !!imageUrl;

  return (
    <div className="bw bw-title" style={!hasImage ? { justifyContent: "center" } : undefined}>
      <div className="bw-grid-bg" />
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      {/* Left — image (only if available) */}
      {hasImage && (
        <div className="bw-title__images">
          <div className="bw-img-circle bw-title__img-main">
            <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          </div>
        </div>
      )}

      {/* Right — title text */}
      <div className="bw-title__right" style={!hasImage ? { alignItems: "center", textAlign: "center", padding: "30px 60px" } : undefined}>
        <h1 className="bw-heading bw-heading--xl bw-heading--cream">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="bw-body bw-body--light" style={{ marginTop: 8, fontSize: "0.7rem" }}>
            {slide.subtitle}
          </p>
        )}
        {slide.content && (
          <div className="bw-title__presenter">
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
