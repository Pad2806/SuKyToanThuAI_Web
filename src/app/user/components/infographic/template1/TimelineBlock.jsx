export default function TimelineBlock({ data }) {
  const events = data.events || [];
  const imageUrl = data.image_url || null;

  return (
    <div className="ig-block ig-timeline">
      <div className="ig-ornament">⚜ ═══════════════ ⚜</div>
      {data.title && <h2 className="ig-section-title">{data.title}</h2>}

      <div className="ig-timeline__layout">
        <div className="ig-timeline__track">
          {events.map((ev, i) => (
            <div key={i} className="ig-timeline__item">
              <div className="ig-timeline__dot" />
              <div className="ig-timeline__content">
                <span className="ig-timeline__year">{ev.year}</span>
                <h3 className="ig-timeline__event-title">{ev.title}</h3>
                <p className="ig-timeline__desc">{ev.description}</p>
              </div>
            </div>
          ))}
        </div>

        {imageUrl && (
          <div className="ig-timeline__image">
            <img src={imageUrl} alt={data.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
          </div>
        )}
      </div>
    </div>
  );
}
