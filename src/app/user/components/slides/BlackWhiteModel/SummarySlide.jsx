import { FaStar, FaFlag, FaGavel, FaUsers, FaBook } from "react-icons/fa";

const ICONS = [FaStar, FaFlag, FaGavel, FaUsers];

/**
 * BlackWhiteModel — Summary Slide
 * Dark bg with summary cards
 * Props: slide.title, slide.subtitle, slide.content,
 *        slide.bullets[], slide.footer_text
 */
export default function SummarySlide({ slide }) {
  const bullets = slide.bullets || [];

  return (
    <div className="bw bw-summary">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      <div className="bw-summary__title">
        <h2 className="bw-heading bw-heading--lg bw-heading--cream">
          {slide.title}
        </h2>
      </div>

      {(slide.subtitle || slide.content) && (
        <p className="bw-summary__subtitle">
          {slide.subtitle || slide.content}
        </p>
      )}

      <div className="bw-diamond-divider">
        <div className="bw-diamond-divider__line" />
        <div className="bw-diamond-divider__dot" />
        <div className="bw-diamond-divider__line" />
      </div>

      <div className="bw-summary__cards">
        {bullets.slice(0, 3).map((b, i) => {
          const IconComp = ICONS[i % ICONS.length];
          return (
            <div key={i} className="bw-summary__card">
              <div className="bw-summary__card-icon"><IconComp size={18} /></div>
              <p className="bw-summary__card-text">{b}</p>
            </div>
          );
        })}
      </div>

      {slide.footer_text && (
        <p className="bw-summary__footer-text">{slide.footer_text}</p>
      )}

      <div className="bw-ornament-border bw-ornament-border--bottom">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>
      <div className="bw-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
