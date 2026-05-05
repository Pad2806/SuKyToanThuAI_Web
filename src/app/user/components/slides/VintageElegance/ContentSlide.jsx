import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Content Slide (numbered list)
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
      <div className="ve" style={{ display: "flex", flexDirection: "column", padding: "28px 36px" }}>
        <div className="ve-corner ve-corner--tl" />
        <div className="ve-corner ve-corner--tr" />
        <div className="ve-corner ve-corner--bl" />
        <div className="ve-corner ve-corner--br" />
        <div className="ve-frame" />

        <h2 className="ve-heading ve-heading--lg" style={{ marginBottom: 12, textAlign: "center" }}>
          {slide.title}
        </h2>
        <div className="ve-ornate-divider">
          <div className="ve-ornate-divider__line" />
          <div className="ve-ornate-divider__flourish">✦</div>
          <div className="ve-ornate-divider__line" />
        </div>

        <div className="ve-panel" style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
          {slide.content && (
            <p className="ve-body" style={{ marginBottom: 12 }}>{slide.content}</p>
          )}
          {bullets.length > 0 && (
            <div className="ve-numbered-list">
              {bullets.map((b, i) => (
                <div key={i} className="ve-numbered-item">
                  <span className="ve-numbered-item__num">{i + 1}.</span>
                  <span className="ve-numbered-item__text">{b}</span>
                  <div className="ve-numbered-item__dot">◆</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
      </div>
    );
  }

  return (
    <div className="ve ve-content">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      {/* Left — background image + ornate frame image + title */}
      <div className="ve-content__left">
        <div className="ve-bg-image">
          <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(139,115,85,0.45)" }} />
        </div>
        <div className="ve-content__left-images">
          <div className="ve-img-ornate ve-content__left-img-lg">
            <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          </div>
        </div>
        <div className="ve-content__left-title">
          <h2 className="ve-heading ve-heading--lg" style={{ textAlign: "center", color: "#f5f0e8" }}>
            {slide.title}
          </h2>
        </div>
      </div>

      {/* Right — numbered list panel */}
      <div className="ve-content__right">
        <div className="ve-panel">
          {slide.content && (
            <p className="ve-body" style={{ marginBottom: 12 }}>{slide.content}</p>
          )}
          {bullets.length > 0 && (
            <div className="ve-numbered-list">
              {bullets.map((b, i) => (
                <div key={i} className="ve-numbered-item">
                  <span className="ve-numbered-item__num">{i + 1}.</span>
                  <span className="ve-numbered-item__text">{b}</span>
                  <div className="ve-numbered-item__dot">◆</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
