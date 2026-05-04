import { FaStar, FaFlag, FaGavel, FaBook, FaUsers } from "react-icons/fa";

const ICONS = [FaStar, FaFlag, FaGavel, FaUsers];

export default function SummarySlide({ slide }) {
  const bullets = slide.bullets || [];

  return (
    <div className="s s-summary">
      <h2 className="s-summary__title">{slide.title}</h2>
      {slide.subtitle && (
        <p className="s-summary__subtitle">{slide.subtitle}</p>
      )}
      {slide.content && (
        <p className="s-summary__subtitle">{slide.content}</p>
      )}

      <div className="s-summary__cards">
        {bullets.slice(0, 3).map((b, i) => {
          const IconComp = ICONS[i % ICONS.length];
          return (
            <div key={i} className="s-summary__card">
              <div className="s-summary__card-icon"><IconComp size={18} /></div>
              <p className="s-summary__card-text">{b}</p>
            </div>
          );
        })}
      </div>

      {slide.footer_text && (
        <p className="s-summary__footer-text">{slide.footer_text}</p>
      )}

      <div className="s-footer">
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
