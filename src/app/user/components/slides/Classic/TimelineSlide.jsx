import { FaMapMarkerAlt, FaChessRook, FaFlag, FaFire, FaStar, FaBook } from "react-icons/fa";

const ICONS = [FaMapMarkerAlt, FaChessRook, FaFlag, FaFire, FaStar];

export default function TimelineSlide({ slide }) {
  const events = slide.events || [];

  return (
    <div className="s s-timeline">
      <div className="s-heading">
        <div className="s-heading__bar" />
        <h2 className="s-heading__text">{slide.title}</h2>
      </div>

      <div className="s-timeline__cards">
        {events.map((ev, i) => {
          const IconComp = ICONS[i % ICONS.length];
          return (
            <div key={i} className="s-timeline__card">
              <div className="s-timeline__card-icon">
                <IconComp size={16} />
              </div>
              {ev.place && (
                <div className="s-timeline__card-place">{ev.place}</div>
              )}
              {ev.year && (
                <div className="s-timeline__card-year">{ev.year}</div>
              )}
              <p className="s-timeline__card-text">{ev.text}</p>
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
