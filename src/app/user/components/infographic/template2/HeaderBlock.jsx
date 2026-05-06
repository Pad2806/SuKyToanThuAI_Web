export default function HeaderBlock({ data }) {
  const bgStyle = data.image_url
    ? { backgroundImage: `url(${data.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <div className="ig2-block ig2-header">
      <div className="ig2-header__torn-edge" />
      {data.image_url && (
        <div className="ig2-header__bg" style={bgStyle}>
          <div className="ig2-header__overlay" />
        </div>
      )}
      <div className="ig2-header__content">
        {data.era && <span className="ig2-header__era">{data.era}</span>}
        <h1 className="ig2-header__title">{data.title}</h1>
        {data.subtitle && <p className="ig2-header__subtitle">{data.subtitle}</p>}
      </div>
    </div>
  );
}
