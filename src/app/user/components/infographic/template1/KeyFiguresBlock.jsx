export default function KeyFiguresBlock({ data }) {
  const figures = data.figures || [];

  return (
    <div className="ig-block ig-figures">
      <div className="ig-ornament">⚔ ═══════════════ ⚔</div>
      {data.title && <h2 className="ig-section-title">{data.title}</h2>}
      <div className="ig-figures__grid">
        {figures.map((fig, i) => (
          <div key={i} className="ig-figures__card">
            <div className="ig-figures__avatar">
              {fig.image_url ? (
                <img src={fig.image_url} alt={fig.name} onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <span className="ig-figures__initial">{fig.name?.[0]}</span>
              )}
            </div>
            <h4 className="ig-figures__name">{fig.name}</h4>
            <p className="ig-figures__role">{fig.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
