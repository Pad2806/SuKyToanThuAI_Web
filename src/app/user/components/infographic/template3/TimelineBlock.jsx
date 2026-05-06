export default function TimelineBlock({ data }) {
  const events = data.events || [];

  return (
    <div className="ig3-block ig3-timeline">
      {data.title && <h2 className="ig3-section-title">{data.title}</h2>}
      <div className="ig3-timeline__track">
        {events.map((ev, i) => (
          <div key={i} className={`ig3-timeline__item ${i % 2 === 0 ? "ig3-timeline__item--left" : "ig3-timeline__item--right"}`}>
            <div className="ig3-timeline__year">{ev.year}</div>
            <div className="ig3-timeline__card">
              <h3 className="ig3-timeline__event-title">{ev.title}</h3>
              <p className="ig3-timeline__desc">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
