import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Content Slide (numbered list)
 * Image + title left + numbered bullet panel right
 * No image → full width layout with title on top
 * Props: slide.title, slide.content, slide.bullets[], imageUrl
 */
export default function ContentSlide({ slide, imageUrl }) {
  const bullets = slide.bullets || [];
  const hasImage = !!imageUrl;

  // No image → single column centered layout
  if (!hasImage) {
    return (
      <div className="bw" style={{ display: "flex", flexDirection: "column", padding: "28px 36px" }}>
        <div className="bw-ornament-border bw-ornament-border--top">
          <div className="bw-ornament-border__line" />
          <div className="bw-ornament-border__diamond" />
          <div className="bw-ornament-border__line" />
        </div>

        <h2 className="bw-heading bw-heading--lg bw-heading--cream" style={{ marginBottom: 12, textAlign: "center" }}>
          {slide.title}
        </h2>
        <div className="bw-diamond-divider">
          <div className="bw-diamond-divider__line" />
          <div className="bw-diamond-divider__dot" />
          <div className="bw-diamond-divider__line" />
        </div>

        <div className="bw-panel" style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
          {slide.content && (
            <p className="bw-body" style={{ marginBottom: 12 }}>{slide.content}</p>
          )}
          {bullets.length > 0 && (
            <div className="bw-numbered-list">
              {bullets.map((b, i) => (
                <div key={i} className="bw-numbered-item">
                  <span className="bw-numbered-item__num">{i + 1}.</span>
                  <span className="bw-numbered-item__text">{b}</span>
                  <div className="bw-numbered-item__diamond" />
                </div>
              ))}
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

  return (
    <div className="bw bw-content">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      {/* Left — background image + circle image + title */}
      <div className="bw-content__left">
        <div className="bw-bg-image">
          <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
        </div>
        <div className="bw-content__left-images">
          <div className="bw-img-circle bw-content__left-img-lg">
            <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          </div>
        </div>
        <div className="bw-content__left-title">
          <h2 className="bw-heading bw-heading--lg bw-heading--cream" style={{ textAlign: "center" }}>
            {slide.title}
          </h2>
        </div>
      </div>

      {/* Right — numbered list panel */}
      <div className="bw-content__right">
        <div className="bw-panel">
          {slide.content && (
            <p className="bw-body" style={{ marginBottom: 12 }}>{slide.content}</p>
          )}
          {bullets.length > 0 && (
            <div className="bw-numbered-list">
              {bullets.map((b, i) => (
                <div key={i} className="bw-numbered-item">
                  <span className="bw-numbered-item__num">{i + 1}.</span>
                  <span className="bw-numbered-item__text">{b}</span>
                  <div className="bw-numbered-item__diamond" />
                </div>
              ))}
            </div>
          )}
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
