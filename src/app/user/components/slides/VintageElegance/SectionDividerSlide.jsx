import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Section Divider Slide
 * Props: slide.title, slide.subtitle
 */
export default function SectionDividerSlide({ slide }) {
  return (
    <div className="ve ve-divider">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      <div className="ve-ornate-divider">
        <div className="ve-ornate-divider__line" />
        <div className="ve-ornate-divider__flourish">✦</div>
        <div className="ve-ornate-divider__line" />
      </div>

      <h2 className="ve-heading ve-heading--xl" style={{ margin: "12px 0 8px" }}>
        {slide.title}
      </h2>

      {slide.subtitle && (
        <p className="ve-body" style={{ fontStyle: "italic", fontSize: "0.7rem" }}>
          {slide.subtitle}
        </p>
      )}

      <div className="ve-ornate-divider">
        <div className="ve-ornate-divider__line" />
        <div className="ve-ornate-divider__flourish">✦</div>
        <div className="ve-ornate-divider__line" />
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
