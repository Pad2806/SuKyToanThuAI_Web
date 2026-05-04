import { FaCrown, FaSkull, FaShieldAlt, FaFire, FaStar, FaFlag, FaGavel, FaChessRook, FaBook } from "react-icons/fa";

const ICON_MAP = {
  crown: FaCrown,
  skull: FaSkull,
  shield: FaShieldAlt,
  fire: FaFire,
  star: FaStar,
  flag: FaFlag,
  gavel: FaGavel,
  chess: FaChessRook,
};

const DEFAULT_ICONS = [FaCrown, FaSkull, FaShieldAlt, FaFire, FaStar, FaFlag];

export default function TwoColumnSlide({ slide }) {
  const columns = slide.columns || [];

  return (
    <div className="s s-twocol">
      <div className="s-heading">
        <div className="s-heading__bar" />
        <h2 className="s-heading__text">{slide.title}</h2>
      </div>

      <div className="s-twocol__cards">
        {columns.map((col, i) => {
          const IconComp = (col.icon_name && ICON_MAP[col.icon_name]) || DEFAULT_ICONS[i % DEFAULT_ICONS.length];
          return (
            <div key={i} className="s-twocol__card">
              <div className="s-twocol__icon"><IconComp size={28} /></div>
              <h3>{col.heading}</h3>
              <p className="s-twocol__text">{col.text}</p>
            </div>
          );
        })}
      </div>

      <div className="s-footer">
        <FaBook size={7} /> SuKyToanThu AI
      </div>
    </div>
  );
}
