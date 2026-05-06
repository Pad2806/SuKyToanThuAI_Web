export default function StatsBlock({ data }) {
  const items = data.items || [];
  return (
    <div className="ig2-block ig2-stats">
      {data.title && <h2 className="ig2-section-title">{data.title}</h2>}
      <div className="ig2-stats__grid">
        {items.map((item, i) => (
          <div key={i} className="ig2-stats__card">
            {item.icon && <span className="ig2-stats__icon">{item.icon}</span>}
            <span className="ig2-stats__value">{item.value}</span>
            <span className="ig2-stats__label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
