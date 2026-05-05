import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Introduction Slide
 * Image left + warm text card right on parchment bg
 * No image → full width text centered
 * Props: slide.title, slide.content, imageUrl
 */
export default function IntroductionSlide({ slide, imageUrl }) {
  const hasImage = !!imageUrl;

  return (
    <div className="ve ve-intro">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      {/* Left — full image (only if available) */}
      {hasImage && (
        <div className="ve-intro__image-side">
          <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          <div className="ve-intro__title-overlay">
            <h2 className="ve-heading ve-heading--lg">
              {slide.title}
            </h2>
          </div>
        </div>
      )}

      {/* Right — text card (full width if no image) */}
      <div className="ve-intro__text-side" style={!hasImage ? { width: "100%", alignItems: "center", padding: "28px 48px" } : undefined}>
        {!hasImage && (
          <h2 className="ve-heading ve-heading--lg" style={{ marginBottom: 14, textAlign: "center" }}>
            {slide.title}
          </h2>
        )}
        <div className="ve-intro__text-card" style={!hasImage ? { maxWidth: 560 } : undefined}>
          <p>{slide.content}</p>
        </div>
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
