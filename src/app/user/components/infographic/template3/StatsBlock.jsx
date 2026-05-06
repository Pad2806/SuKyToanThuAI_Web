export default function StatsBlock({ data }) {
  const items = data.items || [];
  return (
    <div className="ig3-block ig3-stats">
      {data.title && <h2 className="ig3-section-title">{data.title}</h2>}
      <div className="ig3-stats__grid">
        {items.map((item, i) => (
          <div key={i} className="ig3-stats__card">
            {item.icon && <span className="ig3-stats__icon">{item.icon}</span>}
            <span className="ig3-stats__value">{item.value}</span>
            <span className="ig3-stats__label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
