import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Title/Cover Slide
 * Parchment bg with ornate corner flourishes, centered title
 * Props: slide.title, slide.subtitle, slide.content (era/period)
 * Optional: imageUrl (main hero image)
 */
export default function TitleSlide({ slide, imageUrl }) {
  const hasImage = !!imageUrl;

  return (
    <div className="ve ve-title" style={!hasImage ? { justifyContent: "center" } : undefined}>
      {/* Corner flourishes */}
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />

      {/* Ornamental border frame */}
      <div className="ve-frame" />

      {/* Left — image (only if available) */}
      {hasImage && (
        <div className="ve-title__images">
          <div className="ve-img-ornate ve-title__img-main">
            <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          </div>
        </div>
      )}

      {/* Right — title text */}
      <div className="ve-title__right" style={!hasImage ? { alignItems: "center", textAlign: "center", padding: "30px 60px" } : undefined}>
        <h1 className="ve-heading ve-heading--xl">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="ve-body ve-body--subtitle" style={{ marginTop: 8 }}>
            {slide.subtitle}
          </p>
        )}
        {slide.content && (
          <div className="ve-title__presenter">
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
