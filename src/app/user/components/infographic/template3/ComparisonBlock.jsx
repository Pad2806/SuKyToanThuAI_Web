export default function ComparisonBlock({ data }) {
  return (
    <div className="ig3-block ig3-comparison">
      {data.title && <h2 className="ig3-section-title">{data.title}</h2>}
      <div className="ig3-comparison__columns">
        <div className="ig3-comparison__col">
          <h3 className="ig3-comparison__heading">{data.left?.heading}</h3>
          <ul className="ig3-comparison__list">
            {(data.left?.items || []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="ig3-comparison__vs">⚔</div>
        <div className="ig3-comparison__col">
          <h3 className="ig3-comparison__heading">{data.right?.heading}</h3>
          <ul className="ig3-comparison__list">
            {(data.right?.items || []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
