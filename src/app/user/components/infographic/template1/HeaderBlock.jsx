export default function HeaderBlock({ data }) {
  const bgStyle = data.image_url
    ? { backgroundImage: `url(${data.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <div className="ig-block ig-header">
      {data.image_url && (
        <div className="ig-header__bg" style={bgStyle}>
          <div className="ig-header__overlay" />
        </div>
      )}
      <div className="ig-header__content">
        <div className="ig-header__ornament-top">⚜ ═══ ◆ ═══ ⚜</div>
        {data.era && <span className="ig-header__era">{data.era}</span>}
        <h1 className="ig-header__title">{data.title}</h1>
        {data.subtitle && <p className="ig-header__subtitle">{data.subtitle}</p>}
        <div className="ig-header__ornament-bottom">⚜ ═══ ◆ ═══ ⚜</div>
      </div>
    </div>
  );
}
