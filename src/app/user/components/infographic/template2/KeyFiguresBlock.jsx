export default function KeyFiguresBlock({ data }) {
  const figures = data.figures || [];
  return (
    <div className="ig2-block ig2-figures">
      {data.title && <h2 className="ig2-section-title">{data.title}</h2>}
      <div className="ig2-figures__grid">
        {figures.map((fig, i) => (
          <div key={i} className="ig2-figures__card">
            <div className="ig2-figures__avatar">
              {fig.image_url ? (
                <img src={fig.image_url} alt={fig.name} onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <span className="ig2-figures__initial">{fig.name?.[0]}</span>
              )}
            </div>
            <h4 className="ig2-figures__name">{fig.name}</h4>
            <p className="ig2-figures__role">{fig.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
