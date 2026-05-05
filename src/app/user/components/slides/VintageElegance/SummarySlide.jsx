import { FaStar, FaFlag, FaGavel, FaUsers, FaBook } from "react-icons/fa";

const ICONS = [FaStar, FaFlag, FaGavel, FaUsers];

/**
 * VintageElegance — Summary Slide
 * Props: slide.title, slide.subtitle, slide.content, slide.bullets[], slide.footer_text
 */
export default function SummarySlide({ slide }) {
  const bullets = slide.bullets || [];

  return (
    <div className="ve ve-summary">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      <div className="ve-summary__title">
        <h2 className="ve-heading ve-heading--lg">{slide.title}</h2>
      </div>

      {(slide.subtitle || slide.content) && (
        <p className="ve-summary__subtitle">{slide.subtitle || slide.content}</p>
      )}

      <div className="ve-ornate-divider">
        <div className="ve-ornate-divider__line" />
        <div className="ve-ornate-divider__flourish">✦</div>
        <div className="ve-ornate-divider__line" />
      </div>

      <div className="ve-summary__cards">
        {bullets.slice(0, 3).map((b, i) => {
          const IconComp = ICONS[i % ICONS.length];
          return (
            <div key={i} className="ve-summary__card">
              <div className="ve-summary__card-icon"><IconComp size={18} /></div>
              <p className="ve-summary__card-text">{b}</p>
            </div>
          );
        })}
      </div>

      {slide.footer_text && (
        <p className="ve-summary__footer-text">{slide.footer_text}</p>
      )}

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
