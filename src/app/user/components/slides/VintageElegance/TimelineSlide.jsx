import { FaBook } from "react-icons/fa";

/**
 * VintageElegance — Timeline Slide
 * Vertical timeline with ornate dots on parchment
 * Props: slide.title, slide.events[{year, place, text}]
 */
export default function TimelineSlide({ slide }) {
  const events = slide.events || [];

  return (
    <div className="ve ve-timeline">
      <div className="ve-corner ve-corner--tl" />
      <div className="ve-corner ve-corner--tr" />
      <div className="ve-corner ve-corner--bl" />
      <div className="ve-corner ve-corner--br" />
      <div className="ve-frame" />

      <div className="ve-timeline__title">
        <h2 className="ve-heading ve-heading--lg">
          {slide.title}
        </h2>
        <div className="ve-ornate-divider">
          <div className="ve-ornate-divider__line" />
          <div className="ve-ornate-divider__flourish">✦</div>
          <div className="ve-ornate-divider__line" />
        </div>
      </div>

      <div className="ve-timeline__events">
        {events.map((ev, i) => (
          <div key={i} className="ve-timeline__event">
            <div className="ve-timeline__event-dot">◆</div>
            {ev.year && (
              <span className="ve-timeline__event-year">{ev.year}</span>
            )}
            <div className="ve-timeline__event-content">
              {ev.place && (
                <p className="ve-timeline__event-place">{ev.place}</p>
              )}
              <p className="ve-timeline__event-text">{ev.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ve-footer"><FaBook size={7} /> SuKyToanThu AI</div>
    </div>
  );
}
