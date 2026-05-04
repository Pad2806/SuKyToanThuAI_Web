import { FaCrown, FaSkull, FaShieldAlt, FaFire, FaStar, FaFlag, FaGavel, FaChessRook, FaBook } from "react-icons/fa";

const ICONS = [FaCrown, FaSkull, FaShieldAlt, FaFire, FaStar, FaFlag, FaGavel, FaChessRook];

export default function ContentSlide({ slide, imageUrl }) {
  const bullets = slide.bullets || [];

  return (
    <div className="s s-content">
      <div className="s-content__text">
        <div className="s-heading">
          <div className="s-heading__bar" />
          <h2 className="s-heading__text">{slide.title}</h2>
        </div>

        {slide.content && (
          <p className="s-content__desc">{slide.content}</p>
        )}

        {bullets.length > 0 && (
          <div className="s-bullets">
            {bullets.map((b, i) => {
              const IconComp = ICONS[i % ICONS.length];
              const parts = typeof b === "string" ? b.split(":") : [b];
              const hasLabel = parts.length > 1;
              return (
                <div key={i} className="s-bullet">
                  <span className="s-bullet__icon"><IconComp size={12} /></span>
                  <span>
                    {hasLabel && <span className="s-bullet__label">{parts[0].trim()}:</span>}
                    <span className="s-bullet__desc">{hasLabel ? parts.slice(1).join(":").trim() : parts[0]}</span>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {slide.chart_data && (
          <div className="s-barchart">
            {slide.chart_data.map((item, i) => (
              <div key={i} className="s-barchart__item">
                <span className="s-barchart__label">{item.label}</span>
                <div className="s-barchart__bar-wrap">
                  <div className="s-barchart__bar" style={{ width: `${item.percent}%` }} />
                </div>
                <span className="s-barchart__value">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="s-content__media">
        {imageUrl ? (
          <div className="s-img-frame s-img-frame--tall">
            <img src={imageUrl} alt={slide.title} onError={e => { e.target.parentElement.style.display = 'none'; }} />
            <div className="s-img-caption">
              <FaBook size={8} /> Wikimedia Commons
            </div>
          </div>
        ) : (
          <div className="s-img-empty s-img-frame--tall">
            <span className="s-img-empty__icon"><FaBook size={24} /></span>
            <span>Minh họa</span>
          </div>
        )}
      </div>

      <div className="s-footer">
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
