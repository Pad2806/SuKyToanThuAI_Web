import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Introduction Slide
 * Big image left half + cream text card right
 * No image → full width text centered
 * Props: slide.title, slide.content, imageUrl
 */
export default function IntroductionSlide({ slide, imageUrl }) {
  const hasImage = !!imageUrl;

  return (
    <div className="bw bw-intro">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      {/* Left — full image (only if available) */}
      {hasImage && (
        <div className="bw-intro__image-side">
          <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          <div className="bw-intro__title-overlay">
            <h2 className="bw-heading bw-heading--lg bw-heading--cream">
              {slide.title}
            </h2>
          </div>
        </div>
      )}

      {/* Right — text card (full width if no image) */}
      <div className="bw-intro__text-side" style={!hasImage ? { width: "100%", alignItems: "center", padding: "28px 48px" } : undefined}>
        {!hasImage && (
          <h2 className="bw-heading bw-heading--lg bw-heading--cream" style={{ marginBottom: 14, textAlign: "center" }}>
            {slide.title}
          </h2>
        )}
        <div className="bw-intro__text-card" style={!hasImage ? { maxWidth: 560 } : undefined}>
          <p>{slide.content}</p>
        </div>
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
