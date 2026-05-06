export default function ComparisonBlock({ data }) {
  const imageUrl = data.image_url || null;

  return (
    <div className="ig-block ig-comparison">
      <div className="ig-ornament">⚜ ─── ◆ ─── ⚜</div>
      {data.title && <h2 className="ig-section-title">{data.title}</h2>}

      {imageUrl && (
        <div className="ig-block__image-frame ig-block__image-frame--banner">
          <img src={imageUrl} alt={data.title} onError={e => { e.target.parentElement.style.display = "none"; }} />
        </div>
      )}

      <div className="ig-comparison__columns">
        <div className="ig-comparison__col ig-comparison__col--left">
          <h3 className="ig-comparison__heading">{data.left?.heading}</h3>
          <ul className="ig-comparison__list">
            {(data.left?.items || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="ig-comparison__divider">
          <span className="ig-comparison__vs">VS</span>
        </div>
        <div className="ig-comparison__col ig-comparison__col--right">
          <h3 className="ig-comparison__heading">{data.right?.heading}</h3>
          <ul className="ig-comparison__list">
            {(data.right?.items || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
