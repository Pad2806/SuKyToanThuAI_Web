import { FaBook } from "react-icons/fa";

/**
 * BlackWhiteModel — Timeline Slide
 * Vertical timeline with diamond dots
 * Props: slide.title, slide.events[{year, place, text}]
 */
export default function TimelineSlide({ slide }) {
  const events = slide.events || [];

  return (
    <div className="bw bw-timeline">
      <div className="bw-ornament-border bw-ornament-border--top">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>

      <div className="bw-timeline__title">
        <h2 className="bw-heading bw-heading--lg bw-heading--cream">
          {slide.title}
        </h2>
        <div className="bw-diamond-divider">
          <div className="bw-diamond-divider__line" />
          <div className="bw-diamond-divider__dot" />
          <div className="bw-diamond-divider__line" />
        </div>
      </div>

      <div className="bw-timeline__events">
        {events.map((ev, i) => (
          <div key={i} className="bw-timeline__event">
            <div className="bw-timeline__event-dot" />
            {ev.year && (
              <span className="bw-timeline__event-year">{ev.year}</span>
            )}
            <div className="bw-timeline__event-content">
              {ev.place && (
                <p className="bw-timeline__event-place">{ev.place}</p>
              )}
              <p className="bw-timeline__event-text">{ev.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bw-ornament-border bw-ornament-border--bottom">
        <div className="bw-ornament-border__line" />
        <div className="bw-ornament-border__diamond" />
        <div className="bw-ornament-border__line" />
      </div>
      <div className="bw-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
