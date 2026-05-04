import { FaBook } from "react-icons/fa";

export default function SectionDividerSlide({ slide }) {
  return (
    <div className="s s-divider">
      <div className="s-divider__line" />
      <h2 className="s-divider__title">{slide.title}</h2>
      {slide.subtitle && (
        <p className="s-divider__subtitle">{slide.subtitle}</p>
      )}
      <div className="s-divider__line" />

      <div className="s-footer" style={{ color: "rgba(245,240,232,0.3)" }}>
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
