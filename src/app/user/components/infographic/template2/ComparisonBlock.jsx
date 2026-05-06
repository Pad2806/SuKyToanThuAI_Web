export default function ComparisonBlock({ data }) {
  return (
    <div className="ig2-block ig2-comparison">
      {data.title && <h2 className="ig2-section-title">{data.title}</h2>}
      <div className="ig2-comparison__columns">
        <div className="ig2-comparison__col">
          <h3 className="ig2-comparison__heading">{data.left?.heading}</h3>
          <ul className="ig2-comparison__list">
            {(data.left?.items || []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="ig2-comparison__divider" />
        <div className="ig2-comparison__col">
          <h3 className="ig2-comparison__heading">{data.right?.heading}</h3>
          <ul className="ig2-comparison__list">
            {(data.right?.items || []).map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
