export default function KeyFiguresBlock({ data }) {
  const figures = data.figures || [];
  return (
    <div className="ig3-block ig3-figures">
      {data.title && <h2 className="ig3-section-title">{data.title}</h2>}
      <div className="ig3-figures__grid">
        {figures.map((fig, i) => (
          <div key={i} className="ig3-figures__card">
            <div className="ig3-figures__avatar">
              {fig.image_url ? (
                <img src={fig.image_url} alt={fig.name} onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <span className="ig3-figures__initial">{fig.name?.[0]}</span>
              )}
            </div>
            <h4 className="ig3-figures__name">{fig.name}</h4>
            <p className="ig3-figures__role">{fig.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
