export default function HeaderBlock({ data }) {
  const bgStyle = data.image_url
    ? { backgroundImage: `url(${data.image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <div className="ig3-block ig3-header">
      <div className="ig3-header__corner ig3-header__corner--tl" />
      <div className="ig3-header__corner ig3-header__corner--tr" />
      <div className="ig3-header__corner ig3-header__corner--bl" />
      <div className="ig3-header__corner ig3-header__corner--br" />

      {data.image_url && (
        <div className="ig3-header__bg" style={bgStyle}>
          <div className="ig3-header__overlay" />
        </div>
      )}
      <div className="ig3-header__content">
        {data.era && <span className="ig3-header__era">{data.era}</span>}
        <h1 className="ig3-header__title">{data.title}</h1>
        {data.subtitle && <p className="ig3-header__subtitle">{data.subtitle}</p>}
      </div>
    </div>
  );
}
