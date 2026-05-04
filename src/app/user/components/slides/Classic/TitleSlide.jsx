import { FaBook, FaCalendarAlt } from "react-icons/fa";

export default function TitleSlide({ slide }) {
  return (
    <div className="s s-title">
      <h1 className="s-title__h1">{slide.title}</h1>
      {slide.subtitle && <p className="s-title__sub">{slide.subtitle}</p>}
      <div className="s-title__divider" />
      {slide.content && (
        <div className="s-title__era">
          <FaCalendarAlt size={11} /> {slide.content}
        </div>
      )}
      <div className="s-title__footer">
        <FaBook size={8} /> SuKyToanThu AI
      </div>
    </div>
  );
}
