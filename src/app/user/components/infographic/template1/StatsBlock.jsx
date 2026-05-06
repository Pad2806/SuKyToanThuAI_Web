export default function StatsBlock({ data }) {
  const items = data.items || [];
  const imageUrl = data.image_url || null;

  return (
    <div className="ig-block ig-stats">
      <div className="ig-ornament">☬ ─── ◆ ─── ☬</div>
      {data.title && <h2 className="ig-section-title">{data.title}</h2>}
      <div className="ig-stats__grid">
        {items.map((item, i) => (
          <div key={i} className="ig-stats__card">
            {item.icon && <span className="ig-stats__icon">{item.icon}</span>}
            <span className="ig-stats__value">{item.value}</span>
            <span className="ig-stats__label">{item.label}</span>
          </div>
        ))}
      </div>

      {imageUrl && (
        <div className="ig-block__image-frame ig-block__image-frame--wide">
          <img src={imageUrl} alt={data.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
        </div>
      )}
    </div>
  );
}
