export default function TimelineBlock({ data }) {
  const events = data.events || [];

  return (
    <div className="ig2-block ig2-timeline">
      {data.title && <h2 className="ig2-section-title">{data.title}</h2>}
      <div className="ig2-timeline__track">
        {events.map((ev, i) => (
          <div key={i} className="ig2-timeline__item">
            <div className="ig2-timeline__marker" />
            <div className="ig2-timeline__content">
              <span className="ig2-timeline__year">{ev.year}</span>
              <h3 className="ig2-timeline__event-title">{ev.title}</h3>
              <p className="ig2-timeline__desc">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
