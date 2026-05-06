export default function FooterBlock({ data }) {
  const sources = data.sources || [];

  return (
    <div className="ig-block ig-footer">
      <div className="ig-ornament">⚜ ═══════════════ ⚜</div>
      {data.title && <h2 className="ig-section-title">{data.title}</h2>}
      {sources.length > 0 && (
        <div className="ig-footer__sources">
          <span className="ig-footer__label">Nguồn tham khảo:</span>
          <ul>
            {sources.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {data.credits && <p className="ig-footer__credits">{data.credits}</p>}
      <div className="ig-ornament" style={{ marginTop: 16 }}>☬ ─── ◆ ─── ☬</div>
    </div>
  );
}
