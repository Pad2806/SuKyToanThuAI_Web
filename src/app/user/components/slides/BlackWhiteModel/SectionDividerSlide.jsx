import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Section Divider Slide
 * Full dark gradient with centered title + diamond ornaments
 * Props: slide.title, slide.subtitle
 */
export default function SectionDividerSlide({ slide }) {
  return (
    <div className="bw bw-divider">
      <div className="bw-grid-bg" />
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      <div className="bw-diamond-divider">
        <div className="bw-diamond-divider__line" />
        <div className="bw-diamond-divider__dot" />
        <div className="bw-diamond-divider__line" />
      </div>

      <h2 className="bw-heading bw-heading--xl bw-heading--cream" style={{ margin: "12px 0 8px" }}>
        {slide.title}
      </h2>

      {slide.subtitle && (
        <p className="bw-body bw-body--light" style={{ fontStyle: "italic", fontSize: "0.7rem", color: "var(--bw-accent)" }}>
          {slide.subtitle}
        </p>
      )}

      <div className="bw-diamond-divider">
        <div className="bw-diamond-divider__line" />
        <div className="bw-diamond-divider__dot" />
        <div className="bw-diamond-divider__line" />
      </div>

      <div className="bw-ornament-border bw-ornament-border--bottom">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>
      <div className="bw-footer" style={{ color: "rgba(245,240,232,0.3)" }}>
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
